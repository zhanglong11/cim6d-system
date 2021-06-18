<!--
@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-26
@任务类型: 全新代码，添加项目表单扩展字段(施工管理业务)
-->
<template>
  <el-form ref="formExtInfo" :model="form.extInfo" :rules="formRules" label-positon="left" label-width="130px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="项目规模" prop="scale">
          <el-input v-model="form.extInfo.scale" placeholder="请输入项目规模" />
        </el-form-item>
        <el-form-item label="建设单位" prop="constructionUnit">
          <el-input v-model="form.extInfo.constructionUnit" placeholder="请输入建设单位" />
        </el-form-item>
        <el-form-item label="施工单位" prop="constructionOrganization">
          <el-input v-model="form.extInfo.constructionOrganization" placeholder="请输入施工单位" />
        </el-form-item>
        <el-form-item label="建筑层数" prop="buildingFloorNum">
          <el-input-number
            v-model="form.extInfo.buildingFloorNum"
            controls-position="right"
            :precision="0"
            :min="1"
            style="width: 100%;"
            placeholder="请输入建筑层数"
          />
        </el-form-item>
        <el-form-item label="建筑面积(平方米)" prop="buildingArea">
          <el-input-number
            v-model="form.extInfo.buildingArea"
            controls-position="right"
            :precision="1"
            :min="1"
            style="width: 100%;"
            placeholder="请输入建筑面积"
          />
        </el-form-item>
        <el-form-item label="工程造价" prop="constructionCosts">
          <el-input-number
            v-model="form.extInfo.constructionCosts"
            controls-position="right"
            :precision="2"
            :min="1"
            style="width: 100%;"
            placeholder="请输入工程造价"
          />
        </el-form-item>
        <el-form-item label="合同开工时间" prop="startTime">
          <el-date-picker
            v-model="form.extInfo.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%;"
            placeholder="请选择合同开工时间"
          />
        </el-form-item>
        <el-form-item label="项目状态" prop="projectStatus">
          <el-select v-model="form.extInfo.projectStatus" style="width: 100%;" placeholder="请选择项目状态">
            <el-option value="1" label="未开始" />
            <el-option value="2" label="进行中" />
            <el-option value="3" label="竣工" />
            <el-option value="4" label="停工" />
            <el-option value="5" label="验收" />
            <el-option value="6" label="禁用" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="勘察单位" prop="mainContractor">
          <el-input v-model="form.extInfo.mainContractor" placeholder="请输入勘察单位" />
        </el-form-item>
        <el-form-item label="监理单位" prop="supervisingUnit">
          <el-input v-model="form.extInfo.supervisingUnit" placeholder="请输入监理单位" />
        </el-form-item>
        <el-form-item label="设计单位" prop="designOrganization">
          <el-input v-model="form.extInfo.designOrganization" placeholder="请输入设计单位" />
        </el-form-item>
        <el-form-item label="建筑高度" prop="buildingHeight">
          <el-input-number
            v-model="form.extInfo.buildingHeight"
            controls-position="right"
            :precision="1"
            :min="1"
            style="width: 100%;"
            placeholder="请输入建筑高度"
          />
        </el-form-item>
        <el-form-item label="结构形式" prop="structuralStyle">
          <el-input v-model="form.extInfo.structuralStyle" placeholder="请输入结构形式" />
        </el-form-item>
        <el-form-item label="抗震等级" prop="seismicLevel">
          <el-select v-model="form.extInfo.seismicLevel" style="width: 100%;" placeholder="请选择抗震等级">
            <el-option value="1" label="一级" />
            <el-option value="2" label="二级" />
            <el-option value="3" label="三级" />
            <el-option value="4" label="四级" />
          </el-select>
        </el-form-item>
        <el-form-item label="合同竣工时间" prop="startTime">
          <el-date-picker
            v-model="form.extInfo.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%;"
            placeholder="请选择合同竣工时间"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.extInfo.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formRules: {
        scale: [{ required: true, message: '请输入项目规模' }],
        mainContractor: [{ required: true, message: '请输入勘察单位' }],
        constructionUnit: [{ required: true, message: '请输入建设单位' }],
        supervisingUnit: [{ required: true, message: '请输入监理单位' }],
        constructionOrganization: [{ required: true, message: '请输入施工单位' }],
        designOrganization: [{ required: true, message: '请输入设计单位' }],
        buildingFloorNum: [{ required: true, message: '请输入建筑层数' }],
        buildingHeight: [{ required: true, message: '请输入建筑高度' }],
        buildingArea: [{ required: true, message: '请输入建筑面积' }],
        structuralStyle: [{ required: true, message: '请输入结构形式' }],
        constructionCosts: [{ required: true, message: '请输入工程造价' }],
        seismicLevel: [{ required: true, message: '请选择抗震等级' }],
        startTime: [{ required: true, message: '请选择合同开工时间' }],
        endTime: [{ required: true, message: '请选择合同竣工时间' }],
        projectStatus: [{ required: true, message: '请选择项目状态' }],
        remark: []
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
