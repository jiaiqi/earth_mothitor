<template>
  <!-- 大地形变测量 -->
  <div class="refuge">
    <div>
      <cart :drawerTitle="drawerTitle" :drawer="drawer" :addCartList="addCartList" @showDraw="changeShow" @cartList="changeCartList"></cart>
    </div>
    <el-container>
      <el-main style="position: relative;height: 100%;">
        <div class="head">
          <div class="topNav">
            <top-nav :pageName="'水准测网'"></top-nav>
          </div>
          <top-sel class="topSel" :yearlist="yearList" type="流动形变" @filter="filterYear" @search="searchVal"></top-sel>
        </div>
        <div
          class="tiggle"
          @click="tiggle"
          :style="{ 'margin-left': left + 'px' }"
        >
          <i :class="icon"></i>
        </div>
        <el-dialog style="margin-top:50px" title="关于水准数据的提示" :visible.sync="TipDialog" width="56%">
          <div v-html="tipText">
          </div>
        </el-dialog>
        <div class="start-list" :style="{ 'margin-left': left + 'px' }">
          <left-draw
            :prop="props"
            :load="loadNode"
            :nodeClick="handleNodeClick"
          >
          </left-draw>
        </div>
        <div
          class="cartBtn"
          @click="drawer = true"
        >
          <el-badge :value="addCartList ? addCartList.length : 0" :max="99" class="item">
            <i class="el-icon-shopping-cart-2"></i>
          </el-badge>
          <p style="padding:0px 15px;line-height: 22px;">成果车</p>
        </div>
        <div class="dataList" :style="{ 'margin-top': top + 'px' }">
          <div class="close" @click="closeDraw">
            <el-tooltip content="隐藏" placement="top" effect="light">
              <i class="el-icon-caret-top"></i>
            </el-tooltip>
          </div>
