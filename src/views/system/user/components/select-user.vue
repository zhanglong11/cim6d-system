<template>
  <el-select :value="value" placeholder="请输入员工姓名" filterable @change="handleChange">
    <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script>
export default {
  name: 'SelectUser',
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    disabledKeys: {
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
  created() {
    this.axios.system.post('cim6d/system/user/query', {}).then(res => {
      res.data.forEach(e => {
        e.label = e.userRealName + ' ' + e.mobile
        e.value = e.userId
      })
      if (_.size(this.disabledKeys)) {
        res.data = res.data.filter(e => !this.disabledKeys.includes(e.value))
      }
      this.list = res.data
    })
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value)
      const target = _.find(this.list, { value })
      this.$emit('update:mobile', target.mobile)
    }
  }
}
</script>
