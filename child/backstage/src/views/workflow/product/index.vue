<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="产品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品类型" prop="classification">
        <el-select v-model="queryParams.classification" placeholder="请选择产品类型" clearable>
          <el-option
            v-for="dict in STypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系单位" prop="institution">
        <el-input
          v-model="queryParams.institution"
          placeholder="请输入联系单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
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
          @click="handleAdd"
          v-loading.fullscreen.lock="loading2"
          v-hasPermi="['workflow:product:index']"
        >新增</el-button>
        <!-- <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="uploadData"
          v-loading.fullscreen.lock="loading2"
          v-hasPermi="['workflow:product:index']"
        >数据上传</el-button> -->
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getPageList({page: 1,limit: 20})"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
    >
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
        </template>
      </el-table-column> -->
      <el-table-column prop="name" label="产品名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="classification" label="产品类型" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="institution" label="联系单位" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="auditStatus" label="状态" :show-overflow-tooltip="true">
        <template slot-scope="scope">
            <div>
              <el-tag :type="scope.row.auditStatus == 1? 'success' : scope.row.auditStatus == -1?'danger': 'warning'">{{ scope.row.auditStatus==1?'已完成':scope.row.auditStatus==-1?'已结束':'待审核' }}</el-tag>
            </div>
            </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-upload2"
            @click="handleUpload(scope.row)"
            v-hasPermi="['workflow:product:index']"
          >上传文件</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleInfo(scope.row)"
            v-hasPermi="['workflow:product:index']"
          >详情</el-button>
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['workflow:product:index']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['workflow:product:index']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getPageList" />
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1280px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="产品名称" prop="name">
              <el-input v-model="form.name" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="产品类型" prop="classification">
              <el-input v-model="form.classification" :disabled="true" v-if="title == '详情' || title == '文件上传'" placeholder="请输入产品分类" />
                <el-cascader v-else v-model="classification2" :options="menuOptions" :props="{ expandTrigger: 'hover' }"
                  placeholder="选择产品分类"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="产品描述" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="6" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入产品描述" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="关键词" prop="keyword">
              <el-input v-model="form.keyword" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入关键词" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="联系单位" prop="institution">
              <el-input v-model="form.institution" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入联系单位" />
            </el-form-item>
          </el-col>
          <el-col :span="50">
            <el-form-item label="是否有地图服务" prop="map">
              <el-select v-model="form.map" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入是否有地图服务">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="地图链接" prop="mapUrl">
              <el-input v-model="form.mapUrl" :disabled="title == '详情' || title == '文件上传'" placeholder="请输入地图链接" />
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="title != '新增'">
            <el-form-item label="文件列表" prop="institution">
              <label v-for="item in fileList" :key="item.url" class="fileText" @click="downLoadFile(item.url)">
                {{ item.name }}
              </label>
              <label style="color: rgb(166, 166, 166);" v-if="fileList.length == 0">无文件</label>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="title == '文件上传'">
            <el-form-item prop="institution">
              <el-upload
                class="upload"
                drag
                :limit="3"
                :file-list="fileList"
                :disabled="isUploading"
                :action="action"
                :on-success="handleUploadSuccess"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="isEdit">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="reset">重 置</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="open2" width="1280px" append-to-body>
    <el-form :model="form" :rules="rules2">
      <el-row>
        <el-col :span="20">
          <el-form-item label="产品类型" prop="classification">
            <el-cascader v-model="classification2" :options="menuOptions" :props="{ expandTrigger: 'hover' }"
              placeholder="选择产品分类"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item prop="institution">
            <el-upload
              class="upload"
              drag
              :limit="3"
              :file-list="fileList"
              :action="action2"
              :before-upload="beforeAvatarUpload"
              :on-progress="onProgress"
              :on-success="handleUploadSuccess2"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
  
