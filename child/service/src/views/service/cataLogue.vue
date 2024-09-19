<template>
  <div class="refuge">
    <div>
      <cart :drawerTitle="drawerTitle" :drawer="drawer" :addCartList="addCartList" @showDraw="changeShow" @cartList="changeCartList"></cart>
    </div>
    <el-container>
      <el-main style="position: relative; height: 100%">
<!--        <div-->
<!--          class="cartBtn"-->
<!--          @click="drawer = true"-->
<!--        >-->
<!--          <el-badge :value="addCartList ? addCartList.length : 0" :max="99" class="item">-->
<!--            <i class="el-icon-shopping-cart-2"></i>-->
<!--          </el-badge>-->
<!--          <p style="padding:0px 15px;line-height: 22px;">成果车</p>-->
<!--        </div>-->
        <div
          :class="{ stationlist: true, selected: !isActive }"
          :style="{ 'margin-top': top + 'px' }"
          @click="stationTap"
        >
          <i class="el-icon-tickets"></i>
        </div>
        <div
          :class="{ dataList2: true, selected: isActive }"
          :style="{ 'margin-top': top + 'px' }"
          @click="dataListTap"
        >
          <i class="el-icon-info"></i>
        </div>
<!--        <el-button class="addcart" :style="{ 'margin-top': (top + 8) + 'px' }"
        type="danger" size="mini" @click="addCart(comTreeList)">加入成果车</el-button>-->
        <div
          class="tiggle"
          @click="tiggle"
          v-if="!isChildProvince"
          :style="{ 'margin-left': left + 'px' }"
        >
          <i :class="icon"></i>
        </div>
        <div class="header">
          <!-- 头部当行蓝 -->
          <div class="topNav">
            <top-nav :pageName="'强震动'"></top-nav>
          </div>
          <top-sel class="topSel" type="强震动" :netList="yearList" :pointerList="treeList" @filter="blurValue" @filter2="maplist"></top-sel>
        </div>
        <el-dialog title="提示" :visible.sync="TipDialog" width="56%">
          <div v-html="tipText">
          </div>
          <!-- <span
            >未校正加速度记录数据文件包括头段和数据两部分，其格式均以ASCII
            的格式给出。头段行数为14
            行，空1行后为数据段的起始。头段的格式如下：</span
          >
          <el-table :data="tableData2" size="mini" style="width: 100%" stripe>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="value" label="值"></el-table-column>
          </el-table> -->
        </el-dialog>
        <div v-if="!isChildProvince" class="start-list" :style="{ 'margin-left': left + 'px' }">
          <left-draw
            :prop="props"
            :load="loadNode"
            :filterNodeMethod="filterNode"
            :nodeClick="handleNodeClick"
          >
          </left-draw>
          <!--  台网列表 -->
          <!-- <div class="list">
            <div style="display: flex">
              <el-button
                type="danger"
                class="tips-button"
                @click="showDialog"
                round
                size="mini"
                >Tips
              </el-button>
            </div>
            <el-table
              :data="yearList"
              size="mini"
              style="width: 100%;cursor: pointer;"
              stripe
              highlight-current-row
              height="420"
            >
              <el-table-column
                label="发震年份"
                align="center"
                sortable
              >
              <template slot-scope="scope">
                <div @click="blurValue(scope.row.year)">
                  {{scope.row.year}}
                </div>
              </template>
              </el-table-column>
            </el-table>
          </div> -->
        </div>
        <div class="dataList" :style="{ 'margin-top': top + 'px' }">
          <div style="display: flex;justify-content: space-between;">
            <!-- <div>
              <el-button class="cart" v-if="showCartBtn" type="danger" size="mini"
                >加入收藏车</el-button
              >
            </div> -->
            <div class="close" @click="closeDraw">
              <i class="el-icon-caret-top"></i>
            </div>
          </div>
          <div class="top">
            <el-input
              v-model="search"
              @input="searchFilter"
              prefix-icon="el-icon-search"
              size="mini"
              placeholder="输入关键字搜索"
              class="citySearch"
            >
            </el-input>
          </div>
          <div v-loading="loading1">
            <div v-if="event">
              <el-table
                v-show="!show && !showInfo"
                :data="
                  treeList
                "
                class="dataListTable"
                size="mini"
                row-key="id"
                style="width: 100%"
                stripe
                @selection-change="handleSelectionChange"
                highlight-current-row
                height="370"
              >
