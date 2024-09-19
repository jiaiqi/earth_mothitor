<template>
    <div class="container">
      <div style="cursor:pointer;padding-left: 80px;width: 300px;" @click="back">
          <i class="el-icon-back"></i>
          <span style="font-size: 16px;padding-left:5px;">返回</span>
      </div>
      <div class="contant">
        <div class="tab">
          <el-table
          :data="newlist"
          :show-header="false"
          height="500"
          >
            <el-table-column
              prop="title"
              label="名称">
              <template slot-scope="scope">
                <div style="cursor:pointer;font-size: 17px;" @click="toUrl(scope.row)">
                  {{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="uploadTime"
              width="120"
              label="时间">
              <template slot-scope="scope">
                <div style="cursor:pointer;font-size: 17px;" @click="toUrl(scope.row)">
                  {{ DateFormat(scope.row.uploadTime) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        </div>
        <el-pagination class="pages" :total="total"
         @current-change="getNewList" layout="total, prev, pager, next, jumper" />
    </div>
</template>

<script>
import{ getNewsList } from '@/api/news'
import { hotDataAdd } from '@/api/count.js'
import { encode, decode } from '@/utils/base/dataEncry'
export default {
  data() {
    return {
      newlist: [],
      type: null,
      total: 0,
    }
  },
  mounted() {
    this.type = this.$route.query.type
    this.getNewList(1)
  },
  methods:{
    back() {
        location.href = '/home'
    },
    getNewList(p){
      let par = 'pageNum='+p+'&pageSize=10'
      getNewsList(par).then(res=>{
        this.newlist = [...res.records]
        this.total = res.total
      })
    },
     // 格式化日期
   padDate (value) {
    return value < 10 ? '0' + value : value
    },
    DateFormat (value) {
     	// 根据给定的字符串，得到特定的日期
        var date = new Date(value);
        var year = date.getFullYear();
        var month = this.padDate(date.getMonth() + 1);
       	var day = this.padDate(date.getDate());
       	return year + '-' + month + '-' + day;
       	},
 
    toUrl(item){
        if(item.url){
        let form = {
            keyName: '新闻动态-'+item.title,
            url: item.url,
            }
        window.open(item.url)
        hotDataAdd(encode(form)).then()
        }else {
        let form = {
            keyName: '新闻动态-'+item.title,
            url: '/newsInfo',
            }
        hotDataAdd(encode(form)).then()
        sessionStorage.setItem('newsText',JSON.stringify(item.newsText))
        this.$router.push({name:'newsInfo'});
        }
    }
  }
}
</script>
<style lang="less" scoped>
.container{
  width: 100%;
  padding: 2% 0px;
    .contant {
        width: 100%;
        display: flex;
        justify-content: center;
        .tab {
            width: 60%;
            margin: 15px 0px;
        }
          .imgClass {
            width: 180px;
            height: 150px;
          }
          .item {
            width: 37%;
            display: flex;
            margin: 10px 15px;
            margin-top: 32px;
            .info {
              padding: 0px 15px;
              .head {
                font-size: 19px;
                line-height: 35px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .infoText {
                font-size: 16px;
                line-height: 25px;
                color: #767676;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .btn {
                cursor: pointer;
                width: 80px;
                text-align: center;
                margin-top: 15px;
                line-height: 30px;
                color: #fff;
                border-radius: 5px;
                background-color: #409EFF;
              }
              .btn:hover {
                background-color: #6eb7ff;
              }
            }
        }
        }
        .pages {
          width: 100%;
          padding: 10px 0px;
          display: flex;
          justify-content: center;
        }
}
</style>