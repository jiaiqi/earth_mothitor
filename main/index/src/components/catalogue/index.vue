<template>
  <div class="catalogue">
    <div class="main dif">

      <div class="box">
        <div class="left dif" style="margin-left: -5%;">
          <div class="header" style="margin-right: 25%;margin-top: -42px;margin-bottom: 14px;">
            <img src="@/assets/images/diqiu.png" width="27px" alt="" />
            <p style="font-size: 21px;" >数据目录</p>
          </div>
          <div class="leftcata"
               @mousemove="mousemove"
               @mouseleave="mouseleave"
          >
          <dl>
            <dt class="Typetitle">按业务类型分类</dt>
            <dd
              class="type"
              v-for="(item, index) in business"
              :key="index"
            >
              {{ item }}
            </dd>
          </dl>
          <dl>
            <dt class="Typetitle">按单位属性分类</dt>
            <dd
              class="type"
              v-for="(item, index) in unit"
              :key="index"
            >
              {{ item }}
            </dd>
          </dl>
          <dl>
            <dt class="Typetitle">按涉密类型分类</dt>
            <dd class="type"
             v-for="(item, index) in related" :key="index">{{ item }}</dd>
          </dl>
          </div>
        </div>
        <!-- <div class="content" :style="{'backgroundImage': `url(${bgUrl})`}"> -->
          <div class="content">
            <el-carousel trigger="click" height="399px">
              <el-carousel-item v-for="(item,index) in cataImgList" :key="index">
                <div class="swiperBg" :style="{'backgroundImage': `url(${item.img})`}">
                  <div class="imgTitle" v-if="!showList" >
                    {{item.name}}
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          <div class="list hide" style=" margin-left: 0px;"
              @mousemove="mousemove"
              @mouseleave="mouseleave">
            <h3><i class="el-icon-s-data pad"></i>{{ title }}</h3>
            <div class="itemText">

<!--              改为不跳转-->
<!--              <span v-if="!showchild" v-for="(item, index) in list" @click="toPath(item)" :key="index">{{ item }}</span>
              <span v-if="showchild" v-for="item in childList" @click="toUrl(item)" :key="item.id">{{ item.unit }}</span>-->


              <span v-if="!showchild" v-for="(item, index) in list"  :key="index">{{ item }}</span>
              <span v-if="showchild" v-for="item in childList"  :key="item.id">{{ item.unit }}</span>
            </div>
          </div>
        </div>
        <!-- <div class="right">
          <div class="header" style="margin-left: -37%">
            <img src="@/assets/images/hand.png" width="27px" alt="" />
            <p style="font-size: 20px">产品技术服务</p>
            <p class="more" @click="more('productlist',1)">更多</p>
          </div>
          <div class="productSer">
            <div style="display:flex;flex-direction:column">
              <img class="productSerImg" :src="newImages[0]" />
              <img class="productSerImg" :src="newImages[1]" />
            </div>
            <div class="products">
              <div
                class="productItem"
                v-for="item in theclist"
                @click="goPath(item)"
              >
                <span style="font-size: 32px; position: relative; top: 6px"
                  >·</span
                >
                {{ item.SName }}
                <span class="year">{{ getyear(item.cDate) }}</span>
              </div>
              <div
                class="productItem"
                v-for="item in prolist"
                @click="goPath(item)"
              >
                <span style="font-size: 32px; position: relative; top: 6px"
                  >·</span
                >
                {{ item.SName }}
                <span class="year">{{ getyear(item.cDate) }}</span>
              </div>
              <div v-if="(prolist.length<1)" class="no-data">暂无数据</div>
            </div>
          </div>
        </div> -->

          <!-- <div class="header" style="margin-left: -47%; margin-top: 15px">
            <img src="@/assets/images/hand.png" width="27px" alt="" />
            <p style="font-size: 17px">技术服务</p>
            <p class="more" @click="more('productlist',1)">更多</p>
          </div>
          <div class="productSer">
            <div>
              <img class="productSerImg" :src="newImages[1]" />
            </div>
            <div class="products">
              <div
                class="productItem"
                v-for="item in theclist"
                @click="goPath(item)"
              >
                <span style="font-size: 32px; position: relative; top: 6px"
                  >·</span
                >
                {{ item.SName }}
                <span class="year">{{ getyear(item.cDate) }}</span>
              </div>
              <div v-if="(theclist.length<1)" class="no-data">暂无数据</div>
            </div>
          </div> -->
        <!-- <div class="right" style="margin-left:30px">
          <div class="header" style="margin-left:-120px;margin-top: -35px;">
            <img src="@/assets/images/info.png" width="30px" alt="" />
            <p style="font-size:18px">社会力量</p>
          </div>
          <div class="strongItem">
            <div class="row">
              <div class="rowItem"><i class="el-icon-user-solid big"></i>投标人</div>
              <div class="rowItem"><i class="el-icon-s-custom big"></i>专家</div>
              <div class="rowItem"><i class="el-icon-user big"></i>招标代理</div>
            </div>
            <div class="row">
              <div class="rowItem"><i class="el-icon-s-custom big"></i>招标人</div>
              <div class="rowItem"><i class="el-icon-user big"></i>监督人</div>
              <div class="rowItem"><i class="el-icon-user big"></i>造价用户</div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
