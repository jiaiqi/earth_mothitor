<template>
  <div class="drawTool">
    <label for="" class="title">绘制工具</label>
    <button @click="draw">绘点</button>
  </div>
</template>

<script>
import { inject } from 'vue'
export default {
  created() {},
  methods: {
    draw() {
      let mymap = inject('map')
      mymap.map.on('click', (e) => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.drawTool {
  z-index: 1000;
  width: 100px;
  height: 100px;
  // background-color: #fff ;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    margin-bottom: 20px;
  }
}
</style>
>
