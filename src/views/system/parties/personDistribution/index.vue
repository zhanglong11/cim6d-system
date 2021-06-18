<template>
  <div>
    <vxe-table ref="table" border :data="tableData" :span-method="mergeRowMethod">
      <!--      <vxe-table-column field="projectName" type="seq" width="60" title="序号" />-->
      <vxe-table-column field="projectName" title="项目名称" />
      <vxe-table-column field="projectRoleName" title="角色" />
      <vxe-table-column field="participantUserName" title="人员姓名" :show-overflow="false" />

      <vxe-table-column field="set" title="操作">
        <template slot-scope="{ row }">
          <span v-if="$hasPower('SystemPersonDistributionConfig')"><a @click="handleSetPerson(row)">人员配置</a></span>
        </template>
      </vxe-table-column>
    </vxe-table>
    <!-- 新增角色 模态框 -->
    <el-dialog title="人员配置" :visible.sync="setRoleVisible" width="40%">
      <el-form label-width="140px" :model="form">
        <el-form-item label="角色：">
          <el-input v-model="checkedRoleName" disabled />
        </el-form-item>
        <el-form-item label="请输入人员姓名：">
          <RoleSelect
            v-model="form.participantUserId"
            :principal-name.sync="form.participantUserName"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import RoleSelect from '../components/RoleSelect'
import api from '../../api/parties'

export default {
  name: 'Index',
  components: {
    RoleSelect
  },
  data() {
    return {
      setRoleVisible: false,
      checkedRoleName: '监理工程师',
      checkedRoleId: '',
      companyId: '',
      roleType: '',
      form: {
        // participateCompanyId: '',
        // participateCompanyName: '',
        // participateType: '',
        // participateUserIds: [],
        // participateUserNames: [],
        participantUserId: '',
        participantUserName: '',
        pid: ''
      },
      tableData: []
    }
  },
  created() {
    this.getPartiesPersonRecordList()
  },
  methods: {
    handleSetPerson(row) {
      this.form.pid = row.pid
      this.checkedRoleName = row.projectRoleName
      this.participantUserName = row.participantUserName
      this.form.participantUserId = row.participantUserId
      // this.checkedRoleId = row.projectRoleId
      // this.form.participateCompanyId = row.participateCompanyId
      // this.form.participateCompanyName = row.participateCompanyName
      // this.form.participateType = row.participateType
      // this.form.projectId = row.projectId
      // this.form.projectRoleId = row.projectRoleId
      this.setRoleVisible = true
    },

    async getPartiesPersonRecordList() {
      const res = await api.getPartiesPersonRecordList({})
      this.tableData = res.data || []
      if (this.tableData.length) {
        const companyId = this.tableData[0].participateCompanyId || ''
        const loginCompanyID = this.$store.state.user.companyId
        if (companyId && loginCompanyID && companyId !== loginCompanyID) {
          this.$refs.table.hideColumn(this.$refs.table.getColumnByField('set'))
        }
      }
    },
    async submit() {
      // this.form.participateUserIds = this.form.participantUserId.split(',')
      // this.form.participateUserNames = this.form.participantUserName.split(',')
      await api.gePartiesRecordAdd(this.form)
      this.$message.success('提交成功')
      this.setRoleVisible = false
      this.getPartiesPersonRecordList()
    },
    // 通用行合并函数（将相同多列数据合并为一行）
    mergeRowMethod({ row, $rowIndex, column, data }) {
      const fields = ['projectName']
      const cellValue = XEUtils.get(row, column.property)
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
    }
  }
}
</script>

<style lang="less" scoped></style>
