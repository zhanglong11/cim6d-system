<!--
@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 全新代码，添加项目新增(编辑)模态框

@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-25
@任务类型: 修改代码，eslint处理，修改比例(40%)

@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-25
@任务类型: 修改代码，添加图片裁剪组件，图片上传接口，项目基本信息新增接口和编辑接口，修改比例(90%)

@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-26
@任务类型: 修改代码，添加施工管理业务表单扩展字段，修改比例(85%)
-->
<template>
  <el-dialog width="1080px" :title="`${dataProject.id ? '编辑' : '新建'}项目`" :visible="visible" @close="handleCancel">
    <el-form ref="formBaseInfo" :model="form.baseInfo" :rules="formRules" label-positon="left" label-width="130px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="form.baseInfo.name" placeholder="请输入项目名称" />
          </el-form-item>
          <el-form-item label="项目负责人" prop="principal">
            <el-select v-model="form.baseInfo.principal" placeholder="请选择项目负责人" style="width: 100%;">
              <el-option
                v-for="item in principalList"
                :key="item.userId"
                :label="item.userRealName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目地址" prop="address">
            <el-cascader
              v-if="visible"
              ref="addressCascader"
              v-model="form.baseInfo.address"
              placeholder="请选择项目地址"
              style="width: 100%;"
              :options="pca"
              @change="changeAddress"
            />
          </el-form-item>
          <el-form-item label="关联GIS库" prop="gisGraphicsLibraryId">
            <el-select v-model="form.baseInfo.gisGraphicsLibraryId" placeholder="请选择GIS" style="width: 100%;">
              <el-option v-for="(item, index) in gisList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="关联BIM库" prop="bimGraphicsLibraryId">
            <el-select v-model="form.baseInfo.bimGraphicsLibraryId" placeholder="请选择GIS" style="width: 100%;">
              <el-option v-for="(item, index) in bimList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目类型" prop="serviceId">
            <el-select
              v-model="form.baseInfo.serviceId"
              placeholder="请选择项目类型"
              style="width: 100%;"
              :disabled="form.extInfo.id ? true : false"
              @change="handleChangeProjectType"
            >
              <el-option v-for="item in projectType" :key="item.id" :label="item.argText" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="form.baseInfo.telephone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="详细地址" prop="detailAddress">
            <el-input v-model="form.baseInfo.detailAddress" placeholder="请输入详细地址" />
          </el-form-item>
          <el-form-item label="项目图片" prop="thumb">
            <el-upload
              class="upload-demo"
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="changeUpload"
            >
              <img v-if="form.baseInfo.thumb" :src="form.baseInfo.thumb" style="width: 380px; height: 215px;" />
              <i
                v-else
                class="el-icon-plus"
                style="width: 380px; line-height: 215px; border: dashed 1px #e5e5e5; border-radius: 5px;"
              />
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <ProjectExtendConstruction v-if="extConfigCode === 'construction'" ref="extendForm" :form="form" />
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </span>

    <el-dialog width="980px" title="图片剪裁" :visible.sync="dialogVisible" append-to-body>
      <div style="text-align: center; width: 100%; height: 500px;">
        <VueCropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :full="option.full"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :center-box="option.centerBox"
          :high="option.high"
          :fixed="option.fixed"
          :fixed-number="option.fixedNumber"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="finish">确认</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { projectApi } from '@/views/system/api/project'
