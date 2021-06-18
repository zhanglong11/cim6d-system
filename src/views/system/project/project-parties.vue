<template>
  <div class="container">
    <div>
      <vxe-table border :span-method="rowspanMethod" :data="tableData">
        <!--      <vxe-table-column field="projectName" type="seq" width="60" title="序号" />-->
        <vxe-table-column field="projectName" title="项目名称" />
        <vxe-table-column field="typeName" title="参与方性质" />
        <vxe-table-column field="participateCompanyName" title="参与方名称" />
        <vxe-table-column field="roleName" title="角色" />
        <vxe-table-column field="typeName" title="操作">
          <template slot-scope="{ row }">
            <span><a @click="handleSetRow(row)">配置</a></span>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>

    <div class="footer-btn">
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import api from '@/views/system/api/parties'
export default {
  data() {
    return {
      tableData: [],
      companyId: '',
      projectId: this.$route.query.projectId || '' // 项目id
    }
  },
  created() {
    this.getPartiesRecordList()
  },
  methods: {
    async getPartiesRecordList() {
      const res = await api.getPartiesRecordList({ projectId: this.projectId })
      this.tableData = res.data
    },
    // 将普通树结构转换为横向树列表
    toColTreeData(treeData) {
      const options = { children: 'children' }
      const list = []
      const keyMap = {}
      XEUtils.eachTree(
        treeData,
        (item, index, result, paths, parent) => {
          keyMap[item.id] = item
          item.keys = parent ? parent.keys.concat([item.id]) : [item.id]
          if (!item.children || !item.children.length) {
            const row = {}
            item.keys.forEach((key, index) => {
              const level = index + 1
              const obj = keyMap[key]
              row[`check${level}`] = false
              row[`id${level}`] = obj.id
              row[`name${level}`] = obj.name
            })
            list.push(row)
          }
        },
        options
      )
      this.keyMap = keyMap
      this.tableData = list
    },
    // 通用行合并函数（将相同多列数据合并为一行）
    rowspanMethod({ row, $rowIndex, column, data, columnIndex, $columnIndex }) {
      const fields = ['projectName', 'typeName', 'participateCompanyName']
      const cellValue = XEUtils.get(row, column.property)
      if ($columnIndex === 0) {
        if (cellValue && fields.includes(column.property)) {
          const prevRow = data[$rowIndex - 1]
          let nextRow = data[$rowIndex + 1]
          if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
            return { rowspan: 0, colspan: 0 }
          } else {
            let countRowspan = 1
            while (nextRow && XEUtils.get(nextRow, column.property) === cellValue) {
              nextRow = data[++countRowspan + $rowIndex]
            }
            if (countRowspan > 1) {
              return { rowspan: countRowspan, colspan: 1 }
            }
          }
        }
      } else {
        if (cellValue && fields.includes(column.property)) {
          const prevRow = data[$rowIndex - 1]
          let nextRow = data[$rowIndex + 1]
          const prevColCellValue = XEUtils.get(row, fields[$columnIndex - 1]) // 前一列本行数据
          const prevColPrevRowCellValue = XEUtils.get(prevRow, fields[$columnIndex - 1]) // 前一列上一列数据
          const prevColNextRowCellValue = XEUtils.get(nextRow, fields[$columnIndex - 1]) // 前一列下一列数据
          if (
            prevRow &&
            XEUtils.get(prevRow, column.property) === cellValue &&
            prevColPrevRowCellValue === prevColCellValue
          ) {
            return { rowspan: 0, colspan: 0 }
          } else {
            let countRowspan = 1
            while (
              nextRow &&
              XEUtils.get(nextRow, column.property) === cellValue &&
              prevColNextRowCellValue === prevColCellValue
            ) {
              nextRow = data[++countRowspan + $rowIndex]
            }
            if (countRowspan > 1) {
              return { rowspan: countRowspan, colspan: 1 }
            }
          }
        }
      }
    },
    handleSetRow(row) {
      api.getIsUpdateRole({ type: row.type }).then(res => {
        console.log(res)
        if (res.data === null) {
          this.$router.push({
            path: '/system/project/partiesAdd',
            query: row
          })
        } else {
          this.$message.info('不可配置')
        }
      })
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
