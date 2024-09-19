<template>
  <div class="date">
    <!-- 日 -->
    <el-calendar v-model="value" v-if="type === '日'" id="calenda">
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
                item.days.indexOf(data.day.split('-').slice(2).join('-')) != -1
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
</template>

<script>
export default {
  data() {
    return {
      value: new Date(),
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
  components: {},
  props: ['type'],
  created() {

  },
  methods: {
    // 点击日历
    gitdayList(day) {
      this.$emit('dateTime', day)
    },
  }
}
</script>

<style lang="scss" scoped>
.date {
  width: 100%;
  height: 100%;

  ::v-deep .el-calendar-table .el-calendar-day {
    height: 45px;
    text-align: center;
    line-height: 30px;
  }
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
#calenda
  .el-button-group
  > .el-button:not(:first-child):not(:last-child):after {
  content: "当月";
}
</style>