<script>
  import { quickAdd } from "@/api/workflow/audit";
  import { proSerlist, proDel, proAdd, proEdit, getlist, linkFile, getLinkFileImg, getFileList } from "@/api/workflow/prods";
  import Treeselect from "@riophae/vue-treeselect";
  import { Loading } from 'element-ui';
  import { getUserProfile } from "@/api/system/user"
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";
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
        // 显示搜索条件
        showSearch: true,
        open2: false,
        // 菜单表格树数据
        menuList: [],
        //是否可编辑
        isEdit: false,
        deptName: '',
        //列表数
        total: 1,
        // 菜单选项
        prodOptions: [
          {
            value: 0,
            label: '地震监测'
          },
          {
            value: 1,
            label: '震害防御'
          }
        ],
        // 是否禁用
        isUploading: false,
        loading2: false,
        loading3: false,
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
      },
        // 上传文件列表
        fileList: [],
        // 文件上传地址
        action: process.env.VUE_APP_PRODS_API + '/prodSer/uploadFile',
        action2: process.env.VUE_APP_PRODS_API + '/prodSer/upload',
        // 查询参数
        queryParams2: {
          pageNum: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParams: {
          name: '',
          classification: '',
          institution: ''
        },
        STypeOptions:[
          {
            value: '地震监测',
            label: '地震监测'
          },
          {
            value: '震害防御',
            label: '震害防御'
          }
        ],
        // 表单参数
        form: {
          id: '',
          name: '',
          classification: '',
          institution: '',
          description: '',
          keyword: '',
          map: 0,
          mapUrl: ''
        },
        form2: {
          classification: '',
        },
        classification2: [],
        sClassification: [],
        sClassification2: [],
        menuOptions: [
          { value: '地震监测', label: '地震监测', children: [
            { value: '地震目录', label: '地震目录'},
            { value: '震源机制解', label: '震源机制解'},
            { value: '地壳应力场', label: '地壳应力场'},
            { value: 'GNSS产品', label: 'GNSS产品'},
            { value: '水准产品', label: '水准产品'},
            { value: 'InSAR产品', label: 'InSAR产品'},
            { value: '重力产品', label: '重力产品'},
            { value: '地磁产品', label: '地磁产品'},
            { value: '地电产品', label: '地电产品'},
            { value: '断层形变', label: '断层形变'},
            { value: '地倾斜', label: '地倾斜'},
            { value: '地应变', label: '地应变'},
            { value: '地下流体', label: '地下流体'},
          ]},
          { value: '震害防御', label: '震害防御', children: [
            { value: '地震构造图', label: '地震构造图'},
            { value: '地震区划图', label: '地震区划图'},
            { value: '地震活动断层', label: '地震活动断层'},
            { value: '工程抗震', label: '工程抗震'}
          ]}
        ],
        // 表单校验
        rules: {
          name: [
            { required: true, message: "产品名称不能为空", trigger: "blur" }
          ],
          classification: [
            { required: true, message: "产品类型不能为空", trigger: "blur" }
          ],
          description: [
            { required: true, message: "产品描述不能为空", trigger: "blur" }
          ],
          institution: [
            { required: true, message: "联系单位不能为空", trigger: "blur" }
          ]
        },
        rules2: {
          classification: [
            { required: true, message: "产品类型不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      // this.getList();
      let taskId = this.$route.query.taskId
      this.getPageList({
        page: 1,
        limit: 20,
        taskId: taskId
      });
      this.getUserDept()
    },
    mounted() {
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
      beforeAvatarUpload() {
        if(this.classification2.length == 0){
          alert("请选择产品类型再上传")
          return false
        }else{
          return true
        }
      },
      // 选择图标
      selected(name) {
        this.form.icon = name;
      },
      getPageList(data) {
        this.menuList = []
        let info = {
          pageNum: data.page,
          pageSize: data.limit
        }
        if(data.taskId){
          info = {
            pageNum: 1,
            pageSize: 9999,
            taskId: data.taskId
          }
        }
        getlist(info).then(response => {
          this.loading = false;
          this.queryParams2.pageSize = response.size;
          this.queryParams2.pageNum = response.current;
          let list = []
          response.records.forEach(item=>{
            if(!item.linkUrl){
              list.push(item)
            }
          })
          this.total = response.total;
          this.menuList = list;
        });
      },
      handleUpload(row) {
        this.loadFileList(row)
        this.title = '文件上传'
        this.form = row
        this.open = true
      },
      onProgress() {
        this.loading3 = Loading.service({
            lock: true,
            text: '数据上传中，请稍等...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.9)'
          });
      },
      //数据上传
      uploadData() {
        this.open2 = true
        this.title = '文件上传'
      },
      //下载文件
      downLoadFile(url) {
        window.open(url)
      },
      loadFileList(row) {
        let par = {
          id: row.id
        }
        getLinkFileImg(par).then(res => {
          this.fileList = decode(res)
        })
      },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      let par = {
        pId: this.form.id,
        name: file.name,
        url:res,
      }
      linkFile(encode(par)).then(resp => {
          if (resp) {
          this.$message.success(resp)
          this.fileList.push({
            name: file.name,
            url: res
          })
        } else {
          this.$message.error('上传失败, 请重试')
        }
      })

    },
    handleUploadSuccess2(e,f){
        if(e){
          this.$message(e)
        }
        this.loading3.close()
      },
      /** 查询菜单列表 */
     getList(data) {
        proSerlist(encode(data)).then(response => {
          this.loading = false;
          this.menuList = decode(response);
          this.menuList.forEach((item)=>{
            if(item.sType == 0) {
              item.sType2 = '产品服务'
            }
            if(item.sType == 1) {
              item.sType2 = '技术服务'
            }
          })
        });
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
        this.isEdit = false
        let par = {
          id: row.id
        }
        this.form = row
        this.open = true;
        //加载文件列表
        this.loadFileList(row)
      },
      // 表单重置
      reset() {
        this.form = {
          id: '',
          name: '',
          classification: '',
          institution: '',
          description: '',
          keyword: '',
          map: 0,
          mapUrl: ''
        };
        this.classification2 = []
        // this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        let par = {
            pageNum: 1,
            pageSize: 10,
            name: this.queryParams.name,
            institution: this.queryParams.institution,
            classification: this.queryParams.classification
          }
          getlist(par).then(response => {
            this.queryParams2.pageSize = response.size;
            this.queryParams2.pageNum = response.current;
            this.total = response.total;
            this.menuList = response.records;
          });
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams = {
          name: '',
          classification: '',
          institution: ''
        }
        this.getPageList({
          page: 1,
          limit: 10
        });
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "新增";
        this.isEdit = true
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
        this.form = row;
        this.title = "修改";
        this.isEdit = true
        this.classification2 = []
        if(this.form.classification.indexOf('/') != -1){
          this.classification2 = this.form.classification.split('/')
        }else {
          this.classification2[0] = this.form.classification
        }

        this.open = true;
        //加载文件列表
        this.loadFileList(row)
      },
      /** 提交按钮 */
      submitForm: function() {
        if(this.classification2.length > 1){
          this.form.classification = this.classification2[0] + '/' + this.classification2[1]
        }else {
          this.form.classification = this.classification2[0]
        }
        if(!this.form.name || !this.form.classification || !this.form.institution || !this.form.description){
          return
        }
        this.loading2 = true
        if (this.title == "修改") {
            proEdit(encode(this.form)).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getPageList({
                page: 1,
                limit: 20
              });
              this.loading2 = false
            });
          } else {
            let par = {
                title: '产品服务-'+this.form.name,
                disciplineKey: '产品服务',
                creator: this.$store.state.user.name,
                unitName: this.deptName
              }
              quickAdd(par).then(res=>{
                this.form.auditTaskId = res
                proAdd(encode(this.form)).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.open = false;
                  this.getPageList({
                    page: 1,
                    limit: 20
                  });
                  this.loading2 = false
                });
              })

          }
      },
      getUserDept() {
        getUserProfile().then((res) => {
            this.deptName = res.data.dept.deptName
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$modal.confirm('是否确认删除' + row.name).then(function() {
          let par = {
          id: row.id
        }
          return proDel(encode(par));
        }).then(() => {
          this.getPageList({
            page: this.queryParams2.pageNum,
            limit: 20
          });
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }
    }
  };
  </script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
  .upload {
    width: 100%;
    position: relative;
    left: 35%;
  }
  .fileText {
    padding: 10px 0px;
    color: rgb(0, 89, 255);
    cursor: pointer;
  }
</style>
  