/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-19 09:00:53
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-07-02 17:34:01
 * @Desc 基础管理路由
 */

/*
@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-26
@任务类型: 修改代码，添加左导航菜单激活属性，修改比例(2%)
*/

/* 主模板 */
import Layout from '@/layout'
import shell from '@/utils/shell'
import ChildrenLayout from '@/layout/children-layout' // 三级路由支持
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
export const systemRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/project/project-list',
    name: 'System',
    meta: { title: '基础管理', icon: 'el-icon-setting' },
    children: [
      {
        path: 'project',
        name: 'SystemProject',
        redirect: '/system/project/project-list',
        component: ChildrenLayout,
        meta: { title: '项目管理', icon: 'el-icon-office-building' },
        children: [
          {
            path: 'project-list',
            name: 'SystemProjectList',
            component: () => import('@/views/system/project/index'),
            meta: { title: '项目列表', icon: 'el-icon-s-help' }
          },
          {
            path: 'project-add',
            name: 'SystemProjectAdd',
            component: () => import('@/views/system/project/project-add'),
            hidden: true,
            meta: { title: '新建项目', activeMenu: '/system/project/project-list' }
          },
          /** 新增项目参项单位页面 start**/
          {
            path: 'project-parties',
            name: 'SystemProjectParties',
            component: () => import('@/views/system/project/project-parties'),
            hidden: true,
            meta: { title: '参项单位', name: 'SystemParties', activeMenu: '/system/project/project-list' }
          },
          /** 新增项目参项单位页面 end**/
          {
            path: 'project-edit',
            name: 'SystemProjectEdit',
            component: () => import('@/views/system/project/project-add'),
            hidden: true,
            meta: { title: '编辑项目', activeMenu: '/system/project/project-list' }
          },
          {
            path: 'project-details',
            name: 'SystemProjectDetails',
            hidden: true,
            component: () => import('@/views/system/project/project-details'),
            meta: { title: '项目详情', activeMenu: '/system/project/project-list' }
          },
          /*{
            path: 'parties',
            name: 'SystemParties',
            component: () => import('@/views/system/parties/index'),
            meta: { title: '参项单位', icon: 'el-icon-s-tools' }
          },
          {
            path: 'partiesAdd',
            name: 'SystemPartiesAdd',
            hidden: true,
            component: () => import('@/views/system/parties/add'),
            meta: { title: '参项单位添加', activeMenu: '/system/project/project-list' }
          },
          {
            path: 'personDistribution',
            name: 'SystemPersonDistribution',
            component: () => import('@/views/system/parties/personDistribution'),
            meta: { title: '参项人员', icon: 'el-icon-orange' }
          },*/
          {
            path: 'settings',
            name: 'SystemProjectSettings',
            component: shell('SystemProjectSettings'),
            meta: { title: '配置管理', icon: 'el-icon-orange' },
            children: [
              {
                path: 'myProject',
                name: 'SystemMyProject',
                props: {
                  type: 1
                },
                component: () => import('@/views/system/project/settings/myProject'),
                meta: { title: '我的项目' }
              },
              {
                path: 'projectHasMe',
                name: 'SystemProjectHasMe',
                props: {
                  type: 2
                },
                component: () => import('@/views/system/project/settings/myProject'),
                meta: { title: '我参与的' }
              }
            ]
          }
        ]
      },
      {
        path: 'project-role-set',
        name: 'SystemProjectRoleSet',
        hidden: true,
        component: () => import('@/views/system/project/project-role-set'),
        meta: { title: '项目角色配置', activeMenu: '/system/project/project-list' }
      },
      {
        path: 'project-department-manage',
        name: 'SystemProjectDepartmentManage',
        hidden: true,
        component: () => import('@/views/system/project/project-department-manage'),
        meta: { title: '机构管理', activeMenu: '/system/project/project-list' }
      },
      {
        path: 'project-department-map',
        name: 'SystemProjectDepartmentMap',
        hidden: true,
        component: () => import('@/views/system/project/project-department-map'),
        meta: { title: '项目机构图', activeMenu: '/system/project/project-list' }
      },
      {
        path: 'center',
        name: 'SystemCenter',
        component: () => import('@/views/system/center/index'),
        meta: { title: '个人中心', icon: 'el-icon-s-custom' }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index'),
        meta: { title: '角色权限', icon: 'el-icon-wind-power' }
      },
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user'),
        meta: { title: '用户管理', icon: 'el-icon-s-custom' }
      },
      {
        path: 'department',
        name: 'SystemDepartment',
        component: () => import('@/views/system/department'),
        meta: { title: '部门管理', icon: 'el-icon-receiving' }
      },
      {
        path: 'department-user',
        name: 'SystemDepartmentUser',
        component: () => import('@/views/system/departmentUser'),
        meta: { title: '部门人员管理', icon: 'el-icon-s-custom' }
      }
    ]
  }
]
