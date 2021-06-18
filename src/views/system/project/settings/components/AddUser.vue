<template>
  <el-dialog title="添加人员" :visible="visible" width="500px" @close="close">
    <p class="top-header">
      <span>已选择:</span>
      <el-tag v-for="user in checkedUserList" :key="user.id" closable @close="handleUserRemove(user)">
        {{ user.name }}
      </el-tag>
    </p>
    <div>
      <el-input v-model="q" suffix-icon="el-icon-search" placeholder="请搜索" style="margin-bottom: 10px;"></el-input>
      <el-tree
        ref="tree"
        node-key="id"
        check-on-click-node
        default-expand-all
        show-checkbox
        :data="computedList"
        :props="{ label: 'name' }"
        :filter-node-method="filterNode"
        @check="handleCheck"
      ></el-tree>
    </div>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" :disabled="!checkedUserList.length" @click="submit">添加</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddUser',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    hiddenKeys: {
      type: Array,
      default() {
        return []
      }
    },
    role: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {},
      q: '',
      list: [],
      checkedUserList: []
    }
  },
  computed: {
    computedList() {
      let list = _.cloneDeep(this.list)
      if (this.hiddenKeys.length) {
        list = list.map(group => {
          group.children = group.children.filter(user => !this.hiddenKeys.includes(user.id))
          return group
        })
      }
      return list.filter(e => _.size(e.children))
    }
  },
  watch: {
    q(val) {
      this.$refs.tree.filter(val)
    },
    visible(val) {
      if (val) this.refresh()
    }
  },
  methods: {
    refresh() {
      this.axios.system.get('/cim6d/system/department/user/list').then(res => {
        res.data.forEach(e => {
          e.disabled = true
          e.children = e.userList
          e.name = e.departmentName
          e.isCategory = true
        })
        this.list = res.data
      })
    },
    handleCheck(data, { checkedNodes }) {
      this.checkedUserList = checkedNodes.filter(e => !e.isCategory)
    },
    handleUserRemove(user) {
      this.$refs.tree.setChecked(user, false)
      this.checkedUserList = _.reject(this.checkedUserList, { id: user.id })
    },
    async submit() {
      await this.axios.system.post(
        '/project/participant/user/config/' + this.role.id,
        _.map(this.checkedUserList, 'id')
      )
      this.$emit('change')
      this.close()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    close() {
      this.$emit('update:visible', false)
      this.$refs.tree.setCheckedNodes([])
      this.checkedUserList = []
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
@import '~@/styles/mixin.scss';
.top-header {
  margin: -15px 0 15px;
  .el-tag,
  span {
    margin: 3px;
  }
}
.el-tree {
  overflow: auto;
  max-height: calc(100vh - 500px);
  @include scrollBar;
}
</style>
