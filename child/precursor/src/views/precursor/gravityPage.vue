<template>
  <!-- 重力 -->
  <div class="refuge">
    <div>
      <cart :drawerTitle="drawerTitle" :drawer="drawer" :addCartList="addCartList" @showDraw="changeShow" @cartList="changeCartList"></cart>
    </div>
    <el-container>
      <el-main style="position: relative; height: 100%;">
        <div class="head">
          <div class="topNav">
            <top-nav :pageName="'重力'"></top-nav>
          </div>
          <!-- <top-sel class="topSel" :stationList="station" type="重力" @filter="filterVal"></top-sel> -->
        </div>
        <div
          class="tiggle"
          @click="tiggle"
          :style="{ 'margin-left': left + 'px' }"
        >
          <i :class="icon"></i>
        </div>
        <el-dialog title="关于重力数据的提示"  style="margin-top:50px" :visible.sync="TipDialog" width="56%">
          <div v-html="tipText">
          </div>
          <!-- <h2>全国地震重力台网情况介绍</h2>
          <p style="text-indent: 2em">
          地球重力场是地球最为基本的物理场之一，是地球内部、地表及外部空间物质分布与地球本身旋转运动信息的综合反应。由于地球内部质量分布不均匀、不恒定，加上地球在天体之间的运动和自身变形等因素，重力场将随着空间、时间发生变化。因此，重力场包含着测量位置、地球内部物质分布以及固体地球随时间变化（重复或连续测定）等信息。
          </p>
          <p style="text-indent: 2em">地震是地球内部物质运动的反映，而地球时变重力场包含丰富的地球系统物质分布与运移信息，两者之间存在一定的相关性。时变重力资料可用来精确描述活动地块及其边界带的运动与变形特征，为地震预报和地震科学研究提供有效的数据资料。
          </p>
          <p style="text-indent: 2em">地面重力观测主要分为流动重力观测（相对联测与绝对测量）和连续重力观测（相对测量）两类，流动重力观测精度可达微伽级或10微伽级（优于30微伽，1微伽＝10-8ms-2），连续重力观测精度可达 0.1~1微伽级。经过数十年的建设与完善，我国逐步形成由86个连续重力台（秒或分钟采样）、100个绝对重力点、约4100个相对重力点组成的中国地震重力监测网。该网能有效获取我国大陆重力场变化动态信息，满足我国地震短、中、长期预测需求，为地震科研提供基础观测数据，并可用于我国重力基准维持。
          </p>
          <p style="text-indent: 2em">重力数据是敏感数据，请与相关机构直接取得联系。
          </p>
          <p style="text-indent: 2em">联系人：XXXXX</p>
          <p style="text-indent: 2em">联系方式：XXXXXX</p> -->
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
            <el-button v-if="showCartBtn && !show" class="cart" type="danger" size="mini"
            >加入收藏车</el-button
          >
            <!-- 占位 -->
            <div v-else></div>
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
              :data="station.filter(
                (data) =>
                  !search ||
                  data.sta_name.toLowerCase().includes(search.toLowerCase()) ||
                  data.sta_name.replaceAll(' ', '').includes(search.trim())
              )
            "
              style="width: 100%; font-size: 8px"
              size="mini"
              height="390"
              border
              ref="multipleTable"
              v-if="!show"
              @selection-change="handleSelectionChange"
              stripe
            >
             <!-- <el-table-column type="selection" width="40" /> -->
              <el-table-column
              prop="sta_name"
              label="台站名称"
              align="center"
              sortable
              width="130"
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
            :title="'重力'"
            @markees="markees"
            :dataLength="deformation.length"
          ></mack-drawer>

          <!-- <el-button type="primary" size="mini" @click="getCataList(marke)"
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
  getpredataList
} from '@/api/precursor'
import {
  getList,
  addCartApi
} from '@/api/cartList'
import {
  hotDataAdd
} from '@/api/hots'
import { Loading } from 'element-ui';
import Cookies from 'js-cookie'
import cart from '@/components/cart.vue'
import changeMap from '@/components/changeMap.vue'
import { provinceAndCityData } from 'element-china-area-data'
import selsmometryMap from '@/components/map/index.vue'
import TopNav from '@/components/topNav.vue'
import leftDraw from '@/components/mapFilter/leftDraw.vue'
import mackDrawer from '@/components/mackDrawer.vue'
import { getToken } from '@/utils/auth'
import dateDatas from '@/components/date/dateDatas.vue'
export default {
  name: 'InterfacePage',
  data() {
    return {
      // Tips窗口 显示提示信息
      TipDialog: false,
      //提示信息
      tipText: '',
      loading: false,
      loading1: false,
      search: '',
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
      // 选择右侧选项卡样式
      isActive: false,
      show: false,
      highspot: null,
      markshow: false,
      // 抽屉的打开
      drawer: false,
      drawer1: false,
      // 水准点数据
      bench: [],
      // 树结构的属性
      treeshow: true,
      left: 0,
      top: -600,
      icon: 'el-icon-caret-left',
      filterText: '',
      // 按城市查询的数据
      options: provinceAndCityData,
      selectedOptions: [],
      map: null,
      circle_group: null,
      input: '',
      title: '测震数据',
      title1: '',
      showCartBtn: false,
      company: [],
      station: [],
      // 查询参数
      networkOption: {
        netId: 1
      },
      total: 0,
      marke: null,
      comTreeList: [],
      addCartList: [],
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
      }
    }
  },
  components: {
    selsmometryMap,
    changeMap,
    TopNav,
    leftDraw,
    mackDrawer,
    dateDatas,
    cart
  }, // selsmometryMap
  created() {
    this.highspot = null
    this.show = false
  },
  mounted() {
    this.getCartList()
    // this.handleNodeClick({itemName:'全国重力台站'})
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
      return resolve([])
      // if (node.level === 0) {
      //   this.loading = false
      //   let arr = { keyname: '重力' }
      //   getPreitem(encode(arr)).then((res) => {
      //     let list = decode(res)

      //     list.unshift({
      //       itemName: '全国重力台站',
      //       leaf: true
      //     })
      //     this.loading1 = false
      //     return resolve(list)
      //   })
      // } else if (node.level === 1) {
      //   let item1 = { item: node.data.item }
      //   getPrecursorList(encode(item1)).then((res) => {
      //     let list = decode(res)
      //     list.forEach((key) => {
      //       key.item = item1.item
      //       key.itemName = key.netName
      //       key.leaf = true
      //     })
      //     return resolve(list)
      //   })
      // }
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
    showDialog() {
      this.TipDialog = !this.TipDialog
    },
    // 获取地图数据
    handleNodeClick(data) {
      // this.highspot = null
      // this.markshow = false
      // this.station = []
      // if (data.netName) {
      //   getPrestationList(encode({ item: data.item, netId: data.id })).then(
      //     (res) => {
      //       let list = decode(res)
      //       list.forEach((item) => {
      //         item.staLat = item.sta_lat
      //         item.staLon = item.sta_lon
      //       })
      //       this.top = 20
      //       this.station = list
      //       if (list.length === 0) {
      //         this.$message.error('台站数为空')
      //       }
      //     }
      //   )
      // } else if (data.itemName === '全国重力台站') {
      //   getWordList({}).then((res) => {
      //     let list = decode(res)
      //     list.forEach((item) => {
      //       item.staLat = item.sta_lat
      //       item.staLon = item.sta_lon
      //     })
      //     let a = /^212[.]*/
      //     list = list.filter((item) => a.test(item.u_item) === true)
      //     this.station = list
      //     if (list.length === 0) {
      //       this.$message.error('台站数为空')
      //     }
      //   })
      // }
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
    changeShow(state) {  //购物车显示与关闭
      this.drawer = state
    },
    getCartList() {
      getList({
        userName: Cookies.get('username')
      }).then(res=>{
        this.addCartList = res
      })
    },
    handleSelectionChange(val) {
      // if (val.length === 0) {
      //   this.showCartBtn = false
      // } else {
        this.showCartBtn = true
      // }
    },
    filterPlatList(val) {
      this.station = val
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
    markees(val) {
      this.markshow = false
    },
    closeDraw() {
      this.top = -580
    },
    // 获取数据详情
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
            this.top = 20
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
        keyName: '重力-'+data.sta_name+'台站数据集',
        url: '/precursor/gravity',
        linkUnit: this.tipText
      }
      hotDataAdd(encode(form)).then()
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
            item.orderClasses = '重力数据'+'_'+this.drawerTitle
            if(item.year){
              item.classesStandby = item.year+'；分发单位：中国地震局物理研究所'
            }else{
              item.classesStandby = item.dataDate+'；分发单位：中国地震局物理研究所'
            }
            dataObj = {
              orderClasses:item.orderClasses,
              classesStandby:item.classesStandby,
              userName:Cookies.get('username'),
              sentDept: '中国地震局物理研究所',
              subjectId: 1
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
    //日期数据子组件勾选后传值
    addCartItem(list){
      this.comTreeList = list
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
    //监听子组件移除购物车内容
    changeCartList(list) {
      this.addCartList = list
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
  .addcart {
    position: absolute;
    top: 0px;
    right: 200px;
    z-index: 1000;
  }
  .selected {
    background-color: #409eff;
    color: #fff;
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
    .tips-button {
      width: 15%;
      height: 20px;
      padding-left: 9px;
      padding-top: 3px;
      margin: 4px 4px;
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
      margin-bottom: 6px;
    }
    .close {
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      cursor: pointer;
      position: relative;
      top: 5px;
      right: 3px;
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
