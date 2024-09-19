<template>
  <div class="profession" @init0="init0" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div class="container">
      <!-- <div class="title">
        <img src="../../assets/images/earth.png"/>
        <div class="header">
          <h3>大震动态</h3>
        </div>
      </div> -->
      <div class="main">
        <!-- <div class="left">
          <ul>
            <li v-for="item in list2.filter((itm) => { return itm.m >= 4.5 }).slice(0,9)" :key="item.id">
              <div class="messagetext" v-if="list2.length == 0">暂无大地震数据</div>
              <div class="box" @click="goEarthOption(item.id)">
                <img src="@/assets/images/withand2.png" alt="" />
                <span><span style="font-size: 14px;">{{ new Date(item.oTime).getFullYear() }}年{{ (new Date(item.oTime).getMonth() + 1) }}月{{ new Date(item.oTime).getDate() }}日</span>
                {{ item.localName }}发生{{ item.m }}级地震</span>
              </div>
            </li>
          </ul>
        </div> -->

          <!-- <el-button style="margin-right:8px" type="primary" size="mini" @click="goEarthOption(list2[0].id)"
            >查看详情</el-button
          > -->
        <div class="right">
          <div class="bordy">
            <div class="box1">
              <!-- <div class="messagetext" v-if="list.length == 0">{{ text }}</div> -->
              <div>
                <div style="display:flex;">
                <ul class="earthquake">
                  <!-- @click="viewdetails(item)" -->
                  <!-- <li v-for="item in list.slice(0,10)" :key="item.id" @click="goInfo(item)">
                    <div class="earthtext" :data-item="JSON.stringify(item)">
                      <img src="@/assets/images/dot.png" alt="" style="margin:4px 8px 4px 0px" />
                      <span>{{ item.SName }}</span>
                    </div>
                  </li> -->
                  <div v-if="list.length != 0">
                    <li v-for="item in list" :key="item.specialId" @click="goInfo(item.eventId,item.specialId)">
                      <div class="earthtext" :data-item="JSON.stringify(item)">
                        <span
                          :title="item.spName"
                          :data-item="JSON.stringify(item)"
                        >
                        {{ item.spName }}</span>
                      </div>
                    </li>
                  </div>
                  <li v-else>
                    <div style="font-size: 17px;color:#000000">{{ text2 }}</div>
                  </li>
                </ul>
              </div>
                <!-- <div class="hisBtn" type="primary" size="mini" @click="toMore('/monitor/productlist')"
                  >查看更多</div
                > -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { getRf,getPageList } from '@/api/serveList'
