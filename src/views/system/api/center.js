import axios from '@/utils/request'
export default {
  // 获取企业信息
  getCompanyInfo: () => {
    return axios.system({
      url: 'cim6d/system/company/info/get',
      method: 'get'
    })
  },
  // 修改密码e
  getChangePassword: data => {
    return axios.system({
      url: 'cim6d/system/user/password/change',
      method: 'POST',
      data
    })
  },
  /* 获取企业图片*/
  getImageList: data => {
    return axios.file({
      url: 'file/manage/list',
      method: 'POST',
      data
    })
  },
  /* 获取用户信息*/
  getUserInfo: () => {
    return axios.system({
      url: 'cim6d/system/user/current/get',
      method: 'get'
    })
  },
  getUserUpdate: data => {
    return axios.system({
      url: 'cim6d/system/user/update',
      method: 'POST',
      data
    })
  }
}
