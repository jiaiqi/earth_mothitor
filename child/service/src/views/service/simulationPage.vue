<template>
  <div class="simulation">
    <el-container>
      <el-main>
        <div
          class="tiggle"
          @click="tiggle"
          :style="{ 'margin-left': left + 'px' }"
        >
          <i :class="icon"></i>
        </div>
        <el-dialog
          title="提示"
          :visible.sync="TipDialog"
          width="50%"
          :modal-append-to-body="false"
          append-to-body
        >
          <h2>历史模拟测震图纸 <small>(SEISMAGRAMS Analog Records)</small></h2>
          <h3 style="margin: 20px 0">资源介绍 <small>(Overview)</small></h3>
          <p style="text-indent: 2em">
            模拟地震观测资料对地震科学研究和防震减灾具有重要的意义，是地震科技发展的重要组成部分，
            是非常宝贵的精神财富和历史遗产，由中国地震局第二监测中心牵头实施的地震系统模拟地震资料抢救项目，
            按照中国地震局的统一部署，计划利用4年左右时间，建立健全地震监测历史资料抢救标准，规范资料抢救技术流程；
            对全国地震台站模拟地震观测资料进行整理、数字化扫描入库；对国内外重要地震事件模拟波形进行数字化并入库；妥善保护珍贵历史地震资料。
          </p>
          <br />
          <p>联系人：</p>
          <br />
          <p>联系方式：</p>
          <br />
          <a
            href=" http://10.7.207.86:8078/#/analogRecords "
            style="color: black"
            target="_blank"
          >
            点击跳转官网
          </a>
        </el-dialog>
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
                    data.staName.toLowerCase().includes(search.toLowerCase()) ||
                    data.staName.replaceAll(' ', '').includes(search.trim())
                )
              "
              style="width: 280px; margin-top: 5px"
              size="mini"
              height="420"
            >
              <el-table-column prop="staName">
                <template slot-scope="scope">
                  <div @click="getStantion(scope.row)" style="cursor:pointer">
                    {{ scope.row.staName }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-else
              id="tableShow"
              :data="yearlist"
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
                prop="year"
                label="年份"
                align="center"
                sortable
              >
                <template slot-scope="scope">
                  <div @click="handleNodeClick(scope.row)" style="cursor:pointer">
                    {{ scope.row.year }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 通道数据 -->
        <!-- <div class="dataList" :style="{ 'margin-top': top + 'px' }">
          <div class="close" @click="closeDraw">
            <el-tooltip content="隐藏" placement="top" effect="light">
              <i class="el-icon-caret-top"></i>
            </el-tooltip>
          </div>
          <el-tag class="drawerTitle">{{ drawerTitle }}</el-tag>
          <el-button v-if="showCartBtn" class="cart" type="danger" size="mini"
            >加入收藏车</el-button
          >
          <el-table
            class="dataListTable"
            id="tableShow"
            :data="station"
            row-key="id"
            border
            style="width: 100%"
            size="small"
            height="500"
            stripe
            accordion
            @selection-change="handleSelectionChange"
            :tree-props="{ children: 'children' }"
          >
            <el-table-column type="selection" width="40" />
            <el-table-column
              prop="staName"
              label="名称"
              align="center"
              sortable
              width="140"
            >
            </el-table-column>
            <el-table-column
              prop="staCode"
              label="编号"
              align="center"
              width="140"
            >
            </el-table-column>
          </el-table>
        </div> -->
        <div class="start-list" :style="{ 'margin-left': left + 'px' }">
          <left-draw
            :prop="defaultProps"
            :load="nodeClick"
            :nodeClick="handleNodeClick"
          >
          </left-draw>
          <el-button
            type="danger"
            @click="showDialog"
            style="position: absolute; top: 0; right: 0px"
            icon="el-icon-message"
            circle
            size="mini"
          >
          </el-button>
        </div>
        <div class="header">
          <div class="topNav">
            <top-nav :pageName="'模拟资料'"></top-nav>
          </div>
          <top-sel class="topSel" type="模拟资料" :stationList="station" @filter="filterVal" :yearlist="yearlist" @filterYear="filterYear"></top-sel>
        </div>
        <div class="container" v-loading="loading1" v-if="containerShow">
          <i
            class="el-icon-circle-close"
            style="position: absolute; cursor: pointer; right: 0; top: 0"
            @click="containerShow = false"
          ></i>
          <ul class="box">
            <li v-for="item in tableList" :key="item.id">
              <div class="containBox">
                <el-image
                  style="width: 100px; height: 90px"
                  :src="item.url"
                  :preview-src-list="srcList2"
                  @click="showPreviewInfo(item)"
                >
                </el-image>
                <span class="time" style="font-size: 12px"
                  >{{ item.netName }}{{ item.staName }}（{{ item.num }}）</span
                >
                <span class="time">
                  {{ setTime(item.startTime) }}~{{ setTime(item.endTime) }}
                </span>
                <!-- {{ item.id }} -->
              </div>
            </li>
          </ul>
          <el-pagination
            background
            layout="total,prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page.sync="currentPage"
            @current-change="changePage"
            @prev-click="prevPage"
            @next-click="nextPage"
          >
          </el-pagination>
        </div>
       <!-- 点击地图标记点弹窗 -->
        <div
          v-if="markshow"
          class="markee"
          :style="{ 'margin-left': left + 'px' }"
        >
          <mack-drawer
            :markeArr="marke"
            :title="'模拟资料'"
            @markees="markees"
            :dataLength="yearlist.length"
          ></mack-drawer>

          <!-- <el-button
            type="primary"
            size="mini"
            :disabled="disabled"
            @click="getCataList"
            >数据目录详情</el-button
          > -->
        </div>
        <!-- 地图 -->
        <div class="box">
          <selsmometry-map
            v-loading="loading"
            :list="station"
            @maplist="maplist"
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
  </div>
</template>

<script>
import { encode, decode } from '@/utils/dataEncry' // getYearList
import { getNet,getImg, getYearList, getStation, getYear } from '@/api/simulation'
import { getcata } from '@/api/selsmometry'
import TopNav from '../../components/topNav.vue'
import selsmometryMap from '@/components/map/index.vue'
import changeMap from '@/components/changeMap.vue'
import mackDrawer from '@/components/mackDrawer.vue'
import topSel from '@/components/mapFilter/topSel.vue'
import leftDraw from '@/components/mapFilter/leftDraw.vue'
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {
    return {
      // 图片预览的大图
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ],
      // 左侧数据框
      left: 0,
      top: -620,
      icon: 'el-icon-caret-left',
      // 点的数据
      station: [],
      tableData: [],
      show: false,
      // 存储点击的点
      highspot: null,
      drawertitle: '',
      marke: null,
      containerShow: false,
      showCartBtn: false,
      //图片预览大图的额外信息
      previewInfo:{
        netName: '',
        staName: '',
        num: '',
        startTime: '',
        endTime: ''
      },
      showPreview: false,
      srcList2: [],
      // 地图资源
      restmap: {
        url: '/map-tianditu/rest/maps/矢量底图_经纬度',
        urlLon: '/map-tianditu/rest/maps/矢量中文注记_经纬度'
      },
      props: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      },
      // 切换底图
      mapShow: null,
      tabgePage: true,
      filterText: '',
      search: '',
      value1: [],
      defaultProps: {
        children: 'children',
        label: 'staCode'
      },
      loading: false,
      loading1: false,
      isActive: false,
      markshow: false,
      yearlist: [],
      treeList: [],
      // 数据总条数
      total: 10,
      // 每页显示几条
      pageSize: 12,
      // 当前页
      currentPage: 1,
      // 获取到的数据
      staionbyyears: [],
      // 展示的数据
      tableList: [],
      imgUrl: '',
      // 提示框
      TipDialog: false
    }
  },
  components: { TopNav, selsmometryMap, changeMap, topSel, leftDraw, mackDrawer },
  created() {
    this.highspot = null
  },
  methods: {
    // 消息提示框的显示隐藏
    showDialog() {
      this.TipDialog = !this.TipDialog
    },
    // 切换底图
    changeBaseLayer(e) {
      this.mapShow = e
    },
    nodeClick(node, resolve) {
      if (node.level === 0) {
        let arr = [
          { staCode: "国家台" },
          { staCode: "区域台" },
          { staCode: "遥测台" },
          { staCode: "流动台" }
        ]
        this.treeList = arr
        return resolve(arr)
      } else if (node.level === 1) {
        if(node.data.staCode === "国家台"){
          let is = { type:"isGJ"}
          getNet(encode(is)).then((res) => {
            let data = decode(res)
            let arr = []
            console.log(data)
            data.forEach((item) => {
              arr.push({ staCode: item.netName + "(" + item.netCode + ")", id: item.id, type:'station'})
            })
            return resolve(arr)
          })
        }
        if(node.data.staCode === "区域台"){
          let is = { type:"isQY"}
          getNet(encode(is)).then((res) => {
            let data = decode(res)
            let arr = []
            console.log(data)
            data.forEach((item) => {
              arr.push({ staCode: item.netName + "(" + item.netCode + ")", id: item.id, type:'station'})
            })
            return resolve(arr)
          })
        }
        if(node.data.staCode === "遥测台"){
          let is = { type:"isYC"}
          getNet(encode(is)).then((res) => {
            let data = decode(res)
            let arr = []
            console.log(data)
            data.forEach((item) => {
              arr.push({ staCode: item.netName + "(" + item.netCode + ")" , id: item.id, type:'station'})
            })
            return resolve(arr)
          })
        }
        if(node.data.staCode === "流动台"){
          let is = { type:"isLD"}
          getNet(encode(is)).then((res) => {
            let data = decode(res)
            let arr = []
            console.log(data)
            data.forEach((item) => {
              arr.push({ staCode: item.netName + "(" + item.netCode + ")", id: item.id, type:'station'})
            })
            return resolve(arr)
          })
        }
      }else {
          resolve([])
      }
    },
    getYearList(name) {
      let temp = this.drawerTitle.split('(')[1]
      let par = {
        staCode: name,
        netCode: temp.substr(0,temp.length - 1)
      }
      // alert(JSON.stringify(par))
      const self = this
      self.yearlist = []
      getYear(encode(par)).then((res) => {
        let arr = this.setList(decode(res))
        arr.forEach((item) => {
          self.yearlist.push(item)
        })
        self.isActive = true
        self.show = true
      })
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
      this.top = -620
    },
    // 获取地图数据
    handleNodeClick(data) {
      console.log(data.staCode, 23)
      this.yearlist = []
      this.isActive = false
      this.show = false
      this.highspot = null
      if (data.type == 'station') {
       this.drawerTitle = data.staCode
          let par = {
            netId: data.id
          }
        getStation(encode(par)).then((res) => {
          // alert(JSON.stringify(res))
          let list = decode(res)
            list.forEach((item) => {
              item.staLat = item.sta_lat
              item.staLon = item.sta_lon
            })
            if(this.top < 0){
              this.top = 50
            }
            // alert(JSON.stringify(list))
            this.station = list
            if (list.length === 0) {
              this.$message.error('台站数为空')
            }
        })
      }
      if (data.child) {
        this.staionbyyears = data.child
        this.total = data.child.length

        let list = { year: data.year, staName: data.staName }
        getYearList(encode(list)).then((res) => {
          this.staionbyyears = decode(res)
          this.total = decode(res).length
          this.tabgePage = false
          this.change(this.currentPage)
          this.containerShow = true
        })
      }
    },
    handleSelectionChange(val) {
      if (val.length === 0) {
        this.showCartBtn = false
      } else {
        this.showCartBtn = true
      }
    },
    showPreviewInfo(info) {
      this.previewInfo.netName = info.netName
      this.previewInfo.staName = info.staName
      this.previewInfo.num = info.num
      this.previewInfo.startTime = info.startTime
      this.previewInfo.endTime = info.endTime
      // this.showPreview = true
      setTimeout(() => {
        var d4 = document.createElement("div");
        d4.style = "color:rgb(128, 255, 255);font-size:18px;position:absolute;top:35px;left:150px;"
        var text = document.createTextNode("【台网名称】："+info.netName+"                【台站名称】："+info.staName+
        "               【仪器名称】："+info.num+"                【时间】："+this.setTime(info.startTime)+"~"+this.setTime(info.endTime));
        d4.appendChild(text);
        var parentDiv = document.getElementsByClassName('el-image-viewer__wrapper')[0]
        parentDiv.appendChild(d4);
    }, 300);
    },
    maplist(val) {
      // if (this.deformation.length === 0) {
        // alert(JSON.stringify(val))
        val.cTime = this.setTime(val.cTime).slice(0, 4)
        this.marke = val
        this.highspot = val
        this.markshow = true
        this.drawer = false
        this.drawer1 = false
        this.getYearList(val.staCode)
        this.getCataList()
        if(this.top < 0){
          this.top = 50
        }
      // }
    },
    markees() {
      this.markshow = false
    },
    // 获取通道数据
    getCataList() {
      let arr = { staId: '', netId: '' }
      this.isActive = true
      this.show = true
      // alert(JSON.stringify(this.marke))
      arr.staId = this.marke.id
      arr.netId = this.marke.netId
    },
    // 台站的点击事件
    getStantion(val) {
      // alert(JSON.stringify(val.staCode))
      this.maplist(val)
      this.getYearList(val.staCode)
    },

    // 处理重复数据 进行分组
    setList(arr) {
      let array = []
      let data = []
      let num = arr.length
      for (let i = 0; i < num; i++) {
        let name = new Date(arr[i].startTime).getFullYear()
        if (array.indexOf(name) === -1) {
          data.push({
            staName: arr[i].staName,
            year: name,
            staCode: name,
            id: i + 1,
            child: [arr[i]]
          })
          array.push(name)
        } else {
          for (let j = 0; j < data.length; j++) {
            if (data[j].startTime === arr[i].startTime) {
              data[j].child.push(arr[i])
              break
            }
          }
        }
      }
      let compare = function (num) {
        return function (obj1, obj2) {
          let val1 = obj1[num]
          let val2 = obj2[num]
          if (val1 < val2) {
            return -1
          } else if (val1 > val2) {
            return 1
          } else {
            return 0
          }
        }
      }
      data.sort(compare('year'))
      return data
    },
    // 过滤
    filterNode(value, data) {
      if (!value) return true
      // console.log(data)
      return data.staCode.indexOf(value) !== -1
    },
    filterVal(id) {
      let info = {}
      this.station.map(item => {
        if(item.id == id){
          info = item
        }
      })
      this.maplist(info)
    },
    filterYear(year) {
      let info = {}
      this.yearlist.map(item => {
        if(item.year == year){
          info = item
        }
      })
      this.handleNodeClick(info)
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
    // 点击页码
    changePage(e) {
      this.currentPage = e
      this.change(this.currentPage)
    },
    // 上一页
    prevPage(e) {
      this.currentPage = e
      this.change(this.currentPage)
    },
    // 下一页
    nextPage(e) {
      this.currentPage = e
      this.change(this.currentPage)
    },
    // 换页方法
    async change(val) {
      this.loading1 = true
      let start = this.pageSize * val - this.pageSize
      let end = this.pageSize * val
      if (this.total <= this.pageSize) {
        this.tableList = this.staionbyyears
      } else {
        if (this.pageSize * val >= this.total) {
          this.tableList = this.staionbyyears.slice(start)
        } else {
          this.tableList = this.staionbyyears.slice(start, end)
        }
      }
      this.tableList = await this.forList(this.tableList)
      this.tableList.map(item => {
            this.srcList2.push(item.url)
          })
          console.log(JSON.stringify(this.tableList))
    },
    // 处理图片的获取
    async forList(list) {
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        let url = await this.getimg(item.filenameold)
        item.url = url
      }
      this.loading1 = false

      return list
    },
    // 获取图片
    getimg(name) {
      return new Promise((resolve) => {
        getImg(name, true).then((res) => {
          if (res) {
            const myBlob = new window.Blob([res], { type: 'image/png' })
            const qrUrl = window.URL.createObjectURL(myBlob)
            resolve(qrUrl)
          }
        })
      })
    },

    // 处理时间
    setTime(time) {
      let date = new Date(time)
      const year = date.getFullYear()
      let mon = date.getMonth() + 1
      // mon = this.checkTime(mon)
      let hour = date.getHours()
      hour = this.checkTime(hour)
      let min = date.getMinutes()
      min = this.checkTime(min)
      // let sec = date.getSeconds()
      // sec = this.checkTime(sec)
      let day = date.getDate()
      day = this.checkTime(day)
      return `${year}/${mon}/${day} ${hour}:${min}`
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    }
  }
}
</script>

