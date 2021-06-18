/**
 任务名称：2689/ 基础服务-用户管理（react->vue）迁移
 开发人员：李建敏
 日期：2020-3月-24日
 任务类型：1.全新代码
 **/
import systemApi from '../api'
export default {
  namespaced: true,
  state: {
    companyInfo: localStorage.getItem('companyInfo') ? JSON.parse(localStorage.getItem('companyInfo')) : {},
    projectAddTemp: localStorage.getItem('projectAddTemp') ? JSON.parse(localStorage.getItem('projectAddTemp')) : '',
    cacheTimer: '', // 自动缓存定时器
    saveTime: localStorage.getItem('projectAddTempSaveTime') || '' // 上次自动保存时间
  },
  mutations: {
    changeCompanyInfo(state, payload) {
      state.companyInfo = payload
      localStorage.setItem('companyName', payload.name)
      localStorage.setItem('companyInfo', JSON.stringify(payload))
    },
    // 自动缓存未保存的项目数据
    autoSaveProjectTemp(state, data) {
      state.cacheTimer = setInterval(() => {
        const time = new Date()
        const h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
        const m = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
        const saveTime = `，保存时间 ${h}:${m}`
        localStorage.setItem('projectAddTempSaveTime', saveTime)
        state.saveTime = saveTime
        localStorage.setItem('projectAddTemp', JSON.stringify(data))
        state.projectAddTemp = data
      }, 2000)
    },
    // 关闭定时器
    closeCacheTimer(state) {
      clearInterval(state.cacheTimer)
    },
    // 清除项目缓存数据
    clearProjectTemp(state) {
      clearInterval(state.cacheTimer)
      localStorage.setItem('projectAddTemp', '')
      state.projectAddTemp = ''
    }
  },
  actions: {
    getCompanyInfo({ commit }) {
      systemApi.getCompanyInfo().then(info => {
        commit('changeCompanyInfo', info)
      })
    }
  }
}
