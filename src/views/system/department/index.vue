<template>
  <div class="container">
    <el-tabs v-model="tabIndex" type="card" @tab-click="clickTab">
      <el-tab-pane v-if="$hasPower('SystemDepartmentOrganizationManage')" label="组织架构管理" name="first"
        ><OrganizationManage
      /></el-tab-pane>
      <el-tab-pane v-if="$hasPower('SystemDepartmentOrganizationPicture')" lazy label="组织架构图" name="second"
        ><OrganizationPicture v-if="tabIndex === 'second'"
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import OrganizationManage from './components/OrganizationManage'
import OrganizationPicture from './components/OrganizationPicture'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SystemDepartment',
  components: {
    OrganizationManage,
    OrganizationPicture
  },
  data() {
    // 这里存放数据
    return {
      tabIndex: 'first'
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    clickTab(e) {}
  }
}
</script>
<style lang="less" scoped>
.container {
  height: calc(100vh - 100px);
}
</style>
