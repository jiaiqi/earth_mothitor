<template>
  <div>
    <div class="backHome"><el-button type="primary" size="small" @click="back">返回主页</el-button></div>
    <el-row :gutter="40" class="panel-group">
      <el-col v-if="hasCountAuth" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="toUrl('/serviceBenefits/count')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">平台访问总量</div>
            <count-to
              :start-val="0"
              :end-val="allNumber"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col v-if="hasTaskAuth" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="toUrl('/workflow/tasks')">
          <div class="card-panel-icon-wrapper icon-message">
            <!-- <el-badge :value="taskNum" :max="99" class="item"> -->
              <svg-icon icon-class="message" class-name="card-panel-icon" />
            <!-- </el-badge> -->
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">消息</div>
            <count-to
              :start-val="0"
              :end-val="taskNum"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="druid" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">数据总量</div>
            <count-to
              :start-val="0"
              :end-val="sum"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col v-if="hasOrderAuth" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="toUrl('/serviceBenefits/order2?status=0')">
          <div class="card-panel-icon-wrapper icon-shopping">
            <!-- <el-badge :value="unCompleteNum" :max="99" class="item"> -->
              <svg-icon icon-class="shopping" class-name="card-panel-icon" />
            <!-- </el-badge> -->
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">订单</div>
            <count-to
              :start-val="0"
              :end-val="unCompleteNum"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="druid" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">产品目录总量</div>
            <count-to
              :start-val="0"
              :end-val="sumProd"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="druid" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">技术服务目录总量</div>
            <count-to
              :start-val="0"
              :end-val="sumSer"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="druid" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">法规标准目录总量</div>
            <count-to
              :start-val="0"
              :end-val="sumReg"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="druid" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">科普目录总量</div>
            <count-to
              :start-val="0"
              :end-val="sumknow"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAuditList } from '@/api/workflow/audit'