<!--                <el-table-column type="selection" width="40" />-->
                <el-table-column
                  prop="shockAddr"
                  label="发震地点"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div @click="maplist(scope.row)" style="cursor:pointer">
                      {{ scope.row.shockAddr }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="shockDate"
                  label="发震时间"
                  align="center"
                  width="110"
                  sortable
                >
                </el-table-column>
              </el-table>
            </div>
            <el-table
              v-show="!show && !showInfo"
              :data="
                treeList
              "
              v-if="!event"
              class="dataListTable"
              size="mini"
              row-key="id"
              style="width: 100%"
              stripe
              highlight-current-row
              height="370"
            >
              <el-table-column
                prop="staName"
                label="名称"
                align="center"
                width="70"
              >
                 <template slot-scope="scope">
                  <div @click="handleNodeClick({eventId:scope.row.id,row:scope.row})" style="cursor:pointer">
                    {{ scope.row.staName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="staType"
                label="类型"
                width="45"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="sensorModel"
                label="传感器型号"
                align="center"
                width="70"
              >
              </el-table-column>
              <el-table-column
                prop="startTime"
                label="建站时间"
                width="70"
                align="center"
              >
              </el-table-column>
            </el-table>
           <!-- 详细数据 -->
          <el-table
          v-show="show && !showInfo"
            class="dataListTable"
            :data="stationList"
            stripe
            style="width: 100%"
            size="mini"
            height="396"
            :modal="false"
          >
            <el-table-column prop="sta_name" align="center" label="台站名称">
              <template slot-scope="scope">
                <!-- <el-popover placement="top" trigger="hover">
                  <mack-drawer
                    :markeArr="scope.row"
                    :title="'地震周边台站'"
                    @markees="markees"
                    :dataLength="stationList.length"
                  ></mack-drawer> -->
                  <span slot="reference" style="cursor:pointer" @click="handleNodeClick({eventId:scope.row.event_id,name:scope.row.sta_name})">{{ scope.row.sta_name }}</span>
                <!-- </el-popover> -->
              </template>
            </el-table-column>
            <el-table-column prop="channel" width="70" label="通道方向"> </el-table-column>
            <el-table-column prop="datasize" width="70" label="数据量"> </el-table-column>
          </el-table>
          <div>
            <dateTree v-if="showInfo" style="width: 100%;height: 380px;background-color: #fff;" :days="staId" :staName="drawerTitle" :typeName="'强震动'" @addCartItem="addCartItem" @backSta="stationTap" @getInfo="getMarkeInfo"></dateTree>
          </div>
            <div v-if="!show" style="text-align:center;font-size: 13px;background-color: #fff;padding: 5px 0px;">数据个数：{{treeList.length}}</div>
          </div>
        </div>
        <!-- 台站数据详情弹框 -->
        <div
          v-if="markshow"
          class="markee"
          :style="{ 'margin-left': left + 'px' }"
        >
          <mack-drawer
            :markeArr="marke"
            :title="drawertitle"
            @markees="markees"
            :dataLength="stationList.length"
            :datasize="sumdatasize"
          ></mack-drawer>
        </div>

        <!-- 地图 -->
        <div class="box">
          <selsmometry-map
            v-loading="loading"
            :list="station"
            :highspot="highspot"
            :stationspot="stationspot"
            @maplist="maplist"
            @stationDraw="stationDraw"
            @lists="filterPlatList"
            :restmap="restmap"
            :mapShow="mapShow"
          ></selsmometry-map>
        </div>
        <div class="change2D" v-show="!loading">
          <change-map></change-map>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import searchlTable from '@/components/searchITable.vue'
import { encode, decode } from '@/utils/dataEncry'
import dateTree from '@/components/date/dateTree.vue'
import {
  getCompanyList,
  getStation,
  getcata,
  likeList,
  getAllStation
} from '@/api/selsmometry'
import Cookies from 'js-cookie'
import {
  getList,
  addCartApi
} from '@/api/cartList'
import {
  hotAdd,
  hotDataAdd,
  getFlagList
} from '@/api/hots'
import { Loading } from 'element-ui';
import { getVibration, getEventList, getyear, getVibrationList, getStationStrong, getDataStrong } from '@/api/vibration'
import { provinceAndCityData } from 'element-china-area-data'
import selsmometryMap from '@/components/map/index.vue'
import changeMap from '@/components/changeMap.vue'
import leftDraw from '@/components/mapFilter/leftDraw.vue'
import TopNav from '../../components/topNav.vue'
import topSel from '@/components/mapFilter/topSel.vue'
import mackDrawer from '@/components/mackDrawer.vue'
import cart from '@/components/cart.vue'
import { getToken,getUser } from '@/utils/auth'
import { Notification } from 'element-ui'
export default {
  data() {
    return {
      // 选择年份
      dateList: [],
      selectYear: false,
      // 显示Tips窗口
      TipDialog: false,
      //提示信息
      tipText: '',
      // 选中的年份
      selectDate: [],
      loading1: true,
      // 台站数据
      stationList: [],
      treeList: [],
      addCartList: [], //购物车列表
      comTreeList: [],
      loading: true,
      markshow: false,
      // 选择右侧选项卡样式
      isActive: false,
      show: false,
      showCartBtn: false,
      drawertitle: null,
      drawShow: null,
      drawerTitle: '',
      drawer: false, //购物车开关
      left: 0,
      top: -560,
      icon: 'el-icon-caret-left',
      // 日历的切换
      activeName: 'third',
      // 日历的隐藏
      activeShow: false,
      props: {
        label: 'unitName',
        children: 'zones',
        isLeaf: 'leaf'
      },
      // tab表格的数据
      tableData: [],
      tableData2: [
        {
          name: '记录编号',
          value: 'ZGZ02050601'
        },
        {
          name: '地震编号、地震年、月、日、时、分、秒、标准时间',
          value: '020501 02-05-06 12-47-20 UTC'
        },
        {
          name: '地震名称、地点、国别',
          value: 'XIANGTANG EARTHQUAKE, LUAN XIAN, CHINA'
        },
        {
          name: '震中纬度、经度',
          value: 'EPICENTER 39.562N 118.614E'
        },
        {
          name: '震源深度',
          value: 'DEPTH 10KM'
        },
        {
          name: '震级',
          value: 'MAG. 6.0(ML)'
        },
        {
          name: '台站名称（代码）、台站纬度、经度',
          value: 'STATION: ZHONGGUANCUN（91ZGC） 39.800N 116.267E'
        },
        {
          name: '仪器型号',
          value: 'INSTRUMENT TYPE: ETNA'
        },
        {
          name: '测点位置',
          value: 'OBSERVING POINT: G'
        },
        {
          name: '测量方向',
          value: 'COMP. V'
        },
        {
          name: '产品数据名称、物理单位',
          value: 'UNCORRECTED ACCCELERATION UNIT: CM/SEC/SEC'
        },
        {
          name: '采样点数、采样率',
          value: 'NO. OF POINTS: 30000 EQUALLY SPACED INTERVALS OF: .005 SEC'
        },
        {
          name: '峰值加速度、峰值加速度发生时间、记录长度',
          value: 'PEAK VALUE: -35.746 AT 35.56 SEC DURATION: 120 SEC'
        },
        {
          name: '预存储时间、场地条件',
          value: 'PRE-EVENT TIME: 20 SEC SITE CONDITION: soil'
        },
        {
          name: '空 1 行',
          value: '.000 .000 -.060 .000 .060 .000 .000 .000'
        },
        {
          name: '数据段开始',
          value: '.060 .000 .000 .000 .000 .000 .060 .000'
        }
      ],
      // 树结构的属性
      treeshow: true,
      defaultProps: {
        children: 'children',
        label: 'shockAddr'
      },
      search: '',
      filterText: '',
      // 按城市查询的数据
      options: provinceAndCityData,
      selectedOptions: [],
      map: null,
      staId: null,
      circle_group: null,
      input: '',
      title: '测震数据',
      title1: '',
      yearList: [],
      company: [],
      station: [],
      shockAddr: '',
      sumdatasize: 0,
      showInfo: false,
      event: true,
      // 查询参数
      networkOption: {
        netId: 1
      },
      //子站
      isChildProvince: false,
      total: 0,
      marke: null,
      num: 0,
      //台网列表
      netList: [{"id":2,"netCode":"BJ","netName":"北京","sortNum":1},{"id":29,"netCode":"TJ","netName":"天津","sortNum":2},{"id":12,"netCode":"HE","netName":"河北","sortNum":3},{"id":28,"netCode":"SX","netName":"山西","sortNum":4},{"id":20,"netCode":"NM","netName":"内蒙","sortNum":5},{"id":19,"netCode":"LN","netName":"辽宁","sortNum":6},{"id":16,"netCode":"JL","netName":"吉林","sortNum":7},{"id":14,"netCode":"HL","netName":"黑龙江","sortNum":8},{"id":26,"netCode":"SH","netName":"上海","sortNum":9},{"id":17,"netCode":"JS","netName":"江苏","sortNum":10},{"id":33,"netCode":"ZJ","netName":"浙江","sortNum":11},{"id":27,"netCode":"AH","netName":"安徽","sortNum":12},{"id":5,"netCode":"FJ","netName":"福建","sortNum":13},{"id":18,"netCode":"JX","netName":"江西","sortNum":14},{"id":25,"netCode":"SD","netName":"山东","sortNum":15},{"id":10,"netCode":"HA","netName":"河南","sortNum":16},{"id":11,"netCode":"HB","netName":"湖北","sortNum":17},{"id":15,"netCode":"HN","netName":"湖南","sortNum":18},{"id":6,"netCode":"GD","netName":"广东","sortNum":19},{"id":8,"netCode":"GX","netName":"广西","sortNum":20},{"id":13,"netCode":"HI","netName":"海南","sortNum":21},{"id":4,"netCode":"CQ","netName":"重庆","sortNum":22},{"id":3,"netCode":"SC","netName":"四川","sortNum":23},{"id":9,"netCode":"GZ","netName":"贵州","sortNum":24},{"id":32,"netCode":"YN","netName":"云南","sortNum":25},{"id":31,"netCode":"XZ","netName":"西藏","sortNum":26},{"id":1,"netCode":"SN","netName":"陕西","sortNum":27},{"id":7,"netCode":"GS","netName":"甘肃","sortNum":28},{"id":22,"netCode":"QH","netName":"青海","sortNum":29},{"id":21,"netCode":"NX","netName":"宁夏","sortNum":30},{"id":30,"netCode":"XJ","netName":"新疆","sortNum":31},{"id":1086455809,"netCode":"GB","netName":"北京","sortNum":99}],
      // 存储高亮点的数据
      highspot: null,
      stationspot: null,
      linkInfo: {},
      // 地图资源
      restmap: {
        url: '/map-tianditu/rest/maps/矢量底图_经纬度',
        urlLon: '/map-tianditu/rest/maps/矢量中文注记_经纬度'
      },
      mapShow: null,
      // 表格筛选的元素
      searchRabel: ''
    }
  },
  components: {
    mackDrawer,
    leftDraw,
    selsmometryMap,
    changeMap,
    TopNav,
    topSel,
    cart,
    dateTree
  },
  created() {
    this.selectYear = false
/*    if(sessionStorage.getItem('province') === '') {
       this.getyear()
    }*/
    //注释是为了把强震动事件的年份显示出来
    this.getyear()
  },
  beforeMount() {},
  mounted() {
    if(sessionStorage.getItem('tips')){
      this.tipText = sessionStorage.getItem('tips')
    }
    if(JSON.parse(getUser())){
      this.getCartList()
    }
    this.getHotList()
    if(sessionStorage.getItem('province') == ''|| !sessionStorage.getItem('province')) {
      this.isChildProvince = false
    }else{
      this.isChildProvince = true
      this.netList.map(item=>{
        if(sessionStorage.getItem('province').indexOf(item.netName) != -1) {
          this.handleNodeClick({
            netName: item.netName,
            netCode: item.netCode,
            leaf: true
          })
        }
      })
    }
  },
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 切换底图
    changeBaseLayer(e) {
      this.mapShow = e
    },
    showDialog() {
      this.TipDialog = !this.TipDialog
    },
    getCartList() {
      getList({
        userName: Cookies.get('username')
      }).then(res=>{
        this.addCartList = res
      })
    },
    // 获取年份
    getyear() {
      getyear().then((res) => {
        let list = res
        let arr = []
        if(list){
        for (let i = 0; i < list.length; i++) {
          arr.push({ year: list[i], id: i + 1 })
        }
        let compare = function (num) {
          return function (obj1, obj2) {
            let val1 = obj1[num]
            let val2 = obj2[num]
            if (val1 > val2) {
              return -1
            } else if (val1 < val2) {
              return 1
            } else {
              return 0
            }
          }
        }
        arr.sort(compare('year'))
        this.dateList = arr
        this.changeYear(this.dateList)
      }
      })
    },

    //搜索台站
    searchStation(name) {
      let datas = encode({staName: name})
      getStationStrong(datas).then(res=>{
          let arr = decode(res)
          this.treeList = arr
          this.station = arr
          this.event = false
          this.loading1 = false
          if(arr.length == 0){
            this.$message.error('数据为空')
            return
          }
          if (this.top < 0) {
            this.top = 50
          } else {
            this.isActive = false
            this.show = false
          }
      })
    },
    markees(val) {
      this.markshow = false
    },
    changeYear(val) {
      let search = []
      search[0] = this.dateList[0].year

      this.yearList = this.dateList
      getVibration(search).then((res) => {
        let list = res
        list.forEach((item) => {
          item.shockDate = this.setTime(item.shockDate)
          item.shockTime = this.setDate(item.shockTime)
          item.staLat = item.lat
          item.staLon = item.lon
          if (item.cname !== null){
               item.shockAddr =  item.cname  + "(" +  item.shockAddr + ")"
          }
        })

        this.selectYear = true
        this.treeList = list
        let years = new Date().getFullYear();
        // this.treeList.map(item => {
        //   this.yearList.push(item.shockDate.substring(0,4))
        // })
        // this.yearList = Array.from(new Set(this.yearList))
        this.station = list
        this.loading = false
        this.loading1 = false
      })
    },
    // 下拉框收起 获取事件
    blurValue(date) {
        this.loading1 = true
        let data = [date]
        getVibration(data).then((res) => {
          let list = res
          list.forEach((item) => {
            item.shockDate = this.setTime(item.shockDate)
            item.shockTime = this.setDate(item.shockTime)
            item.staLat = item.lat
            item.staLon = item.lon
            if (item.cname !== null){
                  item.shockAddr =  item.cname  + "(" +  item.shockAddr + ")"
            }
          })
          this.selectYear = true
          this.treeList = list
          this.station = list
          this.loading1 = false
          this.isActive = false
          this.show = false
          this.top = 0
        })
    },
    // 移除选项
    removerValue(e) {
      this.markshow = false
      this.loading1 = true
      if (this.selectDate.length !== 0) {
        let data = this.selectDate
        getVibration(data).then((res) => {
          let list = res
          list.forEach((item) => {
            item.shockDate = this.setTime(item.shockDate)
            item.shockTime = this.setDate(item.shockTime)
            item.staLat = item.lat
            item.staLon = item.lon
          })
          this.treeList = list
          this.station = list
          this.loading1 = false
        })
      } else {
        this.treeList = []
        this.loading1 = false
      }
    },
        // 获取上报单位台网
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.loading = false
        return resolve([
          {
            unitName: '强震动站网'
          },
          {
            unitName: '强震动事件',
            // children: []
          }
        ])
      } else if (node.level === 1) {
        if (node.label === '强震动站网') {
          return resolve([
            {
              unitName: '国家站网',
              leaf: true
            },
            //这里注释是为了屏蔽左侧省级站网等内容，下线省级站网
          /*  {
              unitName: '省级站网'
            },
            {
              unitName: '市县站网'
            },
            {
              unitName: '其他站网'
            }*/
          ])
        }
        if (node.label === '强震动事件') {
          this.yearList.forEach((item)=>{
            item.unitName = item.year
            item.leaf = true
          })
          return resolve(this.yearList)

        }
      } else if (node.level === 2) {
        if (node.label === '省级站网') {
          let data = node.data
          if (data) {
            let list = []
            let datas = encode({ unitId: 1 })
            getCompanyList(datas)
              .then((res) => {
                list = decode(res)
                list.forEach((item) => {
                  item.unitName = item.netName
                  item.leaf = true
                })
                return resolve(list)
              })
              .catch(() => {
                resolve({})
              })
          }
        }
      }
    },

    // 获取台站
    handleNodeClick(data) {
      if (data.unitName === '国家站网' || data.unitName === '市县站网' || data.unitName === '其他站网' ) {
        this.event = false
        // let par = encode({staLevel: data.unitName})
        let par = encode({netName: data.unitName})
        getVibrationList(par).then((res) => {
            let list = decode(res)
            list.forEach((item,index) => {
              if(item.lat && item.lon){
                item.staLat = item.lat
                item.staLon = item.lon
              }else {
                list.splice(index)
              }
            })
          console.log(this.treeList)
            this.station = list
            this.treeList = list
            this.loading1 = false
            this.isActive = false
            this.show = false
            this.top = 0
        }).catch(() => {})
      } else if (data.netName) {
        this.stationName = data.netName
        // this.networkOption.netCode = data.netCode  netCode : data.netCode
        let datas = encode({netCode: data.netCode})
        getStationStrong(datas).then(res=>{
            let arr = decode(res)
            let arr2 = []
            arr.forEach(item=>{
              item.startTime = new Date(item.cTime).toLocaleDateString()
              if(item.netCode == data.netCode){
                arr2.push(item)
              }
            })
            this.treeList = arr2
            this.station = arr2
            this.event = false
            this.loading1 = false
            if(arr2.length == 0){
              this.$message.error('数据为空')
              return
            }
            if (this.top < 0) {
              this.top = 50
            } else {
              this.isActive = false
              this.show = false
            }
        })
      }else if(data.eventId){
        this.staId = data.eventId
        // console.log(data.row)
        if(data.row.shockAddr){
          this.drawertitle = '强震动地震数据信息'
        }else{
          this.drawertitle = '强震动地震台站数据信息'
        }
        this.drawerTitle = '_'+data.row.staName
        this.markshow = true
        this.showInfo = true
        this.highspot = data.row
        this.marke = data.row
      }
      let form = {
        keyName: '强震动数据-'+this.drawerTitle+'数据集',
        url: '/service/catalogue',
      }
      if(data.row){
        form.postUrl = JSON.stringify({
            netCode: data.row.netCode,
            staName: data.row.staName
        })
      }
      hotDataAdd(encode(form)).then()
      if (data.year) {
        this.event = true
        this.blurValue(data.year)
      }
    },
    // 过滤查询
    filterNode(value, data) {
      if (!value) return true
      return data.unitName.indexOf(value) !== -1
    },
    getMarkeInfo(val) {
      this.marke = Object.assign({},this.marke,val)
      this.linkInfo = val
    },
    getHotList() {
      if(!sessionStorage.getItem('hotInfo')){
        return
      }
      let name = JSON.parse(sessionStorage.getItem('hotInfo')).keyName
      if(name.split('-')[0] == '强震动数据'){
        let list = []
        let par = {}
        let str = 'pageNum=1&pageSize=9999&keyName='+name
        getFlagList(str).then(response => {
          list = response.records;
          par = JSON.parse(list[0].postUrl)
          setTimeout(() => {
            this.searchStation(par.staName)
          }, 350);
        });
      }
    },
    // 地图标记点点击
    maplist(val) {
      //判断是输入还是选择
      if(typeof val == 'string' && val != ''){
        this.treeList.map(itm=>{
          if(itm.shockAddr && itm.shockAddr.indexOf(val) != -1){
            val = {...itm}
          }
        })
        if(this.treeList.length == 0 || (this.treeList.length != 0 && !this.treeList[0].shockAddr)){
          this.searchStation(val)
          return
        }
        if(typeof val == 'string') {
          return
        }
    }
    if(val == ''){
      return
    }

      this.markshow = true
      this.marke = val
      this.highspot = val
      if(val.shockAddr){
        this.drawertitle = '强震动地震数据信息'
        this.shockAddr = val.shockAddr
        this.drawerTitle = val.shockAddr
        this.isActive = true
        this.show = true
        this.getCataList()
      }else{
        this.drawertitle = '强震动地震台站数据信息'
        this.drawerTitle = val.staName
        this.handleNodeClick({eventId:val.id,row:val})
      }
      if (this.top < 0) {
        this.top = 50
        // this.isActive = false
        // this.show = false
      }
      // this.isActive = true
      // this.show = true
      // this.getCataList()
    },
    stationDraw(val) {
      this.markshow = true
      this.marke = val
      this.drawertitle = '地震周边台站'
    },
    handleSelectionChange(val) {
      console.log(val)
      if (val.length === 0) {
        this.comTreeList = []
        this.showCartBtn = false
      } else {
        this.showCartBtn = true
        this.comTreeList = [...val]
      }
      // if (val.length === 0) {
      //   this.showCartBtn = false
      // } else {
      //   this.showCartBtn = true
      // }
    },
    stationTap() {
      this.isActive = false
      this.show = false
      this.showInfo = false
    },
    dataListTap() {
      if(!this.event){
        this.$message.error('当前无详情页面')
        return
      }
      if (this.drawerTitle === '') {
        this.$message.error('请选择一个台站')
      } else {
        this.isActive = true
        this.show = true
      }
    },
    hoverCell(row) {
      this.marke = row
    },
    //日期数据子组件勾选后传值
    addCartItem(list){
      this.comTreeList = list
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
        let sendDept = this.linkInfo.offerUnit
        const loading = Loading.service({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
        });
        if(this.shockAddr && list2[0].sta_name){
          let dataObj = {}
          list2.forEach((item,index)=>{
            item.orderClasses = '强震动数据'+'_'+this.shockAddr+ '_' + item.sta_name + '台站'
            item.classesStandby = '建站时间：'+item.start_time+'；数据类型：'+item.data_format+'；分发单位：中国地震局工程力学研究所；分发联系人：娄良琼；联系方式：csmnc@iem.ac.cn'
            dataObj = {
              orderClasses:item.orderClasses,
              classesStandby:item.classesStandby,
              userName:Cookies.get('username'),
              sentDept: sendDept,
              subjectId: 5
            }
            list3.records.datas.push({...dataObj})
          })
        }else if(list2[0].shockAddr){
          //强震事件添加购物车
          let dataObj = {}
          list2.forEach((item,index)=>{
            item.orderClasses = '强震动事件数据'+'_'+item.shockAddr
            item.classesStandby = '发震时间：'+item.shockDate+' '+item.shockTime+'；分发单位：中国地震局工程力学研究所；分发联系人：娄良琼；联系方式：csmnc@iem.ac.cn'
            dataObj = {
              orderClasses:item.orderClasses,
              classesStandby:item.classesStandby,
              userName:Cookies.get('username'),
              sentDept: sendDept,
              subjectId: 5
            }
            list3.records.datas.push({...dataObj})
          })
        }
        else{
          list2.forEach((item,index)=>{
            let date = null
            let dataObj = {}
            if(item.dataDate){
              date = item.dataDate.replaceAll('-','.')
            }else{
              date = item.classesStandby.toString().indexOf('-') != -1 ? item.classesStandby.replaceAll('-','.') : item.classesStandby
            }
            if(item.dataDate || item.classesStandby != '年份'){
              item.orderClasses = '强震动数据'+'_'+this.drawerTitle
              item.classesStandby = '日期：'+date+'；分发单位：'+this.linkInfo.offerUnit+'；分发联系人：'+this.linkInfo.linkman+'；联系方式：'+this.linkInfo.phone
              dataObj = {
                orderClasses:item.orderClasses,
                classesStandby:item.classesStandby,
                userName:Cookies.get('username'),
                sentDept: sendDept,
                subjectId: 5
              }
              list3.records.datas.push({...dataObj})
            }
          })
        }

        // if(!this.includes(this.addCartList,list2)){
        //   this.addCartList = this.addCartList.concat(list2)
        // }
        this.comTreeList = []
        if(list3.records.datas.length != 0){
          addCartApi(encode(list3)).then(res=>{
            this.getCartList()
            loading.close();
            this.drawer = true
          }).catch(e=>{
            this.$message.error(e)
            loading.close();
          })
        }else{
          loading.close();
        }

    },

    //判断是否包含另一个数组
    includes(arr1, arr2) {
      return arr2.every(val => arr1.includes(val));
    },
    changeShow(state) {  //购物车显示与关闭
      this.drawer = state
    },
    searchFilter() {
      this.treeList = this.search == '' ? this.station : this.treeList.filter(
        (data) =>
          !this.search ||
          data.staName
            .toLowerCase()
            .includes(this.search.toLowerCase())
      )
      // this.stationList = this.search == '' ? this.stationspot : this.stationList.filter(
      //   (data) =>
      //     !this.search ||
      //     data.staName
      //       .toLowerCase()
      //       .includes(this.search.toLowerCase())
      // )
    },
    clickRow(row) {
      this.drawerTitle = row.staName + '台站'
      this.highspot = row
      this.marke = row
      this.isActive = true
      this.show = true
      this.getCataList()
    },
    tiggle() {
      if (this.left >= 0) {
        this.left = -300
        this.icon = 'el-icon-caret-right'
      } else {
        this.left = 0
        this.icon = 'el-icon-caret-left'
      }
    },
    // 获取台网数据
    getCataList() {
      console.log(this.marke)
      // this.highspot = this.marke
      let arr = { eventId: '' }
      arr.eventId = this.marke.id
      getEventList(encode(arr)).then((res) => {
        this.top = 0
        let list = decode(res)
        // list = this.setList(list)
        list.forEach((item) => {
          item.staLat = item.lat
          item.staLon = item.lon
        })
        this.stationList = list
        this.stationspot = list
        this.sumdatasize = 0
        list.forEach((item) => {
          this.sumdatasize += parseInt(item.datasize)
        })
      })
      let form = {
        keyName: '强震动数据-'+this.drawerTitle+'数据集',
        url: '/service/catalogue',
        linkUnit: this.tipText
      }
      // if(this.marke.staLevel == '省台'){
      //   form.postUrl = JSON.stringify({
      //       netCode: this.marke.netCode,
      //       staName: this.marke.staName
      //   })
      // }
      hotDataAdd(encode(form)).then()
    },
    closeDraw() {
      this.top = -560
    },
    //监听子组件移除购物车内容
    changeCartList(list) {
      this.addCartList = list
    },
    filterPlatList(val) {
      this.top = 0
      // this.treeList = val
      // this.treeList = this.treeList.slice(0,15)
        this.treeList = val
    },
    // 把数据分类
    setList(arr) {
      let array = []
      let data = []
      let num = arr.length
      for (let i = 0; i < num; i++) {
        let name = arr[i].sta_name
        if (array.indexOf(name) === -1) {
          data.push({
            sta_name: name,
            staLat: arr[i].lat,
            staLon: arr[i].lon,
            id: i + 1,
            children: [arr[i]]
          })
          array.push(name)
        } else {
          for (let j = 0; j < data.length; j++) {
            if (data[j].sta_name === arr[i].sta_name) {
              data[j].children.push(arr[i])
              break
            }
          }
        }
      }
      // 把通道数据按月份进行处理
      for (let k = 0; k < data.length; k++) {
        let list = data[k].children
        let array1 = []
        let data1 = []
        let num1 = list.length
        for (let i = 0; i < num1; i++) {
          let mon = list[i].dataDate.slice(0, 7)
          list[i].id = 10 + i
          if (array1.indexOf(mon) === -1) {
            let year = mon.slice(0, 4)
            let m = mon.slice(5, 7)
            let day = this.getDaysInMonth(year, m)
            data1.push({
              dataDate: mon,
              day: day,
              dataStat: 0,
              id: i + 1,
              children: [list[i]]
            })
            array1.push(mon)
          } else {
            for (let j = 0; j < data1.length; j++) {
              if (data1[j].dataDate === list[i].dataDate.slice(0, 7)) {
                data1[j].children.push(list[i])
                break
              }
            }
          }
        }
        data[k].children = data1
      }
      return data
    },
    getDaysInMonth(year, month) {
      month = parseInt(month, 10) // parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
      let temp = new Date(year, month, 0)
      return temp.getDate()
    },
    // 处理日期
    setTime(time) {
      let date = new Date(time)
      const year = date.getFullYear()
      let mon = date.getMonth() + 1
      if (mon < 10) {
        mon = `0${mon}`
      }
      let day = date.getDate()
      if (day < 10) {
        day = `0${day}`
      }
      return `${year}-${mon}-${day}`
    },
    setDate(time) {
      let date = new Date(time)
      let hour = date.getHours()
      let min = date.getMinutes()
      let sec = date.getSeconds()
      hour = this.checkTime(hour)
      min = this.checkTime(min)
      sec = this.checkTime(sec)

      return `${hour}:${min}:${sec}`
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    // 关闭通道数据
    handleClose() {
      this.tableData = []
    },
    // 通道数据的显示隐藏
    tableShow(e) {
      // let table = e.target.parentNode
      // table.classList.toggle('hide')
      let id = e
      this.drawShow = id
    }
  }
}
</script>

<style lang="scss" scoped>
.el-main {
  position: relative;
  width: 100%;
  padding: 0px;
  .header {
    width: 100%;
    position: absolute;
    top: 10px;
    left: 20px;
    display: flex;
    align-items: center;
    .topSel {
      position: relative;
      left: 30px;
    }
    .topNav {
      // position: absolute;
      z-index: 998;
      height: 33px;
      // top: 65px;
      // left: 20px;
      background-color: #fff;
      padding: 10px;
      border-radius: 15px;
      box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
    }
  }
  .tiggle {
    position: absolute;
    top: 280px;
    left: 300px;
    width: 29px;
    height: 75px;
    text-align: center;
    line-height: 75px;
    vertical-align: middle;
    z-index: 998;
    cursor: pointer;
    background-color: #fff;
    box-shadow: 1px 1px 5px 1px rgb(143, 143, 143);
    transition: margin-left 0.4s ease-out;
    -webkit-transition: margin-left 0.4s ease-out;
    -moz-transition: margin-left 0.4s ease-out;
    -o-transition: margin-left 0.4s ease-out;
    -ms-transition: margin-left 0.4s ease-out;
  }
  .stationlist,
  .dataList2 {
    position: absolute;
    top: 150px;
    right: 350px;
    width: 37px;
    height: 48px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
    background-color: #fff;
    color: black;
    z-index: 999;
    font-size: 21px;
    text-align: center;
    line-height: 48px;
    cursor: pointer;
    vertical-align: middle;
    transition: margin-top 0.4s ease-out;
    -webkit-transition: margin-top 0.4s ease-out;
    -moz-transition: margin-top 0.4s ease-out;
    -o-transition: margin-top 0.4s ease-out;
    -ms-transition: margin-top 0.4s ease-out;
  }
  .addcart {
    position: absolute;
    top: 15px;
    right: 235px;
    z-index: 1000;
  }
  .dataList2 {
    top: 203px;
  }
  .selected {
    background-color: #409eff;
    color: #fff;
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
  .start-list {
    position: absolute;
    z-index: 999;
    left: 0;
    top: 80px;
    width: 300px;
    max-height: 580px;
    overflow: auto;
    padding: 10px;
    border-radius: 15px;
    background-color: #fff;
    box-shadow: 1px 1px 8px 0px rgba(86, 86, 86, 0.5);
    transition: margin-left 0.4s ease-out;
    -webkit-transition: margin-left 0.4s ease-out;
    -moz-transition: margin-left 0.4s ease-out;
    -o-transition: margin-left 0.4s ease-out;
    -ms-transition: margin-left 0.4s ease-out;

    .list {
      width: 100%;
      height: 460px;
      position: relative;

      .stationTxt {
        background-color: #f0f0f0;
        border-bottom: 2px solid #fff;
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .tips-button {
        width: 15%;
        height: 20px;
        padding-left: 9px;
        padding-top: 3px;
        margin: 4px 4px;
      }
    }

    .list {
      .stationShow {
        position: absolute;
        right: -5px;
        top: -15px;
        padding: 5px;
        cursor: pointer;
        z-index: 10000;
      }
    }

    .footer {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .dataList {
    position: absolute;
    z-index: 1000;
    right: 55px;
    top: 50px;
    width: 300px;
    height: 500px;
    overflow: auto;
    padding: 2px;
    transition: margin-top 0.4s ease-out;
    -webkit-transition: margin-top 0.4s ease-out;
    -moz-transition: margin-top 0.4s ease-out;
    -o-transition: margin-top 0.4s ease-out;
    -ms-transition: margin-top 0.4s ease-out;
    .top {
      position: relative;
      top: 0;
      right: 0;
      width: 296px;
      height: 68px;
      padding: 15px 0px;
      border-radius: 15px 15px 0px 0px;
      box-shadow: 0px 12px 7px -13px #a5a5a5;
      background-color: #fff;
      display: flex;
      justify-content: center;
      .citySearch {
        width: 260px;
        border-radius: 9px;
        margin-top: 8px;
      }
    }
    .cart {
      font-size: 10px;
      text-align: center;
      margin-bottom: 2px;
    }
    .close {
      position: absolute;
      right: 15px;
      top: 5px;
      z-index: 1001;
      cursor: pointer;
    }
    .dataListTable {
      box-shadow: 0px 0px 3px 0px rgb(198, 198, 198);
    }
    // background-color: #fff;
    ::v-deep .el-table .cell {
      padding: 0 4px;
    }

    ::v-deep .el-table--border .el-table__cell:first-child .cell {
      padding-left: 0px;
    }
  }

  .change2D {
    z-index: 2000;
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}

.mainCard {
  .el-tabs__heade {
    margin: 0;
  }
}
.box {
  height: 88vh;
}
.markee {
  transition: margin-left 0.4s ease-out;
  position: absolute;
  top: 20%;
  left: 340px;
  width: 320px;
  height: 260px;
  z-index: 1000;
  background: #fff;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  opacity: 1;

  // .main {
  //   .txtmain {
  //     font-size: 12px;

  //     .header {
  //       padding: 3px;
  //       background-color: #cccccc;
  //     }

  //     .txt {
  //       font-size: 10px;
  //       padding: 3px;
  //       background-color: #fff;

  //       span {
  //         margin-right: 20px;
  //       }
  //     }
  //   }
  // }

  // .el-button {
  //   margin-left: 70px;
  //   margin-bottom: 10px;
  // }
}

.hide {
  height: 34px;
}

.show {
  display: block !important;
}

.title {
  color: #1492ff;
  padding: 10px;
  border-left: 5px solid #1492ff;
  margin-bottom: 20px;
}

.drawerDiv {
  background-color: #f0f0f0;
  padding: 10px;
  overflow: hidden;
  border-bottom: 2px solid #fff;

  .drawerSpan {
    display: block;
    padding: 0 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .drawerSpan::before {
    content: '↓';
    margin-right: 5px;
    color: red;
  }
}

#tableShow {
  display: block;
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
