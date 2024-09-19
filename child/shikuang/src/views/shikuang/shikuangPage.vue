<template>
  <div class="shikuang">
    <div class="topNav">
      <topNav :pageName="' / 地震信息'"></topNav>
    </div>
    <el-container>
      <el-header>
          <div class="header">
            <div class="headerRow">
              <span style="font-size: 15px;line-height: 33px;width: 80px;">按时间：</span>
              <el-radio-group v-model="selTime" @change="sel" size="small">
                <el-radio-button :label="1">最近24小时内</el-radio-button>
                <el-radio-button :label="2">最近48小时内</el-radio-button>
                <el-radio-button :label="3">最近7天内</el-radio-button>
                <el-radio-button :label="4">最近30天内</el-radio-button>
                <el-radio-button :label="5">最近一年内</el-radio-button>
              </el-radio-group>
              <span style="font-size: 15px;line-height: 33px;width: 130px;padding-left: 50px;">按震级：</span>
              <el-radio-group v-model="selDg" @change="sel" size="small">
                <el-radio-button :label="6">6.0级以上地震</el-radio-button>
                <el-radio-button :label="5">5.0级以上地震</el-radio-button>
                <el-radio-button :label="6">4.0级以上地震</el-radio-button>
                <el-radio-button :label="4">3.0级以上地震</el-radio-button>
                <el-radio-button :label="1">3.0级以下地震</el-radio-button>
              </el-radio-group>
              <el-button @click="reSet" size="mini" style="margin-left:20px;height: 30px;">重置</el-button>
              <!-- <ul class="byTime">
                <li class="item" ref="1" @click="sel(1)">最近24小时内</li>
                <li class="item" ref="2" @click="sel(2)">最近48小时内</li>
                <li class="item" ref="3" @click="sel(3)">最近7天内</li>
                <li class="item" ref="4" @click="sel(4)">最近30天内</li>
                <li class="item" ref="5" @click="sel(5)">最近一年内</li>
              </ul> -->
            </div>
            <!-- <div class="headerRow" style="border-top:0px">
              <ul class="byTime">
                <li class="item" ref="6" @click="sel(6)">6.0级以上地震</li>
                <li class="item" ref="7" @click="sel(7)">5.0级以上地震</li>
                <li class="item" ref="8" @click="sel(8)">4.0级以上地震</li>
                <li class="item" ref="9" @click="sel(9)">3.0级以上地震</li>
                <li class="item" ref="10" @click="sel(10)">3.0级以下地震</li>
              </ul>
            </div> -->
          </div>
        </el-header>
      <el-container>
        <el-main style="background-color:#fff">
          <div class="box">
            <div id="map" style="width: 100%;height: 70vh;margin-top: 2px;"></div>
            <div style="position:absolute;bottom:55px;left:100px;z-index:1000;background-color:rgba(0,0,0,0)">GS(2022)3124号-甲测资字1100471</div>
            <div class="nav">
              <div class="changeMap">
              <spam>切换底图：</spam>
              <div class="changeText">
                <span @click="changeMap(1)">地形图</span>
                <span @click="changeMap(2)">矢量图</span>
                <span @click="changeMap(3)">影像图</span>
              </div>
            </div>
              <el-button class="el-icon-s-home" size="mini" @click="toHome" style="background-color: gray;font-size: 16px;color: #fff;position: relative;left: 90%;"></el-button>
            </div>
          </div>
        </el-main>
        <el-aside width="400px" style="margin-top: 2px;">
          <ul class="box">
            <div class="nodata" v-if="draw.length == 0">暂无数据</div>
            <li
              class="smallbox"
              v-for="(item, index) in draw"
              :key="index"
              style="display: flex"
            >
            <div @click="toLocation(item)" style="cursor:pointer">
              <div class="left" v-if="item.m >= 3">M{{ item.m }}</div>
              <div class="left" v-if="item.m < 3" style="background: #f3e11f">
                M{{ item.m }}
              </div>
            </div>
              <div class="right">
                <ul>
                  <li @click="toLocation(item)" style="cursor:pointer;font-weight: bold;">{{ item.localName }}</li>
                  <li @click="toLocation(item)" style="cursor:pointer;color: #7b7b7b;">{{ new Date(item.oTime).toLocaleString('chinese',{hour12:false}) }}</li>
                  <li class="l">
                    <div>
                      <span>纬度{{ toThreeFloat(item.lat) }}°</span>
                      <span>经度{{ toThreeFloat(item.lon) }}°</span>
                    </div>
                    <span>深度{{ Math.floor(item.depth) }}KM</span>
                    <span style="cursor:pointer;color: blue;text-decoration:underline" @click="goEarths(item)">详情</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <router-link to="/earthlist">查看更多>></router-link>
          <!-- <router-link to="/listearth?type=1">查看更多>></router-link> -->
          <!-- <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
              style="color: #000; font-weight: 700"
            >
              <span>陕西省 西安市</span>
              <span style="color: #f5790f; float: right; padding: 3px 0">
                3.1
                <small style="color: #000; font-weight: 400">级</small></span
              >
            </div>
            <div class="item">
              <div class="flex">
                <div class="color">
                  <i class="el-icon-time"></i>
                  <h3>时间</h3>
                  <p class="eee">2022-06-05 03:14:50</p>
                </div>
                <div class="color">
                  <i class="el-icon-data-line"></i>
                  <h3>深度</h3>
                  <p class="eee">8.0KM</p>
                </div>
                <div class="color">
                  <i class="el-icon-map-location"></i>
                  <h3>经纬度</h3>
                  <p class="eee">120.89°E 37.83°N</p>
                </div>
              </div>
              <div class="item1 color">
                <p style="line-height: 20px; margin-top: 20px">
                  据中国地震台网测定，北京时间2022-06-05
                  03：14：50在陕西......发生3.1级天然地震，深度8千米
                </p>
              </div>
            </div>
          </el-card> -->
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { Loading } from 'element-ui';
import mini from '@/assets/images/mini.png'
import mini2 from '@/assets/images/mini2.png'
import mini3 from '@/assets/images/mini3.png'
import mini4 from '@/assets/images/mini4.png'
import mini5 from '@/assets/images/mini5.png'
import TopNav from '../../components/topNav.vue'
import { encode, decode } from '@/utils/dataEncry'
import L from 'leaflet'
import { tiledMapLayer } from '@supermap/iclient-leaflet'
import { getList } from '@/api/shikuang'
export default {
  data() {
    return {
      // 时间选择框的绑定数据
      value1: '',
      draw: [],
      draw2: [], //备用数据
      map: '',
      scale: 2,
      circle_group1: null,
      circle_group2: null,
      circle_group3: null,
      highSpot: null,
      // 单点项目加点存储的位置
      circle_group: null,
      layerGroups: null,
      lyr1: null,
      lyr2: null,
      selTime: 4,
      seldate: 4,
      selDg: '',
      url: '',
      urlLan: '',
      // 查询参数
      region: ['全部', '国内', '国外'],
      province: [
        '全部',
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
        '澳门',
        '周边地区'
      ],
      depth: ['全部', '3级以下', '3-5级', '5-7级', '7级以上'],
      times: ['最近24小时', '最近一周', '最近一个月', '最近一年', '其他']
    }
  },
  components: {TopNav},
  computed: {},
  watch: {
    scale(newVal, oldVal) {
      this.drawList()
    },
    // 画高亮点
    highspot(newVal) {
      if (newVal) {
        this.highSpot = newVal
      }
    },
  },
  mounted() {
     this.seldate  = new Date();
     this.seldate = this.seldate.setDate(this.seldate.getDate() - 30);
    this.setMap()
    let id = this.$route.query.id
    let item = null
    if(id){
    setTimeout(() => {
        item = this.draw.filter((item)=>{
          return item.id == id
        })
      this.toLocation(item[0])
    }, 600);
  }

  },
  methods: {
    // 前往震情速递正文
    goEarths(item) {
      this.$router.push({
        path: '/earthstuation',
        query: {
          id: item.id,
          type: 1
        }
      })
    },
    toLocation(item) {
      this.highSpot = item
      this.highDraw()
    },
    reSet() {
      this.draw = this.draw2
      this.selTime = 4
      this.sel()
      this.selDg = ''
    },
    //保留三位小数
    toThreeFloat(num) {
      let number = null
      if(num.toString().split('.').length != 1 && num.toString().split('.')[1].length < 3) {
        number = parseFloat(num).toFixed(3)
      }else if(num.toString().split('.').length == 1) {
        number = num.toString() + '.000'
      }else {
        number = num.toString().substr(0,parseInt(num.toString().indexOf('.')) + 4)
      }
      return number
    },
    sel() {
      // if(this.$refs[index].style.backgroundImage){  //已选择再点击则回到初始状态
      //     this.$refs[index].style = ''
      //     this.draw = this.draw2
      //     this.drawList()
      //     return
      // }
      // //清空样式
      // for(let i = 1; i<= 10; i++) {
      //     this.$refs[i].style = ''
      // }
      // this.$refs[index].style = 'background-image: linear-gradient(#067EBD,#067EBD, #176593);color:#fff'
        this.draw = this.draw2
           this.seldate  = new Date();
      if(this.selTime == 1){   //最近24小时内
        this.draw = this.draw.filter(item => {
           return item.day <= 1
        })
        this.seldate = this.seldate.setDate(this.seldate.getDate() - 1);
      }
      if(this.selTime == 2){   //最近48小时内
        this.draw = this.draw.filter(item => {
           return item.day <= 2
        })
          this.seldate = this.seldate.setDate(this.seldate.getDate() - 2);
      }
      if(this.selTime == 3){   //最近一周内
        this.draw = this.draw.filter(item => {
           return item.day <= 7
        })
          this.seldate = this.seldate.setDate(this.seldate.getDate() - 7);
      }
      if(this.selTime == 4){   //最近30天内
        this.draw = this.draw.filter(item => {
           return item.day <= 30
        })
         this.seldate = this.seldate.setDate(this.seldate.getDate() - 30);
      }
      if(this.selTime == 5){   //最近一年内
        this.draw = this.draw.filter(item => {
           return item.day <= 365
        }) 
        this.seldate = this.seldate.setDate(this.seldate.getDate() - 365);
      }
      // if(this.selDg == 6){   //6级以上地震
      //   this.draw = this.draw.filter(item => {
      //      return item.m > 6
      //   })
      // }
      // if(this.selDg == 7){   //5级以上地震
      //   this.draw = this.draw.filter(item => {
      //      return item.m > 5
      //   })
      // }
      // if(this.selDg == 8){   //4级以上地震
      //   this.draw = this.draw.filter(item => {
      //      return item.m > 4
      //   })
      // }
      // if(this.selDg == 9){   //3级以上地震
      //   this.draw = this.draw.filter(item => {
      //      return item.m >= 3
      //   })
      // }
      // if(this.selDg == 10){   //3级以下地震
      //   this.draw = this.draw.filter(item => {
      //      return item.m < 3
      //   })
      // }
      this.setMap()
      this.drawList()
    },
    formatDateTime(dateTime0){
      let dateTime = new Date(dateTime0);
      var Y = dateTime.getFullYear() + '-';
      var M = (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1) + '-';
      var D = (dateTime.getDate() < 10 ? '0' + (dateTime.getDate()) : dateTime.getDate());
      return Y + M + D; 
    },
    setMap(flag) {
      const loading = Loading.service({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
        });
        let str = 'pageSize=100&pageNum=1'
        if(this.selDg != ''){
          str += '&m='+this.selDg
        }
        if(this.selTime != ''){
          str += '&oTime='+this.formatDateTime(this.seldate)
        }
      getList(str).then((res) => {
        this.draw = [...res.records]
        this.draw.forEach(i=>{
          i.oTime = new Date(i.otime).getTime()
        })
        loading.close();
          this.draw.forEach((item,index) => {
          for(let i = 0; i<this.draw.length - index; i++){
            if(this.draw[i + 1] && this.draw[i].oTime < this.draw[i + 1].oTime){
              let temp = null
              temp = this.draw[i]
              this.draw[i] = this.draw[i + 1]
              this.draw[i + 1] = temp
            }
          }
        })
        this.draw2 = [...this.draw]
        this.getTime()
        this.drawList()
        // this.sel()
      }).catch((e) => {
        if(!flag){
          setTimeout(() => {
            this.setMap(1)
          }, 500);
        }
      })
        
      let map
      // let url = host + '/map-tianditu/rest/maps/地形底图_经纬度'
      map = L.map('map', {
        crs: L.CRS.EPSG4326,
        center: [35.9, 104],
        maxZoom: 12,
        minZoom: 2,
        zoom: this.scale,
        attributionControl: false,
        zoomControl: false,
        preferCanvas: true
      })
      this.map = map
      this.layerGroups = new L.FeatureGroup()
      this.layerGroups.addTo(map)
    // tiledMapLayer(this.url, {
    //     maxZoom: 18,
    //     id: '',
    //     tileSize: 512, 
    //     zoomOffset: -1,
    //     accessToken: ''
    //   }).addTo(map)
    //   L.control.scale().addTo(map)
    //  tiledMapLayer(this.urlLan, { transparent: true, opacity: 1 }).addTo(map)
    L.control.scale().addTo(map)
    this.changeMap(2)
      this.map.on('zoomend', (e) => {
        // 获取当前放大或者缩小的等级
        let scale = e.target.getZoom()
        this.scale = scale
      })
      this.addDraw(map)

    },
    create2M(rul1, rul2) {
      for (let i = this.layerGroups._layers.length - 1; i >= 0; i--) {
        this.layerGroups.removeLayer(this.layerGroups._layers[i])
      }
      // if (this.lwShow) {
        if (this.lyr1 !== null) {
          this.layerGroups.removeLayer(this.lyr1)
          this.layerGroups.removeLayer(this.lyr2)
        }
        this.lyr1 = tiledMapLayer(rul1)
        this.lyr2 = tiledMapLayer(rul2)

        this.lyr1.addTo(this.layerGroups)
        this.lyr2.addTo(this.layerGroups)
      // } else {
        // if (this.lyr1 !== null) {
        //   this.layerGroups.removeLayer(this.lyr1)
        //   this.layerGroups.removeLayer(this.lyr2)
        // }
        // this.lyr1 = tiledMapLayer(rul1)
        // this.lyr1.addTo(this.layerGroups)
      // }
    },
    getTime() {
      // this.draw[i].oTime
      this.draw.forEach((item) => {
        item.day = Math.floor((parseInt(new Date().getTime()) - parseInt(item.oTime)) / 1000 / 60 / 60 / 24)
      })
      console.log(this.draw)
    },
    loadPointIcon(day,size) {
      let Icon = null
      if(day <= 1){
        Icon = new L.Icon({
          iconUrl: mini, // 图标路径
          iconSize: size
        })
      }else if(day <= 7){
        Icon = new L.Icon({
          iconUrl: mini2, // 图标路径
          iconSize: size
        })
      }else if(day <= 30){
        Icon = new L.Icon({
          iconUrl: mini3, // 图标路径
          iconSize: size
        })
      }else if(day <= 365){
        Icon = new L.Icon({
          iconUrl: mini4, // 图标路径
          iconSize: size
        })
      }else{
        Icon = new L.Icon({
          iconUrl: mini5, // 图标路径
          iconSize: size
        })
      }
      return Icon
    },
    // 绘点
    addDraw() {
      this.showDraw()
      let drawList = this.draw.length
      if (drawList > 20) {
        this.drawList()
        return
      }
      let circles = []
      let circle_map = {}
      for (let i = 0; i < drawList; i++) {
        let num = this.draw[i].m
        let txt = `
        <div>
        <h4>发震时间:<span>${new Date(this.draw[i].oTime).toLocaleString()}</span></h4><br>
        <h4>震级：<span>${this.draw[i].m}</span></h4><br>
        <h4>经度：<span>${this.toThreeFloat(this.draw[i].lat)}</span></h4><br>
        <h4>纬度：<span>${this.toThreeFloat(this.draw[i].lon)}</span></h4><br>
        <h4>深度：<span>${this.draw[i].depth}KM</span></h4><br>
        <h4>地址：<span> ${this.draw[i].localName}</span></h4>
        </div>
        `
        if (num >= 7) {
          let Icon = null
          Icon = this.loadPointIcon(this.draw[i].day,[24, 24])
          let circle = L.marker([this.draw[i].lat, this.draw[i].lon], {
            icon: Icon,
            riseOnHover: true
          })
            .bindPopup(txt)
            .openPopup()
          circles.push(circle)
          circle_map[i] = circle
        }else if (num >= 5) {
          let Icon = null
          Icon = this.loadPointIcon(this.draw[i].day,[20, 20])
          let circle = L.marker([this.draw[i].lat, this.draw[i].lon], {
            icon: Icon,
            riseOnHover: true
          })
            .bindPopup(txt)
            .openPopup()
          circles.push(circle)
          circle_map[i] = circle
        }else if (num >= 3) {
          let Icon = null
          Icon = this.loadPointIcon(this.draw[i].day,[16, 16])
          let circle = L.marker([this.draw[i].lat, this.draw[i].lon], {
            icon: Icon,
            riseOnHover: true
          })
            .bindPopup(txt)
            .openPopup()
          circles.push(circle)
          circle_map[i] = circle
        } else {
          let Icon = null
          Icon = this.loadPointIcon(this.draw[i].day,[12, 12])
          let circle = L.marker([this.draw[i].lat, this.draw[i].lon], {
            icon: Icon,
            riseOnHover: true
          })
            .bindPopup(txt)
            .openPopup()
          circles.push(circle)
          circle_map[i] = circle
        }
        this.circle_group = new L.LayerGroup(circles).addTo(this.map)
        this.circle_group2 = this.circle_group
      }
    },
    // 数据过多的备用
    drawList() {
      this.showDraw()
      let drawList = this.draw.length
      let circles = []
      let circle_map = {}
      for (let i = 0; i < drawList; i++) {
        let num = this.draw[i].m
        let txt = `
        <h4>发震时间:<span>${new Date(this.draw[i].oTime).toLocaleString()}</span></h4><br>
        <h4>震级：<span>${this.draw[i].m}</span></h4><br>
        <h4>经度：<span>${this.toThreeFloat(this.draw[i].lat)}</span></h4><br>
        <h4>纬度：<span>${this.toThreeFloat(this.draw[i].lon)}</span></h4><br>
        <h4>深度：<span>${this.draw[i].depth}KM</span></h4><br>
        <h4>位置：<span> ${this.draw[i].localName}</span></h4><br>
      `
        // if (this.scale <= 4) {
        //   if (num >= 7) {
        //     let Icon = null
        //     Icon = this.loadPointIcon(this.draw[i].day,[24, 24])
        //     let circle = L.marker([this.draw[i].lat, this.draw[i].lon], {
        //       icon: Icon,
        //       riseOnHover: true
        //     })
        //       .bindPopup(txt)
        //       .openPopup()
        //     circles.push(circle)
        //     circle_map[i] = circle
        //   }
        // } else if (this.scale <= 6) {
        //   if (num >= 3) {
        //     let Icon = null
        //     Icon = this.loadPointIcon(this.draw[i].day,[16, 16])
        //     let circle = L.marker([this.draw[i].lat, this.draw[i].lon], {
        //       icon: Icon,
        //       riseOnHover: true
        //     })
        //       .bindPopup(txt)
        //       .openPopup()
        //     circles.push(circle)
        //     circle_map[i] = circle
        //   }
        //   if (num >= 2) {
        //     let Icon = null
        //     Icon = this.loadPointIcon(this.draw[i].day,[13, 13])
        //     let circle = L.marker([this.draw[i].lat, this.draw[i].lon], {
        //       icon: Icon,
        //       riseOnHover: true
        //     })
        //       .bindPopup(txt)
        //       .openPopup()
        //     circles.push(circle)
        //     circle_map[i] = circle
        //   }
        // } else {
          if (num >= 7) {
            let Icon = null
            let zindex = 350
            Icon = this.loadPointIcon(this.draw[i].day,[25, 25])
            if(this.draw[i].day <= 1){
              zindex = 999
            }
            let circle = L.marker([this.draw[i].lat, this.draw[i].lon], {
              icon: Icon,
              riseOnHover: true
            })
              .bindPopup(txt)
              .openPopup()
              .setZIndexOffset(zindex)
            circles.push(circle)
            circle_map[i] = circle
          }else if (num >= 5) {
            let Icon = null
            let zindex = 320
            Icon = this.loadPointIcon(this.draw[i].day,[19, 19])
            if(this.draw[i].day <= 1){
              zindex = 999
            }
            let circle = L.marker([this.draw[i].lat, this.draw[i].lon], {
              icon: Icon,
              riseOnHover: true
            })
              .bindPopup(txt)
              .openPopup()
              .setZIndexOffset(zindex)
            circles.push(circle)
            circle_map[i] = circle
          }else if (num >= 3) {
            let Icon = null
            let zindex = 290
            Icon = this.loadPointIcon(this.draw[i].day,[12, 12])
            if(this.draw[i].day <= 1){
              zindex = 999
            }
            let circle = L.marker([this.draw[i].lat, this.draw[i].lon], {
              icon: Icon,
              riseOnHover: true,
            })
              .bindPopup(txt)
              .openPopup()
              .setZIndexOffset(zindex)
            circles.push(circle)
            circle_map[i] = circle
          } else {
            let Icon = null
            let zindex = 260
            Icon = this.loadPointIcon(this.draw[i].day,[7, 7])
            if(this.draw[i].day <= 1){
              zindex = 999
            }
            let circle = L.marker([this.draw[i].lat, this.draw[i].lon], {
              icon: Icon,
              riseOnHover: true,
            })
              .bindPopup(txt)
              .openPopup()
              .setZIndexOffset(zindex)
            circles.push(circle)
            circle_map[i] = circle
          }
        this.circle_group = new L.LayerGroup(circles).addTo(this.map)
        this.circle_group2 = this.circle_group

      }
    },
    toHome() {
      if (this.circle_group) {
        this.circle_group.clearLayers()
      }
      let circles = []
      // let myIcon = L.icon({
      //   iconUrl: yy, // 图标路径
      //   iconSize: [14, 14], // 图标大小
      //   iconAnchor: [7, 7], // 图标 "tip" 的坐标
      //   popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      // })
        let circle = L.marker([35.560001, 100.000])
        circles.push(circle)
      this.circle_group = new L.LayerGroup(circles).addTo(this.map)
      this.map.setView([35.560001, 100.000], 3)
    },
    changeMap(type) {
      let host = window.isLocal
        ? window.server
        : 'http://www.earthquake.ac.cn/iserver/services'
      if(type == 1){
        this.url = host + '/map-tianditu/rest/maps/%E5%9C%B0%E5%BD%A2%E5%BA%95%E5%9B%BE_%E7%BB%8F%E7%BA%AC%E5%BA%A6'
        this.urlLan = host + '/map-tianditu/rest/maps/%E5%9C%B0%E5%BD%A2%E4%B8%AD%E6%96%87%E6%B3%A8%E8%AE%B0_%E7%BB%8F%E7%BA%AC%E5%BA%A6'
        this.create2M(this.url,this.urlLan)
      }
      if(type == 2){
        this.url = host + '/map-tianditu/rest/maps/矢量底图_经纬度'
        this.urlLan = host + '/map-tianditu/rest/maps/矢量中文注记_经纬度'
        this.create2M(this.url,this.urlLan)
      }
      if(type == 3){
        this.url = host + '/map-tianditu/rest/maps/%E5%BD%B1%E5%83%8F%E5%BA%95%E5%9B%BE_%E7%BB%8F%E7%BA%AC%E5%BA%A6'
        this.urlLan = host + '/map-tianditu/rest/maps/%E5%BD%B1%E5%83%8F%E4%B8%AD%E6%96%87%E6%B3%A8%E8%AE%B0_%E7%BB%8F%E7%BA%AC%E5%BA%A6'
        this.create2M(this.url,this.urlLan)
      }
      // this.setMap()
    },
       // 高亮的点
    highDraw() {
      if (this.circle_group1) {
        this.circle_group1.clearLayers()
        this.circle_group1 = this.circle_group2
      }
      this.map.setView([this.highSpot.lat, this.highSpot.lon], 5)
      setTimeout(() => {
        let circles = []
      // let myIcon = L.icon({
      //   iconUrl: yy, // 图标路径
      //   iconSize: [14, 14], // 图标大小
      //   iconAnchor: [7, 7], // 图标 "tip" 的坐标
      //   popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      // })
        let circle = L.marker([this.highSpot.lat, this.highSpot.lon])
        circles.push(circle)
      this.circle_group1 = new L.LayerGroup(circles).addTo(this.map)
      }, 300);

    },
    showDraw() {
      if (this.circle_group) {
        this.circle_group.clearLayers()
      }
    },
    // 查看历史地震信息
    goSeeLisi(e) {
    }
  }
}
</script>

