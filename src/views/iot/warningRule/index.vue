<template>
  <!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-11日
任务类型：1、全新代码
**/
-->
  <div style="background-color: unset; padding: 0;">
    <el-row type="flex" :gutter="20">
      <el-col style="width: 260px;">
        <el-tree
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          :data="treeData"
          :props="{ label: 'name', value: 'id' }"
          @current-change="group => (activeGroupId = group.id)"
        />
      </el-col>
      <el-col class="main-content">
        <div>
          <div class="tooltips">
            <el-form inline>
              <el-form-item label="产品名称">
                <SelectProduct v-model="filterForm.productId" />
              </el-form-item>
              <el-form-item label="设备名称">
                <el-input v-model="filterForm.name" suffix-icon="el-icon-search" @keyup.enter.native="refresh" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
                <el-button @click="reset">重置</el-button>
              </el-form-item>
            </el-form>
            <el-button
              v-if="$hasPower('IotWarningRuleCopy')"
              type="primary"
              :disabled="!selectedRow"
              @click="copyRuleDialogVisible = true"
              >复制</el-button
            >
          </div>
          <Grid
            ref="table"
            :request="request"
            :filter-form.sync="filterForm"
            @radioChange="({ row }) => (selectedRow = row)"
          >
            <vxe-table-column type="radio" width="60px" />
            <vxe-table-column title="设备名称" field="name" />
            <vxe-table-column title="产品名称" field="productName" />
            <vxe-table-column
              title="节点类型"
              field="type"
              :formatter="({ cellValue }) => $getLabel(productTypeList, cellValue)"
            />
            <vxe-table-column title="状态" field="status" />
            <vxe-table-column title="最后上线时间" field="lastAccessTime" />
            <vxe-table-column title="操作">
              <template v-slot="{ row }">
                <el-button v-if="$hasPower('IotWarningRuleSet')" type="text" @click="editRule(row)">规则设置</el-button>
              </template>
            </vxe-table-column>
          </Grid>
        </div>
      </el-col>
    </el-row>
    <Edit :device="activeDevice" :visible.sync="editDialogVisible" />
    <CopyRule :device="selectedRow" :visible.sync="copyRuleDialogVisible" />
  </div>
</template>

<script>
import productTypeList from '../lib/productTypeList'
import SelectProduct from '../components/SelectProduct'
import Edit from './components/Edit'
import CopyRule from './components/CopyRule'
export default {
  name: 'IotWarningRule',
  components: { Edit, SelectProduct, CopyRule },
  data() {
    return {
      treeData: [],
      filterForm: {
        groupId: null
      },
      activeGroupId: null,
      productTypeList,
      request: body => {
        return this.axios.iot.post('device/list', { ...body, groupId: this.activeGroupId })
      },
      selectedRow: null,
      activeDevice: {},
      editDialogVisible: false,
      copyRuleDialogVisible: false
    }
  },
  watch: {
    activeGroupId() {
      this.refresh()
    }
  },
  created() {
    this.axios.iot.post('group/list', {}).then(res => {
      this.treeData = res.data
    })
  },
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    submit() {},
    remove() {},
    editRule(row) {
      this.activeDevice = row
      this.editDialogVisible = true
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less">
.el-row {
  justify-content: stretch;
  .el-col > div {
    height: 100%;
    padding: 15px;
    background-color: #fff;
  }
}
</style>
