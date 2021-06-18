<!--/**
任务名称：2689/ 基础服务-用户管理（react->vue）迁移
开发人员：李建敏
日期：2020-3月-25日
任务类型：2.复制代码
**/-->
<template>
  <div>
    <span class="status-point" :style="{ backgroundColor: activeOption.color }" />
    <span>{{ activeOption.label }}</span>
  </div>
</template>

<script>
export default {
  name: 'Status',
  props: {
    options: {
      type: Array,
      default() {
        return [
          { color: '#BFBFBF', value: 0, label: '停用' },
          { color: '#009944', value: 1, label: '正常' }
        ]
      }
    },
    value: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    activeOption() {
      return _.find(this.options, { value: this.value }, this.options[0]) || { label: '未知' }
    }
  }
}
</script>

<style scoped lang="less">
.status-point {
  width: 7px;
  height: 7px;
  display: inline-block;
  border-radius: 50%;
  & + span {
    margin-left: 5px;
  }
}
</style>
