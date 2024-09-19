<template>
  <div class="box">
    <div v-loading="loading" id="map" style="width: 100%; height: 90vh"></div>
    <div id="mouse-coordinates" class="showLatLon"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import bit from '@/assets/images/bit.png'
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
      map: '',
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
      mapUrl: null,
      rectanglist: []
    }
  },
  props: ['list', 'restmap', 'deformation', 'highspot', 'stationspot'],
  created() {},
  computed: {
    ...mapState(['mapShow', 'lwShow'])
  },
  watch: {
    list(newVal) {
      if (newVal.length > 0) {
        this.mapList = newVal
        this.addDraw()
      } else {
        this.mapList = []
        this.addDraw()
      }
    },
    deformation(newVal, oldVal) {
      if (newVal) {
        this.deformationlist = newVal
        if(newVal[0].beginLongitude && newVal[0].beginLatitude){  //地震测深数据
          this.setLine()
        }else{
          this.setLine2()
        }
      }
    },
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
    mapShow(newVal) {
      this.changeBaseLayer(newVal)
    },
    lwShow(newVal) {
      this.changeBaseLayer(this.mapShow)
    }
  },
  beforeMount() {},
  mounted() {
    // 初始化底图
    let map = L.map('map', {
      crs: L.CRS.EPSG4326,
      center: this.center,
      maxZoom: 8,
      minZoom: 3,
      zoom: this.scale,
      doubleClickZoom: false, // 禁用双击放大
      attributionControl: false, // 移除右下角leaflet标识
      zoomControl: false,
      preferCanvas: true
    })
    // 创建一个图层组
    this.layerGroups = new L.FeatureGroup()
    this.layerGroups.addTo(map)

    this.map = map
    // 比例尺
    L.control.scale().addTo(map)
    // 绑定监听地图缩放事件
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
      }
    },
    create2M(rul1, rul2) {
      // for (let i = this.layerGroups._layers.length - 1; i >= 0; i--) {
      //   this.layerGroups.removeLayer(this.layerGroups._layers[i])
      // }
      this.loading = false
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
    //矩形框过滤
    rectangle() {
      this.map.on('pm:remove', e => { //监听删除
        if (this.circle_group1) {
          this.circle_group1.clearLayers()
        }
        this.rectanglist = []
        this.$emit('lists', this.deformationlist)
      }) 
      this.map.on("pm:drawstart", e => {
        if (this.circle_group1) {
          this.circle_group1.clearLayers()
        }
        this.rectanglist = []
        this.$emit('lists', this.deformationlist)
      });
      this.map.on("pm:create", e => {
      if(e.shape == "Rectangle"){
      let num = this.deformationlist.length
      let circles = []
        for (let i = 0; i < num; i++) {
          let deform = this.deformationlist[i]
          let startMark = [deform.startLat, deform.startLon]
          let endmark = [deform.endLat, deform.endLon]
          if(parseFloat(startMark[0]) > e.layer._latlngs[0][0].lat && 
          parseFloat(startMark[1]) > e.layer._latlngs[0][0].lng && 
          parseFloat(endmark[0]) < e.layer._latlngs[0][2].lat && 
          parseFloat(endmark[1]) < e.layer._latlngs[0][2].lng){
            this.rectanglist.push(this.deformationlist[i])
            let latlngs = [startMark, endmark]
            let circle = L.polyline(latlngs, { color: 'blue' }).on('click', () => {
              this.$emit('maplist', deform)
            })
            circles.push(circle)
            this.circle_group1 = new L.LayerGroup(circles).addTo(this.layerGroups)
          }
        }
        this.$emit('lists', this.rectanglist)
      }else if(e.shape == "Circle"){
        let num = this.deformationlist.length
      let circles = []
        for (let i = 0; i < num; i++) {
          let deform = this.deformationlist[i]
          let startMark = [deform.startLat, deform.startLon]
          let endmark = [deform.endLat, deform.endLon]
          if(this.getDistance(startMark[0],startMark[1],e.layer._latlng.lat,e.layer._latlng.lng)*1000 <= parseFloat(e.layer.options.radius)
            && this.getDistance(endmark[0],endmark[1],e.layer._latlng.lat,e.layer._latlng.lng)*1000 <= parseFloat(e.layer.options.radius)){
              this.rectanglist.push(this.deformationlist[i])
            let latlngs = [startMark, endmark]
            let circle = L.polyline(latlngs, { color: 'blue' }).on('click', () => {
              this.$emit('maplist', deform)
            })
            circles.push(circle)
            this.circle_group1 = new L.LayerGroup(circles).addTo(this.layerGroups)
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
    // 画线-地震测深数据
    setLine() {
      if (this.line_group) {
        this.line_group.clearLayers()
      }
      let lines = []

      let num = this.deformationlist.length
      for (let i = 0; i < num; i++) {
        let deform = this.deformationlist[i]
        let startMark = [deform.startLat, deform.startLon]
        let endmark = [deform.endLat, deform.endLon]
        let latlngs = [startMark, endmark]
        let line = L.polyline(latlngs, { color: 'red' }).on('click', () => {
          this.$emit('maplist', deform)
        })
        // this.map.fitBounds()  .getBounds()
        lines.push(line)
        this.line_group = new L.LayerGroup(lines).addTo(this.layerGroups)
      }
    },

    // 画线
    setLine2() {
      if (this.line_group) {
        this.line_group.clearLayers()
        if (this.line_group1) {
          this.line_group1.clearLayers()
        }
      }
      let lines = []
      let line_map = {}
      // for (let i = 0; i < this.deformationlist.length; i++) {
        let Line = this.deformationlist[0]
        // let txt = `测线名称：${Line.lineName}<br/>`  .bindPopup(txt, { className: 'popupLineClass' })
        // .openPopup()
        if (Line.latAndLon.length >= 2) {
          let latlngs = Line.latAndLon
          let line = L.polyline(latlngs, { color: 'red' }).on('click', () => {
            this.highLine(Line)
            this.$emit('maplist', Line)
          })

          lines.push(line)
          line_map[0] = line
          this.line_group = new L.LayerGroup(lines).addTo(this.map)
        }
      // }
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
      let myIcon = L.icon({
        iconUrl: bit, // 图标路径
        iconSize: [8, 8], // 图标大小
        iconAnchor: [7, 7], // 图标 "tip" 的坐标
        popupAnchor: [-3, -76] // 弹出窗口（popup）的坐标
      })
      for (let j = 0; j < drawList; j++) {
        if (this.mapList[j].lat) {
          if (this.mapList[j].lat === null) {
            this.$message.error('经纬度为空')
            return
          }
          let circle = L.marker(
            [this.mapList[j].lat, this.mapList[j].lon],
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
        this.circle_group = new L.LayerGroup(circles).addTo(this.map)
      }
    },
    // 高亮的点
    highDraw() {
      if (this.circle_group1) {
        this.circle_group1.clearLayers()
      }
      let circles = []

      let deform = this.highSpot
      let startMark = [deform.startLat, deform.startLon]
      let endmark = [deform.endLat, deform.endLon]
      let latlngs = [startMark, endmark]
      let circle = L.polyline(latlngs, { color: 'blue' }).on('click', () => {
        this.$emit('maplist', deform)
      })

      circles.push(circle)
      this.circle_group1 = new L.LayerGroup(circles).addTo(this.layerGroups)

      // this.map.setView([this.highSpot.staLat, this.highSpot.staLon], 6)
    },
    // // 处理多点数据
    setMapList() {
      let drawList = this.mapList.length // 数据长度
      let circles = []
      let circle_map = {}
      let limit = 200
      // var ciLayer = L.canvasIconLayer({}).addTo(this.map);
      let page = 0 // 当前页
      const totalPage = Math.ceil(drawList / limit) // 每页额数据
      const render = (page) => {
        if (page >= totalPage) return
        requestAnimationFrame(() => {
          for (let i = page * limit; i < page * limit + limit; i++) {
            let itemMap = this.mapList[i]
            // let txt = `${itemMap.staName}<br>经度：${itemMap.staLat}<br>纬度：${itemMap.staLon}`;
            let circle = L.marker([itemMap.staLat, itemMap.staLon]).on(
              'click',
              () => {
                this.$emit('maplist', itemMap)
              }
            )
            circles.push(circle)
            circle_map[i] = circle
            this.circle_group = new L.LayerGroup(circles).addTo(this.map)
          }
          render(page + 1)
        })
      }
      render(page)
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
        iconSize: [8, 8], // 图标大小
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
      // this.drawer = true
      // this.drawerTitle = `${this.clickMap.staCode}台站`
      // this.getCataList(arr)
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
.showLatLon {
  position: absolute;
  top: 15px;
  right: 70px;
  z-index: 1008;
}
</style>
