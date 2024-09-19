<template>
  <div class="box">
    <!-- 周 -->
    <div class="week" v-if="type === '周'">
      <div class="arrow0">
        <i class="el-icon-arrow-left" @click="setWeek(currentYear - 1)"></i>
        <span>{{ currentYear }}年</span>
        <i class="el-icon-arrow-right" @click="setWeek(currentYear + 1)"></i>
      </div>
      <!-- 日期 -->
      <ul
        class="days"
        style="
          max-height: 340px;
          overflow-x: hidden;
          overflow-y: scroll;
          cursor: pointer;
          margin-top: 10px;
        "
        @click="gitdayList(day, $event)"
      >
        <li
          v-for="(day, index) in weekDate.weekList"
          :key="index"
          :data-index="index"
        >
          <!--本月-->
          <p :data-index="index">{{ day }}</p>
        </li>
      </ul>
    </div>
    <!-- 周详情 -->
    <div class="calendar" v-else>
      <div class="arrow">
        <small @click="arrow('left')">上一周</small>
        <small @click="goweek">第{{}}周</small>
        <small @click="arrow('right')">下一周</small>
      </div>
      <el-calendar v-model="value" :range="dateRange">
        <template slot="dateCell" slot-scope="{ data }">
          <!--自定义内容-->
          <div class="calendar-day" @click="gitdayList(data.day)">
            <!-- 日期 -->
            {{ data.day.split("-").slice(2).join("-") }}
          </div>
          <!-- 添加数据 -->
          <div v-for="(item, index) in scheduleData" :key="index">
            <!-- 判断月份存在 -->
            <div
              v-if="item.months.indexOf(data.day.split('-').slice(1)[0]) != -1"
            >
              <!-- 判断日期存在 -->
              <div
                v-if="
                  item.days.indexOf(data.day.split('-').slice(2).join('-')) !=
                  -1
                "
              >
                <div
                  class="is-selected"
                  style="color: red"
                  v-if="item.list === '0'"
                >
                  {{ item.list }}
                </div>
                <div class="is-selected" v-if="item.list === '0.5'">
                  {{ item.list }}
                </div>
                <div
                  class="is-selected"
                  style="color: skyblue"
                  v-if="item.list === '1'"
                >
                  {{ item.list }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: '周',
      value: "",
      currentYear: 2022,
      endDate: "",
      dateRange: [],
      dateNum: 0,
      // 存放周数据
      weekDate: {
        weekList: [],
        weekMon: [],
        weekSun: []
      },
      scheduleData: [
        { months: ['08', '11'], days: ['01'], list: '0' },
        { months: ['09', '11'], days: ['15'], list: '0' },
        { months: ['10', '11'], days: ['02'], list: '0.5' },
        { months: ['11'], days: ['02'], list: '1' },
        { months: ['11'], days: ['02'], things: '看月亮', list: '0.5' },
        { months: ['09', '11'], days: ['07'], list: '1', things: '看电影' },
        { months: ['10', '11'], days: ['16'], list: '0.5', things: '去公园野炊' },
        { months: ['11'], days: ['08'], things: '看星星', list: '0' },
        { months: ['11'], days: ['04'], things: '看月亮', list: '0.5' },
        { months: ['11', '08'], days: ['04'], list: '0' },
        { months: ['08'], days: ['15'], list: '0.5' },
        { months: ['11'], days: ['20'], list: '1' },
        { months: ['11', '08'], days: ['30'], list: '0.5' },
        { months: ['11', '08'], days: ['14'], list: '1' },
        { months: ['11', '8'], days: ['16'], list: '0' }
      ]
    }
  },
  mounted() {

  },
  created() {
    let day = new Date().getFullYear()
    this.dateList(this.dateNum)
    this.setWeek(day)
  },
  methods: {
    // 点击日历
    gitdayList(day, e) {
      let data = day
      if (data) {
        this.$emit('dateTime', data)
      } else {
        let index = e.target.dataset.index
        data = `${this.weekDate.weekMon[index]}-${this.weekDate.weekSun[index]}`
        this.$emit('dateTime', data)
      }
    },
    // 获取当前时间的周一
    getMonday(date) {
      let day = date.getDay()
      let deltaDay
      if (day === 0) {
        deltaDay = 6
      } else {
        deltaDay = day - 1
      }
      let monday = new Date(date.getTime() - deltaDay * 24 * 60 * 60 * 1000)
      monday.setHours(0)
      monday.setMinutes(0)
      monday.setSeconds(0)
      return monday // 返回选定时间的周一的0时0分0秒
    },
    getDateNew(time) {
      let times = new Date(time)
      let year = times.getFullYear()
      let month = times.getMonth() + 1 < 10 ? "0" + (times.getMonth() * 1 + 1) : times.getMonth() * 1 + 1
      let day = times.getDate() < 10 ? "0" + times.getDate() * 1 : times.getDate() * 1
      return year + "-" + month + "-" + day
    },
    // 上一周
    dateList(delta) {
      // 将时间对象转换为时间戳并加几天后转换为时间对象
      let DateNews = this.getMonday(
        new Date((new Date().getTime() / 1000 + 86400 * 7 * delta) * 1000)
      )
      let startDate = this.getDateNew(DateNews, delta)
      this.endDate = this.getDateNew(
        new Date((DateNews.getTime() / 1000 + 6 * 86400) * 1000)
      )
      this.dateRange = [startDate, this.endDate]
    },
    // 下一周
    arrow(arrow) {
      if (arrow === "left") {
        this.dateNum--
        this.dateList(this.dateNum)
      } else if (arrow === "right") {
        this.dateNum++
        this.dateList(this.dateNum)
      }
    },
    // 转化为周
    setWeek(year) {
      let d
      let time = year
      if (time) {
        d = new Date(time, 0, 1)
      } else {
        d = new Date()
      }
      this.currentYear = d.getFullYear()
      time = d.getFullYear()
      while (d.getDay() !== 1) {
        d.setDate(d.getDate() + 1)
      }
      let to = new Date(time + 1, 0, 1)
      let arr = []
      let mon = []
      let sun = []
      this.weekDate.weekList.length = 0
      this.weekDate.weekMon.length = 0
      let i = 1
      /* eslint-disable */
      for (let from = d; from < to;) {
        // 这一周开始的这天
        let a = `第${i}周`
        let b = `${year}年${(from.getMonth() + 1)}月${from.getDate()}日 `
        from.setDate(from.getDate() + 6)
        let c = ''
        // 这周结束的这天
        if (from < to) {
          c = `${(from.getMonth() + 1)}月${from.getDate()}日`
          from.setDate(from.getDate() + 1)
        } else {
          to.setDate(to.getDate() - 1)
          c = `${(to.getMonth() + 1)}月${to.getDate()}日`
        }
        i++
        arr.push(a)
        mon.push(b)
        sun.push(c)
      }
      this.weekDate.weekList = arr
      this.weekDate.weekMon = mon
      this.weekDate.weekSun = sun
    },
    // 查看周详情
    seeWeek(e) {
      let index = e.target.dataset.index
      this.type = ''
    },
    goweek() {
      this.type = '周'
    }
  }
}
</script>

