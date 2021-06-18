<template>
  <div class="add-feedback">
    <el-form ref="formRef" class="add-form" :rules="rules" :model="formData">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题" />
      </el-form-item>
      <template v-if="formData.anonymousFlag === 0">
        <el-form-item label="姓名" prop="commentator">
          <el-input v-model="formData.commentator" :maxlength="10" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话" prop="commentatorMobile">
          <el-input v-model="formData.commentatorMobile" :maxlength="11" type="number" placeholder="请输入手机号" />
        </el-form-item>
      </template>
      <el-form-item label="内容" prop="concent">
        <el-input v-model="formData.concent" type="textarea" :rows="5" placeholder="请输入内容" maxlength="1000" />
      </el-form-item>
      <el-form-item label="匿名" required>
        <el-switch v-model="anonymousFlag" @change="e => (formData.anonymousFlag = anonymousFlag ? 1 : 0)" />
      </el-form-item>
      <el-form-item label="上传照片">
        <Upload
          ref="imgUploadRef"
          file-type="img"
          :max-size="20"
          :company-id="formData.companyId"
          @change="e => (formData.imageFileId = e)"
        />
      </el-form-item>
      <el-form-item label="上传视频">
        <Upload
          ref="videoUploadRef"
          file-type="video"
          :max-size="100"
          :company-id="formData.companyId"
          :max-num="1"
          @change="e => (formData.videoFileId = e)"
        />
      </el-form-item>
    </el-form>
    <el-button size="medium" class="add-btn" type="primary" icon="el-icon-plus" :loading="btnLoading" @click="save()"
      >保存</el-button
    >
  </div>
</template>

<script>
import { feedbackApi } from './api/feedback'
import Upload from '@/components/Upload/wap-upload'
export default {
  name: 'Mine',
  components: {
    Upload
  },
  data() {
    return {
      anonymousFlag: true, // 是否匿名
      formData: {
        anonymousFlag: 1,
        commentator: '',
        commentatorMobile: '',
        companyId: this.$route.query.companyId,
        concent: '',
        imageFileId: '',
        title: '',
        videoFileId: ''
      },
      formDataBack: {},
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        commentator: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        commentatorMobile: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        concent: [{ required: true, message: '请输入标题', trigger: 'blur' }]
      },
      btnLoading: false
    }
  },
  mounted() {
    Object.assign(this.formDataBack, this.formData)
  },
  methods: {
    // 发布
    save() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.addCommentAnonymous()
        } else {
          this.$notify.error({
            title: '提示',
            message: '请完善表单',
            duration: 1000
          })
          return false
        }
      })
    },
    // 添加匿名评论
    async addCommentAnonymous() {
      try {
        this.btnLoading = true
        await feedbackApi.addCommentAnonymous(this.formData)
        this.$notify({
          title: '提示',
          message: '保存成功',
          type: 'success',
          duration: 1000
        })
        Object.assign(this.formData, this.formDataBack)
        this.$refs['formRef'].resetFields()
        this.btnLoading = false
        this.$refs['imgUploadRef'].listData = []
        this.$refs['videoUploadRef'].listData = []
      } catch (e) {
        this.btnLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.add-feedback {
  padding: 15px;
  background: #fff;
  .add-btn {
    padding: 12px 20px;
    display: block;
    width: 100%;
  }
}
</style>
