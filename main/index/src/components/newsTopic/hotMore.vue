<template>
    <div class="container">
      <div style="cursor:pointer;padding-left: 80px;width: 300px;" @click="back">
          <i class="el-icon-back"></i>
          <span style="font-size: 16px;padding-left:5px;">返回</span>
      </div>
      <div class="contant">
          <div class="item" v-for="item in list" :key="item.id">
            <img class="imgClass" v-if="item.smallImg" :src="item.smallImg"/>
            <img class="imgClass" v-else src="@/assets/images/catalogue.png"/>
            <div class="info">
              <p class="head" :title="item.keyName">{{ item.keyName }}</p>
              <p class="infoText">浏览量：{{ item.hotNum }}</p>
              <div class="btn" @click="goInfo(item)">查看详情</div>
            </div>
          </div>
        </div>
        <el-pagination class="pages" :total="total"
            :current-page="queryParams.pageNum" :page-size="queryParams.pageSize"
         @current-change="getList" layout="total, prev, pager, next, jumper" />
    </div>
</template>

<script>
import { getFlagList } from '@/api/count'
export default {
  data() {
    return {
      list: [],
      type: null,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 6
      }
    }
  },
  mounted() {
    this.type = this.$route.query.type
    this.getList(1)
  },
  methods:{
    getList(page) {
      if(this.type == '1'){
        getFlagList('pageNum='+page+'&pageSize=6').then(res=>{
          let data = res.records
          this.total = res.total
          this.list = data
        })
      }
      if(this.type == '2'){
        getFlagList('pageNum='+page+'&pageSize=6&key=d').then(res=>{
          let data = res.records
          this.total = res.total
          this.list = data
        })
      }
      if(this.type == '3'){
        getFlagList('pageNum='+page+'&pageSize=6&key=date').then(res=>{
          let data = res.records
          this.total = res.total
          this.list = data
        })
      }
    },
    back() {
        location.href = '/home'
    },
    // 查看详情
    goInfo(item) {
      sessionStorage.setItem('hotInfo',JSON.stringify(item))
      if(item.linkUnit){
        sessionStorage.setItem('tips',item.linkUnit)
      }
      if(item.url.indexOf('http://') != -1 || item.url.indexOf('https://') != -1){
        window.open(item.url)
      }else {
        this.$router.push(item.url)
      }
    },
  }
}
</script>
<style lang="less" scoped>
.container{
  width: 100%;
  padding: 2% 0px;
    .contant {
          overflow-y: auto;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          .imgClass {
            width: 180px;
            height: 150px;
          }
          .item {
            width: 37%;
            display: flex;
            margin: 10px 15px;
            margin-top: 32px;
            .info {
              padding: 0px 15px;
              .head {
                width: 375px;
                font-size: 19px;
                line-height: 35px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .infoText {
                font-size: 16px;
                line-height: 25px;
                color: #767676;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .btn {
                cursor: pointer;
                width: 80px;
                text-align: center;
                margin-top: 15px;
                line-height: 30px;
                color: #fff;
                border-radius: 5px;
                background-color: #409EFF;
              }
              .btn:hover {
                background-color: #6eb7ff;
              }
            }
        }
        }
        .pages {
          width: 100%;
          padding: 10px 0px;
          display: flex;
          justify-content: center;
        }
}
</style>