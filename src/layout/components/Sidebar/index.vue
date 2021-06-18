<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <template v-for="route in routes">
          <sidebar-item
            v-if="($DevelopmentRoute.includes(route.name) && !serviceCode) || power.includes(route.name)"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import treeForEach from '@/utils/treeForEach'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar']),
    routes() {
      const sortHash = _.keyBy(this.$store.state.userPower.powerFlatList, 'powerKey')
      treeForEach(this.$router.options.routes, route => (route.sort = sortHash[route.name]?.sort))
      treeForEach(this.$router.options.routes, route => {
        if (route.children) {
          route.children = _.sortBy(route.children, 'sort')
        }
      })
      const result = _.sortBy(this.$router.options.routes, 'sort')
      console.log(result)
      return result
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    // 权限
    power() {
      return this.$store.state.userPower.power
    },
    // 是否是管理员
    adminFlag() {
      return this.$store.state.user.adminFlag
    },
    // 服务类型 潜江工建项目专用
    serviceCode() {
      return this.$store.state.userPower.serviceCode
    }
  }
}
</script>
