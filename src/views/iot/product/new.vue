<template>
  <!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-9日
任务类型：1、全新代码
**/
-->
  <div>
    <el-form ref="form" style="width: 600px;" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="产品名称" prop="name"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="标准品类" prop="templateId">
        <SelectCategory v-model="form.templateId" />
      </el-form-item>
      <el-form-item label="节点类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="e in productTypeList" :key="e.value" :label="e.value">{{ e.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="接入服务" prop="accessServiceId">
        <el-radio-group v-model="form.accessServiceId">
          <el-radio v-for="e in accessServiceList" :key="e.value" :label="e.value">{{ e.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产品描述" prop="description">
        <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
      </el-form-item>
      <el-form-item>
        <el-button @click="goBack()">取消</el-button>
        <el-button type="primary" @click="submit">创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import productTypeList from '../lib/productTypeList'
import accessServiceList from '../lib/accessServiceList'
import SelectCategory from '../components/SelectCategory'
export default {
  name: 'IotProductAdd',
  components: { SelectCategory },
  data() {
    return {
      form: {
        projectId: localStorage.getItem('projectId')
      },
      rules: {
        name: [{ required: true, message: '必填' }],
        templateId: [{ required: true, message: '必填' }],
        type: [{ required: true, message: '必填' }],
        accessServiceId: [{ required: true, message: '必填' }]
      },
      productTypeList,
      accessServiceList
    }
  },
  created() {},
  mounted() {},
  methods: {
    async submit() {
      await this.$refs.form.validate()
      this.axios.iot.post('product/add', this.form).then(res => {
        this.$message.success('创建成功')
        this.$router.back()
      })
    },
    // 返回
    goBack() {
      this.$router.push({
        path: '/environmental-monitoring/product'
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
