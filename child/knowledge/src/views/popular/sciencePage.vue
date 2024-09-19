<template>
  <div class="science">
    <div class="box">
      <div class="topNav">
        <tabNav :pageName="'地震科普'"></tabNav>
      </div>
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        @close="closeDialog"
        width="1060px">
        <div class="video" v-show="playType == 'video'">
          <video :src="videoUrl" autoplay loop controls style="width: 1000px;"></video>
        </div>
        <div class="gif" v-show="playType == 'gif'">
          <img
            :src="gifUrl"
            style="width: 1000px;"
            alt=""
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="closeDialog">关 闭</el-button>
        </span>
      </el-dialog>

      <!-- 显示更多 -->
      <!-- <el-dialog
        :title="moreTitle"
        :visible.sync="showMore"
        @close="showMore = false"
        width="1060px">
        <ul style="display: flex;flex-wrap: wrap;justify-content: space-between;margin: 15px">
          <li v-if="moreList.length == 0"><div class="nodata">暂无数据</div></li>
          <li @click="openRes(itm,itm.fileName)" v-for="itm in moreList" :key="itm.fileId">
            <el-card shadow="hover" class="card-item" style="margin: 15px;">
              <div v-if="itm.url?itm.url.indexOf('.mp4') != -1:false">
                <img
                  :src="itm.smallImg?itm.smallImg:require(`@/assets/images/video.jpeg`)"
                  width="100%"
                  alt=""
                />
              </div>
              <div v-else-if="/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(itm.url?itm.url:'')">
                <img
                :src="itm.smallImg?itm.smallImg:itm.url"
                style="object-fit:cover"
                width="100%"
                alt=""
              />
              </div>
              <div v-else>
                <img
                  :src="itm.smallImg?itm.smallImg:require(`@/assets/images/word.png`)"
                  width="100%"
                  alt=""
                />
              </div>
              <p :title="itm.fileName" style="text-align: center;
              white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:210px">
                {{ itm.fileName }}</p>
            </el-card>
          </li>
        </ul>
        <div style="width: 100%;display:flex;justify-content:center">
          <el-pagination
            background
            :page-size="6"
            layout="prev, pager, next"
            @current-change="currentChangeMore"
            :total="total">
          </el-pagination>
        </div>
      </el-dialog> -->


      <div class="box_commom commom">
        <div class="left dspc">
          <h3>科普目录</h3>
        </div>
        <div class="right dspc">
          <div class="search">
            <el-input
              placeholder="请输入搜索内容"
              v-model="searchVal"
              class="input-with-select"
              :clearable="true"
            >
              <el-button @click="search" slot="append" icon="el-icon-search">搜索</el-button>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="container commom">
      <div class="footer">
        <div class="left">
          <el-card class="box-card" style="min-width: 630px">
            <div slot="header" class="clearfix">
              <span>防震减灾科普</span>
              <div v-if="showMore" @click="back"><el-link icon="el-icon-back">返回</el-link></div>
            </div>
            <div class="tab_body">
              <div v-if="pageList.length == 0" style="text-align:center;padding:100px">暂无数据</div>
              <div v-if="!showMore">
              <div class="classType" v-for="item in pageList" :key="item.typeId">
                <div class="title">
                  <div style="display:flex">
                    <img src="@/assets/images/book.png" />
                    <p :title="item.typeName">{{ item.typeName }}</p>
                    <i class="el-icon-d-arrow-right" style="font-size: 16px;line-height:28px;color: #007bff;"></i>
                  </div>
                  <div v-if="item.list.length > 3" class="more" @click="openMore(item.list,item.typeName,item.typeId)">
                    <span>更多</span><i class="el-icon-d-arrow-right"></i>
                  </div>
                </div>
                <ul style="display: flex;margin: 15px 0px;">
                  <li v-if="item.list.length == 0"><div class="nodata">暂无数据</div></li>
                  <li @click="openRes(itm,itm.fileName)" v-for="itm in item.list.slice(0,3)" :key="itm.fileId">
                    <el-card shadow="hover" class="card-item">
                      <div v-if="itm.url?itm.url.indexOf('.mp4') != -1:false">
                        <img
                          :src="itm.smallImg?itm.smallImg:require(`@/assets/images/video.jpeg`)"
                          width="100%"
                          alt=""
                        />
                      </div>
                      <div v-else-if="/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(itm.url?itm.url:'')">
                        <img
                        :src="itm.smallImg?itm.smallImg:itm.url"
                        style="object-fit:cover"
                        width="100%"
                        alt=""
                      />
                      </div>
                      <div v-else>
                        <img
                          :src="itm.smallImg?itm.smallImg:require(`@/assets/images/word.png`)"
                          width="100%"
                          alt=""
                        />
                      </div>
                      <p class="filename">{{ itm.fileName }}</p>
                    </el-card>
                  </li>
                </ul>
              </div>
            </div>

              <!-- 显示更多 -->
              <div v-if="showMore" class="title">
                <div style="display:flex">
                    <img src="@/assets/images/book.png" />
                    <p>{{ moreTitle }}</p>
                    <i class="el-icon-d-arrow-right" style="font-size: 16px;line-height:28px;color: #007bff;"></i>
                </div>
              </div>
              <ul v-if="showMore" style="display: flex;flex-wrap: wrap;justify-content: space-between;margin: 15px">
                <li v-if="moreList.length == 0"><div class="nodata">暂无数据</div></li>
                <li @click="openRes(itm,itm.fileName)" v-for="itm in moreList" :key="itm.fileId">
                  <el-card shadow="hover" class="card-item" style="margin: 15px;">
                    <div v-if="itm.url?itm.url.indexOf('.mp4') != -1:false">
                      <img
                        :src="itm.smallImg?itm.smallImg:require(`@/assets/images/video.jpeg`)"
                        width="100%"
                        alt=""
                      />
                    </div>
                    <div v-else-if="/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(itm.url?itm.url:'')">
                      <img
                      :src="itm.smallImg?itm.smallImg:itm.url"
                      style="object-fit:cover"
                      width="100%"
                      alt=""
                    />
                    </div>
                    <div v-else>
                      <img
                        :src="itm.smallImg?itm.smallImg:require(`@/assets/images/word.png`)"
                        width="100%"
                        alt=""
                      />
                    </div>
                    <p :title="itm.fileName" style="text-align: center;
                    white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:210px">
                      {{ itm.fileName }}</p>
                  </el-card>
                </li>
              </ul>
              <div v-if="showMore" style="width: 100%;display:flex;justify-content:center">
                <el-pagination
                  background
                  :page-size="6"
                  layout="prev, pager, next"
                  @current-change="currentChangeMore"
                  :total="total">
                </el-pagination>
              </div>
              <!-- <div class="buttom" style="margin: 10px auto 0">
                <a href="#">更多地震科普图集</a>>
              </div> -->
            </div>
          </el-card>
        </div>
        <div class="right">
          <el-card class="box-card" v-if="hotGiflist" shadow="never">
            <div slot="header" class="clearfix">
              <img style="width:20px;height:20px;margin-right: 5px;" src="@/assets/images/hot.png" /><span>热点排行榜</span>
            </div>
            <div v-for="(o, index) in hotGiflist.slice(0,12)" :key="index" class="text">
              <div class="ri_left">
                <span>{{ index + 1 }}</span>
              </div>
              <p @click="openRes(o,o.fileName)" class="hotText">{{ o.fileName }}</p>
            </div>
          </el-card>
          <!-- <el-card class="box-card" style="margin-top: 15px;" shadow="never">
            <div slot="header" class="clearfix">
              <img style="width:20px;height:20px;margin-right: 5px;" src="@/assets/images/hot.png" /><span>热点视频排行榜</span>
            </div>
            <div v-for="(o, index) in hotlist" :key="index" class="text">
              <div class="ri_left">
                <span>{{ index + 1 }}</span>
              </div>
              <p @click="openVideo(o.url,o.name)" class="hotText">{{ o.name }}</p>
            </div>
          </el-card> -->
        </div>
      </div>
      <div class="top">
        <div class="left">
          <el-card class="box-card" style="height: 680px; min-width: 630px">
            <div slot="header" class="clearfix">
              <span>科普示范基地学校名录</span>
            </div>
            <div class="tab_body">
              <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
              <el-form-item label="名称" prop="schoolName">
                <el-input
                style="width:200px"
                  size="small"
                  v-model="queryParams.schoolName"
                  placeholder="请输入名称"
                  clearable
                />
              </el-form-item>
              <el-form-item label="省份" prop="schoolProvince">
                <el-select v-model="queryParams.schoolProvince" placeholder="请选择省份" style="margin: 0px 10px;width: 150px;" size="small" clearable>
                  <el-option
                    v-for="dict in provinList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-right:50px" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
              <el-radio-group size="medium" v-model="type">
                <el-radio-button label="学校"></el-radio-button>
                <el-radio-button label="基地"></el-radio-button>
              </el-radio-group>
              <div class="school">
                <el-table
                  v-if="type == '学校'"
                  :data="schoolList"
                  style="width: 100%"
                  :show-header="false"
                  height="500">
                  <el-table-column
                    prop="schoolProvince"
                    label="省份">
                  </el-table-column>
                  <el-table-column
                    prop="schoolName"
                    label="学校名称">
                  </el-table-column>
                  <el-table-column
                    prop="confirmTime"
                    label="确认时间">
                  </el-table-column>
                </el-table>
                <el-table
                  v-else
                  :data="baseList"
                  style="width: 100%"
                  :show-header="false"
                  height="500">
                  <el-table-column
                    prop="baseProvince"
                    label="省份">
                  </el-table-column>
                  <el-table-column
                    prop="baseName"
                    label="学校名称">
                  </el-table-column>
                  <el-table-column
                    prop="confirmTime"
                    label="确认时间">
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination
              v-if="type == '学校'"
                layout="prev, pager, next, total"
                :total="total2"
                @current-change="currentChange2">
              </el-pagination>
              <el-pagination
              v-else
                layout="prev, pager, next, total"
                :total="total3"
                @current-change="currentChange3">
              </el-pagination>
              <!-- <div class="buttom" style="margin: 10px auto 0">
                <a href="#">更多地震科普视频</a>>
              </div> -->
            </div>
          </el-card>
        </div>
      </div>
      <div class="footer">
        <div class="left">
          <el-card class="box-card" style="min-width: 630px">
            <div slot="header" class="clearfix">
              <span>科普传播师</span>
            </div>
            <div class="tab_body">
              <div class="school">
                <el-table
                  :data="manList"
                  style="width: 100%"
                  :show-header="false"
                  height="410">
                  <el-table-column
                    prop="name"
                    label="学校名称">
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination
                style="text-align: center"
                layout="prev, pager, next, total"
                :total="manList.length"
                :page-size="6">
              </el-pagination>
            </div>
          </el-card>
        </div>
      </div>
      <div style="height: 100px;"></div>
    </div>
  </div>
