<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    typeList: {
      type: Array,
      default: ['强震动','地下流体', '定点形变','GNSS','水准']
    },
    yList: {
      type: Array,
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '390px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      default: [],
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        // if(val.cez && val.cez.length != 0){
        //   this.setOptions2(val)
        // }else{
          this.setOptions(val)
        // }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(chartData) {
      this.chart.setOption({
        xAxis: {
          data: this.yList,
          type: 'category',
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        series: [
          {
            data: chartData,
            type: 'bar',
            barWidth: chartData.length > 1 ? '60%':'16%'
          }
        ]
      })
    }
  }
}
</script>