import { AllViewNumber } from '@/api/workflow/count'
import { listUser } from '@/api/system/user'
import { statusNum, getList } from "@/api/workflow/order";
import CountTo from 'vue-count-to'
import { ufCountData, levelCountData, catalogCountData, gnssCountData, prodServeSum } from "@/api/workflow/prods"
import { gnssGetDataNumber } from '@/api/dataup/gnss'
import { getAll, getAllSchoolList, getAllBaseList } from '@/api/workflow/knowledge'
import { lawCount, standardCount } from "@/api/dataup/criterion"
import { asGetDataNumber } from '@/api/dataup/seismogarray'
import { inGetDataNumber } from '@/api/dataup/special'
import { strGetDataNumber } from '@/api/dataup/vibration'
import { seiGetDataNumber } from '@/api/workflow/selsmometry'
import { preGetDataNumber } from '@/api/workflow/underFluid'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      userid: null,
      nickName:'',
      orderNum: 0,
      unCompleteNum: 0,
      taskNum: 0,
      task: 0,
      allNumber: 0,
      isAth: true,
      sum: 0,
      sumProd: 0,
      sumSer: 0,
      sumReg: 0,
      sumknow: 0,
      //是否有审批权限
      hasTaskAuth: true,
      // 是否有订单权限
      hasOrderAuth: true,
      // 是否有统计权限
      hasCountAuth: true,
    }
  },
  methods: {
    handleSetLineChartData(type) {
      // this.$emit('handleSetLineChartData', type)
    },
    toUrl(url) {
      this.$router.push(url)
    },
    /** 查询菜单列表 */
    getOrderSum(data) {
      setTimeout(() => {
        let arr = this.$store.state.user.orderStatus
        let sum = 0
        arr.forEach(item=>{
          sum += item.num
        })
        this.orderNum = sum
      }, 500);
    },
    //获取当前登录用户的id
    getUserId(){
      listUser({
        pageNum: 1,
        pageSize: 9999
      }).then(resp=>{
        resp.rows.forEach(itm=>{
          if(itm.userName == this.$store.state.user.name){
            this.userid = itm.userId
            this.nickName = itm.nickName
          }
        })
        this.getOrderSum()
        this.getStatusNum()
        this.getAllNumber()
        this.getAuditTask()
        this.getProdSum()
      })
    },
    getAllNumber() {
      AllViewNumber().then(res=>{
       this.allNumber = res
      })
    },
    getStatusNum(){
      let par = 'userName='+this.nickName+'&userId='+this.userid
      statusNum(par).then(res=>{
        if(typeof(res) == 'number'){
          this.unCompleteNum = res
        }
      })
    },
    //获得待审核任务数量
    getAuditTask(){
      this.changeStat()
    },
    //统计数据目录总量
    getDataCataNum() {

      // gnssGetDataNumber().then(num1=>{
      //   this.sum += num1
      // })
      // asGetDataNumber().then(num2=>{
      //   this.sum += num2
      // })
      // inGetDataNumber().then(num2=>{
      //   this.sum += num2
      // })
      // strGetDataNumber().then(num2=>{
      //   this.sum += num2
      // })
      // seiGetDataNumber().then(num2=>{
      //   this.sum += num2
      // })
      // preGetDataNumber().then(num2=>{
      //   this.sum += num2
      // })
    },
    //技术产品法规科普
    getProdSum() {
      this.sumProd = 0
      this.sumSer = 0
      this.sumReg = 0
      this.sumknow = 0
      ufCountData({}).then(res=>{
        this.sumProd += res
      })
      levelCountData({}).then(res=>{
        this.sumProd += res
      })
      catalogCountData({}).then(res=>{
        this.sumProd += res
      })
      gnssCountData({}).then(res=>{
        this.sumProd += res
      })
      prodServeSum().then(res=>{
        this.sumSer += res
        sessionStorage.setItem('ser', this.sumSer)
      })
      lawCount('').then(res=>{
        this.sumReg += res
      })
      standardCount('').then(res=>{
        this.sumReg += res
        setTimeout(() => {
          sessionStorage.setItem('lawstand',this.sumReg)
        }, 300);
      })
      getAll('pageSize=9999&pageNum=1').then(res=>{
        this.sumknow += res.total
      })
      getAllSchoolList('pageSize=9999&pageNum=1').then(res=>{
        this.sumknow += res.total
      })
      getAllBaseList('pageSize=9999&pageNum=1').then(res=>{
        this.sumknow += res.total
        this.sum = 0
        setTimeout(() => {
          this.sum = parseInt(sessionStorage.getItem('allNum')) + this.sumknow + this.sumReg + this.sumSer
          sessionStorage.setItem('know',this.sumknow)
        }, 500);
      })
    },
    changeStat(e) {
      let page = 'pageNum=1&pageSize=99999'
      // if(e != ''){
      //   page += '&status='+e
      // }
      getAuditList(page).then(res=>{
        //代办任务审批数量
        this.taskNum = res.records.filter(item=>{
          return item.taskStatus == '待审核'
        }).length
        this.task = res.total
      })
    },
    back() {
      location.href = 'http://www.earthquake.ac.cn/home'
    }
  },
  mounted(){
    this.getUserId()
    this.getDataCataNum()
    if(this.$store.state.user.permissions.includes('workflow:order:index') || this.$store.state.user.permissions.includes('workflow:order:self') || this.$store.state.user.permissions[0] == '*:*:*'){
      this.hasOrderAuth = true
    }else{
      this.hasOrderAuth = false
    }
    if(this.$store.state.user.permissions.includes('workflow:count:index') || this.$store.state.user.permissions[0] == '*:*:*'){
      this.hasCountAuth = true
    }else{
      this.hasCountAuth = false
    }
    if(this.$store.state.user.permissions.includes('workflow:tasks:index') || this.$store.state.user.permissions[0] == '*:*:*'){
      this.hasTaskAuth = true
    }else{
      this.hasTaskAuth = false
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

.backHome {
  width: 100%;
  position: absolute;
  top: 10px;
  right: 50px;
  text-align: right;
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
