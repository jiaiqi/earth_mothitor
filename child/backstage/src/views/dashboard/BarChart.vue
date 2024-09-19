<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '95%'
    },
    height: {
      type: String,
      default: '350px'
    },
    xData: {
      type: Array,
      default: []
    },
    yData: {
      type: Array,
      default: []
    },
    isMonth: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      xDatas: []
    }
  },
  mounted() {

  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch:{
    xData(newVal){
      this.xDatas = newVal
      this.$nextTick(() => {
        this.initChart()
      })
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '各单位年/月上传数据目录情况柱状图',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          name:'qi0jfwrwiofreu',
          top: 70,
          left: '5%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.xDatas,
          name: '单位',
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          name: '本月/年度新增数据目录量',
          axisTick: {
            show: true
          }
        }],
        series: [{
          name: this.isMonth? '本年度' : '本月度',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          data: this.yData,
          animationDuration
        }]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>