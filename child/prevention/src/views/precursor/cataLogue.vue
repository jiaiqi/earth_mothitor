<template>
  <div class="refuge">
    <div>
      <cart :drawerTitle="drawerTitle" :drawer="drawer1" :addCartList="addCartList" @showDraw="changeShow" @cartList="changeCartList"></cart>
    </div>
    <el-container>
      <el-main style="position: relative; height: 100%;">
        <div class="topNav">
          <top-nav :pageName="'震防数据'"></top-nav>
        </div>
        <!-- <el-dialog style="margin-top:50px" title="关于活断层探测数据的提示" :visible.sync="TipDialog" width="56%">
          <div v-html="tipText">
          </div>
        </el-dialog> -->
        <div class="start-list">
          <!--  台网列表 -->
          <div class="list" v-if="!show">
            <el-input
              placeholder="输入关键字进行过滤"
              size="mini"
              v-model="filterText"
            >
            </el-input>
            <el-tree
              :data="comTreeList"
              ref="tree"
              :filter-node-method="filterNode"
              :props="defaultProps"
              accordion
              @node-click="handleNodeClick"
            >
            </el-tree>
          </div>
        </div>
        <div
          class="cartBtn"
          @click="drawer1 = true"
        >
          <el-badge :value="addCartList ? addCartList.length : 0" :max="99" class="item">
            <i class="el-icon-shopping-cart-2"></i>
          </el-badge>
          <p style="padding:0px 15px;line-height: 22px;">成果车</p>
        </div>
        <!-- 右侧弹窗 -->
        <div class="dataList2" :style="{ 'margin-top': top + 'px' }">
          <div class="close" @click="closeDraw">
            <i class="el-icon-caret-top"></i>
          </div>
          <el-button class="addcart" :style="{ 'margin-top': (top - 50) + 'px' }" 
          type="danger" size="mini" @click="addCart(comTreeList2)">加入成果车</el-button>
          <!-- 详细数据 -->
          <el-table
            class="dataListTable"
            :data="deformationLine"
            @selection-change="handleSelectionChange"
            stripe
            style="width: 100%"
            size="mini"
            height="460"
            :modal="false"
          >
          <el-table-column
                type="selection"
                width="30">
              </el-table-column>
            <el-table-column prop="sta_name" align="center" label="名称">
              <template slot-scope="scope">
                <div @click="maplist(scope.row)" style="cursor:pointer">
                  <span slot="reference">{{ scope.row.descriptions }}</span>
                </div>
                <!-- <el-popover placement="top" width="300" trigger="hover">
                  <mack-drawer
                    :markeArr="scope.row"
                    @markees="markees"
                  ></mack-drawer>
                </el-popover> -->
              </template>
            </el-table-column>
            <el-table-column prop="collectDataDate" align="center" label="竣工日期">
              <template slot-scope="scope">
                <div @click="maplist(scope.row)">
                  <span slot="reference" v-if="title=='钻孔联合剖面'">{{ new Date(scope.row.completionDate).toLocaleDateString() }}</span>
                  <span slot="reference" v-else>{{scope.row.completionDate}}</span>
                </div>
                </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 地图 -->
        <div class="box" v-if="!showName">
          <div id="map" style="width: 100%; height: 90vh"></div>
        </div>
        <div class="change2D">
          <div class="switch-btn" @click="changeBaseLayer('dx')">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="imageDX" class="image" />
              <div class="bottom">
                <span>地形图</span>
              </div>
            </el-card>
          </div>
          <div class="switch-btn sl" @click="changeBaseLayer('sl')">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="imageSL" class="image" />
              <div class="bottom">
                <span>矢量图</span>
              </div>
            </el-card>
          </div>
          <div class="switch-btn yx" @click="changeBaseLayer('yx')">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="imageYX" class="image" />
              <div class="bottom">
                <span>影像图</span>
              </div>
            </el-card>
          </div>
          <div class="switch-btn yx" @click="changeLayer">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="imageLW" class="image" />
              <div class="bottom">
                <span>路网开关</span>
              </div>
            </el-card>
          </div>
        </div>
        <!-- 人工勘探&钻孔地图 -->
        <div class="box" v-if="showName">
          <selsmometry-map
            v-loading="loading"
            :list="station"
            @maplist="maplist"
            @lists="filterPlatList"
            :restmap="restmap"
            :deformation="deformationLine2"
            :highspot="highspot"
          ></selsmometry-map>
        </div>
        <!-- 点击地图标记点弹窗 -->
        <div
        v-if="markshow"
          class="markee"
        >
          <mack-drawer
            @markees="markees"
            :markeArr="marke"
            :title="title"
          ></mack-drawer>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import L from 'leaflet'
  import {
    LayerInfoService,
    tiledMapLayer,
    MapService
  } from '@supermap/iclient-leaflet'
