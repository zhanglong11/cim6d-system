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
        <el-form-item label="产品名称">
          <SelectProduct v-model="filterForm.productId" has-all />
        </el-form-item>
        <el-form-item>
          <ul class="statistics">
            <li>
              <div>
                设备总数
                <el-tooltip :content="Hint.device.SHEBEIZONGSHU"><el-icon class="el-icon-question" /></el-tooltip>
              </div>
              <div>{{ statistics.totalNum }}</div>
            </li>
            <li>
              <div>
                激活设备
                <el-tooltip :content="Hint.device.JIHUOSHEBEI"><el-icon class="el-icon-question" /></el-tooltip>
              </div>
              <div>{{ statistics.activeNum }}</div>
            </li>
            <li>
              <div>
                当前在线
                <el-tooltip :content="Hint.device.ZAIXIANSHEBEI"><el-icon class="el-icon-question" /></el-tooltip>
              </div>
              <div>{{ statistics.onlineNum }}</div>
            </li>
          </ul>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs>
      <el-tab-pane label="设备列表">
        <div class="tooltips">
          <el-form inline @submit.native.prevent>
            <el-form-item label="设备名称">
              <el-input v-model="filterForm.name" @keyup.enter.native="refresh" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
          <div>
            <el-button
              v-if="$hasPower('IotDeviceBatchDelete')"
              :disabled="!selectedList.length"
              @click="remove(selectedList)"
              >批量删除</el-button
            >
            <el-button
              v-if="$hasPower('IotDeviceBatchDisable')"
              :disabled="!selectedList.length"
              @click="bulkUpdateStatus(selectedList, 0)"
              >批量禁用</el-button
            >
            <el-button
              v-if="$hasPower('IotDeviceBatchDisable')"
              :disabled="!selectedList.length"
              @click="bulkUpdateStatus(selectedList, 1)"
              >批量启用</el-button
            >
            <el-button
              v-if="$hasPower('IotDeviceAdd')"
              type="primary"
              icon="el-icon-plus"
              @click="editDialogVisible = true"
              >添加设备</el-button
            >
          </div>
        </div>

        <Grid
          ref="table"
          :request="request"
          :filter-form.sync="filterForm"
          @checkboxChange="({ selection }) => (selectedList = selection)"
        >
          <vxe-table-column type="checkbox" width="60px" />
          <vxe-table-column field="name" title="设备名称" />
          <vxe-table-column field="remark" title="备注名称" />
          <vxe-table-column field="productName" title="设备所属产品" />
          <vxe-table-column
            width="120px"
            field="type"
            title="节点类型"
            :formatter="({ cellValue }) => $getLabel(productTypeList, cellValue)"
          />
          <vxe-table-column field="status" title="状态" width="120px">
            <template v-slot="{ row }">
              <Status :value="row.status" />
            </template>
          </vxe-table-column>
          <vxe-table-column field="lastAccessTime" title="最后上线时间" width="180px" />
          <vxe-table-column title="操作" width="140px">
            <template v-slot="{ row }">
              <el-button v-if="$hasPower('IotDeviceDetails')" type="text" @click="$router.push('device/' + row.id)"
                >查看</el-button
              >
              <template v-if="$hasPower('IotDeviceDisable')">
                <el-button v-if="row.status === 0" type="text" @click="bulkUpdateStatus([row], 1)">启用</el-button>
                <el-button v-else type="text" @click="bulkUpdateStatus([row], 0)">禁用</el-button>
              </template>
              <el-button v-if="$hasPower('IotDeviceDelete')" type="text" @click="remove([row])">删除</el-button>
            </template>
          </vxe-table-column>
        </Grid>
      </el-tab-pane>
      <el-tab-pane lazy label="批次管理">
        <Grid :request="batchRequest">
          <vxe-table-column title="产品名称" field="name" />
          <vxe-table-column title="ProductKey" field="key" />
          <vxe-table-column title="添加时间" field="date" />
          <vxe-table-column title="添加数量" field="num" />
          <vxe-table-column title="操作">
            <template v-slot="{ row }">
              <el-button type="text" :a="row.a">详情</el-button>
              <el-button type="text">下载CSV</el-button>
            </template>
          </vxe-table-column>
        </Grid>
      </el-tab-pane>
    </el-tabs>
    <Edit :visible.sync="editDialogVisible" />
  </div>
</template>

<script>
import productTypeList from '../lib/productTypeList'
import SelectProduct from '../components/SelectProduct'
import Hint from '@/views/iot/Hint'
import Edit from './components/Edit'
export default {
  name: 'IotDevice',
  components: { SelectProduct, Edit },
  data() {
    return {
      filterForm: {
        productId: this.$route.query.productId,
        projectId: localStorage.getItem('projectId')
      },
      productTypeList,
      request(body) {
        return this.axios.iot.post('device/list', body)
      },
      batchRequest() {
        return Promise.resolve({
          total: 1,
          records: [{ id: '1', name: '产品名称B', key: 'a1JQT0LLieH', date: '2019-11-08 19:22:05', num: '1' }]
        })
      },
      selectedList: [],
      Hint,
      statistics: {},
      editDialogVisible: false
    }
  },
  watch: {
    'filterForm.productId'() {
      this.refresh()
      this.getStatistics()
    }
  },
  created() {
    this.getStatistics()
  },
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    // 获取统计数据
    getStatistics() {
      this.axios.iot.post('device/statistics', { productId: this.filterForm.productId }).then(res => {
        this.statistics = res.data
      })
    },
    remove(list) {
      this.$remove(idList => {
        return this.axios.iot.post('device/delete', idList)
      }, list).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    },
    bulkUpdateStatus(list, status) {
      const ids = list.map(e => e.id)
      this.$confirm(
        `确定要${['禁用', '启用'][status]} ` +
          list.map(e => `<span style="color:red;padding:4px;">${e.name}</span>`).join(' ') +
          ' 吗？',
        { dangerouslyUseHTMLString: true, type: 'warning' }
      ).then(() => {
        this.axios.iot.post('device/update', { ids, status }).then(() => {
          this.$message.success('操作成功')
          this.refresh()
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.tooltips {
  .el-form {
    display: flex;
    align-items: center;
  }
}
.statistics {
  display: flex;
  align-items: center;
  margin-bottom: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  > li {
    border-left: solid 1px #e5e5e5;
    margin-left: 40px;
    padding-left: 20px;
    width: 140px;

    > div {
      padding: 4px 0;
    }

    > div:nth-child(2) {
      font-weight: bold;
    }
  }
}
</style>
