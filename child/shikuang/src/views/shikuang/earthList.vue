<template>
  <div class="earthList">
    <div class="contener commom">
      <div class="topNav">
        <TopNav :pageName="'/地震目录'"></TopNav>
      </div>
      <div class="box">
        <div class="box1">
          <span>区域：</span>
          <ul>
            <li v-for="(item, index) in region" :key="index" :id="item" @click="sel(item)">{{ item }}</li>
          </ul>
        </div>
        <div class="box2" v-if="search.region != '国外'">
          <span>省份：</span>
          <ul>
            <li v-for="(item, index) in province" :key="index" :id="item" @click="sel(item)">{{ item }}</li>
          </ul>
        </div>
        <div class="box3">
          <span>震级：</span>
          <ul>
            <li v-for="(item, index) in depths" :key="index" :id="item" @click="sel(item)">{{ item }}</li>
          </ul>
        </div>
        <div class="box4">
          <span>时间：</span>
          <ul>
            <li v-for="(item, index) in times" :key="index" :id="item" @click="sel(item)">{{ item }}</li>
            <el-button style="margin-left: 10px" @click="clearSearch" type="primary" size="mini">重置</el-button>
            <!-- <li style="display: flex">
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="margin-right: 10px"
                size="mini"
              >
              </el-date-picker>
            </li> -->
          </ul>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="roleList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" label="#" width="55" align="center" />
        <el-table-column label="震级" prop="m" width="80" />
        <el-table-column label="发震时刻" prop="oTime" width="200">
          <template slot-scope="scope">
            <div>{{ new Date(scope.row.otime).toLocaleString() }}</div>
          </template>
        </el-table-column>
        <el-table-column label="纬度(°)" prop="lat" width="120">
          <template slot-scope="scope">
            <div>{{toThreeFloat(scope.row.lat)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="经度(°)" prop="lon" width="120">
          <template slot-scope="scope">
            <div>{{ toThreeFloat(scope.row.lon) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="深度(km)" prop="depth" width="100" />
        <el-table-column label="位置" prop="localName">
          <template slot-scope="scope">
            <a :href="type == 2?'/shikuang/shikuangHistory?id='+scope.row.id:'/shikuang/shikuangSh?id='+scope.row.id">{{ scope.row.localName }}</a>
          </template>
      </el-table-column>
      </el-table>
      <div
        style="width: 100%;
          background: #fff;
          padding: 20px;
          display: flex;
          justify-content: center;
        "
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 25, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getList, getPageList } from '@/api/shikuang'
import { encode, decode } from '@/utils/dataEncry'
// import { type } from 'os'
import TopNav from '../../components/topNav.vue'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 400,
      // 查询参数
      region: ['全部', '国内', '国外'],
      province: [
        '全部',
        '北京',
        '天津',
        '河北',
        '山西',
        '内蒙古',
        '辽宁',
        '吉林',
        '黑龙江',
        '上海',
        '江苏',
        '浙江',
        '安徽',
        '福建',
        '江西',
        '山东',
        '河南',
        '湖北',
        '湖南',
        '广东',
        '广西',
        '海南',
        '重庆',
        '四川',
        '贵州',
        '云南',
        '西藏',
        '陕西',
        '甘肃',
        '青海',
        '宁夏',
        '新疆',
        '香港',
        '澳门',
        '台湾',
      ],
      depths: ['全部', '3级以下', '3-5级', '5-7级', '7级以上'],
      times: ['最近24小时', '最近一周', '最近一个月', '最近一年'],
      value1: '',
      // 当前页
      currentPage: 1,
      roleList2: [],
      // 地震数据
      roleList: [],
      tempList: [],
      search: {
        region: '',
        province: '',
        depths: '',
        times: ''
      },
      pageSize: 15,
      pageNum: 1
    }
  },
  components: {
    TopNav
  },
  mounted() {
    this.getEaList()
    this.getAllEaList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getEaList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getEaList()
    },
    getAllEaList() {
      getPageList({
        pageSize: 9999,
        pageNum: 1
      }).then((res) => {
        this.roleList2 = res.records
      })
    },
    // 表格选择项发生变化时
    handleSelectionChange() {},
    getEaList(){
      getPageList({
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then((res) => {
        this.roleList = res.records
        this.total = res.total
        this.roleList.forEach((item,index) => {
          for(let i = 0; i<this.roleList.length - index; i++){
            if(this.roleList[i + 1] && new Date(this.roleList[i].otime).getTime() < new Date(this.roleList[i + 1].otime).getTime()){
              let temp = null
              temp = this.roleList[i]
              this.roleList[i] = this.roleList[i + 1]
              this.roleList[i + 1] = temp
            }
          }
        })
        this.getTime()
      }).catch((e) => {
      })
    },
    getTime() {
      // this.draw[i].oTime
      this.roleList.forEach((item) => {
        item.day = Math.floor((parseInt(new Date().getTime()) - parseInt(new Date(item.otime).getTime())) / 1000 / 60 / 60 / 24)
      })
    },
    //保留三位小数
    toThreeFloat(num) {
      let number = null
      if(num.toString().split('.').length != 1 && num.toString().split('.')[1].length < 3) {
        number = parseFloat(num).toFixed(3)
      }else if(num.toString().split('.').length == 1) {
        number = num.toString() + '.000'
      }else {
        number = num.toString().substr(0,parseInt(num.toString().indexOf('.')) + 4)
      }
      return number
    },
    //重置或点击全部
    clearSearch() {
      // this.getEaList()
        this.roleList = this.roleList2
        this.getTime()
        //清空已选的粗体样式
        this.province.forEach((itm)=>{
          document.getElementById(itm).style = ''
        })
        this.times.forEach((itm)=>{
          document.getElementById(itm).style = ''
        })
        this.depths.forEach((itm)=>{
          document.getElementById(itm).style = ''
        })
        document.getElementById('国内').style = ''
        document.getElementById('国外').style = ''
        this.search = {
          region: '',
          province: '',
          depths: '',
          times: ''
        }
        this.tempList = []
    },
    sel(val) {
      if(val == '国内' || val == '国外'){
        //清空已选的粗体样式
        document.getElementById('国内').style = '';document.getElementById('国外').style = ''
        this.search.region = val
      }
      if(this.province.includes(val)){
        //清空已选的粗体样式
        this.province.forEach((itm)=>{
          document.getElementById(itm).style = ''
        })
        this.search.province = val
      }
      if(this.depths.includes(val)){
        //清空已选的粗体样式
        this.depths.forEach((itm)=>{
          document.getElementById(itm).style = ''
        })
        this.search.depths = val
      }
      if(this.times.includes(val)){
        //清空已选的粗体样式
        this.times.forEach((itm)=>{
          document.getElementById(itm).style = ''
        })
        this.search.times = val
      }
      this.filterValue()
      if(val == '全部'){
        this.clearSearch()
        return
      }
      document.getElementById(val).style = 'font-weight:bold'
    },
    filterValue() {
      let arr = [] //国内
      let arr2 = [] //国外
      this.roleList = this.roleList2
      this.getTime()
      if(this.search.region != ''){
        this.roleList.forEach((item) => {
          if(item.localName.substr(0,3) == '内蒙古' || item.localName.substr(0,3) == '黑龙江'){
            arr.push(item)
          }else {
            this.province.includes(item.localName.substr(0,2)) ? arr.push(item) : arr2.push(item)
          }
        })
        if(this.search.region == '国内'){
          this.roleList = arr
        }else {
          this.roleList = arr2
        }
      }
      //省份条件
      if(this.search.province != ''){
        this.roleList = this.roleList.filter((item) => {
         return item.localName.indexOf(this.search.province) != -1
        })
      }

      //震级条件
      if(this.search.depths != ''){
        let d = this.search.depths
        if(d == '3级以下'){
          this.roleList = this.roleList.filter(item => {
           return item.m < 3
          })
        }
        if(d == '3-5级'){
          this.roleList = this.roleList.filter(item => {
           return item.m >= 3 && item.m < 5
          })
        }
        if(d == '5-7级'){
          this.roleList = this.roleList.filter(item => {
           return item.m >= 5 && item.m < 7
          })
        }
        if(d == '7级以上'){
          this.roleList = this.roleList.filter(item => {
           return item.m >= 7
          })
        }
      }
      //时间
      if(this.search.times != ''){
        let t = this.search.times
        if(t == '最近24小时'){
          this.roleList = this.roleList.filter(item => {
           return item.day <= 1
          })
        }
        if(t == '最近一周'){
          this.roleList = this.roleList.filter(item => {
           return item.day <= 7
          })
        }
        if(t == '最近一个月'){
          this.roleList = this.roleList.filter(item => {
           return item.day <= 30
          })
        }
        if(t == '最近一年'){
          this.roleList = this.roleList.filter(item => {
           return item.day <= 365
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.contener {
  padding: 10px;
  background-color: #fff;
  position: relative;
  .topNav {
    position: absolute;
    top: 20px;
    left: -170px;
    background-color: #fff;
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
    opacity: 0.9;
  }
}
.box {
  width: 100%;
  padding: 10px;
  div {
    display: flex;
    box-sizing: border-box;
  }
  .box1,
  .box2,
  .box3,
  .box4 {
    padding-top: 10px;
  }
  ul {
    width: 90%;
    display: flex;
    flex-flow: wrap;
    border-bottom: 1px dashed rgb(77, 77, 77);
    li {
      padding: 0 10px;
      cursor: pointer;
      margin-bottom: 10px;
    }
    li:hover {
      color: rgb(16, 96, 255);
    }
  }
  .box4 {
    ul {
      flex: 1;
      border: none;
    }
  }
}
a {
  color: #3b3b3b;
}
a:hover {
  color: #0066ff;
}
</style>
