/**
 任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
 开发人员：李建敏
 日期：2020-4月-9日
 任务类型：1、全新代码
 **/
import Layout from '@/layout'
// import shell from '@/utils/shell'
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

export default {
  path: '/iot',
  name: 'Iot',
  component: Layout,
  meta: { title: '物联网', icon: 'el-icon-video-camera-solid' },
  children: [
    {
      path: 'product',
      name: 'IotProduct',
      component: () => import('./product'),
      meta: { title: '产品' }
    },
    {
      path: 'product/new',
      name: 'IotProductAdd',
      component: () => import('./product/new'),
      meta: { title: '创建产品', activeMenu: '/iot/product' },
      hidden: true
    },
    {
      path: 'product/:id',
      name: 'IotProductDetail',
      component: () => import('./product/$id'),
      meta: { title: '产品详情', activeMenu: '/iot/product' },
      hidden: true
    },
    {
      path: 'device',
      name: 'IotDevice',
      component: () => import('./device'),
      meta: { title: '设备' }
    },
    {
      path: 'device/:id',
      name: 'IotDeviceDetail',
      component: () => import('./device/$id'),
      meta: { title: '产品详情', activeMenu: '/iot/device' },
      hidden: true
    },
    {
      path: 'group',
      name: 'IotGroup',
      component: () => import('./group'),
      meta: { title: '分组' }
    },
    {
      path: 'group/:id',
      name: 'IotGroupDetail',
      component: () => import('./group/$id'),
      meta: { title: '分组详情', activeMenu: '/iot/group' },
      hidden: true
    },
    {
      path: 'warningRule',
      name: 'IotWarningRule',
      component: () => import('./warningRule'),
      meta: { title: '预警规则' }
    }
  ]
}
