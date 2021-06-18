/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-18 14:12:52
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-06-16 11:29:00
 */

import http from '@/utils/request'
export const userApi = {
  // 登录
  login: data => {
    return http.system({
      url: '/login',
      method: 'post',
      data
    })
  },
  // 获取当前登录用户信息
  getCurrentUser: () => {
    return http.system({
      url: `/cim6d/system/user/current/get`,
      method: 'get'
    })
  }
}
