<template>
  <!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-9日
任务类型：1、全新代码
**/
-->
  <el-dialog :visible="visible" title="添加设备" width="920px" @close="close">
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="产品名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
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
      <vxe-table-column field="status" title="状态" width="120px">
        <template v-slot="{ row }">
          <Status :value="row.status"></Status>
        </template>
      </vxe-table-column>
      <vxe-table-column field="lastAccessTime" title="最后上线时间" width="180px"></vxe-table-column>
    </Grid>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :disabled="!selectedList.length" @click="submit">添加</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'Edit',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      filterForm: {},
      request(body) {
        return this.axios.iot.post('device/list', body)
      },
      selectedList: []
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  mounted() {},
  methods: {
    submit() {
      this.axios.iot
        .post(
          'group/device/bind/' + this.id,
          this.selectedList.map(e => e.id)
        )
        .then(res => {
          this.$message.success('添加成功')
          this.close()
          this.$parent.refresh()
        })
    },
    close() {
      this.selectedList = []
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less"></style>
