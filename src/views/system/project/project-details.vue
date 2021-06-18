<template>
  <div class="is-padding">
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>基础信息</span>
      </div>

      <div class="content">
        <el-row class="row" :gutter="20">
          <el-col :md="6"
            >项目名称: <span>{{ details.name }}</span></el-col
          >
          <el-col :md="6"
            >项目类型: <span>{{ $getLabelFromArg('projectType', details.type) }}</span></el-col
          >
          <el-col :md="6"
            >项目负责人: <span>{{ details.principalName }}</span></el-col
          >
          <el-col :md="6"
            >联系电话: <span>{{ details.telephone }}</span></el-col
          >
        </el-row>

        <el-row class="row" :gutter="20">
          <el-col :md="6"
            >项目地址: <span>{{ details.province }}{{ details.city }}{{ details.county }}</span></el-col
          >
          <el-col :md="6"
            >详细地址: <span>{{ details.detailAddress }}</span></el-col
          >
          <el-col :md="6"
            >项目规模: <span>{{ $getLabelFromArg('projectScale', details.scale) }}</span></el-col
          >
        </el-row>

        <el-row class="row" :gutter="20">
          <el-col :md="24"
            >建筑总规模: <span>{{ details.totalBuildingScale }}</span></el-col
          >
        </el-row>

        <el-row class="row" :gutter="20">
          <el-col :md="6"
            >建筑高度: <span>{{ details.buildingHeight }} 米</span></el-col
          >
          <el-col :md="6"
            >建筑面积: <span>{{ details.buildingArea }} ㎡</span></el-col
          >
          <el-col :md="6"
            >结构形式: <span>{{ details.structuralStyle }}</span></el-col
          >
        </el-row>

        <el-row class="row" :gutter="20">
          <el-col :md="6"
            >工程造价: <span>{{ details.constructionCosts }} 万元</span></el-col
          >
          <el-col :md="6"
            >抗震等级: <span>{{ $getLabelFromArg('seismicLevel', details.seismicLevel) }}</span></el-col
          >
          <el-col :md="6"
            >合同开工时间: <span>{{ details.startTime }}</span></el-col
          >
          <el-col :md="6"
            >合同竣工时间: <span>{{ details.endTime }}</span></el-col
          >
        </el-row>

        <el-row class="row" :gutter="20">
          <el-col :md="6"
            >项目状态: <span>{{ $getLabelFromArg('projectStatus', details.projectStatus) }}</span></el-col
          >
          <el-col :md="6"
            >备注: <span>{{ details.remark }}</span></el-col
          >
        </el-row>
      </div>
    </el-card>
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>项目图片</span>
      </div>
      <el-row :gutter="15">
        <el-col :span="12">
          <!-- 宣传图 start -->
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>宣传图</span>
            </div>
            <div class="one-img">
              <template v-for="(item, i) in imageListTemp[1]">
                <div :key="item.fileId + '_' + i" class="mask-title">
                  <p>
                    <span>{{ item.fileName }}</span>
                    <span class="time">{{ item.createTime }}</span>
                  </p>
                  <p v-if="item.remark" class="remark" v-text="item.remark"></p>
                </div>
                <el-image :key="i" style="width" :src="item.fileUrl" :preview-src-list="[item.fileUrl]" />
              </template>
            </div>
          </el-card>
          <!-- 宣传图 end -->
        </el-col>
        <el-col :span="12">
          <!-- 全景图 start -->
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>全景图</span>
            </div>
            <div class="one-img">
              <template v-for="(item, i) in imageListTemp[2]">
                <div :key="item.fileId + '_' + i" class="mask-title">
                  <p>
                    <span>{{ item.fileName }}</span>
                    <span class="time">{{ item.createTime }}</span>
                  </p>
                  <p v-if="item.remark" class="remark" v-text="item.remark"></p>
                </div>
                <el-image :key="i" style="width" :src="item.fileUrl" :preview-src-list="[item.fileUrl]" />
              </template>
            </div>
          </el-card>
          <!-- 全景图 end -->
        </el-col>
      </el-row>
      <!-- 形象进度图 start -->
      <el-card class="card">
        <div slot="header" class="clearfix">
          <span>形象进度图</span>
          <div class="card-extend">
            <el-button
              type="text"
              icon="el-icon-picture"
              class="type-icon"
              :class="{ active: !progressImgType }"
              @click="progressImgType = 0"
            ></el-button>
            <el-button
              type="text"
              icon="el-icon-tickets"
              class="type-icon"
              :class="{ active: progressImgType }"
              @click="progressImgType = 1"
            ></el-button>
          </div>
        </div>
        <div v-if="!progressImgType" class="roll-img" :class="{ open: isPreviewProgress }">
          <carousel :perPage="4" :scrollPerPage="false" navigationEnabled :paginationEnabled="false">
            <slide v-for="(item, i) in imageListTemp[3]" :key="i">
              <div class="mask-title">
                <p>
                  <span>{{ item.fileName }}</span>
                  <span class="time">{{ item.createTime }}</span>
                </p>
                <p v-if="item.remark" class="remark" v-text="item.remark"></p>
              </div>
              <el-image
                :src="item.fileUrl"
                :preview-src-list="_.map(imageListTemp[3], 'fileUrl')"
                @click="previewImage('isPreviewProgress')"
              />
            </slide>
          </carousel>
        </div>
        <el-table
          v-else
          :data="imageListTemp[3]"
          style="width: 100%;"
          element-loading-background="rgba(0, 0, 0, 0.5)"
          element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" label="编号" width="55" />
          <el-table-column prop="fileName" label="图片名称" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="uploadTime" label="上传时间" />
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" class="imgView"
                >预览
                <el-image style="width" :src="scope.row.fileUrl" :preview-src-list="[scope.row.fileUrl]" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 形象进度图 end -->

      <!-- 平面图 start -->
      <el-card class="card">
        <div slot="header" class="clearfix">
          <span>平面图</span>

          <div class="card-extend">
            <el-button
              type="text"
              icon="el-icon-picture"
              class="type-icon"
              :class="{ active: !planeImgType }"
              @click="planeImgType = 0"
            ></el-button>
            <el-button
              type="text"
              icon="el-icon-tickets"
              class="type-icon"
              :class="{ active: planeImgType }"
              @click="planeImgType = 1"
            ></el-button>
          </div>
        </div>
        <div v-if="!planeImgType" class="roll-img" :class="{ open: isPreviewPlane }">
          <carousel :perPage="4" :scrollPerPage="false" navigationEnabled :paginationEnabled="false">
            <slide v-for="(item, i) in imageListTemp[4]" :key="i">
              <div class="mask-title">
                <p>
                  <span>{{ item.fileName }}</span>
                  <span class="time">{{ item.createTime }}</span>
                </p>
                <p v-if="item.remark" class="remark" v-text="item.remark"></p>
              </div>
              <el-image
                :src="item.fileUrl"
                :preview-src-list="_.map(imageListTemp[4], 'fileUrl')"
                @click="previewImage('isPreviewPlane')"
              />
            </slide>
          </carousel>
        </div>
        <el-table
          v-else
          :data="imageListTemp[4]"
          style="width: 100%;"
          element-loading-background="rgba(0, 0, 0, 0.5)"
          element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" label="编号" width="55" />
          <el-table-column prop="fileName" label="图片名称" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="uploadTime" label="上传时间" />
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" class="imgView"
                >预览
                <el-image style="width" :src="scope.row.fileUrl" :preview-src-list="[scope.row.fileUrl]" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 平面图 end -->
    </el-card>

    <!-- 项目参与方 start -->
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>项目参与方</span>
        <el-button
          v-if="$hasPower('SystemMyProject') && projectUserCategory === '2'"
          type="text"
          icon="el-icon-s-tools"
          size="mini"
          style="float: right;"
          @click="handleToParties"
          >配置管理</el-button
        >
      </div>
      <el-card v-for="(item, i) in partiesRecordList" :key="i" class="card">
        <div slot="header" class="clearfix">
          <i class="image-icon icon-image-company-group"></i><span v-text="item.label"></span>
        </div>
        <el-table :data="item.children" style="width: 100%;" border>
          <el-table-column prop="label" label="参与方名称" min-width="180" align="center"></el-table-column>
          <el-table-column prop="userNumber" label="参项人员数量" min-width="180" align="center"></el-table-column>
        </el-table>
      </el-card>
    </el-card>
    <!-- 项目参与方 end -->

    <div class="footer-btn">
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import { projectApi } from '@/views/system/api/project'
import api from '@/views/system/api/parties'
import { Carousel, Slide } from 'vue-carousel'
import treeForEach from '@/utils/treeForEach'

