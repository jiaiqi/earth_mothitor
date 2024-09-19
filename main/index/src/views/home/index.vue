<template>
  <div class="home_page">
  <div style="position: absolute;top:0px" id="home"></div>
    <el-dialog :visible.sync="open" width="75%">
        <div style="margin-top: 10px">
          <el-table
          :data="aticleList"
          style="width: 100%;font-size: 17px;"
          height="500"
          >
            <el-table-column
              prop="name"
              label="期刊名称">
            </el-table-column>
            <el-table-column
              prop="url"
              label="链接">
              <template slot-scope="scope">
                <a v-if="scope.row.url == '无'">
                  {{ scope.row.url }}
                </a>
                <a v-else class="url" :href="scope.row.url" target="_blank">
                  {{ scope.row.url }}
                </a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    <!-- <title-top></title-top> -->
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
    <div class="floatRec" v-if="showRec" :style="{'bottom': `${bottom}%`, 'right': `${right}%`}">
        <div class="close" @click="showRec = false">
          <i class="el-icon-close"></i>
        </div>
        <div class="recomm">
          <recomand ref="reCmd" @init0="getInitRec" @enter="closeMove"></recomand>
        </div>
      </div>
    <!-- <el-carousel height="370px" :interval="4000" indicator-position="outside">
      <el-carousel-item v-for="item in bgimgs" :key="item">
        <div class="bgimg" :style="{ 'background': 'url(' + item + ')' }"></div>
      </el-carousel-item>
    </el-carousel> -->
    <div class="box">
      <div class="box_commom commom">
        <div class="notice">
        <div class="notice_con commom">
          <Slider @getTitle="getSliderTitle" @getlist="getlist" />
        </div>
      </div>
        <!-- <div class="left">
          <p class="h1">地震数据目录服务</p>
          <div class="search">
            <el-input
              placeholder="请输入关键字"
              v-model="selectInput"
              class="input-with-select"
              :clearable="true"
            >
              <el-button class="searchBtn" slot="append" icon="el-icon-search">搜索</el-button>
              <el-button class="searchBtn" slot="append" icon="el-icon-search">高级搜索</el-button>
            </el-input>
            <div class="hotWords">
              <span>热搜词：</span>
              <span style="cursor: pointer;" @click="addHotword('地震预警')">地震预警</span>
              <span style="cursor: pointer;" @click="addHotword('地震安评')">地震安评</span>
              <span style="cursor: pointer;" @click="addHotword('GNSS')">GNSS</span>
              <span style="cursor: pointer;" @click="addHotword('地震科学实验场')">地震科学实验场</span>
              <span style="cursor: pointer;" @click="addHotword('门源地震')">门源地震</span>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <div class="main commom">
      <div class="main_title">
        <Catalogue></Catalogue>
        <newsTopic></newsTopic>
      </div>
      <div class="main-bottom">
        <earth-topic :list2="list"></earth-topic>

      </div>
      <div class="main-common">
        <Profession></Profession>
      </div>
      <div class="main-footer">
        <div class="container">
          <div class="box1" @click="goKnow('/shikuang/bigEarthList')">
            <div class="herder" style="width: calc( 100% - 9px );margin-left: 4px;">
              <img src="@/assets/images/book.png" alt="" />
              <h3>大震专题</h3>
            </div>
            <div class="main">
              <img src="@/assets/images/bigeathquack.jpg" width="98%" height="100%" style="box-shadow: 1px 1px 6px 1px #a1a1a1;" alt="" />
            </div>
          </div>
          <div class="box1" @click="goKnow('/monitor/productlist')" >
            <div class="herder">
              <img src="@/assets/images/book.png" alt="" />
              <h3>技术服务</h3>
            </div>
            <div class="main" style="background: #fff;box-shadow: 1px 1px 6px 1px #a1a1a1;">
              <img src="@/assets/images/news1.jpg" width="100%" height="100%" alt="" />
            </div>
          </div>
          <div class="box1" @click="open = true">
            <div class="herder" style="width: calc( 100% - 7px );margin-left: 4px;">
              <img :src="bookImg" alt="" />
              <h3>图书期刊</h3>
            </div>
            <div class="main">
              <img src="@/assets/images/img6.png" width="98%" height="100%" style="box-shadow: 1px 1px 6px 1px #a1a1a1;" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer commom">
      <nav-list></nav-list>
      <!-- <div class="main">
        <div class="txt">
          <div class="title">
            <h3>业务中心节点</h3>
          </div>
          <div class="list">
            <ul>
              <li>中国地震台网中心</li>
              <li>中国地震局第二监测中心</li>
              <li>中国地震局第一监测中心</li>
              <li>中国地震局震害防御中心</li>
            </ul>
          </div>
        </div>
        <div class="txt">
          <div class="title">
            <h3>研究所节点</h3>
          </div>
          <div class="list">
            <ul>
              <li>中国地震局地球物理研究所</li>
              <li>中国地震局地震预测研究所</li>
              <li>中国地震局工程力学研究所</li>
              <li>中国地震局地震研究所（武汉）</li>
              <li>中国地震局地震研究所（兰州）</li>
            </ul>
          </div>
        </div>
        <div class="txt">
          <div class="title">
            <h3>省级节点</h3>
          </div>
          <div class="list">
            <ul>
              <li>北京市地震局</li>
              <li>天津市地震局</li>
              <li>河北省地震局</li>
              <li>山西省地震局</li>
              <li>四川省地震局</li>
              <li>云南省地震局</li>
              <li>新疆地震局</li>
              <li>陕西省地震局</li>
              <li>湖南省地震局</li>
              <li>青海省地震局</li>
            </ul>
          </div>
        </div>
      </div> -->
    </div>
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
      activeName: 'first',
      open: false, //图书期刊弹窗
      showRec: false, //推荐动态浮窗
      right: 78,
      bottom: 58,
      list: [],
      redTime: null,
      redTime2: null,
      aticleList: [
        {
          name: '地震工程与工程振动',
          url: 'https://www.springer.com/journal/11803/'
        },
        {
          name: '山西地震',
          url: 'https://shxdzj.gov.cn/qkzz/'
        },
        {
          name: '地震学报',
          url: 'http://dzxbzz.juqk.net/'
        },
        {
          name: '地震地质',
          url: 'https://www.dzdz.ac.cn/CN/0253-4967/home.shtml'
        },
        {
          name: '世界地震工程',
          url: '无'
        },
        {
          name: '防灾减灾工程学报',
          url: 'http://fzjzgcxb.ijournals.cn/fzjzgcxb/home'
        },
        {
          name: '中国地震',
          url: 'http://zgdz.eq-j.cn/zgdz/ch/index.aspx'
        },
        {
          name: '地震',
          url: 'http://dizhen.ief.ac.cn/CN/1000-3274/home.shtml'
        },
        {
          name: '地震研究',
          url: 'http://dzyj.soripan.net/'
        },
        {
          name: '地震地磁观测与研究',
          url: 'http://www.dzdczz.com/'
        },
        {
          name: '地震工程学报',
          url: 'http://dzgcxb.ijournals.cn/xbdz/home'
        },
        {
          name: '华南地震',
          url: 'http://www.hndzzz.cn/'
        },
        {
          name: '华北地震科学',
          url: 'http://www.nceqsci.com/'
        },
        {
          name: '震灾防御技术',
          url: 'https://www.eq-cedpc.cn/special/40'
        },
        {
          name: '内陆地震',
          url: 'https://lldz.nxhh.net/'
        },
        {
          name: '地震工程与工程振动：英文版',
          url: 'http://www.cquc.net:8088/C/PeriodicalProfile-dzgcygczd-e.aspx#introduction'
        },
        {
          name: '高原地震',
          url: 'http://gydz.mlunwen.com/'
        },
        {
          name: '城市与减灾',
          url: 'http://csjz.cbpt.cnki.net/WKD/WebPublication/index.aspx?mid=csjz'
        },
        {
          name: '大地测量与地球动力学',
          url: 'http://www.jgg09.com/CN/volumn/current.shtml'
        },
        {
          name: '大地测量与地球动力学：英文版',
          url: 'https://www.sciencedirect.com/journal/geodesy-and-geodynamics'
        },
        {
          name: '地球与行星物理论评（中英文）',
          url: 'https://www.sjdz.org.cn/'
        },
        {
          name: '地震动态与参考',
          url: '无'
        },
        {
          name: '地震译文集',
          url: '无'
        },
        {
          name: '地震研究进展（英文）',
          url: 'https://www.editorialmanager.com/eqrea/default2.aspx'
        },
        {
          name: '地震研究（英文）',
          url: '无'
        },
        {
          name: '地震科学进展',
          url: 'https://www.gjdzdt.cn/'
        },
        {
          name: '地震地质译丛',
          url: 'http://dzdzyc.400qikan.com/'
        },
        {
          name: '福建地震(现已停刊)',
          url: 'https://fujdz.xueshu.com.cn/'
        },
        {
          name: '防灾博览',
          url: 'https://fzbl.nxhh.net/'
        },
        {
          name: '防灾减灾学报',
          url: 'http://ddyj.cbpt.cnki.net/'
        },
        {
          name: '国际地震动态',
          url: 'https://www.gjdzdt.org.cn/'
        },
        {
          name: '地震学报：英文版',
          url: 'https://www.dzxb.org/indexen.htm'
        },
        {
          name: '四川地震',
          url: 'http://www.scdzj.gov.cn/dzpd/scdz/'
        },
        {
          name: '自然灾害学报',
          url: 'http://zrzhxb.mlunwen.com/'
        }
      ],
      bgimgs:[require('@/assets/images/index8.png'),require('@/assets/images/index6.png'),require('@/assets/images/index3.png')],
      sliderData: [
        {
          title: '9月5日13时38分西藏那曲市比如县发生3.2级地震',
          id: 1
        },
        {
          title: '9月5日13时28分四川甘孜州泸定县发生3.2级地震',
          id: 2
        },
        {
          title: '9月5日13时28分四川雅安市石棉县发生2.9级地震',
          id: 3
        },
        {
          title: '9月5日13时15分四川甘孜州泸定县发生2.8级地震',
          id: 4
        },
        {
          title: '9月5日13时10分四川雅安市石棉县发生2.9级地震',
          id: 5
        },
        {
          title: '9月5日13时03分四川甘孜州泸定县发生3.1级地震',
          id: 6
        },
        {
          title: '9月5日12时56分四川雅安市石棉县发生4.2级地震',
          id: 7
        },
        {
          title: '9月5日12时52分四川甘孜州泸定县发生6.8级地震',
          id: 8
        }
      ]
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
  mounted() {
    setTimeout(() => {
      this.$refs.reCmd.init0();
    }, 500);
    this.getList()
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
    getInitRec(bool){ 
      if(bool){
         this.showRec=false;
         this.closeMove(bool);
      }else{
        this.showRec=true;
      }
    },
    getlist(list) {
      this.list = list
    },
    handleClick(tab, event) {
      // console.log(tab, event)
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
.notice {
  width: 100%;
  display: inline-flex;
  align-items: center;
  padding: 0 250px;
  height: 50px;
  overflow: hidden;
  position: absolute;
  top: -80px;
  img {
    margin-right: 10px;
  }
  .tit {
    width: 50px;
  }
  .notice_con {
    padding-right: 20px;
    white-space: nowrap;
    overflow: hidden;
  }
}
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
    width: 100%;
    margin-top: 120px;
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
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
