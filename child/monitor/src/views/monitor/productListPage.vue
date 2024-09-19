<template>
  <div class="refuge commom">
  <div class="main">
    <div class="topNav">
      <TopNav :pageName="'技术服务列表'"></TopNav>
    </div>
    <div class="asideBtn" style="display: none;">
      <div @click="sel('公众服务',1)" style="cursor:pointer;">
        <el-card v-if="(type == 1)" class="active">
          <i class="el-icon-s-custom icon"></i>
          <span>公众服务</span>
        </el-card>
        <el-card v-else>
          <i class="el-icon-s-custom icon"></i>
          <span>公众服务</span>
        </el-card>
      </div>
      <div @click="sel('专业服务',2)" style="cursor:pointer;margin-top: 10px;">
        <el-card class="active" v-if="(type == 2)">
          <i class="el-icon-s-opportunity icon"></i>
          <span>专业服务</span>
        </el-card>
        <el-card v-else>
          <i class="el-icon-s-opportunity icon"></i>
          <span>专业服务</span>
        </el-card>
      </div>
      <div @click="sel('决策服务',3)" style="cursor:pointer;margin-top: 10px;">
        <el-card class="active" v-if="(type == 3)">
          <i class="el-icon-s-custom icon"></i>
          <span>决策服务</span>
        </el-card>
        <el-card v-else>
          <i class="el-icon-s-custom icon"></i>
          <span>决策服务</span>
        </el-card>
      </div>
      <div @click="sel('专项服务',4)" style="cursor:pointer;margin-top: 10px;">
        <el-card class="active" v-if="(type == 4)">
          <i class="el-icon-s-opportunity icon"></i>
          <span>专项服务</span>
        </el-card>
        <el-card v-else>
          <i class="el-icon-s-opportunity icon"></i>
          <span>专项服务</span>
        </el-card>
      </div>
    </div>
    <div class="table">
      <div class="right_box">
        <div>
          <div
            style="border: 1px solid rgb(238, 238, 238); border-radius: 0px; width: 100%; background-color: rgb(255, 255, 255);">
            <div
              style="display: flex; width: 100%; background-color: rgb(255, 255, 255); border-bottom: 1px dashed rgb(226, 226, 226);">
              <div class="serveAll" style="width: 100%;min-width: 1000px; padding: 0px 10px 5px 10px;">
                <div class="col_boxs" @click="sel('')">全部</div>
                <div class="col_boxs" @click="sel('非天然地震监测服务')">非天然地震监测服务</div>
                <div class="col_boxs" @click="sel('专用地震监测台网建设和运维技术服务')">专用地震监测台网建设和运维技术服务</div>
                <div class="col_boxs" @click="sel('地震预警技术与信息服务')">地震预警技术与信息服务</div>
                <div class="col_boxs" @click="sel('重大工程健康监测与诊断')">重大工程健康监测与诊断</div>
                <div class="col_boxs" @click="sel('地震安全性评价')">地震安全性评价</div>
                <div class="col_boxs" @click="sel('地震活动断层探查')">地震活动断层探查</div>
                <div class="col_boxs" @click="sel('地震灾害风险调查与评估')">地震灾害风险调查与评估</div>
                <div class="col_boxs" @click="sel('地震地质灾害调查')">地震地质灾害调查</div>
                <div class="col_boxs" @click="sel('地震信息技术服务')">地震信息技术服务</div>
                <div class="col_boxs" @click="sel('地震仪器计量检定服务')">地震仪器计量检定服务</div>
                <!-- <div class="col_boxs col_box" @click="expands"><i :class="expand"></i>{{tiggle}}</div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="box_shxu">
          <div class="tree_list_name">
            <el-input size="large" clearable style="width:50%" v-model="searchValue" placeholder="请输入搜索内容"></el-input>
            <!-- <el-input size="large" clearable style="width:40%" v-model="searchValue" placeholder="请输入产品名称"></el-input> -->
            <!-- <el-input size="large" clearable style="width:40%;margin-left: 10px" v-model="serveUnit" placeholder="请输入联系单位"></el-input> -->
            <!-- <el-select size="large" clearable style="width:30%;margin-left: 10px" v-model="serveUnit" @change="changeSele" placeholder="请选择联系单位">
              <el-option :value="item" v-for="(item, index) in serveUnitList" :key="index"></el-option>
            </el-select> -->
          <el-button size="large" style="margin-left:8px" type="primary" @click="search"><i class="el-icon-search"></i>搜索</el-button>
          </div>
        </div>
        <div>
          <div v-if="noData" class="no-data">暂无数据</div>
          <div class="hovmul" v-for="item in prodList" :key="item.id">
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex;" @click="toInfo(item)"><span
                  style="display: inline-block; cursor: pointer; color: rgb(61, 125, 255); font-size: 18px;">{{item.sname}}</span></div>
                  <span style="color: rgb(135, 135, 135);padding-right: 30px;font-size: 13px;"><span>{{getTime(item.mdate)}}
                    </span></span>
                </div>
            <div style="display: flex; justify-content: space-between; height: 25px; margin: 10px 0px 5px;">
              <div style="width:97%;display:flex;justify-content:space-between">
                <div style="width:85%;display:flex;justify-content: space-between;">
                  <span style="color: rgb(125, 125, 125);padding-right: 50px;">分类：<span>{{item.ssort}}</span></span>
                  <!-- <span style="color: rgb(125, 125, 125);padding-right: 50px;">服务分类：<span>{{item.sclassification}}</span></span> -->
                  <span style="color: rgb(125, 125, 125);">联系单位：<span>{{item.cunit}}</span></span>
                </div>
                  <div style="display: flex;padding-top: 3px;">
                  <i class="el-icon-view" style="font-size:17px;padding-right: 5px;"></i>
                    <span
                    style="color: rgb(155, 155, 155); font-size: 14px;">访问 {{item.recom}}</span></div>
              </div>
            </div>
          </div>
          <div class="total">
            <p style="font-size: 14px;width: 150px;line-height: 50px;">共 {{Math.ceil(total / queryParams.pageSize) }}页 {{ total }}条记录</p>
            <el-pagination class="pages" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
             @current-change="getPageList2" :page-size="20" @size-change="sizeChange" :page-sizes="[10, 20, 50, 100, 200]" layout="sizes, prev, pager, next, jumper"></el-pagination>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPageList,skillSearch } from "@/api/serve";
