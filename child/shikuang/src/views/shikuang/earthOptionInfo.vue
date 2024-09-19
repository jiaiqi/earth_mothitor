<template>
  <div class="earthTopic">
    <div class="container commom">
      <div class="topNav">
        <topNav :pageName="'/'+title" :pageNum="4"></topNav>
      </div>
      <div class="search" v-if="JSON.stringify(arr) != '{}'">
        <h3>{{ `${arr.localName}${arr.m}级地震` }}</h3>
        <div class="img">
          <img src="@/assets/images/bgimg2.png" height="100%" alt="" />
          <div class="txt">
            <p>发震时间：{{ new Date(arr.oTime).toLocaleString() }}</p>
            <p>
              发震位置：{{ arr.localName }}<span> 纬度：{{ parseFloat(arr.lat).toFixed(2) }} </span>经度：{{
                parseFloat(arr.lon).toFixed(2)
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="nav"><span>01&nbsp;</span>&nbsp;&nbsp;{{ title }}</div>
      <div class="main">
        <div class="content">
          <div class="cont">
            <div v-html="text"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from '../../components/topNav.vue'
export default {
  data() {
    return {
      title: '',
      arr: {},
      text: '',
    }
  },
  components: {
    TopNav
  },
  created() {
     this.arr = JSON.parse(this.$route.params.arr) 
    this.text = this.$route.params.text
    this.text = this.text.replaceAll('<img style="display:none"','<img style="width:500px"')
    this.title = this.$route.params.title
 
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
      padding: 8px 0px;
      border-bottom: 1px solid #ffb682;
    }
    .baseInfo {
      padding: 15px 35px;
    }
    .prodItem {
      width: 100%;
      margin: 20px 0px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        width: 420px;
        height: 160px;
        display: flex;
        border: 1px solid #d3d3d3;
        margin: 10px 20px;
        cursor: pointer;
        .left {
          width: 70%;
          .name {
            font-size: 18px;
            font-weight: bold;
            width: 100%;
            padding: 7px 0px;
            color: #fff;
            background-color: #2D90FF;
            text-align: center;
          }
          .itemImage {
            width: 100%;
            max-height: 115px;
            margin-top: 3px;
          }
        }
        .right {
          width: 100%;
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
          .more {
            color: #2D90FF;
            font-size: 14px;
            text-align: end;
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
        .newsRow {
          width: 100%;
          background: url("@/assets/images/newsdot.jpg") no-repeat 5px center;
          padding-left: 20px;
          line-height: 38px;
          height: 38px;
          vertical-align: middle;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
      position: relative;
      top: 89%;
      color: #fff;
      line-height: 35px;
      text-align: center;
      vertical-align: middle;
      background-color: rgba(0, 0, 0, 0.5);
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
