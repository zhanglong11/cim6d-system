import axios from '@/utils/request'
export default {
  // 获取主办方配置列表
  getPartiesRecordList: data => {
    return axios.system({
      url: `project/participant/tree`,
      method: 'post',
      data
    })
  },
  // 获取参与方配置列表
  getPartiesUserRecordList: data => {
    return axios.system({
      url: `project/participant/user/tree`,
      method: 'post',
      data
    })
  },
  // 获取参与方配置列表
  getIsUpdateRole: data => {
    return axios.system({
      url: `projectParticipant/isUpdateRole`,
      method: 'POST',
      data
    })
  },
  // 获取参与方配置详情
  getRoleInfo: data => {
    return axios.system({
      url: `/project/participant/get`,
      method: 'POST',
      data
    })
  },
  // 添加参与方配置
  getPartiesAdd: data => {
    return axios.system({
      url: `project/participant/config`,
      method: 'POST',
      data
    })
  },
  // 修改参与方人员分布姓名
  gePartiesRecordAdd: data => {
    return axios.system({
      url: 'project/participant/user/update',
      method: 'POST',
      data
    })
  },
  // 获取参与方人员分布列表
  getPartiesPersonRecordList: () => {
    return axios.system({
      url: `project/participant/user/list`,
      method: 'GET'
    })
  }
}
