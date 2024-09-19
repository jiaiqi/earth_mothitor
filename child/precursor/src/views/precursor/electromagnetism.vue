<template>
  <!-- 电磁 -->
  <div class="refuge">
    <div>
      <cart :drawerTitle="drawerTitle" :drawer="drawer" :addCartList="addCartList" @showDraw="changeShow" @cartList="changeCartList"></cart>
    </div>
    <el-container>
      <el-main style="position: relative;height: 100%;">
        <div class="head">
          <div class="topNav">
            <top-nav :pageName="type == 1?'地磁':'地电'"></top-nav>
          </div>
          <!-- <top-sel class="topSel" :stationList="station" type="电磁" @filter="filterVal"></top-sel> -->
        </div>
        <div
          class="tiggle"
          @click="tiggle"
          :style="{ 'margin-left': left + 'px' }"
        >
          <i :class="icon"></i>
        </div>
        <el-dialog style="margin-top:50px" :title="'关于'+(type == 1?'地磁':'地电')+'数据的提示'" :visible.sync="TipDialog" width="56%">
          <div v-html="tipText">
          </div>
        </el-dialog>
        <div
          class="start-list"
          v-loading="loading1"
          :style="{ 'margin-left': left + 'px' }"
        >
          <el-button
            type="danger"
            class="tips-button"
            @click="showDialog"
            round
            size="mini"
          >Tips
          </el-button>
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
        <div class="dataList" :style="{ 'margin-top': top + 'px' }">
          <div class="close" @click="closeDraw">
            <el-tooltip content="隐藏" placement="top" effect="light">
              <i class="el-icon-caret-top"></i>
            </el-tooltip>
          </div>
          <el-button class="addcart" :style="{ 'margin-top': (top - 28) + 'px' }" 
        type="danger" size="mini" @click="addCart(comTreeList)">加入成果车</el-button>
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
          <!-- 详细数据 -->
          <div class="list">
            <el-table
            class="dataListTable"
            id="tableShow"
            :data="station.filter(
                (data) =>
                  !search ||
                  data.sta_name.toLowerCase().includes(search.toLowerCase()) ||
                  data.sta_name.replaceAll(' ', '').includes(search.trim())
              )
            "
            row-key="id"
            border
            style="width: 100%"
            size="small"
            height="400"
            stripe
            v-if="!show"
            accordion
            @selection-change="handleSelectionChange"
            :tree-props="{ children: 'children' }"
          >
            <!-- <el-table-column type="selection" width="40" /> -->
            <el-table-column
              prop="sta_name"
              label="台站名称"
              align="center"
              sortable
              width="140"
            >
            <template slot-scope="scope">
                <div @click="maplist(scope.row)">
                  {{ scope.row.sta_name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="sta_code"
              label="代码"
              align="center"
              width=""
            >
            </el-table-column>
          </el-table>
          <dateDatas v-else style="width: 280px;height: 460px;background-color: #fff;" :days="tableData" @addCartItem="addCartItem"></dateDatas>
          </div>
        </div>

        <!-- 点击地图标记点弹窗 -->
        <div
          v-if="markshow"
          class="markee"
          :style="{ 'margin-left': left + 'px' }"
        >
          <mack-drawer
            :markeArr="marke"
            :title="'电磁'"
            @markees="markees"
            :dataLength="tableData.length"
            :stationName="stationName"
          ></mack-drawer>
          <!-- <el-button type="primary" size="mini" @click="getCataList"
            >数据目录详情</el-button
          > -->
        </div>
        <!-- 地图 -->
        <div class="box">
          <selsmometry-map
            v-loading="loading"
            :list="station"
            @maplist="maplist"
            @lists="filterPlatList"
            :restmap="restmap"
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
import {
  getPrecursorList,
  getPreitem,
  getPrestationList,
  getpredataList
} from '@/api/precursor'
import {
  hotAdd,
  hotDataAdd,
  getFlagList
} from '@/api/hots'
import {
  getList,
  addCartApi
} from '@/api/cartList'
import { Loading } from 'element-ui';
import Cookies from 'js-cookie'
import changeMap from '@/components/changeMap.vue'
import { provinceAndCityData } from 'element-china-area-data'
import selsmometryMap from '@/components/map/index.vue'
import TopNav from '@/components/topNav.vue'
// import topSel from '@/components/mapFilter/topSel.vue'
import leftDraw from '@/components/mapFilter/leftDraw.vue'
import mackDrawer from '@/components/mackDrawer.vue'
import dateDatas from '@/components/date/dateDatas.vue'
import cart from '@/components/cart.vue'
import { getToken } from '@/utils/auth'
import { Notification } from 'element-ui'
export default {
  name: 'InterfacePage',
  data() {
    return {
      // 显示Tips窗口
      TipDialog: false,
      loading: true,
      loading1: true,
      //提示信息
      tipText: '',
      // 地图资源
      restmap: {
        url: '/map-tianditu/rest/maps/地形底图_经纬度',
        urlLon: '/map-tianditu/rest/maps/地形中文注记_经纬度'
      },
      // 大地形变线
      deformation: [],
      props: {
        label: 'itemName',
        children: 'zones',
        isLeaf: 'leaf'
      },
      search: '',
      markshow: false,
      // 抽屉的打开
      drawer: false,
      drawer1: false,
      left: 0,
      top: -600,
      icon: 'el-icon-caret-left',
      // 水准点数据
      bench: [],
      // 树结构的属性
      treeshow: true,
      // 选择右侧选项卡样式
      isActive: false,
      filterText: '',
      // 按城市查询的数据
      options: provinceAndCityData,
      selectedOptions: [],
      map: null,
      stationName: '',
      circle_group: null,
      input: '',
      title: '',
      title1: '',
      showCartBtn: false,
      company: [],
      station: [],
      tableData: [],
      highspot: null,
      show: false,
      // 查询参数
      networkOption: {
        netId: 1
      },
      total: 0,
      marke: null,
      comTreeList: [],
      // 查询台站详细数据的参数
      id: {
        unit_id: '',
        fp_id: ''
      },
      num: 0,
      //区分地磁和地电页面
      type: 0,
      // 台站详细数据
      unitList: [],
      addCartList: [],  //添加购物车列表
      tempCartList: [], //勾选的日期数据
      isAll: false, //是否全选
      drawerTitle: '',
      drawertitle: {
        title: '',
        time: '',
        num: '',
        nuit: ''
      },
      thisProvince: '', //当前点击的省份
      provinces: [
        {"id":2,"item":312,"netCode":"BJ","netName":"北京"},
        {"id":32,"item":312,"netCode":"TJ","netName":"天津"},
        {"id":12,"item":312,"netCode":"HE","netName":"河北"},
        {"id":31,"item":312,"netCode":"SX","netName":"山西"},
        {"id":24,"item":312,"netCode":"NM","netName":"内蒙"},
        {"id":23,"item":312,"netCode":"LN","netName":"辽宁"},
        {"id":20,"item":312,"netCode":"JL","netName":"吉林"},
        {"id":14,"item":312,"netCode":"HL","netName":"黑龙江"},
        {"id":29,"item":312,"netCode":"SH","netName":"上海"},
        {"id":21,"item":312,"netCode":"JS","netName":"江苏"},
        {"id":36,"item":312,"netCode":"ZJ","netName":"浙江"},
        {"id":1,"item":312,"netCode":"AH","netName":"安徽"},
        {"id":5,"item":312,"netCode":"FJ","netName":"福建"},
        {"id":22,"item":312,"netCode":"JX","netName":"江西"},
        {"id":28,"item":312,"netCode":"SD","netName":"山东"},
        {"id":10,"item":312,"netCode":"HA","netName":"河南"},
        {"id":11,"item":312,"netCode":"HB","netName":"湖北"},
        {"id":15,"item":312,"netCode":"HN","netName":"湖南"},
        {"id":6,"item":312,"netCode":"GD","netName":"广东"},
        {"id":8,"item":312,"netCode":"GX","netName":"广西壮族自治区"},
        {"id":13,"item":312,"netCode":"HI","netName":"海南"},
        {"id":3,"item":312,"netCode":"CQ","netName":"重庆"},
        {"id":27,"item":312,"netCode":"SC","netName":"四川"},
        {"id":9,"item":312,"netCode":"GZ","netName":"贵州"},
        {"id":35,"item":312,"netCode":"YN","netName":"云南"},
        {"id":34,"item":312,"netCode":"XZ","netName":"西藏"},
        {"id":30,"item":312,"netCode":"SN","netName":"陕西"},
        {"id":7,"item":312,"netCode":"GS","netName":"甘肃"},
        {"id":26,"item":312,"netCode":"QH","netName":"青海"},
        {"id":25,"item":312,"netCode":"NX","netName":"宁夏"},
        {"id":33,"item":312,"netCode":"XJ","netName":"新疆"}
      ],
    }
  },
  components: { selsmometryMap, changeMap, TopNav, leftDraw, mackDrawer, dateDatas, cart }, // selsmometryMap
  created() {
    this.highspot = null
    this.show = false
    this.type = this.$route.query.type
  },
  mounted() {
    this.getCartList()
    this.getHotList()
    // this.handleNodeClick({itemName:'国家站网'})
    if(sessionStorage.getItem('tips')){
      this.tipText = sessionStorage.getItem('tips')
    }
  },
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    $route(val) {
      this.$router.go(0)
    }
  },
  methods: {
    // 获取前两层数据
    loadNode(node, resolve) {
        this.loading1 = false
        this.loading = false
      return resolve([])
      // if (node.level === 0) {
      //   this.loading1 = false
      //   this.loading = false
      //   let arr = [
      //     {
      //       itemName: '国家站网',
      //     },
      //     {
      //       itemName: '省级站网',
      //     },
      //     {
      //       itemName: '市县站网',
      //     },
      //     {
      //       itemName: '其他站网',
      //       leaf: true
      //     }
      //   ]
      //   return resolve(arr)
      // }else if (node.level === 1) {
      //   if(node.label == '国家站网'){
      //   let arr = []
      //     if(this.type == 1){
      //       arr = [
      //         {
      //           itemName: '地磁'
      //         }
      //       ]
      //     }else {
      //       arr = [
      //         {
      //           itemName: '地电'
      //         }
      //       ]
      //     }
      //     return resolve(arr)
      //   }else if(node.label == '省级站网' || node.label == '市县站网'){
      //     let data = node.data
      //     if (data) {
      //       let list = this.provinces
      //           list.forEach((item) => {
      //             item.itemName = item.netName
      //           })
      //         return resolve(list)
      //     }
      //   }else {

      //   }
      // } else if (node.level === 2) {
      //   // let arr = { keyname: node.data.itemName }
      //   // let isProvince = false
      //   // if(node.data.itemName != '地磁' && node.data.itemName != '地电'){
      //   //   arr = { keyname: this.type == 1?'地磁': '地电'}
      //   //   isProvince = true
      //   // }else {
      //   //   isProvince = false
      //   // }
      //   // getPreitem(encode(arr)).then((res) => {
      //   //   let list = decode(res)
      //   //   if(isProvince){
      //   //     list.forEach(item=>{
      //   //       item.leaf = true
      //   //     })
      //   //   }
      //     return resolve([])
      //   // })
      // } else if (node.level === 3) {
      //   // let item1 = { item: node.data.item }
      //   // getPrecursorList(encode(item1)).then((res) => {
      //   //   let list = decode(res)
      //   //   list.forEach((key) => {
      //   //     key.item = item1.item
      //   //     key.itemName = key.netName
      //   //     key.leaf = true
      //   //   })
      //     return resolve([])
      //   // })
      // }
      // if (node.level === 4) {
      //   return resolve([])
      // }
    },
    getCartList() {
      getList({
        userName: Cookies.get('username')
      }).then(res=>{
        this.addCartList = res
      })
    },
    // 显示 Tips窗口
    showDialog() {
      this.TipDialog = !this.TipDialog
    },
    //加载热点信息
    getHotList() {
      if(!sessionStorage.getItem('hotInfo')){
        return
      }
      const self = this
      let name = JSON.parse(sessionStorage.getItem('hotInfo')).keyName
      if(name.split('-')[0] == '地磁数据' || name.split('-')[0] == '地电数据'){
        let id = JSON.parse(sessionStorage.getItem('hotInfo')).postUrl
        setTimeout(() => {
          self.filterVal(id)
        }, 1200);
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
            item.orderClasses = (this.type == 1?'地磁数据': '地电数据')+'_'+this.drawerTitle
            item.classesStandby = item.dataDate ? item.dataDate : item.year ? item.year : item.month
            dataObj = {
              orderClasses:item.orderClasses,
              classesStandby:item.classesStandby,
              userName:Cookies.get('username'),
              sentDept: '',
              subjectId: this.type == 1 ? 2 : 3
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
    // 获取地图数据
    handleNodeClick(data) {
      // this.markshow = false
      // this.highspot = null
      // this.station = []
      // if (data.netName) {
      //   this.thisProvince = data.id
      //   getPrestationList(encode({ item: data.item, netId: this.thisProvince })).then(
      //     (res) => {
      //       let list = decode(res)
      //       list.forEach((item) => {
      //         item.staLat = item.sta_lat
      //         item.staLon = item.sta_lon
      //       })
      //       this.top = 10
      //       list.map((item,index) => {
      //         if(list[index].sta_code == list[index+1].sta_code){
      //         }else {
      //           this.station.push(item)
      //         }
      //       })
      //       if (list.length === 0) {
      //         this.$message.error('台站数为空')
      //       }
      //     }
      //   )
      // } else if (data.itemName === '国家站网') {
      //   getPrestationList({}).then((res) => {
      //     let list = decode(res)
      //     list.forEach((item) => {
      //       item.staLat = item.sta_lat
      //       item.staLon = item.sta_lon
      //     })
      //     let a = /^3[1,2,4][.]*/
      //     list = list.filter((item) => a.test(item.u_item) === true)
      //     this.top = 10
      //     list.map((item,index) => {
      //         if(list[index].sta_code == list[index+1].sta_code){
      //           // console.log(list[index])
      //         }else {
      //           this.station.push(item)
      //         }
      //       })
      //     if (list.length === 0) {
      //       this.$message.error('台站数为空')
      //     }
      //   })
      // }else if(data.keyname){
      //   this.stationName = data.netName
      //   getPrestationList(encode({ item: data.item, netId: this.thisProvince })).then(
      //     (res) => {
      //       let list = decode(res)
      //       list.forEach((item) => {
      //         item.staLat = item.sta_lat
      //         item.staLon = item.sta_lon
      //       })
      //       this.top = 10
      //       list.map((item,index) => {
      //         if(list[index].sta_code == list[index+1].sta_code){
      //           // console.log(list[index])
      //         }else {
      //           this.station.push(item)
      //         }
      //       })
      //       if (list.length === 0) {
      //         this.$message.error('台站数为空')
      //       }
      //     }
      //   )
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

    // 抽屉的关闭
    handleClose() {
      this.drawer = false
    },
    // 地图标记点点击
    maplist(val) {
      // val.cTime = this.setTime(val.cTime).slice(0, 4)
      this.marke = val
      this.highspot = val
      this.markshow = true
      this.getCataList(val)
    },
    getCataList(data) {
      let arr = { staCode: '', netId: '', item: '' }
      arr.staCode = this.marke.sta_code
      arr.netId = this.marke.net_id
      arr.item = this.marke.u_item
      // alert(JSON.stringify(this.marke))
      getpredataList(encode(arr)).then((res) => {
        this.tableData = decode(res)
        if (this.tableData.length > 0) {
          this.show = true
          this.isActive = true
          if (this.top < 0) {
            this.top = 10
          }
          this.drawerTitle = `${this.marke.sta_name}台站`
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
      let type = this.type == 1?'地磁数据-': '地电数据-'
      let form = {
        keyName: type+data.sta_name+'台站数据集',
        url: '/precursor/electromagnetism',
        linkUnit: this.tipText,
        postUrl: this.marke.sta_code
      }
      hotDataAdd(encode(form)).then()
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
    closeDraw() {
      this.top = -580
    },
    changeShow(state) {  //购物车显示与关闭
      this.drawer = state
    },
    markees(val) {
      this.markshow = false
    },
    filterPlatList(val) {
      this.station = val
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
      // console.log(selection)
    },
    // 把没有数据的栏目禁选
    selected(row, index) {
      if (row.latAndLon.length < 2) {
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
    },
    // 获取数据详情
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
    filterVal(id) {
      let info = {}
      this.station.map(item => {
        if(item.sta_code == id){
          info = item
        }
      })
      this.maplist(info)
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
  }
  .addcart {
    position: absolute;
    top: 10px;
    right: 200px;
    z-index: 1000;
  }
  .stationlist,
  .dataList2 {
    position: absolute;
    top: 130px;
    right: 360px;
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
  .dataList2 {
    top: 183px;
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
  .dataList {
    position: absolute;
    z-index: 1000;
    right: 60px;
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
    .top {
      position: relative;
      top: 0;
      right: 0;
      width: 300px;
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
    .list {
      padding: 6px;
      background: #fff;
    }
    ::v-deep .el-table .cell {
      padding: 0 4px;
    }
    ::v-deep .el-table--border .el-table__cell:first-child .cell {
      padding-left: 0px;
    }
  }
}
.box {
  height: 90vh;
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
  height: 240px;
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
