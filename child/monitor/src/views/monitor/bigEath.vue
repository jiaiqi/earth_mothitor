<template>
  <div class="shikuang">
    <!-- <div class="topNav">
      <tabNav :pageName="'最新地震信息'"></tabNav>
    </div> -->
    <!-- <el-dialog
      title="台站展示"
      :visible.sync="dialogVisible"
      width="78%">
      <div style="display:flex">
        <div id="map2" style="width: 100%;height: 520px;"></div>
        <div class="table">
          <el-table
            :data="stationlist"
            border
            height="520"
            size="mini"
            >
            <el-table-column
              fixed
              prop="station_name"
              label="台站"
              width="150">
            </el-table-column>
            <el-table-column
              prop="station_code"
              label="编码"
              width="90">
            </el-table-column>
            <el-table-column
              prop="longitude"
              label="经度"
              width="90">
            </el-table-column>
            <el-table-column
              prop="latitude"
              label="纬度"
              width="90">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="波形"
              width="100">
              <template slot-scope="scope">
                <el-button @click="preView(scope.row)" type="text" size="small">预览</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog> -->
    <el-container>
      <el-header>
        <div class="head-row" style="margin-top: 10px">
          <div class="head-item">
            <span>日期:</span>
            <el-date-picker
              v-model="search.date"
              type="date"
              size="small"
              style="width:160px"
              placeholder="选择年份">
            </el-date-picker>
            <div>--</div>
            <el-date-picker
              v-model="search.date2"
              type="date"
              size="small"
              style="width:160px"
              placeholder="选择年份">
            </el-date-picker>
          </div>
          <div class="head-item" style="width:300px">
            <span>震级(m)：</span>
            <el-input v-model="search.m" size="small" style="width:90px"></el-input>
            <span>--</span>
            <el-input v-model="search.m2" size="small" style="width:90px"></el-input>
          </div>
          <div class="head-item" style="width:250px">
            <span>地点：</span>
            <el-input v-model="search.localname" size="small" style="width:180px"></el-input>
          </div>
          <div class="search">
            <el-button size="small" type="primary" @click="searchValue">查 询</el-button>
          </div>
        </div>
        <div class="head-row" style="margin-top: 10px;justify-content: center;">
          <div class="head-item" style="width:300px">
            <span>经度(范围)：</span>
            <el-input v-model="search.slon" size="small" style="width:90px"></el-input>
            <span>--</span>
            <el-input v-model="search.elon" size="small" style="width:90px"></el-input>
          </div>
          <div class="head-item" style="width:300px;margin-left: 30px;">
            <span>纬度(范围)：</span>
            <el-input v-model="search.slat" size="small" style="width:90px"></el-input>
            <span>--</span>
            <el-input v-model="search.elat" size="small" style="width:90px"></el-input>
          </div>
        </div>
      </el-header>
      <el-container>
      <el-main style="background-color:#fff">
        <el-tabs v-model="pageIndex" style="padding-left: 30px;">
          <el-tab-pane label="GIS分布" name="first"></el-tab-pane>
          <el-tab-pane label="列表详情" name="second"></el-tab-pane>
        </el-tabs>
          <div class="box" style="margin-top:-12px" v-show="pageIndex == 'first'">
            <div id="map" style="width: 100%;height: 72vh"></div>
          </div>
          <div class="info-list" v-show="pageIndex == 'second'">
            <el-table
              :data="draw2">
              <el-table-column
                v-if="type == 0"
                prop="localname"
                width="320"
                label="参考位置">
              </el-table-column>
              <el-table-column
                prop="oTime"
                width="320"
                label="发震时间(UTC+8)">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.year+ '年' + scope.row.monday.substring(0,2)+ '月' + scope.row.monday.substring(2,4)+ '日' + '  '+ scope.row.hour+':'+ scope.row.min+':'+  scope.row.second }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="m"
                label="震级(m)"
                width="150"
                >
              </el-table-column>
              <el-table-column
                prop="lon"
                label="经度"
                width="160"
                >
              </el-table-column>
              <el-table-column
                prop="lat"
                label="纬度"
                width="160"
                >
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="160">
                <template slot-scope="scope">
                  <el-button @click="check(scope.row)" type="text" size="small">定位</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="page">
              <el-pagination
                layout="prev, pager, next, total"
                :total="total"
                :page-size="10"
                :current-page="currentPage"
                @current-change="currentChange">
              </el-pagination>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getlist2, getlist } from "@/api/shikuang";
