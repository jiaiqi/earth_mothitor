<template>
  <div class="profession">
    <div class="container">
      <div class="title">
        <!-- <div class="header">
          <img src="@/assets/images/earth.png" alt="" />
          <h3>大震专题</h3>
        </div> -->
        <div class="header">
          <img src="@/assets/images/earth.png" alt="" />
          <h3>地震动态</h3>
        </div>
      </div>
      <div class="main">
        <!-- <div class="left">
          <ul>
            <li v-for="item in list2.filter((itm) => { return itm.m >= 4.5 }).slice(0,9)" :key="item.id">
              <div class="messagetext" v-if="list2.length == 0">暂无大地震数据</div>
              <div class="box" @click="goEarthOption(item.id)">
                <img src="@/assets/images/withand2.png" alt="" />
                <span><span style="font-size: 14px;">{{ new Date(item.oTime).getFullYear() }}年{{ (new Date(item.oTime).getMonth() + 1) }}月{{ new Date(item.oTime).getDate() }}日</span>
                {{ item.localName }}发生{{ item.m }}级地震</span>
              </div>
            </li>
          </ul>
        </div> -->

          <!-- <el-button style="margin-right:8px" type="primary" size="mini" @click="goEarthOption(list2[0].id)"
            >查看详情</el-button
          > -->
        <div class="right">
          <div class="tab">
            <el-tabs v-model="activeName" @tab-click="handleClick" width="100%">
              <el-tab-pane label="最新地震动态" name="first"></el-tab-pane>
              <el-tab-pane label="历史上的今天" name="second"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="bordy">
            <div class="box1" v-if="activeName === 'first'">
              <div class="messagetext" v-if="list2.length == 0">{{ text2 }}</div>
              <div v-else>
                <!-- <div style="display:flex;"> -->
                <ul class="earthquake">
                  <!-- @click="viewdetails(item)" -->
                  <li v-for="item in list2.slice(0,10)" :key="item.id" @click="goEarths(item.id,1)">
                    <div class="earthtext" style="width:400px" :data-item="JSON.stringify(item)">
                      <img src="@/assets/images/dot.png" alt="" style="margin:4px 8px 4px 0px" />
                      <span
                        :title="(new Date(item.oTime).getMonth() + 1)+'月'+new Date(item.oTime).getDate()+'日'+(item.localName)+'发生'+item.m+'级地震'"
                        :data-item="JSON.stringify(item)"
                      >
                        <span style="font-size:15px;">{{ (new Date(item.oTime).getMonth() + 1) }}月{{ new Date(item.oTime).getDate() }}日</span>
                         {{ (item.localName) }}发生{{ item.m }}级地震</span
                      >
                    </div>
                  </li>
                </ul>
                <!-- <ul class="earthquake">
                  <li v-for="item in list2.slice(10,20)" :key="item.id" @click="goEarths(item.id,1)">
                    <div class="earthtext" :data-item="JSON.stringify(item)">
                      <img src="@/assets/images/dot.png" alt="" style="margin:4px 8px 4px 0px" />
                      <span
                        :title="(new Date(item.oTime).getMonth() + 1)+'月'+new Date(item.oTime).getDate()+'日'+(item.localName)+'发生'+item.m+'级地震'"
                        :data-item="JSON.stringify(item)"
                      >
                        <span style="font-size: 15px;" >
                          {{ (new Date(item.oTime).getMonth() + 1) }}月{{ new Date(item.oTime).getDate() }}日</span>
                         {{ (item.localName) }}发生{{ item.m }}级地震</span
                      >
                    </div>
                  </li>
                </ul>
              </div> -->
                <el-button class="hisBtn" type="primary" size="mini" @click="getearthquaces(1)"
                  >查看更多</el-button
                >
              </div>
            </div>
            <div class="box1" v-if="activeName === 'second'">
              <div class="messagetext" v-if="!listShow">{{ text }}</div>
              <div v-else>
                <div style="display:flex;justify-content: space-around;">
                  <ul class="earthquake">
                    <!-- @click="viewdetails(item)" -->
                    <li v-for="item in lookearth.slice(0,10)" :key="item.id" @click="goEarths(item.id,0)">
                      <div class="earthtext" style="width:400px" :data-item="JSON.stringify(item)">
                        <img src="@/assets/images/dot.png" alt="" style="margin:4px 8px 4px 0px" />
                        <span
                          :title="item.year+'年'+item.month+'月'+item.day+'日'+(item.placeName)+'发生'+item.m+'级地震'"
                          :data-item="JSON.stringify(item)"
                        >
                        <span style="font-size: 15px;">{{ (item.year) }}年{{ item.month }}月{{ item.day }}日</span>
                          {{ (item.placeName) }}发生{{ item.m }}级地震</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <el-button class="hisBtn" type="primary" size="mini" @click="getearthquaces(2)"
                  >查看更多</el-button
                >
              </div>
            </div>
          </div>
        </div>
        <div class="left">
          <el-dialog :visible.sync="open" width="58%">
            <div class="contant" style="height: 500px;">
              <div class="item" v-for="item in list3" :key="item.id">
                <img class="imgClass" v-if="item.smallImg" :src="item.smallImg"/>
                <img class="imgClass" v-else src="@/assets/images/catalogue.png"/>
                <div class="info">
                  <p class="head">{{ item.keyName }}</p>
                  <p class="infoText">浏览量：{{ item.hotNum }}</p>
                  <div class="btn" @click="goInfo(item)">查看详情</div>
                </div>
              </div>
            </div>
          </el-dialog>
          <div style="border-bottom: 2px solid #409EFF;display: flex;justify-content: space-between;">
            <el-radio-group v-model="dataSel">
              <el-radio-button label="点击排行"><span @mouseenter="dataSel='点击排行'" style="font-size:16px">点击排行</span></el-radio-button>
              <el-radio-button label="最新推荐"><span @mouseenter="dataSel='最新推荐'" style="font-size:16px">最新推荐</span></el-radio-button>
              <el-radio-button label="推荐数据"><span @mouseenter="dataSel='推荐数据'" style="font-size:16px">推荐数据</span></el-radio-button>
            </el-radio-group>
            <div class="more" @click="toMore(dataSel)">更多<i style="width: 7px" class="el-icon-arrow-right"></i><i class="el-icon-arrow-right"></i></div>
          </div>
          <div class="contant">
            <div class="item" v-for="item in list3" :key="item.id" v-if="dataSel == '点击排行'">
              <img class="imgClass" v-if="item.smallImg" :src="item.smallImg"/>
              <img class="imgClass" v-else src="@/assets/images/catalogue.png"/>
              <div class="info">
                <p class="head" :title="item.keyName">{{ item.keyName }}</p>
                <!-- <p class="infoText" v-if="item.linkUnit">联系单位：{{ item.linkUnit }}</p> -->
                <p class="infoText">浏览量：{{ item.hotNum }}</p>
                <div class="btn" @click="goInfo(item)">查看详情</div>
              </div>
            </div>
            <div class="item" v-for="item in list4" :key="item.id" v-if="dataSel == '最新推荐'">
              <img class="imgClass" v-if="item.smallImg" :src="item.smallImg"/>
              <img class="imgClass" v-else src="@/assets/images/catalogue.png"/>
              <div class="info">
                <p class="head" :title="item.keyName">{{ item.keyName }}</p>
                <!-- <p class="infoText">联系单位：{{ item.cUnit }}</p> -->
                <p class="infoText">浏览量：{{ item.hotNum }}</p>
                <div class="btn" @click="goInfo(item)">查看详情</div>
              </div>
            </div>
            <div class="item" v-for="item in list5" :key="item.id" v-if="dataSel == '推荐数据'">
              <img class="imgClass" v-if="item.smallImg" :src="item.smallImg"/>
              <img class="imgClass" v-else src="@/assets/images/catalogue.png"/>
              <div class="info">
                <p class="head" :title="item.keyName">{{ item.keyName }}</p>
                <!-- <p class="infoText" v-if="item.linkUnit">联系单位：{{ item.linkUnit }}</p> -->
                <p class="infoText">浏览量：{{ item.hotNum }}</p>
                <div class="btn" @click="goInfo(item)">查看详情</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRf,getPageList } from '@/api/serveList'