<style lang="scss" scoped>
.week {
  width: 100%;
  position: relative;
  // margin-top: 20px;
  padding: 10px 20px;
  // background-color: #d3d3d3;
}
.week {
  height: 100%;
  overflow: auto;
  .arrow0 {
    width: 100%;
    text-align: center;
    span {
      margin: 0 40px;
    }
  }
  .days {
    display: flex;
    flex-flow: row wrap;

    li {
      flex: 25%;
      text-align: center;
      padding: 20px 0;
    }
  }
  .days::-webkit-scrollbar {
    display: none;
  }
}
.calendar {
  position: relative;
  width: 100%;
  background: #fff;

  // margin-top: 20px;
  // margin-left: 20px;
}
.el-calendar__header {
  justify-content: center;
}

.el-calendar-table .el-calendar-day {
  height: auto;
  text-align: center;
}
.el-calendar-table td.is-selected {
  background-color: #24b18d;
  color: #fff;
}
.el-calendar-table .el-calendar-day:hover {
  background-color: #24b18d;
  color: #fff;
}
.el-calendar-table {
  border-bottom: 1px solid #e4e4e4;
  padding-bottom: 15px;
}
.el-calendar-table .next {
  color: rgb(143, 143, 143);
}
.el-calendar__title,
.el-calendar__button-group {
  text-align: center;
}
.arrow {
  width: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
  max-height: 46px;
  position: absolute;
  top: 6px;
  text-align: center;
  small {
    border: 1px solid #dfdfdf;
    padding: 5px 10px;
    cursor: pointer;
  }
  small:nth-child(2) {
    border-left: none;
    border-right: none;
  }
}
.arrow i {
  font-size: 20px;
  cursor: pointer;
}
.arrow i:nth-child(1) {
  margin-right: 18%;
  text-align: left;
}
.arrow i:nth-child(2) {
  margin-left: 18%;
  text-align: right;
}
.el-calendar-table .el-calendar-day {
  height: 45px;
  text-align: center;
  line-height: 30px;
}
.calendar-day {
  text-align: center;
  // color: #202535;
  line-height: 30px;
  font-size: 12px;
}
.is-selected {
  color: #f8a535;
  font-size: 10px;
  margin-top: -45px;
}
</style>
