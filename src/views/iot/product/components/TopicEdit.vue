<!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-10日
任务类型：1、全新代码
**/
-->
<template>
  <el-dialog :visible="visible" :title="id ? '编辑Topic类' : '新建Topic类'" width="600px" @close="close">
    <el-alert type="info" show-icon :title="Hint.product.TOPIC_CLASS_FORMAT"></el-alert>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="设备操作权限" prop="authType">
        <el-select v-model="form.authType">
          <el-option
            v-for="e in deviceOperationPermissionList"
            :key="e.value"
            :value="e.value"
            :label="e.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Topic类" prop="topicName">
        <el-input v-model="form.topicName"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }"></el-input>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">{{ id ? '保存' : '创建' }}</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import deviceOperationPermissionList from '../../lib/deviceOperationPermissionList'
import Hint from '../../Hint'
export default {
  name: 'TopicEdit',
  props: {
    id: {
      type: String,
      default: null
    },
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
        authType: [{ required: true, message: '必填' }],
        topicName: [{ required: true, message: '必填' }]
      },
      deviceOperationPermissionList,
      Hint
    }
  },
  watch: {
    visible() {
      /*if (this.visible && this.id) {
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
      if (!this.id) {
        await this.axios.iot.post('topic/add', this.form).then(res => {
          this.$message.success('创建成功')
        })
      } else {
        await this.axios.iot.post('topic/update', this.form).then(res => {
          this.$message.success('修改成功')
        })
      }
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