import { getList, getList2 } from '@/api/catalogue'
import { getFlagList } from '@/api/count'
export default {
  data() {
    return {
      activeName: 'first',
      list: [],
      open: false,
      list3: [
        {
          SName: '地震震级的规定',
          cUnit: '国家标准全文公开系统',
          url: '/knowledge/statute',
          img: require('@/assets/images/news_10.png')
        },
        {
          SName: '鄂尔多斯地块及周缘GNSS水平运动速度场图像',
          cUnit: '中国地震局第二监测中心',
          url: '/monitor/productlist',
          img: require('@/assets/images/news_11.jpg')
        },
        {
          SName: '历史测震模拟资料',
          cUnit: '中国地震局第二监测中心',
          url: 'https://data.earthquake.cn/datashare/report.shtml?PAGEID=datasourcelist&dt=ff80808272f672190172f67219750000',
          img: require('@/assets/images/news_4.png')
        },
        {
          SName: '大地天文测量',
          cUnit: '中国地震局第二监测中心',
          url: 'https://data.earthquake.cn/datashare/report.shtml?PAGEID=datasourcelist&dt=40280d0453e5add30153e602bee1002f',
          img: require('@/assets/images/news_2.jpg')
        },
        {
          SName: '地震区划与安全性评价（一代区划图）',
          cUnit: '中国地震台网中心',
          url: 'https://data.earthquake.cn/datashare/report.shtml?PAGEID=datasourcelist&dt=8a85efd754e1c4280154e1e589850005',
          img: require('@/assets/images/news_3.png')
        },
        {
          SName: '“谛听”人工智能地震学训练数据集',
          cUnit: '北京白家疃地球科学国家野外科学观测研究站',
          url: 'https://data.earthquake.cn/datashare/report.shtml?PAGEID=datasourcelist&dt=ff8080827e3317f4017e331e7ce00002',
          img: require('@/assets/images/news_1.png')
        },
      ],
      list4: [
        {
          SName: '文物减隔震技术服务（减隔震装置与方案设计）',
          cUnit: '中国地震局工程力学研究所',
          url: '/monitor/productlist',
          img: require('@/assets/images/news_14.png')
        },
        {
          SName: '小小传感器问电磁波：你是说，地震要来了吗？！',
          cUnit: '中国科学院遥感与数字地球研究所',
          url: '/knowledge/science',
          img: require('@/assets/images/news_15.png')
        },
        {
          SName: '人工地震探测解释成果数据',
          cUnit: '中国地震局地球物理勘探中心',
          url: 'https://data.earthquake.cn/datashare/report.shtml?PAGEID=datasourcelist&dt=40280d0453e5add30153e5f7567f0026',
          img: require('@/assets/images/news_7.jpg')
        },
        {
          SName: '人工地震探测剖面点位信息',
          cUnit: '中国地震局地球物理勘探中心',
          url: 'https://data.earthquake.cn/datashare/report.shtml?PAGEID=datasourcelist&dt=40280d0453e5add30153e5f414e50024',
          img: require('@/assets/images/news_8.png')
        },
        {
          SName: '重点地区断裂数据',
          cUnit: '中国地震局地震预测研究所',
          url: 'https://data.earthquake.cn/datashare/report.shtml?PAGEID=datasourcelist&dt=ff8080826e16801d016eb1acef6e000f',
          img: require('@/assets/images/news_8.png')
        }
      ],
      list5: [
        {
          SName: '历史上的今天',
          cUnit: '公服平台',
          url: '/shikuang/shikuangHistory',
          img: require('@/assets/images/news_12.png')
        },
        {
          SName: '全球7级以上地震目录',
          cUnit: '中国地震台网',
          url: '/monitor/prodAchevList',
          img: require('@/assets/images/news_13.png')
        },
        {
          SName: '工程震害数据',
          cUnit: '强震动数据中心',
          url: 'https://data.earthquake.cn/datashare/report.shtml?PAGEID=datasourcelist&dt=40280d0453e5add30153e5e9f72b001d',
          img: require('@/assets/images/news_5.jpg')
        },
        {
          SName: '跨断层场地测距',
          cUnit: '中国地震局第二监测中心',
          url: 'https://data.earthquake.cn/datashare/report.shtml?PAGEID=datasourcelist&dt=4028ab1a53e6ed190153e701819f0004',
          img: require('@/assets/images/news_6.png')
        },
        {
          SName: '中国历史地震目录',
          cUnit: '中国地震台网中心',
          url: 'https://data.earthquake.cn/datashare/report.shtml?PAGEID=datasourcelist&dt=8a85efd754e7d6910154e7d691810000',
          img: require('@/assets/images/news_7.jpg')
        }
      ],
      lookearth: [],
      dataSel: '点击排行',
      newlist:[
        {
          title: '国家级高温橙色、强对流蓝色预警气象服务快报服务快报服务快报',
          url: 'http://data.cma.cn/site/serviceLetter/id/285.html'
        },
        {
          title: '台风“尼格”专题气象数据服务快报',
          url: 'http://data.cma.cn/site/serviceLetter/id/314.html'
        },
        {
          title: '四川泸定6.8级地震气象服务快报',
          url: 'http://data.cma.cn/site/serviceLetter/id/304.html'
        },
        {
          title: '台风“轩岚诺”专题气象服务快报',
          url: 'http://data.cma.cn/site/serviceLetter/id/302.html'
        },
        {
          title: '四川彭州山洪气象服务快报',
          url: 'http://data.cma.cn/site/serviceLetter/id/294.html'
        }
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
      text2: '数据加载中...',
      listShow: false,
    }
  },
  props: ['list2'],
  watch:{
    list2(newVal,oldVal){
      this.sortList()
    }
  },
  mounted() {
    this.getList()
    this.getList2()
  },
  methods: {
    //列表排序
    sortList() {
      this.list2.forEach((item,index) => {
        for(let i = 0; i<this.list2.length - index; i++){
          if(this.list2[i + 1] && this.list2[i].oTime < this.list2[i + 1].oTime){
            let temp = null
            temp = this.list2[i]
            this.list2[i] = this.list2[i + 1]
            this.list2[i + 1] = temp
          }
        }
      })
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
    // 跳转大震专题
    goEarth() {
      this.$router.push({
        path: '/shikuang/earthtopic'
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
    toMore(par){
      if(par == '点击排行'){
        this.$router.push({path:'/hotMore',query:{type:'1'}})
      }
      if(par == '最新推荐'){
        this.$router.push({path:'/hotMore',query:{type:'2'}})
      }
      if(par == '推荐数据'){
        this.$router.push({path:'/hotMore',query:{type:'3'}})
      }
    },
    handleClick(tab, event) {
      if (tab.label === '历史上的今天') {
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
    getList2() {
      // this.list3 = []
      // Promise.all([getRf(0),getRf(1)]).then((res) => {
      //     this.list3 = res[0].concat(res[1])
      //   })
      //   .catch(() => {
      //     this.text = '暂无数据'
      //   })
      setTimeout(() => {
        this.text2 = "网络链接失败，稍后重试"
      }, 3000);
    },
    getList() {
      const date = new Date();
      const pageNum = 1;
      const pageSize = 999;
      let month = date.getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      getList(pageNum, pageSize, month, date.getDate())
        .then((res) => {
          let list = res.records
          this.lookearth = this.filterLevel(list)
          this.earthquakeList = this.filterLevel(list)
          localStorage.setItem('history',JSON.stringify(this.filterLevel(list)))
        })
        .catch(() => {
          this.text = '今日无历史地震'
        })
      getFlagList('pageNum=1&pageSize=10').then(res=>{
        let data = res.records
        this.list3 = data
      })
      getFlagList('pageNum=1&pageSize=10&key=d').then(res=>{
        let data = res.records
        this.list5 = data
      })
      getFlagList('pageNum=1&pageSize=10&key=date').then(res=>{
        let data = res.records
        this.list4 = data
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
        this.$router.push({ path:'/shikuang/listearth', query:{type: 2, data: new Date().toLocaleDateString()} })
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
    // padding: 20px;
    .title {
      width: 100%;
      display: flex;
      padding: 0px 0px 5px 10px;
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
      height: 395px;
      display: flex;
      padding: 10px;
      // background: url(@/assets/images/img3.png) no-repeat center center;
      // background-size: 100% 100%;
      .left {
        position: relative;
        margin-left: 3%;
        margin-top: -3%;
        font-size: 14px;
        width:875px;
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
          // display: flex;
          // flex-wrap: wrap;
          .item {
            display: flex;
            margin-top: 32px;
            .info {
              padding: 0px 15px;
              .head {
                width: 430px;
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
        width: 430px;
      }
      .right {
        // margin-left: 5%;
        background-color: rgba(225, 225, 225, 0.3);
        padding: 5px 18px;
        border-radius: 5px;
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
        height: 295px;
        width: 100%;
        overflow-y: auto;
        color: #464646;
        padding: 0px 15px;
        font-size: 15px;
        .earthtext {
          margin-bottom: 5px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 280px;
          padding: 2px 0px;
          img {
            width: 4px;
            height: 3px;
          }
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
        left: 75%;
        top: -345px;
        font-size: 14px;
      }
    }
  }
}
}
</style>
