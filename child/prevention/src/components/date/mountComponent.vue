<template>
  <div class="box">
    <!-- 月 -->
    <div class="month" v-if="type === '月'">
      <div class="arrow0">
        <i class="el-icon-arrow-left" @click="lastYear"></i>
        <i class="el-icon-arrow-right" @click="nextYear"></i>
      </div>
      <!-- 年份 月份 -->
      <div class="month">
        <span>{{ currentYear }}年</span>
      </div>
      <!-- 日期 -->
      <ul class="days">
        <li @click="pickMonth(day)" v-for="(day, index) in month" :key="index">
          <!--本月-->
          <p
            :class="
              day == currentMonth && currentYear == current ? 'other-month' : ''
            "
          >
            {{ day }}月
          </p>
        </li>
      </ul>
    </div>
    <!-- 日 -->
    <div class="date" v-if="type === '日'">
      <!-- 年份 月份 -->
      <div class="month" style="cursor: pointer">
        <i
          class="el-icon-arrow-left"
          @click="pickPre(currentYear, currentMonth)"
        ></i>
        <p @click="type = '月'">{{ currentYear }}年{{ currentMonth }}月</p>
        <i
          class="el-icon-arrow-right"
          @click="pickNext(currentYear, currentMonth)"
        ></i>
      </div>
      <!-- 星期 -->
      <ul class="weekdays">
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
        <li>日</li>
      </ul>
      <!-- 日期 -->
      <ul class="days">
        <li @click="pick(day)" v-for="(day, index) in days" :key="index">
          <span>
            <!--今天-->
            <span
              v-if="
                day.getFullYear() == new Date().getFullYear() &&
                day.getMonth() == new Date().getMonth() &&
                day.getDate() == new Date().getDate()
              "
              class="active"
              >{{ day.getDate() }}</span
            >
            <span v-else>{{ day.getDate() }}</span>
          </span>
          <div v-for="(item, index) in scheduleData" :key="index">
            <div v-if="judgeif(item, day)">
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
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: '月',
      current: '',
      currentYear: '', // 年份
      currentMonth: '', // 月份
      currentDay: '', // 日期
      currentWeek: '', // 星期
      days: [],
      month: [],
      week: [],
      scheduleData: [
        { months: ['8', '11'], days: ['1'], list: '0' },
        { months: ['9', '11'], days: ['15'], list: '0' },
        { months: ['10', '11'], days: ['2'], list: '0.5' },
        { months: ['11'], days: ['3'], list: '1' },
        { months: ['11'], days: ['2'], things: '看月亮', list: '0.5' },
        { months: ['9', '11'], days: ['7'], list: '1', things: '看电影' },
        {
          months: ['10', '11'],
          days: ['16'],
          list: '0.5',
          things: '去公园野炊'
        },
        { months: ['11'], days: ['8'], things: '看星星', list: '0' },
        { months: ['11'], days: ['4'], things: '看月亮', list: '0.5' },
        { months: ['11', '8'], days: ['12'], list: '0' },
        { months: ['8'], days: ['15'], list: '0.5' },
        { months: ['11'], days: ['20'], list: '1' },
        { months: ['11', '8'], days: ['30'], list: '0.5' },
        { months: ['11', '8'], days: ['14'], list: '1' },
        { months: ['11', '8'], days: ['27'], list: '0' }
      ]
    }
  },
  mounted() {},
  created() {
    this.initData()
  },
  methods: {
    // 处理日期格式
    formatDate(year, month, day) {
      const y = year
      let m = month
      if (m < 10) m = `0${m}`
      let d = day
      if (d < 10) d = `0${d}`
      return `${y}-${m}-${d}`
    },
    // 生成日期
    initData(cur) {
      let date = ''
      if (cur) {
        date = new Date(cur)
      } else {
        date = new Date()
      }
      this.currentDay = date.getDate() // 今日日期 几号
      this.currentYear = date.getFullYear() // 当前年份
      this.currentMonth = date.getMonth() + 1 // 当前月份
      this.currentWeek = date.getDay() // 1...6,0   // 星期几
      this.current = this.currentYear
      if (this.currentWeek === 0) {
        this.currentWeek = 7
      }
      const str = this.formatDate(
        this.currentYear,
        this.currentMonth,
        this.currentDay
      ) // 今日日期 年-月-日
      if (this.type === '月') {
        this.month.length = 0
        for (let i = 1; i <= 12; i++) {
          this.month.push(i)
        }
      } else if (this.type === '周') {
        this.week.length = 0
      } else if (this.type === '日') {
        this.days.length = 0 // 清空数据
        // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 35- this.currentWeek
        /* eslint-disabled */
        for (let i = this.currentWeek - 1; i >= 0; i -= 1) {
          const d = new Date(str)
          d.setDate(d.getDate() - i)
          this.days.push(d)
        }
        for (let i = 1; i <= 35 - this.currentWeek; i += 1) {
          const d = new Date(str)
          d.setDate(d.getDate() + i)
          this.days.push(d)
        }
      }
    },
    //  上个星期
    weekPre() {
      const d = this.days[0] // 如果当期日期是7号或者小于7号
      d.setDate(d.getDate() - 7)
      this.initData(d)
    },
    //  下个星期
    weekNext() {
      const d = this.days[6] // 如果当期日期是7号或者小于7号
      d.setDate(d.getDate() + 7)
      this.initData(d)
    },
    // 上一個月   传入当前年份和月份
    pickPre(year, month) {
      const d = new Date(this.formatDate(year, month, 1))
      d.setDate(0)
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
    },
    // 下一個月   传入当前年份和月份
    pickNext(year, month) {
      const d = new Date(this.formatDate(year, month, 1))
      d.setDate(35)
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
    },
    // 上一年
    lastYear() {
      this.currentYear = this.currentYear - 1
    },
    nextYear() {
      this.currentYear = this.currentYear + 1
    },
    // 点击月份
    pickMonth(day) {
      this.type = '日'
      const d = new Date(this.formatDate(this.currentYear, day + 1, 1))
      d.setDate(0)
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
    },
    // 判断日期是否存在
    judgeif(item, day) {
      let mount = item.months
      let days = day.toLocaleDateString().split('/').slice(1)[0].toString()
      let date = item.days
      let it = day.toLocaleDateString().split('/').slice(2).join('-')
      if (mount.indexOf(days) !== -1) {
        if (date.indexOf(it) !== -1) {
          // console.log(item)
          // console.log(day)
          // console.log(date, 2)
          // console.log(it, 1)
          return true
        }
      }
    },
    // 当前选择日期
    pick(date) {
      // console.log(date.toLocaleDateString().split('/').slice(2).join('-'))
      this.$emit(
        'dateTime',
        this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
      )
      // alert(this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate()))
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  padding: 0;
}
li {
  list-style-type: none;
}
.box {
  width: 400px;
}
/* 下面的日历 */
.date,
.week,
.month {
  width: 100%;
  position: relative;
  // margin-top: 20px;
  padding: 10px 20px;
  // background-color: #d3d3d3;
}
.month {
  .days {
    li {
      flex: 25%;
      padding: 30px 0;
    }
  }
  ::v-deep .arrow0 {
    z-index: 2;
  }
}
.arrow0 {
  width: 100%;
  max-height: 46px;
  position: absolute;
  top: 20px;
  left: 0px;
  text-align: center;
  z-index: 2;
}
.arrow0 i {
  font-size: 20px;
  cursor: pointer;
}
.arrow0 i:nth-child(1) {
  margin-right: 20%;
  text-align: left;
}
.arrow0 i:nth-child(2) {
  margin-left: 20%;
  text-align: right;
}
.date {
  box-sizing: border-box;
  .month {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    p {
      margin: 0 40px;
    }
  }
  li {
    position: relative;
  }
  .is-selected {
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    // border-radius: 50%;
    // opacity: 0.6;
    position: absolute;
    font-size: 8px;
    top: 0px;
    right: 0px;
    // background-color: #dfdfdf;
  }
}
.month {
  text-align: center;
}
.weekdays {
  display: flex;
  margin-top: 10px;
}
.weekdays li {
  flex: 1;
  text-align: center;
}
.days {
  display: flex;
  flex-flow: row wrap;
  margin-top: 10px;
}
.days li {
  flex: 14%;
  text-align: center;
  cursor: pointer;
  padding: 10px 0;
}
.days li span {
  display: inline-block;
  width: 22px;
  height: 22px;
}
.days li span:hover {
  color: #fff;
  background-color: #409eff;
  border-radius: 50%;
}
.active {
  display: inline-block;
  color: #fff;
  border-radius: 50%;
  background-color: #fa6854 !important;
}
.other-month {
  color: #e4393c;
}
.is-selected {
  color: #f8a535;
}
</style>
