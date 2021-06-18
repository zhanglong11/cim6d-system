<!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-14日
任务类型：1、全新代码
**/
-->
<template>
  <el-dialog :visible="visible" title="查看数据" width="680px" @close="close">
    <div class="tooltips">
      <div>
        <el-select v-model="timeType" style="width: 90px; margin-bottom: 15px;">
          <el-option :value="1" label="1小时"></el-option>
          <el-option :value="2" label="24小时"></el-option>
          <el-option :value="3" label="7天"></el-option>
          <el-option :value="4" label="自定义"></el-option>
        </el-select>
        <el-date-picker
          v-if="timeType === 4"
          v-model="timeDuration"
          style="margin-left: 15px;"
          type="daterange"
        ></el-date-picker>
      </div>

      <el-radio-group v-model="viewMode" style="margin-bottom: 15px;">
        <el-radio-button :label="1">表格</el-radio-button>
        <el-radio-button :label="2">图表</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="viewMode === 1">
      <vxe-table max-height="600px" :data="list">
        <vxe-table-column title="时间" field="time"></vxe-table-column>
        <vxe-table-column title="原始值" field="value"></vxe-table-column>
      </vxe-table>
    </div>
    <div v-else>
      <v-chart :options="chartOptions" />
    </div>
    <footer slot="footer">
      <el-button @click="close">关闭</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'ViewData',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    attr: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      viewMode: 1,
      timeType: 1,
      timeDuration: [],
      form: {
        // deviceId: this.$route.params.id,
        deviceId: '344d89cd94b6475e9238c1cfafdb0bb7',
        endTime: '',
        metricList: [],
        startTime: ''
      },
      chartOptions: {
        title: {
          text: this.attr.name
        },
        tooltip: {},
        legend: {
          data: [this.attr.name]
        },
        xAxis: {
          data: ['8:00', '12:00', '16:00']
        },
        yAxis: {},
        series: [
          {
            name: this.attr.name,
            type: 'line',
            data: [15, 20, 36]
          }
        ]
      },
      list: []
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  watch: {
    visible() {
      if (this.visible && this.id) {
        // this.form.metricList = [this.attr.attributeIdentifier]
        this.form.metricList = ['PH']
        this.refresh()
      }
    },
    timeType: {
      immediate: true,
      handler(val) {
        if (val === 1) {
          this.form.startTime = moment().add(-1, 'hours').format('YYYY-MM-DD HH:mm:ss')
          this.form.endTime = moment().format('YYYY-MM-DD HH:mm:ss')
        } else if (val === 2) {
          this.form.startTime = moment().add(-24, 'hours').format('YYYY-MM-DD HH:mm:ss')
          this.form.endTime = moment().format('YYYY-MM-DD HH:mm:ss')
        } else if (val === 3) {
          this.form.startTime = moment().add(-7, 'days').format('YYYY-MM-DD HH:mm:ss')
          this.form.endTime = moment().format('YYYY-MM-DD HH:mm:ss')
        }
        this.visible && this.refresh()
      }
    }
  },

  mounted() {},
  methods: {
    refresh() {
      this.axios.iot.post('time/productInterval', this.form).then(res => {
        let target = _.find(res.data, { metric: 'PH' })
        if (target) {
          this.list = _.map(target.dps, (v, k) => ({ time: moment(k * 1000).format('YYYY-MM-DD HH:mm:ss'), value: v }))
          this.chartOptions.xAxis.data = this.list.map(e => e.time)
          this.chartOptions.series[0].data = this.list.map(e => e.value)
        }
      })
    },
    async submit() {
      await this.axios.iot.post('device/add', this.form).then(res => {
        this.$message.success('添加成功')
      })
      this.close()
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less"></style>
