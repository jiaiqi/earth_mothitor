<template>
  <div class="box">
    <div v-loading="loading" id="map" style="width: 100%;height: 90vh"></div>
    <div id="mouse-coordinates" class="showLatLon"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import bit from '@/assets/images/bit.png'
import yy from '@/assets/images/mini.png'
import blue from '@/assets/images/zi.png'
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
      circle_group: null,
      circle_group1: null,
      circle_group2: null,
      line_group: null,
      highSpot: null,
      stationSpot: null,
      //绘制中
      drawing: false,
      // 抽屉的打开
      drawer: false,
      drawerTitle: '',
      // tab表格的数据
      tableData: [],
      scale: 4,
      center: [30.7, 104],
      layerGroups: null,
      lyr1: null,
      lyr2: null,
      mapUrl: null
    }
  },
  props: ['list', 'restmap', 'deformation', 'highspot', 'stationspot'],
  created() {},
  computed: {
    ...mapState(['mapShow', 'lwShow'])
  },
  watch: {
    // 画点
    list(newVal) {
      if(this.drawing){
        return
      }
      if (newVal.length > 0) {
        let arr = [...newVal]
        arr.forEach(item=>{
          if(item.lat && item.lon){
            item.staLat = item.lat
            item.staLon = item.lon
          }
        })
        this.mapList = arr
        this.addDraw()
      } else {
        this.mapList = []
        this.addDraw()
      }
    },
    // 画线
    deformation(newVal, oldVal) {
      if (newVal) {
        this.deformationlist = newVal
        this.setLine()
      }
    },
    // 画高亮点
    highspot(newVal) {
      if (newVal) {
        this.highSpot = newVal
        this.highDraw()
      }
    },
    stationspot(newVal) {
      this.stationSpot = newVal
      this.stationDraw()
    },
    // 切换底图
    mapShow(newVal) {
      this.changeBaseLayer(newVal)
    },
    lwShow(newVal) {
      this.changeBaseLayer(this.mapShow)
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
    // require('leaflet.pm')
    // require('leaflet.pm/dist/leaflet.pm.css')
    map = L.map('map', {
      crs: L.CRS.EPSG4326,
      center: this.center,
      maxZoom: 10,
      minZoom: 3,
      zoom: this.scale,
      attributionControl: false,
      zoomControl: false,
      preferCanvas: true
    })
    this.layerGroups = new L.FeatureGroup()
    this.layerGroups.addTo(map)
    this.map = map
    // let dcLater = tiledMapLayer(url)
    // dcLater.addTo(this.layerGroups)
    // tiledMapLayer(urlLan, { transparent: true, opacity: 1 }).addTo(
    //   this.layerGroups
    // )
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
      console.log(e)
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
      }
    },
    create2M(rul1, rul2) {
      // for (let i = this.layerGroups._layers.length - 1; i >= 0; i--) {
      //   this.layerGroups.removeLayer(this.layerGroups._layers[i])
      // }
      console.log(rul1, rul2)
      console.log(this.map)
      console.log(this.layerGroups)
      if (this.lwShow) {
        console.log(this.lwShow,'路网')
        console.log(this.lyr1,this.lyr2)
        // if (this.lyr1 !== null) {
          // this.layerGroups.removeLayer(this.lyr1)
          // this.layerGroups.removeLayer(this.lyr2)
        // }
        this.lyr1 = tiledMapLayer(rul1)
        this.lyr2 = tiledMapLayer(rul2)

        this.lyr1.addTo(this.layerGroups)
        this.lyr2.addTo(this.layerGroups)
      } else {
        console.log(this.lwShow,'路网关')
        console.log(this.lyr1,this.lyr2)
        // if (this.lyr1 !== null) {
        //   this.layerGroups.removeLayer(this.lyr1)
        //   this.layerGroups.removeLayer(this.lyr2)
        // }
        console.log(1)
        this.lyr1 = tiledMapLayer(rul1)
        console.log(2)
        this.lyr1.addTo(this.layerGroups)
        console.log(3)
      }
      console.log(this.lyr1,this.lyr2)
    },
    //矩形框过滤
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
      this.map.on("pm:create", e => {
        if(e.shape == "Rectangle"){
        this.drawing = true
      // console.log(e, "绘制坐标")
      let num = this.mapList.length
      console.log(this.mapList)
      let myIcon = L.icon({
        iconUrl: yy, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
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
        let num = this.mapList.length
        let myIcon = L.icon({
          iconUrl: yy, // 图标路径
          iconSize: [14, 14], // 图标大小
          iconAnchor: [7, 7], // 图标 "tip" 的坐标
          popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
        })
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
      }
      let lines = []
      let line_map = {}
      for (let i = 0; i < this.deformationlist.length; i++) {
        let Line = this.deformationlist[i]
        if (Line.latAndLon.length >= 2) {
          let latlngs = Line.latAndLon
          let line = L.polyline(latlngs, { color: 'red' }).on('click', () => {
            // this.$emit('maplist', Line)
          })
          // this.map.fitBounds()  .getBounds()
          lines.push(line)
          line_map[i] = line
          this.line_group = new L.LayerGroup(lines).addTo(this.map)
        }
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
      let myIcon = L.icon({
        iconUrl: bit, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
      for (let j = 0; j < drawList; j++) {
        // console.log(this.mapList[j].staLat)
        if (this.mapList[j].staLat) {
          if (this.mapList[j].staLat === null) {
            this.$message.error('经纬度为空')
            return
          }
          let circle = L.marker(
            [this.mapList[j].staLat, this.mapList[j].staLon],
            { icon: myIcon }
          ).on('click', () => {
            this.$emit('maplist', this.mapList[j])
          })
          circles.push(circle)
          circle_map[j] = circle
        } else {
          let circle = L.marker(this.mapList[j], { icon: myIcon }).on(
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
        iconUrl: yy, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
      // let txt = `发震地点：${this.highSpot.shockAddr}<br/>
      //   震级：${this.highSpot.shockLevel}级<br/>
      //   地震深度：${this.highSpot.depth}KM<br/>
      //   发震日期：${this.highSpot.shockDate}  ${this.highSpot.shockTime}<br />
      //   <span>纬度: ${this.highSpot.staLat}</span><br/>
      //   <span>经度: ${this.highSpot.staLon}</span>
      // `  .bindPopup(txt, { className: 'popupClass' })
      // .openPopup()
      if (this.highSpot.shockAddr) {
        let circle = L.marker([this.highSpot.staLat, this.highSpot.staLon], {
          icon: myIcon
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
      this.map.setView([this.highSpot.staLat, this.highSpot.staLon], 7)
    },

    // 画台站点
    stationDraw() {
      if (this.circle_group2) {
        this.circle_group2.clearLayers()
      }
      let drawList = this.stationSpot.length
      let circles = []
      let myIcon = L.icon({
        iconUrl: blue, // 图标路径
        iconSize: [14, 14], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
      for (let j = 0; j < drawList; j++) {
        if (this.stationSpot[j].staLat === null) {
          this.$message.error('经纬度为空')
          return
        }
        //   let txt = `台站名称：${this.stationSpot[j].sta_name}<br/>
        //       仪器名称：${this.stationSpot[j].instrument}<br/>
        //       台基类型：${this.stationSpot[j].sta_type}<br/>
        //      数采类型：${this.stationSpot[j].data_mining}<br />
        //     <span>纬度: ${this.stationSpot[j].lat}</span><br/>
        //      <span>经度: ${this.stationSpot[j].lon}</span>
        // `.bindPopup(null, { className: 'popupClass' })
        let circle = L.marker(
          [this.stationSpot[j].staLat, this.stationSpot[j].staLon],
          { icon: myIcon }
        ).on('click', () => {
          this.$emit('stationDraw', this.stationSpot[j])
        })

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
  bottom: -60px !important;
}
.showLatLon {
  position: absolute;
  top: 15px;
  right: 70px;
  z-index: 1008;
}
</style>
>
