<template>
  <div>
    <el-dialog
      title="变更手机"
      :visible="visible"
      width="500px"
      top="10vh"
      :close-on-click-modal="false"
      @close="$emit('update:visible', false)"
    >
      <el-form ref="form" :model="form" label-width="100px" :rules="formRule" class="dialogForm">
        <el-form-item label="登录密码：" prop="passWord">
          <el-input v-model="form.passWord" class="formInput" />
        </el-form-item>
        <el-form-item label="新手机号：" prop="phone">
          <el-input v-model="form.phone" class="formInput" />
        </el-form-item>
        <el-form-item label="验证码：" prop="code">
          <el-input v-model="form.code" class="formInput" />
          <el-button type="primary" class="code">验证码</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button type="primary" @click="handleEmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ChangePhoneDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var checkphone = (rule, value, callback) => {
      // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!this.isCellPhone(value)) {
        // 引入methods中封装的检查手机格式的方法
        callback(new Error('请输入正确的手机号!'))
      } else {
        callback()
      }
    }
    return {
      form: {},
      formRule: {
        passWord: [{ required: true, validator: checkphone, message: '请输入密码', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'change' }],
        code: [{ required: true, message: '请输入验证码' }]
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    // 检查手机号
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false
      } else {
        return true
      }
    },
    handleEmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form)
        } else {
          this.$message.error('请正确填写')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.formInput {
  width: 300px !important;
}
.dialogForm {
  padding: 10px 20px;
}
.el-form-item__content {
  position: relative;
}
.code {
  position: absolute;
  top: 1px;
  right: 20px;
}
</style>
