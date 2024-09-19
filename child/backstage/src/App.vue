<template>
  <div id="app">
    <div class="contener">
      <router-view />
    </div>
  </div>
</template>

<script>
import { getToken, getExpiresIn } from '@/utils/auth.js'
export default {
  name: 'App',
  metaInfo() {
    return {
      title:
        this.$store.state.settings.dynamicTitle &&
        this.$store.state.settings.title,
      titleTemplate: (title) => {
        return title
          ? `${title} - ${process.env.VUE_APP_TITLE}`
          : process.env.VUE_APP_TITLE
      }
    }
  },
  created() {
    let string = window.name.split(',')
    const token = string[1]
    const url = string[0]
    const expiresIn = string[2]
    const refreshToken = string[3]
    // const token = getToken()
    // const url = 
    // const expiresIn = getExpiresIn()
    let arr = {
      token: token,
      expiresIn: expiresIn,
      refreshToken: refreshToken
    }
    this.$store.dispatch('goIndex', arr).then((res) => {
      this.$router.push({ path: this.redirect || '/' }).catch(() => {})
    })
    // sessionStorage.setItem('url', url)
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.contener {
  width: 100%;
  height: 100vh;
}
</style>
