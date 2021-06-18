<!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-13日
任务类型：1、全新代码
**/
-->
<template>
  <el-dialog :visible="visible" title="新建设备" width="520px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="产品名称" prop="productId">
        <SelectProduct v-model="form.productId"></SelectProduct>
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="备注名称" prop="remark">
        <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }"></el-input>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">{{ id ? '保存' : '创建' }}</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import SelectProduct from '@/views/iot/components/SelectProduct'
export default {
  name: 'Edit',
  components: { SelectProduct },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        projectId: localStorage.getItem('projectId')
      },
      rules: {
        productId: [{ required: true, message: '必填' }],
        name: [
          { required: true, message: '必填' },
          { max: 100, message: '不得超过100个字符' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '仅支持字母、数字、汉字' }
        ]
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  watch: {
    visible() {
      if (this.visible && this.id) {
        this.axios.iot.get('device/get/' + this.id).then(res => {
          this.form = res.data
        })
      }
    }
  },
  created() {
    this.initForm = _.cloneDeep(this.form)
  },
  mounted() {},
  methods: {
    async submit() {
      await this.axios.iot.post('device/add', this.form).then(res => {
        this.$message.success('添加成功')
      })
      this.$parent.refresh()
      this.close()
    },
    async close() {
      this.form = _.cloneDeep(this.initForm)
      await this.$nextTick()
      this.$refs.form.clearValidate()
      console.log(1)
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less"></style>
