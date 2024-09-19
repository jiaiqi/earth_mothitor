<template>
  <div class="home_page">
  <div style="position: absolute;top:0px" id="home"></div>
    <div @click="goKnow('/backInfo')" class="backInfo">
      <div class="backIcon">
        <img src="@/assets/images/backIcon.png" />
      </div>
        <span>信息反馈</span>
    </div>
    <a href="#home">
      <div class="toTop">
          <p>
            <i class="el-icon-upload2"></i>
          </p>
          回到顶部
      </div>
    </a>
    <div class="center">
      <div class="centerItem bg">
        <div class="itemLeft">
          <div class="top">
            地震数据目录
          </div>
          <div class="middle">
            提供{{this.provinceName}}地震局产出、汇集或收集整理的地震观测数据、探测数据、调查(考察)数据、实验与试验数据的基础数据目录和原始数据目录。
          </div>
          <div class="bottom" @click="toPath('数据目录')">
            点击查看详情>>
          </div>
        </div>
        <div class="itemRight">
          <img class="itemRightImg" src="@/assets/images/sanwei.png"/>
        </div>
      </div>
      <div class="centerItem bg2">
        <div class="itemLeft">
          <div class="top">
            产品目录
          </div>
          <div class="middle">
            提供{{this.provinceName}}地震局产出、汇集或收集整理的防震减灾综合数据集目录(地震预测与预报数据、地震灾害防御数据、地震科技领域数据等)、专题数据集目录及可视化产品目录服务。
          </div>
          <div class="bottom" @click="toPath('prodAchevPage')">
            点击查看详情>>
          </div>
        </div>
        <div class="itemRight">
          <img class="itemRightImg" src="@/assets/images/qht.png"/>
        </div>
      </div>
      <div class="centerItem bg3">
        <div class="itemLeft">
          <div class="top">
            技术服务目录
          </div>
          <div class="middle">
            提供{{this.provinceName}}地震局产出、汇集或收集整理的防震减灾综合数据集目录(地震预测与预报数据、地震灾害防御数据、地震科技领域数据等)、专题数据集目录及可视化产品目录服务。
          </div>
          <div class="bottom" @click="toPath('productlist')">
            点击查看详情>>
          </div>
        </div>
        <div class="itemRight">
          <img class="itemRightImg" src="@/assets/images/diqiu.png"/>
        </div>
      </div>
    </div>
    <!-- <div class="box">
      <div class="box_commom commom">

      </div>
    </div> -->
    <!-- <div class="footer commom">
      <nav-list></nav-list>
    </div> -->
    <footer-bottom></footer-bottom>
  </div>
</template>

<script>
// import { removeToken } from '@/utils/auth.js'
import Slider from '@/components/title/scrollPrompt.vue'
import footerBottom from '@/components/layout/footerBottom.vue'
// import titleTop from '@/components/layout/titleTop.vue'
import Catalogue from '@/components/catalogue/index.vue'
import EarthTopic from '@/components/earthTopic/index.vue'
import recomand from '@/components/recomand/index.vue'
import newsTopic from '@/components/newsTopic/index.vue'
import Profession from '@/components/profession/index.vue'
import book from '@/assets/images/book.png'
import navList from '@/components/navList/index.vue'

