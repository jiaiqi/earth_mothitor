<template>
    <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="防震减灾科普" name="fzjz"
    v-if="show1">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="名称" prop="fileName">
          <el-input
            v-model="queryParams.fileName"
            placeholder="请输入名称"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="类型" prop="status">
          <el-select v-model="queryParams.SType" placeholder="请选择类型" clearable>
            <el-option
              v-for="dict in STypeOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(1)">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd(1)"
            v-hasPermi="['workflow:knowledge:fzjz:add']"
          >新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getPageList({
              page: 1,
              limit: 10
            });"></right-toolbar>
      </el-row>

      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="fzjzList"
      >
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
          </template>
        </el-table-column> -->
        <el-table-column prop="fileName" label="名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="typeName" label="类别" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              {{ scope.row.typeName}}
          </template>
        </el-table-column>
        <el-table-column prop="uploader" label="上传者" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ new Date(scope.row.createTime).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column prop="taskState" label="状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>
              <el-tag :type="scope.row.taskState == 1? 'success' : scope.row.taskState == -1?'danger': 'warning'">{{ scope.row.taskState==1?'已完成':scope.row.taskState==-1?'已结束':'待审核' }}</el-tag>
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
              v-hasPermi="['workflow:knowledge:fzjz']"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['workflow:knowledge:fzjz:edit']"
            >修改</el-button>
            <el-button
            v-if="scope.row.taskState == 1 || isAdmin"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['workflow:knowledge:fzjz:delete']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="pages.pageNum" :limit.sync="pages.pageSize"
              @pagination="getPageList" />
      </el-tab-pane>
      <el-tab-pane label="科普示范基地学校名录" name="2"
    v-if="show2">
    <el-form :model="queryParams2" ref="queryForm" size="small" :inline="true">
        <el-form-item label="名称" prop="schoolName">
          <el-input
            v-model="queryParams2.schoolName"
            placeholder="请输入名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="省份" prop="schoolProvince">
          <el-select v-model="queryParams2.schoolProvince" placeholder="请选择省份" clearable>
            <el-option
              v-for="dict in provinList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="basetype" placeholder="请选择" @change="changeType" clearable>
            <el-option
            label="学校"
            value="学校"
            ></el-option>
            <el-option
            label="基地"
            value="基地"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(2)">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd(2)"
            v-hasPermi="['workflow:knowledge:sfjd:add']"
          >新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getPageList2({
          page: 1,
          limit: 10
        })"></right-toolbar>
      </el-row>
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="sfjdList"
      >
        <el-table-column prop="schoolName" label="名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="schoolProvince" label="省份" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="confirmTime" label="认定年份" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="taskState" label="状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>
              <el-tag :type="scope.row.taskState == 1? 'success' : scope.row.taskState == -1?'danger': 'warning'">{{ scope.row.taskState==1?'已完成':scope.row.taskState==-1?'已结束':'待审核' }}</el-tag>
            </div>
            </template>
          </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate2(scope.row)"
              v-hasPermi="['workflow:knowledge:sfjd:edit']"
            >修改</el-button> -->
            <el-button
            v-if="scope.row.taskState == 1"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleSchoolDelete(scope.row)"
              v-hasPermi="['workflow:knowledge:sfjd:delete']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="basetype == '学校'" v-show="total2 > 0" :total="total2" :page.sync="pages.pageNum" :limit.sync="pages.pageSize"
              @pagination="getPageList2" />
      <pagination v-if="basetype == '基地'" v-show="total2 > 0" :total="total2" :page.sync="pages.pageNum" :limit.sync="pages.pageSize"
              @pagination="getBaseList" />
      </el-tab-pane>
      <el-tab-pane label="科普传播师" name="3"
    v-if="show3">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd(3)"
            v-hasPermi="['workflow:knowledge:kpcb:add']"
          >新增</el-button>
        </el-col>
      </el-row>
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="kpcbList"
      >
        <el-table-column prop="name" label="名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['workflow:knowledge:kpcb:edit']"
            >修改</el-button> -->
            <el-button
            v-if="scope.row.taskState == 1"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['workflow:knowledge:kpcb:delete']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="pages.pageNum" :limit.sync="pages.pageSize"
              @pagination="getPageList3" />
      </el-tab-pane>
      </el-tabs>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1280px" append-to-body>
      <el-dialog title="类型选择" :visible.sync="showType" @close="showType = false" width="800px" append-to-body>
        <div>
          <el-col :span="1.5" v-if="isAdmin">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleTypeAdd"
            >新增</el-button>
          </el-col>
          <el-table
            v-loading="loading2"
            highlight-current-row
            height="500"
            @current-change="handleCurrentChange"
            :data="typeList"
          >
            <el-table-column prop="typeId" label="类型代码" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="typeName" label="类型名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column v-if="isAdmin" label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdateType(scope.row)"
                >修改</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDeleteType(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showType = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="名称" prop="fileName">
              <el-input v-model="form.fileName" :disabled="title == '详情'" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="类型" prop="typeName">
              <el-input @focus="openEvent({page:1,limit:20})" :disabled="title == '详情'" v-model="form.typeName" placeholder="请选择类型" />
           </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="描述" prop="fileDescribe">
              <el-input v-model="form.fileDescribe" type="textarea" :rows="4" :disabled="title == '详情'" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="title != '详情'">
            <el-form-item label="封面图片" prop="smallImg">
                <label class="fileText" @click="downLoadFile(form.smallImg)">
                  {{ form.smallImg }}
                </label>
              <el-upload
                class="upload-demo"
                :action="action"
                list-type="picture"
                :limit="1"
                :beforeUpload="beforeUpload2"
                :on-success="handlePreview"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">封面图只能上传jpg/png文件，且不超过1MB</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="title != '新增'">
            <el-form-item label="文件" prop="url">
              <label class="fileText" @click="downLoadFile(form.url)">
                {{ form.url }}
              </label>
              <label style="color: rgb(166, 166, 166);" v-if="form.url.length == 0">无文件</label>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="title == '新增'" style="margin: 15px 0px">
            <el-form-item prop="url" label="科普资源文件">
              <el-upload
                class="upload"
                drag
                :limit="1"
                :file-list="fileList"
                :action="action"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUpload">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="title != '详情'">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="reset">重 置</el-button>
      </div>
    </el-dialog>
    <!-- 学校 -->
    <el-dialog :title="title" :visible.sync="open2" width="700px" append-to-body>
      <div>
        <el-form ref="form" :model="form2" :rules="rules2" label-width="100px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="名称" prop="schoolName">
                <el-input v-model="form2.schoolName" :disabled="title == '详情'" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
            <el-form-item label="类型">
              <el-select v-model="basetype" placeholder="请选择">
                <el-option
                label="学校"
                value="学校"
                ></el-option>
                <el-option
                label="基地"
                value="基地"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
            <el-col :span="20">
              <el-form-item label="省份" prop="schoolProvince">
                <el-select v-model="form2.schoolProvince" :disabled="title == '详情'" placeholder="请输入省份" clearable>
                  <el-option
                    v-for="dict in provinList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="认定年份" prop="confirmTime">
                <el-input style="width: 150px" v-model="form2.confirmTime" type="number" :disabled="title == '详情'"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" style="width: 100%;display:flex;justify-content:center" v-if="title != '详情'">
          <el-button type="primary" @click="submitForm">提 交</el-button>
          <el-button @click="reset">重 置</el-button>
        </div>
      </div>
      </el-dialog>
    </div>
  </template>

  <script>
    import { delMenu, addMenu, updateMenu } from "@/api/system/menu";
    import { quickAdd } from "@/api/workflow/audit";
    import { getAll, getTypeList, addKnowleg, editKnowleg, deleteKnowleg,
    addType, editType, delType, getSchoolList,getAllSchoolList, editSchool, addSchool, delSchool, getBaseList,
    getAllBaseList, addBase, editBase, delBase} from "@/api/workflow/knowledge";
    import Treeselect from "@riophae/vue-treeselect";
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    import IconSelect from "@/components/IconSelect";
    import { getUserProfile } from "@/api/system/user"
    import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
    import { encode, decode } from '@/utils/base/dataEncry.js';
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
          // 显示搜索条件
          showSearch: true,
          //显示类型选择框
          showType: false,
          // 菜单表格树数据
          menuList: [],
          //科普传播
          kpcbList: [],
          //示范基地
          sfjdList: [],
          fileList: [],
          //防震减灾
          fzjzList: [],
          typeList: [],
          action:  process.env.VUE_APP_PRODS_API + '/prodSer/uploadFile',
          //是否可编辑
          isEdit: false,
          //列表数
          total: 1,
          total2: 1,
          total3: 1,
          activeName: 'fzjz',
          basetype: '学校',
          //权限控制
          show1: true,
          show2: true,
          show3: true,
          deptName: null,
          // 菜单选项
          typeOptions: [
            {
              value: 1,
              label: '地震知识'
            },
            {
              value: 2,
              label: '技术应用'
            },
            {
              value: 3,
              label: '地震事件'
            },
            {
              value: 4,
              label: '应急避险'
            },
            {
              value: 5,
              label: '科学访谈'
            }
          ],
          // 弹出层标题
          title: "新增",
          // 是否显示弹出层
          open: false,
          open2: false,
          open3: false,
          taskId: null,
          isAdmin: false,
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
          pages: {
            pageNum: 1,
            pageSize: 10,
          },
          // 查询参数
          queryParams3: {
            pageNum: 1,
            pageSize: 10,
          },
          // 查询参数
          queryParams2: {
            schoolName: '',
            schoolProvince: ''
          },
         // 查询参数
          queryParams: {
            fileName: ''
          },
          userName: '',
          // 表单参数
          form: {
            id: '',
            fileName: '',
            fileId: '',
            url: '',
            smallImg: '',
            typeName: '',
            typeId: '',
            fileDescribe: '',
            viewNumber: 0,
            goodNumber: 0,
            createTime: '',
            taskId: 0,
            del: 1,
          },
          form2: {
            baseId: null,
            schoolId: null,
            schoolName: '',
            schoolProvince: '',
            baseName: '',
            baseProvince: '',
            confirmTime: null,
            taskId: null,
          },
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
          // 表单校验
          rules: {
            fileName: [
              { required: true, message: "标题不能为空", trigger: "blur" }
            ],
            smallImg: [
              { required: true, message: "封面不能为空", trigger: "blur" }
            ],
          },
          rules2: {
            schoolName: [
              { required: true, message: "名称不能为空", trigger: "blur" }
            ],
            schoolProvince: [
              { required: true, message: "省份不能为空", trigger: "blur" }
            ],
          }
        };
      },
      created() {
        this.taskId = this.$route.query.taskId
        //超级管理员
        if(this.$store.state.user.permissions[0] == '*:*:*' || this.$store.state.user.roles.includes('platform_admin')){
          this.isAdmin = true
        }
        this.getPageList({
          page: 1,
          limit: 10
        });
        this.getUserDept()
      },
      mounted() {
        //超级管理员
        if(this.$store.state.user.permissions[0] == '*:*:*' || this.$store.state.user.roles.includes('platform_admin')){
          this.isAdmin = true
            return
        }
        if(this.$store.state.user.permissions.includes('workflow:knowledge:fzjz')){
            this.show1 = true
        }else{
            this.show1 = false
        }
        if(this.$store.state.user.permissions.includes('workflow:knowledge:sfjd')){
            this.show2 = true
        }else{
            this.show2 = false
        }
        if(this.$store.state.user.permissions.includes('workflow:knowledge:kpcb')){
            this.show3 = true
        }else{
            this.show3 = false
        }
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
        changeType(e) {
          if(e == '学校'){
            this.getPageList2({
              page: 1,
              limit: 10
            })
          }else {
            this.getBaseList({
              page: 1,
              limit: 10
            })
          }
        },
        // 选择图标
        selected(name) {
          this.form.icon = name;
        },
        getUserDept() {
          getUserProfile().then((res) => {
              this.deptName = res.data.dept.deptName
              this.userName = res.data.dept.userName
          })
        },
        handleClick(e) {
          if(e.index == 0){
            this.getPageList({
              page: 1,
              limit: 10
            });
          }
          if(e.index == 1){
            this.getPageList2({
              page: 1,
              limit: 10
            });
          }
        },
        handleTypeAdd() {
          this.loading2 = true
          let typeName = prompt('请输入类型名')
          if(typeName){
            let par = {
              typeName: typeName
            }
            addType(encode(par)).then(res=>{
              this.$modal.msgSuccess("新增成功");
              getTypeList({
                pageNum: 1,
                pageSize: 20,
              }).then(res=>{
                this.loading2 = false
                this.typeList = res.records
              })
            })
          }
        },
        handleUpdateType(row) {
          this.loading2 = true
          let typeName = prompt('请输入类型名',row.typeName)
          if(typeName){
          let par = {
              typeName: typeName,
              typeId: row.typeId
            }
          editType(encode(par)).then(res=>{
              this.$modal.msgSuccess("修改成功");
              getTypeList({
                pageNum: 1,
                pageSize: 20,
              }).then(res=>{
                this.loading2 = false
                this.typeList = res.records
              })
            })
          }
          },
          handleUpdate2(row) {
            this.open2 = true
            this.form2 = row
            this.title = '修改'
          },
          handleSchoolDelete(row) {
            this.loading = true
            let par = {}
            if(row.schoolId){
              par = {
                schoolId: row.schoolId
              }
            }else {
              par = {
                baseId: row.baseId
              }
            }
            if(confirm("确认删除？")){
              if(row.schoolId){
              delSchool(encode(par)).then(res=>{
                this.$modal.msgSuccess("删除成功");
                  this.getPageList2({
                    page: this.pages.pageNum,
                    limit: 10
                  })
              })}else {
                delBase(encode(par)).then(res=>{
                this.$modal.msgSuccess("删除成功");
                  this.getBaseList({
                    page: this.pages.pageNum,
                    limit: 10
                  })
              })
              }
            }
          },
        handleDeleteType(row) {
          this.loading2 = true
          let par = {
              typeId: row.typeId
            }
            if(confirm("确认删除？")){
              delType(encode(par)).then(res=>{
                this.$modal.msgSuccess("删除成功");
                getTypeList({
                  pageNum: this.pages.pageNum,
                  pageSize: 20,
                }).then(res=>{
                  this.loading2 = false
                  this.typeList = res.records
                })
              })
            }
        },
        getPageList(data) {
          this.fzjzList = []
          let info = {
            pageNum: data.page,
            pageSize: data.limit,
          }
          let str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize
          if(this.taskId){
            str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize+'&taskId='+this.taskId
          }
          console.log(this.isAdmin)
          if(!this.isAdmin && this.$store.state.user.name != ''){
            str += '&uploader='+this.$store.state.user.name
          }
          getAll(str).then(response => {
            this.loading = false;
            this.total = response.total;
            this.fzjzList = response.records;
          });
        },
        getPageList2(data) {
          this.sfjdList = []
          let info = {
            pageNum: data.page,
            pageSize: data.limit,
          }
          let str = ''
          if(this.queryParams2.schoolProvince != ''){
            str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize+'&schoolName='+this.queryParams2.schoolName+'&schoolProvince='+this.queryParams2.schoolProvince
          }else {
            str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize
          }
          getAllSchoolList(str).then(response => {
            this.loading = false;
            this.total2 = response.total;
            this.sfjdList = response.records;
          });
        },
        getPageList3(data) {
          this.kpcbList = []
          let info = {
            pageNum: data.page,
            pageSize: data.limit,
          }
          listPage(info).then(response => {
            this.loading = false;
            this.total3 = response.total;
            this.kpcbList = response.records;
          });
        },
        getBaseList(data) {
          this.sfjdList = []
          let info = {
            pageNum: data.page,
            pageSize: data.limit,
          }
          let str = ''
          if(this.queryParams2.schoolProvince != ''){
            str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize+'&baseName='+this.queryParams2.schoolName+'&baseProvince='+this.queryParams2.schoolProvince
          }else {
            str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize
          }
          getAllBaseList(str).then(response => {
            this.loading = false;
            this.total2 = response.total;
            this.sfjdList = response.records;
            this.sfjdList.forEach(item=>{
              item.schoolName = item.baseName
              item.schoolProvince = item.baseProvince
            })
          });
        },
        beforeUpload2(file) {
          if(!/\.(jpg|jpeg|png|JPG|PNG)$/.test(file.name)){
            this.$message.error('封面图片格式不符合!请重新上传');
            this.fileList = []
          }
        },
        uploadImg() {
          // 修改 uploadImage 菜单配置

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
        openEvent(data) {
          this.showType = true
          getTypeList({
            pageNum: data.page,
            pageSize: data.limit,
          }).then(res=>{
            this.loading2 = false
            this.typeList = res.records
          })
        },
        beforeUpload(file) {
          const isLt = file.size / 1024 / 1024 < 500;
          if (!isLt) {
            this.$message.error('上传的资料大小不能超过 500MB!');
          }
          return isLt;
        },
        //下载文件
        downLoadFile(url) {
          window.open(url)
        },
        handleCurrentChange(row) {
          this.form.typeName = row.typeName
          this.form.typeId = row.typeId
          this.showType = false
        },
        handleInfo(row) {
          this.title = "详情";
          this.isEdit = false
          this.form = row
          this.open = true
        },
        handleUploadSuccess(e) {
          if(e.code == 500) {
            this.$message.error(e.msg);
          }else{
            this.form.url = e
          }
        },
        handlePreview(url){
          this.form.smallImg = url
        },
        // 表单重置
        reset() {
          this.form = {
            fileName: '',
            fileId: '',
            url: '',
            smallImg: '',
            typeName: '',
            typeId: '',
            fileDescribe: '',
            viewNumber: 0,
            goodNumber: 0,
            createTime: '',
            del: 1,
            taskId: 0,
          };
          this.form2 = {
            id: null,
            schoolName: '',
            schoolProvince: '',
            confirmTime: null,
            taskId: null,
          },
          this.resetForm("form");
          this.fileList = []
        },
        /** 搜索按钮操作 */
        handleQuery(type) {
          if(type == 1){
          this.loading = true
            let info = {
            pageNum: 1,
            pageSize: 10,
            fileName: this.queryParams.fileName
          }
          let str = ''
          if(this.queryParams.fileName != ''){
            str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize+'&fileName='+info.fileName
          }else {
            str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize
          }
          if(!this.isAdmin && this.$store.state.user.name != ''){
            str += '&uploader='+this.$store.state.user.name
          }
          getAll(str).then(response => {
            this.loading = false;
            this.total = response.total;
            this.fzjzList = response.records;
          });
          }else if(type == 2){
            this.loading = true
            if(this.basetype == '学校'){
              let info = {
                pageNum: 1,
                pageSize: 10,
                schoolName: this.queryParams2.schoolName,
                schoolProvince: this.queryParams2.schoolProvince
              }
              let str = ''
              if(this.queryParams2.schoolProvince != ''){
                str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize+'&schoolName='+info.schoolName+'&schoolProvince='+info.schoolProvince
              }else {
                str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize+'&schoolName='+info.schoolName
              }
              getAllSchoolList(str).then(response => {
                this.loading = false;
                this.total2 = response.total;
                this.sfjdList = response.records;
              });
            }else {
              let info = {
                pageNum: 1,
                pageSize: 10,
                baseName: this.queryParams2.schoolName,
                baseProvince: this.queryParams2.schoolProvince
              }
              let str = ''
              if(this.queryParams2.schoolProvince != ''){
                str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize+'&baseName='+info.baseName+'&baseProvince='+info.baseProvince
              }else {
                str = 'pageNum='+info.pageNum+'&pageSize='+info.pageSize+'&baseName='+info.baseName
              }
              getAllBaseList(str).then(response => {
                this.loading = false;
                this.total2 = response.total;
                this.sfjdList = response.records;
                this.sfjdList.forEach(item=>{
                  item.schoolName = item.baseName
                  item.schoolProvince = item.baseProvince
                })
              });
            }

          }
        },
        /** 重置按钮操作 */
        resetQuery() {
          this.queryParams3= {
            pageNum: 1,
            pageSize: 10,
          }
          // 查询参数
          this.queryParams2= {
            schoolName: '',
            schoolProvince: ''
          }
         // 查询参数
         this.queryParams= {
            fileName: ''
          }
        //   this.getPageList({
        //   page: 1,
        //   limit: 10
        // });
        },
        /** 新增按钮操作 */
        handleAdd(type) {
          this.reset();
          if(type == 1){
            this.open = true;
          }
          if(type == 2){
            this.open2 = true;
          }
          if(type == 3){
            this.open3 = true;
          }
          this.isEdit = true
          this.title = "新增";
        },
        /** 展开/折叠操作 */
        toggleExpandAll() {
          this.refreshTable = false;
          this.isExpandAll = !this.isExpandAll;
          this.$nextTick(() => {
            this.refreshTable = true;
          });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
          this.title = "修改";
          this.form = row
          this.open = true
        },
        /** 提交按钮 */
        submitForm: function() {
          if(this.open){
            this.$refs.form.validate((valid) => {
            if (valid) {
            this.open = false;
            this.loading = true;
            if (this.title == "修改") {
              editKnowleg(encode(this.form)).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getPageList({
                  page: 1,
                  limit: 10
                });
              });
            } else {
              let par = {
                title: '地震科普-防震减灾科普-'+this.form.fileName,
                disciplineKey: '地震科普',
                creator: this.$store.state.user.name,
                unitName: this.deptName
              }
              this.form.uploader = this.$store.state.user.name
              quickAdd(par).then(res=>{
                this.form.taskId = res
                addKnowleg(encode(this.form)).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.getPageList({
                    page: 1,
                    limit: 10
                  });
                });
              })
            }
              }
            })
          }else if(this.open2){
            if (this.title == "修改") {
              if(this.basetype == '学校'){
                editSchool(encode(this.form2)).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open2 = false;
                  this.getPageList2({
                    page: 1,
                    limit: 10
                  });
                });
              }else {
                this.form2.baseName = this.form2.schoolName
                this.form2.baseProvince = this.form2.schoolProvince
                editBase(encode(this.form2)).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open2 = false;
                  this.getBaseList({
                        page: 1,
                        limit: 10
                      });
                });
              }
            } else {
              let par = {}
              if(this.basetype == '学校'){
                par = {
                  title: '科普示范基地学校-'+this.form2.schoolName,
                  disciplineKey: '地震科普',
                  creator: this.$store.state.user.name
                }
              }else{
                this.form2.baseName = this.form2.schoolName
                this.form2.baseProvince = this.form2.schoolProvince
                par = {
                  title: '科普示范基地学校-'+this.form2.baseName,
                  disciplineKey: '地震科普',
                  creator: this.$store.state.user.name,
                  unitName: this.deptName
                }
              }
                quickAdd(par).then(res=>{
                  this.form2.taskId = res
                  if(this.basetype == '学校'){
                  addSchool(encode(this.form2)).then(response => {
                      this.$modal.msgSuccess("新增成功");
                      this.open2 = false;
                      this.getPageList2({
                        page: 1,
                        limit: 10
                      });
                    });
                  }else {
                    addBase(encode(this.form2)).then(response => {
                      this.$modal.msgSuccess("新增成功");
                      this.open2 = false;
                      this.getBaseList({
                        page: 1,
                        limit: 10
                      });
                    });
                  }
                })
            }
          }
      },
        /** 删除按钮操作 */
        handleDelete(row) {
          this.loading = true
          this.$modal.confirm('是否确认删除' + row.fileName).then(function() {
            let par = {
              fileId: row.fileId
            }
            return deleteKnowleg(encode(par));
          }).then(() => {
            this.getPageList({
              page: this.pages.pageNum,
              limit: 10
            });
            this.loading = false
            this.$modal.msgSuccess("删除成功");
          }).catch(() => {});
        }
      }
    };
    </script>
  <style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
  .fileText {
    padding: 10px 0px;
    color: rgb(0, 89, 255);
    cursor: pointer;
  }
</style>
