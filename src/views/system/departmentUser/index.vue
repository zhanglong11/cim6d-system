<template>
  <div class="container">
    <div class="wrapper">
      <div class="left">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>组织架构</span>
            <el-button style="float: right; padding: 3px 0;" type="text" />
          </div>
          <div>
            <el-tree
              ref="tree"
              :data="treeData"
              node-key="id"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ data.name }}({{ data.userNum }})</span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </div>
      <div class="right">
        <el-card v-show="selectTreeId" class="rightContent">
          <header slot="header">
            <div class="name">{{ selectTreeData.name }}</div>
            <el-button
              v-if="$hasPower('SystemDepartmentUserEdit')"
              plain
              type="primary"
              size="mini"
              @click="dialogEditFormVisible = true"
              >编辑</el-button
            >
          </header>
          <div style="margin-bottom: 10px;"><i class="el-icon-user-solid" />部门成员</div>
          <div class="buttonWrapper">
            <div>
              <el-button
                v-if="$hasPower('SystemDepartmentUserAdd')"
                type="primary"
                size="mini"
                @click="
                  () => {
                    isAdd = true
                    dialogAddUserFormVisible = true
                  }
                "
              >
                添加成员
              </el-button>
              <el-button v-if="$hasPower('SystemDepartmentUserUpdate')" size="mini" @click="handleAdjustUserDepartment"
                >调整部门</el-button
              >
            </div>
            <div>
              <el-button
                v-if="$hasPower('SystemDepartmentUserDelete')"
                :disabled="!selectRows.length"
                type="danger"
                size="mini"
                @click="() => handleDelete()"
                >移除成员</el-button
              >
            </div>
          </div>
          <div class="tableWrapper">
            <vxe-table
              ref="xTable"
              resizable
              auto-resize
              :border="false"
              :data="tableData"
              :checkbox-config="{
                highlight: false,
                showHeader: true
              }"
              @checkbox-change="selectChangeEvent"
              @checkbox-all="handleCheckAll"
            >
              <vxe-table-column type="checkbox" width="50px" />
              <vxe-table-column field="realName" title="姓名" align="left">
                <template slot-scope="{ row }">
                  <span>{{ row.realName }}</span>
                  <el-tag v-if="!!row.principalFlag" size="mini" style="margin-left: 5px;">主管</el-tag>
                </template>
              </vxe-table-column>
              <vxe-table-column field="position" title="职位" />
              <vxe-table-column
                field="roleNameList"
                title="角色"
                :formatter="({ cellValue }) => cellValue && cellValue.join(',')"
              />
              <vxe-table-column field="mobile" title="手机" />
              <vxe-table-column field="email" title="邮箱" />
              <vxe-table-column field="aa" title="操作" width="120">
                <template v-slot="{ row }">
                  <i
                    v-if="$hasPower('SystemDepartmentUserEditMember')"
                    class="el-icon-tickets"
                    style="color: #3189f7; font-size: 20px; font-weight: bolder;"
                    @click="
                      () => {
                        activeUserId = row.id
                        detailDialogVisible = true
                      }
                    "
                  />
                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
        </el-card>
      </div>
    </div>
    <UserDetail :id="activeUserId" :visible.sync="detailDialogVisible" />
    <FormEditDialog
      v-if="dialogEditFormVisible"
      :form-info="selectTreeData"
      :visible.sync="dialogEditFormVisible"
      @submit="handleEditSubmit"
    />
    <FormEditParentDialog
      v-if="dialogEditParentFormVisible"
      :form-info="selectTreeData"
      :visible.sync="dialogEditParentFormVisible"
      @submit="handleEditParentSubmit"
    />
    <FormAddUserDialog
      v-if="dialogAddUserFormVisible"
      :department-id="selectTreeId"
      :department-name="selectTreeData.name"
      :visible.sync="dialogAddUserFormVisible"
      @submit="handleEditUserSubmit"
    />
  </div>
</template>