export default {
  data() {
    return {
      bookImg: book,
      radio: '1',
      // 下拉搜索框
      selectInput: '',
      // 下拉
      select: '',
      provinceName: '',
      activeName: 'first',
      open: false, //图书期刊弹窗
      showRec: true, //推荐动态浮窗
      right: 78,
      bottom: 58,
      list: [],
      redTime: null,
      redTime2: null,
      aticleList: [],
      bgimgs:[require('@/assets/images/index8.png'),require('@/assets/images/index6.png'),require('@/assets/images/index3.png')],
      sliderData: []
    }
  },
  components: {
    Slider,
    Catalogue,
    EarthTopic,
    Profession,
    navList,
    footerBottom,
    recomand,
    newsTopic
    // titleTop,
  },
  mounted() {
    this.provinceName = sessionStorage.getItem('province')
  },
  created() {
        this.floatRec()
        this.floatRec2()
    // if (window.performance.navigation.type === 0) {
    //   // removeToken()
    //   console.log("表示当前页面是通过点击别的链接进入的")
    // }

    // if (window.performance.navigation.type === 1) {
    //   console.log("表示当前页面是通过刷新加载的")
    // }

    // if (window.performance.navigation.type === 2) {
    //   console.log("表示当前页面是通过点击后退按钮或者是通过history.go(-1)加载的")
    // }
    if (location.href.indexOf('/home') === 21) {
      // if (location.href.indexOf("refresh=1") === -1) {
      //   setTimeout(() => { location = location.href + "?refresh=1" }, 100)
      // }
    }
  },
  methods: {
    getSliderTitle(id) {
      // 获取点击的标题
      this.$router.push({
          path: '/shikuang/earthstuation',
          query: {
            id: id,
            type: 1
          }
        })
      // console.log('id:', id)
    },
    closeMove(bool) {
      if(bool){
        clearInterval(this.redTime)
        clearInterval(this.redTime2)
      }else {
        if(this.bottom <= 10 && this.right <= 6){
          return
        }
        this.redTime = null
        this.redTime2 = null
        this.floatRec()
        this.floatRec2()
      }
    },
    getlist(list) {
      this.list = list
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    toPath(path) {
      if(path == '数据目录'){
        this.$router.push({name: 'catalogMenuIntroduce', query: {type: path }})
      }else{
        this.$router.push({name: path})
      }
    },
    //动态飘窗
    floatRec(){
      // if(this.bottom >= 58){
        this.redTime = setInterval(()=>{
          if(this.bottom <= 10){
            // this.floatRec()
            clearInterval(this.redTime)
          }
          this.bottom -= 0.06
        },30)
      // }
      // }else if(this.bottom < 58){
      //   let addTime = setInterval(()=>{
      //     if(this.bottom >= 10){
      //       // this.floatRec()
      //       clearInterval(addTime)
      //     }
      //     this.bottom += 0.1
      //   },70)
      // }
    },
    floatRec2(){
      // if(this.right >= 78){
        this.redTime2 = setInterval(()=>{
          if(this.right <= 6){
            // this.floatRec2()
            clearInterval(this.redTime2)
          }
          this.right -= 0.09
        },30)
      // }
      // }else if(this.right < 80){
      //   let addTime = setInterval(()=>{
      //     if(this.right >= 9){
      //       // this.floatRec2()
      //       clearInterval(addTime)
      //     }
      //     this.right += 0.15
      //   },70)
      // }
    },
    // 跳转科普子项目
    goKnow(path) {
      this.$router.push({
        path: path
      })
    },
    addHotword(word) {
      this.selectInput = word
    },
    // 刷新页面
    newPage() {
      location.reload([true])
    }
  }
}
</script>

<style lang="less" scoped>
.hotWords {
  width: 65%;
  margin-left: 130px;
  margin-top: 8px;
  display: flex;
  justify-content: space-around;
}
.hotWords span{
  padding: 0px 12px;
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
  font-size: 14px;
  color: #fff;
  border-radius: 22px;
  background-color: rgba(16, 115, 253, 0.5);
}
.bgimg {
  width: 100%;
  height: 370px;
  background-repeat: no-repeat center center;
  background-size: 100% 100%;
}
.box {
  margin: 0 auto;
  width: 100%;
  // height: 500px;
  // background: url(@/assets/images/index.png) no-repeat center center;
  // background-size: 100% 100%;
  padding: 0 20px;
  position: absolute;
  top: 250px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  .box_commom {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    width: 100%;
    .left {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 24px;
      line-height: 200%;
      width: 60%;
      .h1 {
        color: #fff;
        font-size: 42px;
        letter-spacing: 5px;
      }
      .search {
        width: 100%;
        margin-top: 70px;
        /deep/ .el-select .el-input {
          width: 120px;
        }
        /deep/.input-with-select {
          background-color: #fff;
          padding: 3px 2px;
          border-radius: 5px;
          box-shadow: 0px 0px 6px 0px #434343;
        }
        /deep/ .el-input__inner {
          border-radius: 5px;
        }
        /deep/ .el-input__inner:hover {
          border: 1px solid #698CD9;
        }
        /deep/ .el-input-group__append {
          border: 0px;
        }
        .searchBtn {
          color: #fff;
          background-color: #3C62B9;
          margin-left: -13px;
        }
        .searchBtn:last-child {
          margin-left: 23px;
        }
        .searchBtn:hover {
          background-color: #698CD9;
        }
      }
    }
  }
}
.center {
  width: 100%;
  margin-top: 12px;
  .centerItem {
    width: 100%;
    padding: 50px 13%;
    display: flex;
    box-sizing: border-box;
    .itemLeft {
      width: 60%;
      padding: 25px 10%;
      box-sizing: border-box;
      .top {
        font-size: 33px;
        letter-spacing: 2px;
        color: #eeeeee;
      }
      .middle {
        width: 80%;
        text-indent: 2rem;
        color: rgb(226, 226, 226);
        font-size: 16px;
        padding: 20px 0px;
      }
      .bottom {
        font-size: 16px;
        font-weight: bold;
        padding: 10px 0px;
        color: #eeeeee;
        cursor: pointer;
      }
    }
    .itemRight {
      width: 40%;
      .itemRightImg {
        width: 130px;
        height: 130px;
      }
    }
  }
  .centerItem:hover {
    border: 1px solid #0f7fff;
  }
  .bg {
    background: url('@/assets/images/index8.png');
    background-size: 100% 100%;
  }
  .bg2 {
    background: url('@/assets/images/index.png');
    background-size: 100% 100%;
  }
  .bg3 {
    background: url('@/assets/images/index9.png');
    background-size: 100% 100%;
  }
}
.floatRec {
  position: fixed;
  // bottom: 180px;
  // right: 36px;
  // width: 370px;
  width: 18%;
  height: 30%;
  border-radius: 10px;
  background-color: #e5ecf5;
  z-index: 1009;
  padding-right: 6px;
  box-shadow: 1px 1px 3px 1px #b9b9b9;
  .close {
    width:70px;
    height: 50px;
    padding: 8px 15px;
    text-align: right;
    position: absolute;
    top: 5px;
    right: 0px;
    cursor: pointer;
    z-index: 1001;
    font-size: 18px;
  }
}
.backInfo {
  position: fixed;
  bottom: 145px;
  right: 28px;
  width: 64px;
  height: 64px;
  font-size: 12px;
  text-align: center;
  padding-top: 5px;
  color: #2f77c9;
  background-color: rgb(215, 215, 215);
  z-index: 1000;
  border-radius: 3px;
  cursor: pointer;
  .backIcon {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
.backInfo img{
  width: 40px;
  height: 40px;
}
.toTop {
  position: fixed;
  bottom: 70px;
  right: 28px;
  width: 64px;
  height: 64px;
  font-size: 12px;
  text-align: center;
  color: #2f77c9;
  background-color: rgb(215, 215, 215);
  z-index: 1000;
  border-radius: 3px;
  cursor: pointer;
}
.toTop p{
  text-align: center;
  padding: 3px 0px;
  font-size: 25px;
}
.main {
  margin-top: -5px;
  .main_title {
    margin-top: 120px;
    margin-bottom: 40px;
    display: flex;
    justify-content: space-around;
    padding: 0px 15%;
  }
  .main-bottom {
    display: flex;
    width: 100%;
    margin-top: 75px;
    margin-bottom: 35px;
    justify-content: center;
  }
  .main-footer {
    width: 100%;
    background: #f2f3f3;
    padding: 40px;
    .container {
      width: 78%;
      margin: auto;
      display: flex;
      .box1 {
        flex: 1;
        margin: 0 10px;
        cursor: pointer;
        .herder {
          cursor: pointer;
          display: flex;
          color: #ffffff;
          align-items: center;
          position: relative;
          top: 215px;
          background-color: rgba(21, 78, 137, 0.8);
          padding: 8px 5px;
          img {
            height: 27px;
            margin-right: 5px;
          }
        }
        .main {
          height: 220px;
          text-align: center;
        }
      }
      .box1:hover {
        transform:scale(1.1,1.1);
        transition: transform 0.4s ease-out;
        -webkit-transition: transform 0.4s ease-out;
        -moz-transition: transform 0.4s ease-out;
        -o-transition: transform 0.4s ease-out;
        -ms-transition: transform 0.4s ease-out;
      }
    }
  }
}
.footer {
  height: 230px;
  // background: url(@/assets/images/img7.png) no-repeat center center;
  // background-size: 100%;
  display: flex;
  justify-content: center;
  .main {
    width: 85%;
    margin: auto;
    .txt {
      display: flex;
      .title {
        width: 160px;
      }
      .list {
        flex: 1;
        ul {
          display: flex;
          flex-flow: wrap;
          li {
            margin-right: 20px;
            margin-bottom: 10px;
          }
        }
      }
    }
    .txt:nth-child(2) {
      margin: 10px 0;
    }
  }
}
.url {
    text-align: center;
    color: #0099ff;
  }
/deep/.el-carousel__indicators--horizontal {
  bottom: 3px;
  transform: translateX(0);
  left: 80%;
}
@media (max-width: 100%) {
  .notice {
    width: 100%;
  }
}
</style>
