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
        <el-form-item label="流程实例名称" prop="processInstanceName">
          <el-input v-model="filterForm.processInstanceName" placeholder="请搜索">
            <el-button slot="append" size="mini" icon="el-icon-search" @click="refresh(true)" />
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" auto-search :filter-form.sync="filterForm" :request="request">
      <!-- <vxe-table-column field="processInstanceId" title="ID" /> -->
      <vxe-table-column field="processInstanceName" title="流程实例名称">
        <template slot-scope="scope">
          <router-link to="" @click.native="viewTask(scope.row, 1)">{{ scope.row.processInstanceName }}</router-link>
        </template>
      </vxe-table-column>
      <vxe-table-column field="processDefinitionName" title="流程定义名称" />
      <vxe-table-column field="startUserName" title="申请人" />
      <vxe-table-column field="taskStatus" title="流程状态">
        <template slot-scope="scope">
          {{ scope.row.endTime ? '已结束' : '进行中' }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="startTime" title="创建时间" />
      <vxe-table-column field="endTime" title="结束时间" />
      <vxe-table-column title="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="viewTask(scope.row, 1)">详情</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import { approvalApi } from '@/views/approval/api/approval'
export default {
  name: 'Mine',
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
      filterForm: {},
      request: body => {
        return this.axios.form.post('activiti/process/instance/started', body).then(res => res.data)
      },
      projectDataList: [] // 项目列表
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

<style lang="less" scoped></style>
