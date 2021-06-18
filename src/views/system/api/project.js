/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-19 13:40:37
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-07-16 14:34:44
 */
import http from '@/utils/request'
export const projectApi = {
  // 项目类型列表
  getProjectType: data => {
    return http.system({
      url: '/cim6d/system/project/type/list',
      method: 'get',
      data
    })
  },
  // 查询项目列表
  queryProject: data => {
    return http.system({
      url: '/cim6d/system/project/list',
      method: 'post',
      data
    })
  },

  // 新建项目
  addProject: data => {
    return http.system({
      url: '/cim6d/system/project/add',
      method: 'post',
      data
    })
  },
  // 批量删除项目
  deleteProjectBatch: data => {
    return http.system({
      url: '/cim6d/system/project/batch/delete',
      method: 'post',
      data
    })
  },
  // 删除项目
  deleteProject: id => {
    return http.system({
      url: `/cim6d/system/project/delete/${id}`,
      method: 'get'
    })
  },
  // 查询项目详情
  getProject: id => {
    return http.system({
      url: `/cim6d/system/project/get/${id}`,
      method: 'get'
    })
  },
  // 获取项目图片
  getProjectImg: data => {
    return http.system({
      url: `/cim6d/system/project/getImg`,
      method: 'post',
      data
    })
  },
  // 生成sdk
  generateKeyProject: id => {
    return http.system({
      url: `GET /cim6d/system/project/key/generate/${id}`,
      method: 'get'
    })
  },
  // 项目启动
  startProject: projectId => {
    return http.system({
      url: `GET /cim6d/system/project/start/${projectId}`,
      method: 'get'
    })
  },
  // 编辑项目
  updateProject: data => {
    return http.system({
      url: '/cim6d/system/project/update',
      method: 'post',
      data
    })
  },
  // 获取项目下的角色与人员
  getUserRoleProject: projectId => {
    return http.system({
      url: `/cim6d/system/project/user/role/${projectId}`,
      method: 'get'
    })
  },
  // 查询用户下的项目列表
  getUserProject: () => {
    return http.system({
      url: `/cim6d/system/project/list`,
      method: 'POST',
      data: {
        page: 1,
        rows: 999
      }
    })
  },
  // 根据项目id获取该项目关联的GIS-id、BIM-id
  getLibraryGraphicsProject: id => {
    return http.system({
      url: `/cim6d/system/project/graphics/library/query/${id}`,
      method: 'get'
    })
  },
  // 回显Gis关联库
  queryGimGraphicsLibraryProject: data => {
    return http.system({
      url: `/cim6d/gimGraphicsLibrary/list`,
      method: 'post',
      data
    })
  },
  // 回显Bim关联库
  getGimGraphicsLibraryProject: data => {
    return http.system({
      url: `/cim6d/gimGraphicsLibrary/list`,
      method: 'post',
      data
    })
  },
  // 查询项目负责人列表
  getPrincipalList: data => {
    return http.system({
      url: `/cim6d/system/user/query`,
      method: 'post',
      data
    })
  },
  // 上传项目图片
  upLoadFile: data => {
    return http.file({
      url: `/file/commonFile/uploadImage`,
      method: 'post',
      data
    })
  },
  // 获取项目架构树状信息
  getProjectOrganList: data => {
    return http.system({
      url: `/projectOrgan/treeList`,
      method: 'post',
      data
    })
  },
  // 机构上移
  projectOrganMoveUp: id => {
    return http.system({
      url: `/projectOrgan/moveUp/${id}`,
      method: 'get'
    })
  },
  // 机构下移
  projectOrganMoveDown: id => {
    return http.system({
      url: `/projectOrgan/moveDown/${id}`,
      method: 'get'
    })
  },
  // 机构新增
  addOrganInfo: data => {
    return http.system({
      url: `/projectOrgan/addOrgan`,
      method: 'post',
      data
    })
  },
  // 重命名机构
  renameOrganName: data => {
    return http.system({
      url: `/projectOrgan/rename`,
      method: 'post',
      data
    })
  },
  // 删除机构
  deleteOrganInfo: id => {
    return http.system({
      url: `projectOrgan/deleteOrgan/${id}`,
      method: 'get'
    })
  },
  // 查询机构下的用户
  getOrganUserList: data => {
    return http.system({
      url: `/projectOrgan/organUserList`,
      method: 'post',
      data
    })
  },
  // 机构下添加人员
  organAddUser: data => {
    return http.system({
      url: `projectOrgan/addUser`,
      method: 'post',
      data
    })
  },
  // 机构下编辑人员
  organUpdateUser: data => {
    return http.system({
      url: `projectOrgan/updateUser`,
      method: 'post',
      data
    })
  },
  // 机构下移除人员
  organRemoveUser: data => {
    return http.system({
      url: `/projectOrgan/deleteUser`,
      method: 'post',
      data
    })
  },
  // 根据服务id查询角色树
  getRoleTreeByServiceId: data => {
    return http.system({
      url: `/cim6d/system/permission/role/tree`,
      method: 'post',
      data
    })
  },
  // 用户与项目角色绑定
  setUserProjectRole: data => {
    return http.system({
      url: `/cim6d/system/project/user/role/set`,
      method: 'post',
      data
    })
  },
  // ------新版接口------
  // 查询角色或角色分组
  querylistAllProjectRole: data => {
    return http.system({
      url: `/projectRole/listAll`,
      method: 'post',
      data
    })
  },
  // 添加项目角色
  addProjectRole: data => {
    return http.system({
      url: `/projectRole/add`,
      method: 'post',
      data
    })
  },
  // 修改项目角色
  updateProjectRole: data => {
    return http.system({
      url: `/projectRole/update`,
      method: 'post',
      data
    })
  },
  // 保存角色权限
  updateProjectRolePower: data => {
    return http.system({
      url: `/projectRole/updateRolePower`,
      method: 'post',
      data
    })
  },
  // 根据角色id删除
  deleteProjectRole: roleId => {
    return http.system({
      url: `/projectRole/delete/${roleId}`,
      method: 'get'
    })
  },
  // 根据角色id查询权限
  getPowerByRoleProjectRole: roleId => {
    return http.system({
      url: `/projectRole/getPowerByRole/${roleId}`,
      method: 'get'
    })
  },
  /**
   * 查询项目授权
   * @param projectId 项目ID
   * @param {Boolean} [isParticipant=false]  是否是参与方项目
   * @returns {Promise}
   */
  getProjectPower: (projectId, isParticipant = false) => {
    return http.system({
      url: `/cim6d/system/project${isParticipant ? '/participant' : ''}/power/available/${projectId}`,
      method: 'get'
    })
  },
  //获取数据权限
  getProjectDataPower: roleId => {
    return http.system({
      url: `/system/project/role/dataPower/get/${roleId}`,
      method: 'get'
    })
  },
  // 保存角色数据权限
  updateProjectRoleDataPower: data => {
    return http.system({
      url: `/system/project/role/dataPower/save`,
      method: 'post',
      data
    })
  }
}
