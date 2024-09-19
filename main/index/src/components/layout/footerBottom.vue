<template>
  <div class="bottom">
    <div class="main commom">
      <!-- <div>
        <span><router-link to="/user/sitemap">网站地图</router-link></span>
        <span class="pad">|</span>
        <span><router-link to="/user/collmy">联系我们</router-link></span>
        <span class="pad">|</span>
        <span>更新动态</span>
      </div> -->
      <div>
        <span class="pad">网站标示码：京ICP备06029777号</span>
        <span>京公网安备11040102700066号</span>
      </div>
      <div>
        <span>电话：010—68219525</span>
        <span class="pad">地址：北京市海淀区复兴路63号</span>
        <span>邮编： 100036</span>
      </div>
      <div>
        <span class="pad">版权所有：中国地震局</span>
      </div>
    </div>
  </div>
</template>

<script>
import { encode, decode } from '@/utils/base/dataEncry.js'
// import { industry } from '@/api/industry'
export default {
  data() {
    return {
      options: [],
      value: ''
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    // getList() {
    //   let data = encode({})
    //   industry(data)
    //     .then((res) => {
    //       this.options = decode(res.data)
    //     })
    //     .catch(() => {})
    // },

    pathPage(e) {
      if (e === false) {
        setTimeout(() => {
          window.open(this.value)
        }, 100)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.bottom {
  width: 100%;
  background-color: #2f77c9;
  .main {
    position: relative;
    padding: 20px 20px 20px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgb(210, 210, 210);
    font-size: 14px;
    a {
      color: rgb(210, 210, 210);
    }
    .select {
      position: absolute;
      top: 15%;
      color: rgb(210, 210, 210);
      right: 1%;
    }
  }
}
.pad {
  padding: 0px 10px;
  line-height: 22px;
}
@media (max-width: 1200px) {
  .bottom {
    width: 1200px;
  }
  .select {
    right: 0;
  }
}
</style>
