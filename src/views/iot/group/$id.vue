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
    <h1>{{ form.name }}</h1>
    <ul class="info-list">
      <li>
        <span>ProductKey：{{ form.productKey }}</span>
        <a v-clipboard="() => form.productKey">复制</a>
      </li>
      <li>
        <span>ProductSecret：**************</span>
        <a @click="resetSecret">重置</a>
        <a v-clipboard="() => form.productSecret">复制</a>
      </li>
      <li>
        <span>设备数：{{ form.deviceNum }}</span>
        <a>前往管理</a>
      </li>
    </ul>
    <el-tabs>
      <el-tab-pane label="分组信息">
        <table class="info-table">
          <tbody>
            <tr>
              <td>产品名称</td>
              <td>{{ form.name }}</td>
              <td>节点类型</td>
              <td>{{ $getLabel(productTypeList, form.type) }}</td>
              <td>创建时间</td>
              <td>{{ form.createTime }}</td>
            </tr>
            <!-- <tr>
              <td>所属品类</td>
              <td>{{ form.templateName }}</td>
              <td>数据格式</td>
              <td>-</td>
              <td>认证方式</td>
              <td>-</td>
            </tr>
            <tr>
              <td>
                动态注册&nbsp;<el-tooltip title="{Hint.form.DONGTAIZHUCE}"
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
              <td>{{ form.templateName }}</td>
              <td>产品描述</td>
              <td colSpan="3">{{ form.description ? form.description : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane lazy label="设备列表">
        <DeviceList />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import productTypeList from '../lib/productTypeList'
import DeviceList from './components/DeviceList'
export default {
  name: 'IotGroupDetail',
  components: { DeviceList },
  data() {
    return {
      form: {
        projectId: localStorage.getItem('projectId'),
        productSecret: ''
      },
      productTypeList,
      rules: {
        name: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {
    if (this.id) {
      this.axios.iot.get('group/get/' + this.id).then(res => {
        this.form = res.data
      })
    }
  },
  methods: {
    resetSecret() {},
    release() {}
  }
}
</script>

<style scoped lang="less">
h1 {
  line-height: 16px;
  font-size: 16px;
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
    padding: 0px 10px;
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
