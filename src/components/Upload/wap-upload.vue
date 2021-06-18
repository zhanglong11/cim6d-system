<template>
  <div class="upload">
    <div class="img-list" :class="{ 'video-list': fileType === 'video', disabled: disabled }">
      <ul>
        <li v-for="(item, i) in listData" :key="i">
          <div v-if="!disabled" class="el-icon-error upload-close" @click="deleteItem(i)" />
          <img v-if="fileType === 'img' && !disabled" :src="item.fileUrl" class="avatar" />
          <el-image
            v-if="fileType === 'img' && disabled"
            style="width"
            :src="item.fileUrl"
            lazy
            :preview-src-list="viewList"
          />
          <video v-if="fileType === 'video'" :src="item.fileUrl" class="avatar" controls="controls" />
        </li>
        <li v-if="listData.length < maxNum && !disabled" class="add">
          <i class="el-icon-plus avatar-uploader-icon" />
          <input
            v-if="fileType === 'img'"
            :value="tempUrl"
            type="file"
            accept="image/*"
            class="add-input"
            @change="changeInput"
          />
          <input
            v-if="fileType === 'video'"
            :value="tempUrl"
            type="file"
            accept="video/*"
            class="add-input"
            @change="changeInput"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { feedbackApi } from '@/views/feedback/api/feedback'
import { Loading } from 'element-ui'
export default {
  name: 'Upload',
  props: {
    // 上传文件类型 img 图片 video 视频
    fileType: {
      type: String,
      default: 'img'
    },
    // 最大上传文件大小
    maxSize: {
      type: Number,
      default: 5
    },
    // 最多上传几个文件
    maxNum: {
      type: Number,
      default: 5
    },
    // 默认图片地址
    defaultImg: {
      type: String,
      default: ''
    },
    // 企业id
    companyId: {
      type: [Number, String],
      default: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tempUrl: '',
      viewList: [], // 大图列表
      listData: [] // 上传的文件
    }
  },
  watch: {
    defaultImg(val) {
      if (!val) {
        return
      }
      this.queryFileList(val)
    }
  },
  methods: {
    // 选择文件
    changeInput(e) {
      const file = e.target.files[0]
      if (!this.beforeAvatarUpload(file)) {
        return
      }
      this.uploadFile(file)
    },
    // 文件列表查询
    async queryFileList(val) {
      const ids = val.split(',')
      const result = await feedbackApi.queryFileList(ids)
      const datas = result.data
      datas.map(item => {
        this.listData.push({
          fileId: item.id,
          fileUrl: item.fileUrl
        })
        this.viewList.push(item.fileUrl)
      })
    },
    // 文件上传
    async uploadFile(file) {
      const loadingInstance = Loading.service({
        body: true,
        background: 'rgba(0,0,0,0.5)'
      })
      try {
        const formData = new FormData()
        formData.append('file', file)
        const result = await feedbackApi.uploadFile(this.companyId, formData, {
          timeout: '307200' // 自定义超时时间5分钟
        })
        const datas = result.data
        const item = {
          fileId: datas.id,
          fileUrl: datas.fileUrl
        }
        this.listData.push(item)
        loadingInstance.close()
        this.tempUrl = ''
        this.changeList()
      } catch (e) {
        this.tempUrl = ''
        loadingInstance.close()
      }
    },
    // 文件验证
    beforeAvatarUpload(file) {
      const imgType = ['jpg', 'jpeg', 'png', 'bmp']
      const fileType = file.name.split('.')
      let isJPG = false
      if (this.fileType === 'img') {
        isJPG = imgType.includes(fileType[fileType.length - 1])
        if (!isJPG) {
          this.$message.error(`文件格式不正确,只能上传${imgType.join(',')}类型的文件!`)
        }
      }
      if (this.fileType === 'video') {
        isJPG = true
      }
      const isLt2M = file.size / 1024 / 1024 < this.maxSize

      if (!isLt2M) {
        this.$message.error(`文件大小不能超过 ${this.maxSize}MB!`)
      }
      return isJPG && isLt2M
    },
    // 文件列表改变
    changeList() {
      this.$emit('change', _.map(this.listData, 'fileId').join(','))
    },
    // 删除
    deleteItem(index) {
      this.listData.splice(index, 1)
      this.changeList()
    }
  }
}
</script>

<style scoped lang="less">
.upload {
  width: 100%;
  float: left;
}
.img-list {
  float: left;
  ul {
    float: left;
    li {
      margin-right: 10px;
      float: left;
      width: 100px;
      height: 100px;
      border: 1px #f5f5f5 solid;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .avatar {
        max-width: 100%;
        max-height: 100%;
        display: block;
      }
      .upload-close {
        font-size: 20px;
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
        color: red;
      }
      .add-input {
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
      }
    }
  }
  &.disabled {
    li {
      width: 200px;
      height: 150px;
    }
  }
  &.video-list {
    width: 100%;
    ul {
      width: 100%;
      li {
        margin-right: 0;
        width: 100%;
        height: 150px;
        &.add {
          width: 100px;
          height: 100px;
        }
      }
    }
    &.disabled {
      width: 500px;
      li {
        height: 300px;
      }
    }
  }
}
</style>
