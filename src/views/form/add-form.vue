<template>
  <div>
    <el-form inline>
      <el-form-item label="表单分组" required>
        <el-select v-model="formData.categoryId">
          <template v-for="type in typeTree">
            <el-option :key="type.value" :value="type.value" :label="type.label"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="表单名称" required>
        <el-input v-model="formData.name" placeholder="请输入表单名称" />
      </el-form-item>
      <el-form-item label="表单状态" required>
        <el-select v-model="formData.enable">
          <el-option :value="1" label="启用"></el-option>
          <el-option :value="2" label="禁用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表单描述">
        <el-input v-model="formData.description" placeholder="请输入表单名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="save()">保存</el-button>
        <el-button @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
    <div class="form-making">
      <fm-making-form
        ref="dragForm"
        :data="jsonData"
        preview
        generate-code
        generate-json
        clearable
        :down-load-action="downLoadAction"
        :action="action"
      />
    </div>
    <!-- <fm-generate-form ref="generateForm" :data="jsonData" /> -->
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-23 16:36:51
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-08-20 14:25:29
 */
import { formApi } from '@/views/form/api/form'
import formMakingConfig from './config/form-making-config'
import _ from 'lodash'
export default {
  name: 'FormListAdd',
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      downLoadAction: `/cim6d-file-storage${process.env.VUE_APP_BASE_API}/noToken/file/commonFile/download/`,
      action: `/cim6d-file-storage${process.env.VUE_APP_BASE_API}/noToken/file/commonFile/visitor/upload/drag-form`,
      // 分组树
      typeTree: [],
      // 表单提交数据
      formData: {
        name: '',
        categoryId: '',
        template: '',
        templateId: '',
        enable: 1,
        description: ''
      },
      formDataBack: {},
      isLoading: false, // 防止多次提交
      formMakingConfig,
      jsonData: {}
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init()
  },
  // 方法集合
  methods: {
    // 初始化
    init() {
      this.treeCategory()
      this.getDetails()
      // this.getFormControls()
    },
    // 分组树
    async treeCategory() {
      let params = {
        page: 1,
        rows: 100,
        type: 2
      }
      let result = await formApi.treeCategory(params)
      let datas = result.data
      let list = []
      datas.map(item => {
        list.push({
          label: item.name,
          value: item.id
        })
      })
      this.typeTree = list
    },
    // 根据ID获取自定义表单信息
    async getDetails() {
      if (!this.id) {
        return
      }
      const result = await formApi.getDetailsForm(this.id)
      const datas = result.data
      datas.categoryId = datas.categoryId || 0
      this.formData = datas
      if (!datas.categoryId) {
        // 旧数据无分组，自动追加分组
        this.typeTree.unshift({
          label: '无分组',
          value: 0
        })
      }
      this.$refs['dragForm'].setJSON(JSON.parse(datas.template))
    },
    // 获取表单控件
    async getFormControls() {
      if (!this.id) {
        return
      }
      let controls = await formApi.getFormControls(this.id)
      // console.log(controls)
      controls = controls.map(e => {
        e.options = e.staticOptions
        e.removeOption = e.remoteOptions
        e.disabled = !!e.editable
        e.length = e.maxFileSize
        e.placeholder = e.placeHolder
        e.options = _.omit(e, ['name', 'key', 'model'])
        e.rules = []
        if (e.required) {
          e.rules.push({ required: true, message: e.name + '必填' })
        }
        return _.pick(e, ['name', 'key', 'model', 'options'])
      })
    },
    // 保存
    async save() {
      try {
        const template = this.$refs['dragForm'].getJSON()
        let controls = template.list
        controls = _.cloneDeep(controls).map(e => {
          e.staticOptions = e.options.options
          e.remoteOptions = e.options.removeOption
          e.editable = +e.options.disabled
          e.maxFileSize = e.options.length
          e.placeHolder = e.options.placeholder
          if (_.find(e.rules, { required: true })) {
            _.remove(e.rules, e => e.required)
            e.required = true
            if (e.rules[0]) {
              e.dataType = e.rules[0].type
              e.message = e.rules[0].message
            }
          }
          return {
            ..._.omit(e, ['options', 'rules']),
            ..._.omit(e.options, ['options', 'removeOption', 'disabled', 'length', 'placeholder'])
          }
        })
        controls.forEach(e => {
          _.forIn(e, (v, k) => {
            if (v === true) e[k] = 1
            else if (v === false) e[k] = 0
          })
        })
        this.formData.template = JSON.stringify(template)
        if (this.formData.categoryId === '') {
          this.$message({
            type: 'error',
            message: '请选择表单分组!'
          })
          return
        }
        if (!this.formData.name) {
          this.$message({
            type: 'error',
            message: '请输入表单名称!'
          })
          return
        }
        this.isLoading = true
        this.formData.categoryId = !this.formData.categoryId ? null : this.formData.categoryId
        if (this.id) {
          await formApi.updateForm(this.formData)
          // await formApi.saveControls(this.id, controls)
        } else {
          await formApi.addForm(this.formData).then(res => res.data)
          // await formApi.saveControls(formId, controls)
        }
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.goBack()
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    },
    // 返回
    goBack() {
      setTimeout(() => {
        this.$router.push({
          path: '/form/form-list'
        })
      }, 1500)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.form-making {
  height: 800px;
}
.footer-btn {
  padding-top: 20px;
}
</style>
