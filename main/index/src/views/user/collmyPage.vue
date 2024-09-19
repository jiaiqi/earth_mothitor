<template>
  <div class="collmy">
    <div class="box">
      <el-container>
        <el-aside width="350px">
          <div class="aside_box">
            <div class="title">
              <h3>联系我们</h3>
            </div>
            <div class="center">
              <ul>
                <li>
                  <p>
                    <i
                      class="el-icon-phone-outline"
                      style="margin-right: 10px"
                    ></i
                    >电话： 029-
                  </p>
                </li>
                <li>
                  <p>
                    <i class="el-icon-message" style="margin-right: 10px"></i
                    >邮编：
                  </p>
                </li>
                <li>
                  <p>
                    <i
                      class="el-icon-location-information"
                      style="margin-right: 10px"
                    ></i
                    >地址：陕西省西安市西影路
                  </p>
                </li>
                <li>
                  <p>
                    <i class="el-icon-time" style="margin-right: 10px"></i
                    >工作时间：周一至周五9：00--18：00
                  </p>
                </li>
              </ul>
            </div>
            <div class="erm">
              <img src="@/assets/images/sx.png" alt="" />
              <p>陕西省地震信息服务公众号</p>
            </div>
            <div class="footer">
              <p>
                关注陕西省地震局信息服务微信服务号，提交意见反馈，参与互动交流，获得更多实时服务咨询。
              </p>
            </div>
          </div>
        </el-aside>
        <el-main>
          <div>
            <img src="@/assets/images/dt.png" alt="" />
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.collmy {
  width: 100%;
  display: flex;
  .box {
    margin: 10px auto;
    overflow: hidden;
    background-color: #fff;
    padding: 40px 20px 10px;
    .el-aside {
      border: 1px solid #e3e3e3;
      .aside_box {
        .title {
          width: 100%;
          text-align: center;
          background-color: #1492ff;
          color: #fff;
          padding: 15px;
          font-size: 14px;
        }
        .center {
          ul {
            padding: 20px;
            li {
              padding: 20px 10px;
              border-bottom: 1px solid #e3e3e3;
              font-size: 15px;
            }
          }
        }
        .erm {
          text-align: center;
          font-size: 14px;
          img {
            width: 130px;
          }
        }
        .footer {
          margin: 20px;
          font-size: 13px;
        }
      }
    }
    /deep/.el-main {
      padding: 0;
      margin-left: 10px;
    }
  }
}
</style>
