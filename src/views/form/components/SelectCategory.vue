<!--/**
任务名称：2747/ 自定义表单：表单分类、表单功能开发
开发人员：李建敏
日期：2020-3月-27日
任务类型：1.全新代码
**/-->
<template>
  <TreeSelect
    :value="value || null"
    :options="computedList"
    label="name"
    loading-text="加载中..."
    no-options-text="没有选项..."
    no-results-text="没有匹配的选项..."
    placeholder="请选择"
    :always-open="alwaysOpen"
    :append-to-body="appendToBody"
    :multiple="multiple"
    flat
    style="width: 200px;"
    :disabled="disabled || (elForm || {}).disabled"
    @input="val => $emit('input', val || 0)"
  />
</template>

<script>
import treeForEach from '@/utils/treeForEach'
import treeFilter from '@/utils/treeFilter'
export default {
  name: 'SelectProcessCategory',
  props: {
    value: {
      type: [Array, String, Number],
      default: null
    },
    disableKeys: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    alwaysOpen: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    valueKey: {
      type: String,
      default: 'argCode' //  pid 使用 id， 其它分类使用argCode
    },
    list: {
      type: Array,
      default: null
    }
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    return {
      localList: []
    }
  },
  computed: {
    computedList() {
      /**
       任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
       开发人员：李建敏
       日期：2020-3月-17日
       任务类型：2、复制修改代码 （1行）
       **/
      const data = this.list || this.localList
      treeForEach(data, e => {
        e.id = e[this.valueKey]
        e.label = e.argText
        if (this.disableKeys.includes(e.id)) {
          delete e.children
        }
      })
      return treeFilter(data, e => !this.disableKeys.includes(e.id))
    }
  },
  created() {
    this.axios.activiti
      .post('activiti/process/type/list', {
        page: 1,
        rows: 10000,
        argGroup: 'formCategory'
      })
      .then(res => {
        this.localList = res.data.records
      })
  }
}
</script>
<style>
.vue-treeselect {
  line-height: 18px;
}
</style>
