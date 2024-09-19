<template>
  <div class="box">
    <div v-loading="loading" id="map" style="width: 100%; height: 90vh"></div>
    <div id="mouse-coordinates" class="showLatLon"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import dc from '@/assets/images/dc.png'
import lt from '@/assets/images/lt.png'
import xb from '@/assets/images/xb.png'
import bit from '@/assets/images/bit.png'
import mini from '@/assets/images/mini.png'
import { tiledMapLayer } from '@supermap/iclient-leaflet'
import { mapState } from 'vuex'
import 'leaflet.pm'
import 'leaflet.pm/dist/leaflet.pm.css'
export default {
  data() {
    return {
      mapList: [],
      loading: true,
      clickMap: '',
      deformationlist: [],
      rectanglist: [],
      map: '',
      drawing: false,
      circle_group: null,
      circle_group1: null,
      circle_group2: null,
      line_group: null,
      line_group1: null,
      highSpot: null,
      stationSpot: null,
      // 抽屉的打开
      drawer: false,
      drawerTitle: '',
      // tab表格的数据
      tableData: [],
      scale: 3,
      center: [30.7, 104],
      layerGroups: null,
      lyr1: null,
      lyr2: null,
      mapUrl: null
    }
  },
  props: [
    'list',
    'restmap',
    'deformation',
    'highspot',
    'stationspot',
    'LineHeig'
  ],
  created() {},
  computed: {
    ...mapState(['mapShow', 'lwShow'])
  },
  watch: {
    list(newVal) {
      if(this.drawing){
        return
      }
      if (newVal.length > 0) {
        this.mapList = newVal
        if(this.mapList[0].lineName){
          this.mapList.forEach(item=>{
            item.staLon = item.latAndLon[0][1]
            item.staLat = item.latAndLon[0][0]
          })
          return
        }
        this.addDraw()
      } else {
        this.mapList = []
        this.addDraw()
      }
    },
    deformation(newVal, oldVal) {
      if (newVal) {
        this.deformationlist = newVal
        this.setLine()
      }
    },
    highspot(newVal) {
      if (newVal === null) {
        if (this.circle_group1) {
          this.circle_group1.clearLayers()
        }
      } else {
        this.highSpot = newVal
        this.highDraw()
      }
    },
    stationspot(newVal) {
      this.stationSpot = newVal
      this.stationDraw()
    },
    mapShow(newVal) {
      this.changeBaseLayer(newVal)
    },
    lwShow(newVal) {
      this.changeBaseLayer(this.mapShow)
    },
    // 水转点的线
    LineHeig(newVal) {
      this.lineHigh(newVal)
    }
  },
  beforeMount() {},
  mounted() {
    // let host = window.isLocal
    //   ? window.server
    //   : 'http://10.7.208.11:8090/iserver/services'
    let map
    // let url = host + this.restmap.url
    // let urlLan = host + this.restmap.urlLon

    map = L.map('map', {
      crs: L.CRS.EPSG4326,
      center: this.center,
      maxZoom: 12,
      minZoom: 3,
      zoom: this.scale,
      attributionControl: false,
      zoomControl: false,
      preferCanvas: true
    })
    this.layerGroups = new L.FeatureGroup()
    this.layerGroups.addTo(map)

    // let dcLater = tiledMapLayer(url)
    // dcLater.addTo(this.layerGroups)
    // tiledMapLayer(urlLan, { transparent: true, opacity: 1 }).addTo(
    //   this.layerGroups
    // )
    this.map = map
    L.control.scale().addTo(map)
    map.on('zoomend', (e) => {
      // 获取当前放大或者缩小的等级
      let scale = e.target.getZoom()
      this.scale = scale
    })
    this.changeBaseLayer(this.mapShow)
    this.map.pm.addControls({
      position: 'topright',
      drawPolygon: false, // 绘制多边形
      drawMarker: false, // 绘制标记点
      drawCircleMarker: false, // 绘制圆形标记
      drawPolyline: false, // 绘制线条
      drawRectangle: true, // 绘制矩形
      drawCircle: true, // 绘制圆圈
      editMode: false, // 编辑多边形
      dragMode: false, // 拖动多边形
      cutPolygon: true, // 添加一个按钮以删除多边形里面的部分内容
      removalMode: true // 清除多边形
    })
    map.on('mousemove', function(e) {
        var latlng = e.latlng;
        document.getElementById('mouse-coordinates').innerHTML = '当前鼠标位置：' + latlng.lat.toFixed(3) + ',' + latlng.lng.toFixed(3);
    });
    this.rectangle()
    this.loading = false
  },

  methods: {
    // 切换地图
    changeBaseLayer(e) {
      if (e === 'sl') {
        let url1 =
          'http://www.earthquake.ac.cn/iserver/services/map-tianditu/rest/maps/矢量底图_经纬度'
        let url2 =
          'http://www.earthquake.ac.cn/iserver/services/map-tianditu/rest/maps/矢量中文注记_经纬度'
        this.create2M(url1, url2)
      } else if (e === 'yx') {
        let url1 =
          'http://www.earthquake.ac.cn/iserver/services/map-tianditu/rest/maps/影像底图_经纬度'
        let url2 =
          'http://www.earthquake.ac.cn/iserver/services/map-tianditu/rest/maps/影像中文注记_经纬度'
        this.create2M(url1, url2)
      } else if (e === 'dx') {
        let url1 =
          'http://www.earthquake.ac.cn/iserver/services/map-tianditu/rest/maps/地形底图_经纬度'
        let url2 =
          'http://www.earthquake.ac.cn/iserver/services/map-tianditu/rest/maps/地形中文注记_经纬度'
        this.create2M(url1, url2)
      } else {
        this.create()
      }
    },
    create2M(rul1, rul2) {
      // for (let i = this.layerGroups._layers.length - 1; i >= 0; i--) {
      //   this.layerGroups.removeLayer(this.layerGroups._layers[i])
      // }
      if (this.lwShow) {
        if (this.lyr1 !== null) {
          this.layerGroups.removeLayer(this.lyr1)
          this.layerGroups.removeLayer(this.lyr2)
        }
        this.lyr1 = tiledMapLayer(rul1)
        this.lyr2 = tiledMapLayer(rul2)

        this.lyr1.addTo(this.layerGroups)
        this.lyr2.addTo(this.layerGroups)
      } else {
        if (this.lyr1 !== null) {
          this.layerGroups.removeLayer(this.lyr1)
          this.layerGroups.removeLayer(this.lyr2)
        }
        this.lyr1 = tiledMapLayer(rul1)
        this.lyr1.addTo(this.layerGroups)
      }
    },
    //框选
    rectangle() {
      this.map.on('pm:remove', e => { //监听删除
        this.drawing = false
        if (this.circle_group1) {
          this.circle_group1.clearLayers()
        }
        this.rectanglist = []
        this.$emit('lists', this.mapList)
      }) 
      this.map.on("pm:drawstart", e => {
        this.drawing = true
        if (this.circle_group1) {
          this.circle_group1.clearLayers()
        }
        this.rectanglist = []
        this.$emit('lists', this.mapList)
      });
      console.log(this.mapList)
      this.map.on("pm:create", e => {
      let myIcon = L.icon({
        iconUrl: mini, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
        if(e.shape == "Rectangle"){
        this.drawing = true
      let num = this.mapList.length
      let circles = []
        for (let i = 0; i < num; i++) {
          let deform = this.mapList[i]
          if(parseFloat(this.mapList[i].staLat) > e.layer._latlngs[0][0].lat && 
          parseFloat(this.mapList[i].staLon) > e.layer._latlngs[0][0].lng && 
          parseFloat(this.mapList[i].staLat) < e.layer._latlngs[0][2].lat && 
          parseFloat(this.mapList[i].staLon) < e.layer._latlngs[0][2].lng){
            this.rectanglist.push(this.mapList[i])
            let circle = L.marker([this.mapList[i].staLat, this.mapList[i].staLon], {
              icon: myIcon
            }).on('click', () => {
              this.$emit('maplist', this.mapList[i])
            })
            circles.push(circle)

          this.circle_group1 = new L.LayerGroup(circles).addTo(this.map)
          // this.map.setView([this.mapList[i].staLat, this.mapList[i].staLon], 7)
          }
        }
        this.$emit('lists', this.rectanglist)
      }else if(e.shape == "Circle"){
        // console.log(e, "绘制坐标")
        let num = this.mapList.length
      let circles = []
        for (let i = 0; i < num; i++) {
          let deform = this.mapList[i]
          
          if(this.getDistance(this.mapList[i].staLat,this.mapList[i].staLon,e.layer._latlng.lat,e.layer._latlng.lng)*1000 <= parseFloat(e.layer.options.radius)){
            this.rectanglist.push(this.mapList[i])
            let circle = L.marker([this.mapList[i].staLat, this.mapList[i].staLon], {
              icon: myIcon
            }).on('click', () => {
              this.$emit('maplist', this.mapList[i])
            })
            circles.push(circle)

          this.circle_group1 = new L.LayerGroup(circles).addTo(this.map)
          // this.map.setView([this.mapList[i].staLat, this.mapList[i].staLon], 7)
          }
        }
        this.$emit('lists', this.rectanglist)
      }
      });
    },
      //已知经纬度求距离函数
      getDistance(lat1, lng1, lat2, lng2) {
        const earthRadius = 6371; // 球形地球的半径，单位km
        const radiansLat1 = lat1 * Math.PI / 180; // 将经纬度转换为弧度
        const radiansLat2 = lat2 * Math.PI / 180;
        const radiansLng1 = lng1 * Math.PI / 180;
        const radiansLng2 = lng2 * Math.PI / 180;
        const deltaLat = radiansLat1 - radiansLat2; // 经度和纬度的差值
        const deltaLng = radiansLng1 - radiansLng2;
        const a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radiansLat1) * Math.cos(radiansLat2) * Math.pow(Math.sin(deltaLng / 2), 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // 计算球面距离
        const distance = earthRadius * c; // 将距离转换为km
        return distance;
      },
    // 画线
    setLine() {
      if (this.line_group) {
        this.line_group.clearLayers()
        if (this.line_group1) {
          this.line_group1.clearLayers()
        }
      }

      let lines = []
      let line_map = {}
      for (let i = 0; i < this.deformationlist.length; i++) {
        let Line = this.deformationlist[i]
        // let txt = `测线名称：${Line.lineName}<br/>`  .bindPopup(txt, { className: 'popupLineClass' })
        // .openPopup()
        if (Line.latAndLon.length >= 2) {
          let latlngs = Line.latAndLon
          let line = L.polyline(latlngs, { color: 'red' }).on('click', () => {
            this.highLine(Line)
            this.$emit('maplist', Line)
          })

          lines.push(line)
          line_map[i] = line
          this.line_group = new L.LayerGroup(lines).addTo(this.map)
        }
      }
    },
    // 高亮线
    highLine(Line) {
      let lines = []
      if (this.line_group1) {
        this.line_group1.clearLayers()
      }
      if (Line.latAndLon.length >= 2) {
        let latlngs = Line.latAndLon
        let line = L.polyline(latlngs, { color: 'blue' })

        lines.push(line)

        this.line_group1 = new L.LayerGroup(lines).addTo(this.map)
        this.map.flyToBounds(
          [Line.latAndLon[0], Line.latAndLon[Line.latAndLon.length - 1]],
          { maxZoom: 6 }
        )
      }
    },
    // 绘点
    addDraw() {
      if (this.circle_group) {
        this.circle_group.clearLayers()
      }

      let drawList = this.mapList.length

      let circles = []
      let circle_map = {}
      let ddIcon = L.icon({
        iconUrl: bit, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
      let dcIcon = L.icon({
        iconUrl: dc, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
      let ltIcon = L.icon({
        iconUrl: lt, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
      let xbIcon = L.icon({
        iconUrl: xb, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
      let a = /^31[.]*/
      let b = /^4[.]*/
      let c = /^3[2,4][.]*/
      let d = /^21[.]*/
      for (let j = 0; j < drawList; j++) {
        // 存在staLat经纬度
        if (this.mapList[j].staLat) {
          //  避免undefined
          if (!this.mapList[j].sta_name) {
            this.mapList[j].sta_name = this.mapList[j].pointName
          }
          // let txt = `${this.mapList[j].sta_name}台站<br/>  .bindPopup(txt, { className: 'popupClass' }) .openPopup()
          //   纬度: ${this.mapList[j].staLat.toFixed(2)}<br/>
          //   经度: ${this.mapList[j].staLon.toFixed(2)}`
          if (this.mapList[j].u_item) {
            // 地磁的点
            if (a.test(this.mapList[j].u_item) === true) {
              let circle = L.marker(
                [this.mapList[j].staLat, this.mapList[j].staLon],
                { icon: dcIcon }
              ).on('click', () => {
                this.$emit('maplist', this.mapList[j])
              })

              circles.push(circle)
              circle_map[j] = circle
            } else if (b.test(this.mapList[j].u_item) === true) {
              // 流体
              let circle = L.marker(
                [this.mapList[j].staLat, this.mapList[j].staLon],
                { icon: ltIcon }
              ).on('click', () => {
                this.$emit('maplist', this.mapList[j])
              })
              circles.push(circle)
              circle_map[j] = circle
            } else if (c.test(this.mapList[j].u_item) === true) {
              // 地电
              let circle = L.marker(
                [this.mapList[j].staLat, this.mapList[j].staLon],
                { icon: ddIcon }
              ).on('click', () => {
                this.$emit('maplist', this.mapList[j])
              })
              circles.push(circle)
              circle_map[j] = circle
            } else if (d.test(this.mapList[j].u_item) === true) {
              // 重力
              let circle = L.marker(
                [this.mapList[j].staLat, this.mapList[j].staLon],
                { icon: ddIcon }
              ).on('click', () => {
                this.$emit('maplist', this.mapList[j])
              })
              circles.push(circle)
              circle_map[j] = circle
            } else {
              // 其他
              let circle = L.marker(
                [this.mapList[j].staLat, this.mapList[j].staLon],
                { icon: xbIcon }
              ).on('click', () => {
                this.$emit('maplist', this.mapList[j])
              })

              circles.push(circle)
              circle_map[j] = circle
            }
            // }
          } else {
            let circle = L.marker(
              [this.mapList[j].staLat, this.mapList[j].staLon],
              { icon: ddIcon }
            ).on('click', () => {
              this.$emit('maplist', this.mapList[j])
            })
            circles.push(circle)
            circle_map[j] = circle
          }
        } else {
          let circle = L.marker(this.mapList[j], { icon: ddIcon }).on(
            'click',
            () => {
              this.$emit('maplist', this.mapList[j])
            }
          )
          circles.push(circle)
          circle_map[j] = circle
        }
        // debugger
      }
      this.circle_group = new L.LayerGroup(circles).addTo(this.map)
    },
    // 高亮的点
    highDraw() {
      if (this.circle_group1) {
        this.circle_group1.clearLayers()
      }

      let circles = []
      let myIcon = L.icon({
        iconUrl: dc, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
      let myIcon1 = L.icon({
        iconUrl: mini, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
      if (this.highSpot.type) {
        let circle = L.marker([this.highSpot.staLat, this.highSpot.staLon], {
          icon: myIcon1
        }).on('click', () => {
          this.$emit('maplist', this.highSpot)
        })
        circles.push(circle)
      } else {
        let circle = L.marker([this.highSpot.staLat, this.highSpot.staLon], {
          icon: myIcon
        }).on('click', () => {
          this.$emit('maplist', this.highSpot)
        })
        circles.push(circle)
      }

      this.circle_group1 = new L.LayerGroup(circles).addTo(this.map)
      this.map.setView([this.highSpot.staLat, this.highSpot.staLon], 6)
    },
    // 水准线的点
    lineHigh(val) {
      if (this.circle_group1) {
        this.circle_group1.clearLayers()
      }
      let circle_map = {}
      let myIcon1 = L.icon({
        iconUrl: bit, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
      let circles = []
      for (let i = 0; i < val.length; i++) {
        let item = val[i].latAndLon
        for (let j = 0; j < item.length; j++) {
          let heit = item[j]
          let circle = L.marker(heit, {
            icon: myIcon1
          }).on('click', () => {
            this.$emit('maplist', this.highSpot)
          })
          circle_map[j] = circle
          circles.push(circle)
        }
      }
      this.circle_group1 = new L.LayerGroup(circles).addTo(this.map)
    },
    // 画台站点
    stationDraw() {
      if (this.circle_group2) {
        this.circle_group2.clearLayers()
      }
      let drawList = this.stationSpot.length
      let circles = []
      let myIcon = L.icon({
        iconUrl: lt, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
      for (let j = 0; j < drawList; j++) {
        if (this.stationSpot[j].staLat === null) {
          this.$message.error('经纬度为空')
          return
        }
        let circle = L.marker(
          [this.stationSpot[j].staLat, this.stationSpot[j].staLon],
          { icon: myIcon }
        )
        circles.push(circle)
        // debugger
        this.circle_group2 = new L.LayerGroup(circles).addTo(this.map)
      }
    },
    // 台站列表点击
    clickStanList() {
      let arr = { staId: '', netId: '' }
      arr.staId = this.clickMap.id
      arr.netId = this.clickMap.netId
      this.drawer = true
      this.drawerTitle = `${this.clickMap.staCode}台站`
      this.getCataList(arr)
    },

    // 抽屉的关闭
    handleClose() {
      this.drawer = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-drawer__body {
  padding: 0 20px;
}
::v-deep .popupClass {
  bottom: -75px !important;
}
::v-deep .popupLineClass {
  top: -90px !important;
}
.showLatLon {
  position: absolute;
  top: 15px;
  right: 70px;
  z-index: 1008;
}
</style>
