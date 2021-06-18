<template>
  <el-dialog title="添加角色" :visible="visible" width="500px" @close="close">
    <p class="top-header">
      <span>已选择:</span>
      <el-tag v-for="role in checkedRoleList" :key="role.id" closable @close="handleRoleRemove(role)">
        {{ role.name }}
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
      <el-button v-promise-btn type="primary" :disabled="!checkedRoleList.length" @click="submit">添加</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { projectApi } from '@/views/system/api/project'
import toTree from '@/utils/toTree'

export default {
  name: 'AddRole',
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
    company: {
      type: Object,
      default: null
    },
    project: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {},
      q: '',
      list: [],
      checkedRoleList: []
    }
  },
  computed: {
    computedList() {
      let list = this.list
      if (this.hiddenKeys.length) {
        list = list.map(group => {
          if (_.size(group.children)) {
            group.children = group.children.filter(user => !this.hiddenKeys.includes(user.targetId))
          }
          return group
        })
      }
      return list.filter(e => _.size(e.children) || e.type === 2)
    }
  },
  watch: {
    q(val) {
      this.$refs.tree.filter(val)
    },
    project: {
      immediate: true,
      handler({ id }) {
        if (id) this.refresh()
      }
    }
  },
  methods: {
    refresh() {
      projectApi.getProjectOrganList({ projectId: this.project.id }).then(res => {
        let list = _.get(toTree(res.data, 'parentId'), '0.children', [])
        list.forEach(e => {
          if (e.type !== 2) {
            e.isCategory = true
            e.disabled = true
          }
        })
        this.list = list
      })
    },
    handleCheck(data, { checkedNodes }) {
      this.checkedRoleList = checkedNodes.filter(e => !e.isCategory)
    },
    handleRoleRemove(role) {
      this.$refs.tree.setChecked(role, false)
      this.checkedRoleList = _.reject(this.checkedRoleList, { id: role.id })
    },
    async submit() {
      await this.axios.system.post(
        '/project/participant/role/add/' + this.company.id,
        _.map(this.checkedRoleList, 'targetId')
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
      this.checkedRoleList = []
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
