<template>
  <div class="earthList commom">
    <div class="topNav">
      <topNav :pageName="'/更多地震信息'"></topNav>
    </div>
    <el-container>
      <el-header>
          <div class="header" v-if="type == 1">
            <div>
              <span style="font-size: 15px;line-height: 33px;width: 170px;">按时间：</span>
              <el-radio-group v-model="selTime" @change="sel" size="small">
                <el-radio-button :label="1">最近24小时内</el-radio-button>
                <el-radio-button :label="2">最近48小时内</el-radio-button>
                <el-radio-button :label="3">最近7天内</el-radio-button>
                <el-radio-button :label="4">最近30天内</el-radio-button>
                <el-radio-button :label="5">最近一年内</el-radio-button>
              </el-radio-group>
            </div>
            <div style="margin-top:10px">
              <span style="font-size: 15px;line-height: 33px;width: 170px;">按震级：</span>
              <el-radio-group v-model="selDg" @change="sel" size="small">
                <el-radio-button :label="6">6.0级以上地震</el-radio-button>
                <el-radio-button :label="7">5.0级以上地震</el-radio-button>
                <el-radio-button :label="8">4.0级以上地震</el-radio-button>
                <el-radio-button :label="9">3.0级以上地震</el-radio-button>
                <el-radio-button :label="10">3.0级以下地震</el-radio-button>
              </el-radio-group>
              <el-button @click="reSet" size="mini" style="margin-left:20px">重置</el-button>
              <!-- <ul class="byTime">
                <li class="item" ref="1" @click="sel(1)">最近24小时内</li>
                <li class="item" ref="2" @click="sel(2)">最近48小时内</li>
                <li class="item" ref="3" @click="sel(3)">最近7天内</li>
                <li class="item" ref="4" @click="sel(4)">最近30天内</li>
                <li class="item" ref="5" @click="sel(5)">最近一年内</li>
              </ul> -->
            </div>
            <!-- <div class="headerRow" style="border-top:0px">
              <ul class="byTime">
                <li class="item" ref="6" @click="sel(6)">6.0级以上地震</li>
                <li class="item" ref="7" @click="sel(7)">5.0级以上地震</li>
                <li class="item" ref="8" @click="sel(8)">4.0级以上地震</li>
                <li class="item" ref="9" @click="sel(9)">3.0级以上地震</li>
                <li class="item" ref="10" @click="sel(10)">3.0级以下地震</li>
              </ul>
            </div> -->
          </div>
          <div class="header" v-else>
            <div class="headerRow">
              <span style="font-size: 15px;line-height: 33px;width: 120px;padding-left: 30px;">按日期：</span>
              <el-input v-model="month" size="mini" maxlength="2" @input="getList" style="width: 52px;"></el-input>&nbsp;&nbsp;月&nbsp;
              <el-input v-model="day" size="mini" maxlength="2" @input="getList" style="width: 52px;"></el-input>&nbsp;&nbsp;日
              <el-button-group size="small" style="margin-left: 10px">
                <el-button size="mini" @click="sel(-1)">上一天</el-button>
                <el-button size="mini" @click="sel(1)">下一天</el-button>
              </el-button-group>
              <el-button @click="reSet" size="mini" style="margin-left:20px">重置</el-button>
            </div>
          </div>
        </el-header>
    </el-container>
    <el-table
      v-loading="loading"
      :data="roleList"
      stripe
      border
      @selection-change="handleSelectionChange"
      style="margin-top:20px"
    >
      <el-table-column type="index" label="#" width="55" align="center" />
      <el-table-column label="震级" prop="m" width="120" />
      <el-table-column  v-if="type == 1" label="发震时刻" prop="oTime" width="180">
        <template slot-scope="scope">
          <div>{{ new Date(scope.row.oTime).toLocaleString() }}</div>
        </template>
      </el-table-column>
      <el-table-column v-else label="发震时刻" prop="earthquakeDate" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.earthquakeDate }}</div>
        </template>
      </el-table-column>
      <el-table-column label="纬度(°)" prop="lat" width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.lat.toFixed(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="经度(°)" prop="lon" width="150">
        <template slot-scope="scope">
          <div>{{ scope.row.lon.toFixed(2)  }}</div>
        </template>
      </el-table-column>
      <el-table-column  v-if="type == 1" label="深度(km)" prop="depth" width="150" />
      <el-table-column  v-if="type == 1" label="位置" prop="localName">
        <template slot-scope="scope">
          <a :href="'/shikuang/shikuangSh?id='+scope.row.id">{{ scope.row.localName }}</a>
        </template>
      </el-table-column>
      <el-table-column v-else label="位置" prop="placeName">
        <template slot-scope="scope">
          <a :href="'/shikuang/shikuangHistory?id='+scope.row.id" @click="addHot(scope.row.placeName,'/shikuang/shikuangHistory?id='+scope.row.id)">{{ scope.row.placeName }}</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div
      style="
        width: 100%;
        background: #fff;
        padding: 20px;
        display: flex;
        justify-content: flex-end;
      "
    >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div> -->
  </div>
</template>

<script>
import { getList,getHisList } from '@/api/shikuang'
import { encode, decode } from '@/utils/dataEncry'
import {
  hotDataAdd
} from '@/api/hots'
import { Scope } from 'eslint-scope'
import TopNav from '../../components/topNav.vue'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 400,
      // 当前页
      currentPage: 4,
      // 地震数据
      roleList: [],
      roleList2: [],
      selTime: '',
      selDg: '',
      dayTime: 86400000,
      type: null,
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),

    }
  },
  components: {
    TopNav
  },
  mounted() {
    if(this.$route.query.type == 1){
      this.getEaList()
    }else {
      this.month = parseInt(this.$route.query.data.split('/')[1])
      this.day = parseInt(this.$route.query.data.split('/')[2])
      this.getList()
      // this.roleList = JSON.parse(this.$route.query.data)
      // this.roleList2 = this.roleList
      // this.getTime()
      // this.roleList.forEach((item)=>{
      //   item.oTime = item.earthquakeDate
      //   item.localName = item.placeName
      //   item.depth = '-'
      // })
    }
    this.type = this.$route.query.type
  },
  methods: {
    getEaList(){
      getList({}).then((res) => {
        this.roleList = decode(res)
        this.roleList2 = this.roleList
        this.roleList.forEach((item,index) => {
          for(let i = 0; i<this.roleList.length - index; i++){
            if(this.roleList[i + 1] && this.roleList[i].oTime < this.roleList[i + 1].oTime){
              let temp = null
              temp = this.roleList[i]
              this.roleList[i] = this.roleList[i + 1]
              this.roleList[i + 1] = temp
            }
          }
        })
        this.getTime()
        this.addHot()
      }).catch((e) => {
      })
    },
    getList() {
      const date = new Date();
      const pageNum = 1;
      const pageSize = 999;
      let month = this.month;
      month = month > 9 ? month : "0" + month;
      let day = this.day;
      getHisList(pageNum, pageSize, month, day)
        .then((res) => {
          let list = res.records
          this.roleList = list
        })
        .catch(() => {
          
        })
    },
    reSet() {
      this.roleList = this.roleList2
      this.selTime = ''
      this.selDg = ''
      this.dayTime = 86400000
      this.month = new Date().getMonth() + 1
      this.day = new Date().getDate()
    },
    getTime() {
      // this.draw[i].oTime
      this.roleList.forEach((item) => {
        item.day = Math.floor((parseInt(new Date().getTime()) - parseInt(item.oTime)) / 1000 / 60 / 60 / 24)
      })
    },
    //新增热点搜索
    addHot(name,url){
      let form = {
            keyName: '历史地震-'+name,
            url: url,
            linkUnit: ''
          }
      hotDataAdd(encode(form)).then()
    },
    sel(num) {
      // if(this.$refs[index].style.backgroundImage){  //已选择再点击则回到初始状态
      //     this.$refs[index].style = ''
      //     this.draw = this.draw2
      //     this.drawList()
      //     return
      // }
      // //清空样式
      // for(let i = 1; i<= 10; i++) {
      //     this.$refs[i].style = ''
      // }
      // this.$refs[index].style = 'background-image: linear-gradient(#067EBD,#067EBD, #176593);color:#fff'
        this.roleList = this.roleList2
      if(this.selTime == 1){   //最近24小时内
        this.roleList = this.roleList.filter(item => {
           return item.day <= 1
        })
      }
      if(this.selTime == 2){   //最近48小时内
        this.roleList = this.roleList.filter(item => {
           return item.day <= 2
        })
      }
      if(this.selTime == 3){   //最近一周内
        this.roleList = this.roleList.filter(item => {
           return item.day <= 7
        })
      }
      if(this.selTime == 4){   //最近30天内
        this.roleList = this.roleList.filter(item => {
           return item.day <= 30
        })
      }
      if(this.selTime == 5){   //最近一年内
        this.roleList = this.roleList.filter(item => {
           return item.day <= 365
        })
      }
      if(this.selDg == 6){   //6级以上地震
        this.roleList = this.roleList.filter(item => {
           return item.m > 6
        })
      }
      if(this.selDg == 7){   //5级以上地震
        this.roleList = this.roleList.filter(item => {
           return item.m > 5
        })
      }
      if(this.selDg == 8){   //4级以上地震
        this.roleList = this.roleList.filter(item => {
           return item.m > 4
        })
      }
      if(this.selDg == 9){   //3级以上地震
        this.roleList = this.roleList.filter(item => {
           return item.m >= 3
        })
      }
      if(this.selDg == 10){   //3级以下地震
        this.roleList = this.roleList.filter(item => {
           return item.m < 3
        })
      }
      if(num == 1){   //下一天
        this.day = new Date(new Date().getTime() + this.dayTime).getDate()
        this.month = new Date(new Date().getTime() + this.dayTime).getMonth() + 1
        this.dayTime += 86400000
        this.getList()
      }
      if(num == -1){   //上一天
        this.dayTime -= 86400000
        this.day = new Date(new Date().getTime() - 86400000 + this.dayTime).getDate()
        this.month = new Date(new Date().getTime() - 86400000 + this.dayTime).getMonth() + 1
        this.getList()
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
    },
    // 表格选择项发生变化时
    handleSelectionChange() {}
  }
}
</script>

<style lang="less" scoped>
.el-header {
  height: 70px !important;
}
.el-container.is-vertical {
  flex-direction: row !important;
}
.header {
  width: 100%;
  .headerRow {
    display: flex;
    padding: 15px 0px 8px 40px;
    border-top: 1px solid rgb(216, 216, 216);
  }
  // .headerRow {
  //   display: flex;
  //   padding: 15px 0px 8px 0px;
    // .byTime {
      // width: 75%;
      // display: flex;
      // justify-content: space-around;
      // color: #1492ff;
      // font-size: 15px;
     // .item {
        // padding: 3px 12px;
        // border-radius: 2px;
        // cursor: pointer;
      //}
      // .item:hover {
      //   background-color: #d6d6d6;
      // }
    // }
  // }
}
.earthList {
  position: relative;
  padding: 50px 0px;
  .topNav {
    position: absolute;
    top: 20px;
    left: -160px;
    background-color: #fff;
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
    opacity: 0.9;
  }
  .title {
    padding: 20px;
    background-color: #fff;
  }
}
a {
  color: #3b3b3b;
}
a:hover {
  color: #0066ff;
}
</style>
