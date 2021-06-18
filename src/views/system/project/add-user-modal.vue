<!--
@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-27
@任务类型: 全新代码，添加【添加人员】模态框组件，完成机构关联人员功能
-->
<template>
  <el-dialog width="420px" :title="'添加人员'" :visible="visible" @close="handleCancel">
    <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
      <el-form-item label="员工姓名" prop="userId">
        <el-select v-model="form.userId" filterable placeholder="请选择人员">
          <!--<el-option v-for="(item, index) in userList" :key="index" :value="item.value" :label="item.label" />-->
          <el-option v-for="(item, index) in userList" :key="index" :value="item.value" :label="item.label">
            <span>{{ item.label }}</span>
            <span style="color: #8492a6; font-size: 13px;">{{ getDepartTxt(item.departmentList) }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { projectApi } from '@/views/system/api/project'
export default {
  props: {
    visible: Boolean
  },
  data() {
    return {
      userList: [],
      form: {
        userId: ''
      },
      formRules: {
        userId: [{ required: true, message: '请选择人员' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.form.userId = ''
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        projectApi.getPrincipalList({}).then(res => {
          this.userList = res.data
          this.userList.map(item => {
            item.label = item.userRealName
            item.value = item.userId
          })
        })
      }
    }
  },
  methods: {
    getDepartTxt(list) {
      let departTxt = ''
      if (list) {
        list.map(item => {
          departTxt = departTxt + ',' + item.departmentName
        })
      }
      departTxt = departTxt.substr(1)
      if (departTxt) {
        departTxt = ' | ' + departTxt
      }
      return departTxt
    },
    handleCancel() {
      this.$emit('update:visible', false)
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let userName = ''
          for (let i = 0; i < this.userList.length; i++) {
            if (this.form.userId === this.userList[i].userId) {
              userName = this.userList[i].userRealName
              break
            }
          }
          this.$emit('handleSave', { userId: this.form.userId, userName })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
