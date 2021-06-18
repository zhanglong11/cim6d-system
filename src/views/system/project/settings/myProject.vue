<template>
  <div class="main no-padding">
    <template v-if="viewMode === 1">
      <el-card class="nav">
        <el-button
          class="button-switch-project"
          style="width: 100%; margin-bottom: 15px;"
          type="primary"
          @click="selectProjectDialogVisible = true"
        >
          <i class="icon-image-switch-project"></i>
          切换项目
        </el-button>
        <el-tree :expand-on-click-node="false" default-expand-all :data="treeData" @node-click="handleNodeClick">
        </el-tree>
      </el-card>
      <el-card class="main-content">
        <header slot="header" class="main-content-header">
          <h2><i class="icon-image-project"></i> {{ activeProject.name }}</h2>
          <div v-if="type === 1" class="control">
            <el-button
              v-if="$hasPower('SystemProjectAddParticipant')"
              class="el-icon-plus"
              type="primary"
              @click="addParticipantDialogVisible = true"
              >添加</el-button
            >
            <el-radio-group v-model="viewMode">
              <el-radio-button :label="1">
                <i class="icon-image-table" :class="{ active: viewMode === 1 }"></i>
              </el-radio-button>
              <el-radio-button :label="2">
                <i class="icon-image-flow-chart" :class="{ active: viewMode === 2 }"></i>
              </el-radio-button>
            </el-radio-group>
          </div>
        </header>
        <!--参与方性质-->
        <el-card
          v-for="participant in list"
          :key="participant.id"
          class="card-participant"
          :class="{ ['anchor-' + participant.id]: true }"
        >
          <header slot="header">
            <span><i class="icon-image-company-group"></i> {{ participant.participantTypeName }}</span>
            <div v-if="type === 1">
              <i
                v-if="$hasPower('SystemProjectAddParticipantCompany')"
                class="icon-image-add-company pointer"
                @click="
                  () => {
                    activeParticipant = participant
                    addCompanyDialogVisible = true
                  }
                "
              ></i>
              <i
                v-if="$hasPower('SystemProjectRemoveParticipant')"
                class="icon-image-remove pointer"
                @click="removeParticipant(participant)"
              ></i>
            </div>
          </header>
          <!--参与方公司-->
          <el-button
            v-if="_.size(participant.children) === 0 && type === 1 && $hasPower('SystemProjectAddParticipantCompany')"
            icon="el-icon-plus"
            type="text"
            size="medium"
            @click="
              () => {
                activeParticipant = participant
                addCompanyDialogVisible = true
              }
            "
            >添加参与方</el-button
          >
          <span v-if="!_.size(participant.children) && type === 2" style="font-size: 14px; color: #777;">
            暂无参与方
          </span>
          <el-card
            v-for="company in participant.children"
            :key="company.id"
            class="card-company"
            :class="{ ['anchor-' + company.id]: true }"
          >
            <header slot="header">
              <span>
                <i class="icon-image-company"></i>
                {{ company.participantCompanyName }}
              </span>
              <div v-if="type === 1">
                <i
                  v-if="$hasPower('SystemProjectAddParticipantCompanyRole')"
                  class="icon-image-add-role pointer"
                  @click="
                    () => {
                      activeCompany = company
                      addRoleDialogVisible = true
                    }
                  "
                ></i>
                <i
                  v-if="$hasPower('SystemProjectRemoveParticipantCompany')"
                  class="icon-image-remove pointer"
                  @click="removeCompany(company)"
                ></i>
              </div>
            </header>
            <!--参与方角色-->
            <el-button
              v-if="_.size(company.children) === 0 && type === 1 && $hasPower('SystemProjectAddParticipantCompanyRole')"
              icon="el-icon-plus"
              type="text"
              size="medium"
              @click="
                () => {
                  activeCompany = company
                  addRoleDialogVisible = true
                }
              "
              >添加角色</el-button
            >
            <span v-if="!_.size(company.children) && type === 2" style="font-size: 14px; color: #777;">
              暂无角色
            </span>
            <el-card
              v-for="role in company.children"
              :key="role.id"
              class="card-role"
              :class="{ ['anchor-' + role.id]: true }"
            >
              <header slot="header">
                <span><i class="icon-image-role pointer"></i> {{ role.projectRoleName }}</span>
                <div>
                  <i
                    v-if="type === 1 && $hasPower('SystemProjectRemoveParticipantCompanyRole')"
                    class="icon-image-remove pointer"
                    @click="removeRole(role)"
                  ></i>
                </div>
              </header>
              <div class="user-list">
                <el-tag
                  v-for="user in role.children"
                  :key="user.id"
                  :closable="
                    $hasPower('SystemProjectRemoveParticipantCompanyUser') && type === 2 && role.userType === 1
                  "
                  size="medium"
                  @close="removeUser(user)"
                >
                  {{ user.participantUserName }}
                </el-tag>
                <el-button
                  v-if="type === 2 && role.userType === 1 && $hasPower('SystemProjectAddParticipantCompanyUser')"
                  icon="el-icon-plus"
                  type="text"
                  size="medium"
                  @click="
                    () => {
                      activeRole = role
                      addUserDialogVisible = true
                    }
                  "
                  >添加人员</el-button
                >
                <span
                  v-if="!_.size(role.children) && (type === 1 || role.userType !== 1)"
                  style="font-size: 14px; color: #777;"
                >
                  暂无人员
                </span>
              </div>
            </el-card>
          </el-card>
        </el-card>
      </el-card>
    </template>
    <div v-else class="org-chart-wrap">
      <el-radio-group v-model="viewMode">
        <el-radio-button :label="1">
          <i class="icon-image-table" :class="{ active: viewMode === 1 }"></i>
        </el-radio-button>
        <el-radio-button :label="2">
          <i class="icon-image-flow-chart" :class="{ active: viewMode === 2 }"></i>
        </el-radio-button>
      </el-radio-group>
      <OrgChart :project="activeProject" :data="list"></OrgChart>
    </div>

    <el-dialog title="选择项目" :visible.sync="selectProjectDialogVisible" width="450px">
      <el-input v-model="projectListSearch" placeholder="请输入项目名称" suffix-icon="el-icon-search"></el-input>
      <ul class="project-list">
        <li
          v-for="project in projectList.filter(e => !projectListSearch || e.name.includes(projectListSearch))"
          :key="project.id"
          @click="
            () => {
              activeProject = project
              selectProjectDialogVisible = false
            }
          "
        >
          <i class="el-icon-check" :class="{ active: activeProject.id === project.id }"></i>
          {{ project.name }}
        </li>
      </ul>
    </el-dialog>
    <AddParticipant
      :hidden-keys="_.map(list, 'participantType')"
      :project="activeProject"
      :visible.sync="addParticipantDialogVisible"
      @change="refresh()"
    ></AddParticipant>
    <AddCompany
      :hidden-keys="_.map(activeParticipant.children, 'participantCompanyId')"
      :participant="activeParticipant"
      :visible.sync="addCompanyDialogVisible"
      @change="refresh()"
    ></AddCompany>
    <AddRole
      :project="activeProject"
      :hidden-keys="_.map(activeCompany.children, 'projectRoleId')"
      :company="activeCompany"
      :visible.sync="addRoleDialogVisible"
      @change="refresh()"
    ></AddRole>
    <AddUser
      :role="activeRole"
      :hidden-keys="_.map(activeRole.children, 'participantUserId')"
      :visible.sync="addUserDialogVisible"
      @change="refresh()"
    ></AddUser>
  </div>
