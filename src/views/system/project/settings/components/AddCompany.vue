<template>
  <el-dialog title="添加参与方" :visible="visible" width="500px" :close-on-click-modal="!form.companyId" @close="close">
    <el-form ref="form" label-width="100px">
      <el-form-item :label="participant.label" prop="company">
        <el-select v-model="form.companyId" style="width: 100%;" filterable>
          <el-option v-for="e in computedList" :key="e.id" :label="e.name" :value="e.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" :disabled="!form.companyId" @click="submit">添加</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddCompany',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    hiddenKeys: {
      type: Array,
      default() {
        return []
      }
    },
    participant: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        companyId: ''
      },
      list: []
    }
  },
  computed: {
    computedList() {
      let list = this.list
      if (this.hiddenKeys.length) {
        list = _.differenceBy(list, this.hiddenKeys, e => e.id || e)
      }
      return list
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.refresh()
      }
    }
  },
  created() {
    this.refresh()
    this.initForm = _.cloneDeep(this.form)
  },
  methods: {
    refresh() {
      this.axios.admin.get('admin/copanyBase/nameList').then(res => {
        this.list = res.data
      })
    },
    close() {
      this.$emit('update:visible', false)
      this.form = _.cloneDeep(this.initForm)
    },
    async submit() {
      await this.axios.system.post('project/participant/company/add/' + this.participant.id, [this.form.companyId])
      this.$message.success('添加成功')
      this.close()
      this.$emit('change')
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
@import '~@/styles/mixin.scss';
.el-form {
  padding: 0 15px;
}
</style>
