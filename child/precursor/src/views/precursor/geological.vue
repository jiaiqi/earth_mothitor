<template>
    <div class="refuge">
      <div>
        <cart :drawerTitle="drawerTitle" :drawer="drawer" :addCartList="addCartList" @showDraw="changeShow" @cartList="changeCartList"></cart>
      </div>
      <el-container>
        <el-main style="position: relative;height: 100%;">
          <div
            class="cartBtn"
            @click="drawer = true"
          >
            <el-badge :value="addCartList ? addCartList.length : 0" :max="99" class="item">
              <i class="el-icon-shopping-cart-2"></i>
            </el-badge>
            <p style="padding:0px 15px;line-height: 22px;">成果车</p>
          </div>
          <el-button class="addcart" :style="{ 'margin-top': (top - 28) + 'px' }" 
          type="danger" size="mini" @click="addCart">加入成果车</el-button>
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
            <div class="list">
              <!-- <span class="stationShow" @click="stationshow">x</span> -->
              <el-table
                v-if="!show"
                :data="
                  station.filter(
                    (data) =>
                      !search ||
                      data.projectName.toLowerCase().includes(search.toLowerCase()) ||
                      data.projectName.replaceAll(' ', '').includes(search.trim())
                  )
                "
                @selection-change="handleSelectionChange"
                size="mini"
                height="420"
              >
              <el-table-column type="selection" width="40" />
                <el-table-column prop="projectName"
                label="目录名称"
                width="130"
                >
                  <template slot-scope="scope">
                    <div style="cursor:pointer" @click="getStantion(scope.row)">
                      {{ scope.row.projectName }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="mirrorImage"
                  label="镜像"
                  align="center"
                  width="60"
                >
                </el-table-column>
                <el-table-column
                  prop="surveyContent"
                  label="调查点内容"
                  align="center"
                >
                </el-table-column>
              </el-table>
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
          </div>
          <div class="header">
            <!-- 头部当行蓝 -->
            <div class="topNav">
              <top-nav :pageName="'地震地质'"></top-nav>
            </div>
            <top-sel class="topSel" :netList="netList" type="地震地质" @search="searchVal"></top-sel>
          </div>
          <div
            class="tiggle"
            @click="tiggle"
            :style="{ 'margin-left': left + 'px' }"
          >
            <i :class="icon"></i>
          </div>
          <el-dialog style="margin-top:50px" title="关于地震地质数据的提示" :visible.sync="TipDialog" width="56%">
            <div v-html="tipText">
            </div>
          </el-dialog>
          <div class="start-list" :style="{ 'margin-left': left + 'px' }">
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
              :title="'地震地质数据'"
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
    getStation,
    getcata,
    headSearch,
    geoStationList,
    geoGetData
  } from '@/api/precursor'
  import {
  getCompanyList
} from '@/api/deformation'
  import {
    getList,
    addCartApi
  } from '@/api/cartList'
  import {
    hotAdd,
    hotDataAdd
  } from '@/api/hots'
  import { Loading } from 'element-ui';
  import Cookies from 'js-cookie'
  import { provinceAndCityData } from 'element-china-area-data'
  import selsmometryMap from '@/components/map/index.vue'
  import changeMap from '@/components/changeMap.vue'
  import leftDraw from '@/components/mapFilter/leftDraw.vue'
  import TopNav from '../../components/topNav.vue'
  import mackDrawer from '@/components/mackDrawer.vue'
  import topSel from '@/components/mapFilter/topSel.vue'
  import cart from '@/components/cart.vue'
  import { getToken } from '@/utils/auth'
  import { Notification } from 'element-ui'
