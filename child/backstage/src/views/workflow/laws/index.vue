<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="法规名称" prop="menuName">
        <el-input
          v-model="queryParams.SName"
          placeholder="请输入法规名称"
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
          v-hasPermi="['workflow:laws:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
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
      <el-table-column prop="sname" label="法规名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="stype" label="类型" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div>
            {{ scope.row.sType == 3 ? '法律' :'法规' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sclassification" label="法规类型" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="cunit" label="联系单位" :show-overflow-tooltip="true"></el-table-column>
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
            icon="el-icon-search"
            @click="handleInfo(scope.row)"
            v-hasPermi="['workflow:laws:index']"
          >详情</el-button>
          <!-- <el-button 
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['workflow:laws:edit']"
          >修改</el-button> -->
          <el-button
          v-if="scope.row.auditStatus == 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['workflow:laws:delete']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getList" />
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1280px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="法规名称" prop="SName">
              <el-input v-model="form.sName" :disabled="title == '详情'" placeholder="请输入法规名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类型" prop="sType">
              <el-select v-model="form.sType" :disabled="title == '详情'" placeholder="请选择法规分类">
                <el-option v-for="item in STypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="法规分类" prop="sClassification">
              <el-select v-model="form.sClassification" :disabled="title == '详情'" placeholder="请选择法规分类">
                <el-option v-for="item in prodOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="联系单位" prop="cUnit">
              <el-input v-model="form.cUnit" :disabled="title == '详情'" placeholder="请输入联系单位" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="外部链接" prop="url">
              <el-input v-model="form.url" :disabled="title == '详情'" placeholder="请输入外部链接" />
            </el-form-item>
          </el-col>
          <el-col :span="36">
          <div style="border: 1px solid #ccc;margin-top: 20px;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
            <!-- {{form.sText}} -->
            <Editor ref="editor" style="height: 500px; overflow-y: hidden;" v-model="form.sText" :defaultConfig="editorConfig" :mode="mode"
              @onCreated="onCreated" />
          </div>
        </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="isEdit">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="reset">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
  import { quickAdd } from "@/api/workflow/audit";
  import { Loading } from 'element-ui';
  import { delMenu, addMenu, updateMenu } from "@/api/system/menu";
  import { getHtml, serDel, editServe } from "@/api/workflow/prods";
  import { geLawList, addLaw, editLaw, delLaw } from "@/api/dataup/criterion";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { getUserProfile } from "@/api/system/user"
  import { IEditorConfig } from '@wangeditor/editor'
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
        // 菜单表格树数据
        menuList: [],
        //是否可编辑
        isEdit: false,
        //列表数
        total: 1,
        // 菜单选项
        prodOptions: [
          {
            value: '法律',
            label: '法律'
          },
          {
            value: '行政法规',
            label: '行政法规'
          },
          {
            value: '部门规章',
            label: '部门规章'
          },
          {
            value: '省级地方性法规',
            label: '省级地方性法规'
          },
          {
            value: '省级政府规章',
            label: '省级政府规章'
          }
        ],
        // 弹出层标题
        title: "新增",
        // 是否显示弹出层
        open: false,
        deptName: null,
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
          SName: '',
          SType: '',
          cUnit: ''
        },
        STypeOptions:[
          {
            value: 3,
            label: '法律'
          },
          {
            value: 4,
            label: '法规'
          },
        ],
        taskId: '',
        // 表单参数
        form: {
          id: '',
          sName: '',
          sType: '',
          cUnit: '',
          sClassification: '',
          sText: '',
          url: ''
        },
        sClassification: [],
        sClassification2: [],
        // 表单校验
        rules: {
          SName: [
            { required: true, message: "法规名称不能为空", trigger: "blur" }
          ],
          sType: [
            { required: true, message: "分类不能为空", trigger: "blur" }
          ],
          sClassification: [
            { required: true, message: "法规分类不能为空", trigger: "blur" }
          ],
          cUnit: [
            { required: true, message: "联系单位不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.taskId = this.$route.query.taskId
      this.getList({page:1,limit:10});
      this.getUserDept()
      // this.getPageList({
      //   page: 1,
      //   limit: 10
      // });
    },
    mounted() {},
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
      uploadImg() {
        // 修改 uploadImage 菜单配置

      },
      getUserDept() {
        getUserProfile().then((res) => {
            this.deptName = res.data.dept.deptName
        })
      },
      /** 查询菜单列表 */
     getList(data) {
      let list = []
      let par = {
        name: this.queryParams.SName?this.queryParams.SName:'',
      }
      let str = 'pageNum='+data.page+'&pageSize='+data.limit+'&name='+par.name
      if(this.taskId){
        str = 'pageNum=1&pageSize=10&taskId='+this.taskId
      }
        geLawList(str).then(response => {
          list = response.records;
          this.loading = false;
          this.menuList = list
          this.total = response.total
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
        let par = row
        par.sName = par.sname
        par.sType = par.stype
        par.cUnit = par.cunit
        par.sClassification = par.sclassification
        par.sText = par.stext
        this.form = row
        this.open = true;
      },
      // 表单重置
      reset() {
        this.form = {
          id: '',
          sName: '',
          sType: '',
          cUnit: '',
          sClassification: '',
          sText: '',
          url: ''
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        let par = {
          page: 1,
          limit: 10
        }
        this.getList(par);
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams = {
          SName: '',
          SType: '',
          cUnit: ''
        }
        this.getList({
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
        let par = row
        par.sName = par.sname
        par.sType = par.stype
        par.cUnit = par.cunit
        par.sClassification = par.sclassification
        par.sText = par.stext
        this.form = row
        this.open = true
      },
      /** 提交按钮 */
      submitForm: function() {
        const loading = Loading.service({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
        });
        if (this.title == "修改") {
          editLaw(encode(this.form)).then(response => {
              this.$modal.msgSuccess("修改成功");
              loading.close()
              this.open = false;
              this.getList({
                  page: 1,
                  limit: 10
                });
            });
          } else {
            let par = {
              title: this.form.sName,
              disciplineKey: '法律法规',
              creator: this.$store.state.user.name,
              unitName: this.deptName
            }
            quickAdd(par).then(res=>{
              this.form.auditTaskId = res
              addLaw(encode(this.form)).then(response => {
                this.$modal.msgSuccess("新增成功");
                loading.close()
                this.open = false;
                this.getList({
                  page: 1,
                  limit: 10
                });
              });
            })
          }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$modal.confirm('是否确认删除' + row.sname).then(function() {
          let par = {
          id: row.id
        }
          return delLaw(encode(par));
        }).then(() => {
          this.getList({
            page: this.queryParams2.pageNum,
            limit: 10
          });
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }
    }
  };
  </script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
  