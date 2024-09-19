<template>
  <!--  顶部过滤器 -->
  <div class="main">
    <div class="top">
      <el-select v-if="type == '流动形变'" class="select" collapse-tags v-model="year" @change="changeValue" placeholder="请选择年份" size="mini">
        <el-option v-for="item in yearlist" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-if="type == '流动形变'" class="select" size="mini" @input="searchVal" v-model="search" placeholder="请输入测线名称"></el-input>
      <el-input v-if="type == '测震'" class="select" size="mini" v-model="staDescribe" placeholder="请输入仪器类型"></el-input>
      <el-select v-if="type == 'GNSS'" class="select" collapse-tags @change="changeValue2" v-model="net" placeholder="请选择台网" size="mini">
        <el-option v-for="item in netlist" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-if="type == 'GNSS'" class="select" size="mini" v-model="pointer" placeholder="请输入台站名称"></el-input>
      <el-date-picker v-if="type == 'GNSS'" style="margin-left: 10px;" v-model="TimeSelect" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-select v-if="type == '地震地质'" class="select" collapse-tags @change="changeValue" v-model="pointer" placeholder="请选择省份" size="mini">
        <el-option v-for="item in netlist" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-if="type == '地震地质'" class="select" size="mini" v-model="search" placeholder="请输入项目名称"></el-input>
      <!-- <el-select v-if="type == 'GNSS'" class="select" collapse-tags @change="changeValue" v-model="pointer" placeholder="请选择台站" size="mini">
        <el-option v-for="item in locationList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select> -->
      <el-select v-if="type == '定点形变'" class="select" collapse-tags @change="changeValue" v-model="pointer" placeholder="请选择台站" size="mini">
        <el-option v-for="item in locationList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
        <el-select class="select"  v-if="type == '流体'" collapse-tags @change="changeValue" v-model="pointer" placeholder="请选择台站" size="mini">
          <el-option v-for="item in locationList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input class="select" v-if="type == '流体'" size="mini" @input="changeValue" v-model="search" placeholder="请输入台站名称"></el-input>
      <el-select v-if="type == '电磁'" class="select" collapse-tags @change="changeValue" v-model="pointer" placeholder="请选择台站" size="mini">
        <el-option v-for="item in locationList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

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
      year: '',
      coordinate: '',
      base: '',
      TimeSelect: '',
      search:'',
      staDescribe: '',
      pointer: '',
      locationList: [],
      netlist: [],
      net: '',
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
    stationList() {
      if(this.type == 'GNSS'){
        this.locationList = this.stationList.map(item => {
          return {
            value: item.id,
            label: item.pointName
          }
       })
      }else if(this.type == '定点形变'){
        this.locationList = this.stationList.map(item => {
          return {
            value: item.sta_code,
            label: item.sta_name
          }
       })
      }else if(this.type == '流体'){
        this.locationList = this.stationList.map(item => {
          return {
            value: item.stationCode,
            label: item.stationName
          }
       })
      }else if(this.type == '电磁'){
        this.locationList = this.stationList.map(item => {
          return {
            value: item.sta_code,
            label: item.sta_name
          }
       })
      }else if(this.type == '重力'){
        this.locationList = this.stationList.map(item => {
          return {
            value: item.sta_code,
            label: item.sta_name
          }
       })
      }
    },
    netList() {
      if(this.type == 'GNSS'){
        this.netlist = this.netList.map(item => {
          return {
            value: item.netName,
            label: item.netName
          }
       })
      }
      if(this.type == '地震地质'){
        this.netlist = this.netList.map(item => {
          return {
            value: item.netName,
            label: item.netName
          }
       })
      }
    }
  },
  methods: {
    reset() {
      this.year = ''
      this.search = ''
      this.TimeSelect = ''
      this.pointer = ''
      this.net = ''
    },
    searchVal(val) {
      this.$emit('search',this.search)
    },
    check() {
      if(this.search == '' && this.year == '' && this.type != '电磁' && this.type != '地震地质' && this.type != '流体' && this.type != '定点形变' && this.type != 'GNSS' && this.type != '重力'){
        alert('请输入至少一个信息')
        return
      }
      if(this.type == 'GNSS'){
        if(this.pointer == ""){
          if(this.TimeSelect == ""){
            return
          }else{
            let data = {
              beginTime: new Date(this.TimeSelect[0]).toLocaleDateString().replaceAll('/','-'),
              endTime: new Date(this.TimeSelect[1]).toLocaleDateString().replaceAll('/','-'),
            }
            this.$emit('search', data)
          }
        }else{
          if(this.TimeSelect != ""){
            let data2 = {
              beginTime: new Date(this.TimeSelect[0]).toLocaleDateString().replaceAll('/','-'),
              endTime: new Date(this.TimeSelect[1]).toLocaleDateString().replaceAll('/','-'),
              siteName: this.pointer
            }
            this.$emit('search',data2)
          }else{
            this.$emit('filter',this.pointer)
          }
        }
      }
      if(this.type == '地震地质'){
        let par = {projectName: this.search, provider: this.pointer}
        this.$emit('search', JSON.stringify(par))
      }
    },
    changeValue2(item) {
      if(this.type == 'GNSS'){
        this.$emit('search',item)
      }
    },
    changeValue(item) {
      if(this.type == '流动形变'){
        this.$emit('filter',item)
      }
      if(this.type == '定点形变'){
        this.$emit('filter',item)
      }
      if(this.type == 'GNSS'){
        this.$emit('filter',item)
      }
      if(this.type == '流体'){
        this.$emit('filter',item)
      }
      if(this.type == '电磁'){
        this.$emit('filter',item)
      }
      if(this.type == '重力'){
        this.$emit('filter',item)
      }
      if(this.type == '地震地质'){
        let par = {projectName: this.search, provider: this.pointer}
        this.$emit('search', JSON.stringify(par))
      }
    }
  },
  props: {
    yearlist: {
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
    netList: {
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
