<template>
  <div class="container">
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>基础信息</span>
        <el-tag v-if="!projectId" style="float: right;">实时保存{{ saveTime }}</el-tag>
      </div>

      <el-form ref="formRef" label-width="120px" :model="formData" :rules="rules">
        <el-row :gutter="20" inline>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="name" required>
              <el-input v-model="formData.name" :maxlength="100" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目类型" prop="type" required>
              <el-select v-model="formData.type" placeholder="请选择" class="w100">
                <template v-for="item in projectTypeList">
                  <el-option v-if="!item.disable" :key="item.value" :label="item.label" :value="item.value" />
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目负责人" prop="principal" required>
              <el-select v-model="formData.principal" placeholder="请选择" class="w100">
                <el-option v-for="item in principalList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="telephone" required>
              <el-input v-model="formData.telephone" :maxlength="11" placeholder="请输入电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" inline>
          <el-col :span="10">
            <el-form-item label="项目地址" prop="address" required>
              <el-cascader
                ref="addressCascader"
                v-model="formData.address"
                class="w100"
                :options="pca"
                :props="{ expandTrigger: 'hover' }"
                @change="changeAddress"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" icon="el-icon-location-information" @click="openMap()" />
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="detailAddress" required>
              <el-input v-model="formData.detailAddress" :maxlength="100" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" inline>
          <el-col :span="12">
            <el-form-item label="项目规模" prop="scale" required>
              <el-select v-model="formData.scale" placeholder="请选择" class="w100">
                <el-option v-for="item in scaleList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
          <el-col :span="24">
            <el-form-item label="建筑总规模" prop="totalBuildingScale" required>
              <el-input v-model="formData.totalBuildingScale" type="textarea" :maxlength="500" :rows="3" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建筑高度" prop="buildingHeight" required>
              <el-input v-model="formData.buildingHeight" :maxlength="50" type="number" placeholder="请输入数字">
                <template slot="append">米</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建筑面积" prop="buildingArea" required>
              <el-input v-model="formData.buildingArea" :maxlength="50" type="number" placeholder="请输入数字">
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程造价" prop="constructionCosts" required>
              <InputNumber
                v-model="formData.constructionCosts"
                placeholder="请输入数字"
                :min="0"
                :precision="4"
                unit="万元"
                :max="100000000"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结构形式" prop="structuralStyle" required>
              <el-input v-model="formData.structuralStyle" :maxlength="100" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目状态" prop="projectStatus" required>
              <el-select v-model="formData.projectStatus" placeholder="请选择" class="w100">
                <el-option
                  v-for="item in projectStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抗震等级" prop="seismicLevel" required>
              <el-select v-model="formData.seismicLevel" placeholder="请选择" class="w100">
                <el-option v-for="item in seismicLevelList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同开工时间" prop="startTime" required>
              <el-date-picker
                v-model="formData.startTime"
                class="w100"
                type="datetime"
                placeholder="选择日期时间"
                default-time="00:00:00"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同竣工时间" prop="endTime" required>
              <el-date-picker
                v-model="formData.endTime"
                class="w100"
                type="datetime"
                placeholder="选择日期时间"
                default-time="00:00:00"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" type="textarea" :maxlength="500" :rows="2" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
              <el-button type="primary" icon="el-icon-plus" size="mini" style="float: right;" @click="onUploadImg('1')"
                >上传图片</el-button
              >
            </div>
            <div class="one-img">
              <template v-for="(item, i) in imageListTemp[1]">
                <div :key="item.fileId" class="mask">
                  <div class="buttons">
                    <el-button type="text" icon="el-icon-edit-outline" @click="onEditImg(item, i, '1')">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" @click="deleteImg('single', i, '1')">删除</el-button>
                  </div>
                </div>
                <div :key="item.fileId + '_' + i" class="mask-title">
                  <p>
                    <span>{{ item.fileName }}</span>
                    <span class="time">{{ item.createTime }}</span>
                  </p>
                  <p v-if="item.remark" class="remark" v-text="item.remark"></p>
                </div>
                <img :key="i" :src="item.fileUrl" />
              </template>
              <div v-if="imageListTemp[1].length === 0" class="project-image-add" @click="onUploadImg('1')">
                <span class="el-icon-plus"></span>
              </div>
            </div>
          </el-card>
          <!-- 宣传图 end -->
        </el-col>
        <el-col :span="12">
          <!-- 全景图 start -->
          <el-card class="card">
            <div slot="header" class="clearfix">
              <span>全景图</span>
              <el-button type="primary" icon="el-icon-plus" size="mini" style="float: right;" @click="onUploadImg('2')"
                >上传图片</el-button
              >
            </div>
            <div class="one-img">
              <template v-for="(item, i) in imageListTemp[2]">
                <div :key="item.fileId" class="mask">
                  <div class="buttons">
                    <el-button type="text" icon="el-icon-edit-outline" @click="onEditImg(item, i, '2')">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" @click="deleteImg('single', i, '2')">删除</el-button>
                  </div>
                </div>
                <div :key="item.fileId + '_' + i" class="mask-title">
                  <p>
                    <span>{{ item.fileName }}</span>
                    <span class="time">{{ item.createTime }}</span>
                  </p>
                  <p v-if="item.remark" class="remark" v-text="item.remark"></p>
                </div>
                <img :key="i" :src="item.fileUrl" />
              </template>
              <div v-if="imageListTemp[1].length === 0" class="project-image-add" @click="onUploadImg('2')">
                <span class="el-icon-plus"></span>
              </div>
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
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="onUploadImg('3')">
              上传图片
            </el-button>
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
        <div v-if="!progressImgType" class="roll-img">
          <carousel :perPage="4" :scrollPerPage="false" navigationEnabled :paginationEnabled="false">
            <slide v-for="(item, i) in imageListTemp[3]" :key="i">
              <div class="mask">
                <div class="buttons">
                  <el-button type="text" icon="el-icon-edit-outline" @click="onEditImg(item, i, '3')">编辑</el-button>
                  <el-button type="text" icon="el-icon-delete" @click="deleteImg('single', i, '3')">删除</el-button>
                </div>
              </div>
              <div class="mask-title">
                <p>
                  <span>{{ item.fileName }}</span>
                  <span class="time">{{ item.createTime }}</span>
                </p>
                <p v-if="item.remark" class="remark" v-text="item.remark"></p>
              </div>
              <img :src="item.fileUrl" />
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
              <el-button type="text" @click="onEditImg(scope.row, scope.$index, '3')">编辑</el-button>
              <el-button type="text" class="imgView"
                >预览
                <el-image style="width" :src="scope.row.fileUrl" :preview-src-list="[scope.row.fileUrl]" />
              </el-button>
              <el-button type="text" @click="deleteImg('single', scope.$index, '3')">删除</el-button>
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
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="onUploadImg('4')">
              上传图片
            </el-button>
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
        <div v-if="!planeImgType" class="roll-img">
          <carousel :perPage="4" :scrollPerPage="false" navigationEnabled :paginationEnabled="false">
            <slide v-for="(item, i) in imageListTemp[4]" :key="i">
              <div class="mask">
                <div class="buttons">
                  <el-button type="text" icon="el-icon-edit-outline" @click="onEditImg(item, i, '4')">编辑</el-button>
                  <el-button type="text" icon="el-icon-delete" @click="deleteImg('single', i, '4')">删除</el-button>
                </div>
              </div>
              <div class="mask-title">
                <p>
                  <span>{{ item.fileName }}</span>
                  <span class="time">{{ item.createTime }}</span>
                </p>
                <p v-if="item.remark" class="remark" v-text="item.remark"></p>
              </div>
              <img :src="item.fileUrl" />
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
              <el-button type="text" @click="onEditImg(scope.row, scope.$index, '4')">编辑</el-button>
              <el-button type="text" class="imgView"
                >预览
                <el-image style="width" :src="scope.row.fileUrl" :preview-src-list="[scope.row.fileUrl]" />
              </el-button>
              <el-button type="text" @click="deleteImg('single', scope.$index, '4')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 平面图 end -->
    </el-card>

    <div class="footer-btn">
      <el-button @click="goBack">返回</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveProject('formRef')">提交</el-button>
    </div>

    <!-- 上传图片 模态框 -->
    <el-dialog :title="uploadImgTitle" :visible.sync="onUploadImgVisible" :destroy-on-close="true" width="40%">
      <el-form label-width="110px">
        <el-form-item label="图片" required>
          <Upload ref="uploadRef" :default-img="fileForm.fileUrl" btn-text="上传图片" @change="changeImage" />
        </el-form-item>
        <el-form-item label="文件名称" required>
          <el-input v-model="fileForm.fileName" />
        </el-form-item>
        <!-- <el-form-item v-if="['1', '2'].includes(activeName)" label="状态" required>
          <el-select v-model="fileForm.status" placeholder="请选择" class="w100">
            <el-option key="0" :value="0" label="启用" />
            <el-option key="1" :value="1" label="禁用" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="备注">
          <el-input v-model="fileForm.remark" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="onUploadImgVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUploadImgSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 地图弹窗 -->
    <el-dialog title="地图选点" :visible.sync="mapData.dialogVisible" width="1000px" custom-class="map-container">
      <Map
        :map-type="mapData.mapType"
        :address="mapData.addressDetail"
        :selected-position="mapData.selectedPostion"
        @choosedLocation="handlechoosedLocation"
      />
    </el-dialog>
  </div>
