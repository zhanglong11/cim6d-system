import http from '@/utils/request'
export const messageApi = {
  // 查询消息列表
  queryListMessage: data => {
    return http.system({
      url: 'common/message/list',
      method: 'post',
      data
    })
  },
  // 获取消息详情
  getDetailsMessage: id => {
    return http.system({
      url: `/common/message/get/${id}`,
      method: 'get'
    })
  },
  // 删除消息
  deleteMessage: id => {
    return http.system({
      url: `/common/message/delete//${id}`,
      method: 'get'
    })
  },
  // 更新为已读
  readMessage: id => {
    return http.system({
      url: `/common/message/read/${id}`,
      method: 'get'
    })
  },
  //全部已读
  allRead: data => {
    return http.system({
      url: `common/message/allRead`,
      method: 'post',
      data
    })
  }
}
