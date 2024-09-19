<template>
  <div class="profession">
    <div class="container">
      <div class="title">
        <div class="header">
          <img src="@/assets/images/earth.png" alt="" />
          <h3>新闻动态</h3>
        </div>
      </div>
      <div class="main">
        <div class="right">
          <div class="bordy">
            <div class="box1">
              <div class="messagetext" v-if="newlist.length == 0">{{ text2 }}</div>
              <div v-else>
                <div style="display:flex;">
                <ul class="earthquake">
                  <li v-for="item in newlist.slice(0,10)" :key="item.id" @click="toUrl(item)">
                    <div class="earthtime" :data-item="JSON.stringify(item)">
                       <span style="font-size:14px;float: right;">{{ DateFormat(item.uploadTime)}}</span>
                    </div>
                    <div class="earthtext" :data-item="JSON.stringify(item)">
                      <img src="@/assets/images/dot.png" alt="" style="margin:4px 8px 4px 0px" />
                        <span style="font-size:17px;">{{ item.title }}</span>
                    </div>
                     
                  </li>
                </ul>
              </div>
              <div class="hisBtn" @click="more">更多<i style="width: 7px" class="el-icon-arrow-right"></i><i class="el-icon-arrow-right"></i></div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="left">
          <div style="border-bottom: 2px solid #409EFF;display: flex;justify-content: space-between;">
            <el-radio-group v-model="dataSel">
              <el-radio-button label="热门数据"><span @mouseenter="dataSel='热门数据'" style="font-size:16px">热门数据</span></el-radio-button>
              <el-radio-button label="最新数据"><span @mouseenter="dataSel='最新数据'" style="font-size:16px">最新数据</span></el-radio-button>
              <el-radio-button label="推荐数据"><span @mouseenter="dataSel='推荐数据'" style="font-size:16px">推荐数据</span></el-radio-button>
            </el-radio-group>
            <div class="more" @click="getearthquaces(1)">更多<i style="width: 7px" class="el-icon-arrow-right"></i><i class="el-icon-arrow-right"></i></div>
          </div>
          <div class="contant">
            <div class="item" v-for="item in list.slice(0,4)" :key="item.id" v-if="dataSel == '热门数据'">
              <img class="imgClass" src="@/assets/images/sanweiimg.png"/>
              <div class="info">
                <p class="head">{{ item.SName }}</p>
                <p class="infoText">联系单位：{{ item.cUnit }}</p>
                <p class="infoText">浏览量：{{ item.recom }}</p>
                <div class="btn" @click="goInfo(item)">查看详情</div>
              </div>
            </div>
            <div class="item" v-for="item in list.slice(0,2)" :key="item.id" v-if="dataSel == '最新数据'">
              <img class="imgClass" src="@/assets/images/sanweiimg.png"/>
              <div class="info">
                <p class="head">{{ item.SName }}</p>
                <p class="infoText">联系单位：{{ item.cUnit }}</p>
                <p class="infoText">浏览量：{{ item.recom }}</p>
                <div class="btn" @click="goInfo(item)">查看详情</div>
              </div>
            </div>
            <div class="item" v-for="item in list.slice(0,3)" :key="item.id" v-if="dataSel == '推荐数据'">
              <img class="imgClass" src="@/assets/images/sanweiimg.png"/>
              <div class="info">
                <p class="head">{{ item.SName }}</p>
                <p class="infoText">联系单位：{{ item.cUnit }}</p>
                <p class="infoText">浏览量：{{ item.recom }}</p>
                <div class="btn" @click="goInfo(item)">查看详情</div>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getRf,getPageList } from '@/api/serveList'
import{ getNewsList } from '@/api/news'
import { encode, decode } from '@/utils/base/dataEncry'
import { hotDataAdd } from '@/api/count.js'

