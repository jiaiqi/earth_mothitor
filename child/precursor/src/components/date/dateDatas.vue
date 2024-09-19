<template>
  <div class="date">
    <div>
      <!-- <el-button v-if="showCartBtn" class="cart" type="danger" size="mini"
            >加入收藏车</el-button
          > -->
      <div class="header">
        <el-tabs v-model="selType" type="card" @tab-click="changeDate">
          <el-tab-pane label="年份" name="year">
            <el-table
              id="tableShow"
              :data="yearList"
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
                prop="year"
                label="年"
                align="center"
                sortable
                width="120"
              >
              </el-table-column>
              <el-table-column prop="dataStat" label="完整性" align="center">
                <template slot-scope="scope">
                  <!-- <el-progress
                    v-if="scope.row.day"
                    :percentage="
                      Math.floor(
                        (scope.row.children.length / scope.row.day) * 100
                      )
                    "
                  ></el-progress> -->
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
              <el-table-column prop="dataStat" label="完整性" align="center">
                <template slot-scope="scope">
                  <!-- <el-progress
                    v-if="scope.row.day"
                    :percentage="
                      Math.floor(
                        (scope.row.children.length / scope.row.day) * 100
                      )
                    "
                  ></el-progress> -->
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
              height="390"
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
        </el-tabs>
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
    }
  },
  components: {},
  props: {
    days:{
      type:Array,
      default: () => {
        return []
      }
    }
  },
  created() {

  },
  mounted() {
    this.getYearList()
    this.getMonthList()
  },
  watch: {
    days() {
      this.getYearList()
      this.getMonthList()
    }
  },
  methods: {
    // 多选框选中
    handleSelectionChange(val) {
      if (val.length === 0) {
        this.showCartBtn = false
      } else {
        this.addCartList = val
      this.$emit('addCartItem',this.addCartList)
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
      let temp = {
        year: '',
        num: 1
      }
      this.yearList = []
      let yearlist = []
      this.days.forEach((item) => {
        if (!yearlist.includes(item.dataDate.split('-')[0])) {
          yearlist.push(item.dataDate.split('-')[0])
          temp = {
            year: item.dataDate.split('-')[0],
            num: 1,
            yearDays: 365
          }
          temp.yearDays = this.getYearDays(item.dataDate.split('-')[0])
          this.yearList.push(temp)
        }else {
          this.yearList.forEach((itm) => {
            if (item.dataDate.split('-')[0] == itm.year) {
              itm.num++;
            }
          })
        }
      });
    },
    getMonthList() {
      let temp = {
        month: '',
        num: 1
      }
      this.monthList = []
      let monthlist = []
      this.days.forEach((item) => {
        if (!monthlist.includes(item.dataDate.split('-')[0]+'-'+item.dataDate.split('-')[1])) {
          monthlist.push(item.dataDate.split('-')[0]+'-'+item.dataDate.split('-')[1])
          temp = {
            month: item.dataDate.split('-')[0]+'-'+item.dataDate.split('-')[1],
            num: 1,
            allDay: 30
          }
          temp.allDay = this.getDays(parseInt(item.dataDate.split('-')[0]),parseInt(item.dataDate.split('-')[1]))
          this.monthList.push(temp)
        }else {
          this.monthList.forEach((itm) => {
            if (item.dataDate.split('-')[0]+'-'+item.dataDate.split('-')[1] == itm.month && parseInt(itm.num) < parseInt(temp.allDay)) {
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
  .header {
    width: 100%;
    padding-top: 5px;
    // display: flex;
    // justify-content: center;
  }
}
</style>