import { getList, getList2, getConfList, getEarthList } from '@/api/shikuang'
import { encode, decode } from '@/utils/base/dataEncry'
export default {
  data() {
    return {
      activeName: 'first',
      text2: '数据加载中...',
      list: [],
      lookearth: [],
      allList: [],
      newlist:[
        {
          title: '国家级高温橙色、强对流蓝色预警气象服务快报服务快报服务快报',
          url: 'http://data.cma.cn/site/serviceLetter/id/285.html'
        },
        {
          title: '台风“尼格”专题气象数据服务快报',
          url: 'http://data.cma.cn/site/serviceLetter/id/314.html'
        },
        {
          title: '四川泸定6.8级地震气象服务快报',
          url: 'http://data.cma.cn/site/serviceLetter/id/304.html'
        },
        {
          title: '台风“轩岚诺”专题气象服务快报',
          url: 'http://data.cma.cn/site/serviceLetter/id/302.html'
        },
        {
          title: '四川彭州山洪气象服务快报',
          url: 'http://data.cma.cn/site/serviceLetter/id/294.html'
        }
      ],
      province: [
        '新疆',
        '四川',
        '青海',
        '西藏',
        '台湾',
        '河北',
        '云南',
        '甘肃',
        '内蒙古',
        '江苏',
        '山西',
        '宁夏',
        '广东',
        '河南',
        '重庆',
        '广西',
        '北京',
        '天津',
        '吉林',
        '福建',
        '山东',
        '贵州',
        '辽宁',
        '湖北',
        '浙江',
        '安徽',
        '黑龙江',
        '上海',
        '江西',
        '海南',
        '湖南',
        '陕西',
        '香港',
        '澳门'
      ],
      text: '暂无动态信息',
      listShow: false,
    }
  },
  props: ['list2'],
  watch:{
    // list2(newVal,oldVal){
    //   this.sortList()
    // }
  },
  mounted() {
    this.getList()
  },
  methods: {
    //列表排序
    // sortList() {
    //   this.list2.forEach((item,index) => {
    //     for(let i = 0; i<this.list2.length - index; i++){
    //       if(this.list2[i + 1] && this.list2[i].oTime < this.list2[i + 1].oTime){
    //         let temp = null
    //         temp = this.list2[i]
    //         this.list2[i] = this.list2[i + 1]
    //         this.list2[i + 1] = temp
    //       }
    //     }
    //   })
    // },
    goInfo(id,spid) {
      this.$router.push({
        path: '/shikuang/earthOption',
        query: {
          id: spid,
          spid: id
        }
      })
    },
    getList() {
        //获取全部大震
        getEarthList({
          pageNum: 1,
          pageSize: 9999,
        }).then(res=>{
          this.allList = res.records
          getConfList().then(resp=>{
            this.list = resp.slice(0,4)
            //判断开始和结束时间与是否展示飘窗
            this.list = this.list.filter(item=>{
              let begtime = new Date(item.begtime).getTime()
              let endtime = new Date(item.endtime).getTime()
              let nowtime = new Date().getTime()
              return (item.flag == 1 && (nowtime>begtime && nowtime<endtime))
            })
            if(this.list.length == 0){
              this.text2 = "暂无最新地震动态"
            }
            this.allList.forEach(itm=>{
              this.list.forEach(item=>{
                if(item.specialId == itm.spId){
                  item.spName = itm.headTitle
                  item.eventId = itm.eventId
                }
              })
            })
          })
        })

      // getList({}).then((res) => {
      //   this.list = decode(res)
      //   this.list.forEach((item,index) => {
      //     item.title = new Date(item.oTime).getMonth() + 1 + '月' + new Date(item.oTime).getDate() + '日' +
      //     new Date(item.oTime).getHours() + '时' + new Date(item.oTime).getMinutes() + '分' +
      //     item.localName + '发生' + item.m + '级地震'
      //     for(let i = 0; i<this.list.length - index; i++){
      //       if(this.list[i + 1] && this.list[i].oTime < this.list[i + 1].oTime){
      //         let temp = null
      //         temp = this.list[i]
      //         this.list[i] = this.list[i + 1]
      //         this.list[i + 1] = temp
      //       }
      //     }
      //   })
      //   this.list = this.list
      //  console.log(JSON.stringify(list))
      // }).catch((e) => {
      //   console.log(JSON.stringify(e))
      // })
    },
    // 跳转大震专题
    goEarth() {
      this.$router.push({
        path: '/shikuang/earthtopic'
      })
    },
    // 前往震情速递正文
    goEarths(item,type) {
      if(type == 1){
        this.$router.push({
          path: '/shikuang/earthstuation',
          query: {
            id: item,
            type: type
          }
        })
      }
      if(type == 0){
        this.$router.push({
          path: '/shikuang/shikuangHistory',
          query: {
            id: item
          }
        })
        // this.$router.push({
        //   path: '/shikuang/earthstuation',
        //   query: {
        //     id: item,
        //     type: type
        //   }
        // })
      }
    },
    init0(){
      this.$emit('init0',this.list.length===0)
    },
    mouseenter() {
      this.$emit('enter',true)
    },
    mouseleave() {
      this.$emit('enter',false)
    },
    handleClick(tab, event) {
      if (tab.label === '历史今天地震') {
        if (this.lookearth.length === 0) {
            this.text = '今日无历史地震'
            this.listShow = false
          } else {
            this.listShow = true
          }
      }
    },
    goEarthOption(id) {
      this.$router.push({
        path: '/shikuang/earthOption?id=' + id
      })
    },
    getList2() {
      this.list = []
      Promise.all([getRf(0),getRf(1)]).then((res) => {
          this.list = res[0].concat(res[1])
        })
        .catch(() => {
          this.text = '暂无数据'
        })
    },
    filterLevel(list) {
      let arr = []
        list.forEach((item) => {
          if(item.placeName.substr(0,3) == '内蒙古' || item.placeName.substr(0,3) == '黑龙江'){
            if(item.m >= 6){
              arr.push(item)
            }
          }else {
            this.province.includes(item.placeName.substr(0,2)) ? item.m>=6? arr.push(item):'' : item.m>=7? arr.push(item):''
          }
        })
        return arr
    },
    getDate() {
      let date = new Date()
      // let year = date.getFullYear()
      let mon = date.getMonth() + 1
      let day = date.getDate()
      let arr = {
        month: mon,
        day: day
      }
      // arr = JSON.stringify(arr)
      return arr
    },
    setNum(i) {
      if (i < 10) {
        i = '0' + i
        return i
      } else {
        return i
      }
    },
    settiam(val) {
      let obj = val.split(' ')
      let year = obj[0].split('-')[0]
      let time = obj[1].split(':')
      let mon = time[0]
      let sec = time[1]
      let stry
      if (sec === '00') {
        stry = `${year}年${mon}时`
      } else {
        stry = `${year}年${mon}时${sec}分`
      }

      return stry
    },
    // goInfo(item) {
    //   this.getListApi(item)
    // },
    // getListApi(item){
    //   let par = {
    //     sType: '',
    //     name: item.SName,
    //     pageNum: 1,
    //     pageSize: 1000
    //   }
    //   console.log(item.id)
    //   getPageList(par).then(response => {
    //     console.log(response.records)
    //     let data = null
    //     if(response.records.length > 1){
    //       data = response.records.filter(itm=>{return itm.id == item.id})[0]
    //     }else{
    //       data = response.records[0]
    //     }
    //     sessionStorage.setItem('datas',JSON.stringify(data));
    //     this.$router.push({name: 'monitorRefuge', params: {type: 0}})
    //     // this.prodList = response.records
    //     // alert(JSON.stringify(decode(response)))
    //   })
    // },
    // 查看详情
    viewdetails(e) {
      let item = JSON.parse(e.target.dataset.item)
      this.$store.commit('setearth', item)
      this.$router.push({
        path: '/situation'
      })
    },
    // 查看更多
    toMore(path) {
      this.$router.push({
        path: path
      })
    }
  }
}
</script>