export default {
  data() {
    return {
      activeName: 'first',
      list: [],
      lookearth: [],
      dataSel: '热门数据',
      open: false,
      newlist:[
      ],
      province: [
        '新疆',
        '四川',
        '青海',
        '西藏',
        '台湾',
        '河北',
        '云南',
        '甘肃',
        '内蒙古',
        '江苏',
        '山西',
        '宁夏',
        '广东',
        '河南',
        '重庆',
        '广西',
        '北京',
        '天津',
        '吉林',
        '福建',
        '山东',
        '贵州',
        '辽宁',
        '湖北',
        '浙江',
        '安徽',
        '黑龙江',
        '上海',
        '江西',
        '海南',
        '湖南',
        '陕西',
        '香港',
        '澳门'
      ],
      text: '暂无历史地震信息',
      text2: '暂无动态信息',
      listShow: false,
    }
  },
  props: ['list2'],
  watch:{
    list2(newVal,oldVal){
      // this.sortList()
    }
  },
  mounted() {
    this.getList()
    this.getNewList()
    sessionStorage.setItem('newsText','')
  },
  methods: {
    //列表排序
    sortList() {
      // this.list2.forEach((item,index) => {
      //   for(let i = 0; i<this.list2.length - index; i++){
      //     if(this.list2[i + 1] && this.list2[i].oTime < this.list2[i + 1].oTime){
      //       let temp = null
      //       temp = this.list2[i]
      //       this.list2[i] = this.list2[i + 1]
      //       this.list2[i + 1] = temp
      //     }
      //   }
      // })
    },
    // 格式化日期
   padDate (value) {
    return value < 10 ? '0' + value : value
    },
    DateFormat (value) {
     	// 根据给定的字符串，得到特定的日期
        var date = new Date(value);
        var year = date.getFullYear();
        var month = this.padDate(date.getMonth() + 1);
       	var day = this.padDate(date.getDate());
       	return year + '-' + month + '-' + day;
       	},
 
    // 跳转大震专题
    goEarth() {
      this.$router.push({
        path: '/shikuang/earthtopic'
      })
    },
    getNewList(){
      let par = 'pageNum=1&pageSize=999'
      getNewsList(par).then(res=>{
        this.newlist = [...res.records];
      })
    },
    // 前往震情速递正文
    goEarths(item,type) {
      if(type == 1){
        this.$router.push({
          path: '/shikuang/earthstuation',
          query: {
            id: item,
            type: type
          }
        })
      }
      if(type == 0){
        this.$router.push({
          path: '/shikuang/shikuangHistory',
          query: {
            id: item
          }
        })
        // this.$router.push({
        //   path: '/shikuang/earthstuation',
        //   query: {
        //     id: item,
        //     type: type
        //   }
        // })
      }
    },
    handleClick(tab, event) {
      if (tab.label === '历史今天地震') {
        if (this.lookearth.length === 0) {
            this.text = '今日无历史地震'
            this.listShow = false
          } else {
            this.listShow = true
          }
      }
    },
    goEarthOption(id) {
      this.$router.push({
        path: '/shikuang/earthOption?id=' + id
      })
    },
    more() {
      this.$router.push({path: '/newsMore'})
    },
    getList() {
      this.list = []
      Promise.all([getRf(0),getRf(1)]).then((res) => {
          this.list = res[0].concat(res[1])
        })
        .catch(() => {
          this.text = '暂无数据'
        })
    },
    filterLevel(list) {
      let arr = []
        list.forEach((item) => {
          if(item.placeName.substr(0,3) == '内蒙古' || item.placeName.substr(0,3) == '黑龙江'){
            if(item.m >= 6){
              arr.push(item)
            }
          }else {
            this.province.includes(item.placeName.substr(0,2)) ? item.m>=6? arr.push(item):'' : item.m>=7? arr.push(item):''
          }
        })
        return arr
    },
    getDate() {
      let date = new Date()
      // let year = date.getFullYear()
      let mon = date.getMonth() + 1
      let day = date.getDate()
      let arr = {
        month: mon,
        day: day
      }
      // arr = JSON.stringify(arr)
      return arr
    },
    toUrl(item){
      if(item.url){
        let form = {
            keyName: '新闻动态-'+item.title,
            url: item.url,
          }
        window.open(item.url)
        hotDataAdd(encode(form)).then()
      }else {
        let form = {
            keyName: '新闻动态-'+item.title,
            url: '/newsInfo',
          }
        hotDataAdd(encode(form)).then()
        sessionStorage.setItem('newsText',JSON.stringify(item.newsText))
        this.$router.push({name:'newsInfo'});
      }
    },
    goInfo(item) {
      this.getListApi(item)
    },
    getListApi(item){
      let par = {
        sType: '',
        name: item.SName,
        pageNum: 1,
        pageSize: 1000
      }
      getPageList(par).then(response => {
        let data = null
        if(response.records.length > 1){
          data = response.records.filter(itm=>{return itm.id == item.id})[0]
        }else{
          data = response.records[0]
        }
        sessionStorage.setItem('datas',JSON.stringify(data));
        this.$router.push({name: 'monitorRefuge', params: {type: 0}})
        // this.prodList = response.records
        // alert(JSON.stringify(decode(response)))
      })
    },
    setNum(i) {
      if (i < 10) {
        i = '0' + i
        return i
      } else {
        return i
      }
    },
    settiam(val) {
      let obj = val.split(' ')
      let year = obj[0].split('-')[0]
      let time = obj[1].split(':')
      let mon = time[0]
      let sec = time[1]
      let stry
      if (sec === '00') {
        stry = `${year}年${mon}时`
      } else {
        stry = `${year}年${mon}时${sec}分`
      }

      return stry
    },
    // 查看详情
    viewdetails(e) {
      let item = JSON.parse(e.target.dataset.item)
      this.$store.commit('setearth', item)
      this.$router.push({
        path: '/situation'
      })
    },
    // 查看更多
    getearthquaces(type) {
      if(type == 1){
        this.$router.push({ path:'/shikuang/earthlist'})
      }
      if(type == 2){
        this.$router.push({ path:'/shikuang/listearth', query:{type: 2, data: JSON.stringify(this.lookearth)} })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.profession {
  // background-color: #f2f3f3;
  // width: 100%;
  .container {
    position: relative;
    width: 100%;
    // margin: auto;
    margin-top: -26px;
    // padding-right: 120px;
    // padding: 20px;
    .title {
      width: 100%;
      display: flex;
      padding: 0px 0px 5px 25px;
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 120px;
        height: 30px;
        img {
          width: 30px;
          height: 30px;
          transform: rotateZ(-40deg);
        }
        h3 {
          height: 20px;
          color: #3d4e89;
          font-size: 21px;
        }
      }
    }
    .main {
      height: 415px;
      display: flex;
      padding: 10px;
      // background: url(@/assets/images/img3.png) no-repeat center center;
      // background-size: 100% 100%;
      .left {
        position: relative;
        margin-left: 3%;
        margin-top: -3%;
        font-size: 14px;
        width:1000px;
        color: #464646 !important;
        // background-color: rgba(214, 214, 214, 0.3);
        // border: 1px solid rgb(216, 216, 216);
        // border-radius: 5px;
        /deep/ .el-radio-button__inner {
          border-radius: 0;
        }
        .more {
          font-size: 14px;
          cursor:pointer;
          color:#888888;
          padding-top: 17px;
          padding-right: 10px;
        }
        .more:hover {
          color:#5ca5d8;
        }
        .contant {
          height: 375px;
          overflow-y: auto;
          display: flex;
          flex-wrap: wrap;
          .item {
            display: flex;
            margin-top: 25px;
            .info {
              padding: 0px 15px;
              width: 285px;
              .head {
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
        .imgClass {
          width: 180px;
          height: 150px;
        }
        ul li {
          width: 100%;

          .box {
            text-align: left;
            padding: 6px 10px;
          }
        }
        ul li:hover .box {
          border-radius: 20px;
          background-color: #5ca5d8;
          color: #fff;
          cursor: pointer;
        }
        .el-button {
          position: absolute;
          bottom: 10px;
          right: 0;
        }
      }
      .messagetext {
        width: 500px;
        padding: 100px;
        text-align: center;
      }
      .right {
        background-color: rgba(225, 225, 225, 0.3);
        padding: 5px 18px;
        border-radius: 5px;
        margin-left: 15px;
        color: #464646;
        border: 1px solid rgb(236, 235, 235);
        font-size: 16px;
        .news {
          background-color:rgba(50, 50, 50, 0.2);
          width: 400px;
          height: 270px;
        }
        .new {
          width: 370px;
          height: 165px;
          margin-top: 5px;
          padding: 5px 10px;
          overflow-y: auto;
        .newsItem {
          line-height: 22px;
          vertical-align: middle;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          color: #efefef;
          cursor: pointer;
        }
        .newsItem:hover {
          color: rgb(185, 185, 185);
        }
        /deep/ .el-tabs__item {
          color: #fff !important;
        }
      }
      ul li:hover .earthtext {
          border-radius: 5px;
          color: rgb(0, 88, 196);
          cursor: pointer;
        }
      .earthquake {
        width:500px;
        height: 370px;
        overflow-y: auto;
        color: #464646;
        padding: 15px 15px;
        font-size: 16px;
        .earthtext {
          margin-bottom: 5px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 78%;
          padding: 3px 0px;
          img {
            width: 4px;
            height: 3px;
          }
        }
        .earthtime {
          margin-bottom: 5px; 
          margin-right: 5px; 
          float: right;
          width: 20%;
          padding: 3px 0px; 
        }
      }
      .earthquake::-webkit-scrollbar {
        width: 4px;
      }
      .earthquake::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        opacity: 0.2;
      }
      .earthquake::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
      }
      .hisBtn {
        position: relative;
        width: 80px;
        left: 88%;
        top: -405px;
        font-size: 14px;
        cursor:pointer;
        color:#888888;
      }
      .hisBtn:hover {
        color:#5ca5d8;
      }
    }
  }
}
}
</style>
