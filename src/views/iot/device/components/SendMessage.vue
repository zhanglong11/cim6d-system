<!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-10日
任务类型：1、全新代码
**/
-->
<template>
  <el-dialog :visible="visible" title="发布消息" width="600px" @close="close">
    <el-alert type="info" show-icon :title="Hint.device.ATTENTION" />
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="Topic" prop="name">
        {{ topic.name }}
      </el-form-item>
      <el-form-item label="消息内容" prop="content">
        <el-input v-model="form.content" placeholder="请输入消息内容" />
      </el-form-item>
      <el-form-item label="Qos" prop="qos">
        <el-radio-group v-model="form.qos">
          <el-radio :label="0">0</el-radio>
          <el-radio :label="1">1</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">发布</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import deviceOperationPermissionList from '../../lib/deviceOperationPermissionList'
import Hint from '../../Hint'
export default {
  name: 'SendMessage',
  props: {
    id: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      required: true
    },
    topic: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        projectId: localStorage.getItem('projectId')
      },
      rules: {
        content: [{ required: true, message: '必填' }],
        qos: [{ required: true, message: '必填' }]
      },
      deviceOperationPermissionList,
      Hint
    }
  },
  watch: {
    visible() {
      /* if (this.visible && this.id) {
        this.axios.iot.get('topic/get/' + this.id).then(res => {
          this.form = res.data
        })
      }*/
    }
  },
  created() {
    this.initForm = _.cloneDeep(this.form)
  },
  mounted() {},
  methods: {
    async submit() {
      await this.$refs.form.validate()
      this.close()
      this.$parent.refresh()
    },
    async close() {
      this.form = _.cloneDeep(this.initForm)
      await this.$nextTick()
      this.$refs.form.clearValidate()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
.el-alert {
  align-items: flex-start;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  font-size: 15px;
  line-height: 24px;
  color: #555;
  word-break: break-word;
  margin-bottom: 15px;
  /deep/ i {
    color: #1890ff;
    margin-top: 5px;
  }
}
</style>