// import { decode } from '@/utils/base/dataEncry'
import { getList } from '@/api/catalogue'
import { getRf } from '@/api/serveList'
import { childSpotList } from '@/api/chat'
import { encode,decode } from '@/utils/base/dataEncry';
import { getDataNumber, getGNSSDataNumber, getUpderFluidNumber, getStrongNumber, getCataDataNumber } from '@/api/seisserver'

export default {
  data() {
    return {
      business: ['地震监测', '震害防御', '科技创新'],
      unit: ['业务中心', '省地震局', '研究所', '企业院校'],
      related: ['涉密地震数据', '非涉密地震数据'],
      activeName: 'first',
      title: '',
      list: [],
      title1: '',
      list1: [],
      showchild: false,
      newImages:[require('@/assets/images/news1.jpg'),require('@/assets/images/news2.jpg')],
      prolist: [],
      theclist: [],
      showList: false,
      cataImgList: [
        {
          name: '5月12日全国防灾减灾日',
          img: require('@/assets/images/bg1.png')
        },
        {
          name: '“地震科普 携手同行”主题活动',
          img: require('@/assets/images/bg2.png')
        },
        {
          name: '新疆乌什7.1级地震仪器地震烈度图',
          img: require('@/assets/images/bg3.png')
        }
      ],
      monit: [
        '测震数据(321851)',
        '强震动观测数据',
        '定点形变(1296)',
        '地下流体',
        '电磁(781)',
        '重力(129)',
        'GNSS',
        '科学台阵',
      ],
      prevention: [
        '地震测深数据(25)',
        '活断层探测数据(3300)',
      ],
      center: [
        '中国地震台网中心;/service/seismometry',
        '中国地震灾害防御中心;/service/catalogue?type=1',
        '发展研究中心;/service/seismometry',
        '地球物理勘探中心;/service/catalogue?type=1',
        '第一监测中心;/service/catalogue?type=1',
        '第二监测中心;/service/seismometry',
      ],
      city: [
        '北京;/precursor/fluid',
        '天津;/precursor/fluid',
        '河北;/precursor/fluid',
        '山西;/precursor/fluid',
        '内蒙古;/precursor/fluid',
        '辽宁;/precursor/gnss',
        '吉林;/precursor/gnss',
        '黑龙江;/precursor/gnss',
        '上海;/precursor/gnss',
        '江苏;/precursor/gnss',
        '浙江;/precursor/gnss',
        '安徽;/precursor/gnss',
        '福建;/precursor/gnss',
        '江西;/precursor/gnss',
        '山东;/precursor/gnss',
        '河南;/precursor/gnss',
        '湖北;/precursor/gnss',
        '湖南;/precursor/fluid',
        '广东;/precursor/fluid',
        '广西;/precursor/fluid',
        '海南;/precursor/fluid',
        '重庆;/precursor/fluid',
        '四川;/precursor/fluid',
        '贵州;/precursor/fluid',
        '云南;/precursor/fluid',
        '西藏;/precursor/fluid',
        '陕西;/precursor/fluid',
        '甘肃;/precursor/fluid',
        '青海;/precursor/fluid',
        '宁夏;/precursor/fluid',
        '新疆;/precursor/fluid'
      ],
      university: [
        '防灾科技学院;https://www.cidp.edu.cn/',
        '深圳防灾减灾技术研究院;https://www.szadpr.cn/'
      ],
      study: [
        '地球物理研究所;/precursor/fluid',
        '地质研究所;/precursor/fluid',
        '地震预测研究所;/precursor/fluid',
        '工程力学研究所;/precursor/fluid',
      ],
      teche: [
        '科学台阵(69236)',
        '强震动观测数据(32000)',
      ],
      secret: [
        '电磁',
        '重力',
      ],
      unsecret: [
        '测震数据',
        '强震动观测数据',
        '定点形变',
        '流体',
        'GNSS',
        '科学台阵',
        '地震测深数据',
        '活断层探测数据',
      ],
      // 存储历史地震信息
      earthquakeList: [],
      //子站
      childList: [],
      // 展示的地震信息
      lookearth: [],
      listShow: true,
      // 历史地震为空时
      text: ''
    }
  },
  created() {},

  mounted() {
    this.getProdList(0);
    this.getProdList(1);
    this.getChild()
  },

  methods: {
    // 鼠标移入
    mousemove(e) {
      this.showList = true
      let box = document.querySelector('.content .list')
      if (e.target.innerText === '地震监测') {
        this.title = e.target.innerText
        this.list = this.monit
        // this.list2 = this.prevention
        this.title2 = '地震监测'
        this.showchild = false
      }
      if (e.target.innerText === '震害防御') {
        this.title = '震害防御'
        this.list = this.prevention
        this.title2 = e.target.innerText
        this.showchild = false
        // this.list2 = this.prevention
      }
      if (e.target.innerText === '科技创新') {
        this.title = '科技创新'
        this.list = this.teche
        this.title2 = e.target.innerText
        this.showchild = false
      }
      if (e.target.innerText === '省地震局') {
        this.title = e.target.innerText
        this.showchild = true
      }
      if (e.target.innerText === '业务中心') {
        this.title = e.target.innerText
        let list = this.center.map(item=>{
          return item.split(';')[0]
        })
        this.list = list
        this.showchild = false
      }
      if (e.target.innerText === '研究所') {
        this.title = e.target.innerText
        let list = this.study.map(item=>{
          return item.split(';')[0]
        })
        this.list = list
        this.showchild = false
      }
      if (e.target.innerText === '企业院校') {
        this.title = e.target.innerText
        let list = this.university.map(item=>{
          return item.split(';')[0]
        })
        this.list = list
        this.showchild = false
      }
      if (e.target.innerText === '涉密地震数据') {
        this.title = e.target.innerText
        this.list = this.secret
        this.showchild = false
      }
      if (e.target.innerText === '非涉密地震数据') {
        this.title = e.target.innerText
        this.list = this.unsecret
        this.showchild = false
      }
      this.showList = true
      box.classList.remove('hide')
    },
    mousemove2() {
      this.showList = true
      let box = document.querySelector('.content .list')
      box.classList.remove('hide')
    },
    more(name,type) {
      this.$router.push({name: name})
    },
    //省级单位
    getChild() {
      childSpotList(encode({pageNum: 1,pageSize: 50})).then(res=>{
        this.childList = [...res.records]
      })
    },
    //将时间戳转换成年份
    getyear(time) {
      let date = new Date(time)
      return date.getFullYear();
    },
    //服务跳转
    goPath(data) {
      sessionStorage.setItem('datas',JSON.stringify(data));
      this.$router.push({name: 'monitorRefuge'})
    },
    toPath(name) {
      if(name.indexOf('测震数据') != -1){
        this.$router.push({ name: 'serviceSeismometry' })
        return
      }
      if(name.indexOf('强震动观测数据') != -1){
        this.$router.push({ name: 'serviceCatalogue' })
        return
      }
      if(name.indexOf('定点形变') != -1){
        this.$router.push({ name: 'precursorCrust' })
        return
      }
      if(name.indexOf('流动形变') != -1){
        this.$router.push({ name: 'precursorFlowMation' })
        return
      }
      if(name.indexOf('流体') != -1){
        this.$router.push({ name: 'precursorFluid' })
        return
      }
      if(name.indexOf('电磁') != -1){
        this.$router.push({ name: 'precursorElectromagnetism' })
        return
      }
      if(name.indexOf('重力') != -1){
        this.$router.push({ name: 'precursorGravity' })
        return
      }
      if(name.indexOf('GNSS') != -1){
        this.$router.push({ name: 'precursorGnss' })
        return
      }
      if(name.indexOf('科学台阵') != -1){
        this.$router.push({ name: 'serviceScientific' })
        return
      }
      if(name.indexOf('模拟资料') != -1){
        this.$router.push({ name: 'serviceSimulation' })
        return
      }
      if(name.indexOf('地震测深数据') != -1){
        this.$router.push({ name: 'precursorProspecting' })
        return
      }
      if(name.indexOf('活断层探测数据') != -1){
        this.$router.push({ name: 'precursorCatalogue' })
        return
      }
      this.city.map(item=>{
        if(item.indexOf(name) != -1) {
          window.open(item.split(';')[1])
        }
      })
      this.center.map(item=>{
        if(item.indexOf(name) != -1) {
          this.$router.push(item.split(';')[1])
        }
      })
      this.study.map(item=>{
        if(item.indexOf(name) != -1) {
          this.$router.push(item.split(';')[1])
        }
      })
      this.university.map(item=>{
        if(item.indexOf(name) != -1) {
          window.open(item.split(';')[1])
        }
      })
    },
    toUrl(item){
        sessionStorage.setItem('province',item.rtf1)
        this.$router.push({name:'secondHome',params:{name:item.rtf1}});
    },
    getProdList(type) {
      getRf(type)
        .then((res) => {
          if(type == 0) {
            this.prolist = res
          }else {
            this.theclist = res
          }
        })
      getDataNumber({}).then(res=>{
        if(typeof res == 'number'){
          this.monit[0] = '测震数据('+res+')'
        }
      })
      getGNSSDataNumber({}).then(res=>{
        if(typeof res == 'number'){
          this.monit[6] = 'GNSS('+res+')'
        }
      })
      getUpderFluidNumber({}).then(res=>{
        if(typeof res == 'number'){
          this.monit[3] = '地下流体('+res+')'
        }
      })
      getStrongNumber({}).then(res=>{
        if(typeof res == 'number'){
          this.monit[1] = '强震动观测数据('+res+')'
          this.teche[1] = '强震动观测数据('+res+')'
        }
      })
      getCataDataNumber({}).then(res=>{
        if(typeof res == 'number'){
          this.monit[7] = '科学台阵('+res+')'
          this.teche[0] = '科学台阵('+res+')'
        }
      })
    },
    // 鼠标移出
    mouseleave() {
      // this.title = ''
      this.showList = false
      let box = document.querySelector('.content .list')
      box.classList.add('hide')
    },
    handleClick(tab, event) {
      if (tab.label === '历史地震动态') {
        this.getList()
      }
    },
    // 获取数据
    getList() {
      const date = new Date();
      const pageNum = 1;
      const pageSize = 1;
      getList(pageNum, pageSize, date.getMonth(), date.getDay())
        .then((res) => {
          let list = res.rows
          if (list.length === 0) {
            this.text = '今日无历史地震'
            this.listShow = false
          } else {
            // this.listShow = true
            // this.lookearth = list.slice(0, 10)
            // this.earthquakeList = list
          }
        })
        .catch(() => {
          this.text = '今日无历史地震'
        })
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
    viewdetails(e) {
      let item = JSON.parse(e.target.dataset.item)
      this.$store.commit('setearth', item)
      this.$router.push({
        path: '/situation'
      })
    },
    // 查看更多
    getearthquaces() {}
  }
}
</script>

<style lang="less" scoped>
.catalogue {
}
.big {
  text-align: center;
  color: #3c62b9;
  font-size: 37px;
}
.header {
  margin-left: 50px;
  min-width: 120px;
  background-color: #fff;
  display: flex;
  align-items: center;
  p {
    margin-left: 5px;
    font-weight: 700;
    font-size: 22px;
    color: rgb(61, 78, 137);
  }
  .more {
    font-size: 13px;
    color: rgb(131, 131, 131);
    font-weight: normal;
    position: relative;
    top: 3px;
    left: 0%;
    cursor: pointer;
  }
  .more:hover {
    font-weight: bold;
  }
}
.main {
  width: 100%;
  .box {
    margin-left:10px;
    // margin-left: -320px;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .left,
  .right {
    width: 27%;
    .productSer {
      width: 100%;
      height: 370px;
      margin-left: 150px;
      margin-top: 15px;
      padding: 5px 10px;
      background-color: rgb(232, 232, 232);
      overflow-y: auto;
      display: flex;
      .products {
        margin-left: 10px;
        overflow-y: auto;
        padding-top: 20px;
        .no-data {
          margin: 25px 30px;
          font-size: 15px;
          color: rgb(85, 85, 85)
        }
      }
      .productSerImg {
        margin-top: 33px;
        width: 185px;
        height: 130px;
      }
      .productItem {
        width: 100%;
        line-height: 22px;
        vertical-align: middle;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .year {
          color: #707175;
          font-size: 11px;
        }
      }
      .productItem:hover {
        color: rgb(118, 118, 118);
      }
    }
    .strongItem {
      width: 246px;
      height: 300px;
      padding: 10px 10px;
      margin-left: 0px;
      display: flex;
      flex-direction: column;
      align-content: space-between;
      .row {
        width: 100%;
        height: 75px;
        display: flex;
        justify-content: space-between;
        .rowItem {
          display: flex;
          flex-direction: column;
          background-color: rgb(234, 234, 234);
          padding: 8px 0px;
          width: 70px;
          height: 70px;
          text-align: center;
          border-radius: 3px;
          font-size: 12px;
          cursor: pointer;
        }
        .rowItem:hover {
          font-weight: bold;
          background-color: rgb(240, 240, 240);
        }
      }
    }
  }
  .left {
    align-items: flex-end;
    justify-content: space-evenly;
    .leftcata {
      box-shadow: 1px 1px 7px rgb(150 150 150 / 65%);
    }
    .Typetitle {
      font-size: 16px;
      line-height: 40px;
    }
    .type {
      font-size: 15px;
    }
    .type:hover {
      font-weight: bold;
    }
    dl {
      cursor: pointer;
      padding: 10px 30px;
      text-align: center;
      line-height: 200%;
      font-size: 12px;
      border-bottom: 1px solid #d8d8d8;
    }
    dt {
      font-weight: 700;
    }
    dd {
      color: #333;
    }
    dl:hover {
      background-color: skyblue;
    }
  }
  .content {
    width: 600px;
    height: 395px;
    // background: url(@/assets/images/catalogue.png) no-repeat center;
    // background-position: center;
    // background-repeat: no-repeat;
    // background-size: 100%;
    box-shadow: 1px 1px 7px rgb(150 150 150 / 65%);
    .swiperBg {
      width: 100%;
      height: 432px;
      margin-top: -28px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
    .imgTitle {
      width: 100%;
      height: 45px;
      position: relative;
      top: 88%;
      padding: 0px 10px;
      color: #fff;
      line-height: 45px;
      text-align: center;
      vertical-align: middle;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .itemText::-webkit-scrollbar {/*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      }
      .itemText::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 2px;
        -webkit-box-shadow: inset 0 0 5px rgba(214, 214, 214, 0.2);
        background: #acacac;
      }
      .itemText::-webkit-scrollbar-track {/*滚动条里面轨道*/
        border-radius: 2px;
        background: #EDEDED;
      }
    .list {
      width: 100%;
      height: 100%;
      padding: 15px 20px;
      margin-left: -5px;
      position: relative;
      top: -395px;
      z-index: 5;
      background: url(@/assets/images/beij.png) no-repeat center;
      background-size: 100% 100%;
      color: #333;
      .itemText {
        width: 580px;
        overflow-y: auto;
        display: flex;
        justify-content: space-between;
      }
      .pad {
        padding: 0px 5px;
        color: #5ca5d8;
      }
      div {
        max-height: 300px;
        margin-top: 20px;
        display: flex;
        flex-flow: wrap;
        span {
          width: 260px;
          text-align: center;
          margin-right: 20px;
          padding: 7px 20px;
          background-color: #f0f3fd;
          margin-bottom: 10px;
          font-size: 16px;
          cursor: pointer;
        }
        span:hover {
          background-color: #a5c8fe;
          color: #1216f7;
        }
      }
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -40px;
    margin-left: 10px;
    .bordy {
      width: 100%;
      flex: 1;
      padding: 0 10px;
      .messagetext {
        text-align: center;
      }
      .earthquake {
        position: relative;
        flex: 1;
        font-size: 14px;
        padding: 3px;
        height: 280px;
        color: #707175;
        ul li {
          width: 100%;

          .earthtext {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            line-height: 100%;
            // text-align: center;
            padding: 0 5px;
            margin-bottom: 5px;
            font-size: 10px;
            img {
              height: 20px;
              width: 20px;
              transform: rotateZ(90deg);
              float: left;
            }
          }
        }
        ul li:hover .earthtext {
          width: 100%;
          border-radius: 10px;
          background-color: #5ca5d8;
          color: #fff;
          cursor: pointer;
        }
        .el-button {
          position: absolute;
          bottom: 0px;
          right: -30px;
        }
      }
    }
    /deep/.el-tabs__header {
      margin-bottom: 5px;
    }
  }
}
.dif {
  display: flex;
  flex-direction: column;
}
.hide {
  display: none;
}
/deep/.el-tabs__nav-wrap::after {
  content: '';
  height: 0px;
}
</style>
