<template>
  <div>
    <el-row class="container">
      <el-col :span="8" class="maxw500">
        <el-card class="mb15">
          <div slot="header" class="clearfix">
            <span>项目组织架构</span>
          </div>

          <el-input v-model="filterText" class="mb15" placeholder="请搜索">
            <i slot="suffix" class="el-input__icon el-icon-search" />
          </el-input>

          <el-tree
            ref="tree"
            class="filter-tree scroll-beauty"
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            highlight-current
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            @node-click="onTreeNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span :title="node.label">{{ node.label }}</span>
              <span>
                <el-dropdown>
                  <span>
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="data.type != 2" @click.native="addDepartment(data)">新增</el-dropdown-item>
                    <el-dropdown-item
                      v-if="data.type != 0"
                      :disabled="!node.previousSibling"
                      @click.native="upDepartment(data, node)"
                      >上移</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="data.type != 0"
                      :disabled="!node.nextSibling"
                      @click.native="downDepartment(data, node)"
                      >下移</el-dropdown-item
                    >
                    <el-dropdown-item v-if="data.type != 2 && data.type != 0" @click.native="renameDepartment(data)"
                      >重命名</el-dropdown-item
                    >
                    <el-dropdown-item v-if="data.type != 0" @click.native="deleteDepartment(data)"
                      >删除</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>

      <el-col :span="16" class="right-part">
        <el-form inline>
          <el-form-item label="关键字">
            <el-input v-model="searchName" placeholder="请输入" />
          </el-form-item>

          <el-button type="primary" @click="getTableData">查询</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" :disabled="!personForm.parentId" @click="addPerson">添加人员</el-button>
          <el-button type="primary" :disabled="deleteDisable" @click="deletePerson('muti')">移除人员</el-button>
        </el-form>

        <el-table
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%;"
          element-loading-background="rgba(0, 0, 0, 0.5)"
          element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="姓名" min-width="150" />
          <el-table-column prop="companyName" label="所属公司" min-width="180" />
          <el-table-column prop="mobile" label="联系方式" min-width="150" />
          <el-table-column prop="userRole" label="所属角色" min-width="150" />
          <el-table-column prop="remark" label="备注" min-width="150" />
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="editPerson(scope.row)">编辑</el-button>
              <el-button type="text" @click="deletePerson('single', scope.row.id)">移除人员</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page.current"
          :page-sizes="[10, 20]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

    <!-- 增加编辑人员 模态框 -->
    <el-dialog :title="personTitle" :visible.sync="addFormVisible" :destroy-on-close="true" width="40%">
      <el-form ref="personForm" :model="personForm" label-width="80px" :rules="personFormRules">
        <el-form-item label="角色" prop="parentName">
          <el-input v-model="personForm.parentName" :maxlength="50" disabled />
        </el-form-item>
        <el-form-item v-if="!personForm.id" label="选择人员" prop="targetId">
          <el-select v-model="personForm.targetId" filterable :disabled="!!personForm.id" @change="changeUser">
            <el-option
              v-for="item in userList"
              :key="item.value"
              :value="item.value"
              :label="item.label + item.department"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else label="姓名" prop="targetId">
          <span>{{ personForm.name }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="personForm.remark" :maxlength="50" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onNewPersonSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新建部门 模态框 -->
    <el-dialog title="新增部门" :visible.sync="addDepartmentFormVisible" :destroy-on-close="true" width="40%">
      <el-form :model="departmentForm" label-width="90px">
        <el-form-item label="上级机构名">
          <el-input v-model="upOrganName" disabled :maxlength="50" />
        </el-form-item>

        <el-form-item label="类型" required>
          <el-radio-group v-model="departmentForm.type">
            <el-radio label="1">机构/子机构</el-radio>
            <el-radio label="2">角色</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="departmentForm.type == '1'" label="机构名称" required>
          <el-input v-model="departmentForm.name" :maxlength="50" />
        </el-form-item>

        <el-form-item v-else label="角色名称" required>
          <!--<el-select v-model="roleSelection" filterable placeholder="请选择" class="w100">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>-->
          <el-select v-model="roleSelection" placeholder="请选择" class="w100">
            <el-option-group v-for="group in roleOptions" :key="group.id" :label="group.label">
              <el-option v-for="item in group.children" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addDepartmentFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddDepartmentSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { projectApi } from '@/views/system/api/project'
import toTree from '@/utils/toTree'

export default {
  name: 'SystemProjectDepartmentManage',
  filters: {
    sliceStr: function (value, length) {
      if (value.length > length) {
        return value.slice(0, length) + '...'
      } else {
        return value
      }
    }
  },
  data() {
    return {
      upOrganName: '',
      projectId: this.$route.query.projectId || '', // 项目id
      selectedOrgan: {}, // 当前点选的机构节点
      searchName: '',
      tableData: [],
      tableLoading: false,
      multipleSelection: [],
      deleteDisable: true,
      page: {
        current: 1,
        size: 10, // 每页条数
        total: 0 // 总数
      },
      addDepartmentFormVisible: false,
      personTitle: '添加人员',
      addFormVisible: false,
      personForm: {
        id: '', // 节点id
        name: '', // 节点名称
        parentId: '', // 机构父id
        parentName: '', // 机构名字
        projectId: '', // 项目id
        remark: '', // 备注
        targetId: '', // type=1为空字符，type=2为项目角色ID，type=3为用户ID
        type: 3 // 1:机构/子机构,2:项目角色，3:项目人员
      },
      personFormRules: {
        parentName: [{ required: true, message: '必填' }],
        targetId: [{ required: true, message: '必填' }]
      },
      personFormBack: {},
      userList: [], // 人员选择下拉框数据
      departmentForm: {
        id: '', // 节点id
        name: '', // 节点名称
        parentId: '', // 机构父id
        projectId: '', // 项目id
        targetId: '', // type=1为空字符，type=2为项目角色ID，type=3为用户ID
        type: '1' // 1:机构/子机构,2:项目角色，3:项目人员
      },
      departmentFormBack: {},
      filterText: '',
      treeData: [],
      treeDataList: [], // 树结构原始数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleOptions: [],
      roleSelection: '',
      roleNameSelection: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.departmentForm.projectId = this.projectId
      this.personForm.projectId = this.projectId
      this.getStructureTree()
      this.getPrincipalList()
      Object.assign(this.departmentFormBack, this.departmentForm)
    },
    filterNode(value, data) {
      if (!value) return true
      // name必须与defaultProps里保持一致
      return data.name.indexOf(value) !== -1
    },
    // 获取项目机构
    async getStructureTree() {
      if (!this.projectId) {
        return
      }
      const result = await projectApi.getProjectOrganList({ projectId: this.projectId })
      const datas = result.data
      this.treeDataList = datas
      this.treeData = toTree(datas, 'parentId')
    },
    // 查询用户(下拉框)
    async getPrincipalList() {
      const params = {
        page: 1,
        rows: 200
      }
      const result = await projectApi.getPrincipalList(params)
      const datas = result.data
      const list = []
      datas.map(item => {
        const department = item.departmentList ? ' | ' + _.map(item.departmentList, 'departmentName').join(' |') : ''
        list.push({
          label: item.userRealName,
          value: item.userId,
          department
        })
      })
      this.userList = list
    },
    // 查询角色数据
    getRoleList(hasUserList) {
      const param = {
        projectId: this.projectId,
        roleAttribute: 0
      }
      projectApi.querylistAllProjectRole(param).then(res => {
        if (res.code === 200) {
          const datas = res.data || []
          /*const list = []
          datas.map(item => {
            if (!hasUserList.includes(item.id)) {
              list.push({ value: item.id, label: item.name })
            }
          })*/
          const newDatas = datas.filter(item => !hasUserList.includes(item.id))
          this.roleOptions = this.formatTree(newDatas)
        }
      })
    },
    // 格式化树结构
    formatTree(datas) {
      const list = []
      datas.map(item => {
        if (item.pid === '0') {
          list.push({ id: item.id, label: item.name, children: [] })
        }
      })
      const isChildren = _.map(list, 'id')
      datas.map(item => {
        const index = isChildren.indexOf(item.pid)
        if (index >= 0) {
          list[index].children.push({ label: item.name, value: item.id })
        }
      })
      return list
    },
    // 左侧树点击事件
    onTreeNodeClick(e) {
      this.selectedOrgan = e
      this.personForm.parentId = e.id
      this.personForm.parentName = e.name
      this.getTableData()
      if (e.type !== 2) {
        this.personForm.parentId = ''
        this.personForm.parentName = 'e.name'
      }
      Object.assign(this.personFormBack, this.personForm)
    },
    // 选择人员
    changeUser(e) {
      this.personForm.name = _.find(this.userList, { value: e }).label
    },
    // 表格
    getTableData() {
      const param = {
        projectId: this.projectId,
        id: this.selectedOrgan.id,
        name: this.searchName
      }
      this.tableLoading = true
      projectApi
        .getOrganUserList(param)
        .then(res => {
          const datas = res.data || []
          this.tableData = datas
        })
        .finally(res => {
          this.tableLoading = false
        })
    },
    handleSizeChange(val) {
      this.page.size = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getTableData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.deleteDisable = this.multipleSelection.length === 0
    },
    // 人员操作
    deletePerson(type, id) {
      this.$confirm('确认移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          let param = []
          if (type === 'muti') {
            param = _.map(this.multipleSelection, 'id')
          } else {
            param.push(id)
          }
          projectApi.organRemoveUser(param).then(res => {
            this.getTableData()
            this.getPrincipalList()
          })
        })
        .catch(() => {})
    },
    // 添加人员
    addPerson() {
      this.personTitle = '添加人员'
      this.personForm = _.cloneDeep(this.personFormBack)
      const disabledUser = _.map(this.tableData, 'targetId')
      this.userList = this.userList.filter(item => !disabledUser.includes(item.value))
      this.addFormVisible = true
    },
    // 编辑人员
    editPerson(info) {
      this.personTitle = '编辑人员'
      Object.assign(this.personForm, info)
      this.addFormVisible = true
    },
    // 添加人员
    async onNewPersonSubmit() {
      await this.$refs.personForm.validate()
      try {
        if (this.personForm.id) {
          await projectApi.organUpdateUser(this.personForm)
        } else {
          await projectApi.organAddUser(this.personForm)
        }
        this.$message.success('添加成功')
        this.addFormVisible = false
        Object.assign(this.personForm, this.personFormBack)
        this.getTableData()
        this.getPrincipalList()
      } catch (e) {
        this.$message.error('添加失败')
        this.addFormVisible = false
      }
    },
    // 人员操作

    // 树节点操作
    addDepartment(data) {
      this.roleSelection = ''
      Object.assign(this.departmentForm, this.departmentFormBack)
      const hasUserList = data.children ? _.map(data.children, 'targetId') : []
      this.upOrganName = data.name
      this.addDepartmentFormVisible = true
      this.departmentForm.parentId = data.id
      this.getRoleList(hasUserList)
    },
    renameDepartment(data) {
      this.$prompt('请输入新名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: data.name || '',
        inputPattern: /\S/,
        inputErrorMessage: '名称不能为空'
      })
        .then(({ value }) => {
          const param = {
            id: data.id,
            name: value
          }
          projectApi.renameOrganName(param).then(res => {
            if (res.code === 200) {
              this.$message.success('重命名成功')
              this.getStructureTree()
            } else {
              this.$message.error('重命名失败')
            }
          })
        })
        .catch(() => {})
    },
    deleteDepartment(data) {
      this.$confirm(`确认删除${data.name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          projectApi.deleteOrganInfo(data.id).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getStructureTree()
            } else {
              this.$message.error('删除失败')
            }
          })
        })
        .catch(() => {})
    },
    onAddDepartmentSubmit() {
      if (this.departmentForm.type === '2') {
        this.departmentForm.targetId = this.roleSelection
        /*this.departmentForm.name = this.roleOptions.find(item => {
          return item.value === this.roleSelection
        }).label*/
        this.roleOptions.map(option => {
          let obj = option.children.find(item => item.value === this.roleSelection) || ''
          if (obj) {
            this.departmentForm.name = obj.label
          }
        })
      }
      projectApi
        .addOrganInfo(this.departmentForm)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('新建成功')
            this.getStructureTree()
          } else {
            this.$message.error('新建失败')
          }
        })
        .finally(() => {
          this.addDepartmentFormVisible = false
        })
    },
    upDepartment(data, node) {
      if (!node.previousSibling) {
        this.$message.warning('此节点已位于最上层')
        return
      }
      projectApi.projectOrganMoveUp(data.id).then(res => {
        if (res.code === 200) {
          this.$message.success('移动成功')
          this.getStructureTree()
        }
      })
    },
    downDepartment(data, node) {
      if (!node.nextSibling) {
        this.$message.warning('此节点已位于最下层')
        return
      }
      projectApi.projectOrganMoveDown(data.id).then(res => {
        if (res.code === 200) {
          this.$message.success('移动成功')
          this.getStructureTree()
        }
      })
    },
    // 部门操作

    onReset() {
      this.searchName = ''
      this.getTableData()
    },
    handleReturn() {
      this.$router.push({
        path: '/system/project/project-list'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  padding-bottom: 20px;
}
.el-tree {
  max-height: calc(100vh - 240px);
  overflow: auto;
}
.maxw500 {
  max-width: 500px;
}
.w100 {
  width: 100%;
}
.mb15 {
  margin-bottom: 15px;
}
.right-part {
  padding: 10px 15px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: white;
  box-shadow: 5px 0 7px 0 #bbb;
  z-index: 3;
  .submit {
    position: absolute;
    right: 20px;
    top: 10px;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
