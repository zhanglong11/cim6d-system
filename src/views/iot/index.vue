<template>
  <!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-9日
任务类型：1、全新代码
**/
-->
  <router-view></router-view>
</template>

<script>
export default {
  name: 'Iot',
  created() {
    this.$store.dispatch('iot/getGroupListTree')
  }
}
</script>

<style scoped lang="less"></style>
