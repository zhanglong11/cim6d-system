<!--
@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-26
@任务类型: 全新代码，添加【施工管理业务】扩展信息详情
-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">项目规模：{{ extInfo.scale }}</el-col>
      <el-col :span="12">勘察单位：{{ extInfo.mainContractor }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">建设单位：{{ extInfo.constructionUnit }}</el-col>
      <el-col :span="12">监理单位：{{ extInfo.supervisingUnit }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">施工单位：{{ extInfo.constructionOrganization }}</el-col>
      <el-col :span="12">设计单位：{{ extInfo.designOrganization }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">建筑层数：{{ extInfo.buildingFloorNum }}</el-col>
      <el-col :span="12">建筑高度：{{ extInfo.buildingHeight }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">建筑面积(平方米)：{{ extInfo.buildingArea }}</el-col>
      <el-col :span="12">结构形式：{{ extInfo.structuralStyle }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">工程造价(万元)：{{ extInfo.constructionCosts }}</el-col>
      <el-col :span="12">抗震等级：{{ extInfo.seismicLevel }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">合同开工日期：{{ extInfo.startTime }}</el-col>
      <el-col :span="12">合同竣工日期：{{ extInfo.endTime }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">项目状态：{{ extInfo.projectStatus }}</el-col>
      <el-col :span="12">备注：{{ extInfo.remark ? extInfo.remark : '-' }}</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    extInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped></style>
