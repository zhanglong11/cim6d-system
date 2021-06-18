import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Clipboard from 'v-clipboard'
import InputNumber from '@/components/InputNumber'
import DateRange from '@/components/DateRange' //

import _ from 'lodash'

import '@/styles/index.scss' // global css
import '@/themes/index.less' // 定制皮肤 css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import '@/views/system/config/' // 基础功能组件依赖
import '@/views/form/config/' // 拖拽表单组件依赖
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import moment from 'moment'
import 'moment/locale/zh-cn'

import pageConfig from './utils/page-config' // 全局分页配置
import request from '@/utils/request'

import Grid from '@/components/Grid'
import SelectArg from '@/components/SelectArg'
import Status from '@/components/Status'
import ElTreeSelect from 'el-tree-select'
import remove from '@/utils/remove'
import VuePromiseBtn from 'vue-promise-btn'

// not required. Styles for built-in spinner
import 'vue-promise-btn/dist/vue-promise-btn.css'
/*
  是否有按钮操作权限
  true 有权限
  false 无权限
*/
Vue.prototype.$hasPower = e => store.state.userPower.power.includes(e)
Vue.use(VuePromiseBtn, {})
Vue.prototype.$pageConfig = pageConfig
Vue.prototype._ = _
window._ = _
Vue.prototype.axios = request
Vue.use(Clipboard)
Vue.prototype.log = console.log
Vue.prototype.$remove = remove
Vue.prototype.moment = moment
window.moment = moment
Vue.component(Grid.name, Grid)
Vue.component(Status.name, Status)
Vue.component(InputNumber.name, InputNumber)
Vue.component('TreeSelect', TreeSelect)
Vue.component(DateRange.name, DateRange)
Vue.component(SelectArg.name, SelectArg)
// set ElementUI lang to EN
Vue.use(ElementUI, { locale, size: 'small' })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(ElTreeSelect)
VXETable.setup({
  table: {
    size: 'small',
    align: 'center',
    border: true,
    resizable: true,
    showOverflow: 'title',
    showHeaderOverflow: 'title'
  }
})
Vue.use(VXETable)

import BaiduMap from 'vue-baidu-map' // 引入百度地图组件
Vue.use(BaiduMap, {
  ak: 'E3d49U4ohTx2bANAkfzqAGimmzn7dbex' // 使用申请的百度地图秘钥
})

/*
获取系统参数分组数据
group 分组参数
this.$getArgList(group)
*/
const getLabel = (options, value) => _.get(_.find(options, { value }), 'label', '-')
Vue.prototype.$getArgList = group =>
  store.state.userPower.config[group] && store.state.userPower.config[group].children.filter(item => !item.deleteFlag)
/*
  通过value 获取系统参数label
  group 分组参数
  value 参数编码
  this.$getLabelFromArg(group, value)
  */
Vue.prototype.$getLabelFromArg = (group, value) =>
  getLabel(store.state.userPower.config[group] && store.state.userPower.config[group].children, value + '')

Vue.prototype.$getLabel = getLabel

// 注册全局环境配置
Vue.prototype.process = process

// 全局过滤器
import * as customFilters from './utils/filters'
Object.keys(customFilters).forEach(key => {
  Vue.filter(key, customFilters[key])
})

/**
开发人员：耿为刚
日期：2020-07-06
任务类型：增加全局枚举处理
**/
import Enum from 'vue-enum'
import enumInfo from './enumeration'
Vue.use(Enum, { enumInfo })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
