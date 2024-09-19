<template>
    <div class="container">
        <div>
            <topNav :news="true" :pageName="'数据目录服务'"></topNav>
        </div>
        <div style="display: flex">
        <div class="leftMenu">
          <div class="title">服务目录</div>
          <el-menu class="el-menu-vertical-demo">
            <el-menu-item v-for="(item,index) in cataList" :key="item.typeId" :class="{'selbg':isActive[index]}" :index="item.typeId" @click="toInfo(item)">
              <span slot="title">{{ item.typeName }}</span>
              <!-- <el-menu-item-group>
                <el-menu-item v-for="(itm,index) in filters(item.typeName)" :key="itm.id" :index="'2-'+itm.id" @click="toPath(itm.url,itm)">{{ itm.sname }}</el-menu-item>
              </el-menu-item-group> -->
            </el-menu-item>
          </el-menu>
          <div class="title">热点推荐</div>
            <div class="hotItem" v-for="(item,index) in hotlist.slice(0,5)" :key="item.id" @click="goInfo(item)">
              <div class="numText">{{ index+1 }}</div>
              <div class="hotText">{{ item.keyName }}</div>
            </div>
        </div>
        <div class="content" v-if="JSON.stringify(info) != '{}'">
<!--          <div class="headItem">
            <div class="headTitle">
              {{ info.typeName }}
            </div>
            <div class="main">
              <div>
                <img class="img" src="@/assets/images/news_7.png" />
              </div>
              <div class="introduceText">
                {{ info.introduce }}
              </div>
            </div>
          </div>-->
          <div :class="{'item':true,'selbg2':isActive2[index]}" :id="index" v-for="(item,index) in filters(info.typeName)" @click="toPath(item.url)">
