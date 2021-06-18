<template>
  <!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-9日
任务类型：1、全新代码
**/
-->
  <el-dialog :visible="visible" :title="id ? '编辑分组' : '新建分组'" width="520px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="分组名称" prop="name">
        <el-input v-model="form.name" :disabled="id"></el-input>
      </el-form-item>
      <el-form-item label="父级" prop="pid">
        <el-cascader
          v-model="form.pid"
          :disabled="id"
          :props="{
            label: 'name',
            value: 'id',
            emitPath: true
          }"
          :options="groupListTree"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="分组描述">
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
export default {
  name: 'Edit',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        projectId: localStorage.getItem('projectId'),
        level: 1
      },
      rules: {
        name: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    groupListTree() {
      return this.$store.state.iot.groupListTree
    }
  },
  watch: {
    visible() {
      if (this.visible && this.id) {
        this.axios.iot.get('group/get/' + this.id).then(res => {
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
      if (!this.id) {
        let data = _.cloneDeep(this.form)
        if (data.pid) {
          data.level = data.pid.length + 1
          data.pid = _.last(data.pid)
        }
        await this.axios.iot.post('group/add', data).then(res => {
          this.$message.success('创建成功')
        })
      } else {
        await this.axios.iot.post('group/update', _.pick(this.form, ['id', 'description'])).then(res => {
          this.$message.success('修改成功')
        })
      }
      this.close()
      await this.$store.dispatch('iot/getGroupListTree')
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

<style scoped lang="less"></style>
