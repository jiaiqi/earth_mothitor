<template>
  <div v-if="isAth" class="dashboard-editor-container">
    <!-- <div v-if="showIfr" class="iframe">
      <iframe :src="previewUrl" width="1000" height="700"></iframe>
      <i class="el-icon-error"></i>
    </div> -->
    <div class="prog" v-if="showPer">
      <div class="progress">
        <el-progress :stroke-width="10" type="circle" :percentage="percentage" :status="progStat"></el-progress>
        <div class="importText"><label>文档正在导出中，请稍后...</label></div>
      </div>
    </div>
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <div v-if="hasCountAuth">
      <el-tabs v-model="tabName" type="card" @tab-click="tabChange">
        <el-tab-pane label="数据目录" name="cata">
          <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px;">
            <el-select
              v-model="selYear"
              style="width: 160px;margin: 15px 0px;"
              placeholder="请选择年份"
              @change="changeYear"
              size="mini"
            >
              <el-option v-for="item in yearList" :key="item" :label="`${item}年`" :value="item" />
            </el-select>
            <el-select
              v-model="selMon"
              style="width: 120px;margin: 15px 5px;"
              placeholder="请选择月份"
              clearable
              @change="changeMonth"
              size="mini"
            >
              <el-option v-for="item in monList" :key="item" :label="`${item}月`" :value="item" />
            </el-select>
            <!-- <line-chart :chart-data="lineChartData" /> -->
            <bar-chart v-if="tabName == 'cata'" :xData="barxList" :yData="baryList" :isMonth="selMon==''" :height="'420px'" />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="其他统计" name="other">
          <div>
            <div class="selType">请选择学科类型：
              <el-radio-group v-model="subType" @change="changeSub">
                <el-radio :label="1">产品目录</el-radio>
                <el-radio :label="2">技术服务</el-radio>
                <el-radio :label="3">法规标准</el-radio>
                <el-radio :label="4">地震科普</el-radio>
              </el-radio-group>
            </div>
            <div style="display:flex">
            <div class="selType2" v-if="subType == 1">
              产品类型：
              <el-select v-model="subType2" placeholder="请选择产品类型" size="small" @change="changeProdType">
                <el-option
                  v-for="item in prodOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="selType2">
              审核状态：
              <el-select v-model="statusSel" placeholder="请选择状态" size="small" clearable @change="statusChange">
                <el-option
                  v-for="item in statusOption.slice(0,3)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            </div>
          </div>
          <div>
            <el-row style="background: #fff; padding: 5px 16px 0; margin-bottom: 32px;margin-top: 15px;">
              <el-select
                v-if="subType != 3"
                v-model="yearVal"
                style="width: 180px;margin: 15px 0px;"
                placeholder="请选择年份"
                @change="changeYear"
                size="mini"
              >
                <el-option v-for="item in yearList2" :key="item.label" :label="item.label" :value="item.value" />
              </el-select>
              <el-select
                v-if="subType != 3"
                v-model="selMon"
                style="width: 120px;margin: 15px 5px;"
                placeholder="请选择月份"
                clearable
                @change="changeMonth"
                size="mini"
              >
                <el-option v-for="item in monList" :key="item" :label="`${item}月`" :value="item" />
              </el-select>
              <bar-chart v-if="tabName == 'other' && subType != 3" :xData="barxList" :yData="baryList" :height="'420px'" />
              <pie-chart v-if="tabName == 'other' && subType == 3" :pieData="pieData" :height="'500px'" />
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据目录总数" name="sum">
          <el-table
            :data="subTable"
            show-summary
            style="width: 100%">
            <el-table-column
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              prop="sum"
              sortable
              label="总数目">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    <el-row>
      <el-button style="margin-bottom: 15px" @click="downOut">导出文档</el-button>
    </el-row>
    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8"> -->
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick"> -->
          <!-- <el-radio-group v-model="dataSel">
            <el-radio-button v-for="item in cataList" :key="item.typeId"  :label="item.typeName">
              <span @mouseenter="selType(item)" style="font-size:16px">{{ item.typeName }}</span>
            </el-radio-button>
          </el-radio-group>
          <div style="background-color:#fff;padding:15px;min-height: 80px;width: 70%;flex-wrap: wrap;margin: 3px 0px 10px 0px;display: flex;">
            <div style="cursor:pointer" :id="item.id" v-for="item in allList" :key="item.id">
              <span :id="item.id" style="padding: 3px 10px;cursor: pointer;" @click="handleClick(item)">{{ item.sname }}</span>
            </div>
          </div>
          <div class="tab">
            <div class="chart-wrapper">
              <pie-chart :pieData="pielist"/>
              <div style="margin-top: -50px;text-align:center">月份</div>
            </div>
            <div class="chart-wrapper">
              <pie-chart :pieData="pielist2"/>
              <div style="margin-top: -50px;text-align:center">季度</div>
            </div>
          </div> -->
        </div>
        <!-- </el-tabs> -->
      <!-- </el-col> -->
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col> -->
    <!-- </el-row>
    -->
  </div>
  <div style="text-align: center;padding: 50px 0px" v-else>
    暂无访问权限
  </div>
