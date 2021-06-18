<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-select v-model="queryForm.cateogry" clearable placeholder="消息类型" @change="search">
            <el-option v-for="item in typeList" :key="item.value" :label="item.desc" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.keyWords" style="width: 360px;" placeholder="标题" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="allRead()">批量读取消息</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table
      ref="tableList"
      :data="dataList"
      :row-key="getRowId"
      border
      stripe
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true"> </el-table-column>
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="projectName" min-width="180" align="center" label="项目名称" />
      <el-table-column prop="title" min-width="180" label="标题">
        <template slot-scope="{ row }">
          <router-link to="" @click.native="toProject(row)">{{ row.title }}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="消息类型">
        <span slot-scope="scope">
          {{ $enum.getDescByValue('MESSAGE_TYPE', scope.row.category) }}
        </span>
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间" />
      <el-table-column prop="name" label="状态">
        <template slot-scope="scope">
          <el-switch :value="scope.row.status === 1" disabled />
          {{ scope.row.status === 1 ? '已读' : '未读' }}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="toDetails(scope.row, scope.$index)">查看</el-button>
          <el-button type="text" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wrap">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }} 页
        <el-button type="text primary" class="el-icon-refresh" @click="queryList()" />
      </p>
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="queryForm.page"
        :page-size="queryForm.rows"
        :page-sizes="$pageConfig.pageSizes"
        @size-change="changePageSize"
        @current-change="changePageNumber"
      />
    </div>
    <el-dialog title="消息详情" :visible.sync="detailsModal.show">
      <el-form>
        <el-form-item label="标题：" :label-width="formLabelWidth">
          {{ detailsModal.formData.title }}
        </el-form-item>
        <el-form-item label="消息类型：" :label-width="formLabelWidth">
          {{ $enum.getDescByValue('MESSAGE_TYPE', detailsModal.formData.category) }}
        </el-form-item>
        <el-form-item label="发布时间：" :label-width="formLabelWidth">
          {{ detailsModal.formData.createTime }}
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-switch :value="detailsModal.formData.status === 1" /> {{ detailsModal.formData.status ? '已读' : '未读' }}
        </el-form-item>
        <el-form-item label="内容：" :label-width="formLabelWidth">
          {{ detailsModal.formData.content }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailsModal.show = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
  任务名称：task#2854 【智慧工地2.0-前端】工作台切图及功能开发
  开发人员：耿为刚
  日期：2020-04-01
**/
import { messageApi } from '@/views/message/api/message'
import { projectApi } from '@/views/system/api/project'

export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'WorkBenchMessage',
  components: {},
  data() {
    // 这里存放数据
    return {
      // 消息类型下拉框数据
      typeList: this.$enum.getValueDescList('MESSAGE_TYPE'),
      queryForm: {
        // 查询条件
        cateogry: '',
        keyWords: '',
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [
        {
          id: 1,
          name: '测试',
          status: 1,
          statusName: '监控中'
        },
        {
          id: 2,
          name: '测试',
          status: 2,
          statusName: '停用'
        },
        {
          id: 3,
          name: '测试',
          status: 3,
          statusName: '故障'
        }
      ],
      total: 0,
      formLabelWidth: '120px',
      detailsModal: {
        show: false,
        formData: {
          createTime: '2020-08-18',
          status: 1,
          content: '2222'
        }
      },
      messageIds: []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  // 方法集合
  methods: {
    // 查询列表
    async queryList() {
      const result = await messageApi.queryListMessage(this.queryForm)
      const datas = result.data
      const list = datas.records || []
      this.total = datas.total
      this.dataList = list
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 重置
    reset() {
      Object.assign(this.queryForm, this.queryFormBack)
      this.queryList()
    },
    // 当前页码改变
    changePageNumber(page) {
      this.queryForm.page = page
      this.queryList()
    },
    // 每页显示条数改变
    changePageSize(rows) {
      this.queryForm.page = 1
      this.queryForm.rows = rows
      this.queryList()
    },
    // 查看详情
    toDetails(row, index) {
      this.detailsModal.formData = row
      this.detailsModal.show = true
      this.readMessage(row.id, index)
    },
    // 消息已读
    async readMessage(id, index) {
      await messageApi.readMessage(id)
      this.$store.dispatch('message/getUnreadMessage')
      this.dataList[index].status = 1
    },
    // 删除消息
    deleteItem(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteMessage(id)
        })
        .catch(() => {})
    },
    // 删除消息 - 异步
    async deleteMessage(id) {
      await messageApi.deleteMessage(id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.search()
    },
    //全部已读
    async allRead() {
      if (this.messageIds.length) {
        let res = await messageApi.allRead(this.messageIds)
        if (res.code === 200) {
          this.$message.success('消息已读')
          this.$refs.tableList.clearSelection()
          this.queryList()
        }
      } else {
        this.$message.info('请先选择要读的消息')
      }
    },
    getRowId(row) {
      return row.id
    },
    handleSelectionChange(val) {
      this.messageIds = val.map(item => item.id)
    },
    // 跳转工地2.0后台
    async toProject(row) {
      if (!row.projectId) {
        return
      }
      const result = await projectApi.getProjectPower(row.projectId, false)
      const datas = result.data || []
      if (datas.length === 0) {
        this.$message.error('项目还未授权')
        return
      }
      this.$store.commit('toMessageDetails', {
        projectId: row.projectId,
        messageItem: {
          targetId: row.extension,
          subModules: row.subModules
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.status {
  display: flex;
  align-items: center;
  i {
    margin-right: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00cc00;
  }
  &.status-2 i {
    background: #999;
  }
  &.status-3 i {
    background: #ff9900;
  }
}
.page-wrap {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-top: 12px;
  padding-bottom: 12px;
}
</style>
