<template>
  <!--
  /**
  任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
  开发人员：李建敏
  日期：2020-4月-9日
  任务类型：1、全新代码
  **/
  -->
  <div>
    <div class="tooltips">
      <div>
        <el-input v-model="name" style="width: 300px;" placeholder="请输入分组名称" suffix-icon="el-icon-search" />
      </div>
      <div>
        <el-button @click="refresh">刷新</el-button>
        <el-button v-if="$hasPower('IotGroupAdd')" type="primary" icon="el-icon-plus" @click="add">新建分组</el-button>
      </div>
    </div>

    <vxe-table ref="table" row-id="id" :data="computedGroupListTree" tree-config>
      <vxe-table-column field="name" title="分组名称" tree-node />
      <vxe-table-column field="id" title="分组ID" />
      <vxe-table-column field="createTime" title="添加时间" />
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button v-if="$hasPower('IotGroupDetails')" type="text" @click="$router.push('group/' + row.id)"
            >查看</el-button
          >
          <el-button v-if="$hasPower('IotGroupDelete')" type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    <Edit :visible.sync="editDialogVisible" />
  </div>
</template>

<script>
import Edit from './components/Edit'
import treeFilter from '@/utils/treeFilter'
export default {
  name: 'IotGroup',
  components: { Edit },
  data() {
    return {
      name: '',
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request(body) {
        return this.axios.iot.post('group/list', body)
      },
      activeId: null,
      editDialogVisible: false
    }
  },
  computed: {
    groupListTree() {
      return this.$store.state.iot.groupListTree
    },
    computedGroupListTree() {
      if (this.name) {
        return treeFilter(this.groupListTree, e => e.name.includes(this.name))
      } else {
        return this.groupListTree
      }
    }
  },
  methods: {
    refresh() {
      this.$store.dispatch('iot/getGroupListTree')
    },
    add() {
      this.activeId = null
      this.editDialogVisible = true
    },
    edit(id) {
      this.activeId = id
      this.editDialogVisible = true
    },
    remove(list) {
      this.$remove(idList => {
        return this.axios.iot.get('group/delete/' + idList.join(','))
      }, list).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less"></style>
