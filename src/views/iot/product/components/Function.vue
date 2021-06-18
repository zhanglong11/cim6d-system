<!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-9日
任务类型：1、全新代码
**/
-->
<!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-11日
任务类型：2、修改代码（50%）
**/
-->
<template>
  <div>
    <div class="tooltips">
      <h2>
        功能列表
        <el-tooltip :content="activeName === 'normal' ? Hint.product.NORM_FUNCTION : Hint.product.CUSTOM_FUNCTION">
          <el-icon class="el-icon-question"></el-icon>
        </el-tooltip>
      </h2>
      <el-button v-if="activeName === 'normal'" type="primary" @click="functionNormalAddDialogVisible = true">
        添加标准功能
      </el-button>
      <el-button v-else type="primary" @click="addCustomFunction">添加自定义功能</el-button>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="标准功能" name="normal"></el-tab-pane>
      <el-tab-pane lazy label="自定义功能" name="custom"></el-tab-pane>
    </el-tabs>
    <Grid ref="table" :request="request">
      <vxe-table-column title="功能类型" field="funType" :formatter="() => '属性'"></vxe-table-column>
      <vxe-table-column title="功能名称" field="name"></vxe-table-column>
      <vxe-table-column title="标识符" field="attributeIdentifier"></vxe-table-column>
      <vxe-table-column title="数据类型" field="dataType"></vxe-table-column>
      <vxe-table-column
        title="数据定义"
        min-width="300px"
        field="dataType"
        :formatter="definitionFormatter"
      ></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="editNormal(row)">编辑</el-button>
          <el-button type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <FunctionNormalAdd :product="product" :visible.sync="functionNormalAddDialogVisible"></FunctionNormalAdd>
    <FunctionEdit :data="activeFunction" :product="product" :visible.sync="functionEditDialogVisible"></FunctionEdit>
  </div>
</template>

<script>
import Hint from '../../Hint'
import FunctionNormalAdd from './FunctionNormalAdd'
import FunctionEdit from './FunctionEdit'
export default {
  name: 'Function',
  components: { FunctionNormalAdd, FunctionEdit },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      request: body => {
        const customFlag = this.activeName === 'normal' ? '0' : '1'
        return this.axios.iot
          .post('product/attribute/list', {
            ...body,
            customFlag,
            projectId: localStorage.getItem('projectId'),
            productId: this.$route.params.id
          })
          .then(res => {
            res.data.records.forEach(e => (e.customFlag = customFlag))
            return res
          })
      },
      activeName: 'normal',
      Hint,
      functionNormalAddDialogVisible: false,
      functionEditDialogVisible: false,
      activeFunction: {}
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  watch: {
    activeName() {
      this.refresh()
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    editNormal(row) {
      this.activeFunction = row
      this.functionEditDialogVisible = true
    },
    submit() {},
    remove(list) {
      this.$remove(idList => {
        return this.axios.iot.get('product/attribute/delete/' + idList.join(','))
      }, list).then(res => this.refresh())
    },
    definitionFormatter({ row }) {
      if (row.dataType === 'int' || row.dataType === 'float' || row.dataType === 'double') {
        return `取值范围：[${row.minVal !== null ? row.minVal : '未设置'},${
          row.maxVal !== null ? row.maxVal : '未设置'
        }]`
      } else if (row.dataType === 'bool') {
        if (row.boolVal !== null) {
          return `布尔值：${row.boolVal}`
        } else {
          return '布尔值：0-未设置,1-未设置'
        }
      } else if (row.dataType === 'string') {
        if (row.strLength !== null) {
          return `数据长度：${row.strLength}`
        } else {
          return '数据长度：未设置'
        }
      } else if (row.dataType === 'enum') {
        if (row.enumVal !== null) {
          return row.enumVal
        } else {
          return '枚举值：未设置'
        }
      }
    },
    addCustomFunction() {
      this.activeFunction = {}
      this.functionEditDialogVisible = true
    }
  }
}
</script>

<style scoped lang="less">
.el-tabs {
  /deep/ .el-tabs__content {
    height: 0;
    padding: 0;
  }
}
</style>
