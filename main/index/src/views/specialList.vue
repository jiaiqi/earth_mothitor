<template>
<div style="padding: 50px 210px;">
    <div style="cursor:pointer" @click="back">
        <i class="el-icon-back"></i>
        <span style="font-size: 16px;padding-left:5px;">返回</span>
    </div>
    <div class="content">
      <div class="block" v-for="item in professionList" :key="item.url">
        <div class="item" @click="toUrl(item.url)">
          <img :src="item.photoUrl"/>
          <div class="text">{{ item.deptName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { encode,decode } from '@/utils/base/dataEncry';
import { industry } from '@/api/shikuang'
export default {
  data() {
    return {
        professionList: []
    }
    },
  mounted() {
    this.getList()
  },
  methods: {
    back() {
        location.href = '/home'
    },
    toUrl(url) {
      window.open(url)
    },
    getList() {
      industry(encode({pageNum: 1,pageSize: 999})).then(res=>{
        this.professionList = decode(res)
      })
    },
  }
}
</script>
<style lang="less">
a{
    color: #0099ff;
}
.content {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .block {
    margin: 20px 0px;
    .item {
      box-shadow: 0px 1px 3px 1px #a8a8a8;
      .text {
        background-color: rgba(100, 100, 100, 0.4);
        padding: 8px 10px;
        color: #fff;
      }
      img {
        width: 390px;
        height: 210px;
        margin-bottom: -5px;
      }
    }
  }
  .item:hover {
    cursor: pointer;
    transform:scale(1.05,1.05);
    transition: transform 0.4s ease-out;
    -webkit-transition: transform 0.4s ease-out;
    -moz-transition: transform 0.4s ease-out;
    -o-transition: transform 0.4s ease-out;
    -ms-transition: transform 0.4s ease-out;
  }
}
</style>