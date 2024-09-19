<template>
  <div class="industry commom">
    <div class="topNav">
      <TopNav :pageName="'地震灾害防御'"></TopNav>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  components: {},
  watch: {},
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.industry {
  position: relative;
  height: 400px;
  .topNav {
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: #fff;
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
  }
}
</style>
