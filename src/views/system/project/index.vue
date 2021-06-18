<template>
  <div>
    <el-form inline>
      <el-form-item label="项目类型">
        <el-select v-model="formData.type" placeholder="请选择" :clearable="true" @change="onTypeChange">
          <template v-for="item in projectTypeList">
            <el-option v-if="!item.disable" :key="item.value" :label="item.label" :value="item.value" />
          </template>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="创建日期">
        <el-date-picker
          v-model="formData.date"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item> -->

      <el-form-item label="项目名称">
        <el-input v-model="formData.name" placeholder="请输入项目名称" />
      </el-form-item>

      <el-button type="primary" :loading="searchLoading" @click="onSearchProject">查询</el-button>
      <el-button @click="onReset">重置</el-button>
      <el-button v-if="$hasPower('SystemProjectAdd')" type="primary" icon="el-icon-plus" @click="handleOpenNewProject"
        >新建项目</el-button
      >
    </el-form>

    <el-table
      v-loading="tableLoading"
      :data="projectList"
      style="width: 100%;"
      element-loading-text="数据加载中..."
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column prop="code" label="项目编号" width="120" />
      <el-table-column prop="name" label="项目名称" min-width="150">
        <template slot-scope="scope">
          <span
            v-if="scope.row.projectUserCategory === 2"
            class="el-icon-star-on"
            style="color: green; font-size: 18px; margin-right: 5px;"
          /><router-link to="" @click.native="toProject(scope.row)">{{ scope.row.name }}</router-link>
        </template>
      </el-table-column>
      <el-table-column property="companyName" label="所属企业" min-width="150"></el-table-column>
      <el-table-column property="type" label="项目类型" width="150">
        <template slot-scope="scope">{{ $getLabelFromArg('projectType', scope.row.type) }}</template>
      </el-table-column>
      <el-table-column prop="address" label="项目地址" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope"
          >{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.county }}{{ scope.row.detailAddress }}</template
        >
      </el-table-column>
      <el-table-column prop="principalName" label="项目负责人" min-width="100" />
      <el-table-column prop="projectStatus" label="项目状态" min-width="100">
        <template slot-scope="scope">{{ $getLabelFromArg('projectStatus', scope.row.projectStatus) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template slot-scope="scope">
          <el-tooltip
            v-if="$hasPower('SystemProjectTo')"
            class="item"
            effect="dark"
            content="进入项目"
            placement="bottom"
          >
            <el-button type="text" @click="toProject(scope.row)"
              ><img src="~/@/assets/images/project/icon1.png" class="project-icon"
            /></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="$hasPower('SystemProjectEdit') && scope.row.projectUserCategory === 2"
            class="item"
            effect="dark"
            content="编辑"
            placement="bottom"
          >
            <el-button type="text" @click="handleToEdit(scope.row)"
              ><img src="~/@/assets/images/project/icon2.png" class="project-icon"
            /></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="$hasPower('SystemMyProject') && scope.row.projectUserCategory === 2"
            class="item"
            effect="dark"
            content="参项单位配置"
            placement="bottom"
          >
            <el-button type="text" @click="handleToParties(scope.row)"
              ><img src="~/@/assets/images/project/icon3.png" class="project-icon"
            /></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="$hasPower('SystemProjectRoleSet') && scope.row.projectUserCategory === 2"
            class="item"
            effect="dark"
            content="项目角色配置"
            placement="bottom"
          >
            <el-button type="text" @click="handleToRole(scope.row)"
              ><img src="~/@/assets/images/project/icon4.png" class="project-icon"
            /></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="$hasPower('SystemProjectDepartmentManage') && scope.row.projectUserCategory === 2"
            class="item"
            effect="dark"
            content="项目机构管理"
            placement="bottom"
          >
            <el-button type="text" @click="handleToManage(scope.row)"
              ><img src="~/@/assets/images/project/icon5.png" class="project-icon"
            /></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="$hasPower('SystemProjectSettings')"
            class="item"
            effect="dark"
            content="项目机构图"
            placement="bottom"
          >
            <el-button type="text" @click="handleToMap(scope.row)"
              ><img src="~/@/assets/images/project/icon6.png" class="project-icon"
            /></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="$hasPower('SystemProjectDetails')"
            class="item"
            effect="dark"
            content="详情"
            placement="bottom"
          >
            <el-button type="text" @click="handleToDetails(scope.row)"
              ><img src="~/@/assets/images/project/icon7.png" class="project-icon"
            /></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="$hasPower('SystemProjectDelete') && scope.row.projectUserCategory === 2"
            class="item"
            effect="dark"
            content="删除"
            placement="bottom"
          >
            <el-button type="text" @click="handleDelete(scope.row)"
              ><img src="~/@/assets/images/project/icon8.png" class="project-icon"
            /></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrap">
      <div style="margin-top: 10px;">
        <i class="el-icon-star-on" style="color: green; font-size: 18px;" />
        <span style="font-size: 14px;"> 我的项目</span>
      </div>
      <el-pagination
        style="margin-top: 10px;"
        :current-page="page.current"
        :page-sizes="[10, 20]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { projectApi } from '@/views/system/api/project'

export default {
  name: 'SystemProjectList',
  data() {
    return {
      searchLoading: false,
      tableLoading: false,
      formData: {
        name: '',
        date: '',
        type: ''
      },
      page: {
        current: 1,
        size: 10, // 每页条数 必须与page-sizes一致
        total: 0 // 总数
      },
      isLoading: false,
      projectList: []
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    },
    // 项目类型
    projectTypeList() {
      return this.$getArgList('projectType')
    },
    // 可用项目类型列表
    projectTypePower() {
      return this.$store.state.userPower.projectTypeList
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.tableLoading = true
      this.searchLoading = true
      const param = Object.assign(this.formData, {
        page: this.page.current,
        rows: this.page.size
      })
      projectApi
        .queryProject(param)
        .then(res => {
          this.projectList = res.data.records
          this.page.total = res.data.total
        })
        .finally(() => {
          this.tableLoading = false
          this.searchLoading = false
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
    onSearchProject() {
      this.getTableData()
    },
    onTypeChange(e) {
      this.getTableData()
    },
    handleDelete(row) {
      this.$confirm('确认删除项目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          projectApi.deleteProject(row.id).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getTableData()
            } else {
              this.$message.warning('删除失败')
            }
          })
        })
        .catch(() => {}) // 不写catch,取消时会报错
    },
    onReset() {
      // for in    eslint报错
      this.formData.type = ''
      this.formData.name = ''
      this.formData.date = ''
      this.getTableData()
    },
    handleOpenNewProject() {
      this.$router.push({
        path: '/system/project/project-add'
      })
    },
    // 跳转工地2.0后台
    async toProject(item) {
      const result = await projectApi.getProjectPower(item.id, item.projectUserCategory === 1)
      const datas = result.data || []
      if (datas.length === 0) {
        this.$message.error('项目还未授权')
        return
      }
      this.$store.commit('toProject', {
        projectItem: item
      })
    },
    // 项目详情
    handleToDetails(row) {
      this.$router.push({
        path: `/system/project/project-details?projectId=${row.id}&projectUserCategory=${row.projectUserCategory}`
      })
    },
    // 编辑项目
    handleToEdit(row) {
      this.$router.push({
        path: `/system/project/project-edit?projectId=${row.id}`
      })
    },
    // 跳转项目角色配置
    handleToRole(row) {
      this.$router.push({
        path: `/system/project-role-set?projectId=${row.id}&type=${row.type}`
      })
    },
    // 项目机构管理
    handleToManage(row) {
      this.$router.push({
        path: `/system/project-department-manage`,
        query: {
          projectId: row.id,
          projectName: row.name
        }
      })
    },
    // 项目机构图
    handleToMap(row) {
      this.$router.push({
        path: `/system/project/settings/${row.projectUserCategory === 2 ? 'myProject' : 'projectHasMe'}`,
        query: {
          projectId: row.id,
          projectName: row.name,
          viewMode: '2'
        }
      })
    },
    // 参与方配置
    handleToParties(row) {
      this.$router.push({
        path: `/system/project/settings/myProject?projectId=${row.id}`
      })
    }
  }
}
</script>
<style lang="less" scoped>
.project-icon {
  width: 20px;
  height: 20px;
}
.pager-wrap {
  display: flex;
  justify-content: space-between;
}
</style>
