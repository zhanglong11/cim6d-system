import { roleApi } from '@/views/system/api/role'
import { projectApi } from '@/views/system/api/project'
import toFlat from '@/utils/toFlat'
import qs from 'qs'
// 用户权限
const state = {
  powerFlatList: [],
  power: localStorage.getItem('power') ? localStorage.getItem('power').split(',') : [],
  adminPower: localStorage.getItem('adminPower') ? localStorage.getItem('adminPower').split(',') : [],
  config: JSON.parse(localStorage.getItem('systemConfig') || '{}'), // 全局参数缓存
  projectTypePower: localStorage.getItem('projectTypePower') ? localStorage.getItem('projectTypePower').split(',') : [], // 可用项目类型
  projectTypeList: localStorage.getItem('projectTypeList') ? localStorage.getItem('projectTypeList').split(',') : [], // 可用项目类型列表
  serviceCode: '' // 服务类型 潜江工建项目专用
}

const mutations = {
  // 获取用户授权
  getPower(state, callBack = () => {}) {
    this.dispatch('user/getUserInfo').then(() => {
      const power = []
      roleApi.getAvailablePower().then(response => {
        const datas = response.data || []
        state.powerFlatList = toFlat(datas)
        const findArray = array => {
          if (!array) {
            return
          }
          array.map(e => {
            power.push(e.powerKey)
            if (e.children) {
              findArray(e.children)
            }
          })
        }
        const projectTypeList = []
        datas.map(item => {
          if (item.serviceCode === 'qianjiang-ppp') {
            state.serviceCode = item.serviceCode
          }
          if (item.serviceCode === 'base') {
            findArray(item.children)
          }
          projectTypeList.push({
            id: item.serviceCode,
            name: item.serviceName
          })
        })
        const projectTypePower = _.map(datas, 'serviceCode')
        localStorage.setItem('power', power.join(','))
        localStorage.setItem('projectTypePower', projectTypePower.join(','))
        localStorage.setItem('projectTypeList', projectTypeList.join(','))
        state.power = power
        state.projectTypePower = projectTypePower
        state.projectTypeList = projectTypeList
        this.commit('setSystemConfigStorage')
        callBack(power)
      })
    })
  },
  setPower(state, obj) {},
  // 清除缓存
  clearPower(state) {
    state.power = []
    state.adminPower = []
    state.config = {}
    state.projectTypePower = []
    state.projectTypeList = []
    state.serviceCode = ''
  },
  // 设置全局参数缓存
  /*
  通过value 获取系统参数label
  group 分组参数
  value 参数编码
  this.$getLabelFromArg(group, value)
  */
  setSystemConfigStorage(state) {
    const params = {
      module: 'construction-2.0'
    }
    return roleApi.queryTreeArg(params).then(result => {
      const datas = result.data || []
      const list = {}
      datas.map(items => {
        const listItems = {
          id: items.id,
          label: items.argText,
          value: items.argCode,
          argGroup: items.argGroup,
          children: []
        }
        if (items.children) {
          items.children.map(item => {
            const newItem = {
              label: item.argText,
              value: item.argCode,
              argGroup: item.argGroup,
              deleteFlag: item.deleteFlag
            }
            if (item.argGroup === 'projectType') {
              newItem.disable = true
              if (state.projectTypePower.includes(item.argCode)) {
                newItem.disable = false
              }
              listItems.children.push(newItem)
            } else {
              listItems.children.push(newItem)
            }
          })
        }
        list[items.argCode] = listItems
      })
      console.log(111, list)
      localStorage.setItem('systemConfig', JSON.stringify(list))
      state.config = list
    })
  },
  // 跳转工地2.0后台
  toProject(state, { projectItem, taskItem, messageItem }) {
    const processDefinitionCategory =
      taskItem && taskItem.processDefinitionCategory ? taskItem.processDefinitionCategory : ''
    const index = taskItem ? taskItem.index : 1
    let targetId = ''
    // 任务中转
    if (taskItem) {
      targetId = taskItem.targetId
    }
    // 消息中转
    let subModules = ''
    if (messageItem) {
      targetId = messageItem.targetId
      subModules = messageItem.subModules
    }
    const token = this.state.user.token
    const projectTypePower = this.state.userPower.projectTypeList
    const origin = location.origin
    let num = projectItem.type === 'qianjiang-ppp' ? 2 : 1
    const lastOrigin = parseInt(origin[origin.length - 1]) + num
    const newOrigin = origin.substring(0, origin.length - 1) + lastOrigin
    const title = _.find(projectTypePower, { id: projectItem.type })
      ? _.find(projectTypePower, { id: projectItem.type }).name
      : '智慧施工'
    const url = `${newOrigin}/#`
    const query = {
      token,
      targetId,
      subModules,
      index,
      title,
      processDefinitionCategory,
      id: projectItem.id,
      type: projectItem.type,
      projectUserCategory: projectItem.projectUserCategory,
      companyId: projectItem.companyId
    }
    location.href = `${url}/to-admin?` + qs.stringify(query)
  },
  // 任务详情中转逻辑
  toTaskDetails(state, obj) {
    const { processDefinitionCategory, projectId, targetId, index } = obj
    return projectApi.getProject(projectId).then(result => {
      const datas = result.data || []
      this.commit('toProject', {
        projectItem: datas,
        taskItem: {
          processDefinitionCategory,
          targetId,
          index
        }
      })
    })
  },
  // 消息详情中转逻辑
  toMessageDetails(state, obj) {
    const { projectId, messageItem } = obj
    return projectApi.getProject(projectId).then(result => {
      const datas = result.data || []
      this.commit('toProject', {
        projectItem: datas,
        messageItem
      })
    })
  }
}
const actions = {}

export default {
  state,
  mutations,
  actions
}