import pca from '@/views/system/config/pca'
import anyRule from '@/lib/anyRule'
import { VueCropper } from 'vue-cropper'
import ProjectExtendConstruction from './project-extend-construction'
export default {
  name: 'ProjectEditModal',
  components: { VueCropper, ProjectExtendConstruction },
  props: {
    visible: Boolean,
    dataProject: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      projectType: [], // 项目类型
      principalList: [], // 项目负责人
      gisList: [], // 关联gis库
      bimList: [], // 关联bim库
      pca: pca,
      form: {
        baseInfo: {},
        extInfo: {}
      },
      formRules: {
        name: [
          { required: true, message: '请输入项目名称' },
          { min: 2, max: 100, message: '长度大于2小于100' },
          { pattern: anyRule.nickName, message: '仅支持字母、数字、汉字' }
        ],
        serviceId: [{ required: true, message: '请选择项目类型' }],
        principal: [{ required: true, message: '请选择项目负责人' }],
        telephone: [
          { required: true, message: '请选输入联系电话' },
          { pattern: anyRule.mobile, message: '手机号不合法' }
        ],
        address: [{ required: true, message: '请选择项目地址' }],
        detailAddress: [
          { required: true, message: '请输入项目详细地址' },
          { min: 2, max: 100, message: '长度大于2小于100' }
        ]
      },
      extConfigCode: '',
      // 裁剪框属性
      option: {
        img: '',
        size: 1,
        full: true,
        original: false,
        autoCrop: true,
        centerBox: false,
        high: true,
        fixed: true,
        fixedNumber: [16, 9]
      },
      fileInfo: null,
      dialogVisible: false,
      loading: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        // 加载项目类型
        projectApi.getProjectType().then(res => {
          this.projectType = res.data
          if (this.dataProject.id) {
            // 回显项目类型
            this.form.baseInfo.serviceId = parseInt(this.dataProject.serviceId)
            this.getProjectTypeCode(this.form.baseInfo.serviceId)
          }
        })
        // 加载项目负责人列表
        projectApi.getPrincipalList({}).then(res => {
          this.principalList = res.data
          if (this.dataProject.id) {
            // 回显项目负责人
            this.form.baseInfo.principal = this.dataProject.principal
          }
        })

        this.extConfigCode = ''
        this.form.baseInfo = {
          id: '',
          name: '',
          serviceId: undefined,
          principal: undefined,
          telephone: '',
          address: undefined,
          detailAddress: '',
          thumb: '',
          gisGraphicsLibraryId: undefined,
          bimGraphicsLibraryId: undefined,
          type: ''
        }
        this.form.extInfo = {}
        if (this.$refs.formBaseInfo) {
          this.$refs.formBaseInfo.resetFields()
          if (this.$refs.formExtInfo) {
            this.$refs.formExtInfo.resetFields()
          }
        }

        if (this.dataProject.id) {
          // 回显项目基本信息
          this.form.baseInfo.id = this.dataProject.id
          this.form.baseInfo.name = this.dataProject.name
          this.form.baseInfo.telephone = this.dataProject.telephone
          this.form.baseInfo.address = this.dataProject.address.split('_')
          this.form.baseInfo.detailAddress = this.dataProject.detailAddress
          this.form.baseInfo.thumb = this.dataProject.thumb
          this.form.baseInfo.province = this.dataProject.province || ''
          this.form.baseInfo.city = this.dataProject.city || ''
          this.form.baseInfo.county = this.dataProject.county || ''

          // 根据项目基本信息id，查询项目基本信息和扩展信息
          projectApi.getProject(this.dataProject.id).then(res => {
            // console.log(res)
            if (res.data.extInfo) {
              // 回显扩展信息
              this.form.extInfo = { ...res.data.extInfo }
            }
          })
        }
      }
    }
  },
  mounted() {},
  methods: {
    // 改变项目地址
    async changeAddress() {
      await this.$nextTick()
      const label = this.$refs.addressCascader.inputValue
      const [province, city, county] = label.split('/').map(e => e.trim())
      Object.assign(this.form.baseInfo, { province, city, county })
    },
    handleCancel() {
      /* this.$refs.formBaseInfo.resetFields()
      if (this.$refs.formExtInfo) {
        this.$refs.formExtInfo.resetFields()
      } */
      this.$emit('update:visible', false)
    },
    handleChangeProjectType(e) {
      this.getProjectTypeCode(e)
    },
    getProjectTypeCode(e) {
      let argCode = null
      for (let i = 0; i < this.projectType.length; i++) {
        if (this.projectType[i].id === e) {
          argCode = this.projectType[i].argCode
          break
        }
      }
      if (argCode) {
        this.extConfigCode = argCode
      }
    },
    // 项目保存操作
    handleSave() {
      this.$refs.formBaseInfo.validate(validBase => {
        if (validBase) {
          if (this.$refs.extendForm) {
            // 对基本信息和扩展信息做保存操作
            this.$refs.extendForm.$refs.formExtInfo.validate(validExt => {
              if (validExt) {
                const param = {
                  baseInfo: {
                    ...this.form.baseInfo,
                    address: this.form.baseInfo.address.join('_'),
                    type: this.extConfigCode
                  },
                  extInfo: {
                    ...this.form.extInfo
                  }
                }
                if (this.dataProject.id) {
                  // 编辑项目
                  projectApi.updateProject(param).then(res => {
                    // console.log(res)
                    this.handleCancel()
                    this.$emit('refresh')
                  })
                } else {
                  // 新增项目
                  projectApi.addProject(param).then(res => {
                    // console.log(res)
                    this.handleCancel()
                    this.$emit('refresh')
                  })
                }
              }
            })
          } else {
            // 只对基本信息做保存操作
            const param = {
              baseInfo: {
                ...this.form.baseInfo,
                address: this.form.baseInfo.address.join('_'),
                type: this.extConfigCode
              },
              extInfo: {}
            }
            if (this.dataProject.id) {
              // 编辑项目
              projectApi.updateProject(param).then(res => {
                // console.log(res)
                this.handleCancel()
                this.$emit('refresh')
              })
            } else {
              // 新增项目
              projectApi.addProject(param).then(res => {
                // console.log(res)
                this.handleCancel()
                this.$emit('refresh')
              })
            }
          }
        }
      })
    },
    // 上传文件状态改变事件
    changeUpload(file, fileList) {
      // console.log(file)
      const isJpgOrPng = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只能上传jpg或png图片')
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
        return false
      }

      this.fileInfo = file
      const reader = new FileReader()
      reader.onload = e => {
        const data = window.URL.createObjectURL(new Blob([e.target.result]))
        // console.log(data)
        this.option.img = data
        this.dialogVisible = true
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file.raw)
    },
    // 裁剪框确定事件
    finish() {
      this.$refs.cropper.getCropBlob(data => {
        // console.log(data) // 这个就是file对象，添加到formData里上传
        const formData = new FormData()
        // console.log(this.fileInfo)
        // console.log(data)
        // formData.append('file', this.fileInfo.raw, this.fileInfo.name)
        this.loading = true
        formData.append('file', data, this.fileInfo.name)
        projectApi.upLoadFile(formData).then(
          res => {
            // console.log(res)
            this.dialogVisible = false
            this.form.baseInfo.thumb = res.data
            this.loading = false
          },
          () => {
            this.loading = false
          }
        )
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
