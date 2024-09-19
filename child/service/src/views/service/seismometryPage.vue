<template>
  <div class="refuge">
    <div>
      <cart :drawerTitle="drawerTitle" :drawer="drawer" :addCartList="addCartList" @showDraw="changeShow" @cartList="changeCartList"></cart>
    </div>
    <el-container>
      <el-main style="position: relative;height: 100%;">
<!--        <div
          class="cartBtn"
          @click="drawer = true"
        >
          <el-badge :value="addCartList ? addCartList.length : 0" :max="99" class="item">
            <i class="el-icon-shopping-cart-2"></i>
          </el-badge>
          <p style="padding:0px 15px;line-height: 22px;">成果车</p>
        </div>-->
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
<!--        <el-button class="addcart" :style="{ 'margin-top': (top - 28) + 'px' }"-->
<!--        type="danger" size="mini" @click="addCart(comTreeList)">加入成果车</el-button>-->
        <div class="rightDraw" :style="{ 'margin-top': top + 'px' }">

          <span class="stationShow" @click="stationshow"
            ><i class="el-icon-caret-top"></i
          ></span>
          <!-- <div> -->
          <div class="top" v-if="!show">
            <el-input
              v-model="search"
              prefix-icon="el-icon-search"
              size="mini"
              placeholder="输入关键字搜索"
              class="citySearch"
            >
            </el-input>
          </div>
          <div class="top" v-else>
            {{ drawerTitle }}
          </div>

          <!-- 台站列表 -->
          <div class="list" v-if="!science">
            <!-- <span class="stationShow" @click="stationshow">x</span> -->
            <el-table
              v-if="!show"
              :data="
                station.filter(
                  (data) =>
                    !search ||
                    data.staName.toLowerCase().includes(search.toLowerCase()) ||
                    data.staName.replaceAll(' ', '').includes(search.trim())
                )
              "
              @selection-change="handleSelectionChange"
              size="mini"
              height="420"
            >
            <!-- <el-table-column type="selection" width="40" /> -->
              <el-table-column prop="staName"
              label="名称"
              >
                <template slot-scope="scope">
                  <div @click="getStantion(scope.row)">
                    {{ scope.row.staName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="staCode"
                label="代码"
                align="center"
                sortable
              >
              </el-table-column>
              <!-- <el-table-column
                prop="shengf"
                label="省份"
                align="center"
                sortable
                width="80"
              >
                <div>
                  {{ stationName }}
                </div>
              </el-table-column> -->
            </el-table>
            <div v-else>
              <dateTree v-if="isProvince" style="width: 280px;height: 370px;" :days="staId" :staName="drawerTitle" :typeName="'测震'" @addCartItem="addCartItem" @getInfo="getMarkeInfo"></dateTree>
              <dateDatas v-else style="width: 280px;height: 370px;" :days="tableData" @addCartItem="addCartItem"></dateDatas>
            </div>
            <!-- <el-table
              v-else
              class="dataListTable"
              id="tableShow"
              :data="tableData"
              row-key="id"
              border
              style="width: 280px"
              size="small"
              height="380"
              stripe
              accordion
            >
              >
              <el-table-column
                prop="dataDate"
                label="创建日期"
                align="center"
                sortable
                width="150"
              >
              </el-table-column>
              <el-table-column prop="dataStat" label="通道数据" align="center">
                <template slot-scope="scope">
                  <el-progress
                    v-if="scope.row.day"
                    :percentage="
                      Math.floor(
                        (scope.row.children.length / scope.row.day) * 100
                      )
                    "
                  ></el-progress>
                  <el-tag type="success"> 数据完整 </el-tag>
                </template>
              </el-table-column>
            </el-table> -->
          </div>
          <div class="list" v-else>
            <el-table
              :data="
                station.filter(
                  (data) =>
                    !search ||
                    data.staCode.toLowerCase().includes(search.toLowerCase()) ||
                    data.staCode.replaceAll(' ', '').includes(search.trim())
                )
              "
              row-key="id"
              size="mini"
              height="420"
              style="width: 97%;"
              stripe
              accordion
              v-if="!show"
              @selection-change="handleSelectionChange"
              :tree-props="{ children: 'children' }"
            >
              <el-table-column
                prop="staCode"
                label="台站代码"
                align="center"
              >
                <template slot-scope="scope">
                  <div style="cursor: pointer;" @click="maplist(scope.row)">
                    {{ scope.row.staCode }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="dataListTable" v-else>
              <dateDatas style="width: 280px;height: 370px;" :days="tableData" @addCartItem="addCartItem"></dateDatas>
            </div>
          </div>
        </div>
        <div class="header">
          <!-- 头部当行蓝 -->
          <div class="topNav">
            <top-nav :pageName="'测震'"></top-nav>
          </div>
          <top-sel class="topSel" :netList="netList" type="测震" @search="searchVal"></top-sel>
        </div>
        <div
          class="tiggle"
          @click="tiggle"
          v-if="!isChildProvince"
          :style="{ 'margin-left': left + 'px' }"
        >
          <i :class="icon"></i>
        </div>
        <el-dialog style="margin-top:50px" title="关于测震数据的提示" :visible.sync="TipDialog" width="56%">
          <div v-html="tipText">
          </div>
        </el-dialog>
        <div v-if="!isChildProvince" class="start-list" :style="{ 'margin-left': left + 'px' }">
          <left-draw
            :prop="props"
            :load="loadNode"
            :filterNodeMethod="filterNode"
            :nodeClick="handleNodeClick"
          >
          </left-draw>
        </div>
        <!-- 点击地图标记点弹窗 -->
        <div
          v-if="markshow"
          class="markee"
          :style="{ 'margin-left': left + 'px' }"
        >
          <mack-drawer
            :markeArr="marke"
            :title="science ? '科学台阵':'测震数据'"
            @markees="markees"
            :dataLength="tableData.length"
            :stationName="stationName"
          ></mack-drawer>
        </div>

        <!-- 地图 -->
        <div class="box">
          <selsmometry-map
            v-loading="loading"
            :list="station"
            @maplist="maplist"
            @lists="filterPlatList"
            :highspot="highspot"
            :restmap="restmap"
            :mapShow="mapShow"
          ></selsmometry-map>
        </div>
        <div class="change2D" v-show="!loading">
          <change-map></change-map>
        </div>
      </el-main>
    </el-container>
    <!-- 通道数据 -->
    <!-- <el-drawer
      :title="drawerTitle"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      style=""
    > -->
    <!-- <div
        class="drawerDiv"
        v-for="item in tableData"
        :key="item.id"
        :class="drawShow === item.id ? '' : 'hide'"
      >
        <span class="drawerSpan" @click.self="tableShow(item.id)"
          >通道名称：{{ item.chnCode }}</span
        >
      </div> -->
    <!-- </el-drawer> -->
  </div>
</template>

<script>
import { encode, decode } from '@/utils/dataEncry'
import {
  getCompanyList,
  getStation,
  getcata,
  likeList,
  getAllStation,
  headSearch
} from '@/api/selsmometry'
import {
  getList,
  addCartApi
} from '@/api/cartList'
import {
  hotAdd,
  hotDataAdd,
  getFlagList
} from '@/api/hots'
import {
  getarraynetwork,
  getArraystation,
  getArraycatalogdat,
} from '@/api/seismogarray'
import { Loading } from 'element-ui';
import Cookies from 'js-cookie'
import { provinceAndCityData } from 'element-china-area-data'
import selsmometryMap from '@/components/map/index.vue'
import changeMap from '@/components/changeMap.vue'
import leftDraw from '@/components/mapFilter/leftDraw.vue'
import TopNav from '../../components/topNav.vue'
import mackDrawer from '@/components/mackDrawer.vue'
import topSel from '@/components/mapFilter/topSel.vue'
import dateDatas from '@/components/date/dateDatas.vue'
import dateTree from '@/components/date/dateTree.vue'
import cart from '@/components/cart.vue'
import { getToken } from '@/utils/auth'
import { Notification } from 'element-ui'

export default {
  data() {
    return {
      loading: true,
      markshow: false,
      drawShow: null,
      // 显示Tips窗口
      TipDialog: false,
      search: '',
      // 抽屉的打开
      drawer: false,
      drawerTitle: '',
      science: false, //科学台阵
      netList: [],
      addCartList: [],  //添加购物车列表
      tempCartList: [], //勾选的日期数据
      stationName2: '',
      checkedItem: new Array(999).fill(false),
      isAll: false, //是否全选
      top: -520,
      staId: null,
      isProvince: false,
      // 日历的切换
      activeName: 'third',
      // 日历的隐藏
      activeShow: false,
      // 选择右侧选项卡样式
      isActive: false,
      // tab表格的数据
      tableData: [],
      // 树结构的属性
      treeshow: true,
      left: 0,
      icon: 'el-icon-caret-left',
      props: {
        label: 'unitName',
        children: 'zones',
        isLeaf: 'leaf'
      },
      comTreeList: [],
      stationName: '',
      filterText: '',
      //提示信息
      tipText: '',
      // 按城市查询的数据
      options: provinceAndCityData,
      selectedOptions: [],
      map: null,
      showCartBtn: false,
      showCart: true,
      circle_group: null,
      input: '',
      title: '测震数据',
      title1: '',
      show: false,
      dateData: [],
      // 暂存标题
      storing: '',
      // 暂存上次点击的目标
      last: {
        target: '',
        nextSibling: ''
      },
      company: [],
      station: [],
      // 查询参数
      networkOption: {
        netId: 1
      },
      total: 0,
      marke: null,
      //子站
      isChildProvince: false,
      num: 0,
      // 地图资源
      restmap: {
        url: '/map-tianditu/rest/maps/矢量底图_经纬度',
        urlLon: '/map-tianditu/rest/maps/矢量中文注记_经纬度'
      },
      date1: '',
      date2: '',
      linkInfo: {},
      mapShow: null,
      // 存储点击的点
      highspot: null
    }
  },
  components: {
    selsmometryMap,
    changeMap,
    leftDraw,
    TopNav,
    topSel,
    dateDatas,
    mackDrawer,
    cart,
    dateTree
  }, // selsmometryMap
  created() {},
  mounted() {
    this.getStatonList()
    this.getCartList()
    this.getHotList()
    if(sessionStorage.getItem('province') == '' || !sessionStorage.getItem('province')) {
      this.isChildProvince = false
      this.handleNodeClick({ unitName: "国家站网",leaf:true})
    }else{
      this.isChildProvince = true
    }
    if(sessionStorage.getItem('tips')){
      this.tipText = sessionStorage.getItem('tips')
    }
  },
  computed: {},
  methods: {
    // 切换底图
    changeBaseLayer(e) {
      this.mapShow = e
    },
    getCartList() {
      getList({
        userName: Cookies.get('username')
      }).then(res=>{
        this.addCartList = res
      })
    },
    getStatonList() {
      let datas = encode({ unitId: 1 })
      let list = []
      getCompanyList(datas)
        .then((res) => {
          list = decode(res)
          // alert(JSON.stringify(list))
          this.netList.push({
              value: '全国',
              label: '全国'
            })
          list.forEach((item)=>{
            this.netList.push({
              value: item.netCode,
              label: item.netName,
              id: item.id
            })
          })
              //子站过滤省份
          if(sessionStorage.getItem('province') != ''){
            list.map(itm=>{
              if(sessionStorage.getItem('province').indexOf(itm.netName) != -1 ) {
                this.handleNodeClick(itm)
                console.log(itm)
              }
            })
          }
        })
        .catch(() => {
        })
    },
    // 获取上报单位台网
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.loading = false
        return resolve([
          {
            unitName: '测震站网'
          },
          {
            unitName: '科学台阵'
          }
        ])
      } else if (node.level === 1) {
        if (node.label === '测震站网') {
          // getStationBNum().then((res) => {
          // })
          return resolve([
            {
              unitName: '国家站网',
              leaf: true
            },
            //这里注释是为了屏蔽左侧省级站网等内容，下线省级站网
           /* {
              unitName: '省级站网'
              // leaf: true
            },
            {
              unitName: '市县站网'
            },
            {
              unitName: '其他站网'
            }*/
          ])
        }
        if (node.label === '科学台阵') {
          let data = encode({})
          let arr = []
          getarraynetwork(data).then((res) => {
            let list = decode(res)
            list.forEach((item)=>{
              arr.push({
                unitName: item.netName,
                type: 'sci',
                id: item.id,
                leaf: true
              })
            })
            return resolve(arr)
            // this.treeList = list
            // this.loading = false
          })
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
        }else if(node.label === '市县站网' || node.label === '其他站网'){
          this.$message.error('数据为空')
          resolve([])
        }
      }
    },

    // 获取台站
    handleNodeClick(data) {
      this.science = false
      if (data.unitName === '国家站网') {
        let data = encode({})
        getAllStation(data)
          .then((res) => {
            let list = decode(res)
            this.station = list
            this.loading = false
          })
          .catch(() => {})
      } else if (data.netName) {
        this.stationName = data.netName
        // this.networkOption.netCode = data.netCode
        let datas = encode({netCode : data.netCode})
        getStation(datas)
          .then((res) => {
            let arr = decode(res)
            this.station = arr
            if(arr.length == 0){
              this.$message.error('数据为空')
              return
            }
            if(data.isLoad){
              return
            }
            if (this.top < 0) {
              this.top = 50
            } else {
              this.isActive = false
              this.show = false
            }
          })
          .catch((ree) => {
            this.$message.error('获取数据失败')
          })
      }else if(data.type == 'sci'){
          this.science = true
          this.networkOption.netId = data.id
          let datas = encode(this.networkOption)
          getArraystation(datas)
            .then((res) => {
              let arr = decode(res)
              this.station = arr
              this.top = 50
            })
            .catch((ree) => {
              this.$message.error('获取数据失败')
            })
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.unitName.indexOf(value) !== -1
    },
    changeShow(state) {  //购物车显示与关闭
      this.drawer = state
    },
    stationshow() {
      this.top = -520
    },
    stationTap() {
      this.isActive = false
      this.show = false
    },
    dataListTap() {
      if (this.drawerTitle === '') {
        this.$message.error('请选择一个台站')
      } else {
        this.isActive = true
        this.show = true
      }
    },
    // 抽屉的关闭
    closeDraw() {
      this.top = -520
    },
    // 多选框选中
    handleSelectionChange(val) {
      if (val.length === 0) {
        this.comTreeList = []
        this.showCartBtn = false
      } else {
        this.showCartBtn = true
        this.comTreeList = val
      }
    },
    //移除购物车项
    removeCartItem(index) {
      this.addCartList.splice(index,1)
    },
    searchVal(val) {
      if(!val.netCode || val.netCode == '全国'){
          let datas = encode({netCode:"",staName:val.staName})
          getAllStation(datas)
          .then((res) => {
            let arr = decode(res)
            this.station = arr
            if (this.top < 0) {
              this.top = 50
            } else {
              this.isActive = false
              this.show = false
            }
          })
          .catch((ree) => {
            this.$message.error('获取数据失败')
          })
        }else{
          let datas = {...val}
          if(datas.date && datas.date.length != 0){
            datas.beginTime = new Date(datas.date[0]).toLocaleDateString().replaceAll('/','-')
            datas.endTime = new Date(datas.date[1]).toLocaleDateString().replaceAll('/','-')
          }
              headSearch(encode(datas)).then((resp) => {
                let arr = decode(resp)
                this.station = arr
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
        }

      //     if(val.netName == '全国'){
      //       val.netName = ''
      //     }
      //     //只填了日期
      //     if(!val.netName && !val.staName && !val.staDescribe && val.date && this.isActive && this.show) {
      //         this.date1 = val.date[0].toLocaleDateString()
      //         this.date2 = val.date[1].toLocaleDateString()
      //         this.getCataList()
      //         return
      //     }
      //     val.netId = val.netName
      //     headSearch(encode(val)).then((res) => {
      //       let arr = decode(res)
      //       //判断日期选择器有数据且查询结果为一个，显示其详情
      //       if(val.date && arr.length == 1){
      //         this.drawerTitle = arr[0].staName + '台站'
      //         this.date1 = val.date[0].toLocaleDateString()
      //         this.date2 = val.date[1].toLocaleDateString()
      //         this.getStantion(arr[0])
      //       }else {
      //         this.date1 = ''
      //         this.date2 = ''
      //       }
      //       this.station = arr
      //       if (this.top < 0) {
      //         this.top = 50
      //       } else {
      //         this.isActive = false
      //         this.show = false
      //       }
      //     // if(decode(res).length > 0){
      //     //   this.maplist(decode(res)[0])
      //     // }
      //   })
      // }
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

    // 台站的点击事件
    getStantion(val) {
      this.maplist(val,2)
    },
    getMarkeInfo(val) {
      this.marke = Object.assign({},this.marke,val)
      this.linkInfo = val
    },
    // 地图标记点点击
    maplist(val,type) {
      this.marke = val
      // console.log(val)
      // console.log(type)
      this.drawerTitle = val.staName
      this.highspot = val
      this.markshow = true
      this.netList.map(item => {
        if(item.id == val.netId && item.label != '全国') {
          if(item.label == '北京' || item.label == '天津' || item.label == '上海' || item.label == '重庆'){
            this.stationName = item.label+'市'
          }else{
            this.stationName = item.label+'省'
         /*   if(item.label == '内蒙古' || item.label == '宁夏' ||
             item.label == '新疆' || item.label == '广西' || item.label == '西藏'){
              this.stationName = item.label+'自治区'
            }*/
            if(item.label.includes('内蒙')){
              this.stationName = item.label + "古自治区"
            }
            if(item.label.includes('内蒙古')){
              this.stationName = item.label + "自治区"
            }
            if(item.label.includes('宁夏')){
              this.stationName = item.label + "回族自治区"
            }
            if(item.label.includes('新疆')){
              this.stationName = item.label + "维吾尔自治区"
            }
            if(item.label.includes('广西')){
              this.stationName = item.label + "壮族自治区"
            }
            if(item.label.includes('西藏')){
              this.stationName = item.label + "自治区"
            }
          }
        }
      })
      if (this.top < 0) {
        this.top = 50
      }
        this.isActive = true
        this.show = true
      if(this.marke.noiseLevel){
        this.isProvince = true
      }else {
        this.isProvince = false
      }
      if(this.science){
        this.getCataList2()
      }else{
        this.getCataList()
      }
    },
    markees(val) {
      this.markshow = false
    },
    //日期数据子组件勾选后传值
    addCartItem(list){
      this.comTreeList = list
      // console.log(this.comTreeList)
    },
    //监听子组件移除购物车内容
    changeCartList(list) {
      this.addCartList = list
    },
    //添加购物车事件
    addCart(list){
      // console.log(list)
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
      list.forEach(item=>{
        if(item.dataDate){ //判断是否是选择的全国数据
          item.classesStandby = item.dataDate
        }
        if(item.yearDays){
          item.classesStandby = item.year
        }
        if(item.month){
          item.classesStandby = item.month
        }
      })

      // if(list[0].staName){  //判断是否是选择的台站列表
      //   let list2 = list
      //   list2.forEach(item=>{
      //     this.marke = item
      //     item.source = '测震数据'+'-'+item.staName + '台站'
      //   })
      //   if(!this.includes(this.addCartList,list2)){
      //     this.addCartList = this.addCartList.concat(list2)
      //   }
      //   this.comTreeList = []
      // }else {
        let list2 = list.filter(item=>{return item.classesStandby != '年份'})
        let list3 = {
          records: {
            datas: []
          }
        }
        let title = this.science ? '科学台阵':'测震数据'
        const loading = Loading.service({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
        });
        list2.map((item,index)=>{
            let sendDept = ''
            let dataObj = {}
            let date = item.classesStandby
            if(date.toString().indexOf('-') != -1){
              date = date.replaceAll('-','.')
            }
            item.orderClasses = title+'_'+this.drawerTitle
            if(this.marke.distributeUnit){
              item.classesStandby = '时间：'+date+'；分发单位：'+this.linkInfo.distributeUnit+'；联系人：'+this.linkInfo.linkman+' '+this.linkInfo.phone+'；邮箱：'+this.linkInfo.email
              sendDept = this.linkInfo.distributeUnit
            }else{
              item.classesStandby = '时间：'+date+'；分发单位：'+this.stationName+'地震局'
              sendDept = this.stationName+'地震局'
            }
            if(this.science){
              item.classesStandby = '时间：'+date+'；分发单位：中国地震局物理研究所；分发联系人：姚志祥；联系方式：esdc@cea—igp.ac.cn'
              sendDept = '中国地震局物理研究所'
            }
            dataObj = {
              orderClasses:item.orderClasses,
              classesStandby:item.classesStandby,
              userName:Cookies.get('username'),
              sentDept: sendDept,
              subjectId: 4
            }
            let listTemp= this.addCartList.filter(item0=>item.classesStandby===item0.classesStandby && item.orderClasses===item0.orderClasses)
            if(!(listTemp!==null && listTemp.length>0)){
                 list3.records.datas.push({...dataObj})
            }else{
                this.$message({
                message: item.orderClasses+","+item.classesStandby+"的数据在成果车中已存在，请勿重复加入！",
                type: 'warning'
              });
            }
            // item.select = false
        })
        // console.log(this.includes2(this.addCartList,list2));
        // if(!this.includes2(this.addCartList,list2)){
        //   this.addCartList = this.addCartList.concat(list2)
        // }
        // list2.forEach(val => {
        //   let list0= this.addCartList.filter(item=>val.classesStandby===item.classesStandby && val.orderClasses===item.orderClasses)
        //   if(!(list0!==null && list0.length>0)){
        //      this.addCartList = this.addCartList.push(val)
        //   }
        // });
        // console.log(JSON.stringify(list2).replaceAll('},','}-').substring(1,JSON.stringify(list2).length-1))
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

      // }

    },

    getHotList() {
      if(!sessionStorage.getItem('hotInfo')){
        return
      }
      let name = JSON.parse(sessionStorage.getItem('hotInfo')).keyName
      if(name.split('-')[0] == '测震数据'){
        let list = []
        let par = {}
        let str = 'pageNum=1&pageSize=9999&keyName='+name
        getFlagList(str).then(response => {
          list = response.records;
          par = JSON.parse(list[0].postUrl)
          setTimeout(() => {
            this.searchVal(par)
          }, 350);
        });
      }
    },
    //判断是否包含另一个数组
    includes(arr1, arr2) {
      return arr2.every(val => arr1.includes(val));
    },

    //判断是否包含另一个数组
    includes2(arr1, arr2) {
       arr2.forEach(val => {
          let list0= arr1.filter(item=>val.classesStandby===item.classesStandby && val.orderClasses===item.orderClasses)
          if(list0!==null && list0.length>0){
            return true
          }
        });
       return false
    },

    getDates(time) {
      let date = new Date(time)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      if(parseInt(month) < 10){
        month = '0' + month
      }
      if(parseInt(day) < 10){
        day = '0' + day
      }
      let days = year + '-' + month + '-' + day
      return days
    },
    // 获取通道数据
    getCataList() {
      console.log(this.marke)
      let arr = { staId: '', netId: '' }
      arr.staId = this.marke.id
      arr.netId = this.marke.netId
      this.staId = this.marke.id
      let form = {
        keyName: '测震数据-'+this.drawerTitle+'数据集',
        url: '/service/seismometry',
      }
      if(this.marke.staLevel == '省台' || this.marke.staLevel == '市台'){
        form.postUrl = JSON.stringify({
            netCode: this.marke.netCode,
            staName: this.marke.staName
        })
      }else{
        form.postUrl = JSON.stringify({
            staName: this.drawerTitle
        })
      }
      hotDataAdd(encode(form)).then()
      if(this.isProvince){
        return
      }
      getcata(encode(arr)).then((res) => {
        this.tableData = decode(res)
        //如查询日期选择器有值
        if(this.date1 && this.date2 && this.tableData.length > 0){
          let starIndex = -1
          let endIndex = -1
          this.tableData.map((item,index)=>{
            if(new Date(item.dataDate).toLocaleDateString() == this.date2){
              starIndex = index
            }
            if(new Date(item.dataDate).toLocaleDateString() == this.date1){
              endIndex = index
            }
          })
          if(starIndex == -1){
            starIndex = 0
          }
          if(endIndex == -1){
            endIndex = this.tableData.length - 1
          }
            this.tableData = this.tableData.slice(starIndex,endIndex + 1)
        }
        this.dateData = []
        this.tableData.forEach((item)=>{
          let date = this.getDates(item.dataDate)
          this.dateData.push(date)
        })
        // alert(JSON.stringify(this.dateData))
        if (this.tableData.length > 0) {
          this.show = true
          this.isActive = true
          if (this.top < 0) {
            this.top = 50
          }
          this.drawerTitle = `${this.marke.staName}台站`
        } else {
          this.$message.error('数据为空')
          this.drawerTitle = ''
          this.show = false
          this.isActive = false
        }
        for (let j = 0; j < this.tableData.length; j++) {
          this.tableData[j].dataDate = this.setTime(this.tableData[j].dataDate)
        }
      })
    },
    // 获取科学台阵通道数据
    getCataList2() {
      let arr = { staId: '', netId: '' }
      arr.staId = this.marke.id
      arr.netId = this.marke.netId
      getArraycatalogdat(encode(arr))
        .then((res) => {
          this.top = 50
          this.drawerTitle = `${this.marke.staCode}台站`
          this.tableData = decode(res)
          for (let j = 0; j < this.tableData.length; j++) {
            this.tableData[j].dataDate = this.setTime(
              this.tableData[j].dataDate
            )
          }
          this.show = true
          this.isActive = true
        })
        .catch((see) => {
        })
    },
    filterPlatList(val) {
      this.station = val
    },
    // 把数据分类
    setList(arr) {
      let array = []
      let data = []
      let num = arr.length
      for (let i = 0; i < num; i++) {
        let name = arr[i].chnCode
        if (array.indexOf(name) === -1) {
          data.push({
            chnCode: name,
            id: i + 1,
            children: [arr[i]]
          })
          array.push(name)
        } else {
          for (let j = 0; j < data.length; j++) {
            if (data[j].chnCode === arr[i].chnCode) {
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
    // 处理时间
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
  .addcart {
    position: absolute;
    top: 15px;
    right: 235px;
    z-index: 1000;
  }
  .rightDraw {
    position: absolute;
    top: 15px;
    right: 60px;
    height: 500px;
    z-index: 1000;
    border-radius: 15px;
    background-color: #fff;
    box-shadow: 1px 1px 8px 0px rgba(86, 86, 86, 0.5);
    transition: margin-top 0.4s ease-out;
    -webkit-transition: margin-top 0.4s ease-out;
    -moz-transition: margin-top 0.4s ease-out;
    -o-transition: margin-top 0.4s ease-out;
    -ms-transition: margin-top 0.4s ease-out;
    .stationShow {
      position: absolute;
      right: 5px;
      top: 5px;
      z-index: 1001;
      cursor: pointer;
    }
    .list {
      width: 100%;
      height: 400px;
      position: relative;
      top: 0;
      right: 0;
      padding-left: 5px;
      .datelist {
        width: 100%;
      }
      .stationTxt {
        background-color: #f0f0f0;
        border-bottom: 2px solid #fff;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }
    .cart {
      font-size: 10px;
      text-align: center;
    }
    .top {
      position: relative;
      top: 0;
      right: 0;
      width: 290px;
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
  }

  .dataList {
    position: absolute;
    width: 290px;
    top: 15px;
    right: 25px;
    height: 500px;
    z-index: 1000;
    border-radius: 15px;
    padding: 2px;
    transition: margin-top 0.4s ease-out;
    -webkit-transition: margin-top 0.4s ease-out;
    -moz-transition: margin-top 0.4s ease-out;
    -o-transition: margin-top 0.4s ease-out;
    -ms-transition: margin-top 0.4s ease-out;
    .drawerTitle {
      font-weight: bold;
      position: relative;
      top: 0px;
      left: 5px;
      z-index: 1000;
    }
    .dataListTable {
      box-shadow: 2px 2px 10px 0px rgba(86, 86, 86, 0.5);
      border-radius: 12px;
    }
    .close {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 6px;
      cursor: pointer;
    }
  }
  .shopingCart {
    background-color: #ff0000;
    width: 80px;
    height: 80px;
    position: absolute;
    top: 60px;
    right: 313px;
    font-size: 16px;
    z-index: 998;
    cursor: pointer;
  }
  .tiggle {
    position: absolute;
    top: 270px;
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
    top: 110px;
    right: 349px;
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
  .dataList2 {
    top: 163px;
  }
  .selected {
    background-color: #409eff;
    color: #fff;
  }
  .start-list {
    position: absolute;
    z-index: 999;
    left: 0;
    top: 80px;
    width: 300px;
    height: 460px;
    overflow: auto;
    padding: 15px 10px;
    border-radius: 15px;
    background-color: #fff;
    box-shadow: 1px 1px 8px 0px rgba(86, 86, 86, 0.5);
    transition: margin-left 0.4s ease-out;
    -webkit-transition: margin-left 0.4s ease-out;
    -moz-transition: margin-left 0.4s ease-out;
    -o-transition: margin-left 0.4s ease-out;
    -ms-transition: margin-left 0.4s ease-out;

    .footer {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
.box {
  min-height: 88vh;
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

.markee {
  transition: margin-left 0.4s ease-out;
  position: absolute;
  top: 20%;
  left: 340px;
  width: 320px;
  height: 280px;
  z-index: 1000;
  background: #fff;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  opacity: 1;
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
.drawMain {
  width: 100%;
  height: 100%;
  background-color: #f1f1f1;
  .drawHeader {
    display: flex;
    justify-content: space-between;
    background-color: #2f77c9;
    color: #efefef;
    height: 55px;
    line-height: 55px;
    padding: 0px 18px;
    vertical-align: middle;
  }
  .cartList {
    padding: 0px 15px;
    height: 87%;
    overflow-y: auto;
    .nodata {
      height: 250px;
      width: 100%;
      padding-top: 150px;
    }
    .info {
      padding-left:45px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .cartItem {
      padding: 3px 10px;
      border-radius: 10px;
      box-shadow: 1px 1px 4px 1px #aaaaaa;
      margin: 15px 0px;
      background-color: #fff
    }
    .cartItem:hover {
      box-shadow: 1px 1px 6px 1px #aaaaaa;
    }
    .removeCart {
      line-height: 50px;
      vertical-align: middle;
    }
  }
  .checkOut {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0px 20px;
    margin-top: 5px;
  }
}

.drawerDiv {
  background-color: #f0f0f0;
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