</template>

<script>
import { projectApi } from '@/views/system/api/project'

import OrgChart from './components/OrgChart'

import AddParticipant from './components/AddParticipant'
import AddCompany from './components/AddCompany'
import AddRole from './components/AddRole'
import AddUser from './components/AddUser'

import lscache from 'lscache'
import api from '@/views/system/api/parties'
import { scroller } from 'vue-scrollto/src/scrollTo'
import treeForEach from '@/utils/treeForEach'
import treeFilter from '@/utils/treeFilter'
const scrollTo = scroller()
export default {
  name: 'MyProject',
  components: { OrgChart, AddParticipant, AddCompany, AddRole, AddUser },
  props: {
    /**
     * 1 主办方   2 参与方
     */
    type: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      list: [],
      projectList: [],
      projectListSearch: '',
      selectProjectDialogVisible: false,
      activeProject: lscache.get('systemProjectSettingsActiveProject-' + this.type) || {},

      activeParticipant: {},
      activeCompany: {},
      activeRole: {},

      addParticipantDialogVisible: false,
      addCompanyDialogVisible: false,
      addRoleDialogVisible: false,
      addUserDialogVisible: false,
      /**
       * 显示模式 1 列表  2 图表架构图
       */
      viewMode: +this.$route.query.viewMode || 1
    }
  },
  computed: {
    treeData() {
      return treeFilter(this.list, e => e.type < 2)
    }
  },
  watch: {
    async activeProject(val) {
      if (!_.isEmpty(val)) {
        lscache.set('systemProjectSettingsActiveProject-' + this.type, val)
        await this.$nextTick()
        this.refresh()
      }
    }
  },
  created() {
    this.getProjectList()
  },
  methods: {
    refresh() {
      if (!this.activeProject.id) return false
      if (this.type === 1) {
        api.getPartiesRecordList({ projectId: this.activeProject.id }).then(res => {
          treeForEach(res.data, e => {
            e.label = e.participantUserName || e.projectRoleName || e.participantCompanyName || e.participantTypeName
          })
          this.list = res.data
        })
      } else {
        api
          .getPartiesUserRecordList({ projectId: this.activeProject.id, companyId: localStorage.getItem('companyId') })
          .then(res => {
            treeForEach(res.data, e => {
              e.label = e.participantUserName || e.projectRoleName || e.participantCompanyName || e.participantTypeName
            })
            this.list = res.data
          })
      }
    },
    async getProjectList() {
      if (this.type === 1) {
        this.projectList = await projectApi
          .queryProject({ page: 1, rows: 10000, projectUserCategory: 2 })
          .then(res => res.data.records)
      } else {
        this.projectList = await projectApi
          .queryProject({ page: 1, rows: 10000, projectUserCategory: 1 })
          .then(res => res.data.records)
      }
      // 从项目列表跳转过来
      if (this.$route.query.projectId) {
        this.activeProject = _.find(this.projectList, { id: this.$route.query.projectId })
      }
      // 选择项目后 会保存最后选中项目到localstorage，获取项目列表之后，判断缓存中的项目是否在项目列表内，若不在，就把已选项目设置为空
      if (this.activeProject && !_.find(this.projectList, { id: this.activeProject.id })) {
        this.activeProject = {}
      }
      if (_.size(this.projectList) && _.isEmpty(this.activeProject)) {
        this.activeProject = _.last(this.projectList)
      }

      this.refresh()
    },
    handleNodeClick(data) {
      scrollTo('.anchor-' + data.id, {
        container: '.main-content > .el-card__body'
      })
    },
    removeParticipant(participant) {
      this.$confirm(
        '<p>注意：删除后，该公司性质下的相关配置数据将被永久删除，不可恢复。</p>' +
          '<p>请务必确认该性质下的所有参与方不再参与此项目</p>',
        `删除参与方性质“${participant.label}”`,
        {
          dangerouslyUseHTMLString: true,
          iconClass: 'el-icon-warning',
          confirmButtonText: '确定删除',
          cancelButtonText: '取消删除'
        }
      ).then(() => {
        this.axios.system.get('/project/participant/delete/' + participant.id).then(res => {
          this.$message.success('删除成功')
          this.refresh()
        })
      })
    },
    removeCompany(company) {
      this.$confirm(
        '<p>注意：删除后，该参与方的相关配置数据将被永久删除，不可恢复。</p>' +
          '<p>请务必确认该参与方不再参与此项目</p>',
        `删除参与方“${company.label}”`,
        {
          dangerouslyUseHTMLString: true,
          iconClass: 'el-icon-warning',
          confirmButtonText: '确定删除',
          cancelButtonText: '取消删除'
        }
      ).then(() => {
        this.axios.system.get('/project/participant/delete/' + company.id).then(res => {
          this.$message.success('删除成功')
          this.refresh()
        })
      })
    },
    removeRole(role) {
      this.$confirm(
        '<p>注意：删除后，该角色的配置数据将被永久删除，不可恢复。</p>' + '<p>请务必确认该角色不再参与此项目</p>',
        `删除角色“${role.label}”`,
        {
          dangerouslyUseHTMLString: true,
          iconClass: 'el-icon-warning',
          confirmButtonText: '确定删除',
          cancelButtonText: '取消删除'
        }
      ).then(() => {
        this.axios.system.get('/project/participant/delete/' + role.id).then(res => {
          this.$message.success('删除成功')
          this.refresh()
        })
      })
    },
    removeUser(role) {
      this.$confirm(
        '<p>注意：删除后，该人员的相关配置数据将被永久删除，不可恢复。</p>' + '<p>请务必确认该人员不再参与此项目</p>',
        `删除人员“${role.label}”`,
        {
          dangerouslyUseHTMLString: true,
          iconClass: 'el-icon-warning',
          confirmButtonText: '确定删除',
          cancelButtonText: '取消删除'
        }
      ).then(() => {
        this.axios.system.get('/project/participant/delete/' + role.id).then(res => {
          this.$message.success('删除成功')
          this.refresh()
        })
      })
    },
    submit() {},
    remove() {}
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
@import '~@/styles/mixin.scss';
.main {
  display: flex;
}
.nav {
  width: 300px;
  max-height: calc(100vh - 90px);
  .button-switch-project {
    ::v-deep > span {
      justify-content: center;
      display: flex;
      align-items: center;
    }
  }
}
.main-content {
  flex: 1;
  ::v-deep > .el-card__body {
    max-height: calc(100vh - 145px);
    overflow: auto;
    @include scrollBar;
  }
  ::v-deep > .el-card__header {
    padding-right: 10px;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-card + .el-card {
    margin-top: 10px;
  }
}
.main-content-header {
  h2 {
    font-weight: bold;
  }
}
.user-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-tag {
    margin: 5px;
  }
  .el-tag + .el-button {
    margin-left: 5px;
  }
}
.control {
  display: flex;
  align-items: center;
  .el-radio-group {
    margin-left: 15px;
  }
  .el-radio-button {
    & ::v-deep .el-radio-button__inner {
      padding: 8px 12px;
    }
    i {
      transform: scale(1.1);
      margin-right: 0;
    }
  }
}
.org-chart-wrap {
  position: relative;
  width: 100%;
  .el-radio-group {
    position: absolute;
    top: 10px;
    right: 14px;
    margin-left: 15px;
  }
  .el-radio-button {
    & ::v-deep .el-radio-button__inner {
      padding: 8px 12px;
    }
    i {
      transform: scale(1.1);
      margin-right: 0;
    }
  }
}
i[class^='el-icon'] {
  color: $primary-color;
  padding: 3px;
  & + i {
    margin-left: 4px;
  }
}
i[class^='icon-'] {
  display: inline-block;
  vertical-align: center;
  width: 14px;
  height: 14px;
  transform: scale(1.4);
  background-size: cover;
  margin-right: 10px;
  & + & {
    margin-left: 8px;
  }
  &.icon-image-add-company {
    background-image: url(~@/assets/images/project/add-company.png);
  }
  &.icon-image-add-role {
    background-image: url(~@/assets/images/project/add-role.png);
  }
  &.icon-image-company {
    background-image: url(~@/assets/images/project/company.png);
  }
  &.icon-image-company-group {
    background-image: url(~@/assets/images/project/company-group.png);
  }
  &.icon-image-remove {
    background-image: url(~@/assets/images/project/remove.png);
  }
  &.icon-image-flow-chart {
    background-image: url(~@/assets/images/project/flow-chart.png);
  }
  &.icon-image-flow-chart.active {
    background-image: url(~@/assets/images/project/flow-chart-active.png);
  }
  &.icon-image-table {
    background-image: url(~@/assets/images/project/table.png);
  }
  &.icon-image-table.active {
    background-image: url(~@/assets/images/project/table-active.png);
  }
  &.icon-image-project {
    background-image: url(~@/assets/images/project/project.png);
  }
  &.icon-image-role {
    background-image: url(~@/assets/images/project/role.png);
  }
  &.icon-image-switch-project {
    background-image: url(~@/assets/images/project/switch-project.png);
  }
}

.project-list {
  margin-top: 15px;
  li {
    border: 1px solid #eee;
    margin-bottom: 15px;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    i {
      visibility: hidden;
      margin-right: 10px;
      font-size: 16px;
      font-weight: bold;
      display: block;
      color: $primary-color;
    }
    .active {
      visibility: visible;
    }
    &:hover {
      background: $primary-color;
      color: #fff;
      border-color: $primary-color;
    }
  }
}
</style>
