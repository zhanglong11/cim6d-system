import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import message from './modules/message'
import settings from './modules/settings'
import user from './modules/user'
import system from '@/views/system/store'
import iot from '@/views/iot/store'
import userPower from './modules/user-power' // 用户权限

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    message,
    settings,
    user,
    system,
    iot,
    userPower
  },
  getters
})

export default store