<!--            <div class="itemTitle">
              {{index+1}}、{{ item.sname }}
            </div>-->
            <div class="itemTitle">
             {{ item.sname }}
            </div>
            <div class="main">
              <div>
                <img class="img" :src="getImg(item.sname)" />
              </div>
              <div class="introduceText" v-html="item.stext"></div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </template>
    <script>
    import { getListPage, getTypeDic } from "@/api/count";
    import { encode,decode } from '@/utils/base/dataEncry';
    import topNav from '@/components/layout/topNav.vue';
    import { industry } from '@/api/shikuang'
    import { getFlagList } from '@/api/count'
    export default {
      data() {
        return {
            professionList: [],
            pageName: '',
            cataList: [],
            allList: [],
            hotlist: [],
            info: {},
            type: '',
            type2: '',
            isActive: [].fill(false,50),
            isActive2: [].fill(false,50)
        }
      },
      mounted() {
        this.getCatalog()
        this.getHot()
      },
      watch: {
        $route(val) {
          if(this.$route.query.type){
            this.type2 = ''
            if(this.$route.query.type.indexOf('-') != -1){
              this.type2 = this.$route.query.type.split('-')[1]
              this.type = this.$route.query.type
            }else{
              this.type = this.$route.query.type
            }
            this.sels()
          }else{
            this.info = this.cataList[0]
            this.isActive[0] = true
          }
        },
        deep: true
      },
      components: {
        topNav
      },
      methods: {
        back() {
            location.href = '/home'
        },
        toUrl(url) {
          window.open(url)
        },
        getHot() {
          getFlagList('pageNum=1&pageSize=10').then(res=>{
            let data = res.records
            this.hotlist = data
          })
        },
        sels() {
          if(this.type == '数据目录'){
            this.info = this.cataList[0]
            this.isActive[0] = true
          }else{
            if(this.type2 == '' && this.type != ''){
              this.cataList.map((item,index)=>{
                if(item.typeName == this.type){
                  this.toInfo(item,index)
                }
              })
            }else if(this.type2 != '' && this.type != ''){
              this.cataList.map((item,index)=>{
                if(item.typeName == this.type.split('-')[0]){
                  this.toInfo(item,index)
                }
              })
              this.filters(this.info.typeName).map((itm,index)=>{
                if(itm.sname == this.type2){
                  this.isActive2 = [].fill(false,50)
                  this.isActive2[index] = true
                  setTimeout(() => {
                    document.getElementById(index).scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                }
              })
            }
          }
        },
        getCatalog() {
          let par = 'pageNum=1&pageSize=999'
          getTypeDic(par).then(res=>{
            this.cataList = res.records
            this.cataList.forEach(item=>{
              let p = 'pageNum=1&pageSize=999&typeName='+item.typeName
              getListPage(p).then(resp=>{
                this.allList.push({
                  name: item.typeName,
                  list: resp.records
                })
                if(this.$route.query.type){
                  this.type2 = ''
                  if(this.$route.query.type.indexOf('-') != -1){
                    this.type2 = this.$route.query.type.split('-')[1]
                    this.type = this.$route.query.type
                  }else{
                    this.type = this.$route.query.type
                  }
                  this.sels()
                }else{
                  this.info = this.cataList[0]
                  this.isActive[0] = true
                }
              })
            })
          })
        },
        filters(name) {
          let arr2 = []
          this.allList.map(item=>{
            if(item.name == name){
              arr2.push(item)
            }
          })
          return arr2[0].list
        },
        toInfo(item,index) {
          this.isActive = [].fill(false,50)
          this.isActive2 = [].fill(false,50)
          if(index || index == 0){
            this.isActive[index] = true
          }
          this.info = {...item}
        },
        getImg(name) {
          if(name == '测震'){
            return require('@/assets/images/cezCatalog.png')
          }
          if(name == '强震动'){
            return require('@/assets/images/qzdCatalog.png')
          }
          if(name == '地磁'){
            return require('@/assets/images/dicCatalog.png')
          }
          if(name == '定点形变'){
            return require('@/assets/images/ddxbCatalog.png')
          }
          if(name == 'GNSS'){
            return require('@/assets/images/gnssCatalog.png')
          }
          if(name == '水准'){
            return require('@/assets/images/shuizCatalog.png')
          }
          if(name == '重力'){
            return require('@/assets/images/zlCatalog.png')
          }
          if(name == '地震测深'){
            return require('@/assets/images/dzcsCatalog.png')
          }
          if(name == '活断层探测'){
            return require('@/assets/images/hdcCatalog.png')
          }
          if(name == '地电'){
            return require('@/assets/images/didCatalog.png')
          }
          if(name == '地下流体'){
            return require('@/assets/images/dxltCatalog.png')
          }
          return require('@/assets/images/jianshezhong.jpg')
        },
        toPath(name,item) {
          // microApp.setData(name, { path: path })
          // this.$router.push(path)
          if(name == '#'){
            this.$message.info("正在建设中，敬请期待")
            return
          }
          if(name.indexOf(',') != -1){
              let type = name.split(',')[1]
              let name2 = name.split(',')[0]
            if (name == 'precursorElectromagnetism,1'){
              this.$message.info("地磁数据涉密，请按照有关涉密数据申请要求办理相关手续。")
              return
            }
            if (name == 'precursorElectromagnetism,2'){
              this.$message.info("地电数据涉密，请按照有关涉密数据申请要求办理相关手续。")
              return
            }
              this.$router.push({ name: name2, query:{ type: type } })
              this.$router.go(0)
          }else{
            if (name == 'precursorGravity'){
              this.$message.info("重力数据涉密，请按照有关涉密数据申请要求办理相关手续。")
              return
            }

              this.$router.push({ name: name })
              if(name!='home'){
                this.$router.go(0)
              }
          }
        },
        // 查看详情
        goInfo(item) {
          sessionStorage.setItem('hotInfo',JSON.stringify(item))
          if(item.linkUnit){
            sessionStorage.setItem('tips',item.linkUnit)
          }
          if(item.url.indexOf('http://') != -1 || item.url.indexOf('https://') != -1){
            window.open(item.url)
          }else {
            this.$router.push(item.url)
          }
        },
      }
    }
    </script>
    <style lang="less" scoped>
    .container {
      padding: 50px 15%;
      background-color: rgb(248, 248, 248);
      .leftMenu {
        width: 250px;
        margin-top: 35px;
      }
      .title {
        font-weight: bold;
        font-size: 18px;
        text-align: center;
        padding: 15px 0px;
        background-color: rgba(189, 216, 255, 0.2);
      }
      .hotItem {
        text-align: center;
        padding: 15px 20px;
        display: flex;
        border-bottom: 1px solid rgb(226, 226, 226);
        .numText {
          background-color: rgb(255, 130, 130);
          width: 35px;
          height: 33px;
          line-height: 33px;
          vertical-align: middle;
          text-align: center;
          border-radius: 100%;
          color: #fff;
        }
        .hotText {
          width: 200px;
          line-height: 33px;
          vertical-align: middle;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-left: 15px;
        }
      }
      .hotItem:hover {
        background-color: rgba(189, 216, 255, 0.2);
        cursor: pointer;
      }
    }
    .selbg {
      background-color: rgba(189, 216, 255, 0.2);
    }
    .selbg2 {
      background-color: rgba(189, 216, 255, 0.2);
      border: 1px solid rgb(93, 144, 255) !important;
    }
    .content {
      min-width: 820px;
      width: 100%;
      height: calc(100vh - 130px);
      min-height: 800px;
      overflow-y: auto;
      margin-left: 5px;
      .headItem {
        min-width: 300px;
        padding: 0px 35px;
        background-color: rgba(189, 216, 255, 0.3);
        .headTitle {
          padding: 15px 25px;
          vertical-align: middle;
          font-weight: bold;
          border-bottom: 3px solid rgb(74, 146, 255);
        }
      }
      .item {
        padding: 0px 35px;
        border-bottom: 1px solid rgb(226, 226, 226);
        cursor: pointer;
        .itemTitle {
          font-size: 17px;
          padding: 15px 25px;
          vertical-align: middle;
        }
      }
      .main {
        padding: 15px 20px;
        display: flex;
        .img {
          width: 170px;
          height: 160px;
        }
        .introduceText {
          width: 100%;
          height: 140px;
          padding: 10px 15px;
          text-indent: 2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          // white-space: nowrap;
        }
      }
    }
    :deep(.el-submenu__title) {
      border-bottom: 1px solid rgb(226, 226, 226);
    }
    :deep(.el-menu-item) {
      font-size: 16px;
      text-align: center;
    }
    </style>
