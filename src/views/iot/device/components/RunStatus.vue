<template>
  <!--
  /**
  任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
  开发人员：李建敏
  日期：2020-4月-10日
  任务类型：1、全新代码
  **/
  -->
  <div>
    <div class="tooltips" style="margin-bottom: 15px;">
      <h2>
        功能列表
        <el-tooltip :content="Hint.device.RUNSTATUS">
          <el-icon class="el-icon-question" />
        </el-tooltip>
      </h2>
      <div>
        <span style="color: #777; margin-right: 10px;">实时刷新</span>
        <el-switch v-model="immediate" />
        <el-radio-group v-model="viewMode" style="margin-left: 10px;" size="mini">
          <el-radio-button :label="1">图表</el-radio-button>
          <el-radio-button :label="2">表格</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div v-if="viewMode === 1">
      <div class="block-content">
        <div v-for="item in computedList" :key="item.id" class="block-item">
          <div>
            <div>{{ item.name }}</div>
            <a
              @click="
                () => {
                  activeRow = item
                  viewDataDialogVisible = true
                }
              "
              >查看数据</a
            >
          </div>
          <div>
            {{ item.latestVal || '--' }} <span v-if="item.text">({{ item.text }})</span>
          </div>
          <div>{{ item.latestTime || moment().format('YYYY-MMM-DD HH:mm:ss') }}</div>
        </div>
      </div>
    </div>
    <vxe-table v-else-if="viewMode === 2" ref="table" :data="computedList">
      <vxe-table-column field="name" title="属性名称" />
      <vxe-table-column field="dataType" title="数据类型" />
      <vxe-table-column field="date" title="更新时间" />
      <vxe-table-column field="latestVal" title="最新值" />
      <vxe-table-column field="expectVal" title="期望值" />
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button
            type="text"
            @click="
              () => {
                activeRow = row
                viewDataDialogVisible = true
              }
            "
            >查看数据</el-button
          >
        </template>
      </vxe-table-column>
    </vxe-table>
    <ViewData :attr="activeRow" :visible.sync="viewDataDialogVisible" />
  </div>
</template>

<script>
import Hint from '../../Hint'
import ViewData from './ViewData'
export default {
  name: 'RunningStatus',
  components: { ViewData },
  data() {
    return {
      device: {
        attributeList: []
      },
      immediate: false,
      viewMode: 1,
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      Hint,
      activeRow: {},
      viewDataDialogVisible: false
    }
  },
  computed: {
    computedList() {
      return this.device.attributeList.map(e => {
        if (e.dataType === 'bool') {
          e.text = e.boolVal.replace(/[01]-/g, '').split(',')[e.latestVal]
        } else if (['int', 'float', 'double'].includes(e.dataType)) {
          e.text = e.unit
        } else if (e.dataType === 'enum') {
          e.text =
            e.enumVal
              .split(',')
              .map(f => f.split('-'))
              .find(f => f[0] === e.latestVal)?.[1] || ''
        }
        return e
      })
    }
  },
  watch: {
    immediate(val) {
      if (val) {
        this.interval = setInterval(() => {
          this.refresh()
        }, 1000)
      } else {
        clearInterval(this.interval)
      }
    }
  },
  created() {
    this.refresh()
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    refresh() {
      this.axios.iot.get('device/get/' + this.$route.params.id).then(res => {
        this.device = res.data
      })
    },
    remove(list) {
      this.$remove(idList => {
        return this.axios.labour.get('company/delete/' + idList.join(','))
      }, list).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less">
.block-content {
  display: flex;
  flex-wrap: wrap;
  padding-top: 16px;
  padding-bottom: 1px;
  padding-right: 1px;
  .block-item {
    flex: 304px 0;
    border: solid 1px #e8e8e8;
    margin-right: -1px;
    margin-bottom: -1px;
    padding: 20px;
    > div:nth-child(1) {
      display: flex;
      justify-content: space-between;
    }
    > div:nth-child(2) {
      font-size: 20px;
      font-weight: bold;
      padding: 12px 0px;
    }
    > div:nth-child(3) {
      color: #999;
    }
  }
}
</style>
