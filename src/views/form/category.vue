<template>
  <!--  /**-->
  <!--  任务名称：2747/ 自定义表单：表单分类、表单功能开发-->
  <!--  开发人员：李建敏-->
  <!--  日期：2020-3月-27日-->
  <!--  任务类型：2.复制代码-->
  <!--  **/-->
  <div class="main">
    <el-tree :expand-on-click-node="false" node-key="id" highlight-current :data="list" @node-click="handleNodeClick" />
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="60px">
      <el-form-item label="名称" prop="argText">
        <el-input v-model="form.argText" />
      </el-form-item>
      <el-form-item label="编码" prop="argCode" :disabled="form.id">
        <el-input v-model="form.argCode" />
      </el-form-item>
      <el-form-item label="父级" prop="pid">
        <SelectCategory v-model="form.pid" :list="list" value-key="id" append-to-body :disable-keys="[form.id]" />
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button v-if="form.id && $hasPower('FormCategoryDelete')" type="danger" @click="remove">删除</el-button>
        <el-button v-if="$hasPower('FormCategoryEdit')" type="primary" @click="submit">{{
          form.id ? '保存' : '新建'
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import treeForEach from '@/utils/treeForEach'
import SelectCategory from './components/SelectCategory'
export default {
  name: 'FormCategory',
  components: { SelectCategory },
  data() {
    return {
      form: {},
      rules: {
        argText: { required: true, message: '必填' },
        argCode: { required: true, message: '必填' }
      },
      argGroup: 'formCategory',
      list: []
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.axios.activiti
        .post('activiti/process/type/list', {
          page: 1,
          rows: 10000,
          argGroup: this.argGroup
        })
        .then(res => {
          this.list = treeForEach(res.data.records, e => {
            e.label = e.argText
            e.value = e.id
          })
        })
    },
    async submit() {
      await this.$refs.form.validate()
      // todo 没有分类更新接口
      await this.axios.activiti
        .post('activiti/process/type/add', { ...this.form, argGroup: this.argGroup })
        .then(() => {
          this.$message.success(this.form.id ? '保存成功' : '创建')
        })
      this.refresh()
    },
    remove() {
      this.$remove([this.form]).then(async () => {
        await this.axios.activiti
          .get('activiti/process/type/delete/' + this.form.id)
          .then(res => this.$message.success('删除成功'))
        this.refresh()
        this.form = {}
        this.$refs.form.resetFields()
      })
    },
    handleNodeClick(data, node) {
      if (this.form.id === data.id) {
        this.form = {}
        node.isCurrent = false
        this.$refs.form.resetFields()
      } else {
        this.form = _.cloneDeep(data)
      }
    }
  }
}
</script>

<style scoped lang="less">
.main {
  display: flex;
  .el-tree {
    width: 200px;
    margin-right: 25px;
    /deep/ .el-tree-node.is-current > div:first-child {
      background-color: lighten(#5a92ff, 5%);
      color: #fff;
    }
  }
  .el-form {
    width: 300px;
  }
}
</style>