<style lang="less" scoped>
.profession {
  // background-color: #f2f3f3;
  // width: 100%;
  .container {
    position: relative;
    width: 100%;
    // margin: auto;
    // margin-top: -26px;
    // padding: 20px;
    .title {
      width: 100%;
      display: flex;
      padding: 0px 0px 0px 5%;
      img {
          width: 35px;
          height: 35px;
          margin: 0px 7px;
        }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 120px;
        img {
          width: 30px;
          height: 30px;
          transform: rotateZ(-40deg);
        }
        h3 {
          height: 20px;
          color: #3d4e89;
          font-size: 19px;
        }
      }
    }
    .main {
      height: 250px;
      display: flex;
      padding: 7px 10px;
      // background: url(@/assets/images/img3.png) no-repeat center center;
      // background-size: 100% 100%;
      .left {
        position: relative;
        margin-left: 7%;
        padding: 15px 25px;
        font-size: 14px;
        min-width:450px;
        overflow-y: auto;
        color: #464646 !important;
        background-color: rgba(214, 214, 214, 0.3);
        border: 1px solid rgb(216, 216, 216);
        border-radius: 5px;
        ul li {
          width: 100%;

          .box {
            text-align: left;
            padding: 6px 10px;
            img {
              height: 20px;
              width: 20px;
              transform: rotateZ(90deg);
              float: left;
              margin-right: 5px;
            }
          }
        }
        ul li:hover .box {
          border-radius: 20px;
          background-color: #5ca5d8;
          color: #fff;
          cursor: pointer;
        }
        .el-button {
          position: absolute;
          bottom: 10px;
          right: 0;
        }
      }
      .messagetext {
        width: 621px;
      }
      .right {
        padding: 20px 15px;
        height: 200px;
        border-radius: 5px;
        color: #464646;
        font-size: 16px;
        .news {
          background-color:rgba(50, 50, 50, 0.2);
          width: 400px;
          height: 270px;
        }
        .new {
          width: 370px;
          height: 165px;
          margin-top: 5px;
          padding: 5px 10px;
          overflow-y: auto;
        .newsItem {
          line-height: 22px;
          vertical-align: middle;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          color: #efefef;
          cursor: pointer;
        }
        .newsItem:hover {
          color: rgb(185, 185, 185);
        }
        /deep/ .el-tabs__item {
          color: #fff !important;
        }
      }
      ul li:hover .earthtext {
          border-radius: 5px;
          color: rgb(0, 88, 196);
          cursor: pointer;
        }
      .earthquake {
        height: 200px;
        width: 100%;
        overflow-y: auto;
        color: #ff0000;
        // padding: 0px 15px;
        font-size: 20px;
        .earthtext {
          margin-bottom: 5px;
          // overflow: hidden;
          // white-space: nowrap;
          // text-overflow: ellipsis;
          // width: 310px;
          padding: 5px 0px;
          img {
            width: 4px;
            height: 3px;
          }
        }
      }
      .earthquake::-webkit-scrollbar {
        width: 4px;
      }
      .earthquake::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        opacity: 0.2;
      }
      .earthquake::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
      }
      .hisBtn {
        position: relative;
        left: 85%;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
}
}
</style>
