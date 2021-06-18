<template>
  <div>
    <div class="tooltips">
      <el-form ref="filterForm" :model="filterForm" inline>
        <el-form-item label="是否匿名" prop="anonymousFlag">
          <el-select v-model="filterForm.anonymousFlag" clearable>
            <el-option :value="0" label="否" />
            <el-option :value="1" label="是" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="filterForm.title" placeholder="请搜索" />
        </el-form-item>
        <el-form-item label="联系人" prop="commentator">
          <el-input v-model="filterForm.commentator" placeholder="请搜索" />
        </el-form-item>
        <el-form-item label="电话" prop="commentatorMobile">
          <el-input v-model="filterForm.commentatorMobile" placeholder="请搜索" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-s-help" @click="viewCode">查看二维码</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" auto-search :filter-form.sync="filterForm" :request="request">
      <vxe-table-column type="index" title="#" />
      <vxe-table-column field="title" title="标题" />
      <vxe-table-column field="concent" title="内容" />
      <vxe-table-column field="commentator" title="联系人" />
      <vxe-table-column field="commentatorMobile" title="电话" />
      <vxe-table-column field="createTime" title="发布时间" />
      <vxe-table-column title="操作">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('FeedbackDetails')" type="text" @click="toDetails(scope.row)">详情</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <el-dialog title="匿名留言二维码" :visible.sync="dialogVisible" width="260px">
      <img :src="qrUrl" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
export default {
  name: 'Mine',
  components: {},
  props: {
    // 是否是工作台操作
    isWorkBench: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      qrUrl: '',
      activeTask: {},
      filterForm: {
        anonymousFlag: '',
        title: '',
        commentator: '',
        commentatorMobile: ''
      },
      filterFormBack: {},
      request: body => {
        body.companyId = this.companyId
        return this.axios.system.post('/anonymous/comment/list', body).then(res => res.data)
      },
      projectDataList: [] // 项目列表
    }
  },
  computed: {
    // 企业id
    companyId() {
      return this.$store.state.user.companyId
    }
  },
  mounted() {
    this.filterForm.companyId = this.companyId
    Object.assign(this.filterFormBack, this.filterForm)
  },
  methods: {
    // 查看二维码
    viewCode() {
      const codeUrl = `${location.origin}/#/feedback-add?companyId=${this.companyId}`
      this.dialogVisible = true
      QRCode.toDataURL(codeUrl, {
        version: '10',
        color: {
          dark: '#069',
          light: '#FFF'
        }
      }).then(url => {
        this.qrUrl = url
      })
    },
    // 刷新 列表
    refresh() {
      this.$refs.table.refresh()
    },
    // 重置
    reset() {
      Object.assign(this.filterForm, this.filterFormBack)
    },
    // 详情
    toDetails(item) {
      this.$router.push({
        name: 'FeedbackDetails',
        query: {
          id: item.id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