<style lang="less" scoped>
.shikuang {
  position: relative;
  .topNav {
    position: absolute;
    top: 15px;
    left: 40px;
    background-color: rgb(255, 255, 255);
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
    opacity: 0.9;
  }
}
.el-header {
  height: 70px !important;
}
.header {
  width: 100%;
  .headerRow {
    display: flex;
    padding: 15px 0px 8px 240px;
    border-top: 1px solid rgb(216, 216, 216);
    // .byTime {
      // width: 75%;
      // display: flex;
      // justify-content: space-around;
      // color: #1492ff;
      // font-size: 15px;
     // .item {
        // padding: 3px 12px;
        // border-radius: 2px;
        // cursor: pointer;
      //}
      // .item:hover {
      //   background-color: #d6d6d6;
      // }
    // }
  }
}

.el-container {
  .el-header {
    background: #fff;
    .box {
      width: 100%;
      padding: 10px;
      div {
        display: flex;
        box-sizing: border-box;
      }
      .box1,
      .box2,
      .box3,
      .box4 {
        padding-top: 10px;
      }
      ul {
        width: 90%;
        display: flex;
        flex-flow: wrap;
        border-bottom: 1px dotted #000;
        li {
          padding: 0 10px;
          cursor: pointer;
          margin-bottom: 10px;
        }
      }
      .box4 {
        ul {
          flex: 1;
          border: none;
        }
      }
    }
  }
  .gstext {
    position:absolute;
    bottom:55px;
    left:100px;
    z-index:1000;
    font-size: 14px;
    background-color:rgba(0,0,0,0);
  }
  .el-aside {
    background-color: #f4f9ff;
    padding-left: 10px;
    .box {
      height: 72vh;
      overflow: auto;
      padding-right: 10px;
      .nodata {
        font-size: 15px;
        color: rgb(71, 71, 71);
        text-align: center;
        line-height: 100px;
      }
      .smallbox {
        padding: 10px 0;
        font-size: 14px;
        color: #333;
        border-bottom: 1px dashed #333;
        .left {
          box-sizing: border-box;
          background-color: red;
          text-align: center;
          width: 50px;
          padding: 2px 0px;
          color: #fff;
          border-radius: 4px;
          margin-right: 10px;
        }
        .right {
          flex: 1;
          ul li {
            line-height: 150%;
          }
          .l {
            display: flex;
            justify-content: space-between;
            div {
              span {
                margin-right: 20px;
              }
            }
          }
        }
      }
      .smallbox:last-child {
        border: none;
      }
    }
    a {
      float: right;
      color: #000;
      font-size: 14px;
      line-height: 50px;
    }
    a:hover {
      color: #1492ff;
    }
  }
  .el-main {
    width: 100%;
    padding: 0;
    .box {
      background-color: #fff;
      position: relative;
      .nav {
        margin-top: 12px;
        margin-left: 20px;
        margin-bottom: 5px;
        height: 35px;
        background-image: url(@/assets/images/earthquake_desc.jpg);
        background-repeat: no-repeat;
        background-position: left;
        // background-size: 40% 100%;
      }
      .changeMap {
        display: flex;
        padding: 5px 50px;
        position: absolute;
        right: 15%;
        .changeText {
          color: #1492ff;
          text-decoration: underline;
          cursor: pointer;
          width: 170px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
.mini {
  text-align: center;
  line-height: 5px;
  padding: 4px;
  font-size: 10px;
  border-radius: 3px;
}
.flex {
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
}
.color {
  color: #1492ff;
  font-size: 10px;
}
.eee {
  color: #a6a6a6;
}
/deep/.el-card__body {
  padding: 10px 20px;
}
.my-icon {
  width: 15px;
  height: 15px;
  background-color: #fff;
  border-radius: 50%;
}
@media (max-width: 1200px) {
  .el-container {
    width: 1200px;
  }
}
</style>