import { componentsViewBase } from '@supermap/iclient-leaflet'
  
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
        title: '地震地质数据',
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
      mackDrawer,
      cart,
    }, // selsmometryMap
    created() {},
    mounted() {
      this.getStatonList()
      this.getCartList()
      this.getProvinceList()
      // this.handleNodeClick({ netCode: "SN",netName: "陕西",isLoad:true})
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
      getStatonList(province) {
        let list = []
        let data = {}
        if(province){
          data = encode({
            provider: province
          })
        }
        geoGetData(data)
          .then((res) => {
            list = decode(res)
            list.forEach(item=>{
              item.staLon = item.longitude
              item.staLat = item.latitude
            })
            this.station = [...list]
            if(list.length == 0){
              this.$message.error('数据为空')
              return
            }
            if (this.top < 0) {
              this.top = 50
            } else {
              this.isActive = false
              this.show = false
            }
            // list.forEach((item)=>{
            //   this.netList.push({
            //     value: item.netCode,
            //     label: item.netName
            //   })
            // })
          })
          .catch((ree) => {
            this.$message.error('获取数据失败')
          })
      },
      // 获取上报单位台网
      loadNode(node, resolve) {
        if (node.level === 0) {
          this.loading = false
          return resolve([
            {
              unitName: '地震地质站网'
            }
          ])
        } else if (node.level === 1) {
          if (node.label === '地震地质站网') {
            // getStationBNum().then((res) => {
            // })
            return resolve([
              {
                unitName: '国家站网',
                leaf: true
              },
              {
                unitName: '省级站网'
                // leaf: true
              },
              {
                unitName: '市县站网'
              },
              {
                unitName: '其他站网'
              }
            ])
          }
        } else if (node.level === 2) {
          if (node.label === '省级站网') {
            let list = [...this.netList]
            list.forEach(item=>{
              item.unitName = item.netName
            })
            resolve(list)
          }else if(node.label === '市县站网' || node.label === '其他站网'){
            this.$message.error('数据为空')
            resolve({})
          }
        }
      },
      getProvinceList(){
        let datas = encode({ unitId: 1 })
        getCompanyList(datas)
          .then((res) => {
            let list = decode(res)
            list.forEach((item) => {
              item.leaf = true
            })
            this.netList = [...list]
          })
      },
      // 获取台站
      handleNodeClick(data) {
        if (data.unitName === '国家站网') {
          this.getStatonList()
        } else if (data.netName) {
          this.getStatonList(data.netName)
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
        this.comTreeList = [...val]
      },
      //移除购物车项
      removeCartItem(index) {
        this.addCartList.splice(index,1)
      },
      searchVal(val) {
        let data = encode(JSON.parse(val))
        geoGetData(data)
          .then((res) => {
            let list = decode(res)
            list.forEach(item=>{
              item.staLon = item.longitude
              item.staLat = item.latitude
            })
            this.station = [...list]
            if(list.length == 0){
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
        this.maplist(val)
      },
      getMarkeInfo(val) {
        this.marke = Object.assign({},this.marke,val)
        this.linkInfo = val
      },
      // 地图标记点点击
      maplist(val) {
        this.marke = val
        this.drawerTitle = val.staName
        this.highspot = val
        this.markshow = true
        if (this.top < 0) {
          this.top = 50
        }
          // this.getCataList()
      },
      markees(val) {
        this.markshow = false
      },
      //监听子组件移除购物车内容
      changeCartList(list) {
        this.addCartList = list
      },
      //添加购物车事件
      addCart(){
        // console.log(list)
        if(this.comTreeList.length == 0){
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

          let list2 = [...this.comTreeList]
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
          let title = "地震地质"
          list2.map((item,index)=>{
              let sendDept = ''
              let dataObj = {}
              item.orderClasses = title+'_'+item.descriptions
              if(item.distributionDepartment){
                item.classesStandby = '调查时间：'+item.SurveyDate+'；分发单位：'+item.distributionDepartment+'；联系人：'+item.personToContact+' '+item.phoneNum
                sendDept = item.distributionDepartment
              }else{
                item.classesStandby = '调查时间：'+item.SurveyDate
                sendDept = ''
              }
              dataObj = {
                orderClasses:item.orderClasses,
                classesStandby:item.classesStandby,
                userName:Cookies.get('username'),
                sentDept: sendDept,
                subjectId: 19
              }
              list3.records.datas.push({...dataObj})
              // item.select = false
          })
          if(!this.includes(this.addCartList,list2)){
            this.addCartList = this.addCartList.concat(list2)
          }
          // console.log(JSON.stringify(list2).replaceAll('},','}-').substring(1,JSON.stringify(list2).length-1))
          this.comTreeList = []
          if(list3.records.datas.length != 0){
            addCartApi(encode(list3)).then(res=>{
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
  
      //判断是否包含另一个数组
      includes(arr1, arr2) {
        return arr2.every(val => arr1.includes(val));
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
        let arr = { staId: '', netId: '' }
        arr.staId = this.marke.id
        arr.netId = this.marke.netId
        this.staId = this.marke.id
        geoGetData(encode(arr)).then((res) => {
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
            this.drawerTitle = `${this.marke.projectName}`
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
        let form = {
              keyName: '地震地质数据-'+this.drawerTitle+'数据集',
              url: '/precursor/geological',
              linkUnit: this.tipText
            }
        hotDataAdd(encode(form)).then()
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
      right: 265px;
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
    height: 460px;
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
  