<template>
  <!-- 定点形变 -->
  <div class="refuge">
    <div>
      <cart :drawerTitle="drawerTitle" :drawer="drawer" :addCartList="addCartList" @showDraw="changeShow" @cartList="changeCartList"></cart>
    </div>
    <el-container>
      <el-main style="position: relative; height: 100%;">
        <div class="head">
          <div class="topNav">
            <top-nav :pageName="navName"></top-nav>
          </div>
          <top-sel class="topSel" type="定点形变" :stationList="station" @filter="filterVal"></top-sel>
        </div>
        <div
          class="tiggle"
          @click="tiggle"
          :style="{ 'margin-left': left + 'px' }"
        >
          <i :class="icon"></i>
        </div>
        <el-dialog style="margin-top:50px" title="关于定点形变数据的提示" :visible.sync="TipDialog" width="56%">
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
        <div class="dataList" :style="{ 'margin-top': top + 'px' }">
          <div class="close" @click="closeDraw">
            <el-tooltip content="隐藏" placement="top" effect="light">
              <i class="el-icon-caret-top"></i>
            </el-tooltip>
          </div>
<!--          <el-button class="addcart" :style="{ 'margin-top': (top - 28) + 'px' }"
          type="danger" size="mini" @click="addCart(comTreeList)">加入成果车</el-button>-->
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
              :data="station.filter(
                (data) =>
                  !search ||
                  data.sta_name.toLowerCase().includes(search.toLowerCase()) ||
                  data.sta_name.replaceAll(' ', '').includes(search.trim())
              )
            "
              style="width: 100%;font-size: 16px;cursor: pointer;"
              size="small"
              height="430"
              border
              ref="multipleTable"
              v-if="!show"
              @selection-change="handleSelectionChange"
              stripe
            >
              <!-- <el-table-column
                type="selection"
                width="30">
              </el-table-column> -->
              <el-table-column
                prop="sta_name"
                label="台站名称"
                sortable
                width="150"
                align="center"
              >
              <template slot-scope="scope">
                <div @click="maplist(scope.row)">
                  {{ scope.row.sta_name }}
                </div>
              </template>
              </el-table-column>
              <el-table-column
                prop="sta_code"
                label="编号"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
            </el-table>
            <dateDatas v-else style="width: 280px;background-color: #fff;" :days="tableData" @addCartItem="addCartItem"></dateDatas>
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
            :title="'定点形变'"
            @markees="markees"
            :dataLength="deformation.length"
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
  getWordList,
  getpredataList,
} from '@/api/precursor'
import {
  getList,
  addCartApi
} from '@/api/cartList'
import {
  hotDataAdd
} from '@/api/hots'
import Cookies from 'js-cookie'
import { Loading } from 'element-ui';
import changeMap from '@/components/changeMap.vue'
import { provinceAndCityData } from 'element-china-area-data'
import selsmometryMap from '@/components/map/index.vue'
import TopNav from '@/components/topNav.vue'
import leftDraw from '@/components/mapFilter/leftDraw.vue'
import topSel from '@/components/mapFilter/topSel.vue'
import mackDrawer from '@/components/mackDrawer.vue'
import dateDatas from '@/components/date/dateDatas.vue'
import cart from '@/components/cart.vue'
import { getToken } from '@/utils/auth'
import { Notification } from 'element-ui'
export default {
  name: 'InterfacePage',
  data() {
    return {
      loading: true,
      // 地图资源
      restmap: {
        url: '/map-tianditu/rest/maps/地形底图_经纬度',
        urlLon: '/map-tianditu/rest/maps/地形中文注记_经纬度'
      },
      // Tips窗口 显示提示信息
      TipDialog: false,
      //提示信息
      tipText: '',
      // 大地形变线
      deformation: [],
      addCartList: [],  //添加购物车列表
      tempCartList: [], //勾选的日期数据
      isAll: false, //是否全选
      props: {
        label: 'itemName',
        children: 'zones',
        isLeaf: 'leaf'
      },
      navName: '应变站网',
      markshow: false,
      highspot: null,
      // 抽屉的打开
      drawer: false,
      drawer1: false,
      stationName: '',
      // 选择右侧选项卡样式
      isActive: false,
      show: false,
      // 水准点数据
      bench: [],
      // 树结构的属性
      treeshow: true,
      filterText: '',
      // 按城市查询的数据
      options: provinceAndCityData,
      selectedOptions: [],
      map: null,
      circle_group: null,
      left: 0,
      top: -620,
      icon: 'el-icon-caret-left',
      input: '',
      title: '测震数据',
      title1: '',
      showCartBtn: false,
      company: [],
      station: [],
      search: '',
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
      // 台站详细数据
      unitList: [],
      //子站
      isChildProvince: false,
      drawerTitle: '',
      drawertitle: {
        title: '',
        time: '',
        num: '',
        nuit: ''
      },
      thisProvince: '', //当前选择的省市
      provinces: [
        {"id":1,"netCode":"AH","netName":"安徽省"},
        {"id":2,"netCode":"BJ","netName":"北京市"},
        {"id":3,"netCode":"CQ","netName":"重庆市"},
        {"id":22,"netCode":"FJ","netName":"福建省"},
        {"id":6,"netCode":"GD","netName":"广东省"},
        {"id":7,"netCode":"GS","netName":"甘肃省"},
        {"id":8,"netCode":"GX","netName":"广西壮族自治区"},
        {"id":9,"netCode":"GZ","netName":"贵州省"},
        {"id":11,"netCode":"HB","netName":"湖北省"},
        {"id":12,"netCode":"HE","netName":"河北省"},
        {"id":13,"netCode":"HI","netName":"海南省"},
        {"id":14,"netCode":"HL","netName":"黑龙江省"},
        {"id":15,"netCode":"HN","netName":"湖南省"},
        {"id":20,"netCode":"JL","netName":"吉林省"},
        {"id":21,"netCode":"JS","netName":"江苏省"},
        {"id":22,"netCode":"JX","netName":"江西省"},
        {"id":23,"netCode":"LN","netName":"辽宁省"},
        {"id":24,"netCode":"NM","netName":"内蒙古"},
        {"id":25,"netCode":"NX","netName":"宁夏回族自治区"},
        {"id":26,"netCode":"QH","netName":"青海省"},
        {"id":27,"netCode":"SC","netName":"四川省"},
        {"id":28,"netCode":"SD","netName":"山东省"},
        {"id":29,"netCode":"SH","netName":"上海市"},
        {"id":1,"netCode":"SN","netName":"陕西省"},
        {"id":31,"netCode":"SX","netName":"山西省"},
        {"id":32,"netCode":"TJ","netName":"天津市"},
        {"id":30,"netCode":"XJ","netName":"新疆维吾尔自治区"},
        {"id":34,"netCode":"XZ","netName":"西藏藏族自治区"},
        {"id":35,"netCode":"YN","netName":"云南省"},
        {"id":36,"netCode":"ZJ","netName":"浙江省"}
      ]
    }
  },
  components: { selsmometryMap, changeMap, TopNav, leftDraw, topSel, mackDrawer, dateDatas, cart }, // selsmometryMap
  created() {
    this.show = false
    this.highspot = null
  },
  mounted() {
    this.getCartList()
    this.getHotList()
  if(sessionStorage.getItem('tips')){
      this.tipText = sessionStorage.getItem('tips')
    }
    //子站过滤省局数据
    if(sessionStorage.getItem('province') == ''|| !sessionStorage.getItem('province')) {
      this.isChildProvince = false
      let par =  {}
      if(this.$route.query.type == 1){
        this.navName = '定点形变'
        par = { item: 221 }
      }else {
        this.navName = '倾斜站网'
        par = { item: 231 }
      }
          //加载页面初始渲染点
      getPrestationList(encode(par)).then(
      (res) => {
        let list = decode(res)
        list.forEach((item) => {
          item.staLat = item.sta_lat
          item.staLon = item.sta_lon
        })
        this.top = 5
        this.station = list
        if (list.length === 0) {
          this.$message.error('台站数为空')
        }
      }
    )
    }else{
      this.isChildProvince = true
      this.provinces.map(item=>{
        if(sessionStorage.getItem('province').indexOf(item.netName) != -1) {
          this.provinces = [item]
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
    // 获取前两层数据
    loadNode(node, resolve) {
      this.markshow = false
      if (node.level === 0) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          if(this.isChildProvince){
          return resolve([
            {
              itemName: '省级站网'
            },
            {
              itemName: '跨断层形变'
            }
          ])
        }else{
          return resolve([
            {
              itemName: '国家站网',
              leaf: true
            },
            //注释是为了屏蔽左侧省级站网等
          /*  {
              itemName: '省级站网'
            },
            {
              itemName: '市县站网'
            },
            {
              itemName: '其他站网'
            },*/
            {
              itemName: '跨断层形变'
            }
          ])
        }
        }, 100);

      } else if (node.level === 1) {
        if(node.data.itemName == '跨断层形变'){
          let list = [
            {
              itemName: '定点水准',
              leaf: true
            },
            {
              itemName: '定点基线',
              leaf: true
            },
            {
              itemName: '场地水准',
              leaf: true
            },
            {
              itemName: '场地基线',
              leaf: true
            },
            {
              itemName: '场地测距',
              leaf: true
            },
            {
              itemName: '蠕变仪观测',
              leaf: true
            }
          ]
          return resolve(list)
        }else {
          this.provinces.forEach((key) => {
            key.itemName = key.netName
          })
          return resolve(this.provinces)
          // let item1 = { item: node.data.item }
          // getPrecursorList(encode(item1)).then((res) => {
          //   let list = decode(res)
          //   console.log(list)
          //   list.forEach((key) => {
          //     key.item = item1.item
          //     key.itemName = key.netName
          //     key.leaf = true
          //   })
          //   return resolve(list)
          // })
        }
      } else if (node.level === 2) {
        let item1 = { item: node.data.item }
        let arr = [
        {
            itemName: '倾斜'
          },
          {
            itemName: '应变'
          }
        ]
        // console.log(node.data)
        return resolve(arr)
        // getPrecursorList(encode(item1)).then((res) => {
        //   let list = decode(res)
        //   console.log(list)
        //   list.forEach((key) => {
        //     key.item = item1.item
        //     key.itemName = key.netName
        //     key.leaf = true
        //   })
        //   return resolve(list)
        // })
      } else if (node.level === 3) {
          let arr = { keyname: node.data.itemName }
          getPreitem(encode(arr)).then((res) => {
            let list = decode(res)
            list.forEach((item) => {
              item.leaf = true
            })
            return resolve(list)
          })
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
      this.markshow = false
      this.highspot = null
      this.station = []
      if(data.netName){
        this.thisProvince = data.id
      }
      if (this.thisProvince != '' && data.keyname) {
        this.stationName = data.netName
        getPrestationList(encode({ item: data.item, netId: this.thisProvince })).then(
          (res) => {
            let list = decode(res)
            list.forEach((item) => {
              item.staLat = item.sta_lat
              item.staLon = item.sta_lon
            })
            this.top = 5
            this.station = list
            if (list.length === 0) {
              this.$message.error('台站数为空')
            }
          }
        )
      } else if (data.itemName === '国家站网') {
        getWordList({}).then((res) => {
          let list = decode(res)
          list.forEach((item) => {
            item.staLat = item.sta_lat
            item.staLon = item.sta_lon
          })
          let a = /^2[2,3][.]*/
          list = list.filter((item) => a.test(item.u_item) === true)
          this.station = list
          if (list.length === 0) {
            this.$message.error('台站数为空')
          }
        })
      }
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
    closeDraw() {
      this.top = -620
    },
    markees(val) {
      this.markshow = false
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
            this.top = 5
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
      let form = {
        keyName: '定点形变-'+data.sta_name+'台站数据集',
        url: '/precursor/crust?type=1',
        linkUnit: this.tipText,
        postUrl: this.marke.sta_code
      }

      hotDataAdd(encode(form)).then()
    },
    //加载热点信息
    getHotList() {
      if(!sessionStorage.getItem('hotInfo')){
        return
      }
      const self = this
      let name = JSON.parse(sessionStorage.getItem('hotInfo')).keyName
      if(name.split('-')[0] == '定点形变'){
        let id = JSON.parse(sessionStorage.getItem('hotInfo')).postUrl
        setTimeout(() => {
          self.filterVal(id)
        }, 1200);
      }
    },
    // 地图标记点点击
    maplist(val) {
      // console.log(val)
      this.highspot = val
      this.marke = val
      this.markshow = true
      this.getCataList(val)
    },
    filterPlatList(val) {
      this.station = this.station.slice(0,15)
      setTimeout(() => {
        this.station = val
      }, 30);
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
            item.orderClasses = '定点形变数据'+'_'+this.drawerTitle
            item.classesStandby = item.dataDate ? item.dataDate : item.year ? item.year : item.month
            dataObj = {
              orderClasses:item.orderClasses,
              classesStandby:item.classesStandby,
              userName:Cookies.get('username'),
              sentDept: '',
              subjectId: 8
            }
            list3.records.datas.push({...dataObj})
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
    // 把没有数据的栏目禁选
    selected(row, index) {
      if (row.latAndLon.length < 2) {
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
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
    z-index: 1950;
    position: absolute;
    bottom: 20px;
    right: 20px;
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
  .stationlist,
  .dataList2 {
    position: absolute;
    top: 130px;
    right: 353px;
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
    .cart {
      font-size: 10px;
      text-align: center;
      margin-bottom: 5px;
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
      // border-radius: 6px;
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
