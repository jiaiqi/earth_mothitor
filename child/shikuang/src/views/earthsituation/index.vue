<template>
  <div class="earthsituation">
    <div class="box commom">
      <div class="nav">当前位置：<a :href="type==0?'/shikuang/shikuangHistory?id='+id:'/shikuang/shikuangSh?id='+id">最新地震信息</a> > {{ type == 0 ? '历史上的今天' : '信息播报'}}</div>
      <div class="text" v-if="type != 0">
        <div class="title">
          <h3>{{ text.localName }}发生{{ text.m }}级地震</h3>
          <p>发布时间：{{ new Date(text.otime).toLocaleString('chinese',{hour12:false}) }}</p>
        </div>
        <div class="content">
          <p>
            据中国地震台网测定，北京时间{{ new Date(text.otime).format("yyyy年MM月dd日hh时mm分ss秒") }}{{ text.localName }}
            <span v-if="parseInt(text.lat) == 0">（纬度</span>
            <span v-else>{{parseInt(text.lat)>0? '（北纬' : '（南纬'}}</span>
            {{
              toThreeFloat(Math.abs(text.lat))
            }}度，
            <span v-if="parseInt(text.lon) == 0">经度</span>
            <span v-else>{{ parseInt(text.lon)>0 ? '东经' : '西经' }}</span>
            {{ toThreeFloat(Math.abs(text.lon)) }}度）发生{{ text.m }}级地震，震源深度{{
              text.depth
            }}KM。
          </p>
        </div>
      </div>
      <div class="text" v-else>
        <div class="title">
          <h3>公元{{text.year}}年{{text.month}}月{{text.day}} {{ text.placeName }}发生{{ text.m }}级地震</h3>
        </div>
        <div class="content">
          <p>
            公元{{text.year}}年的{{text.month}}月{{text.day}}日 <span style="font-weight:bold">{{ text.placeName }}</span> 发生{{ text.m }}级地震，位于
            <span v-if="parseInt(text.lat) == 0">纬度</span> 
            <span v-else>{{parseInt(text.lat)>0? '北纬' : '南纬'}}</span>
            {{
              toThreeFloat(Math.abs(text.lat))
            }}度，
            <span v-if="parseInt(text.lon) == 0">经度</span>
            <span v-else>{{ parseInt(text.lon)>0 ? '东经' : '西经' }}</span>
            {{ toThreeFloat(Math.abs(text.lon)) }}度。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { encode, decode } from '@/utils/dataEncry'
import { getList, getHisList } from '@/api/shikuang'
import {
  hotAdd,
  hotDataAdd
} from '@/api/hots'
export default {
  data() {
    return {
      id: null,
      type: null,
      text: null,
      list: []
    }
  },

  created() {
    let id = this.$route.query.id
    let type = this.$route.query.type
    this.id = id
    this.type = type
    let str = 'id='+id
    if(this.type == 1){
      getList(str).then((res) => {
        this.list = res.records
        this.text = this.list.filter((item) => item.id == id)[0]
        this.addHot(this.text.localName+'发生'+ this.text.m +'级地震','/shikuang/earthstuation?id='+id+'&type='+type,1)
      }).catch((e) => {
        getList(str).then((res) => {
          this.list = res.records
          this.text = this.list.filter((item) => item.id == id)[0]
          this.addHot(this.text.localName+'发生'+ this.text.m +'级地震','/shikuang/earthstuation?id='+id+'&type='+type,1)
        })
      })
    }else {
      const date = new Date();
      const pageNum = 1;
      const pageSize = 999;
      let month = this.$route.query.mon;
      let day = this.$route.query.day;
      month = month > 9 ? month : "0" + month;
      getHisList(pageNum, pageSize, month, day).then(res => {
        this.list = res.records
        this.text = this.list.filter((item) => item.id == id)[0]
        this.addHot(this.text.placeName+'发生'+ this.text.m +'级地震','/shikuang/earthstuation?id='+id+'&type='+type+'&mon='+this.$route.query.mon+'&day='+this.$route.query.day,2)
      }).catch((e) => {
        getHisList(pageNum, pageSize, month, day).then(res => {
          this.list = res.records
          this.text = this.list.filter((item) => item.id == id)[0]
          this.addHot(this.text.placeName+'发生'+ this.text.m +'级地震','/shikuang/earthstuation?id='+id+'&type='+type+'&mon='+this.$route.query.mon+'&day='+this.$route.query.day,2)
        })
      })
    }

  },
  methods: {
    //保留三位小数
    toThreeFloat(num) {
      let number = null
      if(num.toString().split('.').length != 1 && num.toString().split('.')[1].length < 3) {
        number = parseFloat(num).toFixed(3)
      }else if(num.toString().split('.').length == 1) {
        number = num.toString() + '.000'
      }else {
        number = num.toString().substr(0,parseInt(num.toString().indexOf('.')) + 4)
      }
      return number
    },
    //新增热点搜索
    addHot(name,url,type){
      let form = {
            keyName: type == 1? '最新地震-':'历史地震-'+name,
            url: url,
            linkUnit: ''
          }
      hotDataAdd(encode(form)).then()
    },
  }
}
</script>

<style lang="less" scoped>
.box {
  height: 90vh;
  .nav {
    margin: 0 auto;
    width: 80%;
    padding: 20px 0;
    font-size: 14px;
  }
  .text {
    margin: 0 auto 50px;
    width: 80%;
    padding: 40px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid #dddddd;
    .title {
      h3 {
        font-size: 28px;
        font-weight: 400;
        letter-spacing: 2px;
      }
      p {
        margin-top: 30px;
        padding: 10px 0;
        font-size: 14px;
        color: #7f6697;
        border-bottom: 1px solid #ddd;
      }
    }
    .content {
      min-height: 300px;
      padding-top: 30px;
      font-size: 20px;
      color: rgb(102, 101, 101);
      line-height: 200%;
      text-indent: 1cm;
      text-align: left;
      letter-spacing: 1.5px;
    }
  }
}
a {
  color: #000000;
}
a:hover {
  color: #0066ff;
}
</style>
