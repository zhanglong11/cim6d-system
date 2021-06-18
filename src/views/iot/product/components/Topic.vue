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
      <h2>
        产品Topic类列表
        <el-tooltip :content="Hint.product.TOPIC_CLASS"><el-icon class="el-icon-question"></el-icon></el-tooltip>
      </h2>
      <el-button type="primary" @click="add">定义Topic类</el-button>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column field="topicClass" title="Topic类"></vxe-table-column>
      <vxe-table-column field="optionPermit" title="操作权限" width="100px"></vxe-table-column>
      <vxe-table-column field="description" title="描述"></vxe-table-column>
      <vxe-table-column title="操作" width="120px">
        <template v-slot="{ row }">
          <el-button type="text" @click="edit(row.id)">编辑</el-button>
          <el-button type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <TopicEdit :id="activeId" :visible.sync="editDialogVisible"></TopicEdit>
  </div>
</template>

<script>
import TopicEdit from './TopicEdit'
import Hint from '../../Hint'
export default {
  name: 'Topic',
  components: { TopicEdit },
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request(body) {
        return Promise.resolve({
          total: 2,
          records: [
            {
              id: '1',
              topicClass: '/sys/a1JQT0LLieH/${deviceName}/thing/event/property/post',
              optionPermit: '发布',
              description: '设备属性上报'
            },
            {
              id: '2',
              topicClass: '/sys/a1JQT0LLieH/${deviceName}/thing/service/property/set',
              optionPermit: '订阅',
              description: '设备属性设置'
            }
          ]
        })
      },
      editDialogVisible: false,
      activeId: null,
      Hint
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
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
        return this.axios.iot.get('topic/delete/' + idList.join(','))
      }, list).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less"></style>
