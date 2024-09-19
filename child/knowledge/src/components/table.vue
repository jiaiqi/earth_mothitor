<template>
  <div class="industry1">
    <div v-if="showIfr" class="iframe">
      <iframe :src="previewUrl" width="1000" height="700"></iframe>
      <i class="el-icon-error" @click="close"></i>
    </div>
    <el-dialog :visible.sync="open" width="85%">
        <div v-html="htmlText" style="padding: 15px 30px;">
        </div>
      </el-dialog>
    <div style="min-height: 800px">
      <!-- 法规 -->
      <el-table
        v-if="type == 4"
        v-loading="loading"
        :data="tableList"
        @filter-change="filterChange2"
        ref="laws"
        cell-style="font-size:15px"
          width="100%"
          stripe
          border
          size="mini"
      >
        <el-table-column prop="sname" label="法规名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column width="90" label="类型" :show-overflow-tooltip="true"
          prop="stype"
          :filters="filterList3"
          :filter-method="filterHandler">
          <template slot-scope="scope">
            <div>
              {{ scope.row.stype == 3 ? '法律' :'法规' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sclassification" width="170" label="法规类型"
        sortable
        :show-overflow-tooltip="true"
         ></el-table-column>
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
      <el-table
        v-else
        ref="standa"
        v-loading="loading"
        :data="tableList"
        @filter-change="filterChange"
        cell-style="font-size:15px"
        width="100%"
        stripe
        border
        size="mini"
      >
        <el-table-column label="标准名称" v-if="type != '4'" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.nationalStandard.split('代')[0] }}
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="省份" width="90px"
        prop="undertaker"
        v-if="type == '2'"
          :filters="filterList2"
          :filter-method="filterHandler"
         sortable>
          <template slot-scope="scope">
            {{ scope.row.undertaker }}
          </template>
        </el-table-column>
        <el-table-column label="团体名称" v-if="type == '3'"        
         sortable :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.undertaker }}
          </template>
        </el-table-column>
        <el-table-column
          label="公布时间："
          align="center"
          prop="implDate"
          width="120px"
          sortable
          v-if="type == '3'"  
        >
          <template slot-scope="scope">
            <span>{{ setTime(scope.row.releaseTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="type !== '2' && type !== '3'"
          label="业务领域"
          prop="businessarea"
          :filters="filterList"
          :filter-method="filterHandler"
          align="center"
          width="120px"
          sortable
        />
        <!-- <el-table-column
          label="承担单位"
          prop="undertaker"
          align="center"
          :show-overflow-tooltip="true"
          sortable
          width="120px"
        /> -->
        <el-table-column
          label="发布时间："
          align="center"
          prop="implDate"
          width="120px"
          sortable
          v-if="type !== '3'"
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
          v-if="type !== '3'"
        >
          <template slot-scope="scope">
            <span>{{ setTime(scope.row.implDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          v-if="type != 4"
          align="center"
          class-name="small-padding fixed-width"
          width="160"
        >
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.type === '1'"
              size="mini"
              type="warning"
              icon="el-icon-s-unfold"
              @click="handleSee(scope.row)"
            >
              预览
            </el-link>

            <el-link
              v-if="scope.row.type === '1'"
              size="mini"
              type="success"
              icon="el-icon-download"
              @click="handleUpdate(scope.row)"
            >
              下载
            </el-link>
            <el-link
              v-if="scope.row.type !== '1'"
              size="mini"
              type="warning"
              icon="el-icon-s-unfold"
              @click="handleUrl(scope.row)"
            >
              查看详细
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
</template>

<script>
import { getStandard, getLawList, downStandard } from '@/api/standard'
import { proSerlist } from '@/api/prod'
import { encode, decode } from '@/utils/dataEncry'
import { mapState } from 'vuex'
import {
  hotDataAdd
} from '@/api/hots'
export default {
  data() {
    return {
      list: [],
      loading: true,
      total: 10,
      pageSize: 20,
      // 当前页
      currentPage: 1,
      tableList: [],
      //业务领域过滤选项
      filterList: [],
      //省份过滤选项
      filterList2: [],
      //法律的类型
      filterList3: [],
      //法律的法规类型
      filterList4: [],
      showIfr: false,
      previewUrl: '',
      open: false,
      htmlText: '',
      lawTypes: '',
      filterNum: 0,
      // type: '0'
    }
  },
  computed: {
    ...mapState(['type'])
  },
  components: {
    // asideCard
  },
  watch: {
    type(newVal) {
      this.getStandard()
    },
    lawType(newVal) {
      this.lawTypes = newVal
      this.getList()
    }
  },
  created() {
    this.getStandard()
  },
  props: ['lawType'],
  methods: {
    // 获取法规列表
    getStandard(type) {
      if(!type){
        this.loading = true
      }
      if(this.type == 4){
        this.getList()
      }else{
        let arr = []
        this.filterList = []
        this.filterList2 = []
        getStandard(encode({ type: this.type })).then((res) => {
          let list = decode(res) 
         
          this.list = list.slice().sort((a, b) =>   b.releaseTime-a.releaseTime)
          this.total = list.length
          this.list.map(item=>{
            if(!arr.includes(item.businessarea) && item.businessarea){
              this.filterList.push({
                text: item.businessarea,
                value: item.businessarea,
              })
              arr.push(item.businessarea)
            }
          })
          arr = []
          this.list.map(item=>{
            if(!arr.includes(item.undertaker) && item.undertaker){
              this.filterList2.push({
                text: item.undertaker,
                value: item.undertaker,
              })
              arr.push(item.undertaker)
            }
          })
          // 表格显示数据
          this.currentPage = 1
          this.loading = false
          this.change(this.currentPage)
        }).catch((e)=>{
          if(!type){
          setTimeout(() => {
            this.getStandard(1)
          }, 1000);
        }
        })
      }

    },
    filterChange(item) {
      if(item['el-table_1_column_2'] && item['el-table_1_column_2'].length != 0){
        let arr = []
        item['el-table_1_column_2'].map(itm=>{
          this.list.map(ite=>{
            if(itm == ite.businessarea){
              arr.push(ite)
            }
          })
        })
        this.total = arr.length
      }else if(item['el-table_1_column_2'] && item['el-table_1_column_2'].length == 0){
        this.getStandard()
      }
      if(item['el-table_1_column_6'] && item['el-table_1_column_6'].length != 0){
        let arr = []
        item['el-table_1_column_6'].map(itm=>{
          this.list.map(ite=>{
            if(itm == ite.undertaker){
              arr.push(ite)
            }
          })
        })
        this.total = arr.length
      }else if(item['el-table_1_column_6'] && item['el-table_1_column_6'].length == 0){
        this.getStandard()
      }
      this.change(this.currentPage)
    },
    filterChange2(item) {
      if(item['el-table_1_column_2'] && item['el-table_1_column_2'].length != 0){
        let arr = []
        item['el-table_1_column_2'].map(itm=>{
          this.list.map(ite=>{
            if(itm == ite.stype){
              arr.push(ite)
            }
          })
        })
        this.total = arr.length
      }else if(item['el-table_1_column_2'] && item['el-table_1_column_2'].length == 0){
        this.getList()
      }
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    //新增热点搜索
    addHot(name,url){
      let form = {
            keyName: '法律法规-'+name,
            url: '/knowledge/statute',
            linkUnit: ''
          }
          if(url){
            form.url = url
          }
      hotDataAdd(encode(form)).then()
    },
    getList() {
      let list = []
      let par = ''
      par = 'pageNum=1&pageSize=9999&status=1'
      if(this.lawTypes != ''){
        par = 'pageNum=1&pageSize=9999&status=1&like='+this.lawTypes
      }
      getLawList(par).then(response => {
          list = response.records
          this.list = list
          this.loading = false;
          this.total = response.total
          let arr = []
          this.filterList3 = []
          this.list.map(item=>{
          if(!arr.includes(item.stype) && item.stype){
            this.filterList3.push({
              text: item.stype == 3 ? '法律' :'法规',
              value: item.stype,
            })
              arr.push(item.stype)
            }
          })
          // 表格显示数据
          this.currentPage = 1
          this.change(this.currentPage)
      });
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
    sortState(a, b) {
      if (a.state > b.state) {
        return -1
      }
    },
    toUrl(row){
      this.addHot(row.sname,row.url)
      let url = row.url;
      if(row.stext){
        this.htmlText = row.stext
        this.open = true
      }else {
        window.open(url)
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
      // this.addHot(row.title)
      // downStandard(row.id)
      //   .then((res) => {
      //     // let url = process.env.VUE_APP_CRIT_API + '/fileservice/ecdownload'
      //     let blob = new Blob([res], { type: 'application/pdf' })
      //     let blobURL = URL.createObjectURL(blob)

      //     // let win = window.open(blobURL)
      //     this.previewUrl = blobURL + '#toolbar=0'
      //     this.showIfr = true
      //     setTimeout(() => {
      //       window.document.name = row.filename
      //     }, 500)
      //   })
      //   .catch((ree) => {})

       window.open(`${url}?fileid=${row.id}`)
    },
    handleUrl(row) {
      this.addHot(row.title,row.url)
      let url = row.url;
      if(row.sText){
        this.htmlText = row.sText
        this.open = true
      }else {
        window.open(url)
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
    func(a, b) {
        return a - b;
    },
    // 换页方法
    change(val) {
      let start = this.pageSize * val - this.pageSize
      let end = this.pageSize * val
      let list = []
      let tabList = []
      if (this.total <= this.pageSize) {
        this.tableList = this.list
      } else {
        if (this.pageSize * val >= this.total) {
          this.tableList = this.list.slice(start)
        } else {
          this.tableList = this.list.slice(start, end)
        }
      }
      this.tableList.forEach((item) => {
        list.push(parseFloat(item.nationalStandard.split('－')[0].split(' ')[1]))
        item.stand = parseFloat(item.nationalStandard.split('－')[0].split(' ')[1])
      })
      //list = list.sort(this.func);
      list.forEach((item) => {
        this.tableList.forEach((itm) => {
          if (itm.stand === item) {
            tabList.push(itm)
          }
        })
      })
      this.tableList = tabList
      if (this.type === '0') {
        let a = /^GB [.]*/
        let b = /^GB[/]T[.]*/
        let gb = tabList.filter((item) => a.test(item.nationalStandard) === true)
        let gbt = tabList.filter(
          (item) => b.test(item.nationalStandard) === true
        )
       // this.tableList = gb.concat(gbt)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.industry1 {
  background-color: #fff;
  padding: 10px 20px;
}
.iframe {
  position: absolute;
  display: flex;
  top: 200px;
  width: 1000px;
  height: 800px;
  justify-content: center;
  z-index: 1005;
  font-size: 30px;
  color: #fff;
}
</style>
