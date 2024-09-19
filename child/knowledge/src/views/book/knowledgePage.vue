<template>
  <div class="knowledge">
    <div class="box">
      <div class="topNav">
        <tabNav :pageName="'图书期刊'"></tabNav>
      </div>
      <div class="box_commom commom">
        <div class="left dspc">
          <h3>地震知识在线</h3>
          <p style="font-size: 16px">地震早知道19篇，地震来了不慌张5篇</p>
          <p style="line-height: 0; font-size: 16px">
            地震防御住安心6篇，地震科技大进步7篇
          </p>
        </div>
        <div class="right dspc">
          <div class="search">
            <el-input
              placeholder="请输入搜索内容"
              v-model="input"
              class="input-with-select"
              :clearable="true"
            >
              <el-button slot="append" icon="el-icon-search">搜索</el-button>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="container commom">
      <div class="top">
        <div class="left">
          <el-card class="box-card" style="height: 550px; min-width: 630px">
            <div slot="header" class="clearfix">
              <span>地震知识在线</span>
              <el-tabs v-model="activeName">
                <el-tab-pane label="地震知识早知道" name="first"></el-tab-pane>
                <el-tab-pane label="地震来了不慌张" name="second"></el-tab-pane>
                <el-tab-pane label="地震防御住安心" name="three"></el-tab-pane>
                <el-tab-pane label="地震科技大进步" name="fore"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="tab_body" v-if="activeName == 'first'">
              <ul>
                <li
                  style="
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                  "
                  v-for="item in 6"
                  :key="item"
                >
                  <p>同一个地震，尽然有不同震级</p>
                  <span>2022-07-08</span>
                </li>
              </ul>
              <div
                class="buttom"
                style="margin: 10px auto 0; text-align: center"
              >
                <a href="#">更多地震知识文章</a>>
              </div>
            </div>
            <div class="tab_body" v-if="activeName == 'second'">
              <ul>
                <li
                  style="
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                  "
                  v-for="item in 6"
                  :key="item"
                >
                  <p>地球的形状是你想想的那样吗</p>
                  <span>2022-07-08</span>
                </li>
              </ul>
              <div
                class="buttom"
                style="margin: 10px auto 0; text-align: center"
              >
                <a href="#">更多地震知识文章</a>>
              </div>
            </div>
            <div class="tab_body" v-if="activeName == 'three'">
              <ul>
                <li
                  style="
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                  "
                  v-for="item in 6"
                  :key="item"
                >
                  <p>你该知道的地震预警</p>
                  <span>2022-07-08</span>
                </li>
              </ul>
              <div
                class="buttom"
                style="margin: 10px auto 0; text-align: center"
              >
                <a href="#">更多地震知识文章</a>>
              </div>
            </div>
            <div class="tab_body" v-if="activeName == 'fore'">
              <ul>
                <li
                  style="
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                  "
                  v-for="item in 6"
                  :key="item"
                >
                  <p>60年前的这场地震与众不同</p>
                  <span>2022-07-08</span>
                </li>
              </ul>
              <div
                class="buttom"
                style="margin: 10px auto 0; text-align: center"
              >
                <a href="#">更多地震知识文章</a>>
              </div>
            </div>
          </el-card>
        </div>
        <div class="right">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>热点访问排行榜</span>
            </div>
            <div v-for="(o, index) in 10" :key="index" class="text">
              <div class="ri_left">
                <span>{{ index + 1 }}</span>
              </div>
              <p>2008年汶川大地震</p>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tabNav from '@/components/topNav.vue'
export default {
  components: { tabNav },
  data() {
    return {
      input: '',
      activeName: 'first',
      activeName1: 'first'
    }
  }
}
</script>

<style lang="less" scoped>
.knowledge {
  .box {
    margin: 0 auto;
    background-color: #fff;
    width: 1600px;
    height: 240px;
    background: url(@/assets/images/xxzlbj.jpg) no-repeat center center;
    background-size: 100% 100%;
    position: relative;

    .topNav {
      position: absolute;
      z-index: 998;
      top: 20px;
      left: 20px;
      background-color: #fff;
      padding: 10px;
      border-radius: 15px;
      box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
      opacity: 0.9;
    }
    .box_commom {
      color: #fff;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      .left {
        font-size: 26px;
        line-height: 150%;
        .search {
          margin-top: 20px;
          /deep/ .el-select .el-input {
            width: 110px;
          }
          /deep/.input-with-select {
            background-color: #fff;
          }
          /deep/.el-input-group__append {
            background-color: #f1960d;
            color: #fff;
            box-shadow: 0 0 3px #000;
          }
          /deep/ .el-input__inner {
            border: none;
            padding: 5px 20px;
          }
        }
      }
      .right {
        font-size: 20px;
        line-height: 200%;
        i {
          color: #ffe670;
          font-style: normal;
        }
        a {
          color: #fff;
        }
        a:hover {
          color: #ffe670;
        }
      }
    }
  }
  .dspc {
    display: flex;
    flex-direction: column;
    line-height: 180%;
  }
  .container {
    .top {
      display: flex;
      justify-content: space-between;
      .left {
        flex: 1;
        padding: 10px;
        .clearfix {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            display: block;
            width: 167px;
            height: 32px;
            text-align: center;
            color: #fff;
            line-height: 32px;
            background: url(@/assets/images/kptitbg.png) no-repeat center center;
          }
        }
        .tab_body {
          ul {
          }
          .buttom {
            width: 300px;
            height: 50px;
            border-radius: 25px;
            background-color: #f5f6fa;
            line-height: 50px;
            a {
              color: #333;
            }
            a:hover {
              color: #019adf;
            }
          }
          .el-card {
            border-radius: 10px;
          }
          /deep/.el-card__body {
            padding: 0;
          }
        }
      }
      .right {
        width: 300px;
        padding: 10px;
        .box-card {
          border: none;
          height: 550px;
          .text {
            display: flex;
            margin-bottom: 10px;
            .ri_left {
              width: 30px;
              height: 30px;
              background: #e5f2ff;
              text-align: center;
              line-height: 30px;
              margin-right: 10px;
              font-size: 14px;
              color: #007bff;
            }
            p {
              flex: 1;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
  /deep/.el-card__header {
    padding: 0 20px 10px;
  }
  /deep/.el-tabs__header {
    margin: 0;
  }
  .el-card {
    padding: 10px;
  }
  /deep/.el-tabs__nav-wrap {
    border: none;
  }
  /deep/.el-tabs__nav-wrap::after {
    height: 0;
  }
}
@media (max-width: 1600px) {
  .knowledge .box {
    width: 100vw;
    height: 29vh;
  }
}
@media (max-width: 1200px) {
  .knowledge .box {
    width: 1200px;
    height: 240px;
  }
  .knowledge {
    width: 1200px;
    background-color: #e8eaeb;
  }
}
</style>
