<template>
  <!--
  /**
  任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
  开发人员：李建敏
  日期：2020-4月-11日
  任务类型：1、全新代码
  **/
  -->
  <el-dialog :visible="visible" top="30px" title="编辑规则" width="650px" @close="close">
    <ul>
      <li v-for="(attr, index) in list" :key="attr.id">
        <div class="header">
          <h3>{{ attr.name }} (范围：{{ attr.minVal }} ~ {{ attr.maxVal }})</h3>
          <el-button
            type="text"
            @click="
              attr.rules.push({
                name: '',
                lowerLimit: null,
                upperLimit: null,
                deviceId: device.id,
                attributeIdentifier: attr.attributeIdentifier,
                edited: true
              })
            "
            >添加规则</el-button
          >
        </div>
        <vxe-table
          :ref="'table' + index"
          :edit-rules="validRules"
          :data="attr.rules"
          :edit-config="{ trigger: 'manual', mode: 'row', showIcon: false }"
        >
          <vxe-table-column :editRender="{ name: 'ElInput' }" title="等级名称" field="name">
            <template v-slot="{ row }">
              <vxe-input v-if="row.edited" v-model="row.name"></vxe-input>
              <span v-else>{{ row.name }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column :editRender="attr.numEditRender" title="下限(含)" field="lowerLimit">
            <template v-slot="{ row }">
              <vxe-input v-if="row.edited" v-model="row.lowerLimit" v-bind="attr.numEditRender.props"></vxe-input>
              <span v-else>{{ row.lowerLimit }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column :editRender="attr.numEditRender" title="上限" field="upperLimit">
            <template v-slot="{ row }">
              <vxe-input v-if="row.edited" v-model="row.upperLimit" v-bind="attr.numEditRender.props"></vxe-input>
              <span v-else>{{ row.upperLimit }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column width="120px">
            <template v-slot="{ row, rowIndex, $table }">
              <template v-if="row.edited">
                <el-button type="text" @click="saveRow(row, $table)">保存</el-button>
                <el-button type="text" @click="cancelRow(attr, row, rowIndex)">取消</el-button>
              </template>
              <template v-else>
                <el-button type="text" @click="row.edited = true">编辑</el-button>
                <el-button type="text" size="mini" @click="remove(attr, row, rowIndex)">删除</el-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
      </li>
    </ul>
  </el-dialog>
</template>

<script>
export default {
  name: 'Edit',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    device: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    function isNumber(val) {
      return val || val === 0
    }
    return {
      form: {
        projectId: localStorage.getItem('projectId'),
        level: 1
      },
      validRules: {
        name: [
          { required: true, message: '必填' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,100}$/, message: '等级名称仅支持字母、数字、汉字、100字符' },
          {
            validator({ row, $table }) {
              if ($table.tableData.filter(e => e.name === row.name).length > 1) {
                return Promise.reject(new Error('名称不能重复'))
              }
            }
          }
        ],
        lowerLimit: [
          {
            validator: ({ row }) => {
              if (!isNumber(row.lowerLimit) && !isNumber(row.upperLimit)) {
                return Promise.reject(new Error('下限和上限不能同时为空'))
              }
            }
          },
          {
            validator: ({ row, $table }) => {
              let list = $table.tableData.filter(e => e._XID !== row._XID)
              for (let item of list) {
                if (
                  (isNumber(item.lowerLimit) || isNumber(item.upperLimit)) &&
                  _.inRange(
                    row.lowerLimit,
                    +item.lowerLimit + 0.0000000001,
                    item.upperLimit || item.numEditRender.props.max
                  )
                ) {
                  return Promise.reject(new Error('上下限不允许有交集'))
                }
              }
            }
          }
        ],
        upperLimit: [
          {
            validator: ({ row }) => {
              if (!isNumber(row.lowerLimit) && !isNumber(row.upperLimit)) {
                return Promise.reject(new Error('下限和上限不能同时为空'))
              }
            }
          },
          {
            validator: ({ row }) => {
              if (isNumber(row.lowerLimit) && isNumber(row.upperLimit) && +row.upperLimit <= +row.lowerLimit) {
                return Promise.reject(new Error('上限必须大于下限'))
              }
            }
          },
          {
            validator: ({ row, $table }) => {
              let list = $table.tableData.filter(e => e._XID !== row._XID)
              for (let item of list) {
                if (
                  _.inRange(
                    row.upperLimit,
                    +item.lowerLimit + 0.0000000001,
                    item.upperLimit || item.numEditRender.props.max
                  )
                ) {
                  return Promise.reject(new Error('上下限不允许有交集'))
                }
              }
            }
          }
        ]
      },
      list: []
    }
  },
  computed: {
    groupListTree() {
      return this.$store.state.iot.groupListTree
    }
  },
  watch: {
    visible() {
      if (this.visible && this.device.id) {
        const load = customFlag => {
          return this.axios.iot
            .post('product/attribute/list', {
              productId: this.device.productId,
              customFlag,
              dataTypes: ['int', 'float', 'double']
            })
            .then(async res => {
              await Promise.all(
                res.data.records.map(async attr => {
                  let props = {
                    min: attr.minVal,
                    max: attr.maxVal,
                    step: attr.step
                  }
                  if (attr.dataType === 'int') {
                    props.type = 'integer'
                  } else if (attr.dataType === 'float') {
                    props.type = 'float'
                    props.digits = 1
                  } else if (attr.dataType === 'double') {
                    props.type = 'float'
                    props.digits = 2
                  }
                  attr.numEditRender = {
                    name: '$input',
                    props
                  }
                  attr.rules = await this.axios.iot
                    .post('device/warning/rule/list', {
                      deviceId: this.device.id,
                      attributeIdentifier: attr.attributeIdentifier
                    })
                    .then(res2 => {
                      res2.data.records.forEach(f => {
                        f.edited = false
                        f.numEditRender = {
                          name: '$input',
                          props
                        }
                      })
                      return res2.data.records
                    })
                })
              )
              return res.data.records
            })
        }
        Promise.all([load('0'), load('1')]).then(res => {
          this.originList = _.cloneDeep(_.flatten(res))
          this.list = _.flatten(res)
        })
      }
    }
  },
  mounted() {},
  methods: {
    async saveRow(row, $table) {
      await $table.validate(row)
      if (row.id) {
        await this.axios.iot.post('device/warning/rule/update', row).then(res => {})
      } else {
        await this.axios.iot.post('device/warning/rule/add', row).then(res => {
          row.id = res.data
        })
      }
      this.$message.success('保存成功')
      row.edited = false
    },
    cancelRow(attr, row, rowIndex) {
      const originList = _.flatten(this.originList.map(e => e.rules))
      if (row.id) {
        Object.assign(row, _.cloneDeep(_.find(originList, { id: row.id })))
      } else {
        attr.rules.splice(rowIndex, 1)
      }
    },
    remove(attr, row, rowIndex) {
      this.axios.iot.get('device/warning/rule/delete/' + row.id).then(res => {
        this.$message.success('删除成功')
        attr.rules.splice(rowIndex, 1)
      })
    },
    close() {
      this.list = []
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.vxe-table {
  margin-bottom: 10px;
  /deep/ .vxe-table--empty-placeholder {
    height: 40px !important;
    top: 30px !important;
  }
  /deep/ .vxe-table--empty-block {
    min-height: 40px !important;
  }
}
</style>
