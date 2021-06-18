<template>
  <div class="container">
    <vxe-grid
      ref="xTable"
      v-loading="loading"
      :size="size"
      :highlight-hover-row="highlightHoverRow"
      :highlight-current-row="highlightCurrentRow"
      tree-config
      :align="align"
      :data="list"
      :checkbox-config="checkboxConfig"
      row-id="id"
      :show-header-overflow="showHeaderOverflow"
      @checkbox-change="data => $emit('checkboxChange', data)"
      @checkbox-all="data => $emit('checkboxChange', data)"
      @current-change="obj => $emit('currentChange', obj)"
      @radio-change="obj => $emit('radioChange', obj)"
    >
      <slot />
    </vxe-grid>
    <div v-if="pagination" class="page-wrap">
      <span>
        <!--         bug#1507 张龙 04-07 解决数据为空，显示问题-->
        共 {{ total }} 条记录 第 {{ pagination.page }} / {{ total ? Math.ceil(total / pagination.rows) : 1 }} 页
        <el-button type="text primary" class="el-icon-refresh" @click="() => refresh()" />
      </span>
      <el-pagination
        :total="total"
        :page-size.sync="pagination.rows"
        :current-page.sync="pagination.page"
        layout="prev, pager, next, jumper, sizes"
        @current-change="refresh(false)"
        @size-change="refresh"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Grid',
  props: {
    align: {
      type: String,
      default: 'center'
    },
    // 是否立即刷新列表
    immediate: {
      type: Boolean,
      default: true
    },
    request: { type: Function, required: true },
    filterForm: {
      type: Object,
      default() {
        return {}
      }
    },
    highlightHoverRow: {
      type: Boolean,
      default: false
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    },
    checkboxConfig: {
      type: Object,
      default() {
        return { highlight: true, reserve: false, range: true }
      }
    },
    showHeaderOverflow: {
      type: [String, Boolean],
      default: 'title'
    },
    pagination: {
      type: [Object, Boolean],
      default() {
        return {
          page: 1,
          rows: 10
        }
      }
    },
    // 翻页的时候是否设置query，初始化的时候是否从query中获取分页信息
    pageUseQuery: {
      type: Boolean,
      default: false
    },
    autoSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0
    }
  },
  watch: {
    filterForm: {
      deep: true,
      handler() {
        this.filterFormChanged = true
        if (this.autoSearch) {
          this.refresh()
        }
      }
    },
    pagination: {
      deep: true,
      handler({ page, rows }) {
        if (this.pageUseQuery) {
          this.$router.replace({ query: { ...this.$route.query, page, rows } }).catch(err => {
            console.log(err)
          })
        }
      }
    }
  },
  created() {
    if (this.pageUseQuery) {
      if (this.$route.query.page) this.pagination.page = +this.$route.query.page
      if (this.$route.query.rows) this.pagination.rows = +this.$route.query.rows
    }
    this.initFilterForm = _.cloneDeep(this.filterForm)
    if (this.request && this.immediate) {
      this.refresh()
    }
  },
  methods: {
    refresh(changedJumpToFirst = true) {
      this.loading = true
      const body = _.cloneDeep(this.filterForm)
      if (this.pagination) Object.assign(body, this.pagination)
      if (this.filterFormChanged && changedJumpToFirst) {
        this.pagination.page = 1
        this.filterFormChanged = false
      }
      return this.request(body)
        .then(res => {
          if (res.data) {
            res = res.data
          }
          if (this.pagination) {
            const { total, records, list } = res

            this.total = total
            this.list = records || list
          } else {
            this.list = res
            this.total = res.length
          }
          this.$refs.xTable.setAllCheckboxRow(false)
          this.$emit('checkboxChange', { selection: [] })
          this.$emit('radioChange', { row: null })
          this.$emit('change', this.list)
        })
        .finally(() => (this.loading = false))
    },
    async reset() {
      this.pagination.page = 1
      this.$emit('update:filterForm', _.cloneDeep(this.initFilterForm))
      await this.$nextTick()
      this.refresh()
    }
  }
}
</script>
<style lang="less" scoped>
.page-wrap {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-top: 12px;
  padding-bottom: 12px;

  .el-button {
    padding-top: 0;
    padding-bottom: 0;
  }
  > span {
    color: #888;
    font-size: 14px;
    line-height: 32px;

    .el-button {
      margin-left: 5px;
      transform: scale(1.4);
    }
  }
}

.el-pagination {
  padding-right: 0;
  text-align: right;
  > span {
    color: #888;
    font-size: 14px;

    .el-button {
      margin-left: 5px;
      transform: scale(1.5);
    }
  }
  /deep/ .el-pagination__sizes {
    margin-right: 0;
    margin-left: 10px;
  }
  /deep/ .el-select .el-input {
    margin-right: 0;
  }
}
</style>
