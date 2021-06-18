import { approvalApi } from '@/views/approval/api/approval'

export default {
  namespaced: true,
  state: {
    unreadNum: 0
  },
  mutations: {
    changeUnreadNum(state, payload) {
      state.unreadNum = payload
    }
  },
  actions: {
    getUnreadMessage({ commit }) {
      approvalApi.getUnreadMessage().then(res => {
        commit('changeUnreadNum', res.data || 0)
      })
    }
  }
}
