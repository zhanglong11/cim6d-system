<!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-10日
任务类型：1、全新代码
**/
-->
<!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-11日
任务类型：2、修改代码（30%）
**/
-->
<template>
  <el-dialog :visible="visible" :title="form.id ? '编辑功能' : '新建功能'" width="600px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="功能名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <template v-if="form.customFlag === '0'">
        <el-form-item label="标识符" prop="attributeIdentifier">
          <p>{{ form.attributeIdentifier }}</p>
        </el-form-item>
        <el-form-item label="数据类型" prop="dataType">
          <p>{{ form.dataType }}</p>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="标识符" prop="attributeIdentifier">
          <el-input v-model="form.attributeIdentifier"></el-input>
        </el-form-item>
        <el-form-item label="数据类型" prop="dataType">
          <el-select v-model="form.dataType">
            <el-option
              v-for="e in dataTypeList"
              :key="e.argCode"
              :value="e.argCode"
              :label="e.argText + ' (' + e.argCode + ')'"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-if="['int', 'float', 'double'].includes(form.dataType)">
        <el-form-item label="取值范围" prop="numRange">
          <el-input-number
            v-model="form.numRange[0]"
            style="width: 171px;"
            :controls="false"
            :max="form.numRange[1] - 1"
            :precision="{ int: 0, float: 1, double: 2 }[form.dataType]"
          ></el-input-number>
          <span style="margin: 0 12px;">~</span>
          <el-input-number
            v-model="form.numRange[1]"
            style="width: 171px;"
            :controls="false"
            :min="form.numRange[0] + 1"
            :precision="{ int: 0, float: 1, double: 2 }[form.dataType]"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="步长" prop="step">
          <InputNumber
            v-model="form.step"
            :precision="{ int: 0, float: 1, double: 2 }[form.dataType]"
            :min="{ int: 1, float: 0.1, double: 0.01 }[form.dataType]"
            :max="form.numRange[0] && form.numRange[1] ? form.numRange[1] - form.numRange[0] : null"
          ></InputNumber>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="form.unit" filterable>
            <el-option
              v-for="e in unitList"
              :key="e.id"
              :value="e.id"
              :label="e.argText + ' (' + e.argCode + ')'"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-else-if="form.dataType === 'bool'">
        <el-form-item label="布尔值" prop="boolVal">
          <div>
            <span>0</span><span style="margin: 0 12px;">-</span>
            <el-input v-model="form.boolVal[0]" style="width: 150px;"></el-input>
          </div>
          <div style="margin-top: 15px;">
            <span>1</span><span style="margin: 0 12px;">-</span>
            <el-input v-model="form.boolVal[1]" style="width: 150px;"></el-input>
          </div>
        </el-form-item>
      </template>
      <template v-else-if="form.dataType === 'string'">
        <el-form-item label="数据长度">
          <InputNumber v-model="form.strLength" :precision="0" :min="1" :max="500"></InputNumber>
        </el-form-item>
      </template>
      <template v-else-if="form.dataType === 'enum'">
        <el-form-item label="枚举项" prop="enumVal">
          <ul class="enum-list">
            <li v-for="(e, index) in form.enumVal" :key="index">
              <el-input v-model="e[0]" style="width: 172px;" placeholder="值 (如：1、2)"></el-input>
              <span style="margin: 0 12px;">-</span>
              <el-input v-model="e[1]" style="width: 172px;" placeholder="选型 (如：制冷、制热)"></el-input>
              <el-button type="text" class="remove" @click="form.enumVal.splice(index, 1)">删除</el-button>
            </li>
          </ul>
          <el-button type="text" @click="form.enumVal.push(['', ''])">添加枚举项</el-button>
        </el-form-item>
      </template>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }"></el-input>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">{{ form.id ? '保存' : '创建' }}</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'FunctionEdit',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        boolVal: [],
        enumVal: [],
        numRange: [],
        productId: this.$route.params.id
      },
      rules: {
        name: [{ required: true, message: '必填' }],
        numRange: [
          {
            type: 'array',
            required: true,
            fields: {
              0: { type: 'integer', required: true, message: '必填' },
              1: { type: 'integer', required: true, message: '必填' }
            },
            message: '必填'
          }
        ],
        attributeIdentifier: [
          { required: true, message: '必填' },
          { pattern: /^[a-zA-Z0-9_]{10,50}$/, message: '属性标识符应由大小写字母、数字、下划线组成，长度为10~50' }
        ],
        dataType: [{ required: true, message: '必填' }],
        unit: [{ required: true, message: '必填' }],
        boolVal: [
          {
            type: 'array',
            required: true,
            fields: {
              0: { type: 'string', required: true, message: '必填' },
              1: { type: 'string', required: true, message: '必填' }
            },
            message: '必填'
          }
        ],
        enumVal: [
          {
            type: 'array',
            required: true,
            defaultField: {
              type: 'array',
              required: true,
              fields: {
                0: { type: 'string', required: true, message: '所有选项都必填' },
                1: { type: 'string', required: true, message: '所有选项都必填' }
              }
            }
          }
        ]
      },
      unitList: [],
      dataTypeList: []
    }
  },
  watch: {
    visible(val) {
      if (val && this.data.id) {
        this.form = _.cloneDeep(this.data)
        if (this.form.boolVal) {
          this.form.boolVal = this.form.boolVal.replace(/[01]-/g, '').split(',')
        } else {
          this.form.boolVal = ['', '']
        }
        if (this.form.enumVal) {
          this.form.enumVal = this.form.enumVal.split(',').map(e => e.split('-'))
        } else {
          this.form.enumVal = []
        }
        this.form.numRange = [this.form.minVal, this.form.maxVal]
      }
    }
  },
  created() {
    this.axios.iot.post('arg/list', { argGroup: 'iot_unit' }).then(res => {
      this.unitList = res.data
    })
    this.axios.iot.post('arg/list', { argGroup: 'iot_data_type' }).then(res => {
      this.dataTypeList = res.data
    })
    this.initForm = _.cloneDeep(this.form)
  },
  mounted() {},
  methods: {
    async submit() {
      let form = _.cloneDeep(this.form)
      await this.$refs.form.validate()
      form.boolVal = form.boolVal.map((str, index) => '' + index + '-' + str).join(',')
      form.enumVal = form.enumVal.map(arr => arr[0] + '-' + arr[1]).join(',')
      form.minVal = form.numRange[0]
      form.maxVal = form.numRange[1]
      if (this.form.id) {
        if (this.form.customFlag === '0') {
          await this.axios.iot.post('product/standard/update', form)
        } else {
          await this.axios.iot.post('product/custom/update', form)
        }
        this.$message.success('修改成功')
      } else {
        await this.axios.iot.post('product/custom/attribute/add', form)
        this.$message.success('创建成功')
      }
      this.$parent.refresh()
      this.close()
    },
    async close() {
      this.form = _.cloneDeep(this.initForm)
      await this.$nextTick()
      this.$refs.form.clearValidate()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
.el-form {
  width: 500px;
  margin: 0 auto;
}
.enum-list {
  > li {
    margin-bottom: 10px;
    position: relative;
    .remove {
      position: absolute;
      left: 100%;
      display: block;
      width: 30px;
      top: 0;
      margin-left: 10px;
    }
  }
}
</style>
