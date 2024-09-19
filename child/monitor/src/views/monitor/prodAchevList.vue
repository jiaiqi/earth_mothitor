<template>
  <div class="refuge">
    <div class="main">
      <div class="topNav">
        <TopNav :pageName="'产品服务列表'"></TopNav>
      </div>
      <div class="asideBtn">
        <div @click="sel('地震监测',1)" style="cursor:pointer;">
          <el-card v-if="(type == 1)" class="active">
            <i class="el-icon-s-custom icon"></i>
            <span>地震监测</span>
          </el-card>
          <el-card v-else>
            <i class="el-icon-s-custom icon"></i>
            <span>地震监测</span>
          </el-card>
        </div>
        <div @click="sel('震害防御',2)" style="cursor:pointer;margin-top: 10px;">
          <el-card class="active" v-if="(type == 2)">
            <i class="el-icon-s-opportunity icon"></i>
            <span>震害防御</span>
          </el-card>
          <el-card v-else>
            <i class="el-icon-s-opportunity icon"></i>
            <span>震害防御</span>
          </el-card>
        </div>
      </div>
      <div class="table">
        <div class="right_box">
          <div>
            <div style="border: 1px solid rgb(238, 238, 238); width: 100%; background-color: rgb(255, 255, 255);">
              <div style="display: flex; width: 100%; background-color: rgb(255, 255, 255); border-bottom: 1px dashed rgb(226, 226, 226);">
                <div class="serveAll" style="width: 100%; min-width: 1000px;padding: 0px 10px 5px 10px;" v-if="serveType == '地震监测'">
                  <div class="col_boxs" v-for="item in selList.slice(0,9)" :key="item" @click="sel(item)">{{ item }}</div>
                  <div class="col_boxs" v-for="item in selList.slice(9,12)" :key="item" @click="sel(item)">{{ item }}</div>
                </div>
                <div style="display: flex; width: 100%; padding: 0px 10px 5px 10px;" v-if="serveType == '震害防御'">
                  <div class="col_boxs" @click="toAll(2)">全部</div>
                  <div class="col_boxs" v-for="item in selList.slice(12,17)" :key="item" @click="sel(item)">{{ item }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="box_shxu">
            <div class="tree_list_name">
              <el-input size="large" clearable style="width:50%" v-model="searchValue" placeholder="请输入搜索内容"></el-input>
              <el-button size="large" style="margin-left:8px" type="primary" @click="search"><i class="el-icon-search"></i>搜索</el-button>
            </div>
          </div>
          <div>
            <div v-if="noData" class="no-data">暂无数据</div>
            <div v-if="!isNewProd">
              <div class="hovmul" v-for="item in prodList" :key="item.id">
                <div style="display: flex; justify-content: space-between;">
                  <div style="display: flex;" @click="sel(item.name,item.id)"><span
                    style="display: inline-block; cursor: pointer; color: rgb(61, 125, 255); font-size: 18px;">{{item.name}}</span></div>
                </div>
                <div style="display: flex; justify-content: space-between; height: 25px; margin: 10px 0px 5px;">
                  <div style="width:97%;display:flex;justify-content:space-between">
                    <div style="width:85%;display:flex;justify-content: space-between;">
                      <span style="color: rgb(125, 125, 125);padding-right:20px;">服务分类：<span>{{item.classification}}</span></span>
                      <span style="color: rgb(125, 125, 125);padding-right:20px;">联系单位：<span>{{item.institution}}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="hovmul" v-for="item in prodList" :key="item.id">
                <div style="display: flex; justify-content: space-between;">
                  <div style="display: flex;" @click="toInfo(item,item.linkUrl)"><span
                    style="display: inline-block; cursor: pointer; color: rgb(61, 125, 255); font-size: 18px;">{{item.productName}}</span></div>
                </div>
                <div style="display: flex; justify-content: space-between; height: 25px; margin: 10px 0px 5px;">
                  <div style="width:97%;display:flex;justify-content:space-between">
                    <div style="width:85%;display:flex;justify-content: space-between;">
                      <span style="color: rgb(125, 125, 125);padding-right: 50px;">服务分类：<span>{{item.directoryName}}</span></span>
                      <span style="color: rgb(125, 125, 125);">提供单位：<span>{{item.providerUnit}}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="total">
              <p style="font-size: 14px;width: 150px;line-height: 50px;">共 {{Math.ceil(total / queryParams.pageSize) }}页 {{ total }}条记录</p>
              <el-pagination class="pages" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                             @current-change="getPageList2" :page-size="20" @size-change="sizeChange" :page-sizes="[10, 20, 50, 100, 200]" layout="sizes, prev, pager, next, jumper"></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getlist, getClassification, queryContent,
  gnssList, levelList, precursorCatalogList, ufList, getFileList, ConditionsList
} from "@/api/serve";
import {
  hotAdd,
  hotDataAdd
} from '@/api/hots'
import {decode, encode} from "@/utils/base/dataEncry";

