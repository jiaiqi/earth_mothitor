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
        <img v-if="!noImg" :src="url" style="width: 100%;" alt="图片加载中...">
      </div>
    </el-dialog>
      <el-card class="contant">
        <div class="head">
          <div class="back" @click="back"><i class="el-icon-back"></i></div>
          <div style="display: flex;">
            <div v-if="!noImg" class="aside" @click="openImg">
              <img :src="url" style="width: 100%;" alt="图片加载中...">
            </div>
            <div v-if="noImg" class="nopic">
              <i class="el-icon-picture" style="font-size: 28px;"></i>
              暂无图片</div>
            <div style="width: 70%">
              <div class="title">
                <span>{{form.name}}</span>
              </div>
              <div class="titleRow">
                <p>提供单位: <span>{{form.institution}}</span></p>
                <!-- <p style="padding-left:50px">阅读量: <span>{{form.recom}}</span></p> -->
                <!-- <p>发布时间: <span>{{form.cdate}}</span></p> -->
                <!-- <p>服务分类: <span>{{form.sclassification}}</span></p> -->
              </div>
              <div class="information">
                <div class="info-row">
                  <p class="name">编号：</p>
                  <p class="text">{{ form.id }}</p>
                </div>
                <div class="info-row">
                  <p class="name">产品名称：</p>
                  <p class="text">{{ form.name }}</p>
                </div>
                <div class="info-row">
                  <p class="name">产品描述：</p>
                  <p class="text">{{ form.description }}</p>
                </div>
                <div class="info-row">
                  <p class="name">关键词：</p>
                  <p class="text">{{ form.keyword }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="map">
            <div v-if="form.mapUrl" class="toMap" @click="toMap">地图模式</div>
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
            <div class="file" v-for="item in fileList" :key="item.url">
              <a :href="item.url">{{ item.name }}</a>
              <div style="color: #1492ff;cursor: pointer;" @click="downLoad(item.url)"></div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Loading } from 'element-ui';
import { getlist, getLinkFileImg } from "@/api/serve";
import { encode, decode } from '@/utils/base/dataEncry.js';
export default {
  data() {
    return {
      // 表单参数
      form: {
        id: '',
        classification: '',
        name: '',
        institution: '',
        keyword: '',
        pinstitution: '',
        description: '',
        type: '',
        remark: ''
      },
      id: 0,
      type: 0,
      serveType: '',
      url: '',
      recomIcon: 'el-icon-view',
      isShow: false,
      fileList: [],
      dialogVisible: false,
      noImg: false
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.getInfo()
  },
  methods: {
    getInfo() {
      const loading = Loading.service({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
        });
      let par = {
        pageNum:1,
        pageSize:50
      }
      let par2 = {
        id: this.id
      }
      getlist(par).then(res =>{
        loading.close();
        res.records.map((item)=>{
          if(item.id == this.id){
            this.form = item
          }
        })
      })
      getLinkFileImg(par2).then(res =>{
        let reg = /^(\s|\S)+(jpg|jpeg|png|JPG|PNG|gif|GIF)+$/;
        loading.close();
        decode(res).forEach(item => {
          if(reg.test(item.url)){
            this.url = item.url
          }else {
            this.fileList.push(item)
          }
        })
        if(this.url == ''){
          this.noImg = true
        }
      })
    },
    openImg() {
      this.dialogVisible = true
    },
    downLoad(item) {
      window.open(item)
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
      this.$router.push({path: '/prodAchevList', query:{type: this.type}})
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
      width: 75%;
      min-width: 700px;
      height: 1000px;
      // background: url('../../assets/images/bg-001.png') no-repeat;
      // background-size: calc( 100% - 5px );
      margin-top: 50px;
      .aside {
        width: 30%;
        height: 200px;
        margin-right: 10px;
        cursor: pointer;
      }
      .nopic {
        width: 30%;
        height: 200px;
        background-color: rgb(234, 234, 234);
        text-align: center;
        line-height: 180px;
        margin-right: 10px;
        vertical-align: middle;
      }
      .head {
        padding: 10px 10px;
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
        .information {
          background-color: #ededed;
          border: 2px solid #c6c6c6;
          padding: 6px 16px;
          .info-row {
            padding: 6px 0px;
            display: flex;
            .name {
              color: rgb(118, 118, 118);
              width: 140px;
            }
            .text {
              color: rgb(91, 91, 91);
              width: 100%;
            }
          }
        }
        .title {
          text-align: left;
          font-size:27px;
          color: #e55b00;
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
        padding: 120px 25px 70px 50px;
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
