<!--
@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-27
@任务类型: 全新代码，添加角色设置模态框组件，完成人员与项目角色绑定功能
-->
<template>
  <el-dialog width="520px" :title="'角色设置'" :visible="visible" @close="handleCancel">
    <el-form label-position="top">
      <el-form-item v-for="item in treeData" :key="item.id" :label="item.name">
        <el-radio-group v-if="item.children" v-model="checkedRoleId">
          <el-radio v-for="rItem in item.children" :key="rItem.id" :label="rItem.id">{{ rItem.name }}</el-radio>
        </el-radio-group>
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
    visible: Boolean,
    serviceId: {
      type: String,
      default: ''
    },
    roleId: {
      type: String,
      default: ''
    },
    userId: {
      type: String,
      default: ''
    },
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      treeData: [],
      checkedRoleId: null
    }
  },
  watch: {
    visible(val) {
      if (val) {
        // console.log(this.serviceId)
        projectApi.getRoleTreeByServiceId({ serviceId: '24953648322706004' || this.serviceId }).then(res => {
          this.treeData = res.data

          // 角色选中回显
          this.checkedRoleId = this.roleId
        })
      }
    }
  },
  methods: {
    handleCancel() {
      this.checkedRoleId = null
      this.$emit('update:visible', false)
    },
    handleSave() {
      // console.log(this.checkedRoleId)
      if (this.checkedRoleId) {
        const param = {
          roleId: this.checkedRoleId,
          userId: this.userId,
          projectId: this.projectId
        }
        projectApi.setUserProjectRole(param).then(res => {
          this.$message.success('设置成功')
          this.handleCancel()
          this.$emit('refresh') // 刷新用户列表
        })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
