import Vue from 'vue'
import Router from 'vue-router'
import { systemRoutes } from '@/views/system/router' // 基础管理路由
import { formRoutes } from '@/views/form/router' // 拖拽表单路由
// import iotRoutes from '@/views/iot/router' // 物联网
import { approvalRoutes } from '@/views/approval/router' // 审核管理路由
import { messageRoutes } from '@/views/message/router' // 消息路由
import { feedbackRoutes } from '@/views/feedback/router' // 匿名留言路由

Vue.use(Router)

// 处理开发路由，不进行权限处理
const developmentRoute = [
  // 开发完毕上线要删除，走权限控制
  // ...systemRoutes // 基础管理路由
  ...approvalRoutes, // 审核管理路由
  ...messageRoutes // 消息路由
]

const developmentRouteNames = []
const formatDevelopmentRoute = array => {
  array.map(item => {
    if (!item.name) {
      return
    }

    developmentRouteNames.push(item.name)
    if (item.children) {
      formatDevelopmentRoute(item.children)
    }
  })
}
formatDevelopmentRoute(developmentRoute)
Vue.prototype.$DevelopmentRoute = developmentRouteNames
window.$DevelopmentRoute = developmentRouteNames

/* 主模板 */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，则项目将不会显示在侧边栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果不始终设置Show，则当项具有多个子路由时，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置为no redirect，则breadcrumb中不会重定向
 * name:'router-name'             名称由<keep alive>使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐集）
    icon: 'svg-name'             图标显示在侧栏中,支持/src/icons/svg格式和element-ui icon两种形式
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中（默认为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/system/login/index'),
    hidden: true
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    redirect: '/system/project'
  },
  ...systemRoutes, // 基础管理路由
  ...formRoutes, // 拖拽表单路由
  // iotRoutes,// 物联网
  ...approvalRoutes, // 审核管理路由
  ...messageRoutes, // 消息路由
  ...feedbackRoutes, // 匿名留言路由
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
