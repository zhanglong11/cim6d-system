<template>
  <div>
    <el-dialog
      title="选择单位"
      :visible="visible"
      width="600px"
      top="10vh"
      append-to-body
      :close-on-click-modal="false"
      @close="$emit('update:visible', false)"
    >
      <el-form ref="form" :model="form" label-width="100px" :rules="formRule" class="dialogForm">
        <el-form-item label="已选择：" prop="name">
          <div class="aa">
            <template v-if="checkNodes.length">
              <el-tag v-for="item of checkNodes" :key="item.id" class="tag" closable @close="handleClose(item)">
                {{ item.participantCompanyName }}
              </el-tag>
            </template>
            <template v-else>
              还没有选择的数据
            </template>
          </div>
        </el-form-item>
        <div class="selectContainer">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤"> </el-input>
          <el-tree
            ref="tree"
            :data="copyCompanyList"
            :default-checked-keys="selectedCompanyKeys"
            show-checkbox
            default-expand-all
            check-strictly
            node-key="participantCompanyId"
            :filter-node-method="filterTree"
            @check-change="handleCheckChange"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node" :class="{ isP: data.type === 0 }">
              <span v-if="data.type === 0">{{ data.participantTypeName }}</span>
              <span v-else>{{ data.participantCompanyName }}</span>
              <span> </span>
            </span>
          </el-tree>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button type="primary" @click="handleEmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { roleApi } from '@/views/system/api/role'
import { mapGetters } from 'vuex'
import treeFilter from '@/utils/treeFilter'
import treeForEach from '@/utils/treeForEach'
export default {
  name: 'SelectCompany',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectedCompany: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: {},
      value: '',
      formRule: {
        name: [{ message: '请输入名称', trigger: 'blur' }]
      },
      companyList: [],
      copyCompanyList: [],
      checkNodes: [],
      filterText: ''
    }
  },
  computed: {
    // 公司信息
    companyInfo() {
      return this.$store.state.system.companyInfo
    },
    selectedCompanyKeys() {
      return this.selectedCompany.map(item => item.id)
    },
    checkNodesKeys() {
      return this.checkNodes.map(item => item.id)
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    setTimeout(() => {
      this.$refs.tree.setCheckedKeys(this.selectedCompanyKeys)
      this.checkNodes = this.$refs.tree.getCheckedNodes()
    }, 500)
  },
  created() {
    this.getCompanyList()
  },
  // 方法集合
  methods: {
    //获取公司列表
    async getCompanyList() {
      let res = await roleApi.getCompanyList({ projectId: this.projectId })
      let resData = res.data || []
      let dataFilter = treeFilter(resData, e => {
        return e.type <= 1
      })
      treeForEach(dataFilter, e => {
        if (e.type === 0) {
          e.disabled = true
        }
        return e
      })
      this.companyList = [
        {
          id: 1,
          type: 0,
          participantTypeName: '主办方',
          disabled: true,
          children: [
            { participantCompanyId: this.companyInfo.id, participantCompanyName: this.companyInfo.name, type: 1 }
          ]
        },
        ...dataFilter
      ]
      this.copyCompanyList = _.cloneDeep(this.companyList)
    },
    filterTree(value, data) {
      if (!value) return true
      let name = data.participantCompanyName || data.participantTypeName
      return name.indexOf(value) !== -1
    },
    handleCheckChange() {
      let checkedNodes = this.$refs.tree.getCheckedNodes()
      this.checkNodes = checkedNodes
    },
    handleClose(item) {
      this.checkNodes = this.$refs.tree.getCheckedNodes().filter(e => e.id !== item.id)
      this.$refs.tree.setCheckedKeys(this.checkNodesKeys)
    },
    handleEmit() {
      this.$emit('submit', this.checkNodes)
    }
  }
}
</script>
<style lang="less" scoped>
.formInput {
  width: 400px;
}
.dialogForm {
  padding: 10px 20px;
}
.tag {
  margin: 0 10px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selectContainer {
  //max-height: 500px;
  //min-height: 300px;
  height: 400px;
  overflow: auto;
  border: 1px #999 solid;
  padding: 20px 40px;
}
/deep/ .el-tree-node {
  margin: 5px 0;
  .el-tree-node__content {
    height: 30px;
    line-height: 30px;
    .el-checkbox {
      &.is-disabled {
        display: none;
      }
    }
    .el-tree-node__expand-icon {
      position: absolute;
      right: 0;
    }
    .isP {
      width: 100%;
      padding: 0 10px;
      background-color: #f2f2f2;
    }
  }
}
</style>