</template>

<script>
import { setToken } from '@/utils/auth'
import { encode, decode } from '@/utils/base/dataEncry.js';
import { listUser } from "@/api/system/user"
import { getSubAll, getCountByQuarter, getListPage, getTypeDic, getCount, getStrongNumber,getCataDataNumber,
  getPreDataNumber, getLevelDataNumber,getDataNumber, getGNSSDataNumber,getUpderFluidNumber, } from "@/api/workflow/count";
import { ufProdCount, catalogProdCount, gnssProdCount, prodServeCount, ufCountData, levelCountData, catalogCountData, gnssCountData } from "@/api/workflow/prods"
import { knowledgeCount } from "@/api/workflow/knowledge"
import { inGetDataNumber } from '@/api/dataup/special'
import { lawCount, standardCount } from "@/api/dataup/criterion"
import { unitWordTable } from "@/api/dataup/criterion";
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    userNumData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    userNumData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    userNumData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    userNumData: [120, 82, 91, 154, 162, 140, 130]
  },
}
// window.addEventListener("message", handleClickMessage());
// function handleClickMessage() {
//   console.log(2131231323)
// }
export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      activeName: '',
      isAth: true,
      selYear: new Date().getFullYear(),
      selMon: '',
      tabName: 'cata',
      yearVal: '',
      yearList: [],
      monList: [],
      yearList2: [],
      monList2: [],
      pielist:[],
      pielist2: [],
      catalist: [],
      pietype: '',
      //进度条
      percentage: 0,
      //柱状图x
      barxList:[],
      //柱状图y
      baryList:[],
      dataSel: '观测数据',
      allList: [],
      hasCountAuth: true,
      showIfr: false,
      progStat: '',
      timer: null,
      timer2: null,
      timer3: null,
      showPer: false,
      subType: 1,
      subType2: '',
      statusSel: '',
      pieData: [],  //法规
      userlist: [],
      subTable: [],
      statusOption: [
        {
          value: 0,
          label: '未提交'
        },
        {
          value: 1,
          label: '提交审核',
        },
        {
          value: 99,
          label: '审核完成'
        },
        {
          value: 100,
          label: '已分发'
        },
      ],
      prodOption: [
        {
          value: '地下流体',
          label: '地下流体'
        },
        {
          value: 'GNSS',
          label: 'GNSS'
        },
        {
          value: 'InSAR',
          label: 'InSAR'
        },
        {
          value: '地震区划图',
          label: '地震构造图'
        },
        {
          value: '地震活动断层',
          label: '地震活动断层'
        },
        {
          value: '工程抗震',
          label: '工程抗震'
        },
        {
          value: '地磁、地电、重力、定点形变',
          label: '地磁、地电、重力、定点形变'
        },
        {
          value: '地倾斜、地应变',
          label: '地倾斜、地应变'
        }
      ],
    }
  },
  created() {
    // console.log(this.$store.state)
    if(this.$store.state.user.permissions.includes('workPlat') || this.$store.state.user.permissions[0] == '*:*:*'){
      this.isAth = true
      if(this.$store.state.user.permissions.includes('workPlat:count') || this.$store.state.user.permissions[0] == '*:*:*'){
        this.hasCountAuth = true
      }else{
        this.hasCountAuth = false
      }
    }else{
      this.isAth = false
    }
    this.getCataList()
    this.getbarData()
    this.getAllYear()
    this.getOrderStatusList()
    this.getProdList()
  },
  mounted(){
    // window.addEventListener("message", this.handleClickMessage);
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    //清空所有点击过的样式
    clearStyle() {
      this.allList.forEach(item=>{
       let temp=  document.getElementById(item.id);
       if(temp){
          temp.style = ""
       }
      })
    },
    getAllSubjects() {
      let p = 'pageNum=1&pageSize=999'
      getListPage(p).then(resp=>{
        let arr = JSON.stringify([...resp.records])
        sessionStorage.setItem('subjectArr',arr)
      })
    },
    getOrderStatusList() {
      this.$store
      .dispatch('groupByStatus', this.loginForm)
      .then(() => {
        
      })
    },
    changeSub(e) {
        if(e == 1){
          this.barxList = []
          this.baryList = []
          let par = {year: this.yearVal,month: this.selMon,auditState: this.statusSel}
          if(this.selMon == ''){
            delete(par.month)
          }
          if(this.statusSel.length == 0){
            delete(par.auditState)
          }
          ufProdCount(encode(par)).then(res=>{
            res.map((item)=>{
              if(item.send_unit){
                this.barxList.push(item.send_unit)
                this.baryList.push(item.count)
              }
            })
          })
          this.statusOption = [
              {
                value: 0,
                label: '未提交'
              },
              {
                value: 1,
                label: '提交审核',
              },
              {
                value: 99,
                label: '审核完成'
              },
              {
                value: 100,
                label: '已分发'
              },
            ]
        }
        if(e == 2){
          this.barxList = []
          this.baryList = []
          let par = {year: this.yearVal,month: this.selMon,auditState: this.statusSel}
          if(this.selMon == ''){
            delete(par.month)
          }
          if(this.statusSel.length == 0){
            delete(par.auditState)
          }
          prodServeCount(encode(par)).then(res=>{
            res.map((item)=>{
              this.barxList.push(item.c_unit)
              this.baryList.push(item.count)
            })
          })
          this.statusOption = [
            {
              value: 0,
              label: '提交审核'
            },
            {
              value: 1,
              label: '审核完成',
            }]
        }
        if(e == 3){
          this.pieData = []
          let par = ''
          if(this.statusSel.length == 0){
            par = ''
          }else{
            par = 'auditState=' + this.statusSel
          }
          lawCount(par).then(res=>{
            this.pieData.push({ value: res, name: '法规数据总数' })
          })
          standardCount(par).then(res=>{
            this.pieData.push({ value: res, name: '标准数据总数' })
          })
          this.statusOption = [
            {
              value: 0,
              label: '提交审核'
            },
            {
              value: 1,
              label: '审核完成',
            }]
        }
        if(e == 4){
          this.barxList = []
          this.baryList = []
          let par = {year: this.yearVal,month: this.selMon, auditState: this.statusSel}
          if(this.selMon == ''){
            delete(par.month)
          }
          if(this.statusSel.length == 0){
            delete(par.auditState)
          }
          knowledgeCount(encode(par)).then(res=>{
            let deptName = ''
            res.map((item)=>{
              this.userlist.map(itm=>{
                if(item.uploader == itm.userName && itm.dept.deptName){
                  deptName = itm.dept.deptName
                }
              })
              this.barxList.push(deptName)
              this.baryList.push(item.count)
            })
          })
          this.statusOption = [
            {
              value: 0,
              label: '提交审核'
            },
            {
              value: 1,
              label: '审核完成',
            }]
        }
      },
    changeProdType() {
        //地下流体
        if(this.subType2 == this.prodOption[0].value) {
          this.changeSub(1)
        }
        //GNSS、区划图、活断层等
        if(this.subType2 == this.prodOption[1].value || this.subType2 == this.prodOption[2].value ||
        this.subType2 == this.prodOption[3].value || this.subType2 == this.prodOption[4].value || 
        this.subType2 == this.prodOption[5].value) {
          this.gnssCount()
        }
        //地磁地电定点形变等
        if(this.subType2 == this.prodOption[6].value || this.subType2 == this.prodOption[7].value) {
          this.getCatalogCount()
        }
      },
      statusChange() {
        if(this.subType == 1){
          this.changeProdType()
        }
        if(this.subType == 2){
          this.changeSub(2)
        }
        if(this.subType == 3){
          this.changeSub(3)
        }
        if(this.subType == 4){
          this.changeSub(4)
        }
      },
    downOut() {
      if(this.showPer){
        return
      }
      this.percentage = 0
      this.showPer = true
      const self = this
      this.timer = setInterval(() => {
        if(self.percentage <= 25){
          self.percentage = self.percentage + 5
        }else{
          clearInterval(self.timer)
          self.timer2 = setInterval(() => {
            if(self.percentage < 67 && self.percentage >= 25){
              self.percentage = self.percentage + 8
            }else{
              clearInterval(self.timer2)
              self.timer3 = setInterval(() => {
                if(self.percentage < 100 && self.percentage >= 67){
                  if(self.percentage + 4 >= 100){
                    self.percentage = 100
                    setTimeout(() => {
                      self.showPer = false
                    }, 2500);
                    clearInterval(self.timer3)
                  }else{
                    self.percentage = self.percentage + 6
                  }
                }else{
                  clearInterval(self.timer2)
                }
              }, 900);
            }
          }, 1200);
        }
      }, 700);
      
      
      unitWordTable()
        .then((res) => {
          // let url = process.env.VUE_APP_CRIT_API + '/fileservice/ecdownload'
          let blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
          let blobURL = URL.createObjectURL(blob)
          this.showPer = false
          window.open(blobURL)
          // this.previewUrl = blobURL + '#toolbar=0'
          // this.showIfr = true
        })
        .catch((ree) => {})
    },
    //获取用户列表
    getUserList() {
        listUser({pageNum:1,pageSize: 9999}).then(res=>{
          this.userlist = [...res.rows]
        })
      },
    handleClick(e) {
      setTimeout(() => {
        this.clearStyle()
        let temp=  document.getElementById(e.id);
       if(temp){
          temp.style = 'font-weight:bold'
       }
       
      }, 350);
      this.selCata(e,1)  //  月份
      this.selCata(e,2)  //  季度
    },
    // handleClickMessage(event) {
    //   if (event.data.type != "webpackOk") {
    //     const data = event.data.data;
    //     setToken(data)
    //   }
    // },
    changeYear(year) {
        if(this.subType == 1 && this.subType2 == '地下流体'){
          this.changeSub(1)
          return
        }
        //GNSS、区划图、活断层等
        if(this.subType == 1 && (this.subType2 == this.prodOption[1].value || this.subType2 == this.prodOption[2].value ||
        this.subType2 == this.prodOption[3].value || this.subType2 == this.prodOption[4].value || 
        this.subType2 == this.prodOption[5].value)) {
          this.gnssCount()
          return
        }
        //地磁地电定点形变等
        if(this.subType == 1 && (this.subType2 == this.prodOption[6].value || this.subType2 == this.prodOption[7].value)) {
          this.getCatalogCount()
          return
        }
        if(this.subType == 2){
          this.changeSub(2)
          return
        }
        if(this.subType == 4){
          this.changeSub(4)
          return
        }
        this.yearVal = year
        this.getbarData()
      },
      getProdList(type) {
        let sums = 0
        getDataNumber({}).then(res=>{
          if(typeof res == 'number'){
            this.subTable.push({
              name: '数据目录-测震',
              sum: res
            })
            sums += res
          }
        })
        getGNSSDataNumber({}).then(res=>{
          if(typeof res == 'number'){
            this.subTable.push({
              name: '数据目录-GNSS',
              sum: res
            })
            sums += res
          }
        })
        getUpderFluidNumber({}).then(res=>{
          if(typeof res == 'number'){
            this.subTable.push({
              name: '数据目录-地下流体',
              sum: res
            })
            sums += res
          }
        })
        getStrongNumber({}).then(res=>{
          if(typeof res == 'number'){
            this.subTable.push({
              name: '数据目录-强震动',
              sum: res
            })
            sums += res
          }
        })
        getCataDataNumber({}).then(res=>{
          if(typeof res == 'number'){
            this.subTable.push({
              name: '数据目录-科学台阵',
              sum: res
            })
            sums += res
          }
        })
        getPreDataNumber({}).then(res=>{
          if(typeof res == 'number'){
            this.subTable.push({
              name: '数据目录-地球物理',
              sum: res
            })
            sums += res
          }
        })
        getLevelDataNumber({}).then(res=>{
          if(!(res.code && res.code===500)){

            this.subTable.push({
              name: '数据目录-水准',
              sum: decode(res)
            })
            sums += decode(res)
          }
        })
        ufCountData({}).then(res=>{
          setTimeout(() => {
            this.subTable.push({
              name: '产品-地下流体',
              sum: res
            })
            sums += res
          },200)
        })
        levelCountData({}).then(res=>{
          setTimeout(() => {
            this.subTable.push({
              name: '产品-跨断层水准',
              sum: res
            })
            sums += res
          },200)
        })
        catalogCountData({}).then(res=>{
          setTimeout(() => {
            this.subTable.push({
              name: '产品-地磁、地电、定点形变、重力',
              sum: res
            })
            sums += res
          }, 200);
        })
        inGetDataNumber().then(res=>{
            this.subTable.push({
                name: '地震信息',
                sum: res
              })
              sums += res
          })
        gnssCountData({}).then(res=>{
          setTimeout(() => {
            this.subTable.push({
              name: '产品-GNSS、InSAR、地震区划图、地震构造图、地震活断层、工程抗震',
              sum: res
            })
            sums += res
          }, 200);
          setTimeout(() => {
            sessionStorage.setItem('allNum',sums)
          }, 300);
          setTimeout(() => {
            this.subTable.push({
              name: '技术服务',
              sum: sessionStorage.getItem('ser')
            })
            this.subTable.push({
              name: '法规标准',
              sum: sessionStorage.getItem('lawstand')
            })
            this.subTable.push({
              name: '科普目录',
              sum: sessionStorage.getItem('know')
            })
          }, 900);
        })

    },
    changeMonth(mon) {
        if(this.subType == 1 && this.subType2 == '地下流体'){
          this.changeSub(1)
          return
        }
        //GNSS、区划图、活断层等
        if(this.subType == 1 && (this.subType2 == this.prodOption[1].value || this.subType2 == this.prodOption[2].value ||
        this.subType2 == this.prodOption[3].value || this.subType2 == this.prodOption[4].value || 
        this.subType2 == this.prodOption[5].value)) {
          this.gnssCount()
          return
        }
        //地磁地电定点形变等
        if(this.subType == 1 && (this.subType2 == this.prodOption[6].value || this.subType2 == this.prodOption[7].value)) {
          this.getCatalogCount()
          return
        }
        if(this.subType == 2){
          this.changeSub(2)
          return
        }
        if(this.subType == 4){
          this.changeSub(4)
          return
        }
        this.selMon = mon
        this.getbarData()
      },
    getAllYear() {
      this.yearList = []
      this.monList = []
      for(let i=2005;i<=new Date().getFullYear();i++){
        this.yearList.push(i)
        this.yearList2.push({
          label: i+'年',
          value: i
        })
      }
      for(let i=1;i<=12;i++){
        if(i<10){
          this.monList.push('0'+i)
          this.monList2.push({
            label: '0'+i+'月',
            value: '0'+i
          })
        }else{
          this.monList.push(i.toString())
          this.monList2.push({
            label: i+'月',
            value: i
          })
        }
        
      }
    },
    getbarData() {
      let par = this.selYear
      this.barxList = []
      this.baryList = []
      if(this.selMon != ''){
        par += '-'+this.selMon
      }
      getCount('year='+par).then(res=>{
        res.map((ite,index)=>{
          res[index].forEach(item=>{
            if(item.distributeUnit){
              this.barxList.push(item.distributeUnit)
              this.baryList.push(item.count)
            }
          })
        })
      })
    },
    //地磁地电定点形变统计
    getCatalogCount() {
        this.barxList = []
        this.baryList = []
        let par = {year: this.yearVal,month: this.selMon,auditState: this.statusSel}
          if(this.selMon == ''){
            delete(par.month)
          }
          if(this.statusSel.length == 0){
            delete(par.auditState)
          }
        catalogProdCount(encode(par)).then(res=>{
          res.map((item)=>{
            this.barxList.push(item.distribution_unit)
            this.baryList.push(item.count)
          })
        })
      },
    //gnss产品统计
    gnssCount() {
        this.barxList = []
        this.baryList = []
        let par = {year: this.yearVal,month: this.selMon,auditState: this.statusSel}
          if(this.selMon == ''){
            delete(par.month)
          }
          if(this.statusSel.length == 0){
            delete(par.auditState)
          }
        gnssProdCount(encode(par)).then(res=>{
          res.map((item)=>{
            this.barxList.push(item.send_unit)
            this.baryList.push(item.count)
          })
        })
      },
    //统计选项卡切换
    tabChange(e) {
      this.subTable = []
      if(this.tabName == 'other'){
        this.getUserList()
        this.selMon = ''
        this.yearVal = new Date().getFullYear().toString()
        this.subType2 = '地下流体'
        this.changeSub(1)
      }
      if(this.tabName == 'cata'){
        this.yearVal = new Date().getFullYear().toString()
        this.getbarData()
      }
      if(this.tabName == 'sum'){
        this.getProdList()
      }
    },
    selType(item) {
      this.dataSel=item.typeName
      let p = 'pageNum=1&pageSize=999&typeName='+item.typeName
      getListPage(p).then(resp=>{
        this.allList = [...resp.records]
        this.handleClick(this.allList[0])
      })
    },
    selCata(item,index) {
      let par = ''
        // let date = new Date().getFullYear()
        let date = '2018-01'
        if(index == 1){
          this.pietype = '月份'
        }else{
          this.pietype = '季度'
        }
        if(item.sname == '地下流体'){
          date = '2022-02'
        }
        let name = item.sname
        if(name == '强震动'){
          name = '强震'
        }
        // if(this.pietype == '季度'){
        //   date = this.yearVal2 + '-' + this.several
        // }
        par = 'date='+date+'&disciplineKey='+name+'&type='+this.pietype
        getCountByQuarter(par).then(res=>{
          let data = res
          data = res.map(itm=>{
            if(itm.length != 0){
              return {
                name: itm[0].distributeUnit,
                value: itm[0].count
              }
            }
          })
          if(index == 1){
            this.pielist = data
          }else{
            this.pielist2 = data
          }
        })
    },
    /** 查询学科类型列表 */
    getCataList() {
      let par = 'pageNum=1&pageSize=999'
      getTypeDic(par).then(res=>{
        this.cataList = [...res.records]
        this.selType(this.cataList[0])
        setTimeout(() => {
          this.getAllSubjects()
        }, 300);
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 20px 0px;
    margin-bottom: 32px;
    width: 300px;
  }
}
.tab {
  display: flex;
  width: 100%;
}
.prog{
  width:100%;
  display:flex;
  justify-content:center;
  position: absolute;
  top:30%;
  .progress {
    width: 60%;
    height: 370px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 80px;
    background-color: rgba(222, 222, 222, 0.8);
    border-radius: 15px;
  z-index:999;
    .importText {
      width: 100%;
      text-align: center;
      padding: 20px 0px;
    }
  }
}
.selType {
  font-size: 18px;
  padding: 15px 10px;
}
.selType2 {
  padding: 0px 10px;
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
    width: 300px;
  }
}
</style>
