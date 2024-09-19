<template>
  <!-- GNSS -->
  <div class="refuge">
    <div>
      <cart :drawerTitle="drawerTitle" :drawer="drawer" :addCartList="addCartList" @showDraw="changeShow" @cartList="changeCartList"></cart>
    </div>
    <el-container>
      <el-main style="position: relative; height: 100%;">
        <div class="head">
          <div class="topNav">
            <top-nav :pageName="'GNSS'"></top-nav>
          </div>
          <top-sel class="topSel" @search="searchVal" :netList="netList" :stationList="station" type="GNSS" @filter="filterVal"></top-sel>
        </div>
        <!-- 左侧边栏隐藏显示按钮 -->
        <div
          class="tiggle"
          @click="tiggle"
          :style="{ 'margin-left': left + 'px' }"
        >
          <i :class="icon"></i>
        </div>
        <el-dialog style="margin-top:50px" title="关于GNSS数据的提示" :visible.sync="TipDialog" width="56%">
          <div v-html="tipText">
          </div>
        </el-dialog>
        <!-- 左侧边栏 -->
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
        <!-- 台站详细数据弹框 -->
        <div class="drawerlist" :style="{ 'margin-top': top + 'px' }">
          <div class="close" @click="closeDraw">
          <!-- 占位 -->
            <el-tooltip content="隐藏" placement="top" effect="light">
              <i class="el-icon-caret-top"></i>
            </el-tooltip>
          </div>
<!--          <el-button class="addcart" :style="{ 'margin-top': (top - 28) + 'px' }"
          type="danger" size="mini" @click="addCart(comTreeList)">加入成果车</el-button>-->
          <div class="main">
            <div class="top" v-if="show">
              <p>
                <span
                  ><strong> 台站名称：</strong
                  >{{ this.drawertitle.title }}</span
                >
              </p>
              <!-- <p>
                <span
                  ><strong>起始观测时间：</strong>
                  {{ this.drawertitle.time }}</span
                >
                <span
                  ><strong>累计观测时长：</strong
                  >{{ this.drawertitle.num }}天</span
                >
              </p> -->
            </div>
            <div class="content">
              <el-table
                class="dataListTable"
                id="tableShow"
                :data="station"
                row-key="id"
                border
                style="width: 100%"
                size="mini"
                height="400"
                v-if="!show"
                stripe
                accordion
                @selection-change="handleSelectionChange"
                :tree-props="{ children: 'children' }"
              >
