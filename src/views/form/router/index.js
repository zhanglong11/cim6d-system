/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-19 09:00:53
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-06-16 13:41:21
 * @Desc 拖拽表单路由
 */

/* 主模板 */
import Layout from '@/layout'
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
export const formRoutes = [
  {
    path: '/form',
    component: Layout,
    redirect: '/form/add-form',
    name: 'Form',
    meta: { title: '拖拽表单', icon: 'el-icon-s-grid' },
    children: [
      {
        path: 'form-list',
        name: 'FormList',
        component: () => import('@/views/form/form-list'),
        meta: { title: '表单管理', icon: 'el-icon-s-grid' }
      },
      {
        path: 'add-form',
        name: 'FormListAdd',
        component: () => import('@/views/form/add-form'),
        meta: { title: '创建表单', icon: 'el-icon-edit-outline' }
      },
      /**
       任务名称：2747/ 自定义表单：表单分类、表单功能开发
       开发人员：李建敏
       日期：2020-3月-27日
       任务类型：1.全新代码
       **/
      {
        path: 'category',
        name: 'FormCategory',
        hidden: true,
        component: () => import('@/views/form/category'),
        meta: { title: '表单分类', icon: 'el-icon-edit-outline' }
      },
      {
        path: 'edit-form',
        name: 'FormListEdit',
        hidden: true,
        component: () => import('@/views/form/add-form'),
        meta: { title: '编辑表单', icon: 'el-icon-edit-outline', activeMenu: '/form/form-list' }
      }
    ]
  }
]
