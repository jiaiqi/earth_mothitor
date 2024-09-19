<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['workflow:order:index']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->
    <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
      <el-tab-pane label="用户访问列表" name="user">
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
    >
      <el-table-column prop="userName" label="用户名" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="userProvince" label="省份" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="loginTime" label="登入时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.loginTime? new Date(scope.row.loginTime).toLocaleString(): ''}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="outTime" label="登出时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.outTime? new Date(scope.row.outTime).toLocaleString(): ''}}
        </template>
      </el-table-column> -->
      <el-table-column label="用户状态" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div :style="{'color': scope.row.userState == '在线' ? '#67C23A' : '#909399' }">
            {{ scope.row.userState }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleInfo(scope.row)"
            v-hasPermi="['workflow:count:index']"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getPageList" />
      </el-tab-pane>
      <el-tab-pane label="访问情况" name="view">
        <div>
          <!-- <el-radio-group v-model="viewType" size="medium">
            <el-radio-button label="按年份" ></el-radio-button>
            <el-radio-button label="按月份"></el-radio-button>
            <el-radio-button label="按每天"></el-radio-button>
          </el-radio-group> -->
          按年份：<el-select v-model="yearVal" @change="changeVal" size="small" placeholder="请选择年份" clearable>
                <el-option
                  v-for="dict in yearList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
          按月份：<el-select v-model="monthVal" @change="changeVal" size="small" placeholder="请选择月份" clearable>
            <el-option
              v-for="dict in monthList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
          按每天：<el-select v-model="dayVal" @change="changeVal" size="small" placeholder="请选择日" clearable>
            <el-option
              v-for="dict in dayList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </div>
        <div v-if="showLine" style="width:100%;padding: 50px 0px;">
          <line-chart :chart-data="lineChartData" :yList="xList" :typeList="['访问量', '访客数']" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="用户同时在线数" name="online">
        <div>
          按年份：<el-select v-model="yearVal" @change="changeVal2" size="small" placeholder="请选择年份" clearable>
                <el-option
                  v-for="dict in yearList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
          按月份：<el-select v-model="monthVal" @change="changeVal2" size="small" placeholder="请选择月份" clearable>
            <el-option
              v-for="dict in monthList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
          按每天：<el-select v-model="dayVal" @change="changeVal2" size="small" placeholder="请选择日" clearable>
            <el-option
              v-for="dict in dayList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </div>
        <div v-if="showLine2" style="width:100%;padding: 50px 0px;">
          <line-chart :chart-data="lineChartData" :yList="xList" :typeList="['同时在线人数']" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="数据目录统计" name="cata">
        <div>
          <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px;">
            <el-select
              v-model="yearVal"
              style="width: 180px;margin: 15px 0px;"
              placeholder="请选择年份"
              @change="changeYear"
              size="mini"
            >
              <el-option v-for="item in yearList" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
            <el-select
              v-model="selMon"
              style="width: 120px;margin: 15px 5px;"
              placeholder="请选择月份"
              clearable
              @change="changeMonth"
              size="mini"
            >
              <el-option v-for="item in monList" :key="item" :label="`${item}月`" :value="item" />
            </el-select>
            <bar-chart v-if="activeName == 'cata'" :xData="barxList" :yData="baryList"  />
          </el-row>
      <div style="display: flex;width: 900px;justify-content: space-around;margin-top: 50px;">
      <el-select v-model="pietype" @change="clearSel" size="small" placeholder="请选择类型">
        <el-option
          label="月份"
          value="月份"
        ></el-option>
        <el-option
          label="季度"
          value="季度"
        ></el-option>
      </el-select>
      <div v-if="pietype == '月份'">
        年份：<el-select style="margin-right: 15px;" @change="changeVal3" v-model="yearVal2" size="small" placeholder="请选择年份">
                <el-option
                  v-for="dict in yearList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
        月份：<el-select v-model="monthVal2"  @change="clearSel" size="small" placeholder="请选择月份" clearable>
          <el-option
            v-for="dict in monthList2"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </div>
      <div v-else>
        年份：<el-select style="margin-right: 15px;" @change="changeVal3" v-model="yearVal2" size="small" placeholder="请选择年份">
                <el-option
                  v-for="dict in yearList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
        季度：<el-select v-model="several" @change="clearSel" size="small" placeholder="请选择季度" clearable>
          <el-option
            label="1"
            value="1"
          ></el-option>
          <el-option
            label="2"
            value="2"
          ></el-option>
          <el-option
            label="3"
            value="3"
          ></el-option>
          <el-option
            label="4"
            value="4"
          ></el-option>
        </el-select>
      </div>
    </div>
    <el-collapse style="width:80%;margin:20px 50px">
      <el-collapse-item title="学科类型" name="1">
        <div style="background-color: rgb(245, 245, 245);" v-if="activeName == 'cata'" class="selCata">
          <div :id="item.id" @click="selCata(item)" v-for="item in catalist" :key="item">
            <span style="padding: 0px 10px;">{{ item.sname }}</span>
          </div>
        </div>
          <div v-for="(item,index) in pieListAll" :key="index">
            <pie-chart :pieData="item" />
          </div>
      </el-collapse-item>
    </el-collapse>
        </div>
      </el-tab-pane>
      <el-tab-pane label="其他统计" name="other">
        <div>
          <div class="selType">请选择学科类型：
            <el-radio-group v-model="subType" @change="changeSub">
              <el-radio :label="1">产品目录</el-radio>
              <el-radio :label="2">技术服务</el-radio>
              <el-radio :label="3">法规标准</el-radio>
              <el-radio :label="4">地震科普</el-radio>
            </el-radio-group>
          </div>
          <div class="selType2" v-if="subType == 1">
            产品类型：
            <el-select v-model="subType2" placeholder="请选择产品类型" size="small" @change="changeProdType">
              <el-option
                v-for="item in prodOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div>
          <el-row style="background: #fff; padding: 5px 16px 0; margin-bottom: 32px;">
            <el-select
              v-if="subType != 3"
              v-model="yearVal"
              style="width: 180px;margin: 15px 0px;"
              placeholder="请选择年份"
              @change="changeYear"
              size="mini"
            >
              <el-option v-for="item in yearList" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
            <el-select
              v-if="subType != 3"
              v-model="selMon"
              style="width: 120px;margin: 15px 5px;"
              placeholder="请选择月份"
              clearable
              @change="changeMonth"
              size="mini"
            >
              <el-option v-for="item in monList" :key="item" :label="`${item}月`" :value="item" />
            </el-select>
            <bar-chart v-if="activeName == 'other' && subType != 3" :xData="barxList" :yData="baryList" :height="'420px'" />
            <pie-chart v-if="activeName == 'other' && subType == 3" :pieData="pieData" :height="'500px'" />
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1280px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="form.userName" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="省份" prop="userProvince">
              <el-input v-model="form.userProvince" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="IP地址" prop="userIp">
              <el-input v-model="form.userIp" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="20">``
            <el-form-item label="登入时间" prop="loginTime">
              <el-input v-model="form.loginTime" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="登出时间" prop="outTime">
              <el-input v-model="form.outTime" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="用户状态" prop="userState">
              <el-input v-model="form.userState" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
  import { getList, getPVStat, getUVStat, getOnlineNum, getSubAll } from "@/api/workflow/count";
  import { getCountByQuarter, getCount } from "@/api/workflow/count"
  import { knowledgeCount } from "@/api/workflow/knowledge"
  import { listUser } from "@/api/system/user"
  import { ufProdCount, catalogProdCount, gnssProdCount, prodServeCount } from "@/api/workflow/prods"
  import { getUserProfile } from "@/api/system/user"
  import { lawCount, standardCount } from "@/api/dataup/criterion"
  import { socialList, getField, getClassification, socialAdd, socialEdit, socialDel } from "@/api/workflow/directory";
  // import { getField } from "@/api/workflow/directory";
  import LineChart from '@/views/dashboard/LineChart'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";
  import { encode, decode } from '@/utils/base/dataEncry.js';
  import PieChart from '@/views/dashboard/PieChart'
  import BarChart from '@/views/dashboard/BarChart'

  export default {
    name: "Menu",
    dicts: ['sys_show_hide', 'sys_normal_disable'],
    components: { Treeselect, IconSelect, LineChart, PieChart, BarChart },
    data() {
      return {
        editor: null,
        toolbarConfig: { },
        mode: 'default', // or 'simple'
        selMon: '',
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        menuList: [],
        //是否可编辑
        isEdit: false,
        //列表数
        total: 1,
        yearList: [],
        yearList2: [],
        monthList: [],
        monthList2: [],
        monthList3: [],
        dayList: [],
        seledType: [],
        seledTypeName: [],
        monList: [],
        //柱状图x
        barxList:[],
        //柱状图y
        baryList:[],
        pielist:[],
        pieListAll: [],
        subType: 1,
        subType2: '',
        yearVal: new Date().getFullYear(),
        monthVal: (new Date().getMonth() +1) >= 10?(new Date().getMonth() +1):'0'+(new Date().getMonth() +1),
        dayVal: new Date().getDate() >= 10?new Date().getDate():'0'+new Date().getDate(),
        monthVal2: (new Date().getMonth() +1) >= 10?(new Date().getMonth() +1):'0'+(new Date().getMonth() +1),
        yearVal2: new Date().getFullYear(),
        several: null,
        xList: [],  //x轴列表
        catalist: [],
        pieData: [],  //法规
        prodOption: [
          {
            value: '地下流体',
            label: '地下流体'
          },
          {
            value: 'GNSS',
            label: 'GNSS'
          },
          {
            value: 'InSAR',
            label: 'InSAR'
          },
          {
            value: '地震区划图',
            label: '地震构造图'
          },
          {
            value: '地震活动断层',
            label: '地震活动断层'
          },
          {
            value: '工程抗震',
            label: '工程抗震'
          },
          {
            value: '地磁、地电、重力、定点形变',
            label: '地磁、地电、重力、定点形变'
          },
          {
            value: '地倾斜、地应变',
            label: '地倾斜、地应变'
          }
        ],
        viewType: '按每天',
        pietype: '月份',
        showLine: false,
        showLine2: false,
        activeName: 'user',
        statusList: [  // 订单状态
          {
            value: '完成',
            label: '完成'
          },
          {
            value: '待处理',
            label: '待处理'
          },
          {
            value: '已关闭',
            label: '已关闭'
          },
          {
            value: '其他',
            label: '其他'
          }
        ],
        // 菜单选项
        typeList: [
          {
            value: 0,
            label: '数据目录'
          },
          {
            value: 1,
            label: '产品目录'
          },
          {
            value: 2,
            label: '技术服务目录'
          }
        ],
        showPie: false,
        // 弹出层标题
        title: "新增",
        // 是否显示弹出层
        open: false,
        // 是否展开，默认全部折叠
        isExpandAll: false,
        // 重新渲染表格状态
        refreshTable: true,
        editorConfig: {
        placeholder: "请输入内容...",
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {
            server: process.env.VUE_APP_PRODS_API + '/prodSer/uploadImage',
            fieldName: 'file'
          },
        },
      },
        // 查询参数
        queryParams2: {
          pageNum: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParams: {
          userName: null
        },
        userlist: [],
        user: {},
        postGroup: {},
        fieldId: '',
        classificationId: '',
        // 表单参数
        form: {
          id: '',
          userName: '',
          userIp: '',
          userProvince: '',
          loginTime: '',
          outTime: '',
          userState: '',
        },
        props: {
          value: 'bClass',
          label: 'bClass',
          children: 'sClass'
        },
        lineChartData: {
            expectedData: [],
            userNumData: []
        },
        sClassification: [],
        menuOptions: [],
        menuOptions2: [],
        lineChartData2: {
          newVisitis: {
            expectedData: [100, 120, 161, 134, 105, 160, 165],
            userNumData: [120, 82, 91, 154, 162, 140, 145]
          },
          messages: {
            expectedData: [200, 192, 120, 144, 160, 130, 140],
            userNumData: [180, 160, 151, 106, 145, 150, 130]
          },
          purchases: {
            expectedData: [80, 100, 121, 104, 105, 90, 100],
            userNumData: [120, 90, 100, 138, 142, 130, 130]
          },
          shoppings: {
            expectedData: [130, 140, 141, 142, 145, 150, 160],
            userNumData: [120, 82, 91, 154, 162, 140, 130]
          },
        },
        // 表单校验
        rules: {
          menuName: [
            { required: true, message: "菜单名称不能为空", trigger: "blur" }
          ],
          orderNum: [
            { required: true, message: "菜单顺序不能为空", trigger: "blur" }
          ],
          path: [
            { required: true, message: "路由地址不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getPageList({
        page: 1,
        limit: 10
      });
    },
    mounted() {
      this.changeVal()
      this.getCataList()
    },
    methods: {
        onCreated(editor) {
              this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
          },
      mounted() {
          // 模拟 ajax 请求，异步渲染编辑器
          setTimeout(() => {
              this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
          }, 1500)
      },
    async customUpload(file, insertFn) {                   // JS 语法
        // file 即选中的文件
        // 自己实现上传，并得到图片 url alt href
        // 最后插入图片
        insertFn(url, alt, href)
    },
      beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
      },
    /** 查询学科列表 */
     getCataList(data) {
      let list = []
      let str = 'pageNum=1&pageSize=999'
        getSubAll(str).then(response => {
          list = response.records;
           list.map(item=>{
            this.catalist.push(item)
          })
        });
      },
      clearSel() {
        this.seledType = []
        this.catalist.forEach(item=>{
          document.getElementById(item.id).style = ''
        })
        this.seledType = []
        this.seledTypeName = []
      },
      changeProdType() {
        //地下流体
        if(this.subType2 == this.prodOption[0].value) {
          this.changeSub(1)
        }
        //GNSS、区划图、活断层等
        if(this.subType2 == this.prodOption[1].value || this.subType2 == this.prodOption[2].value ||
        this.subType2 == this.prodOption[3].value || this.subType2 == this.prodOption[4].value || 
        this.subType2 == this.prodOption[5].value) {
          this.gnssCount()
        }
        //地磁地电定点形变等
        if(this.subType2 == this.prodOption[6].value || this.subType2 == this.prodOption[7].value) {
          this.getCatalogCount()
        }
      },
      //获取用户列表
      getUserList() {
        listUser({pageNum:1,pageSize: 9999}).then(res=>{
          this.userlist = [...res.rows]
        })
      },
      selCata(item) {
        let par = ''
        let name = ''
        let date = this.yearVal2 + '-' + this.monthVal2
        if(!this.seledType.includes(item.id)){
          if(this.pietype == '季度'){
            date = this.yearVal2 + '-' + this.several
          }
          this.seledType.push(item.id)
          this.seledTypeName.push(item.sname)
          this.seledTypeName.map(itm=>{
            let name2 = itm
            if(name2 == '强震动'){
              name2 = '强震'
            }
            name += name2 + ';'
          })
          document.getElementById(item.id).style = 'background-color: rgb(200,200,200)'
          par = 'date='+date+'&disciplineKey='+name+'&type='+this.pietype
          getCountByQuarter(par).then(res=>{
            let data = []
            res.map(itm=>{
              if(itm.length != 0){
                let data2 = []
                itm.map(ite=>{
                  data2.push({
                    name: ite.distributeUnit,
                    value: ite.count
                  })
                })
                data.push(data2)
              }
            })
            this.pieListAll = data
            this.showPie = true
          })
        }else{
          document.getElementById(item.id).style = ''
          this.seledType.splice(this.seledType.indexOf(item.id),1)
          this.seledTypeName.splice(this.seledTypeName.indexOf(item.sname),1)
          name = ''
          this.seledTypeName.map(itm=>{
            name += itm + ';'
          })
          par = 'date='+date+'&disciplineKey='+name+'&type='+this.pietype
          getCountByQuarter(par).then(res=>{
            let data = []
            res.map(itm=>{
              if(itm.length != 0){
                let data2 = []
                itm.map(ite=>{
                  data2.push({
                    name: ite.distributeUnit,
                    value: ite.count
                  })
                })
                data.push(data2)
              }
            })
            this.pieListAll = data
            this.showPie = true
          })
        }
      },
      //地磁地电定点形变统计
      getCatalogCount() {
        this.barxList = []
        this.baryList = []
        let par = {year: this.yearVal,month: this.selMon}
        if(this.selMon == ''){
          delete(par.month)
        }
        catalogProdCount(encode(par)).then(res=>{
          res.map((item)=>{
            this.barxList.push(item.distribution_unit)
            this.baryList.push(item.count)
          })
        })
      },
      getSel(){
        //获取前五年列表
        let now = new Date().getFullYear()
        this.monthList = []
        this.yearList = []
        this.yearList2 = []
        this.dayList = []
        for(let i = parseInt(now) - 20; i<= parseInt(now); i++){
          this.yearList.push({
            label: i+'年',
            value: i
          })
        }
        for(let i = 2008; i<= parseInt(now); i++){
          this.yearList2.push({
            label: i+'年',
            value: i
          })
        }
        //获取月列表
        for(let i = 1;i<=12;i++){
          let month = i
          if(i<10){
            month  = '0' + i
          }
          if(now == this.yearVal){
            if(i<= new Date().getMonth()+1){
              this.monthList.push({
                label: month+'月',
                value: month
              })
            }
          }else {
            this.monthList.push({
              label: month+'月',
              value: month
            })
          }
        }
        this.monList = this.monthList.map(item=>{
          return item.value
        })
        this.monthList2 = this.monthList
        this.monthList3 = this.monthList
        //获取日列表
        let day = this.getDays(this.yearVal,this.monthVal)
        for(let i = 1;i<=day;i++){
          let d = i
          if(d<10){
            d='0'+i
          }
          if(this.yearVal == new Date().getFullYear() && this.monthVal == new Date().getMonth()+1){
            if(i <= new Date().getDate()){
              this.xList.push(d.toString())
              this.dayList.push({
                label: d.toString(),
                value: d.toString()
              })
            }
          }else{
            this.xList.push(d.toString())
            this.dayList.push({
              label: d.toString(),
              value: d.toString()
            })
          }
        }
      },
      // 选择图标
      selected(name) {
        this.form.icon = name;
      },
      handleItemChange(val) {
      },
      getClassificationName(data) {
        getClassification().then(res => {
         return res.filter((item)=>{
            if(item.id == data){
              return item.bClass + '/' + item.sClass
            }
          })
        })
      },
      //获取一个月内天数
      getDays(year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
      },
      //gnss产品统计
      gnssCount() {
        this.barxList = []
        this.baryList = []
        let par = {year: this.yearVal,month: this.selMon}
        if(this.selMon == ''){
          delete(par.month)
        }
        gnssProdCount(encode(par)).then(res=>{
          res.map((item)=>{
            this.barxList.push(item.send_unit)
            this.baryList.push(item.count)
          })
        })
      },
      changeVal3(e) {
        let allMon = []
        if(this.yearVal2 != new Date().getFullYear()){
          for(let i=1;i<=12;i++){
            let month = ''
            if(i<10){
              month = '0' + i
            }else{
              month = i.toString()
            }
            allMon.push({
              label: month,
              value: month
            })
          }
          this.monthList2 = allMon
        }else{
          this.monthList2 = this.monthList3
        }
        this.clearSel()
      },
      changeYear(year) {
        if(this.subType == 1 && this.subType2 == '地下流体'){
          this.changeSub(1)
          return
        }
        //GNSS、区划图、活断层等
        if(this.subType == 1 && (this.subType2 == this.prodOption[1].value || this.subType2 == this.prodOption[2].value ||
        this.subType2 == this.prodOption[3].value || this.subType2 == this.prodOption[4].value || 
        this.subType2 == this.prodOption[5].value)) {
          this.gnssCount()
          return
        }
        //地磁地电定点形变等
        if(this.subType == 1 && (this.subType2 == this.prodOption[6].value || this.subType2 == this.prodOption[7].value)) {
          this.getCatalogCount()
          return
        }
        if(this.subType == 2){
          this.changeSub(2)
          return
        }
        if(this.subType == 4){
          this.changeSub(4)
          return
        }
        this.yearVal = year
        this.getbarData()
      },
      changeVal(e) {
        let par = 'year='+this.yearVal
        let data = []
        let monList = [] //有数据的月份
        let monList2 = []
        this.xList = []
        this.lineChartData.expectedData = []
        this.lineChartData.userNumData = []
        this.getSel()
        //仅选年
        if(this.yearVal && !this.monthVal){
          getPVStat(par).then(res=>{
            data = res
            data.forEach(item=>{monList.push(item.month)})
            this.xList = ['01','02','03','04','05','06','07','08','09','10','11','12']
            this.xList.forEach(item=>{
              if(monList.includes(item)){
                let viewNum = 0
                data.forEach(itm=>{
                  if(itm.month == item){
                    viewNum = itm.sumViewNum
                    this.lineChartData.expectedData.push(viewNum)
                  }
                })
              }else {
                this.lineChartData.expectedData.push(0)
              }
            })
            getUVStat(par).then(resp=>{
              data = resp
              data.forEach(item=>{monList2.push(item.month)})
              this.xList.forEach(item=>{
                if(monList2.includes(item)){
                  let viewNum = 0
                  data.forEach(itm=>{
                    if(itm.month == item){
                      viewNum = itm.sumViewNum
                      this.lineChartData.userNumData.push(viewNum)
                    }
                  })
                }else {
                  this.lineChartData.userNumData.push(0)
                }
              })
            })
          })
        }
          //年月都选
          if(this.yearVal && this.monthVal && !this.dayVal){
            par = 'year='+this.yearVal+'&month='+this.monthVal
            getPVStat(par).then(res=>{
              data = res
              data.forEach(item=>{monList.push(item.day)})
              this.xList.forEach(item=>{
                if(monList.includes(item)){
                  let viewNum = 0
                  data.forEach(itm=>{
                    if(itm.day == item){
                      viewNum = itm.sumViewNum
                      this.lineChartData.expectedData.push(viewNum)
                    }
                  })
                }else {
                  this.lineChartData.expectedData.push(0)
                }
              })
              getUVStat(par).then(resp=>{
                data = resp
                data.forEach(item=>{monList2.push(item.day)})
                this.xList.forEach(item=>{
                  if(monList2.includes(item)){
                    let viewNum = 0
                    data.forEach(itm=>{
                      if(itm.day == item){
                        viewNum = itm.sumViewNum
                        this.lineChartData.userNumData.push(viewNum)
                      }
                    })
                  }else {
                    this.lineChartData.userNumData.push(0)
                  }
                })
              })
            })
          }
          //年月日都选
          if(this.yearVal && this.monthVal && this.dayVal){
            par = 'year='+this.yearVal+'&month='+this.monthVal+'&day='+this.dayVal
            this.xList = []
            monList = []
            this.lineChartData.expectedData = []
            getPVStat(par).then(res=>{
              data = res
              data.forEach(item=>{monList.push(item.hour)})
              let hours = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13',
              '14','15','16','17','18','19','20','21','22','23']
              this.xList = hours
              hours.forEach(item=>{
                if(monList.includes(item)){
                  let viewNum = 0
                  data.forEach(itm=>{
                    if(itm.hour == item){
                      viewNum = itm.sumViewNum
                      this.lineChartData.expectedData.push(viewNum)
                    }
                  })
                }else {
                  this.lineChartData.expectedData.push(0)
                }
              })
              getUVStat(par).then(resp=>{
                data = resp
                data.forEach(item=>{monList2.push(item.hour)})
                this.xList.forEach(item=>{
                  if(monList2.includes(item)){
                    let viewNum = 0
                    data.forEach(itm=>{
                      if(itm.hour == item){
                        viewNum = itm.sumViewNum
                        this.lineChartData.userNumData.push(viewNum)
                      }
                    })
                  }else {
                    this.lineChartData.userNumData.push(0)
                  }
                })
              })
            })
          }
      },

      //用户同时在线数
      changeVal2(e) {
        let par = 'year='+this.yearVal
        let data = []
        let monList = [] //有数据的月份
        let monList2 = []
        this.xList = []
        this.lineChartData.expectedData = []
        this.lineChartData.userNumData = []
        this.getSel()
        //仅选年
        if(this.yearVal && !this.monthVal){
          getOnlineNum(par).then(res=>{
            data = res
            data.forEach(item=>{monList.push(item.date.split('-')[1])})
            this.xList = ['01','02','03','04','05','06','07','08','09','10','11','12']
            this.xList.forEach(item=>{
              if(monList.includes(item)){
                let viewNum = 0
                data.forEach(itm=>{
                  if(itm.date.split('-')[1] == item){
                    viewNum = itm.userOnlineNum
                    this.lineChartData.expectedData.push(viewNum)
                  }
                })
              }else {
                this.lineChartData.expectedData.push(0)
              }
            })
          })
        }
          //年月都选
          if(this.yearVal && this.monthVal && !this.dayVal){
            par = 'year='+this.yearVal+'&month='+this.monthVal
            getOnlineNum(par).then(res=>{
              data = res
              data.forEach(item=>{monList.push(item.date.split('-')[2])})
              this.xList.forEach(item=>{
                if(monList.includes(item)){
                  let viewNum = 0
                  data.forEach(itm=>{
                    if(itm.date.split('-')[2] == item){
                      viewNum = itm.userOnlineNum
                      this.lineChartData.expectedData.push(viewNum)
                    }
                  })
                }else {
                  this.lineChartData.expectedData.push(0)
                }
              })
            })
          }
          //年月日都选
          if(this.yearVal && this.monthVal && this.dayVal){
            par = 'year='+this.yearVal+'&month='+this.monthVal+'&day='+this.dayVal
            this.xList = []
            monList = []
            this.lineChartData.expectedData = []
            getOnlineNum(par).then(res=>{
              data = res
              data.forEach(item=>{monList.push(item.date.split(' ')[1])})
              let hours = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13',
              '14','15','16','17','18','19','20','21','22','23']
              this.xList = hours
              hours.forEach(item=>{
                if(monList.includes(item)){
                  let viewNum = 0
                  data.forEach(itm=>{
                    if(itm.date.split(' ')[1] == item){
                      viewNum = itm.userOnlineNum
                      this.lineChartData.expectedData.push(viewNum)
                    }
                  })
                }else {
                  this.lineChartData.expectedData.push(0)
                }
              })
            })
          }
      },
      changeSub(e) {
        if(e == 1){
          this.barxList = []
          this.baryList = []
          let par = {year: this.yearVal,month: this.selMon}
          if(this.selMon == ''){
            delete(par.month)
          }
          ufProdCount(encode(par)).then(res=>{
            res.map((item)=>{
              this.barxList.push(item.send_unit)
              this.baryList.push(item.count)
            })
          })
        }
        if(e == 2){
          this.barxList = []
          this.baryList = []
          let par = {year: this.yearVal,month: this.selMon}
          if(this.selMon == ''){
            delete(par.month)
          }
          prodServeCount(encode(par)).then(res=>{
            res.map((item)=>{
              this.barxList.push(item.c_unit)
              this.baryList.push(item.count)
            })
          })
        }
        if(e == 3){
          this.pieData = []
          lawCount().then(res=>{
            console.log(res)
            this.pieData.push({ value: res, name: '法规数据总数' })
          })
          standardCount().then(res=>{
            console.log(res)
            this.pieData.push({ value: res, name: '标准数据总数' })
          })
        }
        if(e == 4){
          this.barxList = []
          this.baryList = []
          let par = {year: this.yearVal,month: this.selMon}
          if(this.selMon == ''){
            delete(par.month)
          }
          knowledgeCount(encode(par)).then(res=>{
            let deptName = ''
            console.log(this.userlist)
            res.map((item)=>{
              this.userlist.map(itm=>{
                if(item.uploader == itm.userName && itm.dept.deptName){
                  deptName = itm.dept.deptName
                }
              })
              this.barxList.push(deptName)
              this.baryList.push(item.count)
            })
          })
        }
      },

      tabChange(e) {
        if(e.index == 0){
          this.getPageList({
            page: 1,
            limit: 10
          });
        }
        if(e.index == 1){
          this.yearVal = new Date().getFullYear()
          this.monthVal = (new Date().getMonth() + 1)>=10?(new Date().getMonth() + 1):'0'+(new Date().getMonth() + 1)
          this.dayVal = new Date().getDate()>=10?new Date().getDate():'0'+new Date().getDate()
          this.changeVal()
          this.showLine = true
        }
        if(e.index == 2){
          this.yearVal = new Date().getFullYear()
          this.monthVal = (new Date().getMonth() + 1)>=10?new Date().getMonth() + 1:'0'+(new Date().getMonth() + 1)
          this.dayVal = new Date().getDate()>=10?new Date().getDate():'0'+new Date().getDate()
          this.changeVal()
          this.showLine2 = true
        }
        if(e.index == 3){
          this.yearVal = new Date().getFullYear()
          this.getbarData()
        }
        if(e.index == 4){
          this.selMon = ''
          this.changeSub(1)
          this.getUserList()
        }
      },
      uploadImg() {
        // 修改 uploadImage 菜单配置

      },
      changeMonth(mon) {
        if(this.subType == 1 && this.subType2 == '地下流体'){
          this.changeSub(1)
          return
        }
        //GNSS、区划图、活断层等
        if(this.subType == 1 && (this.subType2 == this.prodOption[1].value || this.subType2 == this.prodOption[2].value ||
        this.subType2 == this.prodOption[3].value || this.subType2 == this.prodOption[4].value || 
        this.subType2 == this.prodOption[5].value)) {
          this.gnssCount()
          return
        }
        //地磁地电定点形变等
        if(this.subType == 1 && (this.subType2 == this.prodOption[6].value || this.subType2 == this.prodOption[7].value)) {
          this.getCatalogCount()
          return
        }
        if(this.subType == 2){
          this.changeSub(2)
          return
        }
        if(this.subType == 4){
          this.changeSub(4)
          return
        }
        this.selMon = mon
        this.getbarData()
      },
      /** 查询菜单列表 */
     getPageList(page) {
      this.loading = false;
      let par = 'pageNum='+page.page+'&pageSize='+page.limit
      if(this.queryParams.userName){
        par += '&userName='+this.queryParams.userName
      }
      getList(par).then(res=>{
        this.menuList = res.records
        this.menuList.forEach(item=>{
          if(new Date().getTime() > new Date(item.outTime).getTime()){
            item.userState = '离线'
          }else{
            item.userState = '在线'
          }
          // if(item.userName != '访客'){
          //   item.userName = decode(item.userName)
          // }
        })
        this.total = res.total
      })
    },
    getbarData() {
      let par = this.yearVal
      this.barxList = []
      this.baryList = []
      if(this.selMon != ''){
        par += '-'+this.selMon
      }
      getCount('year='+par).then(res=>{
        res.map((ite,index)=>{
          res[index].forEach(item=>{
            this.barxList.push(item.distributeUnit)
            this.baryList.push(item.count)
          })
        })
      })
    },
      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.menuId,
          label: node.menuName,
          children: node.children
        };
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      handleInfo(row) {
        this.title = "详情";
        this.open = true;
        this.form = row
        this.form.loginTime = new Date(this.form.loginTime).toLocaleString()
        this.form.outTime = new Date(this.form.outTime).toLocaleString()
      },
      // 表单重置
      reset() {
        this.form = {
          id: '',
          aType: '',
          aName: '',
          userName: '',
          classification: '',
          stime: '',
          status: '',
          status2: ''
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getPageList({
          page: 1,
          limit: 10
        });
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      getSelData() {
        let bClass = []
        let sClass = []
        let bClass2 = []
        this.menuOptions2 = []
        this.menuOptions = []
        getClassification().then(res => {
          res.map(item => {
            bClass2.push(item.bClass)
          })
          bClass2 = Array.from(new Set(bClass2))
          bClass2.forEach((itm,index) => {
            this.menuOptions2.push({
              bClass: itm
            })
          })
        })

        getField().then(res => {
          res.map(item => {
            bClass.push(item.bClass)
            sClass.push({bClass: item.sClass})
          })
          bClass = Array.from(new Set(bClass))
          bClass.forEach((itm,index) => {
            if(index == 0){
              this.menuOptions.push({
                bClass: itm,
                sClass: sClass.slice(0,7)
              })
            }
            if(index == 1){
              this.menuOptions.push({
                bClass: itm,
                sClass: sClass.slice(7,13)
              })
            }
            if(index == 2){
              this.menuOptions.push({
                bClass: itm,
                sClass: sClass.slice(13,17)
              })
            }
            if(index == 3){
              this.menuOptions.push({
                bClass: itm,
                sClass: sClass.slice(17,21)
              })
            }
            if(index == 4){
              this.menuOptions.push({
                bClass: itm,
                sClass: sClass.slice(21,27)
              })
            }
          })
        })
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.getSelData()
          this.open = true;
          this.title = "新增";
          this.isEdit = true
      },
      handle(item) {
        if(item.status != '待处理'){
          this.$message({
          message: '订单已处理',
          type: 'warning'
        });
          return
        }
        this.form = item
        this.isEdit = true
        this.open = true;
        this.title = "订单处理";
      },
      /** 展开/折叠操作 */
      toggleExpandAll() {
        this.refreshTable = false;
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },
      /** 提交按钮 */
      submitForm: function(type) {
        if (this.title == "订单处理") {
          if(type == 1){
            this.menuList.forEach(item=>{
              if(this.form.id == item.id){
                item.status = '完成'
              }
            }) 
          }else if(type == 3){
            this.menuList.forEach(item=>{
              if(this.form.id == item.id){
                item.status = this.form.status != '其他'?this.form.status:this.form.status2
              }
            }) 
          }else {
            this.menuList.forEach(item=>{
              if(this.form.id == item.id){
                item.status = '已关闭'
              }
            })
          }
            this.$modal.msgSuccess("订单处理成功");
            this.open = false;
          }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const self = this
        this.$modal.confirm('是否确认删除"' + row.aName+'"').then(function() {
          self.menuList.forEach((item,index)=>{
            if(row.id == item.id){
              self.menuList.splice(index,1)
            }
          })
          self.$modal.msgSuccess("删除成功");
        })
      }
    }
  };
  </script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="css">
.selCata {
  width: 100%;
  margin: 20px 0px;
  padding: 0px 60px;
  display: flex;
  flex-wrap: wrap;
}
.selCata div{
    margin: 5px 8px;
    cursor: pointer;
  }
.selCata div:hover{
  font-weight: bold;
}
.selType {
  font-size: 18px;
  padding: 15px 10px;
}
.tab {
  width: 500px;
  display: flex;
  justify-content: flex-start;
}
</style>
