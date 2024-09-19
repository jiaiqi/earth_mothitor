<template>
  <!--  顶部过滤器 -->
  <div class="main">
    <div class="top">
      <!-- <el-select v-if="type == '探测数据'" class="select" collapse-tags @change="changeValue2" v-model="pointer" placeholder="请选择台站" size="mini">
        <el-option v-for="item in stationList2" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-if="type == '模拟资料'" class="select" collapse-tags @change="changeValue" v-model="year" placeholder="请选择年份" size="mini">
        <el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select> -->
      <el-input v-if="type == '探测数据'" class="select" size="mini" v-model="station" placeholder="请输入测线名称"></el-input>
      <el-button-group class="button">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="check">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'topSel',
  data() {
    return {
      net: '',
      coordinate: '',
      base: '',
      TimeSelect: '',
      station:'',
      pointer: '',
      year: '',
      yearList: [],
      locationList: [],
      stationList2: [],
      // netList: [],
      // stationList: [
      //   {
      //     label: '四川',
      //     value: '四川'
      //   },
      //   {
      //     label: '江苏',
      //     value: '江苏'
      //   },
      //   {
      //     label: '广东',
      //     value: '广东'
      //   }
      // ]
    }
  },
  mounted() {
  },
  watch: {
    netList() {
      if(this.type == '强震动'){
        this.yearList = this.netList.map(item => {
          return {
            value: item.year,
            label: item.year
          }
      })
    }
    },
    pointerList() {
      this.locationList = this.pointerList.map(item => {
        return {
          value: item.id,
          label: item.shockAddr
        }
      })
    },
    stationList() {
      this.stationList2 = this.stationList.map(item => {
        return {
          value: item.id,
          label: item.staName
        }
      })
    },
    yearlist() {
      this.yearList = this.yearlist.map(item => {
        return {
          value: item.year,
          label: item.year
        }
      })
    }
  },
  methods: {
    reset() {
      this.net = ''
      this.station = ''
      this.TimeSelect = ''
      this.pointer = ''
      this.year = ''
    },
    check() {
      if(this.type == '探测数据'){
        if(this.station == ''){
          alert('请输入至少一个信息')
          return
        }
        this.$emit('search',this.station)
      }
    },
    changeValue(item) {
      if(this.type == '强震动'){
        this.$emit('filter',item)
      }
      if(this.type == '模拟资料'){
        this.$emit('filterYear',item)
      }
    },
    changeValue2(item) {
      if(this.type == '强震动'){
        let data = {}
        this.pointerList.map(itm => {
          if(itm.id == item){
            data = itm
          }
        })
        this.$emit('filter2',data)
      }
      if(this.type == '模拟资料'){
        this.$emit('filter',item)
      }
    }
  },
  props: {
    netList: {
      type: Array,
      default: () => {
        return []
      }
    },
    stationList: {
      type: Array,
      default: () => {
        return []
      }
    },
    pointerList: {
      type: Array,
      default: () => {
        return []
      }
    },
    yearlist: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: () => {
        return ''
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 45px;
  line-height: 35px;
  vertical-align: middle;
  border-radius: 25px;
  box-shadow: 1px 1px 3px 1px #a7a7a7;
  padding: 5px 20px;
  background-color: #fff;
  z-index: 1000;
.top{
  .select {
    width: 170px;
    margin: 0px 6px;
  }
  .button{
    margin-left: 15px;
  }
}
}
</style>