</template>

<script>
import tabNav from '@/components/topNav.vue'
import { preView } from '@/api/prod'
import { getList, getTypeList, getSchoolList, getBaseList, viewNumberSort, viewNumberAdd } from '@/api/know'
import { encode } from '@/utils/dataEncry'
import {
  hotAdd,
  hotDataAdd
} from '@/api/hots'
export default {
  components: { tabNav },
  data() {
    return {
      input: '',
      activeName: 'first',
      activeName1: 'first',
      title: '',
      dialogVisible: false,
      showIfr: false,
      previewUrl: '',
      videoUrl: '',
      playType: 'video',
      basetype:'',
      gifUrl: '',
      total: 0,
      total2: null,
      typeId: null,
      total3: null,
      type: '学校',
      pageList: [],
      typeList: [], //类型列表
      manList: [],
      baseList: [],
      moreList: [],
      showMore: false,
      moreTitle: '', //更多弹窗标题
      searchVal: '',
      queryParams:{ //学校基地搜索数据
        schoolName: '',
        schoolProvince: ''
      },
      sourceList: [
        {
          name: '成层火山演化过程',
          url: '成层火山演化过程'
        },
        {
          name: '地震波传播-P波',
          url: '地震波传播-P波'
        },
        {
          name: '地震震级',
          url: 'dzzj.mp4'
        },
        {
          name: '活动断层与地震',
          url: 'hddc.mp4'
        },
        {
          name: '地震波传播-S波',
          url: '地震波传播-S波'
        },
        {
          name: '地震计工作原理',
          url: '地震计工作原理'
        },
        {
          name: '地震的分类',
          url: 'dzfl.mp4'
        },
        {
          name: '断层形成过程',
          url: '断层形成过程'
        },
        {
          name: '断层形成过程2',
          url: '断层形成过程2'
        },
        {
          name: '地震来了是躲还是跑？',
          url: 'dzll.mp4'
        },
        {
          name: '逆断层',
          url: '逆断层'
        },
        {
          name: '碰撞造山带',
          url: '碰撞造山带'
        },
      ],
      schoolList: [
      ],
      videoIndex: [
        {
          name: '地震带',
          url: 'dzd'
        },
        {
          name: '地震来了是躲还是跑？',
          url: 'dzll'
        },
        {
          name: '地震的分类',
          url: 'dzfl'
        },
        {
          name: '地震人',
          url: 'dzr'
        },
        {
          name: '地震震级',
          url: 'dzzj'
        },
        {
          name: '活动断层与地震',
          url: 'hddc'
        }
      ],
      vedioList: [
      {
          name: '地震带',
          url: 'dzd'
        },
        {
          name: '地震来了是躲还是跑？',
          url: 'dzll'
        },
        {
          name: '地震的分类',
          url: 'dzfl'
        },
        {
          name: '地震人',
          url: 'dzr'
        },
        {
          name: '地震震级',
          url: 'dzzj'
        },
        {
          name: '活动断层与地震',
          url: 'hddc'
        },
        {
          name: '漫画地震科学史上集',
          url: 'mhdz'
        },
        {
          name: '漫画地震科学史中集',
          url: 'mhdz3'
        },
        {
          name: '漫画地震科学史下集',
          url: 'mhdz2'
        }
      ],
      hotlist: [],
      gifList:[
        {
          name: '成层火山演化过程',
          url: '成层火山演化过程'
        },
        {
          name: '地震波传播-P波',
          url: '地震波传播-P波'
        },
        {
          name: '地震波传播-S波',
          url: '地震波传播-S波'
        },
        {
          name: '地震计工作原理',
          url: '地震计工作原理'
        },
        {
          name: '地质历史',
          url: '地质历史'
        },
        {
          name: '地质历史2',
          url: '地质历史2'
        },
        {
          name: '断层形成过程',
          url: '断层形成过程'
        },
        {
          name: '断层形成过程2',
          url: '断层形成过程2'
        },
        {
          name: '米兰科维奇循环',
          url: '米兰科维奇循环'
        },
        {
          name: '米兰科维奇循环2',
          url: '米兰科维奇循环2'
        },
        {
          name: '逆断层',
          url: '逆断层'
        },
        {
          name: '碰撞造山带',
          url: '碰撞造山带'
        },
        {
          name: '正断层',
          url: '正断层'
        },
        {
          name: '走滑断层',
          url: '走滑断层'
        }
      ],
      hotGiflist: [],
      provinList: [
        {label:"北京",value:"北京"},
        {label:"天津",value:"天津"},
        {label:"河北",value:"河北"},
        {label:"山西",value:"山西"},
        {label:"内蒙",value:"内蒙"},
        {label:"辽宁",value:"辽宁"},
        {label:"吉林",value:"吉林"},
        {label:"黑龙江",value:"黑龙江"},
        {label:"上海",value:"上海"},
        {label:"江苏",value:"江苏"},
        {label:"浙江",value:"浙江"},
        {label:"安徽",value:"安徽"},
        {label:"福建",value:"福建"},
        {label:"江西",value:"江西"},
        {label:"山东",value:"山东"},
        {label:"河南",value:"河南"},
        {label:"湖北",value:"湖北"},
        {label:"湖南",value:"湖南"},
        {label:"广东",value:"广东"},
        {label:"广西壮族自治区",value:"广西壮族自治区"},
        {label:"海南",value:"海南"},
        {label:"重庆",value:"重庆"},
        {label:"四川",value:"四川"},
        {label:"贵州",value:"贵州"},
        {label:"云南",value:"云南"},
        {label:"西藏",value:"西藏"},
        {label:"陕西",value:"陕西"},
        {label:"甘肃",value:"甘肃"},
        {label:"青海",value:"青海"},
        {label:"宁夏",value:"宁夏"},
        {label:"新疆",value:"新疆"}
      ],
    }
  },
  mounted() {
    //热点数据
    this.getType()
    this.getSchList({page: 1,limit: 10})
    this.getBSList({page: 1,limit: 10})
    this.getHotList()
    //热点跳转详情
    this.getHot()
  },
  methods: {
    getType() {
      let par = {
          pageNum: 1,
          pageSize: 50
        }
      getTypeList(par).then(res=>{
        this.typeList = res.records
        this.typeList.forEach(item=>{
            this.getPageList({typeId: item.typeId,typeName: item.typeName},1)
        })
      })
    },
    //热点列表
    getHotList() {
      viewNumberSort().then(res=>{
        this.hotGiflist = res
      }).catch(e=>{
        this.getHotList()
      })
    },
    //新增热点搜索
    addHot(name,type,url){
      let form = {
            keyName: '地震科普-'+name,
            url: '/knowledge/science',
            linkUnit: '',
            postUrl: type+'-'+url
          }
      hotDataAdd(encode(form)).then()
    },
    //热点跳转详情
    getHot() {
      if(!sessionStorage.getItem('hotInfo')){
        return
      }
      let name = JSON.parse(sessionStorage.getItem('hotInfo')).keyName
      if(name.split('-')[0] == '地震科普'){
        let item = JSON.parse(sessionStorage.getItem('hotInfo'))
        if(!item.postUrl){
          this.$router.push({path: 'scienceInfo', query: {title: name.split('-')[1], type: item.postUrl, url: item.postUrl, views: item.viewNumber}})
        }else{
          this.$router.push({path: 'scienceInfo', query: {title: name.split('-')[1], type: item.postUrl.split('-')[0], url: item.postUrl.split('-')[1], views: item.viewNumber}})
        }
      }
    },
    openMore(list,title,typeId) {
      this.showMore = true
      this.typeId = typeId
      this.moreTitle = title
      this.getPageListMore({typeId: this.typeId,typeName: this.moreTitle},1)
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    getBSList(data) {
      let par = 'pageNum='+data.page+'&pageSize='+data.limit
      if(this.queryParams.schoolProvince != ''){
        par = 'pageNum='+data.page+'&pageSize='+data.limit+'&baseName='+this.queryParams.schoolName+'&baseProvince='+this.queryParams.schoolProvince
      }else {
        par = 'pageNum='+data.page+'&pageSize='+data.limit+'&baseName='+this.queryParams.schoolName
      }
        getBaseList(par).then(res=>{
        this.baseList = res.records
        this.total3 = res.total
        this.baseList = this.baseList.filter(item=>{return item.taskState == 1})
      })
    },
    getSchList(data) {
      let par = 'pageNum='+data.page+'&pageSize='+data.limit
      if(this.queryParams.schoolProvince != ''){
        par = 'pageNum='+data.page+'&pageSize='+data.limit+'&schoolName='+this.queryParams.schoolName+'&schoolProvince='+this.queryParams.schoolProvince
      }else {
        par = 'pageNum='+data.page+'&pageSize='+data.limit+'&schoolName='+this.queryParams.schoolName
      }
      getSchoolList(par).then(res=>{
        this.schoolList = res.records
        this.total2 = res.total
        this.schoolList = this.schoolList.filter(item=>{return item.taskState == 1})
      })
    },
    handleQuery(){
      this.loading = true
      if(this.type == '学校'){
        let info = {
          pageNum: 1,
          pageSize: 10,
          schoolName: this.queryParams.schoolName,
          schoolProvince: this.queryParams.schoolProvince
        }
        let str = ''
        if(this.queryParams.schoolProvince != ''){
          str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize+'&schoolName='+info.schoolName+'&schoolProvince='+info.schoolProvince
        }else {
          str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize+'&schoolName='+info.schoolName
        }
        getSchoolList(str).then(response => {
          this.loading = false;
          this.total2 = response.total;
          this.schoolList = response.records;
          this.schoolList = this.schoolList.filter(item=>{return item.taskState == 1})
        });
      }else {
        let info = {
          pageNum: 1,
          pageSize: 10,
          baseName: this.queryParams.schoolName,
          baseProvince: this.queryParams.schoolProvince
        }
        let str = ''
        if(this.queryParams.schoolProvince != ''){
          str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize+'&baseName='+info.baseName+'&baseProvince='+info.baseProvince
        }else {
          str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize+'&baseName='+info.baseName
        }
        getBaseList(str).then(response => {
          this.loading = false;
          this.total3 = response.total;
          this.baseList = response.records;
          this.baseList = this.baseList.filter(item=>{return item.taskState == 1})
        });
      }
    },
    //更多翻页
    getPageListMore(data,num) {
      let par = {
          pageNum: num,
          pageSize: 6,
          typeId: data.typeId,
          fileName: '',
          taskState: 0,
        }
      getList(par).then(res=>{
        let list = res.records
        this.total = res.total
        this.moreList = [...list]
      })
    },
    getPageList(data,num) {
      let par = {
          pageNum: num,
          pageSize: 6,
          typeId: data.typeId,
          fileName: '',
          taskState: 0,
        }
      getList(par).then(res=>{
        let list = res.records
        this.pageList.push({
          typeId: data.typeId,
          typeName: data.typeName,
          list: list
        })

        //热点图集排序
        if(list.length > 1){
          for(let j=0;j<list.length - 1;j++){
            for(let i=0;i<list.length - 1 - j;i++){
              if(parseInt(list[i].viewNumber) < parseInt(list[i + 1].viewNumber)){
                let temp = list[i]
                list[i] = list[i + 1]
                list[i + 1] = temp
              }
            }
          }
       }

        for(let j=0;j<this.pageList.length - 1;j++){
          for(let i=0;i<this.pageList.length - 1 - j;i++){
            if(this.pageList[i].typeId < this.pageList[i + 1].typeId){
              let temp = this.pageList[i]
              this.pageList[i] = this.pageList[i + 1]
              this.pageList[i + 1] = temp
            }
          }
        }
      })
    },
    search() {
      this.pageList = []
      let par = {
          pageNum: 1,
          pageSize: 9999,
          fileName: this.searchVal,
          taskState: 0,
        }
        const self = this
      getList(par).then(res=>{
        let list = res.records
        let typeList = []
        list.forEach(item=>{
          if(!typeList.includes(item.typeName)){
            typeList.push(item.typeName)
            self.pageList.push({
              typeName: item.typeName,
              list: [item]
            })
          }else{
            self.pageList.forEach(itm=>{
              if(itm.typeName == item.typeName){
                itm.list.push(item)
              }
            })
          }
        })
      })
    },
    openVideo(item) {
      this.title = item.fileName
      this.playType = 'video'
      this.videoUrl = item.url
      this.$router.push({path: 'scienceInfo', query: {title: this.title, type: 'video', url: item.url, views: item.viewNumber}})
    },
    openRes(item,title) {
      viewNumberAdd(encode({fileId: item.fileId})).then()
      if(item.url.indexOf('mp4') != -1){
        this.openVideo(item);
        this.addHot(title,'video',item.url)
      }else{
        this.openGif(item,title);
        this.addHot(title,'gif',item.url)
      }
    },
    close() {
      this.showIfr = false
    },
    closeDialog() {
      this.dialogVisible = false;
      this.videoUrl = ''
      this.gifUrl = ''
    },
    //更多返回
    back() {
      this.showMore = false
    },
    openGif(item,title) {
      this.title = title
      if(/\.(docx|doc|xlsx|pptx|pdf|DOCX|DOC|XLSX|PPTX|PDF)$/.test(item.url)){
        this.playType = 'word'
        preView(item.url.split('=')[1]).then(res=>{
          // let url = process.env.VUE_APP_CRIT_API + '/fileservice/ecdownload'
          let blob = new Blob([res], { type: 'application/pdf' })
          let blobURL = URL.createObjectURL(blob)

          // let win = window.open(blobURL)
          this.previewUrl = blobURL + '#toolbar=0'
          window.open(this.previewUrl)
          setTimeout(() => {
            window.document.name = row.filename
          }, 500)
        })

      }else{
        this.gifUrl = item.url
        if(this.gifUrl != ''){
          this.playType = 'gif'
          this.$router.push({path: 'scienceInfo', query: {title: title, type: 'gif', url: item.url, views: item.viewNumber}})
        }
      }
      // this.showIfr = true
      // this.dialogVisible = true
    },
    currentChange(p) {
      this.videoIndex = this.vedioList.slice(6*(p-1),6*p)
    },
    currentChange2(data) {
      this.getSchList({page: data, limit: 10});
    },
    currentChange3(data) {
      this.getBSList({page: data, limit: 10});
    },
    currentChangeMore(data) {
      this.getPageListMore({typeId: this.typeId,typeName: this.moreTitle},data)
    }
  }
}
</script>

<style lang="less" scoped>
.dspc {
  display: flex;
  flex-direction: column;
  line-height: 180%;
}
.science {
  .box {
    position: relative;
    margin: -3px auto 0px auto;
    background-color: #fff;
    height: 240px;
    background: url(@/assets/images/sjbg.jpg) no-repeat center center;
    background-size: 100% 100%;
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
  .video {
    margin-left: 10px;
  }
  .iframe {
    position: absolute;
    // display: flex;
    top: 200px;
    width: 1000px;
    height: 800px;
    // justify-content: center;
    z-index: 1005;
    font-size: 30px;
    color: #fff;
  }
  .container {
    padding: 0 0;
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
            width: 230px;
            height: 32px;
            color: #fff;
            line-height: 32px;
            padding: 0px 18px;
            background: url(@/assets/images/kptitbg.png) no-repeat center center;
            background-size: cover;
          }
        }
        .smallTitle {
          width: 150px !important;
          // background: url(@/assets/images/kptitbg.png) no-repeat center center;
        }
        .tab_body {
          // text-align: center;
          ul {
            flex-wrap: wrap;
            // justify-content: space-between;
            li {
              width: 32%;
              margin-bottom: 10px;
              margin-left: 10px;
            }
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
    .hotText {
      cursor: pointer;
      color:#019adf;
    }
    .hotText:hover {
      color:rgb(110, 180, 255);
    }
    .title {
      display: flex;
      justify-content: space-between;
      p {
        line-height: 28px;
        font-size: 16px;
        margin-right: 8px;
        font-weight: bold;
        border-bottom: 2px solid #007bff;
      }
      img {
        width: 28px;
        height: 28px;
        margin-right: 5px
      }
      .more {
        color: #007bff;
        font-size: 14px;
        margin-top: 10px;
        cursor: pointer;
      }
    }
    .footer {
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
          // text-align: center;
          .classType {
            margin: 8px 0px;
            .title {
              display: flex;
              justify-content: space-between;
              p {
                line-height: 28px;
                font-size: 16px;
                margin-right: 8px;
                font-weight: bold;
                border-bottom: 2px solid #007bff;
              }
              img {
                width: 28px;
                height: 28px;
                margin-right: 5px
              }
              .more {
               color: #007bff;
               font-size: 14px;
               margin-top: 10px;
               cursor: pointer;
              }
            }
          }
          ul {
            flex-wrap: wrap;
            // justify-content: space-around;
            li {
              width: 32%;
              margin-bottom: 10px;
              margin-left: 10px;
            }
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
        .audios {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .img {
            width: 120px;
            height: 90px;
            margin-right: 10px;
          }
          .txt {
            width: 100%;
            min-width: 130px;
            audio {
              width: 100%;
              height: 30px;
              margin-top: 10px;
            }
          }
        }
      }
      .right {
        width: 270px;
        padding: 10px;
        .box-card {
          border: none;
          height: 570px;
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
  .filename {
    width: 210px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .nodata {
    width: 100%;
    text-align: center;
    margin: 50px 0px;
    color: rgb(102, 102, 102);
    font-size: 15px;
  }
  .moreTitle {
    font-size: 17px;
    padding: 15px 0px;
  }
  .card-item {
    display: flex;
    justify-content: center;
    img {
      width: 215px;
      height: 150px;
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
  .science .box {
    width: 100vw;
    height: 29vh;
  }
}
@media (max-width: 1200px) {
  .science .box {
    width: 1200px;
    height: 240px;
  }
  .science {
    width: 1200px;
    background-color: #e8eaeb;
  }
}
</style>