<script>
import Api from '@/views/system/api/departmentUser'
import FormEditDialog from '@/views/system/departmentUser/components/FormEditDialog'
import FormEditParentDialog from '@/views/system/departmentUser/components/FormEditParentDialog'
import FormAddUserDialog from '@/views/system/departmentUser/components/FormAddUserDialog'
import UserDetail from '@/views/system/user/components/user-detail'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SystemDepartmentUser',
  components: {
    FormEditDialog,
    FormEditParentDialog,
    FormAddUserDialog,
    UserDetail
  },
  data() {
    // 这里存放数据
    return {
      treeData: [],
      tableData: [],
      dialogEditFormVisible: false,
      dialogEditParentFormVisible: false, // 调整部门
      dialogAddUserFormVisible: false, // 添加成员
      detailDialogVisible: false, // 用户详情弹窗
      isAdd: true,
      selectTreeId: '',
      selectTreeData: {},
      selectRows: [],
      selectRow: {},
      deleteId: '', // 编辑成员删除传递的id,
      isRoot: true // 判断树的根节点,是公司还是部门
    }
  },
  created() {
    this.getTreeData()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    async getTreeData() {
      const res = await Api.getDepartment([])
      if (res.data[0]) {
        res.data[0].isRoot = true
      }
      this.treeData = res.data
    },
    async getTableData() {
      const res = await Api.getDepartmentUserList(this.selectTreeId)
      this.tableData = res.data || []
    },
    handleNodeClick(data, node) {
      if (!data.parentId) {
        this.isRoot = true
      } else {
        this.isRoot = false
      }
      this.selectTreeId = data.id
      this.selectTreeData = { ...data, isRoot: this.isRoot }
      this.getTableData()
    },
    selectChangeEvent({ records }) {
      this.selectRows = [...records]
    },
    // 编辑部门提交事件
    async handleEditSubmit(data) {
      await Api.editOneDepartment(data)
      this.dialogEditFormVisible = false
      await this.getTreeData()
      this.$refs.tree.setCurrentKey(this.selectTreeId)
      await this.getTableData()
    },
    handleAdjustUserDepartment() {
      if (!this.selectRows.length) {
        this.$message.error('请选择一个成员再操作')
        return
      }
      this.dialogEditParentFormVisible = true
    },
    // 编辑选择人员的部门
    async handleEditParentSubmit(data) {
      const Ids = this.selectRows.map(item => item.id)
      const names = this.selectRows.map(item => item.realName)
      await Api.editUserDepartment({ ...data, userIdList: Ids, userNameList: names })
      this.dialogEditParentFormVisible = false
      await this.getTreeData()
      this.$refs.tree.setCurrentKey(this.selectTreeId)
      await this.getTableData()
    },
    // 添加/查看人员
    async handleEditUserSubmit() {
      this.dialogAddUserFormVisible = false
      await this.getTreeData()
      this.$refs.tree.setCurrentKey(this.selectTreeId)
      await this.getTableData()
    },
    async handleDelete() {
      await Api.deleteUserDepartment(this.selectTreeId, _.map(this.selectRows, 'id')).then(res => {
        this.$message.success('移除成功')
        this.getTableData()
      })
    },
    // 删除部门
    async handleDeleteDepartment(id) {
      const res = await this.$confirm('此操作将删除所选部门吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (!res) return
      await Api.deleteDepartment([id])
      this.$message.success('删除成功')
      await this.getTreeData()
    },
    handleCheckAll({ records }) {
      this.selectRows = records
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  height: calc(100vh - 90px);
}
.wrapper {
  display: flex;
  height: 100%;
  padding: 10px 10px 20px;
  .left {
    width: 400px;
    /*border: 1px #ff0000 solid;*/
    border-right: none;
    padding: 0 10px 0 0;
    /deep/ .el-card {
      height: 100%;
      .el-card__header {
        padding: 10px 20px;
      }
      .el-card__body {
        height: calc(100% - 50px);
        overflow: auto;
      }
    }
  }
  .right {
    flex: 1;
    overflow: auto;
    .rightContent {
      height: 100%;
      display: flex;
      flex-direction: column;
      /deep/ .el-card__header {
        padding: 8px 15px;
      }
      /deep/ .el-card__body {
        padding: 15px;
      }
      header {
        display: flex;
        align-items: center;
        .name {
          margin-right: 15px;
        }
      }
      .buttonWrapper {
        display: flex;
        height: 40px;
        padding: 5px 10px;
        background-color: #eceff4;
        justify-content: space-between;
        align-items: center;
        /deep/ .el-button {
          width: 100px;
        }
      }
      .tableWrapper {
        flex: 1;
        overflow: auto;
        max-height: calc(100vh - 300px);
        padding: 10px 0;
      }
    }
  }
}
/deep/ .el-tree-node.is-current > .el-tree-node__content {
  background-color: #a8eafb !important;
}
/deep/ .el-tree-node__content {
  &:hover {
    background-color: #5dbbde !important;
  }
}
</style>
