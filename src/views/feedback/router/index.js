/*
 * @Author: 耿为刚 创建
 * @Date: 2020-07-05 17:00:53
 * @Last Modified by: gengweigang
 * @Desc 匿名留言路由
 */
/* 主模板 */
import Layout from '@/layout'
import ChildrenLayout from '@/layout/children-layout'
/**
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
export const feedbackRoutes = [
  {
    path: '/feedback',
    name: 'Feedback',
    component: Layout,
    redirect: '/feedback/feedback-list',
    meta: { title: '匿名留言', icon: 'el-icon-s-promotion' },
    children: [
      {
        path: 'feedback-list',
        name: 'FeedbackList',
        component: () => import('@/views/feedback/index'),
        meta: { title: '匿名留言', icon: 'el-icon-s-promotion' }
      },
      {
        path: 'feedback-details',
        name: 'FeedbackDetails',
        hidden: true,
        component: () => import('@/views/feedback/details'),
        meta: { title: '留言详情', activeMenu: '/feedback/feedback-list' }
      }
    ]
  },
  {
    path: '/feedback-add',
    name: 'FeedbackAdd',
    hidden: true,
    component: ChildrenLayout,
    redirect: '/feedback-add/feedback-add-new',
    children: [
      {
        path: 'feedback-add-new',
        name: 'FeedbackAddNew',
        // hidden: true,
        component: () => import('@/views/feedback/add'),
        meta: { title: '添加匿名留言' }
      }
    ]
  }
]
