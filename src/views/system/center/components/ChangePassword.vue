<template>
  <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
    <el-form-item label="当前密码" prop="currentPassword">
      <el-input
        v-model="ruleForm.currentPassword"
        placeholder="请输入"
        :maxlength="50"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword" style="position: relative;">
      <el-input
        v-model="ruleForm.newPassword"
        placeholder="请输入"
        :maxlength="50"
        type="password"
        autocomplete="off"
      />
      <!--      <div style="color: #999;position: relative;left: 101%;top: -33px;line-height: 16px">-->
      <!--        <div>1.密码由6-21个字符组成，区分大小写 </div>-->
      <!--        <div>2.需至少包含数字、字母和符号中的两种类型</div>-->
      <!--      </div>-->
      <!--      <span style="color: #999">1.密码由6-21个字符组成，区分大小写 2.需至少包含数字、字母和符号中的两种类型 </span>-->
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" :maxlength="50" placeholder="请输入" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      <!--      <el-button @click="resetForm('ruleForm')">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
import api from '../../api/center'
export default {
  name: 'ChangePassword',
  data() {
    // var validatePass3 = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error('请输入当前密码'))
    //   }
    // }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        newPassword: '',
        checkPass: '',
        currentPassword: '',
        username: ''
      },
      rules: {
        newPassword: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.getChangePassword(this.ruleForm).then(res => {
            this.$message.success('修改成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang="less">
.el-form {
  margin-top: 20px;
  width: 50%;
}
</style>