export default {
  data() {
    return {
      form: {
        id: '',
        sname: '',
        stype: '',
        cunit: '',
        sclassification: '',
        stext: '',
        cdate: '',
        recom: '',
      },
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      currentPage: 1,
      pagesize: 20,
      serveUnit: '',
      serveUnitList: '',
      types: null,
      noData: false,
      total: 0,
      expand: 'el-icon-arrow-down',
      tiggle: '展开',
      serveType: '地震监测',
      showExpand: false,
      type: 1,
      searchValue: '',
      isNewProd: false,
      prodList: [],
      prodList2: [],
      loading: true,
      selList: [
        '地震目录',
        '震源机制解',
        '地壳应力场',
        'GNSS产品',
        '断层形变',
        '水准产品',
        'InSAR产品',
        '重力产品',
        '地磁产品',
        '地电产品',
        '定点形变产品',
        '地下流体',
        '地震区划图',
        '地震构造图',
        '地震活动断层',
        '工程抗震'
      ]
    }
  },
  mounted() {
    let type = this.$route.query.type ? parseInt(this.$route.query.type) : 1
    let name = this.$route.query.name ? parseInt(this.$route.query.name) : ""
    console.log(type,name)
    this.type = type
    let routeinfo = sessionStorage.getItem('prodPageInfoX');
    console.log(routeinfo)
    if (routeinfo && routeinfo != null && routeinfo != '') {
      let route = JSON.parse(routeinfo);
      if (route != null) {
        this.type = route.id;
        name = route.name;
      }
      sessionStorage.setItem('prodPageInfoX', "")
    }

    // this.getList(type);
    if (sessionStorage.getItem('province') != null && sessionStorage.getItem('province') != '') {
      this.getList(1);
    } else {
      this.getList(2);
      console.log(this.getList(2))
      setTimeout(() => {
        if (this.type == 1) {
          if (name === "") {
            this.sel('地震监测', 1)
          } else {
            this.sel(name, 1)
          }
        }
        if (this.type == 2) {
          if (name === "") {
            this.sel('震害防御', 2)
          } else {
            this.sel(name, 2)
          }

        }
      }, 500);
    }
  },
  methods: {
    getList(num) {
      let par = {
        pageNum: 1,
        pageSize: this.pagesize,
      }
      if (num == 1) {
        let name = sessionStorage.getItem('province')
        if (sessionStorage.getItem('province').indexOf('广西') != -1 ||
          sessionStorage.getItem('province').indexOf('西藏') != -1 ||
          sessionStorage.getItem('province').indexOf('内蒙古') != -1 ||
          sessionStorage.getItem('province').indexOf('宁夏') != -1) {
          name = sessionStorage.getItem('province').substring(0, 2)
        }
        par.institution = name
      }
      this.getListApi(par)
      document.getElementsByClassName('col_boxs').forEach(item => {
        item.style = ''
      })
    },
    getListApi(par) {
      this.isNewProd = false
      getlist(par).then(response => {
        this.prodList = response.records
        this.queryParams.pageSize = response.size;
        this.queryParams.pageNum = response.current;
        this.total = response.total;
        if (this.prodList.length > 0) {
          this.prodList2 = this.prodList
          let unitArr = []
          this.prodList.map(item => {
            unitArr.push(item.cunit)
          })
          unitArr = Array.from(new Set(unitArr))
          this.serveUnitList = unitArr
          this.noData = false
        } else {
          this.noData = true
        }
      })
    },
    toAll(type) {
      if (type == 1) {
        this.getList()
        this.sel('地震监测', 1)
      } else {
        this.sel('震害防御', 2)
      }
    },
    getPageList2(data) {
      let type = ''
      if (this.type == 1) {
        type = '公众服务'
      }
      if (this.type == 2) {
        type = '专业服务'
      }
      if (this.type == 3) {
        type = '决策服务'
      }
      if (this.type == 4) {
        type = '专项服务'
      }
      let info = {
        sType: '',
        sClassification: type,
        cUnit: this.serveUnit,
        sName: this.searchValue,
        pageNum: data,
        pageSize: this.pagesize
      }
      if (this.types == 'GNSS产品' || this.types == '断层形变' || this.types == '地磁产品' || this.types == '地电产品' || this.types == '重力产品'
        || this.types == '地下流体' || this.types == '地倾斜' || this.types == '定点形变产品' || this.types == 'InSAR产品' || this.types == '水准产品') {
        this.isNewProd = true
        if (this.types == '地下流体') {
          this.getUFPageList({page: data, limit: this.pagesize})
        } else if (this.types == 'GNSS产品' || this.types == 'InSAR产品' || this.types == '水准产品') {
          this.getGNSSPageList({page: data, limit: this.pagesize, description: this.types})
        } else if (this.types == '断层形变') {
          this.getLevelPageList({page: data, limit: this.pagesize})
        } else {
          this.getCatalogPageList({page: data, limit: this.pagesize, nameProduct: this.types})
        }
        //震害防御过滤筛选
      } else {
        this.getListApi(info);
      }
    },
    search() {
      this.isNewProd = false
      if (this.types == 'GNSS产品' || this.types == '断层形变' || this.types == '地磁产品' || this.types == '水准产品'
        || this.types == '地电产品' || this.types == '地下流体') {
        this.sel(this.types)
        return
      }
      let info = {
        queryContent: this.searchValue,
        pageNum: 1,
        pageSize: this.pagesize
      }
      if (sessionStorage.getItem('province') != '') {
        this.getList(1);
        return
      } else {
        if (this.searchValue == '') {
          this.getList(2);
          return
        }
      }
      document.getElementsByClassName('col_boxs').forEach(item => {
        item.style = ''
      })
      queryContent(encode(info)).then(res => {
        this.prodList = decode(res).records
        this.queryParams.pageSize = decode(res).size;
        this.queryParams.pageNum = decode(res).current;
        this.total = decode(res).total;
        if (this.prodList.length > 0) {
          this.prodList2 = this.prodList
          let unitArr = []
          this.prodList.map(item => {
            unitArr.push(item.cunit)
          })
          unitArr = Array.from(new Set(unitArr))
          this.serveUnitList = unitArr
          this.noData = false
        } else {
          this.noData = true
        }
      })
    },
    sizeChange(size) {
      let type = ''
      if (this.type == 1) {
        type = '公众服务'
      }
      if (this.type == 2) {
        type = '专业服务'
      }
      if (this.type == 3) {
        type = '决策服务'
      }
      if (this.type == 4) {
        type = '专项服务'
      }
      let info = {
        sType: '',
        sClassification: type,
        cUnit: this.serveUnit,
        sName: this.searchValue,
        pageNum: 1,
        pageSize: size
      }
      this.pagesize = size;
      this.queryParams.pageSize = size;
      if (this.types == 'GNSS产品' || this.types == '断层形变' || this.types == '地磁产品' || this.types == '地电产品' || this.types == '重力产品'
        || this.types == '地下流体' || this.types == '地倾斜' || this.types == '定点形变产品' || this.types == 'InSAR产品' || this.types == '水准产品') {
        this.isNewProd = true
        if (this.types == '地下流体') {
          this.getUFPageList({page: data, limit: size})
        } else if (this.types == 'GNSS产品' || this.types == 'InSAR产品' || this.types == '水准产品') {
          this.getGNSSPageList({page: data, limit: size, description: this.types})
        } else if (this.types == '断层形变') {
          this.getLevelPageList({page: data, limit: size})
        } else {
          this.getCatalogPageList({page: data, limit: size, nameProduct: this.types})
        }
        //震害防御过滤筛选
      } else {
        this.getListApi(info);
      }
    },
    sel(name, id) {
      let sClassification = ''
      this.types = name
      if ((this.selList.includes(name)) || name == '地震监测') {
        if (id) {
          this.serveType = "地震监测"
          this.type = id
        }
        if (name == 'GNSS产品' || name == '断层形变' || name == '地磁产品' || name == '地电产品' || name == '重力产品'
          || name == '地下流体' || name == '地倾斜' || name == '定点形变产品' || name == 'InSAR产品' || name == '水准产品') {
          this.isNewProd = true
          if (name == '地下流体') {
            this.getUFPageList({page: 1, limit: this.pagesize})
          } else if (name == 'GNSS产品' || name == 'InSAR产品' || this.types == '水准产品') {
            this.getGNSSPageList({page: 1, limit: this.pagesize, description: name})
          } else if (name == '断层形变') {
            this.getLevelPageList({page: 1, limit: this.pagesize})
          } else {
            this.getCatalogPageList({page: 1, limit: this.pagesize, nameProduct: name})
          }
          //震害防御过滤筛选
        } else if (name == '地震区划图' || name == '地震构造图' || name == '地震活动断层' || name == '工程抗震') {
          this.isNewProd = true
          this.serveType = '震害防御'
          this.type = 2
          let par = {
            pageNum: 1,
            pageSize: this.pagesize,
            description: name
          }
          ConditionsList(encode(par)).then(response => {
            let list = decode(response).records
            list.forEach(item => {
              item.productName = item.name
              item.directoryName = item.description
              item.providerUnit = item.institution
            })
            this.prodList = list
            this.queryParams.pageSize = decode(response).size;
            this.queryParams.pageNum = decode(response).current;
            this.total = decode(response).total;
            if (this.prodList.length > 0) {
              this.prodList2 = this.prodList
              let unitArr = []
              this.prodList.map(item => {
                unitArr.push(item.cunit)
              })
              unitArr = Array.from(new Set(unitArr))
              this.serveUnitList = unitArr
              this.noData = false
            } else {
              this.noData = true
            }
          })

        } else {
          this.isNewProd = false
          let par = {
            pageNum: 1,
            pageSize: this.pagesize,
            classification: name
          }
          this.getListApi(par)
        }
        document.getElementsByClassName('col_boxs').forEach(item => {
          item.style = ''
          if (item.innerHTML == name) {
            item.style = 'font-weight:bold'
          }
        })
      } else if (name == '震害防御') {
        this.isNewProd = true
        this.serveType = '震害防御'
        this.type = 2
        let par = {
          pageNum: 1,
          pageSize: this.pagesize,
          auditState: 99
        }
        ConditionsList(encode(par)).then(response => {
          let list = decode(response).records
          list.forEach(item => {
            item.productName = item.name
            item.directoryName = item.description
            item.providerUnit = item.institution
          })
          this.getDisProd()
          this.prodList = list
          this.queryParams.pageSize = decode(response).size;
          this.queryParams.pageNum = decode(response).current;
          this.total = decode(response).total;
          if (this.prodList.length > 0) {
            this.prodList2 = this.prodList
            let unitArr = []
            this.prodList.map(item => {
              unitArr.push(item.cunit)
            })
            unitArr = Array.from(new Set(unitArr))
            this.serveUnitList = unitArr
            this.noData = false
          } else {
            this.noData = true
          }
        })
      } else {
        this.isNewProd = false
        if (name == '全球5级以上地震目录') {
          this.addHot(name, '/monitor/bigEath?type=0')
          this.$router.push({
            path: 'bigEath',
            query: {type: 0}
          })
        } else if (name == '全球7级以上地震目录') {
          this.addHot(name, '/monitor/bigEath?type=0&m=7')
          this.$router.push({
            path: 'bigEath',
            query: {type: 0, m: 7}
          })
        } else if (name == '小震精定位目录') {
          this.addHot(name, '/monitor/bigEath?type=1')
          this.$router.push({
            path: 'bigEath',
            query: {type: 1}
          })
        } else if (name == 'search') {
          this.type = id
          let par = {
            pageNum: 1,
            pageSize: this.pagesize,
            name: this.searchValue,
            institution: this.serveUnit
          }
          this.getListApi(par)
        } else {
          if (name == '统一编目目录' || name == '震源机制解目录1' || name == '速报目录' || name == '震源机制解目录2') {
            let type = ''
            if (name == '统一编目目录') {
              type = 'cata'
            }
            if (name == '震源机制解目录1') {
              type = 'sms'
            }
            if (name == '震源机制解目录2') {
              type = 'smsxgp'
            }
            if (name == '速报目录') {
              type = 'soon'
            }
            this.$router.push({path: '/earthCataList', query: {type: type}})
            return
          }
          let url = null
          this.prodList.forEach(item => {
            if (item.id == id && item.linkUrl) {
              url = item.linkUrl
              if (confirm("您访问的链接即将离开公服网站，是否继续？")) {
                window.open(url)
              }
            }
          })
          if (!url) {
            this.$router.push({
              path: '/productInfo',
              query: {id: id}
            })
            this.addHot(name, '/monitor/productInfo?id=' + id)
          }
        }
      }
    },
    //新增热点搜索
    addHot(name, url) {
      let form = {
        keyName: '产品服务-' + name,
        url: url,
        linkUnit: ''
      }
      hotDataAdd(encode(form)).then()
    },
    //获得震害防御特殊产品列表
    getDisProd() {
      let par = {
        pageNum: 1,
        pageSize: 999,
        classification: '震害防御'
      }
      getlist(par).then(response => {
        let list = response.records
        list.forEach(item => {
          item.productName = item.name
          item.directoryName = item.classification
          item.providerUnit = item.institution
          this.prodList.unshift(item)
        })

      })
    },
    getCatalogPageList(data) {
      let info = {
        pageNum: data.page,
        pageSize: data.limit,
        nameProduct: data.nameProduct,
        approvalStatus: 99,
        productName: this.searchValue
      }
      if (this.searchValue == '') {
        delete (info.productName)
      }
      precursorCatalogList(encode(info)).then(response => {
        this.queryParams.pageSize = decode(response).size;
        this.queryParams.pageNum = decode(response).current;
        let list = decode(response).records
        list.forEach(item => {
          item.directoryName = item.nameProduct
          item.providerUnit = item.provide
        })
        this.total = decode(response).total;
        this.prodList = list;
        if (list.length == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
      });
    },
    getLevelPageList(data) {
      let info = {
        pageNum: data.page,
        pageSize: data.limit,
        productName: this.searchValue,
        auditState: 99
      }
      if (this.searchValue == '') {
        delete (info.productName)
      }
      levelList(encode(info)).then(response => {
        this.queryParams.pageSize = decode(response).size;
        this.queryParams.pageNum = decode(response).current;
        let list = decode(response).records
        list.forEach(item => {
          item.providerUnit = item.provideUnit
        })
        this.total = decode(response).total;
        this.prodList = list;
        if (list.length == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
      });
    },
    getUFPageList(data) {
      let info = {
        pageNum: data.page,
        pageSize: data.limit,
        productName: this.searchValue,
        auditState: 99
      }
      if (this.searchValue == '') {
        delete (info.productName)
      }
      ufList(encode(info)).then(response => {
        this.queryParams.pageSize = decode(response).size;
        this.queryParams.pageNum = decode(response).current;
        let list = decode(response).records
        this.total = decode(response).total;
        this.prodList = list;
        if (list.length == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
      });
    },
    getGNSSPageList(data) {
      let info = {
        pageNum: data.page,
        pageSize: data.limit,
        name: this.searchValue,
        auditState: 99,
        description: data.description
      }
      if (this.searchValue == '') {
        delete (info.name)
      }
      gnssList(encode(info)).then(response => {
        this.queryParams.pageSize = decode(response).size;
        this.queryParams.pageNum = decode(response).current;
        let list = decode(response).records
        list.forEach(item => {
          item.productName = item.name
          item.directoryName = item.description
          item.providerUnit = item.institution
        })
        this.total = decode(response).total;
        this.prodList = list;
        if (list.length == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
      });
    },
    toInfo(item, url) {
      if (url) {
        if (confirm("您访问的链接即将离开公服网站，是否继续？")) {
          window.open(url)
        }
        return
      }
      let data = JSON.stringify(item)
      this.addHot(item.productName, '/monitor/newProductInfo')
      this.$router.push({
        path: '/newProductInfo',
        query: {
          type: this.type
        }
      })
      sessionStorage.setItem('prodInfo', data)
      sessionStorage.setItem('prodPageInfoX', JSON.stringify({name: this.types, id: this.type}))
    },
    expands() {
      if (this.tiggle == '展开') {
        this.showExpand = true
        this.expand = 'el-icon-arrow-up'
        this.tiggle = '缩起'
      } else {
        this.showExpand = false
        this.expand = 'el-icon-arrow-down'
        this.tiggle = '展开'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.refuge {
  position: relative;
  top: 3px;
  width: 100%;
  // padding: 0px 400px;
  background-color: rgb(245, 245, 245);

  .topNav {
    position: absolute;
    top: 25px;
    left: 25px;
    background-color: #fff;
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
  }

  .asideBtn {
    position: absolute;
    top: 330px;
    left: calc(3% + 20px);

    .icon {
      font-size: 20px;
      margin-right: 5px;
    }

    .active {
      background-color: #1492ff !important;
      color: #fff;
    }
  }

  .main {
    width: 100%;
    min-height: 800px;
    background: url('../../assets/images/detailBk.jpg') no-repeat;
    background-size: 100% 300px;
    padding: 150px 90px;
    display: flex;
    justify-content: center;

    .total {
      color: #757575;
      display: flex;
    }

    .pages {
      width: 100%;
      display: flex;
      margin-top: 30px;
      margin-left: -80px;
      // flex: 25;
      justify-content: center;
    }

    .table {
      width: 100%;
      display: flex;
      justify-content: center;

      .right_box {
        width: 75%;
        min-width: 1000px;
      }

      .box_shxu {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #2c3e50;
        -webkit-box-direction: normal;
        display: flex;
        -webkit-box-pack: justify;
        justify-content: space-between;
        height: 60px;
        background-color: #fff;
        padding: 7px 5px;
        margin-top: 15px;
        border-bottom: 1px solid #e9e9e9;

        .tree_list_name {
          width: 900px;
          padding: 0px 15px;
        }
      }

      .name_table {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -webkit-box-direction: normal;
        width: 120px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #5a8bfe;
        font-size: 15px;
        border-radius: 0px 0px 0px 10px;
      }

      .col_boxs {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #2c3e50;
        -webkit-box-direction: normal;
        width: auto;
        height: 26px;
        float: left;
        margin-right: 30px;
        margin-left: 5px;
        text-align: center;
        line-height: 20px;
        padding: 0;
        margin-top: 12px;
        cursor: pointer;
        font-size: 15px;
      }

      .col_boxs:hover {
        font-weight: bold !important;
      }

      .col_box {
        border-radius: 15px;
        color: #5a8bfe;
      }

      .no-data {
        font-size: 18px;
        color: #515151;
        text-align: center;
        padding: 50px 0px;
      }

      .hovmul {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #2c3e50;
        -webkit-box-direction: normal;
        transition: box-shadow .5s, -webkit-box-shadow .5s;
        margin-bottom: 5px;
        background-color: rgb(255, 255, 255);
        padding: 10px 10px 10px;
        font-size: 14px;
      }
    }
  }
}
</style>
