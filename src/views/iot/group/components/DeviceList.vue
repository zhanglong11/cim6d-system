<template>
  <!--
  /**
  任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
  开发人员：李建敏
  日期：2020-4月-9日
  任务类型：1、全新代码
  **/
  -->
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="设备名称">
          <el-input
            v-model="filterForm.name"
            style="width: 300px;"
            placeholder="请输入设备名称"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="danger" @click="remove(selectedList)">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addDeviceToGroupDialogVisible = true">
          添加设备到分组
        </el-button>
      </div>
    </div>

    <Grid
      ref="table"
      :request="request"
      :filter-form.sync="filterForm"
      @checkboxChange="({ selection }) => (selectedList = selection)"
    >
      <vxe-table-column type="checkbox" width="60px"></vxe-table-column>
      <vxe-table-column field="name" title="设备名称"></vxe-table-column>
      <vxe-table-column field="productName" title="设备所属产品"></vxe-table-column>
      <vxe-table-column field="status" title="状态">
        <template v-slot="{ row }">
          <Status :value="row.status"></Status>
        </template>
      </vxe-table-column>
      <vxe-table-column field="lastAccessTime" title="最后上线时间"></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="$router.push('device/' + row.id)">查看</el-button>
          <el-button type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <AddDeviceToGroup :visible.sync="addDeviceToGroupDialogVisible"></AddDeviceToGroup>
  </div>
</template>

<script>
import AddDeviceToGroup from './AddDeviceToGroup'
export default {
  name: 'DeviceList',
  components: { AddDeviceToGroup },
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId'),
        groupId: this.$route.params.id
      },
      request(body) {
        return this.axios.iot.post('device/list', { ...body, projectId: localStorage.getItem('projectId') })
      },
      addDeviceToGroupDialogVisible: false,
      selectedList: []
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    remove(list) {
      this.$remove(idList => {
        this.axios.iot.post('group/device/unbind/' + this.id, idList)
      }, list).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less"></style>
