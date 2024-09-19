<template>
  <div class="earthTopic">
    <div class="container commom">
      <div class="topNav">
        <topNav :pageName="' /大震专题详情'" :pageNum="3"></topNav>
      </div>
      <div class="search" v-if="JSON.stringify(arr) != '{}'">
        <h3>{{ `${arr.localName}${arr.m}级地震` }}</h3>
        <div class="img">
          <img src="@/assets/images/bgimg2.png" height="100%" alt="" />
          <div class="txt">
            <p>发震时间：{{ `${new Date(arr.otime).getFullYear()}年${new Date(arr.otime).getMonth() + 1}月${new Date(arr.otime).getDate()}日 ${new Date(arr.otime).toLocaleTimeString()} ` }}</p>
            <p>
              发震位置：{{ arr.localName }}<span> 纬度：{{ parseFloat(arr.lat).toFixed(2) }} </span>经度：{{
                parseFloat(arr.lon).toFixed(2)
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="nav"><span>01&nbsp;</span>&nbsp;&nbsp;最新动态</div>
      <div class="main">
        <!-- <ul style="display: flex">
          <li v-for="item in list" :key="item.id">
            <div class="img">
              <p>{{ item.localName }}{{ item.m }}级地震</p>
            </div>
            <h3>{{ item.localName }}{{ item.m }}级地震</h3>
          </li>
        </ul> -->
        <div class="content" style="height:300px">
          <div class="cont">
            <div style="width: 470px;" v-if="showList" >
            <el-carousel trigger="click" height="335px">
              <el-carousel-item v-for="(item,index) in newImg" :key="index">
                <div v-if="item.imgLink" class="swiperBg" >  
                  <img   style="width: 470px; height: 335px" v-if="item.imgLink" :src="item.imgLink"/>
                  <div class="imgTitle">
                    {{item.title}}
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
            <div class="news">
              <ul style="overflow-y: auto;height:310px;padding-right: 15px;" v-if="NewList.length != 0">
                <li class="newsRow" v-for="item in NewList" :key="item.title"><p :title="item.title" class="textrow" @click="toInfo(item,'新闻动态')">{{ item.title }}</p></li>
              </ul>
              <div class="nodata" v-if="NewList.length == 0">暂无数据</div>
            </div>
          </div>
        </div>
      </div>
      <div class="nav" style="margin-top: 35px;"><span>02&nbsp;</span>&nbsp;&nbsp;专业产品</div>
      <div class="main">
        <div class="content">
          <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="60px">
            <el-form-item label="名称">
              <el-input v-model="formInline.title" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="分类">
              <el-input v-model="formInline.catalog" placeholder="分类"></el-input> 
            </el-form-item>
            <el-form-item>
              <el-button  @click="getCatalogPageLocal">查询</el-button>
              <el-button  @click="onReset">重置</el-button>
            </el-form-item>
          </el-form>
            <div class="title"></div>
            <!-- <div class="baseInfo">
                <p><span style="font-weight: bold">时间：</span><span style="line-height:35px">{{ `${new Date(arr.otime).getFullYear()}年${new Date(arr.otime).getMonth() + 1}月${new Date(arr.otime).getDate()}日 ${new Date(arr.otime).toLocaleTimeString()} ` }}</span></p>
                <p><span style="font-weight: bold">地点：</span><span style="line-height:35px">{{ arr.localName }}</span></p>
                <p><span style="font-weight: bold">震级：</span><span style="line-height:35px">{{ arr.m }}</span></p>
            </div> -->
            <div class="prodItem">
              <div class="item" v-for="item in catalogList" :key="item.title" @click="moreInfo(item.title,item.text)">
                <div class="left">
                  <div class="name">{{item.catalog}}</div>
                  <div>
                    <img class="itemImage" v-if="item.visits && item.visits!==''" :src="item.visits"/>
                    <img class="itemImage" v-else-if="item.catalog==='地震烈度'" src="@/assets/images/dzld.png"/>
                    <img class="itemImage" v-else-if="item.catalog==='发震构造'" src="@/assets/images/fzgz.png"/>
                    <img class="itemImage" v-else-if="item.catalog==='余震序列'" src="@/assets/images/yzxl.png"/>
                    <img class="itemImage" v-else-if="item.catalog==='同震形变'" src="@/assets/images/tzxb.jpg"/>
                    <img class="itemImage" v-else-if="item.catalog==='地震灾害'" src="@/assets/images/yzxl.png"/>
                    <img class="itemImage" v-else-if="item.catalog==='应急救灾'" src="@/assets/images/yjjz.jpg"/>
                    <img class="itemImage" v-else src="@/assets/images/yzxl.png"/>
                  </div>
                 
                
                  <div class="productInfo" >
                       <!-- <div><span>分类：{{item.catalog}}</span></div> -->
                       <div><span>名称：{{item.title}}</span> </div>
                       <div><span>单位：{{item.unit}}</span> </div>
                  </div>
                 
           
                <!-- <div class="right"> 
                 
                </div> -->
              </div> 
              </div>
              <div class="title"></div>
              <div style="width:100%">
              <el-pagination 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange"
                :current-page="formInline.pageNum" 
                :page-size="formInline.pageSize" 
                layout="->,prev, pager, next,total"
                :total="formInline.total">
              </el-pagination>
              </div>
            </div>
          </div>
      </div>
      <div class="nav" style="margin-top: 35px;"><span>03&nbsp;</span>&nbsp;&nbsp;专家研讨</div>
      <div class="main">
        <div class="content">
            <div class="expertNews">
          <el-table
            :data="BigEarNewList"
            height="600"
            :show-header="false"
            stripe
          >
            <el-table-column label="名称" prop="title">
              <template slot-scope="scope">
                <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                  <div style="cursor: pointer;" @click="toInfo(scope.row,'专家研讨')">
                    {{ scope.row.title }}
                  </div>
                </div>
              </template>
              </el-table-column>
              <!-- <el-table-column label="摘要" prop="detail" width="220">
                <template slot-scope="scope">
                  <div style="width: 200px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                    {{ scope.row.detail }}
                  </div>
                </template>
              </el-table-column> -->
              <el-table-column label="来源单位" prop="unit" width="250" />
              <el-table-column label="发布人" prop="author" width="180" />
              <el-table-column label="浏览量" prop="visits" width="180">
                <template slot-scope="scope">
                  <div>
                    <i style="font-size: 18px;padding: 0px 5px;" class="el-icon-view"></i>{{ scope.row.visits?scope.row.visits:0 }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
                <!-- <div class="newsRow2" v-for="item in BigEarNewList.slice(0,8)" :key="item.title"><a :href="item.url">{{ item.title }}</a></div> -->
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { encode, decode } from '@/utils/dataEncry'
import { Loading } from 'element-ui';
import { getList, getZJList, getNewList, getQWList, getCatalogList,getCatalogPage,getList2 } from '@/api/shikuang'
import TopNav from '../../components/topNav.vue'
import {
  hotAdd,
  hotDataAdd
} from '@/api/hots'
import { Scope } from 'eslint-scope'
export default {
  data() {
    return {
      arr: {},
      info: {},
      list: [],
      showList: false,
      catalogList:[],
      NewList: [],
      newImg: [],
      cataImgList: [
        {
          name: '统一思想 开启防震减灾工作高质量发展新局面',
          img: require('@/assets/images/BigEarImg.jpg')
        },
        {
          name: '中国地震局党组关于进一步加强地震监测预报工作的实施意见',
          img: require('@/assets/images/BigEarImg2.png')
        }
      ],
      BigEarNewList: [],
      formInline:{
        catalog:"",
        title:"",
        spid:"",
        pageNum: 1,
        pageSize: 9,
        total: 0,
      }, 
      id:"",
      spid:"",
    }
  },
  components: {
    TopNav
  },
  mounted() {
    this.id = this.$route.query.id
    this.spid = this.$route.query.spid  
    //如果数据丢失
    if(!this.id || !this.spid || this.id==="" || this.spid==="") {
      this.id = sessionStorage.getItem('id')
      this.spid = sessionStorage.getItem('spid')
    }
    else{
      sessionStorage.setItem('id', this.id)
      sessionStorage.setItem('spid',this.spid)
    }
    let arr = {}
    const loading = Loading.service({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
        });
    setTimeout(() => {
      this.getCatalogPageLocal();
      getList2({
        pageNum:1,
        pageSize:999,
        flag:1
      }).then((res) => {
        this.list = res.records
        this.list.forEach((item) => {
          if (item.spId == this.id) {
            arr = item
          }
        })
        this.arr = arr
        this.addHot(`${arr.localName}${arr.m}级地震`,'/shikuang/earthOption?id='+this.id+'&spid='+this.spid)
        loading.close();
      }).catch((e) => {
      })
      //专家研讨
      getZJList({
        pageNum: 1,
        pageSize: 999,
        spid: this.id
      }).then(res=>{
        loading.close();
        this.BigEarNewList = res.records
      })
      // 最新动态
      // getCatalogList(formInline).then(res=>{
      //   this.catalogList = res.records;
      //   formInline.total=res.total;
      // }) 
          // 最新动态
      getNewList({
        spid: this.id
      }).then(res=>{
        this.NewList = res
        this.NewList.forEach(item=>{
          if(item.imgLink != ''){
            this.showList = true
            this.newImg.push({
              imgLink: item.imgLink,
              title: item.title
            })
          }
        })
      })
      //权威发布
      // getQWList(id).then(res=>{
      //   if(res.length != 0){
      //     this.info = res[0]
      //     this.info.spInfo = this.info.spInfo.replaceAll('<img','<img style="display:none"')
      //     this.info.spCkwx = this.info.spCkwx.replaceAll('<img','<img style="display:none"')
      //     this.info.spDzzh = this.info.spDzzh.replaceAll('<img','<img style="display:none"')
      //     this.info.spLd = this.info.spLd.replaceAll('<img','<img style="display:none"')
      //     this.info.spFzgz = this.info.spFzgz.replaceAll('<img','<img style="display:none"')
      //     this.info.spTzxb = this.info.spTzxb.replaceAll('<img','<img style="display:none"')
      //     this.info.spYjjz = this.info.spYjjz.replaceAll('<img','<img style="display:none"')
      //     this.info.spYzxl = this.info.spYzxl.replaceAll('<img','<img style="display:none"')
      //   }
      //   loading.close();
      // })
    }, 100);
  },
  methods: { 
    onReset(){
       this.formInline={
        catalog:"",
        title:"",
        spid:"",
        pageNum: 1,
        pageSize: 9,
        total: 0,
      };
      this.getCatalogPageLocal();
    },
   
   handleSizeChange(val) {
                this.formInline.pageSize = val;
                this.formInline.pageNum = 1;
                this.getCatalogPageLocal();
    },
    handleCurrentChange(val) {
        this.formInline.pageSize = val;
                this.formInline.pageNum = 1;
                 this.getCatalogPageLocal();
    },
     
  // 最新动态
  getCatalogPageLocal(){
    this.formInline.spid=this.id;
     getCatalogPage(this.formInline).then(res=>{
        this.catalogList = res.records;
        this.formInline.total=res.total;
      })
  },
 
    moreInfo(title,info) {
      this.$router.push({name:'earthOptionInfo', params: {
        title: title,
        text: info,
        arr: JSON.stringify(this.arr)
      }})
    },
    //新增热点搜索
    addHot(name,url){
      let form = {
            keyName: '大震专题-'+name,
            url: url,
            linkUnit: ''
          }
      hotDataAdd(encode(form)).then()
    },
    toInfo(item,title) {
      if(item.url != '' && item.text == ''){
        if(item.url.indexOf('http://') == -1 && item.url.indexOf('https://') == -1){
          window.open('http://'+item.url)
        }else {
          window.open(item.url)
        }
      }else if(item.text != ''){
        this.moreInfo(title,item.text)
      }
    },
  }
}
</script>

<style lang="less" scoped>
.earthTopic {
  width: 100%;
  height: 100%;
  padding-bottom: 100px;
.container {
  background: #f6f6f7 url(@/assets/images/bgimg1.png) no-repeat top;
  background-size: 100%;
  position: relative;
  padding-top: 20px;
  padding-bottom: 30px;
  .topNav {
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: #fff;
    padding: 6px 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
    opacity: 0.9;
  }
  .search {
    margin: 0 auto;
    width: 40%;
    text-align: center;
    color: #fff;
    font-size: 26px;
    position: relative;
    top: 40px;
    .img {
      margin-top: 20px;
      height: 100px;
      position: relative;
      img {
        opacity: 0.8;
      }
      .txt {
        position: absolute;
        top: 15px;
        left: 60px;
        text-align: start;
        p {
          font-size: 13px;
          margin-bottom: 5px;
          span {
            margin: 0 10px;
          }
        }
      }
    }
  }
  .nav {
    padding: 10px;
    width: 88%;
    background-color: #fff;
    margin: 100px auto 0;
    border-radius: 5px;
    font-size: 17px;
    span {
      padding: 10px 5px;
      background-color: #fa9d5c;
      font-weight: 700;
      color: #fff;
      display: inline-block;
    }
    span:after {
      content: '';
      border-top: 5px solid #fff;
      border-left: 5px solid #fff;
      border-right: 5px solid #fff;
      border-bottom: 5px solid #fff;
    }
  }
  .main {
    width: 88%;
    background-color: #fff;
    padding: 50px;
    margin: 20px auto 0;
    border-radius: 5px;
  }
  .content {
    width: 100%;
    // background: url(@/assets/images/catalogue.png) no-repeat center;
    // background-position: center;
    // background-repeat: no-repeat;
    // background-size: 100%;
    .title {
      width: 100%;
      font-size: 16px; 
      border-bottom: 1px solid #ffb682;
    }
    .baseInfo {
      padding: 15px 35px;
    }
    .prodItem {
      width: 100%;
      margin: 5px 0px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        width: 275px;
        height: 230px;
        display: flex;
        border: 1px solid #d3d3d3;
        margin: 10px 20px;
        cursor: pointer;
        .left { 
          width: 100%;
          .name {
            font-size: 17px;
            font-weight: bold;
            width: 100%;
            padding: 5px 0px;
            color: #fff;
            background-color: #2D90FF;
            text-align: center;
          }
          .itemImage {
            width: 100%;
            max-height: 148px;
            margin-top: 3px;
          }
          .productInfo{
            color: #2c4858;
            font-size: 14px; 
            float: left;
            margin-left: 4px; 
          }
           .more {
            color: #2D90FF;
            font-size: 14px;
            text-align: end;
            position: fixed;
            margin: 0;
          }
        }
        .right {
          width: 100%;
          max-width: 60%;
          padding: 10px 15px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .info {
            height: 110px;
            overflow:hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 5;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            img {
              width: 50px;
            }
          }
         
          p {
            font-size: 15px;
            color: #3f3f3f;
          }
        }
      }
      .item:hover {
        border: 1px solid #ff9143;
      }
    }
    .cont {
      display: flex;
      width: 100%;
      justify-content: space-between;
      .news {
        width: 430px;
        .nodata {
          text-align: right;
          color: #4d4d4d;
          font-size: 15px;
          width: 100%;
        }
        .newsRow {
          width: 100%;
          background: url("@/assets/images/newsdot.jpg") no-repeat 5px center;
          padding-left: 20px;
          line-height: 38px;
          height: 38px;
          vertical-align: middle;
          .textrow {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
          }
        }
      }
    }
    .swiperBg {
      height: 315px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
    .imgTitle {
      height: 35px;
      position: fixed;
      top: 89%;
      color: #fff;
      line-height: 35px;
      padding: 0px 5px;
      text-align: center;
      vertical-align: middle;
      background-color: rgba(0, 0, 0, 0.5);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .expertNews {
        a {
          font-size: 17px;
          color: #1e1e1e;

        }
        a:hover {
          color: #1305cc;
        }
      .newsRow2 {
        // background: url("@/assets/images/newsdot.jpg") no-repeat 5px center;
        padding-left: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      // .newsRow2:last-child {
      //   border-bottom: 1px solid #c2c2c2;
      // }
      // .newsRow2:nth-last-child(2) {
      //   border-bottom: 1px solid #c2c2c2;
      // }
    }
    .itemText::-webkit-scrollbar {/*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      }
      .itemText::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 2px;
        -webkit-box-shadow: inset 0 0 5px rgba(214, 214, 214, 0.2);
        background: #acacac;
      }
      .itemText::-webkit-scrollbar-track {/*滚动条里面轨道*/
        border-radius: 2px;
        background: #EDEDED;
      }
  }
}
}
ul li a{
  font-size: 18px;
  color: #1e1e1e;
}
ul li:hover {
  text-decoration: underline;
}
</style>