<!--                <el-table-column type="selection" width="40" />-->
                <el-table-column
                  prop="pointName"
                  label="台站名称"
                  align="center"
                  sortable
                >
                <template slot-scope="scope">
                  <div @click="maplist(scope.row)" style="cursor:pointer;font-size: 16px;">
                    {{ scope.row.pointName }}
                  </div>
                </template>
              </el-table-column>

                  <el-table-column
                    prop="cTime"
                    label="建站日期"
                    align="center"
                  >
                  <template slot-scope="scope">
                    <div style="cursor:pointer;font-size: 16px;">
                      {{ new Date(scope.row.cTime).toLocaleDateString() }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-table
                class="dataListTable"
                id="tableShow"
                :data="unitList"
                row-key="id"
                border
                style="width: 100%"
                size="mini"
                height="400"
                v-else-if="!showDatas"
                stripe
                accordion
                @selection-change="handleSelectionChange"
                :tree-props="{ children: 'children' }"
              >
<!--                <el-table-column type="selection" width="40" />-->
                <el-table-column
                  prop="oDate"
                  label="观测日期"
                  sortable
                >
                <!-- <template slot-scope="scope">
                    <div>
                      {{ scope.row.oDate }}
                    </div>
                  </template> -->
                </el-table-column>

                <el-table-column
                  prop="project"
                  label="项目"
                  align="center"
                />
                <el-table-column
                  prop="instrInfor"
                  label="仪器信息"
                  align="center"
                  width="55"
                />
              </el-table>
              <div>
                <div v-if="showDatas" style="width: 280px;background-color:#fff;padding: 5px 0px;text-align: center;">{{ drawerTitle }}</div>
                <dateTree v-if="showDatas" style="width: 280px;height: 370px;" :days="staId" :staName="drawerTitle" :typeName="'GNSS'" @addCartItem="addCartItem" @getInfo="getMarkeInfo"></dateTree>
              </div>
            </div>
          </div>
        </div>

        <!-- 点击地图标记点弹窗 -->
        <div
          v-if="markshow"
          class="markee"
          ref="markee"
          :style="{ 'margin-left': left + 'px' }"
        >
          <mack-drawer
            :markeArr="marke"
            :title="dratitle"
            @markees="markees"
            :dataLength="unitList.length"
            :beginTime="this.drawertitle.time"
            :days="this.drawertitle.num"
          ></mack-drawer>

          <!-- <el-button
            type="primary"
            size="mini"
            :disabled="disabled"
            @click.stop="getCataList(marke)"
            >数据目录详情</el-button
          > -->
        </div>
        <!-- 地图 -->
        <div class="box" ref="mapBox">
          <selsmometry-map
            v-loading="loading"
            :list="station"
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
import {
  getFlowNet,
  getFlowGnss,
  getFlowGnssList,
  getContinuousList,
  getContinuousNet,
  getContinuousDataList,
  getGnssList,
  gnssHeadSearch
} from '@/api/gnss'
import {
  getCompanyList
} from '@/api/deformation'
import {
  hotDataAdd
} from '@/api/hots'
import {
  getList,
  addCartApi
} from '@/api/cartList'
import { Loading } from 'element-ui';
import Cookies from 'js-cookie'
import { provinceAndCityData } from 'element-china-area-data'
import selsmometryMap from '@/components/map/index.vue'
import changeMap from '@/components/changeMap.vue'
import leftDraw from '@/components/mapFilter/leftDraw.vue'
import TopNav from '@/components/topNav.vue'
import topSel from '@/components/mapFilter/topSel.vue'
import mackDrawer from '@/components/mackDrawer.vue'
import cart from '@/components/cart.vue'
import { getToken } from '@/utils/auth'
import dateTree from '@/components/date/dateTree.vue'
import { Notification } from 'element-ui'
export default {
  name: 'InterfacePage',
  data() {
    return {
      // 鼠标移动开关
      flag: false,
      // 水准戴安的线
      LineHeig: null,
      // Tips窗口 显示提示信息
      TipDialog: false,
      //提示信息
      tipText: '',
      dratitle: '',
      loading: true,
      disabled: false,
      netId: null,
      top: -580,
      // 地图资源
      restmap: {
        url: '/map-tianditu/rest/maps/地形底图_经纬度',
        urlLon: '/map-tianditu/rest/maps/地形中文注记_经纬度'
      },
      // 大地形变线
      deformation: [],
      deformation1: [],
      addCartList: [],  //添加购物车列表
      comTreeList: [],
      drawer: false,
      tempCartList: [], //勾选的日期数据
      isAll: false, //是否全选
      staId: null, //当前台站的id
      props: {
        label: 'netName',
        children: 'zones',
        isLeaf: 'leaf'
      },
      // 选择右侧选项卡样式
      isActive: false,
      markshow: false,
      show: false,
      // 抽屉的打开

      // 水准点数据
      bench: [],
      //台网列表
      netList: [{"id":2,"netCode":"BJ","netName":"北京","sortNum":1},{"id":29,"netCode":"TJ","netName":"天津","sortNum":2},{"id":12,"netCode":"HE","netName":"河北","sortNum":3},{"id":28,"netCode":"SX","netName":"山西","sortNum":4},{"id":20,"netCode":"NM","netName":"内蒙","sortNum":5},{"id":19,"netCode":"LN","netName":"辽宁","sortNum":6},{"id":16,"netCode":"JL","netName":"吉林","sortNum":7},{"id":14,"netCode":"HL","netName":"黑龙江","sortNum":8},{"id":26,"netCode":"SH","netName":"上海","sortNum":9},{"id":17,"netCode":"JS","netName":"江苏","sortNum":10},{"id":33,"netCode":"ZJ","netName":"浙江","sortNum":11},{"id":27,"netCode":"AH","netName":"安徽","sortNum":12},{"id":5,"netCode":"FJ","netName":"福建","sortNum":13},{"id":18,"netCode":"JX","netName":"江西","sortNum":14},{"id":25,"netCode":"SD","netName":"山东","sortNum":15},{"id":10,"netCode":"HA","netName":"河南","sortNum":16},{"id":11,"netCode":"HB","netName":"湖北","sortNum":17},{"id":15,"netCode":"HN","netName":"湖南","sortNum":18},{"id":6,"netCode":"GD","netName":"广东","sortNum":19},{"id":8,"netCode":"GX","netName":"广西","sortNum":20},{"id":13,"netCode":"HI","netName":"海南","sortNum":21},{"id":4,"netCode":"CQ","netName":"重庆","sortNum":22},{"id":3,"netCode":"SC","netName":"四川","sortNum":23},{"id":9,"netCode":"GZ","netName":"贵州","sortNum":24},{"id":32,"netCode":"YN","netName":"云南","sortNum":25},{"id":31,"netCode":"XZ","netName":"西藏","sortNum":26},{"id":1,"netCode":"SN","netName":"陕西","sortNum":27},{"id":7,"netCode":"GS","netName":"甘肃","sortNum":28},{"id":22,"netCode":"QH","netName":"青海","sortNum":29},{"id":21,"netCode":"NX","netName":"宁夏","sortNum":30},{"id":30,"netCode":"XJ","netName":"新疆","sortNum":31},{"id":1086455809,"netCode":"GB","netName":"北京","sortNum":99}],
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
      icon: 'el-icon-caret-left',
      map: null,
      circle_group: null,
      input: '',
      title: '测震数据',
      title1: '',
      company: [],
      station: [],
      //子站
      isChildProvince: false,
      //联系方式信息
      linkInfo: {},
      showDatas: false,
      // 查询参数
      networkOption: {
        netId: 1
      },
      total: 0,
      marke: null,
      showCartBtn: false,
      // 查询台站详细数据的参数
      id: {
        unit_id: '',
        fp_id: ''
      },
      num: 0,
      drawerTitle: '',
      // 台站详细数据
      unitList: [],
      //当前选择的省份
      nowProvince:'',
      drawertitle: {
        title: '',
        time: '',
        num: '',
        nuit: ''
      },
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
    dateTree
  }, // selsmometryMap
  created() {
    this.show = false
    this.station = []
    this.highspot = null
    this.markshow = false
    // this.drawer = false
    // this.drawer1 = false
    this.top = -580
    // this.getDeformation()
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
      this.getNetList()
      this.handleNodeClick({netCode: "DZKXSYC",netName: "中国地震科学实验场",type: "continue",unit_id: 3})

    }else{
      this.isChildProvince = true
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
        this.loading = true
        setTimeout(() => {
            this.loading = false
            if(this.isChildProvince){
            return resolve([
              {
                netName: '省级站网'
              }
            ])
          }else{
            return resolve([
              {
                netName: '国家站网'
              },
              //注释是为了屏蔽左侧省级站网等
            /*  {
                netName: '省级站网'
              },
              {
                netName: '其他站网'
              }*/
            ])
          }
        },100)
      } else if(node.level === 1){
        let arr = []
        if(node.data.netName == '省级站网'){
          let list = []
          let datas = encode({ unitId: 1 })
          getCompanyList(datas)
            .then((res) => {
              list = decode(res)
              list.forEach((item) => {
                item.unitName = item.netName
              })
              this.netList = [...list]
              //省级子站
              if(this.isChildProvince){
                list.map(i=>{
                  if(sessionStorage.getItem('province').indexOf(i.unitName) != -1) {
                    i.unitName = i.netName
                    list = [i]
                  }
                })
              }
              return resolve(list)
            })
            .catch(() => {
              resolve({})
            })
        }else{
          return resolve([
            {
              netName: '连续观测'
            },
            {
              netName: '流动观测'
            }
          ])
        }
      } else if (node.level === 2) {
        if(node.data.netCode){
          this.netId = node.data.id
          return resolve([
            {
              netName: '连续观测',
            },
            {
              netName: '流动观测',
            }
          ])
        }
        if (node.label === '连续观测') {
          let data = encode({})
          this.netId = null
          getContinuousNet(data).then((res) => {
            let list = decode(res)
            this.bench = list
            let data = []

            for (let i = 0; i < this.bench.length; i++) {
              let arr = {
                netName: this.bench[i].netName,
                unit_id: this.bench[i].id,
                // c_unit_id: node.data.unit_id,
                netCode: this.bench[i].netCode,
                type: 'continue',
                leaf: true
              }
              data.push(arr)
            }
            let arr2 = {
                netName: '连续观测目录',
                // unit_id: this.bench[i].id,
                // c_unit_id: node.data.unit_id,
                // netCode: this.bench[i].netCode,
                type: 'continue',
                leaf: true
              }
            data.push(arr2)
            resolve(data)
          })
        } else if (node.label === '流动观测') {
          let data = encode({})
          this.netId = null
          getFlowNet(data).then((res) => {
            this.bench = decode(res)

            let data = []
            for (let i = 0; i < this.bench.length; i++) {
              let arr = {
                netName: this.bench[i].netName,
                unit_id: this.bench[i].id,
                // f_unit_id: node.data.unit_id,
                netCode: this.bench[i].netCode,
                type: 'flow',
                leaf: true
              }
              if (arr.netName !== 'XXX台网') {
                data.push(arr)
              }
            }
            resolve(data)
          })
        }
      } else if (node.level > 2) {
        if (node.label === '连续观测') {
          let data = encode({})
          getContinuousNet(data).then((res) => {
            let list = decode(res)
            this.bench = list
            let data = []

            for (let i = 0; i < this.bench.length; i++) {
              let arr = {
                netName: this.bench[i].netName,
                unit_id: this.bench[i].id,
                // c_unit_id: node.data.unit_id,
                netCode: this.bench[i].netCode,
                type: 'continue',
                leaf: true
              }
              data.push(arr)
            }
            let arr2 = {
                netName: '连续观测目录',
                // unit_id: this.bench[i].id,
                // c_unit_id: node.data.unit_id,
                // netCode: this.bench[i].netCode,
                type: 'continue',
                leaf: true
              }
            data.push(arr2)
            resolve(data)
          })
        } else if (node.label === '流动观测') {
          let data = encode({})
          getFlowNet(data).then((res) => {
            this.bench = decode(res)

            let data = []
            for (let i = 0; i < this.bench.length; i++) {
              let arr = {
                netName: this.bench[i].netName,
                unit_id: this.bench[i].id,
                // f_unit_id: node.data.unit_id,
                netCode: this.bench[i].netCode,
                type: 'flow',
                leaf: true
              }
              if (arr.netName !== 'XXX台网') {
                data.push(arr)
              }
            }
            resolve(data)
          })
        }
      }
    },
    getCartList() {
      getList({
        userName: Cookies.get('username')
      }).then(res=>{
        debugger;
        this.addCartList = res
      })
    },
    getMarkeInfo(val) {
      this.dratitle = 'GNSS台站数据信息'
      this.marke = Object.assign({},this.marke,val)
      this.linkInfo = val
      this.markshow = true
    },
    // 获取地图数据
    handleNodeClick(data) {
      console.log(data)
      console.log(this.nowProvince)
      if(data.netName && data.netCode && data.netName.length<4){
        this.nowProvince = data.netName
      }
      this.station = []
      this.highspot = null
      this.markshow = false
      this.deformation = []
      this.station = []
      this.show = false
      if (data.unit_id && data.type === 'flow') {
        let id = data.unit_id
        if(this.netId){
          id = this.netId
        }
        getFlowGnss(
          encode({ net_id: id}) //  f_unit_id: data.f_unit_id,
        ).then((res) => {
          let list = decode(res)
          list.forEach((item) => {
            item.type = data.type
            item.staLat = item.lat
            item.staLon = item.lon
          })
          if(list.length == 0){
              this.$message.error('数据为空')
              return
            }
          this.top = 0
          this.station = list
        })
      } else if (data.unit_id && data.type === 'continue') {
        this.id.unit_id = data.c_unit_id
        let id = data.unit_id
        if(this.netId){
          id = this.netId
        }
        getContinuousList(
          encode({ net_id: id }) //  c_unit_id: data.c_unit_id,
        ).then((res) => {
          let list = decode(res)
          list.forEach((item) => {
            item.type = data.type
            item.staLat = item.lat
            item.staLon = item.lon
          })
          if(list.length == 0){
              this.$message.error('数据为空')
              return
            }
          this.top = 0
          this.station = list
        })
        // }
      }else if(data.netName && data.type === 'continue'){
        let par = {
          roll: this.nowProvince
        }
        getGnssList(encode(par)).then(res=>{
          let list = decode(res)
          if(list.length == 0){
            this.$message.error('数据为空')
            return
          }
          list.forEach((item) => {
            item.staLat = item.latitude
            item.staLon = item.longitude
            item.pointName = item.roll
            item.cTime = item.buildTime
            item.type = 'new'
          })
          this.station = list
        })
      }
    },
    closeDraw() {
      this.top = -580
    },
    filterVal(name) {
      let info = {}
      this.station.map(item => {
        if(item.pointName.indexOf(name) != -1){
          info = item
        }
      })
      if(JSON.stringify(info) == '{}'){
        this.$message.error('暂无此台站数据')
      }else{
        this.maplist(info)
      }
    },
    // 地图标记点点击
    maplist(val) {
      this.highspot = val
      let form = {
        keyName: 'GNSS-'+val.roll?val.roll:val.pointName+'台站数据集',
        url: '/precursor/gnss',
        linkUnit: this.tipText,
        postUrl: JSON.stringify({roll:val.roll})
      }
      if(val.roll){
        form.postUrl = JSON.stringify({roll:val.roll})
      }else{
        form.postUrl = val.pointName
      }
      if(this.top <= 0){
        this.top = 20
      }
      hotDataAdd(encode(form)).then()
      if(val.type != 'new'){
        if (this.deformation.length === 0) {
          this.disabled = false
        }
        this.dratitle = 'GNSS连续观测站点信息'
        val.cTime = this.setTime(val.cTime).slice(0, 4)
        this.marke = val
        this.markshow = true
        this.getCataList(val)
      }else{
        this.showDatas = true
        this.staId = val.id
        this.marke = val
        this.show = true
        this.markshow = true
        this.dratitle = 'GNSS台站信息'
        this.drawerTitle = val.roll + '台站'
      }
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
    //加载热点信息
    getHotList() {
      if(!sessionStorage.getItem('hotInfo')){
        return
      }
      const self = this
      let name = JSON.parse(sessionStorage.getItem('hotInfo')).keyName
      if(name.split('-')[0] == 'GNSS'){
        let par = JSON.parse(sessionStorage.getItem('hotInfo')).postUrl
        setTimeout(() => {
          if(par.indexOf('roll') != -1){
            this.searchVal(JSON.parse(par))
          }else{
            self.filterVal(par)
          }
        }, 1200);
      }
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
      let list3 = {
          records: {
            datas: []
          }
        }
        let list2 = [...list]
        list2.map((item,index)=>{
          let dataObj = {}
            item.orderClasses = 'GNSS数据'+'_'+this.drawerTitle+'台站'
            item.classesStandby = '年份：'+item.classesStandby+'；分发单位：'+this.linkInfo.sendUnit + '；联系人：'+this.linkInfo.linkMan+ '；联系方式：'+this.linkInfo.tel
                       debugger;
            dataObj = {
              orderClasses:item.orderClasses,
              classesStandby:item.classesStandby,
              userName:Cookies.get('username'),
              sentDept: this.linkInfo.sendUnit,
              subjectId: 6
            }
            list3.records.datas.push({...dataObj})

        })
        // if(!this.includes(this.addCartList,list2)){
        //   this.addCartList = this.addCartList.concat(list2)
        // }
        this.comTreeList = []
        const loading = Loading.service({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
        });
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
    // 获取数据详情
    getCataList(data) {
      this.disabled = true
      // 流动站
      this.isActive = true
        this.show = true
      if (this.marke.type === 'flow') {
        getFlowGnssList(encode({ fp_id: this.marke.id })).then((res) => {
          let list = decode(res)
          this.drawertitle = {
            title: `${this.marke.pointName} ${this.marke.pointCode}`,
            num: list.length,
            // nuit: this.marke.pointName,
            nuit: list[0].project,
            time: this.marke.cTime
          }
          list.forEach(
            (item) => (item.oDate = this.setTime(item.oDate).slice(0, 4))
          )
          list = this.dateType(list)
          this.unitList = list
          this.top = 0
          this.disabled = false
        })
      } else {
        // 连续站
        getContinuousDataList(encode({ fp_id: this.marke.id })).then((res) => {
          let list = decode(res)
          this.drawertitle = {
            title: `${this.marke.pointName} ${this.marke.pointCode}`,
            num: list.length,
            // nuit: this.marke.pointName,
            nuit: list[0].project,
            time: this.marke.cTime
          }

          list.forEach((item) => (item.oDate = this.setTime(item.oDate)))
          list = this.setList(list)
          this.unitList = list
          this.top = 0
        })
      }
    },
    stationTap() {
      this.isActive = false
      this.show = false
      this.showDatas = false
    },
    dataListTap() {
      if (this.drawerTitle === '') {
        this.$message.error('请选择一个台站')
      } else {
        this.isActive = true
        this.show = true
      }
    },
    getNetList() {
      let list = []
      let datas = encode({ unitId: 1 })
      getCompanyList(datas)
        .then((res) => {
          list = decode(res)
          list.forEach((item) => {
            item.unitName = item.netName
          })
          this.netList = [...list]
        })
        .catch(() => {
        })
    },
    searchVal(val) {
      let datas = null
      if(val instanceof Object){
        datas = {...val}
      }else{
        datas = {
          siteName: val
        }
      }
      const self = this
      gnssHeadSearch(encode(datas)).then(res=>{
        let list = decode(res)
        list.forEach((item) => {
          item.staLat = item.latitude
          item.staLon = item.longitude
          item.pointName = item.roll
          item.cTime = item.buildTime
          item.type = 'new'
        })
        self.station = list
      }).catch(e=>{
        self.station = []
      })
    },
    // 把数据分类
    setList(arr) {
      let array = []
      let data = []
      let num = arr.length
      for (let i = 0; i < num; i++) {
        let name = arr[i].oDate.slice(0, 4)
        if (array.indexOf(name) === -1) {
          data.push({
            oDate: name,
            id: i + 1,
            children: [arr[i]]
          })
          array.push(name)
        } else {
          for (let j = 0; j < data.length; j++) {
            if (data[j].oDate === name) {
              data[j].children.push(arr[i])
              break
            }
          }
        }
      }
      // // 把通道数据按月份进行处理
      // for (let k = 0; k < data.length; k++) {
      //   let list = data[k].children
      //   let array1 = []
      //   let data1 = []
      //   let num1 = list.length
      //   for (let i = 0; i < num1; i++) {
      //     let mon = list[i].dataDate.slice(0, 7)
      //     list[i].id = 10 + i
      //     if (array1.indexOf(mon) === -1) {
      //       let year = mon.slice(0, 4)
      //       let m = mon.slice(5, 7)
      //       let day = this.getDaysInMonth(year, m)
      //       data1.push({
      //         dataDate: mon,
      //         day: day,
      //         dataStat: 0,
      //         id: i + 1,
      //         children: [list[i]]
      //       })
      //       array1.push(mon)
      //     } else {
      //       for (let j = 0; j < data1.length; j++) {
      //         if (data1[j].dataDate === list[i].dataDate.slice(0, 7)) {
      //           data1[j].children.push(list[i])
      //           break
      //         }
      //       }
      //     }
      //   }
      //   data[k].children = data1
      // }
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
    },
    // 鼠标按下弹框
    moveBox(e) {
      let markee = this.$refs.markee
      // let map = this.$refs.mapBox
      let x, y
      // let parTop, parLeft
      markee.onmousedown = (e) => {
        this.flag = true
        x = e.offsetX
        y = e.offsetY
      }
      markee.onmousemove = (e) => {
        let top = e.clientY - y
        let left = e.clientX - x
        if (this.flag) {
          markee.style.top = +top + 'px'
          markee.style.left = left + 'px'
        }
      }
      markee.onmouseup = (e) => {
        this.flag = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table__placeholder {
  width: auto !important;
}
::v-deep .el-table__indent {
  display: none;
}
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
    top: 145px;
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
  .dataList2 {
    top: 198px;
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
  .dataList {
    position: absolute;
    z-index: 1000;
    right: 10px;
    top: 100px;
    background-color: #fff;
    width: 300px;
    max-height: 560px;
    overflow: auto;
    // padding: 5px;
    border-radius: 10px;
    box-shadow: 0 0 4px 0 rgba($color: #000000, $alpha: 0.7);
    .list {
      width: 100%;
      height: 100%;
      padding: 5px;
    }
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
    right: 55px;
    top: 60px;
    width: 300px;
    padding: 5px;

    transition: margin-top 0.4s ease-out;
    -webkit-transition: margin-top 0.4s ease-out;
    -moz-transition: margin-top 0.4s ease-out;
    -o-transition: margin-top 0.4s ease-out;
    -ms-transition: margin-top 0.4s ease-out;
    .cart {
      font-size: 10px;
      text-align: center;
      margin-bottom: 6px;
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
      top: 25px;
      right: 200px;
      z-index: 1000;
    }
    .main {
      border-radius: 5px;
      padding: 5px;
      height: 450px;
      overflow: auto;
      background-color: #fff;
      box-shadow: 2px 2px 10px 0px rgba(86, 86, 86, 0.5);
      .top {
        font-size: 10px;

        p {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3px;
        }
      }
    }
  }
  .change2D {
    z-index: 1960;
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
  height: 250px;
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
