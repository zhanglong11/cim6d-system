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
      class="upload"
      :data="data"
      :drag="!isOnlyButton"
      :action="action"
      :headers="headers"
      :value="value"
      name="file"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :show-file-list="showFileList"
      :auto-upload="autoUpload"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :multiple="multiple"
      :accept="accept"
    >
      <template v-if="!isOnlyButton">
        <i class="el-icon-upload" :style="{ marginTop: accept ? '20px' : '40px' }" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
          <p v-if="accept">
            支持扩展名: <span class="blue">{{ accept }}</span>
          </p>
        </div>
      </template>
      <template v-if="isOnlyButton">
        <div style="text-align: left;">
          <el-button slot="trigger" size="small" type="primary" icon="el-icon-upload2">{{ btnText }}</el-button>
          <p v-if="accept">
            支持扩展名: <span class="blue">{{ accept }}</span>
          </p>
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script>
/**
 任务名称：2845/【智慧工地2.0-前端】劳务管理》工人信息》列表、新增、编辑、详情切图及功能开发
 开发人员：李建敏
 日期：2020-4月-3日
 任务类型：2、修改代码
 **/
import { getToken } from '@/utils/auth'
import { fileApi } from '@/api/file'
import { toUpperCase } from '@/utils' // 字符串或数组拼音转大写
export default {
  name: 'Upload',
  props: {
    // 额外参数
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 上传地址
    action: {
      type: String,
      default: `/cim6d-file-storage${process.env.VUE_APP_BASE_API}/file/commonFile/uploadTwo`
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    value: {
      type: [Object, Array, File, String],
      default: ''
    },
    // 多选
    multiple: {
      type: Boolean,
      default: false
    },
    raw: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ''
    },
    isOnlyButton: {
      type: Boolean,
      default: false
    },
    // 接受上传的文件类型（thumbnail-mode 模式下此参数无效）
    accept: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: '上传文件'
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      fileList: [],
      headers: {
        'x-access-token': getToken()
      },
      hasInit: false
    }
  },
  watch: {
    fileList: {
      deep: true,
      handler() {
        if (this.raw) {
          this.$emit('input', this.multiple ? this.fileList : this.fileList[0])
        } else {
          this.$emit(
            'input',
            this.multiple
              ? this.fileList
                  .filter(e => e?.response?.data || e.id)
                  .map(e => e.id || e.response.data)
                  .join(',')
              : this.fileList[0]?.response?.data
          )
        }
      }
    },
    value() {
      if (this.hasInit) return false
      if (this.value) {
        fileApi.getFileList(this.value.split(',')).then(res => {
          res.data.forEach(e => (e.name = e.fileName))
          this.fileList = res.data
          this.hasInit = true
        })
      }
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = this.multiple ? fileList : [file]
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    async beforeUpload(file) {
      if (this.raw) {
        if (this.accept) {
          if (!_.some(toUpperCase(this.accept.split(',')), string => toUpperCase(file.name).includes(string))) {
            this.$message.error('文件格式错误，只允许' + this.accept)
            this.fileList.splice(-1, 1)
            return false
          } else {
            if (this.multiple) {
              this.fileList.push(file)
            } else {
              await this.$nextTick()
              this.fileList = [file]
            }
          }
        } else {
          if (this.multiple) {
            this.fileList.push(file)
          } else {
            await this.$nextTick()
            this.fileList = [file]
          }
        }
        return false
      }
    },
    handleError(error) {
      this.$message.error(error.status + '：' + error.message)
    },
    submit() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped lang="less"></style>
