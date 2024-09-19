<template>
  <div class="local">
    <top-title></top-title>
    <el-container class="commom main">
      <el-aside width="230px"> <aside-card></aside-card> </el-aside>
      <el-main style="min-width: 800px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>标准规范(<i>地方标准8</i>)</span>
          </div>
          <ul>
            <li class="lis">
              <div class="left">
                <p>DB_T 1－2008 地震行业标准体系表</p>
              </div>
              <div class="right">
                <div>
                  <p>
                    <i class="el-icon-time" style="color: skyblue"></i
                    >更新时间： 2022-04-07
                  </p>
                </div>
                <div>
                  <p>
                    <i class="el-icon-s-fold" style="color: #ffa127"></i
                    >格式：<span>PDF</span>
                  </p>
                </div>
                <div>
                  <el-button type="warning" icon="el-icon-download" size="mini"
                    >下载</el-button
                  >
                </div>
              </div>
            </li>
            <li class="lis">
              <div class="left">
                <p>GB_T 7408-2005 数据元和交换格式 信息交换 日期和时间表示法</p>
              </div>
              <div class="right">
                <div>
                  <p>
                    <i class="el-icon-time" style="color: skyblue"></i
                    >更新时间： 2022-04-07
                  </p>
                </div>
                <div>
                  <p>
                    <i class="el-icon-s-fold" style="color: #ffa127"></i
                    >格式：<span>PDF</span>
                  </p>
                </div>
                <div>
                  <el-button type="warning" icon="el-icon-download" size="mini"
                    >下载</el-button
                  >
                </div>
              </div>
            </li>
            <li class="lis">
              <div class="left">
                <p>
                  DB37 T 4185-2020
                  防震减灾（地震）科普场馆展品（展项）及布展指南
                </p>
              </div>
              <div class="right">
                <div>
                  <p>
                    <i class="el-icon-time" style="color: skyblue"></i
                    >更新时间： 2022-04-07
                  </p>
                </div>
                <div>
                  <p>
                    <i class="el-icon-s-fold" style="color: #ffa127"></i
                    >格式：<span>PDF</span>
                  </p>
                </div>
                <div>
                  <el-button type="warning" icon="el-icon-download" size="mini"
                    >下载</el-button
                  >
                </div>
              </div>
            </li>
          </ul>
        </el-card>
        <el-pagination background layout="prev, pager, next" :total="10">
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import asideCard from '@/components/standard/asideCard.vue'
import topTitle from '@/components/standard/topTitle.vue'
export default {
  components: {
    asideCard,
    topTitle
  },
  methods: {

  },
};
</script>

<style lang="less" scoped>
.main {
  // margin-top: 10px;
  background-color: #fff;
  padding: 20px;
  .el-main {
    margin-left: 40px;

    .box-card {
      width: 100%;
      border: none;
      .clearfix {
        font-weight: 500;
        font-size: 18px;
        i {
          color: #1492ff;
          font-style: normal;
        }
      }
      .lis {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
      }
      .left {
        font-size: 12px;
      }
      .right {
        font-size: 12px;
        width: 45%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  /deep/.el-main {
    padding: 0;
  }
}
</style>
