import http from '@/utils/request'
export default {
  // 部门列表
  getDepartment: data => {
    return http.system({
      url: '/cim6d/system/department/list',
      method: 'POST',
      data
    })
  },
  // 添加部门
  addDepartment: data => {
    return http.system({
      url: '/cim6d/system/department/add',
      method: 'POST',
      data
    })
  },
  // 编辑一个部门
  editOneDepartment: data => {
    return http.system({
      url: '/cim6d/system/department/updateOne',
      method: 'POST',
      data
    })
  },
  // 编辑多个部门
  editMoreDepartment: data => {
    return http.system({
      url: '/cim6d/system/department/updateMultiple',
      method: 'POST',
      data
    })
  },
  // 删除部门
  deleteDepartment: data => {
    return http.system({
      url: '/cim6d/system/department/delete',
      method: 'POST',
      data
    })
  },
  getRoleTree: data => {
    return http.system({
      url: '/cim6d/system/permission/role/tree',
      method: 'POST',
      data
    })
  },
  // 项目组织架构图
  getChartProjectOrgan: projectId => {
    return http.system({
      url: `/projectOrgan/${projectId}/chart`,
      method: 'get'
    })
  }
}
