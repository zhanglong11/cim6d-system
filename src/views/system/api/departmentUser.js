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
  getDepartmentUserList: departmentId => {
    return http.system({
      url: `/cim6d/system/user/department/getUserList/${departmentId}`,
      method: 'GET',
      data: {}
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
  // 编辑成员所属部门
  editUserDepartment: data => {
    return http.system({
      url: '/cim6d/system/user/department/bind',
      method: 'POST',
      data
    })
  },
  // 获取成员详情
  getUserInfo: id => {
    return http.system({
      url: `/cim6d/system/user/get/${id}`,
      method: 'get'
    })
  },
  // 添加成员
  addUser: data => {
    return http.system({
      url: '/cim6d/system/user/add',
      method: 'POST',
      data
    })
  },
  // 修改成员
  updateUser: data => {
    return http.system({
      url: '/cim6d/system/user/update',
      method: 'POST',
      data
    })
  },
  // 删除成员
  deleteUser: data => {
    return http.system({
      url: '/cim6d/system/user/batchDelete',
      method: 'POST',
      data
    })
  },
  // 删除部门成员关联
  deleteUserDepartment: (departmentId, data) => {
    return http.system({
      url: `/cim6d/system/deleteUserDepartment/${departmentId}`,
      method: 'POST',
      data
    })
  },
  // 获取全部成员
  getAllUser: data => {
    return http.system({
      url: '/cim6d/system/user/list',
      method: 'POST',
      data
    })
  },
  // 获取非所传部门下全部成员
  getNonUserList: departmentId => {
    return http.system({
      url: `/cim6d/system/user/department/getNonUserList/${departmentId}`,
      method: 'get'
    })
  },
  // 修改用户和部门绑定(添加用户选择的时候)
  changeUserDepartmentBind: data => {
    return http.system({
      url: '/cim6d/system/user/department/bind',
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
  }
}
