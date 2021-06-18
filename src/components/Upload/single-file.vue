<template>
  <!-- /**
  任务名称：2868/修改bug
  开发人员：李建敏
  日期：2020-3月-7日
  任务类型：2、复制修改代码 （10行）
  **/-->
  <div>
    <el-upload
      ref="upload"
      class="avatar-uploader"
      :action="action"
      :headers="headers"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { toUpperCase } from '@/utils' // 字符串或数组拼音转大写
export default {
  name: 'Upload',
  props: {
    // 上传地址
    action: {
      type: String,
      default: `/cim6d-file-storage${process.env.VUE_APP_BASE_API}/file/commonFile/uploadTwo`
    },
    // 上传文件类型
    fileType: {
      type: Array,
      default: () => {
        return ['jpg', 'jpeg', 'png', 'bmp']
      }
    },
    // 最大上传文件大小
    maxSize: {
      type: Number,
      default: 5
    },
    // 默认图片地址
    defaultImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: this.defaultImg,
      headers: {
        'x-access-token': getToken()
      }
    }
  },
  watch: {
    defaultImg(val) {
      this.imageUrl = val
    }
  },
  methods: {
    // 上传成功
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        const datas = res.data
        this.imageUrl = URL.createObjectURL(file.raw)
        this.$emit('change', {
          fileId: datas.id,
          fileName: file.name,
          fileUrl: datas.fileUrl,
          uploadTime: datas.createTime
        })
      }
    },
    // 文件验证
    beforeAvatarUpload(file) {
      const fileType = toUpperCase(file.name).split('.')
      const isJPG = toUpperCase(this.fileType).includes(fileType[fileType.length - 1])
      const isLt2M = file.size / 1024 / 1024 < this.maxSize

      if (!isJPG) {
        this.$message.error(`文件格式不正确,只能上传${this.fileType.join(',')}类型的文件!`)
      } else if (!isLt2M) {
        this.$message.error(`图片大小不能超过 ${this.maxSize}MB!`)
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped lang="less">
.avatar,
.avatar-uploader-icon {
  width: 100px;
  height: 100px;
}
.avatar-uploader-icon {
  border: 1px #f5f5f5 solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #ccc;
}
</style>
