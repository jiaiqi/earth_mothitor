<template>
    <div class="container">
        <div v-html="text">
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
        text: ''
    }
  },
  mounted() {
    this.text = JSON.parse(sessionStorage.getItem('newsText')).replaceAll('<img','<img style="padding: 15px 0px"')
  },
  methods:{

  }
}
</script>
<style lang="less" scoped>
.container{
    padding: 100px 15%;
}
</style>