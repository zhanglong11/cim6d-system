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
      <el-form inline @submit.native.prevent>
        <el-form-item label="产品名称">
          <el-input
            v-model="filterForm.name"
            style="width: 300px;"
            placeholder="请输入"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
          <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div v-if="$hasPower('IotProductAdd')">
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('product/new')">创建产品</el-button>
      </div>
    </div>

    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column field="name" title="产品名称" />
      <vxe-table-column field="productKey" title="ProductKey" />
      <vxe-table-column
        field="type"
        title="节点类型"
        :formatter="({ cellValue }) => $getLabel(productTypeList, cellValue)"
      />
      <vxe-table-column field="createTime" title="添加时间" />
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button v-if="$hasPower('IotProductDetails')" type="text" @click="$router.push('product/' + row.id)"
            >查看</el-button
          >
          <el-button v-if="$hasPower('IotProductEdit')" type="text" @click="$router.push('device?productId=' + row.id)"
            >管理设备</el-button
          >
          <el-button v-if="$hasPower('IotProductDelete')" type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import productTypeList from '../lib/productTypeList'
export default {
  name: 'IotProduct',
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      productTypeList,
      request(body) {
        return this.axios.iot.post('product/list', body)
      }
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
        return this.axios.iot.get('product/delete/' + idList.join(','))
      }, list).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less"></style>
