<template>
  <div>
    <el-card>
      <div>
        <vxe-table
          ref="xTable"
          resizable
          auto-resize
          row-id="powerId"
          keep-source
          :border="false"
          :tree-config="{ children: 'children', expandAll: true, reserve: true }"
          :edit-config="{ trigger: 'click', mode: 'row' }"
          :data="tableData"
          @cell-mouseenter="handleEnter"
        >
          <vxe-table-column field="powerName" title="菜单名称" width="300" tree-node align="left" />
          <vxe-table-column field="range" title="数据权限范围" :edit-render="{}" align="left">
            <template v-slot:edit="{ row }">
              <template v-if="row.type === 2">
                <el-radio-group v-model="row.rangeType">
                  <el-radio :label="1" @change="e => handleRadioChange(1, row)">所有单位</el-radio>
                  <el-radio :label="2" @change="e => handleRadioChange(2, row)">本单位</el-radio>
                  <el-radio :label="3" @change="e => handleRadioChange(3, row)">指定单位</el-radio>
                </el-radio-group>
                <span class="selectBtn" @click="handleSelectClick(row)"><i class="el-icon-plus"></i>选择</span>
                <span class="tagWrapper">
                  <el-tag v-for="(item, index) of row.participantList" :key="row.powerId + index" class="tag">
                    {{ item.name }}
                  </el-tag>
                </span>
              </template>
            </template>
            <template v-slot="{ row }">
              <template v-if="row.type === 2">
                <el-radio-group v-model="row.rangeType">
                  <el-radio :label="1">所有单位</el-radio>
                  <el-radio :label="2">本单位</el-radio>
                  <el-radio :label="3">指定单位</el-radio>
                </el-radio-group>
                <span class="selectBtn" @click="handleSelectClick(row)"><i class="el-icon-plus"></i>选择</span>
                <span class="tagWrapper">
                  <el-tag v-for="(item, index) of row.participantList" :key="row.powerId + index" class="tag">
                    {{ item.name }}
                  </el-tag>
                </span>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </el-card>
    <SelectCompany
      v-if="selectVisible"
      :visible.sync="selectVisible"
      :selectedCompany="selectedCompany"
      @submit="handleSubmit"
    ></SelectCompany>
  </div>
</template>

<script>
import treeFilter from '@/utils/treeFilter'
import treeForEach from '@/utils/treeForEach'
import toFlat from '@/utils/toFlat'
import { roleApi } from '@/views/system/api/role'
import SelectCompany from './SelectCompany'
export default {
  name: 'DataPower',
  components: { SelectCompany },
  props: {
    roleId: {
      type: [String, Number],
      default: ''
    },
    sourcePower: {
      type: Array,
      default: () => []
    },
    selectPower: {
      type: Array,
      default: () => []
    }
  },
  data() {
    // 这里存放数据
    return {
      dataPowerList: [],
      tableData: [],
      selectVisible: false, //选择单位
      selectedCompany: [],
      selectRow: {},
      selectedPowerId: '',
      flatData: [],
      originalTableData: []
    }
  },
  computed: {
    // 公司信息
    companyInfo() {
      return this.$store.state.system.companyInfo
    }
  },
  watch: {
    selectPower: {
      immediate: true,
      deep: true,
      handler(val) {
        this.initData()
      }
    },
    dataPowerList: {
      deep: true,
      handler(val) {
        this.addSelect()
      }
    },
    roleId: {
      immediate: true,
      deep: true,
      handler(val) {
        this.getSetting()
      }
    }
  },
  created() {
    //this.getSetting()
  },
  mounted() {},
  // 方法集合
  methods: {
    //获取配置
    async getSetting() {
      //let res = await roleApi.getDataPower(this.roleId)
      this.dataPowerList = []
    },
    async initData() {
      let keyArr = this.selectPower.map(item => item.powerId)
      let filterResult = treeFilter(this.sourcePower, e => {
        return e.type === 2 && keyArr.includes(e.powerId)
      })
      treeForEach(filterResult, e => {
        e.rangeType = null
        e.participantList = null
      })
      this.originalTableData = filterResult || []
    },
    async addSelect() {
      treeForEach(this.originalTableData, e => {
        let obj = _.find(this.dataPowerList, f => f.powerId === e.powerId)
        if (obj) {
          e.rangeType = obj.rangeType
          e.participantList = obj.participantList
        }
        return e
      })
      let objRoot = _.find(this.dataPowerList, f => f.powerId === 'root')
      this.tableData = [
        {
          powerId: 'root',
          powerName: '全部',
          rangeType: objRoot?.rangeType || 'null',
          participantList: objRoot?.participantList || [],
          type: 2,
          children: [...this.originalTableData]
        }
      ]
      await this.$refs.xTable.setAllTreeExpansion(true)
      await this.$refs.xTable.setTreeExpansion(this.tableData[0], true)
    },
    async handleEnter({ row }) {
      await this.$refs.xTable.setActiveRow(row)
    },
    //单选框改变
    handleRadioChange(e, item) {
      console.log(item)
      let a = this.dataPowerList.filter(j => j.powerId !== item.powerId)
      this.dataPowerList = [
        ...a,
        { powerId: item.powerId, rangeType: e, participantList: e === 3 ? item?.participantList || [] : [] }
      ]
      this.setChildKey(item, e, e === 3 ? item?.participantList || [] : [])
    },
    setChildKey(data, key, opt) {
      data.children &&
        data.children.length &&
        data.children.forEach(item => {
          let a = this.dataPowerList.filter(j => j.powerId !== item.powerId)
          this.dataPowerList = [...a, { powerId: item.powerId, rangeType: key, participantList: opt }]
          if (item.children && item.children.length) {
            this.setChildKey(item, key, opt)
          }
        })
    },
    //选择单位按钮
    handleSelectClick(row) {
      this.selectVisible = true
      this.selectRow = row
      this.selectedPowerId = row.powerId
      this.selectedCompany = row.participantList || []
    },
    handleSubmit(data) {
      let dataInit = data.map(item => {
        return {
          id: item.id,
          name: item.participantCompanyName
        }
      })
      let dataFormat = {
        powerId: this.selectedPowerId,
        rangeType: 3,
        participantList: dataInit
      }
      this.dataPowerList = this.dataPowerList.filter(item => item.powerId !== this.selectedPowerId)
      this.dataPowerList.push(dataFormat)
      this.setChildKey(this.selectRow, 3, dataInit)
      this.selectVisible = false
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
.selectBtn {
  margin-left: 10px;
  color: #4b9cff;
}
.tagWrapper {
  margin-left: 10px;
  .tag {
    margin: 0 5px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
