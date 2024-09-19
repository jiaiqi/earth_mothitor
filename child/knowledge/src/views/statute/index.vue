<template>
  <div class="statute">
    <div v-if="showIfr" class="iframe">
      <iframe :src="previewUrl" width="1000" height="700"></iframe>
      <i class="el-icon-error" @click="close"></i>
    </div>
    <el-dialog :visible.sync="open" width="85%">
        <div v-html="htmlText" style="padding: 15px 30px;">
        </div>
      </el-dialog>
    <top-title @tabList="tabList" @tabList1="tabList1"></top-title>
    <div class="stanType" v-if="typeList.length > 0 && showSel">
      <div class="rows">
        <div class="type" v-for="item in typeList" :key="item.id" @click="selType(item)">{{ item.name }}</div>
      </div>
    </div>
    <div v-if="!show" class="industry commom">
      <el-button
        class="goup"
        size="mini"
        type="success"
        icon="el-icon-back"
        @click="gotoPage"
        circle
      ></el-button>
      <div style="min-height: 800px">
        <el-tabs type="border-card">
         <el-tab-pane label="标准" v-if="type=='0' || type=='2'">  <el-table
          
          v-loading="loading"
          cell-style="font-size:15px"
          :data="tableList"
          width="100%"
          stripe
          border
          size="mini"
        >
          <el-table-column label="名称" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.nationalStandard.split('代')[0] }}
              {{ scope.row.title }}
            </template>
          </el-table-column>
          <el-table-column
            label="业务领域"
            prop="businessarea"
            align="center"
            width="120px"
            :show-overflow-tooltip="true"
            sortable
          />

          <el-table-column
            label="发布时间："
            align="center"
            prop="implDate"
            width="120px"
            sortable
          >
            <template slot-scope="scope">
              <span>{{ setTime(scope.row.releaseTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="实施时间："
            align="center"
            prop="implDate"
            width="120px"
            sortable
          >
            <template slot-scope="scope">
              <span>{{ setTime(scope.row.implDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            width="160"
          >
            <template slot-scope="scope">
              <el-link
                v-if="scope.row.type !== '0'"
                size="mini"
                type="warning"
                icon="el-icon-s-unfold"
                @click="handleSee(scope.row)"
              >
                预览
              </el-link>

              <el-link
                v-if="scope.row.type !== '0'"
                size="mini"
                type="success"
                icon="el-icon-download"
                @click="handleUpdate(scope.row)"
              >
                下载
              </el-link>
              <el-link
              v-if="scope.row.url && scope.row.url != ''"
                size="mini"
                type="warning"
                icon="el-icon-s-unfold"
                @click="toUrl(scope.row)"
              >
                查看详细
              </el-link>
            </template>
          </el-table-column>
        </el-table>
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
        </el-tab-pane>
       <el-tab-pane label="法规" v-if="type=='1' || type=='2'">
          <el-table 
          v-loading="loading"
          cell-style="font-size:15px"
          :data="tableList1"
          width="100%"
          stripe
          border
          size="mini"
        >
        <el-table-column prop="sname" label="法规名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="stype" width="90" label="类型" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>
              {{ scope.row.stype == 3 ? '法律' :'法规' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sclassification" width="170" label="法规类型" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="cunit" label="联系单位"></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="160"
        >
          <template slot-scope="scope">
            <el-link
              size="mini"
              type="warning"
              icon="el-icon-s-unfold"
              @click="toUrl(scope.row)"
            >
              查看详细
            </el-link>
          </template>
        </el-table-column>
        </el-table>
         <el-pagination
        background
        layout="total,prev, pager, next"
        :total="total1"
        :page-size="pageSize1"
        :current-page.sync="currentPage1"
        @current-change="changePage1"
        @prev-click="prevPage1"
        @next-click="nextPage1"
      >
      </el-pagination>
      </el-tab-pane> 
      </el-tabs>
      </div>
     
    </div>
    <el-container v-else class="commom main">
      <el-aside width="140px">
        <aside-card @type="getType" @lawType="lawTypeEven"></aside-card>
      </el-aside>
      <el-main>
        <tables :lawType="lawType"></tables>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import asideCard from '@/components/standard/asideCard.vue'
import topTitle from '@/components/standard/topTitle.vue'
import tables from '@/components/table.vue'
import { downStandard } from '@/api/standard'
import { encode } from '@/utils/dataEncry'
import {
  hotDataAdd
} from '@/api/hots'
export default {
  data() {
    return {
      loading: false,
      show: true,
      tablesList: [],
      tablesList1: [],
      total: 10,
      pageSize: 20,
      // 当前页
      currentPage: 1,

      total1: 10,
      pageSize1: 20,
      // 当前页
      currentPage1: 1,
      tableList1: [],
      tableList: [],
      showIfr: false,
      showSel: true,
      htmlText: '',
      open: false,
      previewUrl: '',
      typeList: [],
      lawType: '',
      type: null, //判断是法规还是标准
    }
  },
  components: { topTitle, asideCard, tables },
  methods: {
    getType(list) {
      this.typeList = list
    },
    gotoPage() {
      this.tableList = []
      this.tablesList = []
      this.show = true
      this.showSel = true
    }, 
    //法律标准分类
    selType(item) {
      if(item.id || item.id == 0){
        this.$store.commit('setType', item.id)
      }else{
        this.lawType = item.name
      }
    },
    //回调事件，法规分类清零
    lawTypeEven(){
      this.lawType = ''
    },
    tabList(val,type) {
      this.type = type
      this.show = false
      this.showSel = false
      this.tablesList = val
      this.total = this.tablesList.length
      // 表格显示数据
      this.change(this.currentPage)
    },

    tabList1(val,type) {
      this.type = type
      this.show = false
      this.showSel = false
      this.tablesList1 = val
      this.total1 = this.tablesList1.length
      // 表格显示数据
      this.change2(this.currentPage1)
    },
    setTime(time) {
      let data = new Date(time)
      let year = data.getFullYear()

      let mon = data.getMonth() + 1
      let sec = data.getDate()
      if (mon < 10) {
        mon = `0${mon}`
      }
      if (sec < 10) {
        sec = `0${sec}`
      }
      return `${year}-${mon}-${sec}`
    },
    toUrl(row){
      this.addHot(row.title)
      let url = row.url;
      if(row.stext){
        this.htmlText = row.stext
        this.open = true
      }else {
        window.open(url)
      }
    },
    //新增热点搜索
    addHot(name){
      let form = {
            keyName: '法律法规-'+name,
            url: '/knowledge/statute',
            linkUnit: ''
          }
      hotDataAdd(encode(form)).then()
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
    change(val) {
      let start = this.pageSize * val - this.pageSize
      let end = this.pageSize * val
      if (this.total <= this.pageSize) {
        this.tableList = this.tablesList
      } else {
        if (this.pageSize * val >= this.total) {
          this.tableList = this.tablesList.slice(start)
        } else {
          this.tableList = this.tablesList.slice(start, end)
        }
      }
    },
     // 点击页码
    changePage1(e) {
      this.currentPage1 = e
      this.change2(this.currentPage1)
    },
    // 上一页
    prevPage1(e) {
      this.currentPage1 = e
      this.change2(this.currentPage1)
    },
    // 下一页
    nextPage1(e) {
      this.currentPage1 = e
      this.change2(this.currentPage1)
    },
     // 换页方法
    change2(val) {
      let start = this.pageSize1 * val - this.pageSize1
      let end = this.pageSize1 * val
      if (this.total1 <= this.pageSize1) {
        this.tableList1 = this.tablesList1
      } else {
        if (this.pageSize1 * val >= this.total1) {
          this.tableList1 = this.tablesList1.slice(start)
        } else {
          this.tableList1 = this.tablesList1.slice(start, end)
        }
      }
    },
    close() {
      this.showIfr = false
    },
    // 下载
    handleUpdate(row) {
      this.addHot(row.title)
      let url = 'http://www.earthquake.ac.cn/fileservice/fileservice/ecdownload'
      // window.location.href = `${url}?filename=${row.filename}`
      window.open(`${url}?fileid=${row.id}`)
    },
    handleSee(row) {
      this.addHot(row.title)
      downStandard(row.id)
        .then((res) => {
          // let url = process.env.VUE_APP_CRIT_API + '/fileservice/ecdownload'
          let blob = new Blob([res], { type: 'application/pdf' })
          let blobURL = URL.createObjectURL(blob)
          // let win = window.open(blobURL)
          this.previewUrl = blobURL + '#toolbar=0'
          this.showIfr = true
          setTimeout(() => {
            window.document.name = row.filename
          }, 500)
        })
        .catch((ree) => {})

      // window.open(`${url}?fileid=${row.id}`)
    },
  }
}
</script>

<style lang="less" scoped>
.el-main {
  margin-left: 20px;
  margin-top: 20px;
  min-width: 800px;
}
.el-aside {
  margin-top: 10px;
}
/deep/.el-main {
  padding: 0;
  margin-top: 15px !important;
}
.iframe {
  position: absolute;
  display: flex;
  top: 200px;
  left: 25%;
  width: 1000px;
  height: 800px;
  justify-content: center;
  z-index: 1005;
  font-size: 30px;
  color: #fff;
}
.stanType {
  width: 100%;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .rows {
    background-color: #fff;
    border-radius: 30px;
    padding: 10px 35px;
    width: 850px;
    display: flex;
    justify-content: space-around;
  }
  .type {
    cursor: pointer;
  }
}
.industry {
  padding: 20px;
  background-color: #fff;
  margin-top: 20px;
  .goup {
    float: left;
    margin-top: -30px;
  }
}
</style>
