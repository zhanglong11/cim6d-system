<template>
  <div>
    <div class="tooltips">
      <el-form ref="filterForm" :model="filterForm" inline>
        <el-form-item label="流程状态" prop="processStatus">
          <el-select v-model="filterForm.processStatus" clearable>
            <el-option :value="0" label="进行中" />
            <el-option :value="1" label="已结束" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="filterForm.name" placeholder="请搜索">
            <el-button slot="append" size="mini" icon="el-icon-search" @click="refresh(true)" />
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" auto-search :filter-form.sync="filterForm" :request="request">
      <!-- <vxe-table-column field="taskId" title="ID" /> -->
      <vxe-table-column field="tenantName" title="项目名称" />
      <vxe-table-column field="taskName" title="流程实例名称">
        <template slot-scope="scope">
          <router-link to="" @click.native="viewTask(scope.row, 0)">{{ scope.row.taskName }}</router-link>
        </template>
      </vxe-table-column>
      <vxe-table-column field="processDefinitionName" title="流程定义名称" />
      <vxe-table-column field="applyUserName" title="申请人" />
      <vxe-table-column field="taskStatus" title="流程状态">
        待审批
      </vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column title="操作" width="170px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="viewTask(scope.row, 0)">审批</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import { approvalApi } from '@/views/approval/api/approval'
export default {
  name: 'Todo',
  components: {},
  props: {
    // 是否是工作台操作
    isWorkBench: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editDialogVisible: false,
      activeTask: {},
      filterForm: {
        sortField: 'createTime',
        sortValue: 'desc',
        taskStatus: 0
      },
      request: body => {
        return this.axios.form.post('task/list', body).then(res => res.data) // res.data
      }
    }
  },
  watch: {
    'filterForm.processStatus'(val) {
      localStorage.setItem('lastSelectProcessStatus', val)
    }
  },
  mounted() {
    this.queryProjectList() // 获取项目列表
  },
  methods: {
    // 刷新 列表
    refresh() {
      this.$refs.table.refresh()
    },
    agree(row) {
      this.axios.form.post('task/complete/' + row.taskId, {})
      this.refresh()
    },
    // 获取项目列表
    async queryProjectList() {
      const result = await approvalApi.queryProjectList({ page: 1, rows: 999 })
      const datas = (result.data && result.data.records) || []
      this.projectDataList = datas
    },
    // 查看任务
    viewTask(item, index) {
      this.$store.commit('toTaskDetails', {
        processDefinitionCategory: item.processDefinitionCategory || item.processDefinitionKey,
        projectId: item.projectId || item.tenantId, // 项目id
        targetId: item.targetId, // 业务主键id
        index // 0 跳转审批 1查看详情
      })
    }
  }
}
</script>