</template>

<script>
import { projectApi } from '@/views/system/api/project'
import Upload from '@/components/Upload/single-file'
import pca from '../config/pca.js'
import Map from '@/components/map'
import { Carousel, Slide } from 'vue-carousel'

export default {
  name: 'SystemProjectAdd',
  components: {
    Upload,
    Map,
    Carousel,
    Slide
  },
  data() {
    return {
      pca: pca, // 省市区初始化数据
      projectId: this.$route.query.projectId || '', // 项目id
      projectTypeList: this.$getArgList('projectType'), // 项目类型列表
      projectStatusList: this.$getArgList('projectStatus'), // 项目状态列表
      seismicLevelList: this.$getArgList('seismicLevel'), // 抗震等级列表
      scaleList: this.$getArgList('projectScale'), // 项目规模
      principalList: [], // 负责人列表
      btnLoading: false, // 防止重复提交
      cacheTimer: '', // 自动缓存定时器
      formData: {
        address: '', // 省市区
        buildingArea: 0, // 建筑面积(平方米)
        totalBuildingScale: '', // 建筑总规模
        buildingHeight: 0, // 建筑高度
        city: '', // 市
        constructionCosts: 0, // 工程造价
        county: '', // 区/县
        detailAddress: '', // 详细地址
        imageList: [], // 项目图片
        name: '', // 项目名称
        principal: '', // 项目负责人id
        projectStatus: '', // 项目状态
        province: '', // 省
        remark: '', // 备注
        scale: '', // 项目规模
        seismicLevel: '', // 抗震等级
        startTime: '', // 合同开工日期
        endTime: '', // 合同竣工日期
        structuralStyle: '', // 结构形式
        telephone: '', // 联系电话
        type: '', // 项目类型,
        latitude: '', // 纬度
        longitude: '' // 经度
      },
      rules: {
        name: [{ required: true, message: '请输入项目名称' }],
        type: [{ required: true, message: '请选择项目类型' }],
        principal: [{ required: true, message: '请选择项目负责人' }],
        telephone: [{ required: true, message: '请输入联系电话' }],
        address: [{ required: true, message: '请选择项目地址' }],
        detailAddress: [{ required: true, message: '请输入详细地址' }],
        scale: [{ required: true, message: '请输入项目规模' }],
        totalBuildingScale: [{ required: true, message: '请输入建筑总规模' }],
        buildingHeight: [{ required: true, message: '请输入建筑高度' }],
        buildingArea: [{ required: true, message: '请输入建筑面积' }],
        structuralStyle: [{ required: true, message: '请输入结构形式' }],
        constructionCosts: [{ required: true, message: '请输入工程造价' }],
        seismicLevel: [{ required: true, message: '请选择抗震等级' }],
        startTime: [{ required: true, message: '请选择合同开工时间' }],
        endTime: [{ required: true, message: '请选择合同竣工时间' }],
        projectStatus: [{ required: true, message: '请选择项目状态' }]
      },
      // 文件上传
      fileForm: {
        fileId: '',
        fileName: '',
        fileUrl: '',
        imageType: '',
        projectId: '',
        remark: '',
        sortFlag: 0,
        status: 0,
        uploadTime: ''
      }, // 带文件的表单对象
      fileFormBack: {},
      activeName: '1',
      editFileIndex: null, // 编辑图片索引
      imageListTemp: {
        1: [], // 宣传图
        2: [], // 全景图
        3: [], // 形象进度图
        4: [] // 平面图
      }, // 未确认的图片列表
      multipleSelection: [],
      onUploadImgVisible: false,
      deleteDisable: true,
      uploadImgTitle: '',
      // 地图弹窗
      mapData: {
        dialogVisible: false,
        mapType: null, // 联系地址还是注册地址
        selectedPostion: '', // 打开map组件是的默认位置
        addressDetail: '' // 详细位置
      },
      progressImgType: 0, // 形象进度图展示类型
      planeImgType: 0 // 平面图展示类型
    }
  },
  computed: {
    // 表单缓存
    formDataTemp() {
      return this.$store.state.system.projectAddTemp
    },
    // 上次保存时间
    saveTime() {
      return this.$store.state.system.saveTime
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.$store.commit('system/closeCacheTimer')
  },
  methods: {
    // 初始化
    init() {
      Object.assign(this.fileFormBack, this.fileForm)
      this.getPrincipalList()
      this.getProject()
    },
    // 打开地图
    openMap() {
      this.mapData.dialogVisible = true
    },
    // 地图选点后回填地址具体信息
    handlechoosedLocation(data) {
      const { province, city, district, addr, latitude, longitude } = data
      const matchedProvince = this.getAddressValueFormLabel(this.pca, province)
      const cityText = city || '省直辖县级行政区划'
      const matchedCity = this.getAddressValueFormLabel(matchedProvince.children, cityText)
      const matchedDistrict = this.getAddressValueFormLabel(matchedCity.children, district)
      this.formData.address = [matchedProvince.value, matchedCity.value, matchedDistrict.value]
      this.formData.detailAddress = addr
      this.formData.latitude = latitude
      this.formData.longitude = longitude
      Object.assign(this.formData, { province, city, county: district })
      this.mapData.dialogVisible = false
    },
    // 根据地址文本信息匹配对应的地址的val
    getAddressValueFormLabel(group, label) {
      // group 未空或空数组时
      if (!(group && group.length)) return {}
      // 当是直辖市时group 是长度1的数组
      if (group.length === 1) return group[0]
      // 其他情况
      const matchedItem = group.find(item => {
        return item.label === label
      })
      return matchedItem || {}
    },
    // 自动缓存
    autoSave() {
      if (this.formDataTemp) {
        Object.assign(this.formData, this.formDataTemp)
        const imageList = this.formData.imageList || []
        imageList.map(item => {
          this.imageListTemp[item.imageType].push(item)
        })
      }
      this.$store.commit('system/autoSaveProjectTemp', this.formData)
    },
    // 清除缓存
    clearCache() {
      this.$store.commit('system/clearProjectTemp')
    },
    // 查询项目详情
    async getProject() {
      if (!this.projectId) {
        this.autoSave()
        return
      }
      const result = await projectApi.getProject(this.projectId)
      const datas = result.data
      const imageList = datas.imageList || []
      imageList.map(item => {
        this.imageListTemp[item.imageType].push(item)
      })
      console.log(111, imageList)
      datas.imageList = imageList
      const addressList = datas.address ? datas.address.split('_') : []
      datas.address = addressList
      this.mapData.addressDetail = datas.province + datas.city + datas.county + datas.detailAddress
      this.formData = Object.assign({}, datas)
    },
    // 改变项目地址
    async changeAddress() {
      await this.$nextTick()
      const label = this.$refs.addressCascader.inputValue
      const [province, city, county] = label.split('/').map(e => e.trim())
      Object.assign(this.formData, { province, city, county })
    },
    // 图片上传成功
    changeImage(object) {
      Object.assign(this.fileForm, object)
    },
    // 选择表格数据
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.deleteDisable = this.multipleSelection.length === 0
    },
    // 处理图片列表
    formatImageList() {
      const imageListTemp = _.values(this.imageListTemp)
      const list = []
      imageListTemp.map(item => {
        if (item.length > 0) {
          list.push(...item)
        }
      })
      this.formData.imageList = list
    },
    // 保存项目
    saveProject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveProjectSuccess()
        } else {
          this.$message.error('表单信息有误')
          return false
        }
      })
    },
    // 保存项目 - 异步
    async saveProjectSuccess() {
      if (!this.formData.latitude) {
        this.$message.error('请选择项目经纬度，点击项目地址后面的图标选择')
        return
      }
      try {
        const params = Object.assign({}, this.formData, {
          address: this.formData.address.join('_')
        })
        this.btnLoading = true
        if (!this.projectId) {
          await projectApi.addProject(params)
          this.clearCache()
        } else {
          await projectApi.updateProject(params)
        }

        this.$message.success('操作成功')
        this.btnLoading = false
        this.goBack()
      } catch (e) {
        this.btnLoading = false
      }
    },
    // 显示图片上传模态框
    onUploadImg(activeName) {
      if (activeName) {
        this.activeName = activeName
      }
      this.uploadImgTitle = '上传图片'
      this.onUploadImgVisible = true
      this.fileForm = Object.assign({}, this.fileFormBack)
      // this.fileForm = null
    },
    // 编辑图片
    onEditImg(row, index, activeName) {
      if (activeName) {
        this.activeName = activeName
      }
      Object.assign(this.fileForm, row)
      this.uploadImgTitle = '编辑图片'
      this.editFileIndex = index
      this.onUploadImgVisible = true
    },
    // 上传图片确定
    onUploadImgSubmit() {
      // console.log(1111, this.fileForm.fileUrl)
      if (!this.fileForm.fileUrl) {
        this.$message.error('未上传图片或上传失败，请重新上传')
        return
      }
      this.fileForm.imageType = this.activeName
      if (this.fileForm.status === 0) {
        this.imageListTemp[this.activeName].forEach(e => {
          e.status = 1
        })
      }
      let activeName = parseInt(this.activeName)
      console.log(1111, activeName)
      if (this.editFileIndex === null || (activeName < 3 && this.imageListTemp[activeName].length === 0)) {
        this.imageListTemp[this.activeName].push(this.fileForm)
      } else {
        Object.assign(this.imageListTemp[this.activeName][this.editFileIndex], this.fileForm)
      }
      this.onUploadImgVisible = false
      this.formatImageList()
    },
    // 删除图片
    deleteImg(type, index, activeName) {
      if (activeName) {
        this.activeName = activeName
      }
      this.$confirm('确认删除选中的图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          if (type === 'single') {
            // 单张删除
            this.imageListTemp[this.activeName].splice(index, 1)
          } else {
            // 批量删除
            const fileList = _.difference(this.imageListTemp[this.activeName], this.multipleSelection)
            this.imageListTemp[this.activeName] = fileList
          }
        })
        .catch(() => {})
    },
    // 启用/禁用图片
    onDisableImg(row, index, activeName) {
      if (activeName) {
        this.activeName = activeName
      }
      if (row.status === 1) {
        this.imageListTemp[this.activeName].forEach(e => {
          e.status = 1
        })
        row.status = 0
      } else {
        row.status = 1
      }
    },
    // 获取项目负责人数据
    getPrincipalList() {
      const param = { realName: '' }
      projectApi.getPrincipalList(param).then(res => {
        this.principalList = res.data.map(item => {
          return { value: item.userId, label: item.userRealName }
        })
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
.container {
  padding-bottom: 20px;
}
.w100 {
  width: 100%;
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

.mask {
  position: absolute;
  padding: 0 10px;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.4s;
  opacity: 0;
  visibility: hidden;
  .buttons {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  /deep/button {
    color: #ccc;
    font-size: 16px;
    margin: 0;
    &:hover {
      color: #fff;
    }
  }
}
.mask-title {
  position: absolute;
  padding: 0 10px;
  width: 100%;
  left: 0;
  bottom: 0;
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
.roll-img {
  padding: 0 30px;
  height: 260px;
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
.project-image-add {
  border: 1px #ddd dashed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: #ccc;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    color: #409eff;
    border-color: #409eff;
  }
}
</style>
<style lang="less">
.map-container {
  .el-dialog__body {
    padding: 0;
  }
}
</style>
