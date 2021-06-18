<!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-9日
任务类型：1、全新代码
**/
-->
<template>
  <el-cascader
    :props="{
      label: 'name',
      value: 'id',
      emitPath: false
    }"
    :options="list"
    :value="value"
    @change="val => $emit('input', val)"
  ></el-cascader>
</template>

<script>
export default {
  name: 'SelectCategory',
  props: {
    hasAll: {
      type: Boolean,
      default: false
    },
    value: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.axios.iot.get('product/template/list', {}).then(res => {
      this.list = res.data
    })
  }
}
</script>
<style lang="less" scoped></style>