import L from 'leaflet'
import { tiledMapLayer, CircleStyle, Graphic, GraphicLayer } from '@supermap/iclient-leaflet'
// import { getList } from '@/api/shikuang'
export default {
  data() {
    return {
      draw: [],
      draw2: [], //备用数据
      search: {
        date: '2012-01-01',
        date2: '2023-01-01',
        m: '5',
        m2: '7',
        localname: '',
        slon: -180.00,
        elon: 180.00,
        slat: -90.00,
        elat: 90.00
      },
      total: 1,
      // dialogVisible: false,
      map: null,
      map2: '',
      scale: 2,
      highSpot: null,
      // 单点项目加点存储的位置
      circle_group: null,
      type: 0,
      currentPage: 1,
      pageIndex: 'first' //默认显示地图页
    }
  },
  components: {},
  computed: {},
  watch: {
    scale(newVal, oldVal) {
      this.drawList()
    }
  },
  mounted() {
    this.type = this.$route.query.type
    this.setMap()
  },
  methods: {
    check(e) {
      this.pageIndex = 'first'
      let circles = []
      let circle = L.marker([e.lat, e.lon])
      circles.push(circle)
      this.circle_group = new L.LayerGroup(circles).addTo(this.map)
      this.map.setView([e.lat, e.lon], 8)
    },
    searchValue() {
      let s = new Date(this.search.date).toLocaleDateString().replaceAll('/','-')
      let e = new Date(this.search.date2).toLocaleDateString().replaceAll('/','-')
      let syear = s.split('-')[0]
      let eyear = e.split('-')[0]
      let mon = ''
      let day = ''
      let mon2 = ''
      let day2 = ''
      if(parseInt(s.split('-')[1])<10) {
        mon = '0' + s.split('-')[1]
      }
      if(parseInt(s.split('-')[2])<10) {
        day = '0' + s.split('-')[2]
      }
      if(parseInt(e.split('-')[1])<10) {
        mon2 = '0' + e.split('-')[1]
      }
      if(parseInt(e.split('-')[2])<10) {
        day2 = '0' + e.split('-')[2]
      }
      let sdm = mon + day
      let edm = mon2 + day2
      let par = {
        type: this.type,
        year: syear,
        betyear: eyear,
        m: this.search.m,
        betm: this.search.m2,
        localname: this.search.localname,
        slon: this.search.slon,
        elon: this.search.elon,
        slat: this.search.slat,
        elat: this.search.elat,
        dm: sdm,
        betDM: edm,
        pageNum: 1,
        pageSize: 99999,
      }
      getlist(par).then(res => {
        this.draw = res.records
        this.draw2 = this.draw.slice(0,10)
        this.total = res.total
        this.drawList()
      })
    },
    setMap() {
      let par = {}
      let search = {
        m: '',
        m2: ''
      }
      let s = new Date(this.search.date).toLocaleDateString().replaceAll('/','-')
      let e = new Date(this.search.date2).toLocaleDateString().replaceAll('/','-')
      let syear = s.split('-')[0]
      let eyear = e.split('-')[0]
      let mon = ''
      let day = ''
      let mon2 = ''
      let day2 = ''
      if(parseInt(s.split('-')[1])<10) {
        mon = '0' + s.split('-')[1]
      }
      if(parseInt(s.split('-')[2])<10) {
        day = '0' + s.split('-')[2]
      }
      if(parseInt(e.split('-')[1])<10) {
        mon2 = '0' + e.split('-')[1]
      }
      if(parseInt(e.split('-')[2])<10) {
        day2 = '0' + e.split('-')[2]
      }
      let sdm = mon + day
      let edm = mon2 + day2
      if(this.type == 1){
        this.search.date = '2017-01-01'
        this.search.date2 = '2018-01-01'
        this.search.m = 2
        search.m2 = 3
        par = {
          type: this.type,
          year: syear,
          betyear: eyear,
          pageNum: 1,
          pageSize: 99999,
          slon: this.search.slon,
          elon: this.search.elon,
          slat: this.search.slat,
          elat: this.search.elat,
          dm: sdm,
          betDM: edm,
          m: this.search.m,
          betm: search.m2
        }
      }else{
        if(this.$route.query.m == 7){
          this.search.m = 7
          search.m2 = 9
          this.search.m2 = ""
        }else {
          this.search.date = '2015-01-01'
          this.search.date2 = '2023-01-01'
        }
        par = {
          type: this.type,
          year: syear,
          betyear: eyear,
          dm: sdm,
          betDM: edm,
          pageNum: 1,
          slon: this.search.slon,
          elon: this.search.elon,
          slat: this.search.slat,
          elat: this.search.elat,
          pageSize: 99999,
          m: this.search.m,
          betm: search.m2
        }
      }

      getlist(par).then(res => {
        this.draw = res.records
        this.total = res.total
        this.draw2 = this.draw.slice(0,10)
        this.drawList()
      })

      let host = window.isLocal
        ? window.server
        : 'http://www.earthquake.ac.cn/iserver/services'
        
      let map
      // let url = host + '/map-tianditu/rest/maps/地形底图_经纬度'
      let url = host + '/map-tianditu/rest/maps/地形底图_墨卡托'
      let urlLan = host + '/map-tianditu/rest/maps/地形中文注记_墨卡托'
      map = L.map('map', {
        preferCanvas: true,
        // crs: L.CRS.EPSG3857,
        center: [35.9, 104],
        maxZoom: 12,
        minZoom: 3,
        zoom: this.scale,
        attributionControl: false
      })
      this.map = map
    tiledMapLayer(url, {
        maxZoom: 18,
        id: '',
        tileSize: 512, 
        zoomOffset: -1,
        accessToken: ''
      }).addTo(map)
      L.control.scale().addTo(map)
     tiledMapLayer(urlLan, { transparent: true, opacity: 1 }).addTo(map)
      this.map.on('zoomend', (e) => {
        // 获取当前放大或者缩小的等级
        let scale = e.target.getZoom()
        this.scale = scale
      })
    },
    // 数据过多的备用
    drawList() {
      this.showDraw()
      let drawList = this.draw.length
      let graphics = [];
      let circleStyles = [];
      // for (let i = 0; i < drawList; i++) {
      //   let num = this.draw[i].m
      //   let txt = `
      //   <h4>发震时间:<span>${this.draw[i].year + this.draw[i].monday + '  '+ this.draw[i].hour+ this.draw[i].min+ this.draw[i].second}</span></h4><br>
      //   <h4>级别：<span>${this.draw[i].m}</span></h4><br>
      //   <h4>经度：<span>${this.draw[i].lat}</span></h4><br>
      //   <h4>纬度：<span>${this.draw[i].lon}</span></h4><br>
      //   <h4>深度：<span>${this.draw[i].m}KM</span></h4><br>
      //   <h4>位置：<span> ${this.draw[i].localname}</span></h4><br>
      //   <h4 class="detail-button" style="color:#0000ff;margin-left:20px; cursor: pointer"> >历史地震</h3>
      // `
      // }

        //设置每个点的经纬度和传入圆的样式
        for (var j = 0; j < drawList; ++j) {
          //创建圆的样式
          circleStyles.push(new CircleStyle({
            color: (parseInt(this.draw[j].m) - 7)*15 < 6 ? 'orange' : 'red',
            opacity: 1,
            fill: true,
            fillColor: (parseInt(this.draw[j].m) - 7)*15 < 6 ? 'orange' : 'red',
            fillOpacity: 1,
            weight: (parseInt(this.draw[j].m) - 7)*15 < 6 ? 6 : (parseInt(this.draw[j].m) - 7)*15
          }));
          let data = {
            localname: this.draw[j].localname,
            m: this.draw[j].m,
            date: this.draw[j].year+ this.draw[j].monday +" "+ this.draw[j].hour+ ":" + this.draw[j].min+ ":"  +this.draw[j].second,
          }
            graphics[j] = new Graphic({
                latLng: L.latLng(this.draw[j].lat, this.draw[j].lon),
                style: circleStyles[j].getStyle(),
                attributes: data
            });
          }
          const self = this
        //绘制图层
        this.circle_group = new GraphicLayer(graphics,{
          onClick: function (graphic) {
              L.popup().setLatLng(graphic.getLatLng())
              .setContent('<p>位置：'+graphic.attributes.localname+'</p>'+
              '<p>震级：'+graphic.attributes.m+'</p>'+
              '<p>发震时间：'+graphic.attributes.date+'</p>')
                        .openOn(self.map);
          }
        }).addTo(this.map);
    },
    showDraw() {
      if (this.circle_group) {
        this.circle_group.removeGraphics()
      }
    },
    currentChange(e) {
      let s = new Date(this.search.date).toLocaleDateString().replaceAll('/','-')
      let e2 = new Date(this.search.date2).toLocaleDateString().replaceAll('/','-')
      let syear = s.split('-')[0]
      let eyear = e2.split('-')[0]
      let mon = ''
      let day = ''
      let mon2 = ''
      let day2 = ''
      if(parseInt(s.split('-')[1])<10) {
        mon = '0' + s.split('-')[1]
      }
      if(parseInt(s.split('-')[2])<10) {
        day = '0' + s.split('-')[2]
      }
      if(parseInt(e2.split('-')[1])<10) {
        mon2 = '0' + e2.split('-')[1]
      }
      if(parseInt(e2.split('-')[2])<10) {
        day2 = '0' + e2.split('-')[2]
      }
      let sdm = mon + day
      let edm = mon2 + day2
      this.currentPage = e
      let par = {
        type: this.type,
        year: syear,
        betyear: eyear,
        m: this.search.m,
        betm: this.search.m2,
        localname: this.search.localname,
        slon: this.search.slon,
        elon: this.search.elon,
        slat: this.search.slat,
        elat: this.search.elat,
        dm: sdm,
        betDM: edm,
        pageNum: this.currentPage,
        pageSize: 10,
      }
      getlist(par).then(res => {
        this.draw2 = res.records
        this.drawList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.shikuang {
  position: relative;
  .topNav {
    position: absolute;
    top: 20px;
    left: -170px;
    background-color: rgb(255, 255, 255);
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
    opacity: 0.9;
  }
}
.el-header {
  height: 120px !important;
}
.head-row {
  display: flex;
  justify-content: space-around;
  width: 1200px;
  padding: 10px 15px;
  .head-item {
    width: 410px;
    display: flex;
    justify-content: space-between;
  }
  .search {
    position: relative;
    left: 20px;
  }
}
.header {
  width: 100%;
  .headerRow {
    display: flex;
    padding: 15px 0px 8px 40px;
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
  .info-list {
    width: 100%;
    padding: 0px 220px;
    .page {
      width:100%;
      display: flex;
      justify-content: center;
      padding: 18px 0px;
    }
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
          padding: 0 5px;
          height: 20px;
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
        // background-image: url(@/assets/images/earthquake_desc.jpg);
        // background-repeat: no-repeat;
        // background-position: left;
        // background-size: 40% 100%;
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
