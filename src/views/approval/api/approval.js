/*
  任务名称：task#2854 【智慧工地2.0-前端】工作台切图及功能开发
  开发人员：耿为刚
  日期：2020-04-01
*/
import http from '@/utils/request'
export const approvalApi = {
  // 获取项目列表
  queryProjectList: data => {
    return http.system.post('cim6d/system/project/list', data)
  },
  // 添加消息
  addMessage: data => {
    return http.system({
      url: 'message/add',
      method: 'post',
      data
    })
  },
  // 编辑消息
  updateMessage: data => {
    return http.system({
      url: 'message/update',
      method: 'post',
      data
    })
  },
  // 删除消息
  deleteMessage: id => {
    return http.system({
      url: `message/delete/${id}`,
      method: 'get'
    })
  },
  // 获取消息详情
  getDetailsMessage: id => {
    return http.system({
      url: `message/get/${id}`,
      method: 'get'
    })
  },
  // 查询未读数量
  getUnreadMessage: () => {
    return http.system({
      url: 'common/message/unread/count',
      method: 'post',
      data: {}
    })
  },
  // 查询用户详情
  getUserInfo: id => {
    return http.system({
      url: `cim6d/system/user/get/${id}`,
      method: 'get'
    })
  },
  // 获取任务列表
  queryTaskList: data => {
    return http.workflow({
      url: '/task/list',
      method: 'post',
      data
    })
  },
  // 我发起的流程
  queryInstanceActivitiList: data => {
    return http.workflow({
      url: '/activiti/process/instance/started',
      method: 'post',
      data
    })
  },
  // 审批
  completeTask: (taskId, data) => {
    return http.workflow({
      url: `/task/complete/${taskId}`,
      method: 'post',
      data
    })
  },
  // 获取任务详情
  getTask: (processInstanceId, activityId) => {
    return http.workflow({
      url: `/task/get/${processInstanceId}/${activityId}`,
      method: 'get'
    })
  },
  // 获取文件详情
  getFileUrl: id => {
    return http.file({
      url: `/file/manage/get/${id}`,
      method: 'get'
    })
  },
  // 查询大事记
  queryEventList: data => {
    return http.design({
      url: 'project/event/list',
      method: 'post',
      data
    })
  },
  // 添加大事记
  addEvent: data => {
    return http.design({
      url: 'project/event/add',
      method: 'post',
      data
    })
  },
  // 编辑大事记
  updateEvent: data => {
    return http.design({
      url: 'project/event/update',
      method: 'post',
      data
    })
  },
  // 获取大事记详情
  getDetailsEvent: id => {
    return http.design({
      url: `project/event/get/${id}`,
      method: 'get'
    })
  },
  // 删除大事记
  deleteEvent: id => {
    return http.design({
      url: `project/event/delete/${id}`,
      method: 'get'
    })
  }
}
