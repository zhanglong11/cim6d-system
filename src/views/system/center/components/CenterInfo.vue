<template>
  <el-form ref="form" :model="form" label-width="120px" class="demo-dynamic" :rules="rules">
    <el-row>
      <el-col>
        <el-form-item label="头像：">
          <div class="formInput">
            <div class="avatar-wrap">
              <el-avatar :size="100" :src="form.headImage" />
              <i id="pick-avatar" class="el-icon-edit-outline" />
            </div>
            <avatar-cropper
              trigger="#pick-avatar"
              :upload-headers="{ 'x-access-token': $store.state.user.token }"
              :upload-url="`/cim6d-file-storage${runProcess}/file/commonFile/uploadImage`"
              :output-options="{ width: 200, height: 200 }"
              @uploaded="handleUploaded"
            />
          </div>
          <!--          <el-upload-->
          <!--            class="avatar-uploader"-->
          <!--            action="https://jsonplaceholder.typicode.com/posts/"-->
          <!--            :show-file-list="false"-->
          <!--            :on-success="handleAvatarSuccess"-->
          <!--            :before-upload="beforeAvatarUpload"-->
          <!--          >-->
          <!--            <img v-if="imageUrl" :src="imageUrl" class="avatar">-->
          <!--            <i v-else class="el-icon-plus avatar-uploader-icon" />-->
          <!--          </el-upload>-->
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="姓名：">
          <el-input v-model="form.realName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机：">
          <div class="inline">
            <el-input v-model="form.mobile" disabled />
            <!--            <el-button type="primary" @click="handleChangePhone">变更手机</el-button>-->
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" :md="12">
        <el-form-item label="性别：" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12" :md="12">
        <!--        <el-form-item label="密码：">-->
        <!--          <el-input v-model="form.loginName" type="password" :show-password="true"></el-input>-->
        <!--        </el-form-item>-->

        <!--        <el-form-item label="密码：" prop="password">-->
        <!--          <el-input v-if="visible" v-model="form.password" type="password" disabled>-->
        <!--            <i-->
        <!--              slot="suffix"-->
        <!--              title="显示密码"-->
        <!--              style="cursor:pointer;"-->
        <!--              class="el-icon-view icon-hide"-->
        <!--              @click="changePass('show')"-->
        <!--            />-->
        <!--          </el-input>-->
        <!--          <el-input v-else v-model="form.password" type="text">-->
        <!--            <i-->
        <!--              slot="suffix"-->
        <!--              title="隐藏密码"-->
        <!--              style="cursor:pointer;"-->
        <!--              class="el-icon-view icon-show"-->
        <!--              @click="changePass('hide')"-->
        <!--            />-->
        <!--          </el-input>-->
        <!--        </el-form-item>-->
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="部门：">
          <el-select v-model="departmentIdList" placeholder="" disabled style="width: 100%;" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="职位：">
          <el-input v-model="form.position" :maxlength="50" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="角色：">
          <el-input v-model="roleTexts" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="邮箱：">
          <el-input v-model="form.email" :maxlength="50" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="生日：">
          <!--          <el-input v-model="form.birthday" />-->
          <el-date-picker
            v-model="form.birthday"
            value-format="yyyy-MM-dd 00:00:00"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="身份证号：">
          <el-input v-model="form.identityCardNumber" :maxlength="50" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="QQ：">
          <el-input v-model="form.qqNumber" :maxlength="50" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="微信：">
          <el-input v-model="form.wechatNumber" :maxlength="50" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="入职时间：">
          <el-date-picker
            v-model="form.entryDate"
            value-format="yyyy-MM-dd 00:00:00"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="就业日期：">
          <el-date-picker
            v-model="form.jobDate"
            value-format="yyyy-MM-dd 00:00:00"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="备注：">
          <el-input v-model="form.remark" :maxlength="50" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <!--      <el-button>取消</el-button>-->
    </el-form-item>
    <ChangePhoneDialog v-if="changePhoneVisile" :visible.sync="changePhoneVisile" />
  </el-form>
</template>

<script>
import api from '@/views/system/api/center'
import AvatarCropper from 'vue-avatar-cropper'
import ChangePhoneDialog from '@/views/system/center/components/ChangePhoneDialog'
export default {
  name: 'CenterInfo',
  components: {
    AvatarCropper,
    ChangePhoneDialog
    // DepartmentSelect
  },
  data() {
    return {
      runProcess: process.env.VUE_APP_BASE_API,
      form: {
        loginName: '张珊',
        region: '',
        password: '1111',
        jobDate: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        department: '部门1',
        mobile: '18542568595',
        desc: '',
        remark: '',
        departmentIdList: ''
      },
      changePhoneVisile: false,
      departmentIdList: '', // 获取部门
      roleTexts: '', // 获取角色
      rules: {
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }]
      },
      visible: true,
      // 上传图片url
      imageUrl: ''
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    handleUploaded(res) {
      this.form.headImage = res.data
    },
    async getUserInfo() {
      const res = await api.getUserInfo()
      const datas = res.data
      datas.departmentIdList = datas.departmentList ? _.map(datas.departmentList, 'departmentId') : []
      datas.roleIdList = datas.roleList ? _.map(datas.roleList, 'roleId') : []
      this.form = datas
      this.departmentIdList = datas.departmentList && datas.departmentList.map(item => item.departmentName).join(' ，')
      this.roleTexts = datas.roleTexts && datas.roleTexts.join(' ，')
    },
    onSubmit() {
      api.getUserUpdate(this.form).then(res => {
        this.$message.success('保存成功')
        this.getUserInfo()
      })
    },
    handleChangePhone() {
      this.changePhoneVisile = true
    },

    // 控制密码显示隐藏
    changePass(value) {
      this.visible = !(value === 'show')
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  width: 70%;
}
.inline {
  display: flex;
  .el-button {
    margin-left: 15px;
  }
}
.icon-hide {
  color: #ccc;
  /*background: url("../../../../assets/images/pwdHide.png");*/
}
.icon-show {
  color: #2cb7e7;
}

/deep/.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    padding: 3px;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
    }
  }
}
/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
/deep/ .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
/*/deep/.el-input__inner{*/
/*  width: 50%;*/
/*}*/
.avatar-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  #pick-avatar {
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    height: 25px;
    color: #fff;
    text-align: center;
    line-height: 25px;
  }
}
</style>
