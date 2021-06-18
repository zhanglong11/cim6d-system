<template>
  <el-tabs :tab-position="tabPosition" class="menuList">
    <el-tab-pane v-if="$hasPower('SystemCenterEnterpriseInfo')" label="企业信息">
      <h4>企业信息</h4>
      <EnterpriseInfo />
    </el-tab-pane>
    <el-tab-pane v-if="$hasPower('SystemCenterCenterInfo')" label="个人信息">
      <h4>个人信息</h4>
      <CenterInfo />
    </el-tab-pane>
    <el-tab-pane v-if="$hasPower('SystemCenterChangePassword')" label="修改密码">
      修改密码
      <ChangePassword />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import EnterpriseInfo from '@/views/system/center/components/EnterpriseInfo'
import CenterInfo from '@/views/system/center/components/CenterInfo'
import ChangePassword from '@/views/system/center/components/ChangePassword'
export default {
  name: 'SystemCenter',
  components: {
    EnterpriseInfo,
    CenterInfo,
    ChangePassword
  },
  data() {
    return {
      tabPosition: 'left'
      // fit: 'fill',
      // src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
    }
  }
}
</script>

<style scoped lang="less">
.menuList {
  height: calc(100vh - 100px);
  overflow-y: auto;
  /deep/.el-tabs__item.is-active {
    background: #e6f7ff;
  }
  h4 {
    font-size: 18px;
  }
}
.title {
  background: #f2f2f2;
  border: 3px;
  padding: 5px 10px;
  margin: 10px 0;
  font-size: 15px;
}
</style>
