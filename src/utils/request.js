/*
@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-25
@任务类型: 修改代码，添加文件服务前缀，修改比例(1%)
*/
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
const configEnv = process.env.VUE_APP_BASE_API // 环境变量
// create an axios instance
const http = baseURL => {
  const service = axios.create({
    baseURL, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
  })
  // request interceptor
  service.interceptors.request.use(
    config => {
      config.headers['x-access-token'] = getToken() || ''
      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  // response interceptor
  service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
      const res = response.data

      // if the custom code is not 20000, it is judged as an error.
      if (res.code !== 200) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 2 * 1000
        })

        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 1000) {
          store.dispatch('user/logout')
          location.reload()
        }
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    },
    error => {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(error)
    }
  )
  return service
}

/**
 任务名称：2747/ 自定义表单：表单分类、表单功能开发
 开发人员：李建敏
 日期：2020-3月-27日
 任务类型：2.修改代码（1行）
 **/
export default {
  system: http(`/cim6d-system${configEnv}`), // 基础管理 cim6d-system
  // system: http(`/cim6d-system-dev-yjq`), // 基础管理 cim6d-system
  admin: http(`/cim6d-admin${configEnv}`), // 超级管理 cim6d-admin
  global: http(`/cim6d-global${configEnv}`),
  form: http(`/cim6d-process${configEnv}`), // 拖拽表单
  file: http(`/cim6d-file-storage${configEnv}`), // 文件管理
  activiti: http(`/cim6d-process${configEnv}`), // 工作流
  iot: http(`/cim6d-iot${configEnv}/iot`),
  setting: http(`/cim6d-global${configEnv}`) // 系统参数
}