export default {
  name: 'SystemProjectDetails',
  components: {
    Carousel,
    Slide
  },
  data() {
    return {
      activeName: '1',
      tableLoading: false,
      imgList: [
        { id: 1, name: 'fdsfe' },
        { id: 2, name: 'ffefsfe' }
      ],
      projectId: this.$route.query.projectId || '', // 项目id
      projectUserCategory: this.$route.query.projectUserCategory || '', // 参项单位类型
      details: {},
      imageListTemp: {
        1: [], // 宣传图
        2: [], // 全景图
        3: [], // 形象进度图
        4: [] // 平面图
      }, // 未确认的图片列表
      progressImgType: 0, // 形象进度图展示类型
      planeImgType: 0, // 平面图展示类型
      isPreviewProgress: false,
      isPreviewPlane: false,
      partiesRecordList: [] // 参与方数据
    }
  },
  mounted() {
    this.getProject()
    this.getPartiesRecordList()
  },
  methods: {
    // 查询项目详情
    async getProject() {
      if (!this.projectId) {
        return
      }
      const result = await projectApi.getProject(this.projectId)
      const datas = result.data
      const imageList = datas.imageList || []
      datas.imageList = imageList
      imageList.map(item => {
        this.imageListTemp[item.imageType].push(item)
      })
      const addressList = datas.address ? datas.address.split('_') : []
      datas.address = addressList
      this.details = Object.assign({}, datas)
    },
    // 获取项目参与方数据
    async getPartiesRecordList() {
      if (!this.projectId) {
        return
      }
      let result = await api.getPartiesRecordList({ projectId: this.projectId })
      let datas = result.data
      treeForEach(datas, e => {
        let userNumber = 0
        if (e.type === 2) {
          userNumber = e.children ? e.children.length : 0
        }
        e.userNumber = userNumber
        e.label = e.participantUserName || e.projectRoleName || e.participantCompanyName || e.participantTypeName
      })
      treeForEach(datas, e => {
        if (e.type === 1) {
          let userNumber = 0
          if (e.children) {
            e.children.map(f => {
              userNumber += f.userNumber
              e.userNumber = userNumber
            })
          }
        }
      })
      this.partiesRecordList = datas
    },
    // 图片预览 - 兼容轮播图处理
    previewImage(key) {
      this[key] = true
      this.$nextTick(() => {
        let closeDom = document.getElementsByClassName('el-icon-circle-close')
        closeDom[0].onclick = () => {
          this[key] = false
        }
        document.addEventListener(
          'keydown',
          e => {
            if (e.which === 27) {
              this[key] = false
            }
          },
          false
        )
      })
    },
    // 参与方配置
    handleToParties() {
      this.$router.push({
        path: `/system/project/settings/myProject?projectId=${this.projectId}`
      })
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

.one-img {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  img {
    width: auto;
    max-width: 100%;
    height: 400px;
  }

  &:hover {
    .mask {
      opacity: 1;
      visibility: visible;
    }
  }
}
.mask-title {
  position: absolute;
  padding: 0 10px;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 2;
  p {
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding: 0 10px;
    .time {
      color: #ccc;
    }
    &.remark {
      padding-bottom: 10px;
      height: auto;
      color: #ccc;
    }
  }
}

/deep/.el-image {
  width: 100%;
  height: 100%;
  display: block;
}
.roll-img {
  padding: 0 30px;
  min-height: 260px;
  &.open {
    /deep/.VueCarousel-inner {
      transform: inherit !important;
    }
  }
  /deep/.VueCarousel-slide {
    position: relative;
    padding: 0 10px;
    &:hover {
      .mask {
        opacity: 1;
        visibility: visible;
      }
    }
  }
  /deep/ .VueCarousel-navigation-button {
    font-size: 0;
    border-left: 6px #ccc solid;
    border-top: 6px #ccc solid;
    transform: rotate(-45deg);
    outline: none !important;
    box-shadow: none !important;
    transition: all 0.4s;
    &.VueCarousel-navigation-prev {
      left: -25px;
    }
    &.VueCarousel-navigation-next {
      right: -25px;
      transform: rotate(135deg);
    }
    &:hover {
      border-color: #66b1ff;
    }
    &.VueCarousel-navigation--disabled {
      cursor: not-allowed;
      border-color: #ddd;
      &:hover {
        border-color: #ddd;
      }
    }
  }
  img {
    width: 100%;
    height: 260px;
    display: block;
  }
}
.card-extend {
  float: right;
  .type-icon {
    font-size: 18px;
    color: #999;
    &.active {
      color: #409eff;
    }
  }
}

.image-icon {
  display: inline-block;
  vertical-align: center;
  width: 14px;
  height: 14px;
  transform: scale(1.4);
  background-size: cover;
  margin-right: 10px;
  & + & {
    margin-left: 8px;
  }
  &.icon-image-company-group {
    background-image: url(~@/assets/images/project/company-group.png);
  }
}
</style>
