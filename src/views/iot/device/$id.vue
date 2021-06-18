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
    <h1>
      {{ device.name }}
      <a style="font-size: 14px; margin-left: 5px;" @click="updateStatus(device.id, +!device.status)">{{
        device.status === 0 ? '启用' : '禁用'
      }}</a>
    </h1>
    <ul class="info-list">
      <li>
        <span>产品：{{ device.productName }}</span>
        <router-link :to="'../product/' + device.productId">查看</router-link>
      </li>
      <li>
        <span>ProductKey：{{ device.productKey }}</span>
        <a v-clipboard="() => device.productKey">复制</a>
      </li>
      <li>
        <span>DeviceSecret：**************</span>
        <a v-clipboard="() => device.deviceSecret">复制</a>
      </li>
    </ul>
    <el-tabs style="margin-top: 10px;">
      <el-tab-pane label="产品信息">
        <table class="info-table">
          <tbody>
            <tr>
              <td>产品名称</td>
              <td>{{ device.productName }}</td>
              <td>ProductKey</td>
              <td>{{ device.productKey }} <a v-clipboard="() => device.productKey">复制</a></td>
              <td>区域</td>
              <td>华东2（上海）</td>
            </tr>
            <tr>
              <td>节点类型</td>
              <td>设备</td>
              <td>DeviceName</td>
              <td>{{ device.name }} <a v-clipboard="() => device.name">复制</a></td>
              <td>认证方式</td>
              <td>设备密钥</td>
            </tr>
            <tr>
              <td>
                备注名称
                <el-tooltip :content="Hint.device.BEIZHUMINGCHENG"><el-icon class="el-icon-question" /></el-tooltip>
              </td>
              <td>{{ device.remark !== '' ? device.remark : '-' }} <a @click="editAlias">编辑</a></td>
              <td>IP地址</td>
              <td>-</td>
              <td>固件版本</td>
              <td>-</td>
            </tr>
            <tr>
              <td>添加时间</td>
              <td>{{ device.createTime }}</td>
              <td>激活时间</td>
              <td>-</td>
              <td>最后上线时间</td>
              <td>{{ device.lastAccessTime }}</td>
            </tr>
            <tr>
              <td>当前状态</td>
              <td>{{ device.deleteFlag === 0 ? '启用' : '禁用' }}</td>
              <td>
                实时延迟
                <el-tooltip :content="Hint.device.SHISHIYANCHI"><el-icon class="el-icon-question" /></el-tooltip>
              </td>
              <td colSpan="{3}"><a>测试</a></td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane lazy label="Topic类列表">
        <Topic />
      </el-tab-pane>
      <el-tab-pane lazy label="运行状态"><RunStatus :device="device" /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Topic from './components/Topic'
import RunStatus from './components/RunStatus'
import Hint from '../Hint'
export default {
  name: 'IotDeviceDetail',
  components: { Topic, RunStatus },
  data() {
    return {
      device: {
        projectId: localStorage.getItem('projectId'),
        deviceSecret: ''
      },
      Hint,
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
      this.refresh()
    }
  },
  methods: {
    refresh() {
      this.axios.iot.get('device/get/' + this.id).then(res => {
        this.device = res.data
      })
    },
    editAlias() {
      this.$prompt('备注名称', '编辑备注名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async ({ value }) => {
        await this.axios.iot.post('device/update', { ids: [this.id], remark: value })
        this.$message.success('编辑成功')
        this.refresh()
      })
    },
    updateStatus(id, status) {
      this.axios.iot.post('device/update', { ids: [id], status }).then(() => {
        this.$message.success('操作成功')
        this.refresh()
      })
    }
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
