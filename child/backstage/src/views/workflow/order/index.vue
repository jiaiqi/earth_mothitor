<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="用户名" prop="aName" v-if="isAdmin">
        <el-input
          v-model="queryParams.aName"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" placeholder="请选择订单状态" @change="changeStat" clearable>
            <el-option
              v-for="dict in statusList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
      </el-form-item> -->
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

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
    >
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="aType" label="目录类别" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ typeList.filter(item=>{ return item.value == scope.row.aType })[0].label  }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="aName" label="目录名" :show-overflow-tooltip="true"></el-table-column> -->
      <!-- <el-table-column prop="situation" label="需求概况" :show-overflow-tooltip="true"></el-table-column> -->
      <el-table-column prop="orderId" label="订单编号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="userName" width="120" label="用户名" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="subject" width="160" label="订单分类" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sentDept" width="160" label="分发单位" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="purpose" width="160" label="申请事由分类" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="下单时间" width="200" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{new Date(scope.row.ctime).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="120" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div :style="{'color': scope.row.orderStatus == 30 ? '#67C23A' : scope.row.orderStatus == 40? '#909399' : scope.row.orderStatus == -10 ? '#F56C6C' : 'rgb(255,157,0)'}">
            {{ scope.row.orderStatus | orderStates }}
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
            v-hasPermi="['workflow:order:index']"
          >详情</el-button>
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-s-claim"
            v-if="scope.row.orderStatus != -10 && scope.row.isSelfDept ? (scope.row.orderStatus >= 10 && scope.row.orderStatus < 30) : (scope.row.orderStatus == 0 || scope.row.orderStatus == 30)"
            @click="handle(scope.row)"
            v-hasPermi="['workflow:order:handle']"
          >{{scope.row.orderStatus == 30 ? '关闭订单' : '处理'}}</el-button>
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-s-order"
            @click="handleRecord(scope.row)"
            v-hasPermi="['workflow:order:handle']"
          >处理记录</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['workflow:order:del']"
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getList" />
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :rule="rules" :visible.sync="open" width="1280px" @close="handleClose"  :close-on-press-escape="false" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="120px">
        <p style="width: 100%;border-bottom:1px solid rgb(234, 234, 234);font-size: 17px;line-height: 35px;">基础信息<i style="margin-left: 5px" class="el-icon-user-solid"></i></p>
        <el-form-item label="姓名" prop="userName">
            <el-input size="small" :disabled="true" v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unitName">
            <el-input size="small" :disabled="true" v-model="form.unitName"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
            <el-input size="small" v-model="form.department" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账户名称" prop="accountName">
            <el-input size="small" :disabled="true" v-model="form.accountName"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idNumber">
            <el-input size="small" v-model="form.idNumber" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="历史订单次数" prop="orderNum">
            <el-input size="small" :disabled="true" v-model="form.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
            <el-input type="number" size="small" v-model="form.phoneNumber" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input size="small" v-model="form.email" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="site">
            <el-input size="small" v-model="form.site" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="postcode">
            <el-input size="small" v-model="form.postcode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="传真" prop="fax">
            <el-input size="small" v-model="form.fax" :disabled="true"></el-input>
        </el-form-item>
        <p style="width: 100%;border-bottom:1px solid rgb(234, 234, 234);font-size: 17px;line-height: 35px;">其他信息<i style="margin-left: 5px" class="el-icon-user-solid"></i></p>
          <el-form-item label="单位性质" prop="unitNature">
            <el-select v-model="form.unitNature" size="small" :disabled="true" placeholder="请选择">
                <el-option
                    v-for="item in unitTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="单位地址" prop="unitSite">
            <el-input type="textarea"
                    :disabled="true"
                    style="width:270px"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="form.unitSite"></el-input>
        </el-form-item>
        <el-form-item label="所属行业" prop="unitBusiness">
            <el-select v-model="form.unitBusiness" size="small" placeholder="请选择" :disabled="true">
                <el-option
                    v-for="item in industryList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="依托项目/课题" prop="research">
            <el-input style="width:270px" size="small" v-model="form.research" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="经费来源" prop="expenditure">
            <el-select v-model="form.expenditure" size="small" placeholder="请选择" :disabled="true">
                <el-option
                    v-for="item in moneySourceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="使用目的" prop="purpose">
            <el-select v-model="form.purpose" size="small" placeholder="请选择" :disabled="true">
                <el-option
                    v-for="item in targetList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input type="textarea"
                    v-if="form.purpose == '其他'"
                    :disabled="true"
                    style="width: 370px;margin-left: 30px;"
                    :rows="2"
                    placeholder="请输入其他内容"
                    v-model="form.targetOther"></el-input>
        </el-form-item>
        <el-form-item label="工作内容" prop="jobContent">
            <el-input type="textarea"
                    style="width:600px"
                    :rows="3"
                    :disabled="true"
                    placeholder="请输入工作内容"
                    v-model="form.jobContent"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <!-- <el-input style="margin: 10px 0px;width: 600px;" :disabled="true" v-model="form.orderStatus" /> -->
          <div :style="{'color': form.orderStatus == 30 ? '#67C23A' : form.orderStatus == 40? '#909399' : form.orderStatus == -10 ? '#F56C6C' : 'rgb(255,157,0)','font-weight':'bold'}">
            {{ form.orderStatus | orderStates }}
          </div>
        </el-form-item>
        <p style="width: 100%;border-bottom:1px solid rgb(234, 234, 234);font-size: 17px;line-height: 35px;">订单详情<i style="margin-left: 5px" class="el-icon-user-solid"></i></p>
            <div class="list">
          <ul style="overflow-y: auto;max-height: 400px;">
              <li v-for="item in form.orderDisplayList" :key="item.id">
                  <div class="cartItem">
                  <i class="el-icon-s-data" style="font-size: 36px;line-height:35px;vertical-align:middle;margin:0px 5px"></i>
                  <el-tag><span style="font-size: 17px;">{{ item.orderClasses }}</span></el-tag>
                    <div v-if="item.dataStat">
                      <p style="color: #888888;font-size: 14px;padding-left: 14px;">{{ item.dataDate }}</p>
                      <p style="color: green;padding-left: 14px;">{{ item.dataStat == 100 ? '数据完整' : '数据完整率：'+item.dataStat}}</p>
                    </div>
                      <div v-else style="font-size: 17px;padding-left: 20px;line-height: 30px;vertical-align: middle;">{{ item.classesStandby }}</div>
                  </div>
              </li>
          </ul>
      </div>
      </el-form>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="open3" width="700px" :close-on-press-escape="false" :close-on-click-modal="false" append-to-body>
      <div style="margin-bottom:15px">
        <el-table
          v-loading="loading2"
          :data="recordList"
          height="250"
        >
        <el-table-column prop="user" label="处理人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="recordTime" label="处理时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ new Date(scope.row.recordTime).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="record" label="说明" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="订单状态" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div :style="{'color': scope.row.orderStatus == 30 ? '#67C23A' : scope.row.orderStatus == 40? '#909399' :scope.row.orderStatus == -10 ? '#F56C6C' :'rgb(255,157,0)'}">
                {{ scope.row.orderStatus | orderStates }}
              </div>
            </template>
          </el-table-column>
      </el-table>
      </div>
      <el-form ref="form" :model="form" :inline="true" label-width="100px">
        <el-form-item label="处理说明" prop="record">
          <el-input type="textarea"
            style="width:400px"
            :rows="3"
            placeholder="请输入处理说明"
            v-model="record"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="isEdit" @click="submitForm(1)">{{ handleText }}</el-button>
        <el-button type="warning" v-if="nowStatus == 0" @click="submitForm(-1)">驳回</el-button>
        <!-- <el-button type="info" v-if="isEdit" @click="submitForm(2)">关闭订单</el-button> -->
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="处理记录" :visible.sync="open2" width="1000px"  :close-on-press-escape="false" :close-on-click-modal="false" append-to-body>
      <div>
        <el-table
          v-loading="loading2"
          :data="recordList"
          height="500"
        >
        <el-table-column prop="user" label="处理人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="recordTime" label="处理时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ new Date(scope.row.recordTime).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="record" label="说明" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="订单状态" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div :style="{'color': scope.row.orderStatus == 30 ? '#67C23A' : scope.row.orderStatus == 40? '#909399' :scope.row.orderStatus == -10 ? '#F56C6C' :'rgb(255,157,0)'}">
                {{ scope.row.orderStatus | orderStates }}
              </div>
            </template>
          </el-table-column>
      </el-table>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
  import { delMenu, addMenu, updateMenu } from "@/api/system/menu";
  import { getUserProfile } from "@/api/system/user"
  import { Loading } from 'element-ui';
  import { listUser, getAuthRole } from '@/api/system/user'
  import { socialList, getField, getClassification, socialAdd, socialEdit, socialDel } from "@/api/workflow/directory";
  import { getList, delList, updateList, getRecList, addRecList } from "@/api/workflow/order";
  // import { getField } from "@/api/workflow/directory";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { IEditorConfig } from '@wangeditor/editor'
  import { encode, decode } from '@/utils/base/dataEncry.js';
  import { value } from "dom7";
  import { getIdList } from '@/api/workflow/audit'
  export default {
    name: "Menu",
    dicts: ['sys_show_hide', 'sys_normal_disable'],
    components: { Treeselect, IconSelect, Editor, Toolbar },
    data() {
      return {
        editor: null,
        toolbarConfig: { },
        mode: 'default', // or 'simple'
        // 遮罩层
        loading: true,
        loading2: true,
        open2: false,
        open3: false,
        handleText: '',
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        menuList: [],
        recordList: [],
        record: '',
        //是否可编辑
        isEdit: false,
        //列表数
        total: null,
        statusList: [  // 订单状态
          {
            value: -10,
            label: '已驳回'
          },
          {
            value: 0,
            label: '待审核'
          },
          {
            value: 10,
            label: '待处理'
          },
          {
            value: 20,
            label: '处理中'
          },
          {
            value: 30,
            label: '已办结'
          },
          {
            value: 40,
            label: '已关闭'
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
        // 弹出层标题
        title: "新增",
        // 是否显示弹出层
        open: false,
        // 是否展开，默认全部折叠
        isExpandAll: false,
        // 重新渲染表格状态
        refreshTable: true,
        isAdmin: false,
        userid: null,
        nickName: '',
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
          aName: undefined,
          orderStatus: null,
        },
        user: {},
        postGroup: {},
        fieldId: '',
        classificationId: '',
        userName: '',
        // 表单参数
        form: {
          userName: '',
          unitName: '',
          department: '',
          accountName: '',
          idNumber: '',
          orderNum: '',
          phoneNumber: '',
          email: '',
          site: '',
          postcode: '',
          fax: '',
          unitNature: '',
          research: '',
          unitBusiness: '',
          unitSite: '',
          expenditure: '',
          purpose: '',
          targetOther: '',
          jobContent: '',
          record: ''
        },
        props: {
          value: 'bClass',
          label: 'bClass',
          children: 'sClass'
        },
        nowStatus: null,
        sClassification: [],
        menuOptions: [],
        menuOptions2: [],
        unitTypeList: [{
          value: '政府机关',
          label: '政府机关'
        }, {
          value: '事业单位',
          label: '事业单位'
        }, {
          value: '国有企业',
          label: '国有企业'
        }, {
          value: '社会组织、团体与组织',
          label: '社会组织、团体与组织'
        }, {
          value: '个人',
          label: '个人'
        }, {
          value: '其他',
          label: '其他'
        }],
        industryList: [{
          value: '地质与矿产(地调局系统)',
          label: '地质与矿产(地调局系统)'
        }, {
          value: '地质与矿产(非地调局系统)',
          label: '地质与矿产(非地调局系统)'
        }, {
          value: '自然资源',
          label: '自然资源'
        }, {
          value: '高校',
          label: '高校'
        }, {
          value: '科研院所',
          label: '科研院所'
        }, {
          value: '煤炭',
          label: '煤炭'
        }, {
          value: '有色',
          label: '有色'
        }, {
          value: '冶金',
          label: '冶金'
        }, {
          value: '核工业',
          label: '核工业'
        }, {
          value: '建材(非金属)',
          label: '建材(非金属)'
        }, {
          value: '城市建设',
          label: '城市建设'
        }, {
          value: '测绘',
          label: '测绘'
        }, {
          value: '海洋',
          label: '海洋'
        }, {
          value: '农业',
          label: '农业'
        }, {
          value: '科技',
          label: '科技'
        }, {
          value: '生态环境',
          label: '生态环境'
        }, {
          value: '规划设计',
          label: '规划设计'
        }, {
          value: '交通',
          label: '交通'
        }, {
          value: '铁路',
          label: '铁路'
        }, {
          value: '能源',
          label: '能源'
        }, {
          value: '水利',
          label: '水利'
        }, {
          value: '电力',
          label: '电力'
        }, {
          value: '灾害应急',
          label: '灾害应急'
        }, {
          value: '地震',
          label: '地震'
        }, {
          value: '其他',
          label: '其他'
        }],
        moneySourceList: [{
          value: '中央财政',
          label: '中央财政'
        }, {
          value: '地方财政',
          label: '地方财政'
        }, {
          value: '企业委托',
          label: '企业委托'
        }, {
          value: '企业自筹',
          label: '企业自筹'
        }, {
          value: '中央地方混合',
          label: '中央地方混合'
        }, {
          value: '其他',
          label: '其他'
        }],
        targetList: [{
          value: '科研项目',
          label: '科研项目'
        }, {
          value: '商业使用',
          label: '商业使用'
        }, {
          value: '个人研究',
          label: '个人研究'
        }, {
          value: '其它',
          label: '其它'
        }],
        subjectList: [],
        roleList: [],
        //拥有的学科权限
        hasSubList: [],
        deptName: '',
        //状态过滤
        orderStatus: null,
        // 表单校验
        rules: {
          // orderStatus: [
          //   { required: true, trigger: "blur" }
          // ]
        }
      };
    },
    created() {
      this.getList({page:1,limit:10});

      // this.getPageList({
      //   page: 1,
      //   limit: 10
      // });
    },
    filters: {
      orderStates(val) {
        if(val == -10) return '已驳回'
        if(val == 0) return '待审核'
        if(val == 10) return '待处理'
        if(val == 20) return '处理中'
        if(val == 30) return '已办结'
        if(val == 40) return '已关闭'
      }
    },
    mounted() {
      this.subjectList = JSON.parse(sessionStorage.getItem('subjectArr'))
      this.orderStatus = this.$route.query.status
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
      // 选择图标
      selected(name) {
        this.form.icon = name;
      },
      handleItemChange(val) {
        // console.log('active item:', val);
      },
      //获取当前登录用户的id
      getUserId(){
        const self = this
        return new Promise((resolve,reject)=>{
          listUser({pageNum:1,pageSize:9999}).then(resp=>{
            resp.rows.forEach(itm=>{
              if(itm.userName == self.$store.state.user.name){
                self.userid = itm.userId
                self.nickName = itm.nickName
                self.userName = itm.userName
                self.deptName = itm.dept.deptName
              }
            })
            getAuthRole(self.userid).then(res=>{
              res.user.roles.map(item=>{
                self.roleList.push(item.roleId)
              })
              resolve()
            })
          }).catch((error) => {
            reject(error)
          })
        })
      },
      getPageList(data) {
        const self = this
        this.menuList = []
        getUserProfile().then(response => {
        this.user = response.data
        // this.postGroup = response.postGroup
        let info = {
          pageNum: data.page,
          pageSize: data.limit,
          pUnit: this.user.dept.deptName,
          like: ''
        }
        socialList(encode(info)).then(resp => {
          this.loading = false;
          this.queryParams2.pageSize = resp.size;
          this.queryParams2.pageNum = resp.current;
          this.total = resp.total;
          this.menuList = resp.records;

          getField().then(res => {
            this.menuList.forEach(item => {
              res.forEach(itm => {
                if(itm.id == item.fieldId){
                  item.fieldId = itm.bClass + '/' + itm.sClass
                }
              })
            })
          })
          getClassification().then(res => {
            this.menuList.forEach(item => {
              res.forEach(itm => {
                if(itm.id == item.classificationId){
                  item.classificationId = itm.bClass + '/' + itm.sClass
                }
              })
            })
          })
        });
      })
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
      uploadImg() {
        // 修改 uploadImage 菜单配置

      },
      /** 查询菜单列表 */
     getList(data) {
      const self = this
      this.loading = true;
      this.getUserId().then((res)=>{
        self.getSubAuth().then(resp=>{
          let pages = {
              pageNum: data.page,
              pageSize: data.limit
            }
            if(!self.$store.state.user.permissions.includes('workflow:order:all') && self.$store.state.user.permissions[0] != '*:*:*'){
              pages = {
                pageNum: data.page,
                pageSize: data.limit,
                userName: self.userName,
                // subjectId: {
                //   list: self.hasSubList
                // },
                sentDept: self.deptName,
                orderStatus: self.orderStatus
              }
              if(self.$store.state.user.permissions.includes('workflow:order:handle')){
                delete(pages.userName)
              }
              // if(self.hasSubList.length == 0){
              //   delete(pages.subjectId)
              // }
              //个人用户查看自己下过的订单
              if(self.deptName == '个人'){
                delete(pages.sentDept)
                delete(pages.subjectId)
              }
              self.isAdmin = false
            }else {
              pages = {
                pageNum: data.page,
                pageSize: data.limit,
                orderStatus: self.orderStatus
              }
              if(this.queryParams.aName != ''){
                pages.userName = this.queryParams.aName
              }
              self.isAdmin = true
            }
          getList(encode(pages)).then(res=>{
            let list = res.records
            let filterList = []
            list.forEach(item=>{
              console.log(item.orderDisplayList[0])
              //产品订单
              if(item.subjectId == 99){
                item.subject = item.orderDisplayList[0].orderClasses.split('_')[0]
              }else{
                self.subjectList.forEach(itm=>{
                  if(item.subjectId == itm.id){
                    item.subject = itm.sname
                  }
                })
              }
              
              //判断每个订单是否属于自己的单位
              item.isSelfDept = item.sentDept == self.deptName
              // console.log(item.sentDept,this.deptName)
              //只有分派的省局单位且状态已分发完才能看到
              // if(item.sentDept == this.deptName){
              //   if(item.orderStatus >= 10){
                  filterList.push(item)
                // }
              // }
            })
            // console.log(list)
            if(self.isAdmin){
              self.menuList = list
            }else{
              self.menuList = filterList
            }
            self.total = res.total
            self.loading = false;
          })
        })
      })
    },
    getSubAuth() {
      const self = this
      return new Promise((resolve,reject)=>{
        self.roleList.forEach(item=>{
        getIdList(item).then((resp) => {
          resp.map(itm=>{
            if(itm.roleFlag == 1){
              self.hasSubList.push(itm.disciplineId)
            }
          })
          resolve()
        //   self.roleList.forEach(item=>{
        //     self.hasSubList.forEach(itm=>{
        //       let par = {
        //         roleId: item,
        //         disciplineId: itm.id
        //       }
        //       getRoleAndDepPower(encode(par)).then(res=>{
        //         let arr = decode(res)
        //         arr.map(item=>{
        //           item.depList.map(itm=>{
        //             self.deptAuthList.push(itm.departmentName)
        //           })
        //         })
        //         console.log(self.deptAuthList)
        //         resolve(true)
        //       })
        //   })
        // })
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
        this.open3 = false;
        this.reset();
      },
      handleClose() {
        if(this.title != '详情'){
          this.getList({page:1,limit:10});
        }
      },
      handleRecord(row) {
        if(!this.open3){
          this.open2 = true
        }
        this.loading2 = true
        let par = 'pageNum=1&pageSize=999&returnNum='+row.orderId
        getRecList(par).then(res=>{
          this.recordList = res.records
          this.loading2 = false
        })
      },
      handleInfo(row) {
        this.title = "详情";
        this.isEdit = false
        let par = {
          id: row.id
        }
        this.open = true;
        this.form = {
          ...row,
          record: ''
        }
      },
      changeStat(e) {
        this.getList({page:1,limit:10});
      },
      // 表单重置
      reset() {
        this.form = {
            userName: '',
            unitName: '',
            department: '',
            accountName: '',
            idNumber: '',
            orderNum: '',
            phoneNumber: '',
            email: '',
            site: '',
            postcode: '',
            fax: '',
            unitNature: '',
            research: '',
            unitBusiness: '',
            unitSite: '',
            expenditure: '',
            purpose: '',
            targetOther: '',
            jobContent: '',
            record: ''
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList({page:1,limit:10});
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams = {
          aName: undefined,
          orderStatus: null,
        },
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
        if(item.orderStatus == 40){
          this.$message({
          message: '订单已关闭',
          type: 'warning'
        });
          return
        }
        this.nowStatus = item.orderStatus
        this.record = ""
        this.form.record = ""
        this.form = item
        if(item.orderStatus == 0){
          this.handleText = '审核'
        }
        if(item.orderStatus == 10){
          this.handleText = '处理'
        }
        if(item.orderStatus == 20){
          this.handleText = '办结'
        }
        if(item.orderStatus == 30){
          this.handleText = '关闭订单'
        }
        this.open3 = true;
        this.handleRecord(item)
        this.isEdit = true
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
          const self = this
          const loading = Loading.service({
            lock: true,
            text: '加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.9)'
          });
          let par = 
            {
                orderId: this.form.orderId,
                orderStatus: 0,
                record: this.record,
                recordTime: new Date(),
                user: this.$store.state.user.name
            }
            this.form.record = this.record
            if(this.form.orderStatus == 0){
              if(type == -1){
                this.$modal.confirm('确认驳回订单？').then(function() {
                  self.form.orderStatus = -10
                  par.orderStatus = -10
                  updateList(encode(self.form)).then(res=>{
                    addRecList(encode(par)).then(resp=>{
                      self.$modal.msgSuccess("订单驳回成功");
                      self.getList({page:1,limit:10});
                      loading.close()
                    })
                  })
                })
              }else{
                this.$modal.confirm('确认审核订单？').then(function() {
                  self.form.orderStatus = 10
                  par.orderStatus = 10
                  updateList(encode(self.form)).then(res=>{
                    addRecList(encode(par)).then(resp=>{
                      self.$modal.msgSuccess("订单审核成功");
                      self.getList({page:1,limit:10});
                      loading.close()
                    })
                  })
                })
              }
          }else if(this.form.orderStatus == 10){
            this.$modal.confirm('确认处理订单？').then(function() {
              self.form.orderStatus = 20
              par.orderStatus = 20
              updateList(encode(self.form)).then(res=>{
                addRecList(encode(par)).then(resp=>{
                  self.$modal.msgSuccess("订单处理成功");
                  self.getList({page:1,limit:10});
                  loading.close()
                })
              })
            })
          }else if(this.form.orderStatus == 20){
            this.$modal.confirm('确认办结订单？').then(function() {
              self.form.orderStatus = 30
              par.orderStatus = 30
              updateList(encode(self.form)).then(res=>{
                addRecList(encode(par)).then(resp=>{
                  self.$modal.msgSuccess("订单办结成功");
                  self.getList({page:1,limit:10});
                  loading.close()
                })
              })
            })
          } else {
            this.$modal.confirm('是否确认关闭订单？').then(function() {
              self.form.orderStatus = 40
              par.orderStatus = 40
              updateList(encode(self.form)).then(res=>{
                addRecList(encode(par)).then(resp=>{
                  self.$modal.msgSuccess("订单关闭成功");
                  self.getList({page:1,limit:10});
                  loading.close()
                })
              })
            })
          }
          self.open3 = false;
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const self = this
        this.$modal.confirm('是否确认删除').then(function() {
          let par = {
            returnNum: row.orderId
          }
          delList(par).then(res=>{
            self.$modal.msgSuccess("删除成功");
            self.getList({page:this.queryParams2.pageNum,limit:10});
          })
        })
      }
    }
  };
  </script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped>
.info {
    padding-left:45px;
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.cartItem {
  display: flex;
    padding: 8px 15px;
    border-bottom: 1px solid #e1e1e1;
    background-color: rgb(249, 249, 251)
}
.total {
    padding: 12px 5px;
    font-size: 16px;
    text-align: right;
}
ul li{
  list-style-type: none;
}
</style>
