<template>
  <div>
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>基础信息</span>
      </div>

      <div class="content">
        <el-row class="row" :gutter="20">
          <el-col :md="24"
            >标题: <span>{{ details.title }}</span></el-col
          >
        </el-row>
        <el-row class="row" :gutter="20">
          <el-col :md="8"
            >是否匿名: <span>{{ details.anonymousFlag === 1 ? '是' : '否' }}</span></el-col
          >
          <el-col :md="8"
            >评论人: <span>{{ details.commentator }}</span></el-col
          >
          <el-col :md="8"
            >电话: <span>{{ details.commentatorMobile }}</span></el-col
          >
        </el-row>
      </div>
    </el-card>

    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>图片列表</span>
      </div>
      <div class="content">
        <el-row class="row" :gutter="20">
          <el-col :md="24"
            ><Upload ref="imgUploadRef" :default-img="details.imageFileId" file-type="img" disabled
          /></el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>视频列表</span>
      </div>
      <div class="content">
        <el-row class="row" :gutter="20">
          <el-col :md="24"
            ><Upload ref="videoUploadRef" :default-img="details.videoFileId" file-type="video" disabled
          /></el-col>
        </el-row>
      </div>
    </el-card>

    <div class="footer-btn">
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload/wap-upload'
import { feedbackApi } from './api/feedback'

export default {
  name: 'SystemProjectDetails',
  components: {
    Upload
  },
  data() {
    return {
      activeName: '1',
      tableLoading: false,
      imgList: [
        { id: 1, name: 'fdsfe' },
        { id: 2, name: 'ffefsfe' }
      ],
      id: this.$route.query.id || '',
      details: {},
      imageListTemp: {
        1: [], // 宣传图
        2: [], // 全景图
        3: [], // 形象进度图
        4: [] // 平面图
      } // 未确认的图片列表
    }
  },
  mounted() {
    this.getCommentAnonymous()
  },
  methods: {
    // 查询项目详情
    async getCommentAnonymous() {
      if (!this.id) {
        return
      }
      const result = await feedbackApi.getCommentAnonymous(this.id)
      const datas = result.data
      this.details = Object.assign({}, datas)
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  font-size: 14px;
  .row {
    margin: 20px 0;
  }
}
.card {
  margin-bottom: 15px;
}
.imgView {
  position: relative;
  /deep/.el-image {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  /deep/.el-image__preview {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
}
</style>
