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
    <h1>{{ product.name }}</h1>
    <ul class="info-list">
      <li>
        <span>ProductKey：{{ product.productKey }}</span>
        <a v-clipboard="() => product.productKey">复制</a>
      </li>
      <li>
        <span>ProductSecret：**************</span>
        <a @click="resetSecret">重置</a>
        <a v-clipboard="() => product.productSecret">复制</a>
      </li>
      <li>
        <span>设备数：{{ product.deviceNum }}</span>
        <router-link :to="'../device?productId=' + id">前往管理</router-link>
      </li>
    </ul>
    <el-tabs style="margin-top: 10px;">
      <el-tab-pane label="产品信息">
        <div class="tooltips">
          <h2>产品信息</h2>
          <el-button type="primary" @click="edit(id)">编辑</el-button>
        </div>
        <table class="info-table">
          <tbody>
            <tr>
              <td>产品名称</td>
              <td>{{ product.name }}</td>
              <td>节点类型</td>
              <td>{{ $getLabel(productTypeList, product.type) }}</td>
              <td>创建时间</td>
              <td>{{ product.createTime }}</td>
            </tr>
            <!-- <tr>
              <td>所属品类</td>
              <td>{{ product.templateName }}</td>
              <td>数据格式</td>
              <td>-</td>
              <td>认证方式</td>
              <td>-</td>
            </tr>
            <tr>
              <td>
                动态注册&nbsp;<el-tooltip title="{Hint.product.DONGTAIZHUCE}"
                  ><el-icon type="question-circle"
                /></el-tooltip>
              </td>
              <td>已关闭&nbsp;<el-switch /></td>
              <td>状态</td>
              <td>-</td>
              <td>连网协议</td>
              <td>-</td>
            </tr>-->
            <tr>
              <td>所属品类</td>
              <td>{{ product.templateName }}</td>
              <td>产品描述</td>
              <td colSpan="3">{{ product.description ? product.description : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane lazy label="Topic类列表">
        <Topic />
      </el-tab-pane>
      <el-tab-pane lazy label="功能定义">
        <Function :product="product" />
      </el-tab-pane>
    </el-tabs>
    <Edit :visible.sync="editDialogVisible" />
  </div>
</template>

<script>
import productTypeList from '../lib/productTypeList'
import Topic from './components/Topic'
import Function from './components/Function'
import Hint from '../Hint'
import Edit from './components/Edit'
export default {
  name: 'IotProductDetail',
  components: { Topic, Function, Edit },
  data() {
    return {
      product: {
        projectId: localStorage.getItem('projectId'),
        productSecret: ''
      },
      productTypeList,
      Hint,
      rules: {
        name: [{ required: true, message: '必填' }]
      },
      editDialogVisible: false
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {
    if (this.id) {
      this.refresh()
    }
  },
  methods: {
    refresh() {
      this.axios.iot.get('product/get/' + this.id).then(res => {
        this.product = res.data
      })
    },
    resetSecret() {
      this.$confirm(Hint.product.RESET_SECRET, { type: 'warning', title: '确定要重置吗?' }).then(res => {})
    },
    edit(id) {
      this.activeId = id
      this.editDialogVisible = true
    },
    release() {}
  }
}
</script>

<style scoped lang="less">
h1 {
  line-height: 16px;
  font-size: 16px;
}
.el-tabs {
  /deep/ h2 {
    font-weight: bold;
    margin-bottom: 17px;
  }
}
.info-list {
  display: flex;
  font-size: 14px;
  > * {
    width: 33.3%;
  }
  li > span:first-child {
    color: #777;
  }
  a {
    margin-left: 10px;
  }
}

.info-table {
  border: solid 1px #e5e5e5;
  width: 100%;
  font-size: 14px;
  line-height: 1;

  td {
    border: solid 1px #e5e5e5;
    height: 56px;
    padding: 0 10px;
  }

  td:nth-child(odd) {
    background-color: #fbfbfb;
    width: 10%;
  }
  td:nth-child(even) {
    width: 23.33%;
  }
}
</style>
