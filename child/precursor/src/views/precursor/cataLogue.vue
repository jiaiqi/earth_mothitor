<template>
  <div class="refuge">
    <el-container>
      <el-main style="position: relative; height: 800px">
        <div class="head">
          <!-- <top-sel class="topSel"></top-sel> -->
          <div class="topNav">
            <top-nav :pageName="'地震遥感'"></top-nav>
          </div>
        </div>
        <div
          class="tiggle"
          @click="tiggle"
          :style="{ 'margin-left': left + 'px' }"
        >
          <i :class="icon"></i>
        </div>
        <div class="start-list" :style="{ 'margin-left': left + 'px' }">
          <left-draw
            :prop="props"
            :load="loadNode"
            :nodeClick="handleNodeClick"
          >
          </left-draw>
        </div>
        <div class="dataList" v-if="show">
          <!-- 详细数据 -->
          <div class="list">
            <el-table
              :data="deformation"
              style="width: 100%; font-size: 8px"
              size="mini"
              height="450"
              border
              ref="multipleTable"
              @select="selectDox"
              @select-all="selectAll"
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
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="drawerlist" v-if="drawer">
          <div class="header">
            <span @click="drawer = !drawer">×</span>
          </div>
          <div class="main">
            <div class="top">
              <p>
                <strong>{{ this.drawertitle.title }}</strong>
              </p>
              <p><strong>起始观测时间：</strong>{{ this.drawertitle.time }}</p>
              <p><strong>累计观测期数：</strong>{{ this.drawertitle.num }}期</p>
              <p><strong>分发单位：</strong>{{ this.drawertitle.nuit }}</p>
            </div>
            <div class="content">
              <ul>
                <li v-for="item in unitList" :key="item.id">
                  {{ item.oDate }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="drawerlist" v-if="drawer1">
          <div class="header">
            <span @click="drawer1 = !drawer1">×</span>
          </div>
          <div class="main">
            <div class="top">
              <p>
                <strong>{{ this.drawertitle.title }}</strong>
              </p>
              <p><strong>起始观测时间：</strong>{{ this.drawertitle.time }}</p>
              <p><strong>累计观测时长：</strong>{{ this.drawertitle.num }}天</p>
              <!-- <p><strong>分发单位：</strong>{{ this.drawertitle.nuit }}</p> -->
            </div>
            <div class="content">
              <ul>
                <li v-for="item in unitList" :key="item.id">
                  {{ item.oDate }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 点击地图标记点弹窗 -->
        <div v-if="markshow" class="markee">
          <div class="main">
            <div class="txtmain">
              <div class="header">
                <span>摘要描述：</span
                ><span
                  >{{ this.marke.pointName }}({{
                    this.marke.pointCode
                  }})数据</span
                >
              </div>
              <div class="txt">
                <span>名称: {{ this.marke.pointName }}</span>
                <span>代码: {{ this.marke.pointCode }}</span>
              </div>
            </div>
            <div class="txtmain">
              <div class="header">
                <span>创建时间：</span
                ><span>{{ this.marke.cTime.slice(0, 4) }}</span>
              </div>
              <div class="txt">
                <span>纬度: {{ this.marke.lat.toFixed(2) }}</span>
                <span>经度: {{ this.marke.lon.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          <el-button type="primary" size="mini" @click="getCataList"
            >数据目录详情</el-button
          >
        </div>
        <!-- 地图 -->
        <div class="box">
          <selsmometry-map
            v-loading="loading"
            :list="station"
            @maplist="maplist"
            :restmap="restmap"
            :deformation="deformation"
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
import { getCompany, getUnit } from '@/api/deformation'
import changeMap from '@/components/changeMap.vue'
import {
  getContinuous,
  getFlow,
  getFlowNet,
  getFlowGnss,
  getFlowGnssList,
  getContinuousList,
  getContinuousNet,
  getContinuousDataList
} from '@/api/gnss'
import { provinceAndCityData } from 'element-china-area-data'
import selsmometryMap from '@/components/map/index.vue'
import leftDraw from '@/components/mapFilter/leftDraw.vue'
import TopNav from '@/components/topNav.vue'
// import topSel from '@/components/mapFilter/topSel.vue'
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
      // 大地形变线
      deformation: [],
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
      comTreeList: [
        {
          netName: '区域精密水准',
          children: [
            {
              unitName: '水准点',
              children: [{ unitName: '' }]
            }
          ]
        },
        {
          netName: 'GNSS',
          children: [
            {
              netName: '流动站',
              children: []
            },
            {
              netName: '连续站',
              children: []
            }
          ]
        }
      ],

      filterText: '',
      // 按城市查询的数据
      options: provinceAndCityData,
      selectedOptions: [],
      map: null,
      circle_group: null,
      input: '',
      title: '测震数据',
      title1: '',
      show: false,
      left: 0,
      icon: 'el-icon-caret-left',
      company: [],
      station: [],
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
      drawertitle: {
        title: '',
        time: '',
        num: '',
        nuit: ''
      }
    }
  },
  components: { selsmometryMap, changeMap, leftDraw, TopNav }, // selsmometryMap
  created() {
    this.show = false

    // this.getDeformation()
  },
  mounted() {},
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 获取大地形变线
    getDeformation() {
      let data = encode({})
      getCompany(data).then((res) => {
        this.deformation = decode(res)
      })
    },
    // 获取前两层数据
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.loading = false
        return resolve([
          {
            netName: '区域精密水准'
          },
          {
            netName: 'GNSS',
            children: []
          }
        ])
      } else if (node.level === 1) {
        if (node.label === '区域精密水准') {
          this.station = []
          const data = [
            {
              netName: '水准点'
            }
          ]
          resolve(data)
        } else if (node.label === 'GNSS') {
          const data = [
            {
              netName: '流动站'
            },
            {
              netName: '连续站'
            }
          ]
          resolve(data)
        }
      } else if (node.level === 2) {
        if (node.label === '水准点') {
          this.station = []
          let data = encode({})
          getUnit(data).then((res) => {
            this.bench = decode(res)
            let data = []
            for (let i = 0; i < this.bench.length; i++) {
              let arr = {
                netName: this.bench[i].unit_name,
                unit_id: this.bench[i].unit_id,
                unit_name: this.bench[i].unit_name,
                leaf: true
              }
              data.push(arr)
            }
            resolve(data)
          })
        } else if (node.label === '连续站') {
          let data = encode({})

          getContinuous(data).then((res) => {
            this.bench = decode(res)
            let data = []
            for (let i = 0; i < this.bench.length; i++) {
              let arr = {
                netName: this.bench[i].c_unit_name,
                unit_id: this.bench[i].c_unit_id,
                c_unit_name: this.bench[i].c_unit_name,
                leaf: false
              }
              data.push(arr)
            }
            resolve(data)
          })
        } else if (node.label === '流动站') {
          let data = encode({})
          getFlow(data).then((res) => {
            this.bench = decode(res)
            let data = []
            for (let i = 0; i < this.bench.length; i++) {
              let arr = {
                netName: this.bench[i].f_unit_name,
                unit_id: this.bench[i].f_unit_id,
                f_unit_name: this.bench[i].f_unit_name,
                leaf: false
              }
              data.push(arr)
            }
            resolve(data)
          })
        }
      } else if (node.level === 3) {
        if (node.data.f_unit_name) {
          getFlowNet(encode({ f_unit_id: node.data.unit_id })).then((res) => {
            this.bench = decode(res)
            let data = []
            for (let i = 0; i < this.bench.length; i++) {
              let arr = {
                netName: this.bench[i].netName,
                nit_id: this.bench[i].id,
                f_unit_id: node.data.unit_id,
                netCode: this.bench[i].netCode,
                leaf: true
              }
              data.push(arr)
            }
            resolve(data)
          })
        } else if (node.data.c_unit_name) {
          getContinuousNet(encode({ c_unit_id: node.data.unit_id })).then(
            (res) => {
              let list = decode(res)
              this.bench = list
              let data = []
              for (let i = 0; i < this.bench.length; i++) {
                let arr = {
                  netName: this.bench[i].netName,
                  nit_id: this.bench[i].id,
                  c_unit_id: node.data.unit_id,
                  netCode: this.bench[i].netCode,
                  leaf: true
                }
                data.push(arr)
              }
              resolve(data)
            }
          )
        }
      }
      if (node.level > 3) {
        return resolve([])
      }
    },
    // 获取地图数据
    handleNodeClick(data) {
      if (
        data.netName === '区域精密水准' ||
        data.netName === '流动站' ||
        data.netName === '连续站'
      ) {
        this.station = []
        this.markshow = false
        this.drawer = false
        this.drawer1 = false
      }
      if (data.netName === 'GNSS') {
        this.deformation = []
        this.station = []
        this.show = false
      }
      if (this.show === true) {
        this.show = false
      } else {
        if (data.unit_name) {
          let datas = encode({ id: data.unit_id })
          getCompany(datas).then((res) => {
            let list = decode(res)
            list.forEach((item) => {
              let time = this.setTime(item.time)
              item.time = time
            })
            if(list.length == 0){
              this.$message.error('数据为空')
            }
            list = list.filter((item) => item.latAndLon.length > 2)
            this.deformation = list
            this.show = true
          })
        } else if (data.f_unit_id) {
          getFlowGnss(
            encode({ f_unit_id: data.f_unit_id, net_id: data.nit_id })
          ).then((res) => {
            let list = decode(res)
            list.forEach((item) => (item.f_unit_id = data.f_unit_id))
            if(list.length == 0){
              this.$message.error('数据为空')
            }
            this.station = list
          })
        } else if (data.c_unit_id) {
          this.id.unit_id = data.c_unit_id
          getContinuousList(
            encode({ c_unit_id: data.c_unit_id, net_id: data.nit_id })
          ).then((res) => {
            let list = decode(res)
            list.forEach((item) => (item.c_unit_id = data.c_unit_id))
            if(list.length == 0){
              this.$message.error('数据为空')
            }
            this.station = list
          })
        }
      }
    },

    // 抽屉的关闭
    handleClose() {
      this.drawer = false
    },
    // 地图标记点点击
    maplist(val) {
      if (this.deformation.length === 0) {
        val.cTime = this.setTime(val.cTime).slice(0, 4)
        this.marke = val
        this.markshow = true
        this.drawer = false
        this.drawer1 = false
      }
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
    selectAll(selection) {},
    // 把没有数据的栏目禁选
    selected(row, index) {
      if (row.latAndLon.length < 2) {
        return false // 不可勾选
      } else {
        return true // 可勾选
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
    // 获取数据详情
    getCataList() {
      // 流动站
      if (this.marke.f_unit_id) {
        getFlowGnssList(
          encode({ unit_id: this.marke.f_unit_id, fp_id: this.marke.id })
        ).then((res) => {
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
          this.drawer = true
        })
      } else {
        // 连续站
        getContinuousDataList(
          encode({ unit_id: this.marke.c_unit_id, fp_id: this.marke.id })
        ).then((res) => {
          let list = decode(res)
          this.drawertitle = {
            title: `${this.marke.pointName} ${this.marke.pointCode}`,
            num: list.length,
            // nuit: this.marke.pointName,
            nuit: list[0].project,
            time: this.marke.cTime
          }
          list.forEach((item) => (item.oDate = this.setTime(item.oDate)))
          this.unitList = list
          this.drawer1 = true
        })
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
    z-index: 2000;
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
  .dataList {
    position: absolute;
    z-index: 1000;
    right: 15px;
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
.mainCard {
  .el-tabs__heade {
    margin: 0;
  }
}
.markee {
  position: absolute;
  top: 20%;
  left: 260px;
  width: 250px;
  z-index: 1000;
  background: #fff;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  .main {
    padding: 10px;
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
  .el-button {
    margin-left: 70px;
    margin-bottom: 10px;
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
