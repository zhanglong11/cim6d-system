<template>
  <el-dialog
    width="500px"
    top="10vh"
    :title="isNew ? '新增分组' : '编辑分组'"
    :visible="visible"
    @close="$emit('update:visible', false)"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="分组名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button size="mini" @click="$emit('update:visible', false)">取消</el-button>
      <el-button size="mini" type="primary" @click="submit">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { formApi } from '../api/form'
export default {
  name: 'EditType',
  components: {},
  props: ['id', 'visible'],
  data() {
    return {
      formData: {
        name: '',
        projectId: '',
        parentId: 0,
        type: 2
      },
      rules: {
        name: { required: true, message: '请输入分组名' }
      },
      modelCategory: []
    }
  },
  computed: {
    isNew() {
      return !this.id
    }
  },
  watch: {
    async visible(val) {
      if (val) await this.refresh()
      this.$nextTick(() => {
        if (!val) {
          this.$refs.formRef.resetFields()
        } else {
          this.$refs.formRef.clearValidate()
        }
      })
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      if (!this.id) {
        return
      }
      this.axios.form.get(`/category/get/${this.id}`).then(res => {
        this.formData = res.data
      })
    },
    // 确定
    submit() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.addCategory()
        } else {
          return false
        }
      })
    },
    // 添加/保存
    async addCategory() {
      if (this.id) {
        await formApi.updateCategory(this.formData)
      } else {
        await formApi.addCategory(this.formData)
      }
      this.$message.success('操作成功')
      this.$parent.init()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less"></style>
