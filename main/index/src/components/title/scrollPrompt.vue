<template>
  <div class="title">
    <div class="m-slide" @mouseenter="onStop" @mouseleave="onStart">
      <div
        :style="`will-change: transform; transform: translateX(${-left}px);`"
        class="u-slide-title"
        v-for="(item, index) in sliderData"
        :key="index"
        :title="item.title"
        @click="onClickTitle(item.id)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/shikuang'
import { encode, decode } from '@/utils/base/dataEncry'
export default {
  name: "sliderPrompt",
  data() {
    return {
      left: 0,
      moveTimer: null,
      sliderData: []
    }
  },
  created() {
    this.getEaList()
  },
  methods: {
    getEaList() {
      getList({}).then((res) => {
        this.sliderData = decode(res)
        this.onStart()
        this.sliderData.forEach((item,index) => {
          item.title = new Date(item.oTime).getMonth() + 1 + '月' + new Date(item.oTime).getDate() + '日' +
          new Date(item.oTime).getHours() + '时' + new Date(item.oTime).getMinutes() + '分' +
          item.localName + '发生' + item.m + '级地震'
          for(let i = 0; i<this.sliderData.length - index; i++){
            if(this.sliderData[i + 1] && this.sliderData[i].oTime < this.sliderData[i + 1].oTime){
              let temp = null
              temp = this.sliderData[i]
              this.sliderData[i] = this.sliderData[i + 1]
              this.sliderData[i + 1] = temp
            }
          }
        })
        this.sliderData = this.sliderData
        this.$emit('getlist',this.sliderData)
      }).catch((e) => {
        console.log(JSON.stringify(e))
      })
    },
    onClickTitle(id) { // 通知父组件点击的标题
      this.$emit('getTitle', id)
    },
    onStop() { // 暂停滚动
      clearInterval(this.moveTimer)
    },
    onStart() { // 开始滚动
      if (this.sliderData.length > 4) { // 超过4条开始滚动
        this.getSlide()
      }
    },
    getSlide() {
      this.moveTimer = setInterval(() => {
        this.moveLeft()
      }, 10) // 1s移动200次
    },
    moveLeft() {
      if (this.left >= 320) {
        this.sliderData.push(this.sliderData.shift()) // 将第一条数据放到最后
        this.left = 0
      } else {
        this.left += 0.6 // 每次移动0.2px
      }
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 0;
  .m-slide {
    // background-color: #fffcf3;
    width: 100%;
    height: 60px;
    white-space: nowrap;
    overflow: hidden;
    // border-top: 2px solid #f8d89b;
    // border-bottom: 2px solid #f8d89b;
    .u-slide-title {
      display: inline-block;
      margin-left: 20px;
      font-size: 18px;
      font-weight: 700;
      line-height: 60px;
      color: #f84919;
      // width: 300px;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      cursor: pointer;
      &:hover {
        // color: #1890ff;
      }
    }
  }
}
</style>