<style lang="scss" scoped>
.el-main {
  position: relative;
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
  .imgInfo {
    background-color: #fff;
    text-align: center;
    color: #fff;
    position: absolute;
    top: 0;
    left: 50px;
    z-index: 9999;
  }
  .rightDraw {
    position: absolute;
    top: 15px;
    right: 25px;
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
      .stationTxt {
        background-color: #f0f0f0;
        border-bottom: 2px solid #fff;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
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
  .stationlist,
  .dataList2 {
    position: absolute;
    top: 110px;
    right: 313px;
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
    top: 163px;
  }
  .selected {
    background-color: #409eff;
    color: rgb(128, 234, 255);
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
}
.dataList {
  position: absolute;
  z-index: 1000;
  right: 25px;
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
    top: 26px;
    right: 3px;
  }
  .list {
    border-radius: 6px;
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
  .tiggle {
    position: absolute;
    top: 278px;
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
    z-index: 2000;
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
  .el-row {
    margin-bottom: 20px;
  }
  p {
    text-indent: 32px;
    line-height: 200%;
  }
  .container {
    width: 64%;
    min-width: 860px;
    position: absolute;
    top: 100px;
    background-color: #fff;
    left: 50%;
    transform: translateX(-40%);
    z-index: 1000;
    min-height: 500px;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.4);
    .box {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      margin: 0 -13px;
      // height: 88vh;
      // min-height: 600px;
      li {
        width: 25%;
        margin-bottom: 20px;
        padding: 0 3px;
        .containBox {
          height: 120px;
          padding: 5px;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          // border: 1px solid #000;
          box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.4);
        }
      }
      .containBox {
        .time {
          font-size: 10px;
        }
      }
    }
  }
}
.el-main {
  padding: 0;
}
</style>
