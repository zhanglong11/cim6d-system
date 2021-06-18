<template>
  <div>
    <el-tree
      ref="treeRef"
      :data="data"
      :show-checkbox="!!roleId"
      node-key="powerId"
      default-expand-all
      :props="treeProps"
      :expand-on-click-node="false"
      check-on-click-node
      :default-checked-keys="powerList"
      class="custom-tree"
      @check="changeCheck"
    >
      <span :id="data.powerId" slot-scope="{ node, data }">
        <span v-if="data.flag === 1" class="el-icon-star-on" style="color: #00800d;" />
        {{ node.label }}
      </span>
    </el-tree>
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-25 10:21:53
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-06-24 17:42:19
 * @Desc 树状选择组件
 */
export default {
  name: 'TreeCard',
  props: {
    // 当前数据
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 所有数据
    allData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 角色Id
    roleId: {
      type: String,
      default: ''
    },
    // 已分配的权限
    powerListRole: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 不返回父级权限
    noParent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 这里存放数据
    return {
      treeProps: {
        label: 'powerName'
      },
      checkAll: false,
      isIndeterminate: false,
      dataList: [],
      checkList: [],
      selectPowerKey: [],
      currentKey: [],
      selectList: [], // 选择的权限
      powerList: [] // 用户权限
    }
  },
  computed: {},
  watch: {
    powerListRole(val) {
      // 处理树组件数据
      this.$refs.treeRef.setCheckedKeys([])
      const powerList = []
      const selectList = []
      const getChildren = array => {
        array.map(item => {
          if (val.includes(item.powerId)) {
            selectList.push({
              powerName: item.powerName,
              roleId: this.roleId,
              serviceId: item.serviceId,
              powerId: item.powerId,
              powerKey: item.powerKey
            })
          }
          if (!item.children && val.includes(item.powerId)) {
            powerList.push(item.powerId)
            return
          }
          if (item.children) {
            getChildren(item.children)
          }
        })
      }
      getChildren(this.data)
      this.powerList = powerList
      this.selectList = selectList
      this.changePower()

      // this.selectPowerKey = val
      // this.initSelect()
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.formatTree()
  },
  // 方法集合
  methods: {
    // 处理无数据的子树
    formatTree() {
      this.$nextTick(() => {
        const dom = document.getElementsByClassName('el-tree-node__children')
        for (var i = 0; i < dom.length; i++) {
          const item = dom[i]
          if (!item.textContent) {
            let classList = item.parentNode.getAttribute('class')
            const parentClassList = item.parentNode.parentNode.getAttribute('class')
            classList += ' no-children'
            if (parentClassList !== 'el-tree custom-tree') {
              item.parentNode.className = classList
            }
          }
        }
      })
    },
    // 初始化选中的权限
    initSelect() {
      const selectList = []
      this.dataList.map(item => {
        if (this.selectPowerKey.indexOf(item.powerId) >= 0) {
          selectList.push(item)
        }
      })
      this.selectList = selectList

      const list = []
      this.data.map(item => {
        if (this.selectPowerKey.indexOf(item.powerId) >= 0) {
          list.push(true)
        }
      })
      this.checkAll = false
      if (list.length > 0) {
        this.isIndeterminate = true
        this.checkAll = false
      }
      if (list.length === 0) {
        this.checkAll = false
        this.isIndeterminate = false
      }
      // if (list.length === this.data.length) {
      //   this.checkAll = true
      //   this.isIndeterminate = false
      // }
      this.changePower()
    },
    // 树状结构数据改变
    changeCheck(e, { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys }) {
      const selectList = []
      // 半选的数据处理
      halfCheckedNodes.map(item => {
        selectList.push({
          powerName: item.powerName,
          roleId: this.roleId,
          serviceId: item.serviceId,
          powerId: item.powerId,
          powerKey: item.powerKey
        })
      })
      // 全选的数据处理
      checkedNodes.map(item => {
        selectList.push({
          powerName: item.powerName,
          roleId: this.roleId,
          serviceId: item.serviceId,
          powerId: item.powerId,
          powerKey: item.powerKey
        })
      })
      this.selectList = selectList
      this.changePower()
    },
    // 权限改变
    changePower() {
      this.formatTree()
      this.$emit('on-change', this.selectList)
    },
    // 自动选中
    checkSelect(item) {
      const checked = this.selectPowerKey.indexOf(item.powerId) >= 0
      item.checked = checked
      return checked
    },
    // 全选
    checkAllChange(status, items) {
      let parentIdIndex = ''
      let parentParentIdIndex = ''
      this.isIndeterminate = false
      if (!status) {
        parentIdIndex = this.selectPowerKey.indexOf(items.id)
        if (parentIdIndex >= 0) {
          this.selectPowerKey.splice(parentIdIndex, 1)
        }
        parentParentIdIndex = this.selectPowerKey.indexOf(items.parentId)
        if (parentParentIdIndex >= 0) {
          this.selectPowerKey.splice(parentParentIdIndex, 1)
        }
      } else {
        parentIdIndex = this.selectPowerKey.indexOf(items.id)
        if (parentIdIndex < 0) {
          this.selectPowerKey.push(items.id)
        }
        parentParentIdIndex = this.selectPowerKey.indexOf(items.parentId)
        if (parentParentIdIndex < 0) {
          this.selectPowerKey.push(items.parentId)
        }
      }
      items.checked = status
      items.children.map(item => {
        item.checked = status
        const index = this.selectPowerKey.indexOf(item.powerId)
        if (index >= 0 && !status) {
          this.selectPowerKey.splice(index, 1)
        }
        if (index < 0) {
          this.selectPowerKey.push(item.powerId)
        }
      })
    },
    // 选择权限
    clickCheckBox(item, items) {
      const index = this.selectPowerKey.indexOf(item.powerId)
      if (index >= 0) {
        this.selectPowerKey.splice(index, 1)
      } else {
        this.selectPowerKey.push(item.powerId)
      }
      const list = []
      items.children.map(e => {
        list.push(e.checked)
      })
      let parentIdIndex = ''
      let parentParentIdIndex = ''
      if (list.indexOf(true) >= 0) {
        parentIdIndex = this.selectPowerKey.indexOf(items.id)
        if (parentIdIndex < 0) {
          this.selectPowerKey.push(items.id)
        }
        parentParentIdIndex = this.selectPowerKey.indexOf(items.parentId)
        if (parentParentIdIndex < 0) {
          this.selectPowerKey.push(items.parentId)
        }
        this.isIndeterminate = true
        this.checkAll = false
      } else {
        parentIdIndex = this.selectPowerKey.indexOf(items.id)
        if (parentIdIndex >= 0) {
          this.selectPowerKey.splice(parentIdIndex, 1)
        }
        parentParentIdIndex = this.selectPowerKey.indexOf(items.parentId)
        if (parentParentIdIndex >= 0) {
          this.selectPowerKey.splice(parentParentIdIndex, 1)
        }
        this.isIndeterminate = false
      }
      if (list.indexOf(false) < 0) {
        this.isIndeterminate = false
        this.checkAll = true
      }
    },
    handleCheckAllToggle(checked) {
      if (!checked) {
        this.$refs.treeRef.setCheckedNodes([])
      } else {
        this.$refs.treeRef.setCheckedNodes(this.allData)
      }
      const res = this.$refs.treeRef.getCheckedNodes()
      this.$emit('on-change', res)
      this.formatTree()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
/deep/.custom-tree {
  .el-tree-node__expand-icon {
    display: none;
  }
  .el-tree-node__content {
    padding-left: 15px !important;
    background: none !important;
  }
  .el-tree-node__children {
    padding: 0 15px 10px;
  }
  .el-tree-node {
    margin-top: 20px;
    padding: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #ebeef5;
    border-radius: 4px;
    white-space: normal;
    .el-tree-node__content {
      padding: 10px 0;
      height: 40px;
      background: #fafafa !important;
      border-bottom: 1px #ebebeb solid;
    }
  }
  .no-children {
    margin: 0;
    border: 0;
    box-shadow: none;
    padding: 5px 0 0 0;
    white-space: normal;
    .el-tree-node__label {
      font-size: 12px;
    }
    &.el-tree-node {
      display: inline-block;
      width: 20%;
      margin: 0;
      border: 0;
      box-shadow: none;
      .el-tree-node__content {
        padding: 0;
        height: 26px;
        background: none !important;
        border: 0;
      }
    }
    .el-tree-node__children {
      padding: 0;
    }
  }
}
</style>
<style lang="less" scoped>
//@import url(); 引入公共css类
.children-card {
  margin-top: 20px;
  /deep/.el-card__header {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
  }
  .no-children {
    /deep/.el-card__header {
      background: #fafafa;
      font-weight: normal;
      font-size: 13px;
    }
    /deep/.el-checkbox {
      font-size: 13px;
    }
  }
  /deep/.el-card__body {
    padding-top: 0;
  }
  /deep/.el-checkbox {
    margin: 20px 0 0;
    width: 25%;
  }
}
</style>
