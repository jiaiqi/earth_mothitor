<template>
    <div class="container">
        <div class="title"><h2>{{ title }}</h2></div>
        <div style="float: right;position: relative;right:50px;margin-top: -30px;"><el-button size="small" @click="back">返回</el-button></div>
        <div class="table">
            <el-table
                v-loading="loading"
                :data="soonlist"
                v-if="soon"
            >
                <el-table-column label="震级" prop="m" width="120" />
                <el-table-column label="发震时刻" prop="otime" width="180">
                    <template slot-scope="scope">
                    <div>{{ new Date(scope.row.otime).toLocaleString() }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="纬度(°)" prop="lat" width="100">
                    <template slot-scope="scope">
                    <div>{{ scope.row.lat }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="经度(°)" prop="lon" width="150">
                    <template slot-scope="scope">
                    <div>{{ scope.row.lon  }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="深度(km)" prop="depth" width="150" />
                <el-table-column label="位置" prop="localName"></el-table-column>
            </el-table>
            <el-table
                v-loading="loading"
                :data="smslist"
                v-if="sms"
            >
                <el-table-column label="速报震级" prop="magnitude" width="100" />
                <el-table-column label="Mw震级" prop="mwMagnitude" width="100" />
                <el-table-column label="发震时刻" prop="dateTime" width="180">
                    <template slot-scope="scope">
                    <div>{{ new Date(scope.row.dateTime).toLocaleString() }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="纬度(°)" prop="latitude" width="100">
                    <template slot-scope="scope">
                    <div>{{ scope.row.latitude }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="经度(°)" prop="longitude" width="100">
                    <template slot-scope="scope">
                    <div>{{ scope.row.longitude  }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="深度(km)" prop="depth" width="85" />
                <el-table-column label="位置" prop="location" width="280">
                </el-table-column>
                <el-table-column label="断层面1走向" prop="trend1" width="90" />
                <el-table-column label="断层面2走向" prop="trend2" width="90" />
                <el-table-column label="断层面1倾角" prop="dipAngle1" width="90" />
                <el-table-column label="断层面1滑动角" prop="slidingAngle1" width="90" />
                <el-table-column label="断层面2倾角" prop="dipAngle2" width="90" />
                <el-table-column label="断层面2滑动角" prop="slidingAngle2" width="90" />
                <el-table-column label="矩心深度(KM）" prop="centroidDepth" width="90" />
            </el-table>
            <el-table
            v-loading="loading"
              :data="smsxgplist"
              v-if="smsxgp"
            >
              <el-table-column label="发震地点" prop="location" />
              <el-table-column label="震级" prop="magnitude" width="100" />
              <el-table-column label="发震时刻" prop="originTime" width="180">
                <template slot-scope="scope">
                  <div>{{ new Date(scope.row.originTime).toLocaleString() }}</div>
                </template>
              </el-table-column>
              <el-table-column label="纬度(°)" prop="latitude" width="100">
                <template slot-scope="scope">
                  <div>{{ scope.row.latitude }}</div>
                </template>
              </el-table-column>
              <el-table-column label="经度(°)" prop="longitude" width="100">
                <template slot-scope="scope">
                  <div>{{ scope.row.longitude  }}</div>
                </template>
              </el-table-column>
              <el-table-column label="深度(km)" prop="focalDepth" width="100" />
              <el-table-column label="名称" prop="uploader" width="200" >
              </el-table-column>
              <el-table-column label="上传时间" prop="uploadTime" width="250" />
              <el-table-column label="下载链接" prop="surl" width="100">
                <template slot-scope="scope">
                  <a style="color:#409EFF" :href="scope.row.surl" target="_blank">下载</a>
                </template>
              </el-table-column>
            </el-table>
            <el-table
                v-loading="loading"
                :data="catalist"
                v-if="cata"
            >

              <el-table-column label="震级" prop="m" width="120" />
              <el-table-column label="发震时刻" prop="occurTime" width="180">
                <!-- <template slot-scope="scope">
                  <div>{{ new Date(scope.row.occurTime).toLocaleString() }}</div>
                </template> -->
              </el-table-column>
              <el-table-column label="纬度(°)" prop="latitude" width="100">
                <template slot-scope="scope">
                  <div>{{ scope.row.latitude }}</div>
                </template>
              </el-table-column>
              <el-table-column label="经度(°)" prop="longitude" width="150">
                <template slot-scope="scope">
                  <div>{{ scope.row.longitude  }}</div>
                </template>
              </el-table-column>
              <el-table-column label="深度(km)" prop="depth" width="150" />
              <el-table-column label="位置" prop="location"></el-table-column>
              <el-table-column label="地震类型" prop="eqType" width="180" />
            </el-table>
            <el-pagination style="margin-top:15px" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
             @current-change="getList" :page-size="10"></el-pagination>
        </div>
    </div>
</template>

<script>
import { seisserverApicount, seisserverOR, seisserverSMS, seisserverORList, seisserverXGPList,
    seisserverSMSList, getStationData, precataCount, getEveList } from "@/api/apiCount"
export default {
  data() {
    return {
      loading: true,
        soon: false,    //速报
        cata: false,      //编目
        sms: false,        //震源机制解
        smsxgp: false,     //震源机制解西瓜皮
        smslist: [],
        soonlist: [],
        catalist: [],
        smsxgplist: [],
        type: '',
        title: '',
        total: 0,
        queryParams: {
            pageNum: 1,
            pageSize: 10
        }
    }
  },
  mounted() {
    this.type = this.$route.query.type
    this.getList({page:1,limit:10})
  },
  methods: {

    getList(page){
        let par = {
            pageNum: page.page,
            pageSize: page.limit,
          }
          if(!page.page){
            par.pageNum = page
            par.pageSize = 10
          }
          if(this.type == 'cata'){
            this.title = '统一编目目录'
            this.cata = true
            seisserverORList(par).then((res)=>{
                this.total = res.total
                this.loading = false
                this.catalist = [...res.records]
              for (let i = 0; i < this.catalist.length; i++){
                this.catalist[i].m = parseFloat(this.catalist[i].m).toFixed(1)
                this.catalist[i].depth = parseFloat(this.catalist[i].depth).toFixed(0)
              }

            })
          }
          if(this.type == 'sms'){
            this.title = '震源机制解目录'
            this.sms = true
            seisserverSMSList(par).then((res)=>{
                this.loading = false
                this.total = res.total
                this.smslist = [...res.records]
            })
          }
          if(this.type == 'smsxgp'){
            this.title = '震源机制解'
            this.smsxgp = true
            seisserverXGPList(par).then((res)=>{
                this.loading = false
                this.total = res.total
                this.smsxgplist = [...res.records]
            })
          }
          if(this.type == 'soon'){
            this.title = '速报目录'
            this.soon = true
            getEveList({...par,m:''}).then(res=>{
                this.soonlist = [...res.records]
                this.total = res.total
                this.loading = false
            })
          }

    },
    back() {
        this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    padding: 10px 25px;
    box-sizing: border-box;
    .title {
        padding: 20px 0px;
        width: 100%;
        text-align: center;
    }
    .table {
        width: 100%;
    }
}
</style>
