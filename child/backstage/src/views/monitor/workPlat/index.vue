<template>
  <div v-if="isAth" class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px;">
      <!-- <line-chart :chart-data="lineChartData" /> -->
      <bar-chart :xData="barxList" :yData="baryList"  />
    </el-row>

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8"> -->
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick"> -->
          <el-radio-group v-model="dataSel">
            <el-radio-button v-for="item in cataList" :key="item.typeId"  :label="item.typeName">
              <span @mouseenter="selType(item)" style="font-size:16px">{{ item.typeName }}</span>
            </el-radio-button>
          </el-radio-group>
          <div style="background-color:#fff;padding:15px;min-height: 80px;width: 70%;flex-wrap: wrap;margin: 3px 0px 10px 0px;display: flex;">
            <div style="cursor:pointer" :id="item.id" v-for="item in allList" :key="item.id">
              <span style="padding: 3px 10px;" @click="handleClick(item.sname)">{{ item.sname }}</span>
            </div>
          </div>
          <!-- <el-tab-pane v-for="item in catalist" :key="item.id" :label="item.sname" :name="item.sname"></el-tab-pane> -->
          <div class="tab">
              <div class="chart-wrapper">
                <pie-chart :pieData="pielist"/>
                <div style="margin-top: -50px;text-align:center">月份</div>
              </div>
              <div class="chart-wrapper">
                <pie-chart :pieData="pielist2"/>
                <div style="margin-top: -50px;text-align:center">季度</div>
              </div>
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
import { getSubAll, getCountByQuarter, getListPage, getTypeDic } from "@/api/workflow/count";
import PanelGroup from '../../dashboard/PanelGroup'
import LineChart from '../../dashboard/LineChart'
import RaddarChart from '../../dashboard/RaddarChart'
import PieChart from '../../dashboard/PieChart'
import BarChart from '../../dashboard/BarChart'
import { getCount } from "@/api/workflow/selsmometry"
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
      pielist:[],
      pielist2: [],
      catalist: [],
      pietype: '',
      //柱状图x
      barxList:[],
      //柱状图y
      baryList:[],
      dataSel: '观测数据',
      allList: []
    }
  },
  created() {
    console.log(this.$store.state)
    if(this.$store.state.user.permissions.includes('workPlat') || this.$store.state.user.permissions[0] == '*:*:*'){
      this.isAth = true
    }else{
      this.isAth = false
    }
    this.getCataList()
    this.getbarData()
  },
  mounted(){
    window.addEventListener("message", this.handleClickMessage);
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    handleClick(e) {
      this.allList.forEach(item=>{
        if(item.sname == e){
          this.selCata(item,1)  //  月份
          this.selCata(item,2)  //  季度
        }
      })
    },
    handleClickMessage(event) {
      if (event.data.type != "webpackOk") {
        const data = event.data.data;
        setToken(data)
      }
    },
    getbarData() {
      let par = '2008'
      this.barxList = []
      this.baryList = []
      getCount('date='+par).then(res=>{
        res.forEach(item=>{
          this.barxList.push(item.distributeUnit)
          this.baryList.push(item.count)
        })
      })
    },
    selType(item) {
      this.dataSel=item.typeName
      let p = 'pageNum=1&pageSize=999&typeName='+item.typeName
      getListPage(p).then(resp=>{
        this.allList = [...resp.records]
        this.handleClick(this.allList[0].sname)
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
        // if(this.pietype == '季度'){
        //   date = this.yearVal2 + '-' + this.several
        // }
        par = 'date='+date+'&disciplineKey='+item.sname+'&type='+this.pietype
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
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
    width: 300px;
  }
}
</style>
