<!--
@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-27
@任务类型: 全新代码，添加用户列表组件，完成机构查询用户、机构添加人员、机构移除人员功能、人员与项目角色绑定功能
-->
<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="员工姓名">
          <el-input v-model="userRealName" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="addPerson">添加人员</el-button>
          <el-button type="danger" :disabled="!selectedUserList.length" @click="handleBatchRemove">移除人员</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table ref="userTable" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="userName" label="姓名" />
      <el-table-column prop="roleName" label="角色" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="handleSetRole(row)">设置</el-button>
          <el-button type="text" @click="handleRemove(row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wrap">
      <span>
        共 {{ total || 0 }} 条记录 第 {{ page }} / {{ Math.ceil(total / rows) || 1 }} 页
        <el-button type="text primary" class="el-icon-refresh" @click="() => refresh(page, rows)" />
      </span>
      <el-pagination
        :total="total"
        :page-size="rows"
        :current-page.sync="page"
        layout="prev, pager, next, jumper, sizes"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>

    <AddUserModal :visible.sync="visibleAddUser" @handleSave="handleSaveAddUser" />
    <SetUserRoleModal
      :visible.sync="visibleSetUserRole"
      :service-id="serviceId"
      :role-id="roleId"
      :user-id="userId"
      :project-id="projectId"
      @refresh="
        () => {
          refresh(page, rows)
        }
      "
    />
  </div>
</template>

<script>
import { projectApi } from '@/views/system/api/project'
import AddUserModal from './add-user-modal'
import SetUserRoleModal from './set-user-role-modal'
export default {
  components: { AddUserModal, SetUserRoleModal },
  props: {
    isSearch: Boolean,
    projectId: {
      type: String,
      default: ''
    },
    idList: {
      type: Array,
      default() {
        return []
      }
    },
    organId: {
      type: String,
      default: ''
    },
    organName: {
      type: String,
      default: ''
    },
    isRoot: Boolean,
    serviceId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      userRealName: '',
      selectedUserList: [],

      page: 1,
      rows: 10,
      total: 0,
      loading: false,

      visibleAddUser: false,
      visibleSetUserRole: false,
      roleId: '',
      userId: ''
    }
  },
  watch: {
    isSearch(val) {
      if (val) {
        this.refresh(1, this.rows)
      }
    },
    organId(val) {
      // console.log(this.idList)
      this.refresh(this.page, this.rows)
    }
  },
  methods: {
    // 刷新用户列表
    refresh(page, rows) {
      this.loading = true
      this.tableData = []
      projectApi
        .getOrganUserList({
          userRealName: this.userRealName,
          projectId: this.projectId,
          idList: this.idList,
          page,
          rows
        })
        .then(res => {
          // console.log(res)
          this.tableData = res.data.records
          this.tableData.map(item => {
            item.roleName = item.roleName ? item.roleName : '-'
          })
          this.total = res.data.total
          this.page = page
          this.rows = rows
          this.loading = false
        })
    },
    // 查询
    handleSearch() {
      this.refresh(1, this.rows)
    },
    // 重置
    reset() {
      this.userRealName = ''
      this.refresh(1, this.rows)
    },
    // 显示添加人员模态框
    addPerson() {
      if (!this.isRoot) {
        this.visibleAddUser = true
      } else {
        this.$message.error('请选择左侧机构后，再做该操作')
      }
    },
    // 复选框事件
    handleSelectionChange(data) {
      // console.log(data)
      this.selectedUserList = data
    },
    // 显示设置角色模态框
    handleSetRole(row) {
      // console.log(row)
      this.roleId = row.roleId
      this.userId = row.userId
      this.visibleSetUserRole = true
    },
    // 移除
    handleRemove(row) {
      // console.log(row)
      this.$confirm(`确定移除 ${row.userName} 吗？`).then(res => {
        projectApi.organRemoveUser(this.projectId, [row.id]).then(res => {
          this.$message.success('移除人员成功')
          this.refresh(1, this.rows) // 刷新用户列表
          this.$emit('refresh') // 刷新左侧树信息
        })
      })
    },
    // 批量移除
    handleBatchRemove() {
      // console.log(this.selectedUserList)
      const ids = this.selectedUserList.map(item => item.id)
      this.$confirm(`确定批量移除 ${ids.length} 个人员吗？`).then(res => {
        projectApi.organRemoveUser(this.projectId, ids).then(res => {
          this.$message.success('批量移除人员成功')
          this.refresh(1, this.rows) // 刷新用户列表
          this.$emit('refresh') // 刷新左侧树信息
          this.selectedUserList = []
        })
      })
    },
    // page改变
    handleCurrentChange(val) {
      this.refresh(val, this.rows)
    },
    // rows改变
    handleSizeChange(val) {
      this.refresh(1, val)
    },
    // 机构下添加人员操作
    handleSaveAddUser({ userId, userName }) {
      const param = {
        projectId: this.projectId,
        organId: this.organId,
        organName: this.organName,
        userId: userId,
        userName: userName
      }
      projectApi.organAddUser(param).then(res => {
        this.$message.success('添加人员成功')
        this.visibleAddUser = false
        this.refresh(1, this.rows) // 刷新用户列表
        this.$emit('refresh') // 刷新左侧树信息
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-wrap {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-top: 12px;

  .el-button {
    padding-top: 0;
    padding-bottom: 0;
  }
  > span {
    color: #888;
    font-size: 14px;
    line-height: 32px;

    .el-button {
      margin-left: 5px;
      transform: scale(1.4);
    }
  }
}

.el-pagination {
  padding-right: 0;
  text-align: right;
  > span {
    color: #888;
    font-size: 14px;

    .el-button {
      margin-left: 5px;
      transform: scale(1.5);
    }
  }
  /deep/ .el-pagination__sizes {
    margin-right: 0;
    margin-left: 10px;
  }
  /deep/ .el-select .el-input {
    margin-right: 0;
  }
}
</style>
