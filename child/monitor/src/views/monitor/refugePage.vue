<template>
  <div class="refuge commom">
    <div class="main">
      <div class="topNav">
        <TopNav :pageName="form.sType == 0 ? '产品服务详情' : '技术服务详情'"></TopNav>
      </div>
      <!-- <div class="asideBtn">
        <div @click="sel('公众服务',1)" style="cursor:pointer;">
        <el-card v-if="(type == 1)" class="active">
          <i class="el-icon-s-custom icon"></i>
          <span>公众服务</span>
        </el-card>
        <el-card v-else>
          <i class="el-icon-s-custom icon"></i>
          <span>公众服务</span>
        </el-card>
      </div>
      <div @click="sel('专业服务',2)" style="cursor:pointer;margin-top: 10px;">
        <el-card class="active" v-if="(type == 2)">
          <i class="el-icon-s-opportunity icon"></i>
          <span>专业服务</span>
        </el-card>
        <el-card v-else>
          <i class="el-icon-s-opportunity icon"></i>
          <span>专业服务</span>
        </el-card>
      </div>
      <div @click="sel('决策服务',3)" style="cursor:pointer;margin-top: 10px;">
        <el-card class="active" v-if="(type == 3)">
          <i class="el-icon-s-custom icon"></i>
          <span>决策服务</span>
        </el-card>
        <el-card v-else>
          <i class="el-icon-s-custom icon"></i>
          <span>决策服务</span>
        </el-card>
      </div>
      <div @click="sel('专项服务',4)" style="cursor:pointer;margin-top: 10px;">
        <el-card class="active" v-if="(type == 4)">
          <i class="el-icon-s-opportunity icon"></i>
          <span>专项服务</span>
        </el-card>
        <el-card v-else>
          <i class="el-icon-s-opportunity icon"></i>
          <span>专项服务</span>
        </el-card>
      </div>
    </div> -->
      <el-card class="contant">
        <div class="head">
          <div class="back" @click="back"><i class="el-icon-back"></i></div>
          <div class="title">
            <h2>{{form.sname}}</h2>
          </div>
          <div class="titleRow">
            <p>联系单位: <span>{{form.cunit}}</span></p>
            <p>发布时间: <span>{{form.cdate}}</span></p>
            <p>服务分类: <span>{{form.sclassification}}</span></p>
          </div>
        </div>
        <div class="recom">
          <i :class="recomIcon" style="font-size:19px;"></i>
          {{form.recom}}
        </div>
        <div class="artical" v-if="isShow">
          <div v-html="form.stext"></div>
        </div>
        <!-- <div class="attachs">
          <div class="head">相关电子文件</div>
          <div class="fileList">
            <div class="file" v-for="item in fileList" :key="item.url">
              <a :href="item.url">{{ item.name }}</a>
              <div style="color: #1492ff;cursor: pointer;">下载</div>
            </div>
          </div>
        </div> -->
      </el-card>
    </div>
  </div>
</template>

<script>
import { getHtml, addRemod } from "@/api/serve";
import { encode, decode } from '@/utils/base/dataEncry.js';
export default {
  data() {
    return {
      // 表单参数
      form: {
        id: '',
        sname: '',
        stype: '',
        cunit: '',
        sclassification: '',
        stext: '',
        cdate: '',
        recom: '',
      },
      type: 0,
      serveType: '',
      xjml: true,
      recomIcon: 'el-icon-view',
      isShow: false,
      fileList: [
        {
          name: '中国及邻近地区地震构造图(Tab).pdf',
          url: ''
        },
        {
          name: '中国及邻近地区地震构造图.jpg',
          url: ''
        }
      ],
    }
  },
  mounted() {
    if(this.$route.params.type){
      this.type = this.$route.params.type
    }else{
      this.type = 0
    }
    this.form = JSON.parse(sessionStorage.getItem('datas'));
    if(this.form.SName){
      //字段替换
      this.form.sname = this.form.SName
      this.form.stype = this.form.sType
      this.form.cunit = this.form.cUnit
      this.form.sclassification = this.form.sClassification
      this.form.stext = this.form.sText
      this.form.cdate = this.form.cDate
    }
    this.form.cdate = this.getTime(this.form.cdate);
    this.form.sclassification = this.form.sclassification.split('/')[1]
    if(this.form.stype == 0){
      this.xjml = false
    }else {
      this.xjml = true
    }
    this.getText()
    this.addRe()
    // alert(JSON.stringify(this.form))
  },
  methods: {
    jumpMl() {
      this.$router.push({name:'productlist', query:{ type:1 }})
    },
    jumpDw() {
      this.$router.push({name:'productlist', query:{ type:0 }})
    },
    addRe() {
      this.form.recom = ''
      let par = {
        id: this.form.id
      }
      addRemod(encode(par)).then(response => {
        this.form.recom = response
      })
    },
    sel(name,type) {
      if(name == '公众服务' || name == '专业服务' || name == '决策服务' || name == '专项服务'){
        this.serveType = name
      }
      this.$router.push({path: 'productlist', query:{type: type}})
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
      if(this.type != 0){
        this.$router.push({path: '/productlist', query:{type: this.type}})
      }else{
        this.$router.push({path: '/productlist'})
      }
    },
    getText() {
      let par = {
          id: this.form.id
        }
      getHtml(encode(par)).then(response => {
        this.form.stext = response
        //判断是否包含图片
        if(this.form.stext.indexOf('<img') != -1){
          //图片添加样式
          this.form.stext = this.form.stext.replace(/'<img'/g, '<img style="object-fit: contain;padding: 8px 0px;" ') 
          // this.form.stext = this.form.stext.replaceAll('<img', '<img style="object-fit: contain;padding: 8px 0px;" ') 
        }
        this.isShow = true
       });
    },
  }
}
</script>

<style lang="less" scoped>
*{
font-family: '宋体';
}
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
      width: 70%;
      min-width: 700px;
      // background: url('../../assets/images/bg-001.png') no-repeat;
      // background-size: calc( 100% - 5px );
      margin-top: 50px;
      .head {
        padding: 45px 30px;
        height: 70px;
        display: flex;
        flex-direction: column;
        align-content: space-between;
        .back {
          font-size: 25px;
          font-weight: bold;
          position: absolute;
          cursor: pointer;
        }
        .title {
          text-align: center;
        }
        .titleRow {
          width: 100%;
          margin-top: 10px;
          line-height: 20px;
          padding: 15px 0px;
          font-size: 13px;
          color: rgb(107, 107, 107);
          border-bottom: 2px solid rgba(60, 125, 255, 0.35);
          border-bottom: 1px solid rgba(114, 114, 114, 0.35);
          display: flex;
          justify-content: space-around;
        }
      }
      .artical {
        position: relative;
        // height: 600px;
        top: 70px;
        padding: 30px 60px 80px 60px;
        // background-color: #dce9f9;
      }
      // .attachs {
      //   padding: 15px 25px 70px 15px;
      //   .head {
      //     font-weight: bold;
      //   }
      //   .fileList {
      //     width: 100%;
      //     position: relative;
      //     left: 30%;
      //     display: flex;
      //     flex-direction: column;
      //     .file {
      //       display: flex;
      //       width: 50%;
      //       padding: 5px 0px;
      //       justify-content: space-between;
      //     }
      //   }
      // }
      // a {
      //   color: #1492ff;
      // }
      // a:hover {
      //   text-decoration: underline;
      // }
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