<!--          <el-button class="addcart" :style="{ 'margin-top': (top - 33) + 'px' }"
          type="danger" size="mini" @click="addCart(comTreeList)">加入成果车</el-button>-->
          <!-- 详细数据 -->
          <div class="list">
            <el-table
              :data="deformation1.filter(
                (data) =>
                  !search ||
                  data.lineName.toLowerCase().includes(search.toLowerCase()) ||
                  data.lineName.replaceAll(' ', '').includes(search.trim())
              )
            "
              style="width: 100%; font-size: 13px"
              size="mini"
              height="450"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              stripe
              :default-sort="{ prop: 'time', order: 'descending' }"
            >
              <el-table-column
                type="selection"
                width="20"
                :selectable="selected"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="time"
                label="观测日期"
                sortable
                width="84"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="lineName"
                label="测线名称"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <div @click="selectDox([scope.row])" style="cursor:pointer">
                    {{ scope.row.lineName }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 点击地图标记点弹窗 -->
        <div
          v-if="markshow && marke"
          class="markee"
          :style="{ 'margin-left': left + 'px' }"
        >
          <mack-drawer
            :markeArr="marke"
            :title="'流动形变'"
            @markees="markees"
            :unit="unitName"
          ></mack-drawer>
          <!-- <el-button type="primary" size="mini" @click="getCataList"
            >数据目录详情</el-button
          > -->
        </div>
        <!-- 地图 -->
        <div class="box">
          <selsmometry-map
            v-loading="loading"
            :list="deformation1"
            @maplist="maplist"
            @lists="filterPlatList"
            :restmap="restmap"
            :LineHeig="LineHeig"
            :deformation="deformation"
            :highspot="highspot"
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
import { encode, decode } from '@/utils/dataEncry'
import { Loading } from 'element-ui';
import { getCompany, getStand, getYList, getCUnit, getUnit } from '@/api/deformation'
// import { getFlowNet, getFlowGnss, getContinuousList } from '@/api/gnss'
import { provinceAndCityData } from 'element-china-area-data'
import selsmometryMap from '@/components/map/index.vue'
import changeMap from '@/components/changeMap.vue'
import leftDraw from '@/components/mapFilter/leftDraw.vue'
import TopNav from '@/components/topNav.vue'
import topSel from '@/components/mapFilter/topSel.vue'
import mackDrawer from '@/components/mackDrawer.vue'
import cart from '@/components/cart.vue'
import {
  hotDataAdd,
} from '@/api/hots'
import {
  getList,
  addCartApi
} from '@/api/cartList'
import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth'
import { Notification } from 'element-ui'
export default {
  name: 'InterfacePage',
  data() {
    return {
      // 水准戴安的线
      LineHeig: null,
      loading: true,
      search: '',
      // Tips窗口 显示提示信息
      TipDialog: false,
      //提示信息
      tipText: '',
      // 地图资源
      restmap: {
        url: '/map-tianditu/rest/maps/地形底图_经纬度',
        urlLon: '/map-tianditu/rest/maps/地形中文注记_经纬度'
      },
      // 大地形变线
      deformation: [],
      deformation1: [],
      addCartList: [],  //添加购物车列表
      tempCartList: [], //勾选的日期数据
      isAll: false, //是否全选
      comTreeList: [],
      props: {
        label: 'netName',
        children: 'zones',
        isLeaf: 'leaf'
      },
      markshow: false,
      // 抽屉的打开
      drawer: false,
      drawer1: false,
      // 水准点数据
      bench: [],
      // 树结构的属性
      treeshow: true,
      highspot: null,
      defaultProps: {
        children: 'children',
        label: 'netName' || 'unitName'
      },
      filterText: '',
      // 按城市查询的数据
      options: provinceAndCityData,
      selectedOptions: [],
      left: 0,
      top: -600,
      icon: 'el-icon-caret-left',
      map: null,
      circle_group: null,
      input: '',
      title: '测震数据',
      title1: '',
      showCartBtn: false,
      company: [],
      station: [],
      lineInfo: {},
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
      yearList: [],
      // 台站详细数据
      unitList: [],
      unitName: '',
      drawerTitle: '',
      drawertitle: {
        title: '',
        time: '',
        num: '',
        nuit: ''
      }
    }
  },
  components: { selsmometryMap, changeMap, leftDraw, TopNav, topSel, mackDrawer,cart }, // selsmometryMap
  created() {
    this.show = false
    this.station = []
    this.highspot = null
    this.markshow = false
    this.drawer = false
    this.drawer1 = false

    // this.getDeformation()
  },
  mounted() {
    this.getYearList()
    this.getHotList()
    this.getCartList()
    this.handleNodeClick({type: 'year',netName:'全部'})
    if(sessionStorage.getItem('tips')){
      this.tipText = sessionStorage.getItem('tips')
    }
  },
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 获取前两层数据
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.loading = false
        return resolve([
          {
            netName: '区域精密水准'
          }
        ])
      }else if (node.level === 1) {
          this.station = []
          let data = encode({})
          getCompany(data).then((res) => {
            let list = decode(res)
            let yearlist = []
            list.forEach((item, index) => {
              for (let i = 0; i < list.length - index; i++) {
                if (list[i] < list[i + 1]) {
                  let temp = list[i]
                  list[i] = list[i + 1]
                  list[i + 1] = temp
                }
              }
            })
            list.forEach((item) => {
              yearlist.push(
                {
                  netName: item,
                  type: 'year',
                  leaf: true
                }
              )
            })
            yearlist.unshift(
                {
                  netName: '全部',
                  type: 'year',
                  leaf: true
                }
            )
            this.top = 10
            return resolve(yearlist)
          })
      }
      if (node.level === 3) {
        return resolve([])
      }
      if (node.level > 3) {
        return resolve([])
      }
    },
    getCartList() {
      getList({
        userName: Cookies.get('username')
      }).then(res=>{
        this.addCartList = res
      })
    },
    // 获取地图数据
    handleNodeClick(data) {
      if (data.netName === '区域精密水准') {
        this.station = []
        this.highspot = null
        this.markshow = false
        this.drawer = false
        this.drawer1 = false
      }
      if (data.type === 'year') {
        let data2 = {}
        if(data.netName == '全部'){
          data2 = encode({
            year: ''
          })
        }else {
          data2 = encode({
            year: data.netName
          })
        }
        getYList(data2).then((res) => {
            this.bench = decode(res)
            // let data = []
            for (let i = 0; i < this.bench.length; i++) {
              // let arr = {
              //   netName: this.bench[i].unit_name,
              //   unit_id: this.bench[i].unit_id,
              //   unit_name: this.bench[i].unit_name,
              //   leaf: true
              // }
              // data.push(arr)
            this.bench.forEach((item) => {
              let time = this.setTime(item.time)
              item.time = time
            })
            this.bench = this.bench.filter((item) => item.latAndLon.length > 2)
              this.deformation = this.bench
              this.deformation1 = this.bench
            }
        })
      }

      if (data.unit_name) {
        this.deformation = []
        this.show = false
        let datas = encode({ id: data.unit_id })
        getCompany(datas).then((res) => {
          let list = decode(res)
          list.forEach((item) => {
            let time = this.setTime(item.time)
            item.time = time
          })
          list = list.filter((item) => item.latAndLon.length > 2)
          this.deformation = list
          this.deformation1 = list

          this.top = 10
        })
      }
    },
    getYearList() {
      getCompany(encode({})).then((res) => {
        let list = decode(res)
        list.forEach((item, index) => {
          for (let i = 0; i < list.length - index; i++) {
            if (list[i] < list[i + 1]) {
              let temp = list[i]
              list[i] = list[i + 1]
              list[i + 1] = temp
            }
          }
        })
        list.forEach((item) => {
          this.yearList.push(
            {
              value: item,
              label: item
            }
          )
        })
      })
    },
    //加载热点信息
    getHotList() {
      if(!sessionStorage.getItem('hotInfo')){
        return
      }
      const self = this
      let name = JSON.parse(sessionStorage.getItem('hotInfo')).keyName
      if(name.split('-')[0] == '水准数据'){
        let id = JSON.parse(sessionStorage.getItem('hotInfo')).postUrl
        setTimeout(() => {
          self.filterYear({lineName: id})
        }, 1200);
      }
    },
    filterYear(data) {
      let data2 = {
        year: data
      }
      if(data.lineName) {
        data2 = {
          lineName: data.lineName
        }
      }
      getYList(encode(data2)).then((res) => {
          this.bench = decode(res)
          for (let i = 0; i < this.bench.length; i++) {
          this.bench.forEach((item) => {
            let time = this.setTime(item.time)
            item.time = time
          })
          this.top = 10
          this.bench = this.bench.filter((item) => item.latAndLon.length > 2)
            this.deformation = this.bench
            this.deformation1 = this.bench
          }
      })
    },
    // 抽屉的关闭
    handleClose() {
      this.drawer = false
    },
    // 地图标记点点击
    maplist(val) {
      console.log(val)
      this.highspot = val
      // val.cTime = this.setTime(val.cTime).slice(0, 4)
      this.marke = val
      this.deformation1 = [{...val}]
      getCUnit(encode({})).then((res) => {
        decode(res).map(item => {
          if(item.id == val.line_id){
            getUnit(encode({})).then((resp) => {
              decode(resp).map(itm => {
                if(itm.unit_id == item.unitId){
                  this.unitName = itm.unit_name
                }
              })
            })
          }
        })
      })
      let form = {
        keyName: '水准数据-'+val.lineName+'台站数据集',
        url: '/precursor/flowmation',
        postUrl: val.lineName
      }
      hotDataAdd(encode(form)).then()
      this.markshow = true
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
    filterPlatList(val) {
      this.deformation1 = val
      console.log(val)
    },
    markees(val) {
      this.markshow = false
      this.deformation1 = [...this.deformation]
    },
    getCataList(data) {
      this.top = 10
    },
    closeDraw() {
      this.top = -580
    },
    searchVal(val) {
      this.search = val
    },
    // 点击多选框
    selectDox(selection) {
      this.LineHeig = selection
      // 重绘线
      let json = []
      json = this.deformation1.filter((key) =>
        selection.every((val) => val.lineName !== key.lineName)
      )
      this.deformation = json
      // alert(JSON.stringify(selection))

      // 清除所有勾选项
      // this.$refs.multipleTable.clearSelection()
      // this.station = []
      // let selected = selection.length && selection.indexOf(row) !== -1
      // 当表格数据都没有被勾选的时候 就返回
      // 主要用于将当前勾选的表格状态清除
      // if (selection.length === 0) return
      // if (selected === true) {
      //   this.station = row.latAndLon
      // } else {
      //   this.station = []
      // }
      // this.$refs.multipleTable.toggleRowSelection(row, true)
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
          let dataObj = {}
            item.orderClasses = '水准数据'+'_'+item.lineName.replaceAll('/','_')
            item.classesStandby = item.time
            dataObj = {
              orderClasses:item.orderClasses,
              classesStandby:item.classesStandby,
              userName:Cookies.get('username'),
              sentDept: '',
              subjectId: 9
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
    // 点击全选
    selectAll(selection) {
      this.LineHeig = selection
      let json = []

      json = this.deformation1.filter((key) =>
        selection.every((val) => val.lineName !== key.lineName)
      )
      this.deformation = json
    },
    // 把没有数据的栏目禁选
    selected(row, index) {
      if (row.latAndLon.length < 2) {
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
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
      top: 20px;
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
  .dataList {
    position: absolute;
    z-index: 1000;
    right: 55px;
    top: 60px;
    width: 300px;
    max-height: 500px;

    transition: margin-top 0.4s ease-out;
    -webkit-transition: margin-top 0.4s ease-out;
    -moz-transition: margin-top 0.4s ease-out;
    -o-transition: margin-top 0.4s ease-out;
    -ms-transition: margin-top 0.4s ease-out;
    .cart {
      font-size: 10px;
      text-align: center;
      margin-bottom: 2px;
    }
    .close {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      font-size: 20px;
      cursor: pointer;
      position: relative;
      top: 5px;
      right: 3px;
    }
    .addcart {
      position: absolute;
      top: 15px;
      right: 200px;
      z-index: 1000;
    }
    .list {
      border-radius: 6px;
      padding: 6px;
      background: #fff;
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
.markee {
  transition: margin-left 0.4s ease-out;
  position: absolute;
  top: 20%;
  left: 340px;
  width: 320px;
  height: 270px;
  z-index: 1000;
  background: #fff;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  opacity: 1;
  .el-button {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
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
