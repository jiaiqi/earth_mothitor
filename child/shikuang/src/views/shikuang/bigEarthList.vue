<template>
    <div class="earthTopic">
      <div class="container commom">
        <div class="topNav">
          <topNav :pageName="'/大震专题'"></topNav>
        </div>
        <div class="nav"><span>01</span>&nbsp;&nbsp;震后快速产出</div>
        <div class="main">
            <el-table
            :data="list"
            :show-header="false"
            style="width: 100%;min-height:150px">
                <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="发震位置">
                      <span>{{ props.row.localName }}</span>
                    </el-form-item>
                    <el-form-item label="经度">
                        <span>{{ props.row.lon }}</span>
                    </el-form-item>
                    <el-form-item label="纬度">
                        <span>{{ props.row.lat }}</span>
                    </el-form-item>
                    <el-form-item label="震级">
                        <span>{{ props.row.m }}</span>
                    </el-form-item>
                    <el-form-item label="震源深度">
                        <span>{{ props.row.depth }}</span>
                    </el-form-item>
                    <el-form-item label="发震时间">
                        <span>{{ new Date(props.row.otime).toLocaleString() }}</span>
                    </el-form-item>
                    </el-form>
                </template>
                </el-table-column>
                <el-table-column
                label="标题"
                prop="headTitle">
                <template slot-scope="scope">
                  <div style="cursor:pointer" @click="handleClick(scope.row)">
                    {{scope.row.headTitle}}
                  </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center" 
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page" v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" 
              :limit.sync="queryParams.pageSize" :page-size="20" @current-change="getPageList" />
          <!-- <ul style="display: flex">
            <li v-for="item in list" :key="item.id">
              <div class="img">
                <p>{{ item.m }}级地震</p>
              </div>
              <h3>{{ item.localName }}{{ item.m }}级地震</h3>
            </li>
          </ul> -->
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { encode, decode } from '@/utils/dataEncry'
  import { getList2 } from '@/api/shikuang'
  import TopNav from '../../components/topNav.vue'
  export default {
    data() {
      return {
        list: [],
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 20
        }
      }
    },
    components: {
      TopNav
    },
    created() {
      this.getPageList(1)
    },
    methods: {
      getPageList(data) {
        getList2({
          pageNum: data,
          pageSize: 20,
          flag: 1
        }).then((res) => {
          this.list = res.records
          // this.list = this.list.filter(itm=>{ return itm.auditStatus == 1 })
          this.total = res.total
          this.list.forEach((item,index) => {
            for(let i = 0; i<this.list.length - index; i++){
              if(this.list[i + 1] && this.list[i].oTime < this.list[i + 1].oTime){
                let temp = null
                temp = this.list[i]
                this.list[i] = this.list[i + 1]
                this.list[i + 1] = temp
              }
            }
          })
          // this.list = this.list.filter((itm) => { return itm.m >= 5 })
        }).catch((e) => {
        })
      },
      handleClick(row) {
        this.$router.push({path: '/earthOption',query: {id: row.spId,spid:row.eventId}})
        //以防数据丢失
        sessionStorage.setItem('id',row.spId)
        sessionStorage.setItem('spid',row.eventId)
      }
    }
  }
  </script>
  
  <style lang="less" scoped>
  .page {
    margin: 25px;
  }
    .demo-table-expand {
        font-size: 0;
    }
  /deep/.el-form-item__label {
    width: 80px;
    color: #99a9bf !important;
  }
  .demo-table-expand .el-form-item {
    background-color: #f7f7f7;
    padding-left: 80px;
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .earthTopic{
    height: 1000px;
  }
  .container {
    background: #f6f6f7 url(@/assets/images/bgimg1.png) no-repeat top;
    background-size: 100%;
    position: relative;
    padding: 150px 0px;
    .topNav {
      position: absolute;
      top: 20px;
      left: 20px;
      background-color: #fff;
      padding: 10px;
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
      width: 80%;
      background-color: #fff;
      margin: 100px auto 0;
      border-radius: 5px;
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
      width: 80%;
      background-color: #fff;
      padding: 20px;
      margin: 20px auto 0;
      border-radius: 5px;
      ul {
        flex-flow: wrap;
        justify-content: space-between;
        li {
          width: 24%;
          margin-bottom: 10px;
          .img {
            margin: auto;
            width: 90%;
            height: 100px;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
            margin-bottom: 10px;
            cursor: pointer;
            p {
              color: #ec243b;
              font-size: 14px;
              text-align: center;
              padding-top: 20%;
            }
          }
          h3 {
            font-size: 14px;
            text-align: center;
            color: #4d9bca;
          }
        }
      }
    }
  }
  </style>
  