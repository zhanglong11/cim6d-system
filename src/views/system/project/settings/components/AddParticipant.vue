<template>
  <el-dialog
    title="添加参与方性质"
    :visible="visible"
    width="500px"
    :close-on-click-modal="!form.type.length"
    @close="close"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="参与方性质" prop="type">
        <SelectArg
          v-model="form.type"
          :hiddenKeys="hiddenKeys"
          multiple
          filterable
          style="width: 100%;"
          :arg-group="argGroupHash[project.type]"
        ></SelectArg>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">添加</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddParticipant',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    hiddenKeys: {
      type: Array,
      default: undefined
    },
    project: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        type: []
      },
      rules: {
        type: [{ required: true, message: '必填' }]
      },
      /**
       * 根据项目类型获取argGroup
       */
      argGroupHash: {
        construction: 'construction_participantType',
        decoration: 'decoration_participantType',
        design: 'design_participantType',
        epc: 'epc_participantType',
        merchants: 'merchants_participantType',
        'qianjiang-ppp': 'qianjiang-ppp_participantType'
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    },
    async submit() {
      // console.log(this.argGroupHash[project.type])
      this.$refs.form.validate()
      await this.axios.system.post(`project/participant/type/add/${this.project.id}`, this.form.type)
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