import { decode, encode } from "@/utils/base/dataEncry";
import {
  hotAdd,
  hotDataAdd
} from '@/api/hots'
export default {
  data() {
    return {
      form: {
        id: '',
        sname: '',
        stype: '',
        cunit: '',
        sclassification: '',
        stext: '',
        cdate: '',
        recom: '',
      },
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      currentPage: 1,
      pagesize: 20,
      serveUnit: '',
      serveUnitList: '',
      noData: false,
      total: 0,
      expand: 'el-icon-arrow-up',
      tiggle: '缩起',
      serveType: '',
      showExpand: true,
      type: 0,
      searchValue: '',
      prodList: [],
      prodList2: [],
      loading: true,
      selType: ''
    }
  },
  mounted() {
    let type = this.$route.query.type
    if(type){
      this.selType = type
      this.sel(type)
    }else{
      this.getList();
      this.selType = ''
    }
    // this.getList(type);

  },
  methods: {
    getList() {
      let par = {
        sType: '',
        sClassification: '',
        cUnit: this.serveUnit,
        sName: this.searchValue,
        pageNum: 1,
        pageSize: this.pagesize
      }
      if(sessionStorage.getItem('province') != '') {
        let name = sessionStorage.getItem('province')
        if(sessionStorage.getItem('province').indexOf('广西') != -1 ||
        sessionStorage.getItem('province').indexOf('西藏') != -1 ||
        sessionStorage.getItem('province').indexOf('内蒙古') != -1 ||
        sessionStorage.getItem('province').indexOf('宁夏') != -1){
          name = sessionStorage.getItem('province').substring(0,2)
        }
        par.cUnit = name
      }
      this.getListApi(par)
    },
    getListApi(par){
      getPageList(par).then(response => {
        //计算技术服务数据的数量
        // let recNum = 0
        // getPageList({
        //     pageNum: 1,
        //     pageSize: 9999,
        //     sType: '',
        //     sClassification: '',
        //     cUnit: this.serveUnit,
        //     sName: this.searchValue,
        //   }).then(res => {
        //     res.records.forEach(item=>{
        //       if(item.stype == 3 || item.stype == 4){
        //         recNum += 1
        //       }
        //     })
        //     this.total = res.total - recNum;
        //   })
        this.total = response.total
        this.prodList = response.records
        this.queryParams.pageSize = response.size;
        this.queryParams.pageNum = response.current;
        if(this.prodList.length > 0){
          this.prodList2 = this.prodList
          let unitArr = []
          this.prodList.map(item => {
            unitArr.push(item.cunit)
          })
          unitArr = Array.from(new Set(unitArr))
          this.serveUnitList = unitArr
          this.noData = false
        }else {
          this.noData = true
        }
        // alert(JSON.stringify(decode(response)))
      })
    },
    getPageList2(data) {
      // alert(JSON.stringify(data))
      let type = ''
      if(this.type == 1){
        type = '公众服务'
      }
      if(this.type == 2){
        type = '专业服务'
      }
      if(this.type == 3){
        type = '决策服务'
      }
      if(this.type == 4){
        type = '专项服务'
      }
        let info = {
          sType: '',
          sClassification: type,
          cUnit: this.serveUnit,
          sName: this.searchValue,
          pageNum: data,
          pageSize: this.pagesize
        }
        if(this.selType!=''){
          info.sort = this.selType
        }
        this.getListApi(info);
    },
    sizeChange(size) {
      let type = ''
      if(this.type == 1){
        type = '公众服务'
      }
      if(this.type == 2){
        type = '专业服务'
      }
      if(this.type == 3){
        type = '决策服务'
      }
      if(this.type == 4){
        type = '专项服务'
      }
      let info = {
          sType: '',
          sClassification: type,
          cUnit: this.serveUnit,
          sName: this.searchValue,
          pageNum: 1,
          pageSize: size
        }
        if(this.selType!=''){
          info.sort = this.selType
        }
        this.pagesize = size;
        this.queryParams.pageSize = size;
        this.getListApi(info);
        // this.pagesize = size
    },
    search() {
      let info = {
          queryContent: this.searchValue,
          pageNum: 1,
          pageSize: this.pagesize
        }
        if(this.searchValue == ''){
          this.getList();
          return
        }
      skillSearch(encode(info)).then(res=>{
        this.total = decode(res).total
        this.prodList = decode(res).records
        this.queryParams.pageSize = decode(res).size;
        this.queryParams.pageNum = decode(res).current;
        if(this.prodList.length > 0){
          this.prodList2 = this.prodList
          let unitArr = []
          this.prodList.map(item => {
            unitArr.push(item.cunit)
          })
          unitArr = Array.from(new Set(unitArr))
          this.serveUnitList = unitArr
          this.noData = false
        }else {
          this.noData = true
        }
      })
      this.sel('')
    },
    getTime(time) {
      let date = new Date(time)
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (parseInt(month) < 10) {
        month = '0' + month
      }
      if (parseInt(day) < 10) {
        day = '0' + day
      }
      let times = year + '年' + month + '月' + day + '日';
      return times
    },
    sel(name,type) {
      let sClassification = name
      let par = {
        sClassification: '',
        sort: sClassification,
        sType: '',
        cUnit: this.serveUnit,
        sName: this.searchValue,
        pageNum: 1,
        pageSize: this.pagesize
      }
      if(type) {
        this.type = type
      }
      this.selType = sClassification
      this.getListApi(par);
         document.getElementsByClassName('col_boxs').forEach(item => {
          item.style = ''
          if(item.innerHTML == name) {
            item.style = 'font-weight:bold'
          }
         })
    },
    //新增热点搜索
    addHot(name,url){
      let form = {
        keyName: '技术服务-'+name,
        url: url,
        linkUnit: ''
      }
      hotDataAdd(encode(form)).then()
    },
    expands() {
      if(this.tiggle == '展开'){
        this.showExpand = true
        this.expand = 'el-icon-arrow-up'
        this.tiggle = '缩起'
      }else {
        this.showExpand = false
        this.expand = 'el-icon-arrow-down'
        this.tiggle = '展开'
      }
    },
    toInfo(item) {
      sessionStorage.setItem('datas',JSON.stringify(item));
      this.addHot(item.sname,'/monitor/refuge')
      if(this.selType != ''){
        this.$router.push({name: 'monitorRefuge', params: {type: this.selType}})
      }else{
        this.$router.push({name: 'monitorRefuge'})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.refuge {
  position: relative;
  top: 3px;
  width: 100%;
  // padding: 0px 400px;
  background-color: rgb(245, 245, 245);
  .topNav {
    position: absolute;
    top: 25px;
    left: 25px;
    background-color: #fff;
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
  }
  .asideBtn {
      position: absolute;
      top: 330px;
      left: 160px;
      .icon {
        font-size: 20px;
        margin-right: 5px;
      }
      .active {
        background-color: #1492ff !important;
        color: #fff;
      }
    }

  .main {
    width: 100%;
    min-height: 800px;
    background: url('../../assets/images/detailBk.jpg') no-repeat;
    background-size: 100% 300px;
    padding: 150px 90px;
    display: flex;
    justify-content: center;
    .total {
      color: #757575;
      display: flex;
    }
    .pages {
      width: 100%;
      display: flex;
      margin-top: 30px;
      margin-left: -80px;
      // flex: 25;
      justify-content: center;
    }
    .table {
      width: 100%;
      display: flex;
      justify-content: center;
      .right_box {
        width: 75%;
        min-width: 1000px;
      }
      .box_shxu {
        font-family: Avenir,Helvetica,Arial,sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #2c3e50;
        -webkit-box-direction: normal;
        display: flex;
        -webkit-box-pack: justify;
        justify-content: space-between;
        height: 60px;
        background-color: #fff;
        padding: 7px 5px;
        margin-top: 15px;
        border-bottom: 1px solid #e9e9e9;
        .tree_list_name {
          width: 900px;
          padding: 0px 15px;
        }
      }
      .name_table {
        font-family: Avenir,Helvetica,Arial,sans-serif;
        -webkit-font-smoothing: antialiased;
        -webkit-box-direction: normal;
        width: 120px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #5a8bfe;
        font-size: 15px;
        border-radius: 0px 0px 0px 10px;
      }
      .serveAll {
        display: flex;
        flex-wrap: wrap;
      }
      .col_boxs {
          font-family: Avenir,Helvetica,Arial,sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #2c3e50;
          -webkit-box-direction: normal;
          width: auto;
          height: 26px;
          float: left;
          margin-right: 30px;
          text-align: center;
          line-height: 26px;
          padding: 0 12px;
          margin-top: 12px;
          cursor: pointer;
          font-size: 15px;
        }
        .col_boxs:hover {
          font-weight: bold !important;
        }
        .col_box {
        border-radius: 15px;
        color: #5a8bfe;
      }
      .no-data {
        font-size: 18px;
        color: #515151;
        text-align: center;
        padding: 50px 0px;
      }
      .hovmul {
        font-family: Avenir,Helvetica,Arial,sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #2c3e50;
        -webkit-box-direction: normal;
        transition: box-shadow .5s,-webkit-box-shadow .5s;
        margin-bottom: 5px;
        background-color: rgb(255, 255, 255);
        padding: 10px 10px 10px;
        font-size: 14px;
      }
    }
  }
}
</style>
