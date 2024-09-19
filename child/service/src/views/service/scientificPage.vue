<template>
  <div class="refuge">
    <el-container>
      <el-main style="position: relative; height: 100%">
        <div
          class="tiggle"
          @click="tiggle"
          :style="{ 'margin-left': left + 'px' }"
        >
          <i :class="icon"></i>
        </div>
        <div class="header">
          <!-- 头部当行蓝 -->
          <div class="topNav">
            <top-nav :pageName="'科学台阵'"></top-nav>
          </div>
          <top-sel class="topSel" type="科学台阵" @search="searchCode"></top-sel>
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
        <div class="start-list" :style="{ 'margin-left': left + 'px' }">
          <!--  台网列表 -->
          <div class="list">
            <el-input
              placeholder="输入关键字进行过滤"
              size="mini"
              v-model="filterText"
            >
            </el-input>
            <!-- :data="comTreeList" -->
            <el-tree
              :data="treeList"
              :props="defaultProps"
              accordion
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
            >
            </el-tree>
          </div>
        </div>
        <!-- 通道数据 -->
        <div class="dataList" :style="{ 'margin-top': top + 'px' }">
          <div class="close" @click="closeDraw">
            <el-tooltip content="隐藏" placement="top" effect="light">
              <i class="el-icon-caret-top"></i>
            </el-tooltip>
          </div>
          <el-tag class="drawerTitle" v-if="show">{{ drawerTitle }}</el-tag>
          <el-button v-if="showCartBtn && !show" class="cart" type="danger" size="mini"
            >加入收藏车</el-button
          >
          <el-table
            class="dataListTable"
            id="tableShow"
            :data="station"
            row-key="id"
            border
            style="width: 91%"
            size="small"
            height="446"
            stripe
            accordion
            v-if="!show"
            @selection-change="handleSelectionChange"
            :tree-props="{ children: 'children' }"
          >
            <el-table-column type="selection" width="40" />
            <el-table-column
              prop="staCode"
              label="台站代码"
              align="center"
              width=""
            >
              <template slot-scope="scope">
                <div @click="maplist(scope.row)">
                  {{ scope.row.staCode }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="dataListTable" v-else>
            <dateDatas style="width: 280px;height: 370px;" :days="tableData"></dateDatas>
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
            :title="'科学台阵'"
            @markees="markees"
            :dataLength="tableData.length"
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
            :highspot="highspot"
            @maplist="maplist"
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
import { encode, decode } from '@/utils/dataEncry'
import {
  getarraynetwork,
  getArraystation,
  getArraycatalogdat
} from '@/api/seismogarray'
import { provinceAndCityData } from 'element-china-area-data'
import selsmometryMap from '@/components/map/index.vue'
import changeMap from '@/components/changeMap.vue'
import TopNav from '../../components/topNav.vue'
import topSel from '@/components/mapFilter/topSel.vue'
import mackDrawer from '@/components/mackDrawer.vue'
import dateDatas from '@/components/date/dateDatas.vue'
export default {
  data() {
    return {
      showCartBtn: false,
      highspot: [],
      mapShow: null,
      disabled: false,
      treeList: [],
      loading: true,
      markshow: false,
      drawShow: null,
      // 抽屉的打开
      drawer: false,
      drawerTitle: '',
      // 选择右侧选项卡样式
      isActive: false,
      show: false,
      // 日历的切换
      activeName: 'third',
      // 日历的隐藏
      activeShow: false,
      // tab表格的数据
      tableData: [],
      // 树结构的属性
      treeshow: true,

      comTreeList: [],
      defaultProps: {
        children: 'children',
        label: 'netName'
      },
      left: 0,
      top: -580,
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
      }
    }
  },
  components: { selsmometryMap, changeMap, TopNav, topSel, mackDrawer, dateDatas }, // selsmometryMap
  created() {
    this.loadNode()
  },
  mounted() {},
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 切换底图
    changeBaseLayer(e) {
      this.mapShow = e
    },

    // 获取上报单位台网
    loadNode() {
      let data = encode({})
      getarraynetwork(data).then((res) => {
        let list = decode(res)
        this.$message.success('获取成功')
        list.unshift({ netName: '全国台阵', id: '' })
        this.treeList = list
        this.loading = false
      })
    },
    markees(val) {
      this.markshow = false
    },
    // 获取台站
    handleNodeClick(data) {
      this.markshow = false

      if (data.netName) {
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
    // 多选框选中
    handleSelectionChange(val) {
      if (val.length === 0) {
        this.showCartBtn = false
      } else {
        this.showCartBtn = true
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.unitName.indexOf(value) !== -1
    },
    stationshow() {
      this.show = !this.show
      this.markshow = false
      this.getCompany()
    },
    // 抽屉的关闭
    closeDraw() {
      this.top = -580
    },

    // 地图标记点点击
    maplist(val) {
      this.disabled = false
      this.marke = val
      console.log(val)
      this.highspot = val
      this.markshow = true
      this.getCataList()
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
    searchCode(code) {
      let info = {}
      this.station.map(item => {
        if(item.staCode == code){
          info = item
        }
      })
      this.maplist(info)
    },
    // 获取通道数据
    getCataList() {
      this.disabled = true
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
          this.disabled = false
          // this.tableData = this.setList(this.tableData)
        })
        .catch((see) => {
          console.log(see)
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
    getDaysInMonth(year, month) {
      month = parseInt(month, 10) // parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
      let temp = new Date(year, month, 0)
      return temp.getDate()
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
    // 关闭通道数据
    handleClose() {
      this.drawer = false
      this.tableData = []
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
  .dataList {
    position: absolute;
    z-index: 998;
    right: 35px;
    top: 12px;
    width: 320px;

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
      top: 0px;
      right: 3px;
    }
    .drawerTitle {
      font-weight: bold;
      position: relative;
      top: 0;

      left: 5px;
      z-index: 1000;
    }
    .dataListTable {
      height: 450px;
      width: 300px;
      background-color: #fff;
      // box-shadow: 2px 2px 10px 0px rgba(86, 86, 86, 0.5);
      // border-radius: 12px;
      padding: 5px;
    }
  }
  .tiggle {
    position: absolute;
    top: 280px;
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
    .list {
      .stationShow {
        position: absolute;
        right: -5px;
        top: -15px;
        padding: 5px;
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
}
.stationlist,
  .dataList2 {
    position: absolute;
    top: 130px;
    right: 355px;
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
.mainCard {
  .el-tabs__heade {
    margin: 0;
  }
}
.box {
  height: 88vh;
}
.markee {
  transition: margin-left 0.4s ease-out;
  position: absolute;
  top: 20%;
  left: 340px;
  width: 320px;
  height: 260px;
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
.drawerDiv {
  background-color: #f0f0f0;
  padding: 10px;
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
