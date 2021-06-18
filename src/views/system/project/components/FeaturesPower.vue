<template>
  <div>
    <el-card v-if="sourcePower.length > 0" class="parend-card">
      <div v-if="roleId" slot="header" class="main-card-header">
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">
          全选
        </el-checkbox>
      </div>
      <div class="tree-roll">
        <TreeCard
          ref="treeCard"
          isProjectRole
          :data="sourcePower"
          :all-data="sourcePower"
          :role-id="roleId"
          :power-list-role="powerListRole"
          @on-change="changePower"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { roleApi } from '@/views/system/api/role'
import { projectApi } from '@/views/system/api/project'
import TreeCard from '../../components/tree-card'
export default {
  name: 'FeaturesPower',
  components: {
    TreeCard
  },
  props: {
    roleId: {
      type: [String, Number],
      default: ''
    },
    sourcePower: {
      type: Array,
      default: () => []
    }
  },
  data() {
    // 这里存放数据
    return {
      checkAll: false,
      powerListRole: [], // 已分配的权限
      selectPower: [], // 选择的权限
      isLoading: false // 保存按钮loading
    }
  },
  computed: {
    // 公司信息
    companyInfo() {
      return this.$store.state.system.companyInfo
    }
  },
  watch: {
    roleId: {
      immediate: true,
      handler() {
        this.init()
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    // 初始化
    init() {
      this.getPowerListRole()
    },
    // 获取角色已分配权限
    async getPowerListRole() {
      const result = await projectApi.getPowerByRoleProjectRole(this.roleId)
      const datas = result.data
      this.powerListRole = _.map(datas, 'powerId')
    },
    // 权限改变
    changePower(array) {
      this.selectPower = array
      this.$emit('handleSelectChange', array)
    },
    // 当全选点击时的事件
    handleCheckAllChange(checked) {
      this.$refs.treeCard.handleCheckAllToggle(checked)
    }
  }
}
</script>
<style lang="less" scoped>
@line: #e5e5e5;
//@import url(); 引入公共css类
/deep/.checkbox-tree {
  .no-icon {
    display: none;
  }
}
.main-card-header {
  display: flex;
  align-items: center;
  .el-checkbox {
    margin-right: 10px;
  }
}
</style>
