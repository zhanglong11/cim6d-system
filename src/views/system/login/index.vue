<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">CIM6D</h3>
      </div>

      <el-form-item prop="loginName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginName"
          v-model="loginForm.loginName"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          autocomplete="off"
          @keyup.enter.native="loginCheck"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" size="lg" style="width: 100%;" @click="loginCheck">登 录</el-button>
    </el-form>
    <div class="logoContainer" />
  </div>
</template>

<script>
import { userApi } from '@/views/system/api/user'
import { setToken } from '@/utils/auth'
import { userEncryption } from '@/utils'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      // 登录参数
      loginForm: {
        loginName: process.env.VUE_APP_USERNAME,
        password: process.env.VUE_APP_USEPSWD
      },
      // 登录验证
      loginRules: {
        loginName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false, // 登录按钮状态
      passwordType: 'password',
      redirect: undefined,
      token: this.$route.query.token || ''
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.setPower(this.token)
    },
    // 显示密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录验证
    loginCheck() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginSuccess()
        }
      })
    },
    // 登录 - 异步
    async loginSuccess() {
      try {
        // 登录加密
        const params = userEncryption(this.loginForm)
        this.loading = true
        const result = await userApi.login(params)
        const datas = result.data || ''
        this.setPower(datas)
      } catch (e) {
        this.loading = false
      }
    },
    // 设置权限
    setPower(token) {
      if (!token) {
        return
      }
      setToken(token)
      this.$store.commit('user/SET_TOKEN', token)
      this.$store.commit('getPower', power => {
        this.loading = false
        if (power.length === 0) {
          this.$message.error('无项目权限，请联系企业管理员')
          setTimeout(() => {
            this.$store.dispatch('user/logout')
          }, 1500)
          return
        } else {
          this.$router.push({ name: power[1] })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #e5e5e5 inset !important;
        -webkit-text-fill-color: #333 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #666;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url('../../../assets/images/login-bg.jpg') $bg no-repeat;
  background-size: cover;
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 520px;
    max-width: 100%;
    min-height: 320px;
    padding: 0 35px;
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    border-radius: 12px;
    left: 50%;
    top: 50%;
    margin-left: -260px;
    margin-top: -240px;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 30px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.logoContainer {
  height: 40px;
  width: 300px;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: url('~@/assets/images/black-logo.png') no-repeat center center;
}
</style>