import {
  getList,
  addCartApi
} from '@/api/cartList'
  import {
  hotDataAdd
} from '@/api/hots'
import {
  manpowerList,
  manpowerPointList,
  drillList,
  getPointDrillList
} from '@/api/probedata'
import Cookies from 'js-cookie'
import { Loading, Notification } from 'element-ui';
import { getToken } from '@/utils/auth'
import { encode, decode } from '@/utils/dataEncry'
  import { QueryByBoundsParameters } from "@supermap/iclient-common/iServer/QueryByBoundsParameters";
  import { queryService } from "@supermap/iclient-leaflet/services/QueryService.js"
  import imageDX from '@/assets/images/dx.png'
  import imageSL from '@/assets/images/sl.png'
  import imageYX from '@/assets/images/yx.png'
  import imageLW from '@/assets/images/lw.png'
  import mackDrawer from '@/components/mackDrawer.vue'
  import selsmometryMap from '@/components/map/index.vue'
  import cart from '@/components/cart.vue'
  import { mapState } from 'vuex'
  import TopNav from '../../components/topNav.vue'
  export default {
    data() {
      return {
        mapShow: 'sl',
        lyr1: null,
        lyr2: null,
        imageDX: imageDX,
        imageSL: imageSL,
        imageYX: imageYX,
        imageLW: imageLW,
        // 显示Tips窗口
        TipDialog: false,
        //提示信息
        tipText: '',
        // 地图资源
      restmap: {
        url: '/map-tianditu/rest/maps/地形底图_经纬度',
        urlLon: '/map-tianditu/rest/maps/地形中文注记_经纬度'
      },
      // 树结构的属性
      comTreeList: [
        {
          name: '活动断层(1:250万)',
          url: process.env.VUE_APP_BASE_API+'/iserver/services/map-fifth_workspace/rest/maps/全国断裂活动性配L%40fifth_data'
        },
        {
          name: '活动断层(1:25万)',
          url: '',
          children:[
            {
              name: '安徽省',
              url:process.env.VUE_APP_BASE_API+'/iserver/services/map-zhenfang25/rest/maps/安徽省1：25万地震构造图%40zhenfang25'
            },
            {
              name: '陕西省',
              url:process.env.VUE_APP_BASE_API+'/iserver/services/map-zhenfang25/rest/maps/陕西活断层分布%40zhenfang25'
            }
          ]
        },
        {
          name: '活动断层(1:5万)',
          url: process.env.VUE_APP_BASE_API+'/iserver/services/map-zhenfang5/rest/maps/地质所1：5万活动断层填图%40zhenfang5'
        },
        {
          name: '钻孔联合剖面',
        },
        {
          name: '人工地震勘探',
        },
      ],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        top: -520,
        platName: [],
        typeName: '',
        drawer1: false,
        title: '活动断层',
        marke: null,
        filterText: '',
        markshow: false,
        show: false,
        highspot: null,
        map: '',
        loading: false,
        resultLayer: null,
        circle_group: null,
        comTreeList2: [],
        addCartList: [],
        station: [],
        showCartBtn: false,
        // 抽屉的打开
        drawer: false,
        showName: false,
        drawerTitle: '',
        // tab表格的数据
        scale: 3,
        center: [30.7, 104],
        // 线
        deformationLine: [],
        //点
        deformationLine2: [],
        layerGroups: null,
        layer: null,
        bounds: null,
        childLayers: null
      }
    },
    components: { TopNav, mackDrawer, selsmometryMap, cart }, //,  selsmometryMap
    created() {
      // this.getCompany()
    },
    computed: { ...mapState(['lwShow']) },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      },
      lwShow(newVal) {
        this.changeBaseLayer(this.mapShow)
      }
    },

    mounted() {
      let map
      map = L.map('map', {
        crs: L.CRS.EPSG4326,
        center: this.center,
        maxZoom: 8,
        minZoom: 3,
        zoom: this.scale,
        attributionControl: false,
        zoomControl: false,
        preferCanvas: true
      })
      this.layerGroups = new L.FeatureGroup()
      this.layerGroups.addTo(map)
      this.map = map
      this.changeBaseLayer(this.mapShow)
      if(sessionStorage.getItem('tips')){
        this.tipText = sessionStorage.getItem('tips')
      }
      this.getCartList()
    },
    methods: {
      // 树的点击事件
      handleNodeClick(data) {
        if(data.name == '钻孔联合剖面' || data.name == '人工地震勘探'){
          this.typeName = data.name
          this.title = data.name
          this.markshow = false
          this.handleNodeClick2(data)
          return
        }
        if(this.typeName != ''){
          this.$router.go(0)
        }
        this.typeName = ''
        this.showName = false
        this.title = '活动断层'
        if (this.layer !== null) {
          this.layerGroups.removeLayer(this.layer)
        }
        // 创建图层
        this.layer = tiledMapLayer(data.url, {
          layers: data.name,
          transparent: true,
          zIndex: 1000
        })
        // 把图层添加到图层组里,方便管理
        this.layerGroups.addLayer(this.layer)
        // 把图层添加到map上
        this.mapService(data.url)
        let form = {
          keyName: '活动断层数据集',
          url: '/prevention/catalogue',
          linkUnit: this.tipText
        }
        hotDataAdd(encode(form)).then()
      },
      // 查询图层信息
      mapService(url) {
        // let layer = null
        let getLayerInfoService = new LayerInfoService(url)
        getLayerInfoService.getLayersInfo((ser) => {
          let result = ser.result
          // layer = result
          this.childLayers = result.subLayers.layers
          this.bounds = this.childLayers[0].bounds

          this.map.fitBounds([
            [this.bounds.top, this.bounds.left],
            [this.bounds.bottom, this.bounds.right]
          ])
          // let innerHTML = ''
          // result.subLayers.layers.map((layer) => {
          //   return (innerHTML += layer.name + '<br>')
          // })
        })
        this.service(url);
        let polygon = L.polygon([[15, 70], [15, 136], [55, 136], [55, 70]]);
        let boundsParam = new QueryByBoundsParameters({
          queryParams: { name: "全国断裂活动性配L@fifth_data#1" },
          bounds: polygon.getBounds()
        });
        // let currentmap = this.map;
        const self = this
        queryService(url).queryByBounds(boundsParam, function (serviceResult) {
            let result = serviceResult.result;
            let resMap = result.recordsets[0].features;
            L.geoJSON(resMap, {
               style: function(feature) {
                return {
                  opacity: 0
                };
              },
              onEachFeature: function (feature, layer) {
                 layer.bindPopup("断层名称：" + feature.properties.FaultName);
                  layer.on({
                    click: (e) => {
                      self.markshow = true
                      self.marke = feature.properties
                    }
                  });
              }
            }).addTo(self.map);
        });
        // console.log(this.resultLayer)
      },
      service(url) {
        let mapservice = new MapService(url)
        // 地图信息
        mapservice.getMapInfo((callback) => {
          let result = callback.result
          let innerHTML =
            '地图名' + '：' + JSON.stringify(result.name, null, 2) + '<br>'
          innerHTML +=
            '中心点' + ':' + JSON.stringify(result.center, null, 2) + '<br>'
          innerHTML += 'Bounds:' + JSON.stringify(result.bounds, null, 2) + '<br>'
        })
      },
      // 过滤
      filterNode(value, data) {
        if (!value) return true
        return data.unitName.indexOf(value) !== -1
      },
      // 获取地图数据
    handleNodeClick2(data) {
      if (data.name === '钻孔联合剖面') {
        let data = encode({})
      manpowerList(data)
        .then((res) => {
          let list = decode(res)
          let pointList = []
          list.map(item=>{
            pointList = pointList.concat(item.childPoints.map(i=>{
              return [i.lon,i.lat]
            }))
          })
          this.deformationLine = list
          this.deformationLine2 = [{latAndLon:pointList}]
          this.loading = false
          this.showName = true
          // this.treeData = list
        })
        .catch(() => {
          this.$message.error('请先登录')
        })
        this.top = 30
        let form = {
          keyName: '钻孔联合剖面数据集',
          url: '/prevention/catalogue?type=0',
        }
        // hotDataAdd(encode(form)).then()
      }else{
        let data = encode({})
        drillList(data)
        .then((res) => {
          let list = decode(res)
          let pointList = []
          list.map(item=>{
            pointList = pointList.concat(item.childPoints.map(i=>{
              return [i.lat,i.lon]
            }))
          })
          this.deformationLine = list
          this.deformationLine2 = [{latAndLon:pointList}]
          this.loading = false
          this.showName = true
          // this.treeData = list
        })
        .catch(() => {
          this.$message.error('请先登录')
        })
        this.top = 30
        let form = {
          keyName: '人工地震勘探数据集',
          url: '/prevention/catalogue?type=0',
        }
        // hotDataAdd(encode(form)).then()
      }
    },
      // 切换底图
      changeLayer() {
        let lwshow = this.$store.state.lwShow
        this.$store.commit('lwOpenUp', !lwshow)
      },
      closeDraw() {
        this.top = -520
      },
      changeShow(state) {  //购物车显示与关闭
        this.drawer1 = state
      },
      //监听子组件移除购物车内容
      changeCartList(list) {
        this.addCartList = list
      },
      getCartList() {
        getList({
          userName: Cookies.get('username')
        }).then(res=>{
          this.addCartList = res
        })
      },
      handleSelectionChange(val) {
      if (val.length === 0) {
        this.comTreeList2 = []
        this.showCartBtn = false
      } else {
        this.showCartBtn = true
        this.comTreeList2 = val
      }
    },
      markees(val) {
        this.markshow = false
      },
      // 地图标记点点击
      maplist(val) {
        this.marke = val
        this.comTreeList2 = [val]
        this.station = val.childPoint
        this.highspot = val
        this.markshow = true
        this.title = this.typeName
        this.getCataList()
      },
      filterPlatList(val) {
        this.platName = val
      },
      //判断是否包含另一个数组
      includes(arr1, arr2) {
        return arr2.every(val => arr1.includes(val));
      },
      // 获取数据详情
      getCataList() {
        let data = {
          line_id: this.marke.id
          // line_id: 14
        }
        if(this.title == '人工地震勘探') {
          getPointDrillList(data).then(res=>{
            let list = [...res.records]
            let dot = []
            list.map(item=>{
              dot.push([item.lat,item.lon])
            })
            let arr = [{
              latAndLon: [...dot]
            }]
            this.deformationLine2 = arr
          })
        }else{
          // 连续站
          manpowerPointList(data).then((res) => {
            let list = [...res.records]
            if(list.length == 0){
              this.$message.error('暂无点数据')
              return
            }
            let dot = []
            list.map(item=>{
              dot.push([item.lat,item.lon])
            })
            let arr = [{
              latAndLon: [...dot]
            }]
            this.deformationLine2 = arr
            // this.deformation = list
            // this.platName = [{
            //   collectDataDate: this.deformation[0].date,
            //   lineName: this.deformation[0].description
            // }]
            // this.drawer = true
          })
        }
      
      },
      // 切换地图
      changeBaseLayer(e) {
        this.mapShow = e
        if (e === 'sl') {
          let url1 =
            'http://www.earthquake.ac.cn/iserver/services/map-tianditu/rest/maps/%E7%9F%A2%E9%87%8F%E5%BA%95%E5%9B%BE_%E7%BB%8F%E7%BA%AC%E5%BA%A6'
          let url2 =
            'http://www.earthquake.ac.cn/iserver/services/map-tianditu/rest/maps/%E7%9F%A2%E9%87%8F%E4%B8%AD%E6%96%87%E6%B3%A8%E8%AE%B0_%E7%BB%8F%E7%BA%AC%E5%BA%A6'
          this.create2M(url1, url2)
        } else if (e === 'yx') {
          let url1 =
            'http://www.earthquake.ac.cn/iserver/services/map-tianditu/rest/maps/%E5%BD%B1%E5%83%8F%E5%BA%95%E5%9B%BE_%E7%BB%8F%E7%BA%AC%E5%BA%A6'
          let url2 =
            'http://www.earthquake.ac.cn/iserver/services/map-tianditu/rest/maps/%E5%BD%B1%E5%83%8F%E4%B8%AD%E6%96%87%E6%B3%A8%E8%AE%B0_%E7%BB%8F%E7%BA%AC%E5%BA%A6'
          this.create2M(url1, url2)
        } else if (e === 'dx') {
          let url1 =
            'http://www.earthquake.ac.cn/iserver/services/map-tianditu/rest/maps/%E5%9C%B0%E5%BD%A2%E5%BA%95%E5%9B%BE_%E7%BB%8F%E7%BA%AC%E5%BA%A6'
          let url2 =
            'http://www.earthquake.ac.cn/iserver/services/map-tianditu/rest/maps/%E5%9C%B0%E5%BD%A2%E4%B8%AD%E6%96%87%E6%B3%A8%E8%AE%B0_%E7%BB%8F%E7%BA%AC%E5%BA%A6'
          this.create2M(url1, url2)
        }
      },
          //添加购物车事件
    addCart(list){
      if(list.length == 0){
        return
      }
      let token = getToken()
      if (!token) {
        Notification.error({
          title: '提示',
          message: '用户未登录！请登录再试'
        });
        return
      }

        let list2 = list
        let list3 = {
          records: {
            datas: []
          }
        }
        const loading = Loading.service({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
        });
        list2.map((item,index)=>{
          let sendDept = ''
          let dataObj = {}
            item.orderClasses = this.title+'数据'+'_'+item.directoryName
            item.classesStandby = '描述：' + item.descriptions +'；项目名称：'+item.projectName+ '；提供单位：'+item.distributionDepartment+ '；联系人：'+item.personToContact+ '；联系方式：'+item.phoneNum
            sendDept = item.distributionDepartment
            dataObj = {
              orderClasses:item.orderClasses,
              classesStandby:item.classesStandby,
              userName:Cookies.get('username'),
              sentDept: sendDept,
              subjectId: 16
            }
            list3.records.datas.push({...dataObj})
            // item.select = false
        })
        if(!this.includes(this.addCartList,list2)){
          this.addCartList = this.addCartList.concat(list2)
        }
        this.comTreeList2 = []
        if(list3.records.datas.length != 0){
        addCartApi(encode(list3)).then(res=>{
          this.getCartList()
          loading.close();
          this.drawer1 = true
        }).catch(e=>{
          this.$message.error(e)
            loading.close();
          })
        }else{
          loading.close();
        }
        
    },
      create2M(rul1, rul2) {
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-main {
    position: relative;
    width: 100%;
    padding: 0px;
    .topNav {
      position: absolute;
      z-index: 998;
      top: 20px;
      left: 20px;
      background-color: #fff;
      padding: 10px;
      border-radius: 15px;
      box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
    }
    .start-list {
      position: absolute;
      z-index: 1000;
      left: 20px;
      top: 80px;
      width: 220px;
      height: 500px;
      padding: 5px;
      border-radius: 10px;
      background-color: #fff;
      .list {
        width: 100%;
        height: 460px;
        position: relative;
        .stationShow {
          position: absolute;
          right: 0;
          top: -15px;
          padding: 5px;
          cursor: pointer;
        }
        .stationTxt {
          background-color: #f0f0f0;
          border-bottom: 2px solid #fff;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
      }
      .footer {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .change2D {
      z-index: 2000;

      position: absolute;
      bottom: 20px;
      right: 20px;
      .switch-btn {
        height: 80px;
        width: 120px;
        padding: 5px;
        border-radius: 5px;
        background-clip: content-box;
        display: inline-block;
      }
      .circle {
        width: 80px;
      }
      ::v-deep .el-card__body {
        flex-direction: column;
      }
      .switch-btn .image {
        width: 100%;
        height: 60px;
        display: block;
        opacity: 0.8;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        margin: 0 auto;
      }
      .circle .image {
        margin-top: 10px;
        width: 60px;
        border-radius: 40px;
        border: 2px solid #99999966;
      }
      .bottom {
        text-align: center;
        cursor: default;
        color: #409eff;
      }
    }
  }
  .dataList2 {
    position: absolute;
    z-index: 998;
    right: 55px;
    top: 20px;
    width: 260px;
    height: 530px;
    overflow: auto;
    padding: 2px;
    transition: margin-top 0.4s ease-out;
    -webkit-transition: margin-top 0.4s ease-out;
    -moz-transition: margin-top 0.4s ease-out;
    -o-transition: margin-top 0.4s ease-out;
    -ms-transition: margin-top 0.4s ease-out;
    .close {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      font-size: 20px;
      cursor: pointer;
    }
    .dataListTable {
      box-shadow: 2px 2px 10px 0px rgba(86, 86, 86, 0.5);
      border-radius: 12px;
    }
    // background-color: #fff;
    ::v-deep .el-table .cell {
      padding: 0 4px;
    }

    ::v-deep .el-table--border .el-table__cell:first-child .cell {
      padding-left: 0px;
    }
  }
  .mainCard {
    .el-tabs__heade {
      margin: 0;
    }
  }
  .box {
  min-height: 88vh;
}
.cartBtn {
    position: absolute;
    width: 45px;
    top: 300px;
    right: 7px;
    z-index: 999;
    box-shadow: 1px 1px 5px 0px rgb(131, 131, 131);
    background-color: #fff;
    font-size: 17px;
    padding: 13px 0px;
    cursor: pointer;
    text-align: center;
  }
  .cartBtn i{
    font-size: 28px;
    padding-bottom: 5px;
    font-weight: bold;
    text-align: center;
  }
  .markee {
    position: absolute;
    top: 20%;
    left: 260px;
    width: 280px;
    z-index: 1000;
    background: #fff;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    overflow: hidden;
    .main {
      padding: 10px;
      p {
        margin-bottom: 10px;
        span {
          font-weight: 700;
          margin-right: 10px;
        }
      }
      div {
        margin-bottom: 20px;
        border-bottom: 1px solid #000;
      }
      .el-button {
        margin-left: 40px;
      }
    }
  }
  .hide {
    display: none;
  }
  .title {
    color: #1492ff;
    padding: 10px;
    border-left: 5px solid #1492ff;
    margin-bottom: 20px;
  }

  ::v-deep .el-card__header {
    background-color: #1492ff;
    padding: 10px 20px;
  }
  ::v-deep .el-card__body {
    padding: 0 !important;
    display: flex;
  }
  ::v-deep.el-pagination.is-background .el-pager li {
    margin: 0;
  }
  @media (max-width: 1200px) {
    .el-container {
      width: 1200px;
    }
  }
</style>
