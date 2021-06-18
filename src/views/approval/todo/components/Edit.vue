<template>
  <el-dialog width="500px" title="编辑" :visible="visible" @close="$emit('update:visible', false)">
    <ul class="description">
      <li>
        <span>任务名</span><span>{{ task.taskName }}</span>
      </li>
      <li>
        <span>任务状态</span><span>{{ task.taskStatus }}</span>
      </li>
    </ul>

    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="同意" prop="agree">
        <el-radio-group v-model="form.flag">
          <el-radio :label="3">同意</el-radio>
          <el-radio :label="4">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="意见" prop="opinion">
        <el-input v-model="form.opinion" />
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button size="mini" @click="$emit('update:visible', false)">取消</el-button>
      <el-button size="mini" type="primary" @click="submit">提交</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'Edit',
  props: ['task', 'visible'],
  data() {
    return {
      form: {
        flag: null,
        opinion: ''
      },
      rules: {
        flag: { required: true, message: '必填' }
      }
    }
  },
  computed: {
    isNew() {
      return !this.id
    }
  },
  methods: {
    /**
     任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
     开发人员：李建敏
     日期：2020-3月-17日
     任务类型：2、复制修改代码 （1行）
     **/
    async submit() {
      await this.$refs.form.validate()

      this.axios.workflow.post('task/complete/' + this.task.taskId, this.form).then(() => {
        this.$message.success('提交成功')
        this.$emit('update:visible', false)
        this.$parent.refresh()
      })
    }
  }
}
</script>

<style scoped lang="less">
.description {
  li {
    > span {
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
      &:first-child {
        width: 80px;
        font-weight: bold;
      }
    }
  }
}
</style>
