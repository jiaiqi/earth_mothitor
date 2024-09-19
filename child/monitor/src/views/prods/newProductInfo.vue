<template>
  <div class="refuge commom">
    <div class="main">
      <div class="topNav">
        <TopNav :pageName="'产品服务详情'"></TopNav>
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        width="70%">
        <div>
          <img :src="url" style="width: 100%;" alt="图片加载中...">
        </div>
      </el-dialog>
      <el-card class="contant">
        <div class="head">
          <div class="back" @click="back"><i class="el-icon-back"></i></div>
          <div style="display: flex;margin-top: 25px;justify-content:center;width: 100%;">
            <div v-if="showImg" class="aside" @click="openImg">
              <img :src="url" style="width: 100%;" alt="图片加载中...">
            </div>
            <div v-else class="aside">
              <img src="../../assets/images/default.png" style="width: 300px; height: 200px">
            </div>
            <div style="width: 58%">
              <div class="title">
                <span>{{form.productName}}</span>
              </div>
              <div class="information" style="padding:6px 12px">
                <div class="info-row">
                  <p class="name">编号：</p>
                  <p class="text">{{ form.id }}</p>
                </div>
                <div class="info-row">
                  <p class="name">产品名称：</p>
                  <p class="text">{{ form.productName }}</p>
                </div>
                <div class="info-row">
                  <p class="name">所属目录名称：</p>
                  <p class="text">{{ form.directoryName }}</p>
                </div>
                <div class="info-row">
                  <p class="name">提供单位：</p>
                  <p class="text">{{ form.providerUnit }}</p>
                </div>
                <div class="info-row">
                  <p class="name">关键词：</p>
                  <p class="text">{{ form.keyword }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="applyBtn"><el-button type="primary" @click="applyData">申请数据</el-button></div>
          <div class="information-main">
            <div class="title" style="margin-top:20px;padding-left:50px;text-align: left;width: 100%;">
              <span>产品信息</span>
            </div>
          <div class="information infoRow">
                <div class="info-row" v-if="form.directoryName == 'GNSS产品'">
                  <p class="name">产品描述：</p>
                  <p class="text">{{ form.description }}</p>
                </div>
                <div class="info-row">
                  <p class="name">编制时间：</p>
                  <p class="text" v-if="form.directoryName == '地磁产品' || form.directoryName == '重力产品'
                    || form.directoryName == '地电产品' || form.directoryName == '地倾斜'|| form.directoryName == '地应变'">
                  {{ form.pTime }}</p>
                  <p class="text" v-else>{{ new Date(form.pTime).toLocaleDateString() }}</p>
                </div>
                <div class="info-row">
                  <p class="name">产品内容：</p>
                  <p class="text">{{ form.productContent }}</p>
                </div>
                <div class="info-row">
                  <p class="name">功能用途：</p>
                  <p class="text">{{ form.functionUse }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == '地下流体' || form.directoryName == '地磁产品' || form.directoryName == '重力产品'
                || form.directoryName == '地电产品' || form.directoryName == '地倾斜'|| form.directoryName == '地应变'">
                  <p class="name">台网代码：</p>
                  <p class="text">{{ form.networkCode }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == '地下流体' || form.directoryName == '地磁产品' || form.directoryName == '重力产品'
                || form.directoryName == '地电产品' || form.directoryName == '地倾斜'|| form.directoryName == '地应变'">
                  <p class="name">台站代码：</p>
                  <p class="text">{{ form.stationCode }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == '地下流体' || form.directoryName == '地磁产品' || form.directoryName == '重力产品'
                || form.directoryName == '地电产品' || form.directoryName == '地倾斜'|| form.directoryName == '地应变'">
                  <p class="name">台站名称：</p>
                  <p class="text">{{ form.stationName }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == '地下流体' || form.directoryName == '地磁产品' || form.directoryName == '重力产品'
                || form.directoryName == '地电产品' || form.directoryName == '地倾斜'|| form.directoryName == '地应变'">
                  <p class="name">测点代码：</p>
                  <p class="text">{{ form.testCode }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == '地下流体' || form.directoryName == '地磁产品' || form.directoryName == '重力产品'
                || form.directoryName == '地电产品' || form.directoryName == '地倾斜'|| form.directoryName == '地应变'">
                  <p class="name">仪器名称型号：</p>
                  <p class="text">{{ form.instrumentName }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == '地下流体' || form.directoryName == '地磁产品' || form.directoryName == '重力产品'
                || form.directoryName == '地电产品' || form.directoryName == '地倾斜'|| form.directoryName == '地应变'">
                  <p class="name">测项代码：</p>
                  <p class="text">{{ form.measurementCode }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == '地下流体' || form.directoryName == '地磁产品' || form.directoryName == '重力产品'
                || form.directoryName == '地电产品' || form.directoryName == '地倾斜'|| form.directoryName == '地应变'">
                  <p class="name">分量代码：</p>
                  <p class="text">{{ form.numberCode }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == 'GNSS产品' || form.directoryName == '地下流体'">
                  <p class="name">场地类型：</p>
                  <p class="text">{{ form.landType }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == '地下流体' || form.directoryName == '地磁产品' || form.directoryName == '重力产品'
                || form.directoryName == '地电产品' || form.directoryName == '地倾斜'|| form.directoryName == '地应变'">
                  <p class="name">采样率：</p>
                  <p class="text">{{ form.samplingRate }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == 'GNSS产品' || form.directoryName == '断层形变' || form.directoryName == '地磁产品'
                || form.directoryName == '地电产品' || form.directoryName == '地倾斜'|| form.directoryName == '地应变' || form.directoryName == '重力产品'">
                  <p class="name">时间范围：</p>
                  <p class="text">{{ form.beginEndTime }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == '断层形变'">
                  <p class="name">场地经度：</p>
                  <p class="text">{{ form.longitude }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == '断层形变'">
                  <p class="name">场地纬度：</p>
                  <p class="text">{{ form.latitude }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == 'GNSS产品'">
                  <p class="name">空间范围：</p>
                  <p class="text">{{ form.spacialScale }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == 'GNSS产品'">
                  <p class="name">空间基准及精度：</p>
                  <p class="text">{{ form.spatialGranularity }}</p>
                </div>
                <div class="info-row">
                  <p class="name">原始数据来源：</p>
                  <p class="text">{{ form.originalDataSource }}</p>
                </div>
                <div class="info-row">
                  <p class="name">产品形式：</p>
                  <p class="text">{{ form.productForm }}</p>
                </div>
                <div class="info-row">
                  <p class="name">产品规格：</p>
                  <p class="text">{{ form.productStandard }}</p>
                </div>
                <div class="info-row">
                  <p class="name">产品生成方法：</p>
                  <p class="text">{{ form.productIdea }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == 'GNSS产品' || form.directoryName == '断层形变'">
                  <p class="name">是否包含GIS数据：</p>
                  <p class="text">{{ form.containGis }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == 'GNSS产品' || form.directoryName == '断层形变'">
                  <p class="name">附件（除GIS数据外）：</p>
                  <p class="text">{{ form.accessory }}</p>
                </div>
                <div class="info-row" v-if="form.directoryName == 'GNSS产品' || form.directoryName == '断层形变'">
                  <p class="name">附件（GIS数据）：</p>
                  <p class="text">{{ form.gisAccessory }}</p>
                </div>
              </div>
          </div>
            <div class="information-main">
              <div class="title" style="margin-top:30px;padding-left:50px;text-align: left;width: 100%;">
                <span>分发信息</span>
              </div>
            <div class="information infoRow">
                <div class="info-row">
                  <p class="name">产品格式：</p>
                  <p class="text">{{ form.productFormat }}</p>
                </div>
                <div class="info-row">
                  <p class="name">数据量：</p>
                  <p class="text">{{ form.dataSize }}</p>
                </div>
                <div class="info-row">
                  <p class="name">分发方式：</p>
                  <p class="text">{{ form.distributionMode }}</p>
                </div>
                <div class="info-row">
                  <p class="name">在线链接：</p>
                  <p class="text">{{ form.onlineLink }}</p>
                </div>
                <div class="info-row">
                  <p class="name">分发单位：</p>
                  <p class="text">{{ form.sendUnit }}</p>
                </div>
                <div class="info-row">
                  <p class="name">维护和更新频率：</p>
                  <p class="text">{{ form.frequency }}</p>
                </div>
                <div class="info-row">
                  <p class="name">联系人：</p>
                  <p class="text">{{ form.linkMen }}</p>
                </div>
                <div class="info-row">
                  <p class="name">联系电话：</p>
                  <p class="text">{{ form.tel }}</p>
                </div>
                <div class="info-row">
                  <p class="name">电子邮件：</p>
                  <p class="text">{{ form.email }}</p>
                </div>
                <div class="info-row">
                  <p class="name">联系地址：</p>
                  <p class="text">{{ form.address }}</p>
                </div>
              </div>
              </div>
              <div class="information-main">
                <div class="title" style="margin-top:30px;padding-left:50px;text-align: left;width: 100%;">
                  <span>限制信息</span>
                </div>
                <div class="information infoRow">
                  <div class="info-row">
                    <p class="name">安全限制分级：</p>
                    <p class="text">{{ form.securityLevel }}</p>
                  </div>
                </div>
              </div>
              <div class="information-main">
                <div class="title" style="margin-top:30px;padding-left:50px;text-align: left;width: 100%;">
                  <span>质量信息</span>
                </div>
              <div class="information infoRow">
                <div class="info-row">
                  <p class="name">性能指标：</p>
                  <p class="text">{{ form.performanceIndex }}</p>
                </div>
                <div class="info-row">
                  <p class="name">质量指标：</p>
                  <p class="text">{{ form.qualityIndex }}</p>
                </div>
                <div class="info-row">
                  <p class="name">技术指标：</p>
                  <p class="text">{{ form.technicalIndex }}</p>
                </div>
                </div>
              </div>
              <div class="information-main">
                <div class="title" style="margin-top:30px;padding-left:50px;text-align: left;width: 100%;">
                  <span>产权信息</span>
                </div>
                <div class="information infoRow">
                <div class="info-row">
                  <p class="name">责任单位：</p>
                  <p class="text">{{ form.accountabilityUnit }}</p>
                </div>
                <div class="info-row">
                  <p class="name">责任人：</p>
                  <p class="text">{{ form.dutyOfficer }}</p>
                </div>
                <div class="info-row">
                  <p class="name">引用格式：</p>
                  <p class="text">{{ form.citationFormat }}</p>
                </div>
              </div>
          </div>
        </div>
        <!-- <div class="recom">
          <i :class="recomIcon" style="font-size:19px;"></i>
          {{form.recom}}
        </div> -->
        <div class="attachs">
          <div class="head">相关电子文件</div>
          <div class="no-data" v-if="fileList.length == 0">暂无</div>
          <div class="fileList">
            <div class="file" v-for="item in fileList" :key="item.fileUrl">
              <a :href="item.fileUrl">{{ item.fileName }}</a>
              <!-- <div style="color: #1492ff;cursor: pointer;">下载</div> -->
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getFileList, dictionaryList } from "@/api/serve";
import { encode, decode } from '@/utils/base/dataEncry.js';
import { Notification } from 'element-ui'
export default {
  data() {
    return {
      // 表单参数
      form: {},
      id: 0,
      type: -1,
      name:"",
      serveType: '',
      url: '',
      showImg: true,
      recomIcon: 'el-icon-view',
      isShow: false,
      fileList: [],
      typeId: null,
      dialogVisible: false,
    }
  },
  mounted() {
    let routeinfo=sessionStorage.getItem('prodPageInfoX');
    if(routeinfo!=null){
      this.type=routeinfo.id;
      this.name=routeinfo.name;
    }
    if(this.type === -1){
         this.type = this.$route.query.type ? parseInt(this.$route.query.type) : 0
    }
    let data = sessionStorage.getItem('prodInfo')
    this.form = JSON.parse(data)
    if(this.form.directoryName == '地下流体'){
      this.form.keyword = this.form.keyWord
      this.form.pTime = this.form.productTime
      this.form.originalDataSource = this.form.dataSource
      this.form.productIdea = this.form.idea
      this.form.productFormat = this.form.formate
      this.form.distributionMode = this.form.sendType
      this.form.linkMen = this.form.linkMan
      this.form.securityLevel = this.form.saftType
      this.form.performanceIndex = this.form.performance
      this.form.technicalIndex = this.form.jobIndex
      this.form.accountabilityUnit = this.form.propertyUnit
      this.form.dutyOfficer = this.form.propertyMan
    }
    if(this.form.directoryName == '断层形变'){
      this.form.keyword = this.form.keyWord
      this.form.pTime = this.form.productTime
      this.form.functionUse = this.form.functionUsr
      this.form.beginEndTime = this.form.timeRange
      this.form.accessory = this.form.addFile
      this.form.gisAccessory = this.form.gisAddFile
      this.form.email = this.form.eamil
      this.form.productIdea = this.form.generationMethod
      this.form.accountabilityUnit = this.form.dutyUnit
      this.form.dutyOfficer = this.form.dutyPerson
      this.form.originalDataSource = this.form.dataSource
      this.form.distributionMode = this.form.sendType
      this.form.linkMen = this.form.linkMan
      this.form.securityLevel = this.form.saftType
    }
    if(this.form.directoryName == '地磁产品' || this.form.directoryName == '地电产品'
       || this.form.directoryName == '地倾斜' || this.form.directoryName == '地应变' || this.form.directoryName == '重力产品'){
      this.form.keyword = this.form.keyWord
      this.form.providerUnit = this.form.provide
      this.form.pTime = this.form.writeTime.slice(0,8)
      this.form.networkCode = this.form.stationId
      this.form.stationCode = this.form.stationNum
      this.form.instrumentName = this.form.instrumentType
      this.form.measurementCode = this.form.testCode
      this.form.numberCode = this.form.componentCode
      this.form.beginEndTime = this.form.strEndTime
      this.form.productStandard = this.form.productSpecification
      this.form.functionUse = this.form.ufunction
      this.form.citationFormat = this.form.referenceFormat
      this.form.dutyOfficer = this.form.propertyOwner
      this.form.accountabilityUnit = this.form.propertyUnit
      this.form.securityLevel = this.form.safetyClassification
      this.form.address = this.form.contactAddress
      this.form.tel = this.form.contactNumber
      this.form.linkMen = this.form.contactPerson
      this.form.frequency = this.form.renewalFrequency
      this.form.sendUnit = this.form.distributionUnit
      this.form.dataSize = this.form.dataVolume
      this.form.accessory = this.form.addFile
      this.form.productIdea = this.form.generationMethod
      this.form.originalDataSource = this.form.dataSource
    }
    this.getDictId()
  },
  methods: {
    openImg() {
      this.dialogVisible = true
    },
    getAttach() {
      let par = {
        productId: this.form.id,
        typeId: this.typeId
      }
      let reg = /^(\s|\S)+(jpg|jpeg|png|JPG|PNG|gif|GIF)+$/;
      getFileList(encode(par)).then(res => {
        decode(res).forEach(item=>{
          if(reg.test(item.fileUrl)){
            this.url = item.fileUrl
          }else {
            this.fileList.push(item)
          }
        })
        if(this.url == ''){
          this.showImg = false
        }
      })
    },
    //获取字典id
    getDictId() {
      if(this.form.directoryName == '定点形变产品' || this.form.directoryName == '重力产品' || this.form.directoryName == '地磁产品' || this.form.directoryName == '地电产品'){
        this.typeId = 3
        this.getAttach()
        return
      }
      dictionaryList(encode({productName: this.form.directoryName})).then(res=>{
        let data = decode(res)
        this.typeId = data[0].id
        this.getAttach()
      })
    },
    gotoCheck(name) {
      // 向基项目发送数据
      window.microApp && window.microApp.dispatch({ route: { name } })
    },
    applyData() {
      //判断用户是否登录
      if(getToken()){
        let info = [{
          classesStandby: '分发单位：'+this.form.sendUnit+'；联系人：'+this.form.linkMen+'；电话：'+this.form.tel+'；邮件：'+this.form.email,
          orderClasses: this.form.directoryName+'_'+this.form.productName+'；编号：'+this.form.id,
          sentDept: this.form.sendUnit,
          subjectId: 99,
        }]
        sessionStorage.setItem('orderList',JSON.stringify(info))
        this.gotoCheck('orderInfo')
      }else{
        Notification.error({
          title: '用户未登录，请登录后再试'
        })
      }
    },
    // addRe() {
    //   this.form.recom = ''
    //   let par = {
    //     id: this.form.id
    //   }
    //   addRemod(encode(par)).then(response => {
    //     this.form.recom = response
    //   })
    // },
    sel(name,type) {
      if(name == '公众服务' || name == '专业服务' || name == '决策服务' || name == '专项服务'){
        this.serveType = name
      }
      this.$router.push({path: 'productlist', query:{type: type}})
      this.type = type
    },
    getTime(time) {
      let date = new Date(time)
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (parseInt(month) < 10) {
        month = '0' + month
      }
      if (parseInt(day) < 10) {
        day = '0' + day
      }
      let times = year + '年' + month + '月' + day + '日';
      return times
    },
    back() {
      console.log(this.type)
      this.$router.push({path: '/prodAchevList', query:{type: this.type,name:this.name}})
    },
    toMap() {
      if(this.form.map == 1 && this.form.mapUrl){
        location.href = this.form.mapUrl
      }
    }
  }
}
</script>

<style lang="less" scoped>
.refuge {
  position: relative;
  top: 3px;
  width: 100%;
  // padding: 0px 400px;
  .topNav {
    position: absolute;
    top: 25px;
    left: 25px;
    background-color: #fff;
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
  }
  .main {
    width: 100%;
    min-height: 500px;
    background: url('../../assets/images/detailBk.jpg') no-repeat;
    background-size: 100% 300px;
    padding: 120px 160px;
    display: flex;
    justify-content: center;
    .asideBtn {
      position: absolute;
      top: 330px;
      left: 160px;
      .icon {
        font-size: 20px;
        margin-right: 5px;
      }
      .active {
        background-color: #1492ff !important;
        color: #fff;
      }
    }
    .contant {
      width: 80%;
      min-width: 700px;
      // background: url('../../assets/images/bg-001.png') no-repeat;
      // background-size: calc( 100% - 5px );
      margin-top: 50px;
      .aside {
        width: 30%;
        height: 230px;
        padding-top: 10px;
        margin-right: 20px;
        cursor: pointer;
      }
      .head {
        padding: 20px 0px;
        display: flex;
        flex-direction: column;
        align-content: space-between;
        .back {
          font-size: 25px;
          font-weight: bold;
          position: relative;
          cursor: pointer;
          top: 0;
        }
        .applyBtn {
          width: 90%;
          padding-top: 25px;
          display: flex;
          justify-content: right;
        }
        .information-main {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .information {
          background-color: #ededed;
          border: 2px solid #c6c6c6;
          padding: 15px 16px;
          width:100%;
          .info-row {
            padding: 6px 0px;
            display: flex;
            .name {
              color: rgb(118, 118, 118);
              width: 220px;
            }
            .text {
              color: rgb(91, 91, 91);
              width: 100%;
            }
          }
        }
        .infoRow {
          width: 90%;
          margin: 5px 0px;
        }
        .title {
          text-align: left;
          font-size:27px;
          color: #e55b00;
          padding-bottom: 10px;
        }
        .titleRow {
          width: 100%;
          line-height: 20px;
          padding: 15px 0px;
          font-size: 14px;
          color: #e55b00;
          border-bottom: 2px solid rgba(60, 125, 255, 0.35);
          border-bottom: 1px solid rgba(114, 114, 114, 0.35);
          display: flex;
          justify-content: flex-start;
        }
        .toMap {
          width: 100px;
          text-align: center;
          padding: 5px 12px;
          border: 1px solid #cbcbcb;
          cursor: pointer;
          position: relative;
          left: 33%;
          top: 20px;
        }
        .toMap:hover {
          border: 1px solid #6eafff;
        }
      }
      .attachs {
        padding: 80px 25px 70px 50px;
        .no-data {
          color: #585858;
          font-weight: bold;
          padding: 10px 10px;
        }
        .head {
          font-size: 17px;
          font-weight: bold;
        }
        .fileList {
          width: 100%;
          position: relative;
          left: 30%;
          display: flex;
          flex-direction: column;
          .file {
            display: flex;
            width: 50%;
            padding: 5px 0px;
            justify-content: space-between;
          }
        }
      }
      a {
        color: #1492ff;
      }
      a:hover {
        text-decoration: underline;
      }
      .recom {
        position: relative;
        top: 65px;
        left: 83%;
        width: 100px;
        z-index: 3;
        // text-align: right;
        color: rgb(87, 87, 87);
        font-size: 13px;
        cursor: pointer;
      }
    }
  }
}
</style>
