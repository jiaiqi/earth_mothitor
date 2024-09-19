<template>
  <!-- 探测数据 -->
  <div class="refuge">
    <div>
      <cart :drawerTitle="drawerTitle" :drawer="drawer1" :addCartList="addCartList" @showDraw="changeShow" @cartList="changeCartList"></cart>
    </div>
    <el-container>
      <el-main style="position: relative; height: 100%;">
        <div class="head">
          <div class="topNav">
            <top-nav :pageName="'探测数据'"></top-nav>
          </div>
          <top-sel class="topSel" type="探测数据" @search="searchVal"></top-sel>
        </div>
        <el-dialog style="margin-top:50px" title="关于地震测深数据的提示" :visible.sync="TipDialog" width="56%">
          <div v-html="tipText">
          </div>
        </el-dialog>
        <div class="start-list" v-loading="loading">
          <left-draw
            :treeda="treeData"
            :prop="defaultProps"
            :filterNodeMethod="filterNode"
            :nodeClick="handleNodeClick"
          >
          </left-draw>
          <!--  台网列表 -->
          <!-- <div class="list">
            <el-input
              placeholder="输入关键字进行过滤"
              size="mini"
              v-model="filterText"
            >
            </el-input>
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              accordion
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
            >
            </el-tree>
          </div> -->
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
        <div class="dataList2" :style="{ 'margin-top': top + 'px' }" v-if="showName">
          <div class="close" @click="closeDraw">
            <i class="el-icon-caret-top"></i>
          </div>
          <el-button class="addcart" :style="{ 'margin-top': (top - 50) + 'px' }" 
          type="danger" size="mini" @click="addCart(comTreeList)">加入成果车</el-button>
          <!-- 详细数据 -->
          <el-table
            class="dataListTable"
            :data="platName"
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
            <el-table-column prop="sta_name" align="center" label="测线名称">
              <template slot-scope="scope">
                <div @click="maplist(scope.row)">
                  <span slot="reference">{{ scope.row.lineName }}</span>
                </div>
                <!-- <el-popover placement="top" width="300" trigger="hover">
                  <mack-drawer
                    :markeArr="scope.row"
                    @markees="markees"
                  ></mack-drawer>
                </el-popover> -->
              </template>
            </el-table-column>
            <el-table-column prop="collectDataDate" align="center" label="日期">
              <template slot-scope="scope">
                <div @click="maplist(scope.row)">
                  <span slot="reference">{{ scope.row.viewDate }}</span>
                </div>
                </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 点击地图标记点弹窗 -->
        <div v-if="drawer" class="markee">
          <div class="marke">
            <div class="main">
              <div class="txtmain">
                <div class="header">
                  <span>测线名称：{{ deformation[0].description }}</span>
                </div>
                <div class="txt">
                  <span>所属部门: {{ deformation[0].project }}</span>
                  <br />
                  <span>数据格式: {{ deformation[0].dataFormat }}</span>
                </div>
              </div>
              <div class="txtmain">
                <div class="header">
                  <span>数据量：{{ deformation[0].dataAmount }}</span>
                </div>
                <div class="txt">
                  <span>仪器型号: {{ deformation[0].instrument }}</span>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 地图 -->
        <div class="box">
          <selsmometry-map
            v-loading="loading"
            :list="station"
            @maplist="maplist"
            @lists="filterPlatList"
            :restmap="restmap"
            :deformation="deformationLine"
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
            :title="'地震测深'"
          ></mack-drawer>
        </div>
        <div class="change2D" v-show="!loading">
          <change-map></change-map>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getList,
  addCartApi
} from '@/api/cartList'
import {
  hotDataAdd
} from '@/api/hots'
import { Loading } from 'element-ui';
import Cookies from 'js-cookie'
import mackDrawer from '@/components/mackDrawer.vue'
import { encode, decode } from '@/utils/dataEncry'
import { getBasic, getGeophydata, getDRlist } from '@/api/probedata'
import changeMap from '@/components/changeMap.vue'
import cart from '@/components/cart.vue'
import { getToken } from '@/utils/auth'
import { Notification } from 'element-ui'
import { provinceAndCityData } from 'element-china-area-data'
import selsmometryMap from '@/components/map/index.vue'
import TopNav from '../../components/topNav.vue'
import topSel from '@/components/mapFilter/topSel.vue'
import leftDraw from '@/components/mapFilter/leftDraw.vue'
export default {
  name: 'InterfacePage',
  data() {
    return {
      loading: false,
      treeData: [
      {
        lineName: '地震测深',
          children: [{
            lineName: '人工地震测深',
            children: [{
              lineName: '按剖面名称'
            }]
          }]
        }
      ],
      // 显示Tips窗口
      TipDialog: false,
      //提示信息
      tipText: '',
      comTreeList: [],
      platName: [],
      addCartList: [],  //添加购物车列表
      tempCartList: [], //勾选的日期数据
      isAll: false, //是否全选
      // 地图资源
      restmap: {
        url: '/map-tianditu/rest/maps/地形底图_经纬度',
        urlLon: '/map-tianditu/rest/maps/地形中文注记_经纬度'
      },
      // 线
      deformationLine: [],
      deformation: [],

      markshow: false,
      // 抽屉的打开
      drawer: false,
      drawer1: false,
      // 水准点数据
      bench: [],
      // 树结构的属性
      treeshow: true,

      defaultProps: {
        children: 'children',
        label: 'lineName'
      },
      filterText: '',
      showName: false,
      // 按城市查询的数据
      options: provinceAndCityData,
      selectedOptions: [],
      map: null,
      circle_group: null,
      input: '',
      title: '测震数据',
      title1: '',
      show: false,
      company: [],
      station: [],
      top: -520,
      icon: 'el-icon-caret-left',
      // 查询参数
      networkOption: {
        netId: 1
      },
      total: 0,
      marke: null,
      // 查询台站详细数据的参数
      id: {
        unit_id: '',
        fp_id: ''
      },
      num: 0,
      // 台站详细数据
      unitList: [],
      drawerTitle: '',
      drawertitle: {
        title: '',
        time: '',
        num: '',
        nuit: ''
      },
      showCartBtn: false,
      // 被点击的线
      highspot: null
    }
  },
  components: { selsmometryMap, changeMap, TopNav, topSel, leftDraw, cart, mackDrawer }, // selsmometryMap
  created() {
    this.show = false
    this.drawer = false
    // this.loadNode()
  },
  mounted() {
    this.getCartList()
    this.handleNodeClick({lineName:'按剖面名称'})
    if(sessionStorage.getItem('tips')){
      this.tipText = sessionStorage.getItem('tips')
    }
  },
  computed: {},
  methods: {
    // 获取地图数据
    handleNodeClick(data) {
      if (data.lineName === '按剖面名称') {
        let data = encode({})
      getDRlist(data)
        .then((res) => {
          let list = decode(res)
          list.forEach(item=>{
            item.startLat = item.beginLatitude
            item.startLon = item.beginLongitude
            item.endLat = item.endLatitude
            item.endLon = item.endLongitude
          })
          this.loading = false
          this.showName = true
          this.deformationLine = list
          this.platName = list
          // this.treeData = list
        })
        .catch(() => {
          this.$message.error('请先登录')
        })
        this.top = 30
        let form = {
          keyName: '地震测深数据集',
          url: '/prevention/prospecting?type=0',
          linkUnit: this.tipText
        }
        hotDataAdd(encode(form)).then()
      }
    },
    handleShowName(data) {
      this.maplist(data)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.unitName.indexOf(value) !== -1
    },
    markees(val) {
      this.markshow = false
    },
    // 抽屉的关闭
    handleClose() {
      this.drawer = false
    },
    // 地图标记点点击
    maplist(val) {
      this.marke = val
      this.comTreeList = [val]
      this.station = val.childPoint
      this.highspot = val
      this.markshow = true
      this.getCataList()
    },
    handleSelectionChange(val) {
      if (val.length === 0) {
        this.comTreeList = []
        this.showCartBtn = false
      } else {
        this.showCartBtn = true
        this.comTreeList = val
      }
    },
    //日期数据子组件勾选后传值
    addCartItem(list){
      this.comTreeList = list
    },
    //监听子组件移除购物车内容
    changeCartList(list) {
      this.addCartList = list
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
            item.orderClasses = '地震测深数据'+'_'+item.lineName
            item.classesStandby = '时间：' + item.viewDate + '；提供单位：'+item.providerUnit+ '；联系人：'+item.linkMan+ '；联系方式：'+item.tel
            sendDept = item.providerUnit
            dataObj = {
              orderClasses:item.orderClasses,
              classesStandby:item.classesStandby,
              userName:Cookies.get('username'),
              sentDept: sendDept,
              subjectId: 12
            }
            list3.records.datas.push({...dataObj})
            // item.select = false
        })
        if(!this.includes(this.addCartList,list2)){
          this.addCartList = this.addCartList.concat(list2)
        }
        this.comTreeList = []
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
    //判断是否包含另一个数组
    includes(arr1, arr2) {
      return arr2.every(val => arr1.includes(val));
    },
    changeShow(state) {  //购物车显示与关闭
      this.drawer1 = state
    },
    // 点击多选框
    selectDox(selection, row) {
      // 清除所有勾选项
      this.$refs.multipleTable.clearSelection()
      this.station = []
      let selected = selection.length && selection.indexOf(row) !== -1
      // 当表格数据都没有被勾选的时候 就返回
      // 主要用于将当前勾选的表格状态清除
      if (selection.length === 0) return
      if (selected === true) {
        this.station = row.latAndLon
      } else {
        this.station = []
      }
      this.$refs.multipleTable.toggleRowSelection(row, true)
    },
    // 点击全选
    selectAll(selection) {
    },
    getCartList() {
      getList({
        userName: Cookies.get('username')
      }).then(res=>{
        this.addCartList = res
      })
    },
    // 把没有数据的栏目禁选
    selected(row, index) {
      if (row.latAndLon.length < 2) {
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
    },
    filterPlatList(val) {
      this.platName = val
    },
    searchVal(val) {
      let info = {}
      this.platName.map(item => {
        if(item.lineName.indexOf(val) != -1){
          info = item
        }
      })
      this.maplist(info)
    },
    // 获取数据详情
    getCataList() {
      // 连续站
      getGeophydata(encode({ bid: this.marke.id })).then((res) => {
        let list = decode(res)
        this.deformation = list
        this.platName = [{
          collectDataDate: this.deformation[0].date,
          lineName: this.deformation[0].description
        }]
        this.drawer = true
      })
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
    dateType(arr) {
      let array = []
      let data = []
      let num = arr.length
      for (let i = 0; i < num; i++) {
        let name = arr[i].oDate
        if (array.indexOf(name) === -1) {
          data.push({
            oDate: name,
            id: i + 1,
            children: [arr[i]]
          })
          array.push(name)
        } else {
          for (let j = 0; j < data.length; j++) {
            if (data[j].oDate === arr[i].oDate) {
              data[j].children.push(arr[i])
              break
            }
          }
        }
      }
      return data
    },
    closeDraw() {
      this.top = -520
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
    }
  }
}
</script>

<style lang="scss" scoped>
.el-main {
  position: relative;
  width: 100%;
  padding: 0px;
  .head {
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
  .dataList2 {
    position: absolute;
    z-index: 998;
    right: 55px;
    top: 20px;
    width: 220px;
    height: 500px;
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
  .addcart {
      position: absolute;
      top: 15px;
      right: 120px;
      z-index: 1000;
    }
  .start-list {
    position: absolute;
    z-index: 1000;
    left: 20px;
    top: 80px;
    width: 220px;
    max-height: 500px;
    overflow: auto;
    padding: 5px;
    border-radius: 10px;
    background-color: #fff;
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
    cursor: pointer;
  }
  .dataList {
    position: absolute;
    z-index: 1000;
    right: 315px;
    top: 20px;
    width: 300px;
    max-height: 500px;
    overflow: auto;
    // padding: 5px;
    border-radius: 10px;
    // background-color: #fff;
    ::v-deep .el-table .cell {
      padding: 0 4px;
    }
    ::v-deep .el-table--border .el-table__cell:first-child .cell {
      padding-left: 0px;
    }
  }
  .drawerlist {
    position: absolute;
    z-index: 1000;
    right: 15px;
    top: 20px;
    width: 300px;
    height: 500px;
    overflow: auto;
    border-radius: 10px;
    background-color: #fff;
    .header {
      padding: 10px;
      span {
        float: right;
        margin-top: -10px;
        padding: 5px;
        cursor: pointer;
      }
    }
    .main {
      padding: 5px;
      .top {
        p {
          font-size: 10px;
          margin-bottom: 8px;
        }
      }
      .content {
        ul {
          li {
            font-size: 10px;
            padding: 10px;
            text-align: center;
          }
          li:nth-child(2n-1) {
            background-color: #cbed85;
          }
        }
      }
    }
  }
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
.mainCard {
  .el-tabs__heade {
    margin: 0;
  }
}
.marke {
  width: 250px;
  z-index: 1000;
  background: #fff;
  .main {
    .txtmain {
      font-size: 12px;
      .header {
        padding: 3px;
        background-color: #cccccc;
      }
      .txt {
        font-size: 10px;
        padding: 3px;
        background-color: #fff;
        span {
          margin-right: 20px;
        }
      }
    }
  }
}
.markee {
  transition: margin-left 0.4s ease-out;
  position: absolute;
  top: 20%;
  left: 340px;
  width: 320px;
  padding: 8px;
  z-index: 1000;
  background: #fff;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  opacity: 1;
}
.hide {
  display: none;
}
::v-deep.el-tooltip__popper {
  max-width: 20%;
}
::v-deep.el-tooltip__popper,
::v-deep.el-tooltip__popper.is-dark {
  background: rgb(48, 65, 86) !important;
  color: #fff !important;
  line-height: 24px;
}
.title {
  color: #1492ff;
  padding: 10px;
  border-left: 5px solid #1492ff;
  margin-bottom: 20px;
}
.showtree {
  font-size: 14px;
  ::v-deep .el-tree-node__content {
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }
}
// 隐藏全选按钮
::v-deep.el-table__header-wrapper .el-checkbox {
  display: none;
}
.drawerDiv {
  background-color: #f0f0f0;
  padding: 10px;
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

::v-deep .el-drawer__header {
  font-weight: 700;
  color: #000 !important;
  padding: 10px 10px !important;
  margin: 0 !important;
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
