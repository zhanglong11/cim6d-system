<template>
  <el-select v-bind="$attrs" @change="val => $emit('input', val)">
    <template v-if="hasAll">
      <el-option :value="null" label="全部"> </el-option>
    </template>
    <el-option v-for="item in computedList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SelectArg',
  props: {
    hasAll: {
      type: Boolean,
      default: false
    },
    argGroup: {
      type: String,
      required: true
    },
    hiddenKeys: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    computedList() {
      let list = this.list
      if (this.hiddenKeys.length) {
        list = _.differenceBy(list, this.hiddenKeys, e => e.value || e)
      }
      return list
    }
  },
  watch: {
    argGroup: {
      immediate: true,
      handler() {
        this.axios.global.post('cim6d/arg/tree', { argGroup: this.argGroup }).then(res => {
          this.list = _.get(res.data, '0.children', []).map(e => ({ label: e.argText, value: e.argCode }))
        })
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
