/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-19 13:40:37
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-06-24 14:51:19
 */

import http from '@/utils/request'
export const roleApi = {
  // 获取用户所有权限
  getSourcePower: data => {
    return http.admin({
      url: '/admin/company/powerList',
      method: 'post',
      data
    })
    // return http.system({
    //   url: '/cim6d/system/power/source',
    //   method: 'get'
    // })
  },
  // 获取用户可用权限
  getAvailablePower: () => {
    return http.system({
      url: '/cim6d/system/power/available',
      method: 'get'
    })
  },
  // 角色分类&角色树
  getTreePermissionPower: data => {
    return http.system({
      url: '/cim6d/system/permission/role/tree',
      method: 'post',
      data
    })
  },
  // 新建角色分类
  addCategoryRole: data => {
    return http.system({
      url: '/cim6d/system/permission/role/category/add',
      method: 'post',
      data
    })
  },
  // 编辑角色分类
  updateCategoryRole: data => {
    return http.system({
      url: '/cim6d/system/permission/role/category/update',
      method: 'post',
      data
    })
  },
  // 删除角色分类
  deleteCategoryRole: id => {
    return http.system({
      url: `/cim6d/system/permission/role/category/delete/${id}`,
      method: 'get'
    })
  },
  // 新建角色
  addRole: data => {
    return http.system({
      url: '/cim6d/system/permission/role/add',
      method: 'post',
      data
    })
  },
  // 编辑角色
  updateRole: data => {
    return http.system({
      url: '/cim6d/system/permission/role/update',
      method: 'post',
      data
    })
  },
  // 删除角色
  deleteRole: id => {
    return http.system({
      url: `/cim6d/system/permission/role/delete/${id}`,
      method: 'get'
    })
  },
  // 获取角色已分配权限
  getPowerListRole: roleId => {
    return http.system({
      url: `/cim6d/system/permission/role/power/list/${roleId}`,
      method: 'get'
    })
  },
  // 保存权限
  bindPowerRoleUser: data => {
    return http.system({
      url: '/cim6d/system/permission/user/role/power/bind',
      method: 'post',
      data
    })
  },
  // 参数树
  queryTreeArg: data => {
    return http.setting({
      url: '/cim6d/arg/tree',
      method: 'post',
      data
    })
  },
  // 重置权限
  resetRoleBind: (roleId, serviceId) => {
    return http.setting({
      url: `/system/permission/user/role/power/reset/${roleId}/${serviceId}`,
      method: 'get'
    })
  },
  getDataPower: roleId => {
    return http.system({
      url: `/system/project/role/dataPower/get/${roleId}`,
      method: 'get'
    })
  },
  getCompanyList: data => {
    return http.system({
      url: '/project/participant/tree',
      method: 'post',
      data
    })
  }
}
