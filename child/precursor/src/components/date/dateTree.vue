<template>
  <div class="date">
    <div>
      <!-- <el-button v-if="showCartBtn" class="cart" type="danger" size="mini" @click="addCart">加入购物车</el-button> -->
      <div class="header">
        <el-button v-show="!showTree" style="margin: 5px 0px;" type="info" plain size="mini" @click="showTree = true">返回</el-button>
        <el-tree
          v-show="showTree"
          ref="tree"
          :props="props"
          :load="loadNode"
          @node-click="nodeClick"
          @check-change="handleCheckChange"
          lazy
          show-checkbox>
        </el-tree>
        <el-table
          v-show="!showTree"
          id="tableShow"
          :data="dayList"
          row-key="id"
          border
          style="width: 280px;"
          size="small"
          height="340"
          @selection-change="handleSelectionChange"
          stripe
          accordion
        >
          <el-table-column type="selection" width="40" />
          <el-table-column
            prop="dataDate"
            label="创建日期"
            align="center"
            sortable
            width="120"
          >
          </el-table-column>
          <el-table-column prop="dataStat" label="通道数据" align="center">
            <template slot-scope="scope">
              <el-progress
                v-if="scope.row.day"
                :percentage="
                  Math.floor(
                    (scope.row.children.length / scope.row.day) * 100
                  )
                "
              ></el-progress>
              <el-tag type="success"> 数据完整 </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-tabs v-model="selType" type="card" @tab-click="changeDate">
          <el-tab-pane label="年份" name="year">
            <el-table
              id="tableShow"
              :data="yearList"
              row-key="id"
              border
              style="width: 280px;"
              @selection-change="handleSelectionChange"
              size="small"
              height="340"
              stripe
              accordion
            >
            <el-table-column type="selection" width="40" />
              <el-table-column
                prop="year"
                label="年"
                align="center"
                sortable
                width="120"
              >
              </el-table-column>
              <el-table-column prop="dataStat" label="通道数据" align="center">
                <template slot-scope="scope">
                  <el-tag type="success"> {{ scope.row.num }}/{{ scope.row.yearDays }} </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="月份" name="month">
            <el-table
              id="tableShow"
              :data="monthList"
              row-key="id"
              border
              style="width: 280px;"
              size="small"
              height="340"
              @selection-change="handleSelectionChange"
              stripe
              accordion
            >
              <el-table-column type="selection" width="40" />
              <el-table-column
                prop="month"
                label="月"
                align="center"
                sortable
                width="120"
              >
              </el-table-column>
              <el-table-column prop="dataStat" label="通道数据" align="center">
                <template slot-scope="scope">
                  <el-tag type="success">{{ scope.row.num }}/{{ scope.row.allDay }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="日期" name="date">
            <el-table
              id="tableShow"
              :data="days"
              row-key="id"
              border
              style="width: 280px;"
              size="small"
              height="340"
              @selection-change="handleSelectionChange"
              stripe
              accordion
            >
              <el-table-column type="selection" width="40" />
              <el-table-column
                prop="dataDate"
                label="创建日期"
                align="center"
                sortable
                width="120"
              >
              </el-table-column>
              <el-table-column prop="dataStat" label="通道数据" align="center">
                <template slot-scope="scope">
                  <el-progress
                    v-if="scope.row.day"
                    :percentage="
                      Math.floor(
                        (scope.row.children.length / scope.row.day) * 100
                      )
                    "
                  ></el-progress>
                  <el-tag type="success"> 数据完整 </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs> -->
      </div>
    </div>
    <!-- <a-calendar v-model="value" @panelChange="onPanelChange" /> -->
    <!-- 日 -->
    <!-- <el-calendar v-model="value" id="calenda"> -->
      <!-- <template slot="dateCell" slot-scope="{ data }"> -->
        <!-- <div class="calendar-day" v-if="!days.includes(data)"> -->
          <!-- 日期 -->
          <!-- {{ data.day.split("-").slice(2).join("-") }} -->
        <!-- </div> -->
        <!--自定义内容-->
        <!-- <div class="calendar-day bg" v-else> -->
          <!-- 日期 -->
          <!-- {{ data.day.split("-").slice(2).join("-") }} -->
        <!-- </div> -->
        
        <!-- 添加数据 -->
        <!-- <div v-for="(item, index) in scheduleData" :key="index">

          <div
            v-if="item.months.indexOf(data.day.split('-').slice(1)[0]) != -1"
          >

            <div
              v-if="
                item.days.indexOf(data.day.split('-').slice(2).join('-')) != -1
              "
            >

            </div>
          </div>
        </div> -->
      <!-- </template> -->
    <!-- </el-calendar> -->
  </div>
</template>

<script>
import {
  getData
} from '@/api/precursor'
import {
  getGnssData
} from '@/api/gnss'
import {
  hotAdd,
  hotDataAdd
} from '@/api/hots'
import { encode, decode } from '@/utils/dataEncry'
export default {
  data() {
    return {
      value: null,
      selType: 'date',
      tableData:[],
      yearList: [],
      monthList: [],
      addCartList: [],
      showCartBtn: false,
      showTree: true,
      dayList: [],
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
    }
  },
  components: {},
  props: {
    days:{
      type: Number,
      default: () => {
        return 0
      }
    },
    staName:{
      type: String,
      default: () => {
        return ''
      }
    },
    typeName:{
      type: String,
      default: () => {
        return ''
      }
    },
  },
  created() {

  },
  mounted() {
    // this.getYearList()
    // this.getMonthList()
  },
  watch: {
    days() {
      this.getYearList()
      // this.getMonthList()
    }
  },
  methods: {
    handleCheckChange(val) {
      let node = this.$refs.tree.getCheckedNodes()
      this.addCartList = []
      node.map(item=>{
        if (item.name.length === 4) {
          this.addCartList.push({
            classesStandby: item.name+ '年'
          })
        }else{
          this.addCartList.push({
            classesStandby: item.name
          })
        }
      })
      this.$emit('addCartItem',this.addCartList)
    },
    // 多选框选中
    handleSelectionChange(val) {
      if (val.length === 0) {
        this.showCartBtn = false
      } else {
        this.addCartList = val
      this.$emit('addCartItem',this.addCartList)
      }
    },
    nodeClick(node) {
      // console.log(node)
    if(this.typeName == '地下流体'){
      if(node.name.toString().indexOf('-') != -1){
        let date = node.name
        //补0
        if(date.split('-')[1].length <= 1){
          date = date.split('-')[0] + '-'+ '0'+date.split('-')[1]
        }
        // let par = 'staId='+this.days+'&yearDay='+date
          getData(encode({staId: this.days, yearDay: date.toString()})).then(res=>{
            let days = decode(res)
            days.forEach(item=>{
              item.dataDate = new Date(item.dataDate).toLocaleDateString().replaceAll('/','-'),
              item.leaf = true
            })
            this.dayList = days
            this.showTree = false
          })
      }
    }else if(this.typeName == 'GNSS'){
      if(node.name.toString().indexOf('-') != -1){
        let date = node.name
        //补0
        if(date.split('-')[1].length <= 1){
          date = date.split('-')[0] + '-'+ '0'+date.split('-')[1]
        }
          getGnssData(encode({staId: this.days, yearDay: date.toString()})).then(res=>{
            let days = decode(res)
            days.forEach(item=>{
              item.dataDate = new Date(item.dataDate).toLocaleDateString().replaceAll('/','-'),
              item.leaf = true
            })
            this.dayList = days
            this.showTree = false
          })
      }
      }
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{name: '年份',leaf: false}]);
      }

      if(this.typeName == '地下流体'){
      if (node.level === 1) {
          let year = []
          getData(encode({staId: this.days})).then(res=>{
            // console.log(res)
            if(!decode(res)[0]){
              this.$message.error('数据为空')
              return resolve([]);
            }
            this.$emit('getInfo',decode(res)[0])
            decode(res).forEach(item=>{
              year.push(new Date(item.dataDate).getFullYear())
            })
            if(year.length <= 2){
              for(let i=year[0]; i<=year[1]; i++){
                this.yearList.push({name: i,leaf: false})
              }
            }
            return resolve(this.yearList);
          })
      }
      if (node.level === 2) {
          getData(encode({staId: this.days, yearDay:node.data.name.toString()})).then(res=>{
            let days = decode(res)
            days.forEach(item=>{
              item.dataDate = new Date(item.dataDate).toLocaleDateString().replaceAll('/','-')
              item.leaf = true
            })
            this.getMonthList(days)
            return resolve(this.monthList);
          })
      }
      if (node.level === 3) {
        return resolve([]);
      }
      }else if(this.typeName == 'GNSS'){
        if (node.level === 1) {
          let year = []
          getGnssData(encode({staId: this.days})).then(res=>{
            // console.log(res)
            if(!decode(res)[0]){
              this.$message.error('数据为空')
              return resolve([]);
            }
            this.$emit('getInfo',decode(res)[0])
            decode(res).forEach(item=>{
              year.push(new Date(item.dataDate).getFullYear())
            })
            if(year.length <= 2){
              for(let i=year[0]; i<=year[1]; i++){
                this.yearList.push({name: i,leaf: false})
              }
            }
            return resolve(this.yearList);
          })
          let form = {
            keyName: 'GNSS数据-'+this.staName+'数据集',
            url: '/precursor/gnss',
            linkUnit: sessionStorage.getItem('tips')
          }
          hotDataAdd(encode(form)).then()
      }
      if (node.level === 2) {
          getGnssData(encode({staId: this.days, yearDay: node.data.name.toString()})).then(res=>{
            let days = decode(res)
            days.forEach(item=>{
              item.dataDate = new Date(item.dataDate).toLocaleDateString().replaceAll('/','-')
              item.leaf = true
            })
            this.getMonthList(days)
            return resolve(this.monthList);
          })
        }
        if (node.level === 3) {
          return resolve([]);
        }
      }
    },
    getDays(year, month) {
      var d = new Date(year, month, 0);
      return d.getDate();
    },
    getYearDays(year) {
      if(this.getDays(year,2) == 29){
        return 366
      }else {
        return 365
      }
    },
    getYearList() {

      // let temp = {
      //   year: '',
      //   num: 0
      // }
      // this.yearList = []
      // let yearlist = []
      // this.days.forEach((item) => {
      //   if (!yearlist.includes(item.dataDate.split('-')[0])) {
      //     yearlist.push(item.dataDate.split('-')[0])
      //     temp = {
      //       year: item.dataDate.split('-')[0],
      //       num: 0,
      //       yearDays: 365
      //     }
      //     temp.yearDays = this.getYearDays(item.dataDate.split('-')[0])
      //     this.yearList.push(temp)
      //   }else {
      //     this.yearList.forEach((itm) => {
      //       if (item.dataDate.split('-')[0] == itm.year) {
      //         itm.num++;
      //       }
      //     })
      //   }
      // });
    },
    getMonthList(day) {
      let temp = {
        month: '',
        num: 1
      }
      this.monthList = []
      let monthlist = []
      day.forEach((item) => {
        if (!monthlist.includes(item.dataDate.split('-')[0]+'-'+item.dataDate.split('-')[1])) {
          monthlist.push(item.dataDate.split('-')[0]+'-'+item.dataDate.split('-')[1])
          temp = {
            name: item.dataDate.split('-')[0]+'-'+item.dataDate.split('-')[1],
            num: 1,
            allDay: 30
          }
          temp.allDay = this.getDays(parseInt(item.dataDate.split('-')[0]),parseInt(item.dataDate.split('-')[1]))
          this.monthList.push(temp)
        }else {
          this.monthList.forEach((itm) => {
            if (item.dataDate.split('-')[0]+'-'+item.dataDate.split('-')[1] == itm.month) {
              itm.num++;
            }
          })
        }
      });
    },
    changeDate(value, mode) {
      // console.log(value, mode);
    }
  }
}
</script>

<style lang="scss" scoped>
.date {
  width: 100%;
  height: 100%;
  .cart {
    font-size: 10px;
    text-align: center;
    margin-bottom: 2px;
  }
  .header {
    width: 100%;
    height: 400px;
    overflow-y: auto;
    padding-top: 5px;
    // display: flex;
    // justify-content: center;
  }
}
::v-deep .el-tree-node__label {
  font-size: 18px !important;
}
::v-deep .el-tree-node__content {
  height: 35px !important;
}
</style>
