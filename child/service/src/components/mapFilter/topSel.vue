<template>
  <!--  顶部过滤器 -->
  <div class="main">
    <div class="top">
      <el-select v-if="type == '测震'" class="select" collapse-tags v-model="net" placeholder="请选择台网" size="mini">
        <el-option v-for="item in netList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-if="type == '测震'" class="select" size="mini" v-model="station" placeholder="请输入台站名称"></el-input>
      <el-date-picker v-if="type == '测震'"  class="select" style="width: 260px;" v-model="dateDuring" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      <el-select v-if="type == '强震动'" class="select" collapse-tags @change="changeValue" v-model="net" placeholder="请选择年份" size="mini">
        <el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-if="type == '强震动'" class="select" collapse-tags @change="changeValue2" v-model="pointer" placeholder="请选择地点" size="mini">
        <el-option v-for="item in locationList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-if="type == '强震动'" class="select" size="mini" @input="changeValue2" v-model="station" placeholder="请输入地点"></el-input>
      <el-select v-if="type == '模拟资料'" class="select" collapse-tags @change="changeValue2" v-model="pointer" placeholder="请选择台站" size="mini">
        <el-option v-for="item in stationList2" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-if="type == '模拟资料'" class="select" collapse-tags @change="changeValue" v-model="year" placeholder="请选择年份" size="mini">
        <el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-if="type == '科学台阵'" class="select" size="mini" v-model="station" placeholder="请输入台站代码"></el-input>
      <!-- <el-select class="select" multiple collapse-tags v-model="station" placeholder="请选择台站" size="mini">
        <el-option v-for="item in stationList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select> -->
      <!-- <el-date-picker style="margin-left: 10px;" v-model="TimeSelect" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker> -->
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
      net: '全国',
      coordinate: '',
      base: '',
      TimeSelect: '',
      station:'',
      staDescribe: '',
      pointer: '',
      year: '',
      yearList: [],
      locationList: [],
      stationList2: [],
      dateDuring: '',
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
      this.staDescribe = ''
      this.dateDuring = ''
      this.$emit('search',{})
    },
    check() {
      if(this.type == '测震'){
        if(this.station == '' && this.net == '' && this.dateDuring == ''){
          alert('请输入至少一个信息')
          return
        }
        let info = {
          netCode: this.net
        }
        if(this.station != ''){
          info.staName = this.station
        }
        if(this.dateDuring != ''){
          info.date = this.dateDuring
        }
        this.$emit('search',info)
      }
      if(this.type == '科学台阵'){
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
        if(typeof item == 'string'){
          this.$emit('filter2',item)
          return
        }
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
    width: 145px;
    margin: 0px 6px;
  }
  .button{
    margin-left: 15px;
  }
}
}
</style>
