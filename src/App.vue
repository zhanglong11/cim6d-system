<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    token() {
      return this.$store.state.user.token
    }
  },
  mounted() {
    this.getPower()
  },
  methods: {
    // 获取用户授权
    getPower() {
      if (!this.token) {
        return
      }
      this.$store.commit('getPower')
    }
  }
}
</script>
