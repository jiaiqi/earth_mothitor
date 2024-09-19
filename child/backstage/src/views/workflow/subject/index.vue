<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="学科分类" prop="typeId">
        <el-select v-model="queryParams.typeId" placeholder="请选择学科分类" @change="changeStat" clearable>
            <el-option
              v-for="dict in STypeOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
      </el-form-item>
      <el-form-item>
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
          v-hasPermi="['workflow:subject:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
    <el-tab-pane label="学科管理" name="sub">
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
    >
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
        </template>
      </el-table-column> -->
      <el-table-column width="120" prop="orderNum" label="序号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sname" label="学科名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="typeName" label="学科分类" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taskState" label="审核状态" :show-overflow-tooltip="true">
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
            v-hasPermi="['workflow:subject:index']"
          >详情</el-button>
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['workflow:subject:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.taskState <= 0"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['workflow:subject:del']"
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
          <el-col :span="5">
            <el-form-item label="序号" prop="orderNum">
              <el-input v-model="form.orderNum" type="number" min="1" :disabled="title == '详情'" placeholder="请输入序号" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="学科名称" prop="SName">
              <el-input v-model="form.sname" :disabled="title == '详情'" placeholder="请输入法规名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="学科分类" prop="typeName">
              <el-select v-model="form.typeId" :disabled="title == '详情'" placeholder="请选择学科分类">
                <el-option v-for="item in STypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" :disabled="title == '详情'" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="路径" prop="url">
              <el-input v-model="form.url" :disabled="title == '详情'" placeholder="请输入路径" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审批节点数" prop="passNode">
              <el-select v-model="form.passNode" :disabled="title == '详情'" placeholder="请选择审批节点数">
                <el-option label="0" :value="0"></el-option>
                <el-option label="1" :value="1"></el-option>
                <el-option label="2" :value="2"></el-option>
                <el-option label="3" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="36">
            <el-form-item label="简介" prop="stext">
              <div style="border: 1px solid #ccc;margin-top: 20px;">
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
                <Editor ref="editor" style="height: 330px; overflow-y: hidden;" v-model="form.stext" :defaultConfig="editorConfig" :mode="mode"
                  @onCreated="onCreated" />
              </div>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="isEdit">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="reset">重 置</el-button>
      </div>
    </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="学科分类管理" name="subType">
        <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="subTypeList"
      >
        <el-table-column width="120" prop="orderNum" label="序号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="typeName" label="分类名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="taskState" label="审核状态" :show-overflow-tooltip="true">
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
              v-hasPermi="['workflow:subject:index']"
            >详情</el-button>
            <el-button 
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['workflow:subject:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
               v-if="scope.row.taskState <= 0"
              @click="handleDelete2(scope.row)"
              v-hasPermi="['workflow:subject:del']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total2 > 0" :total="total2" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
              @pagination="getSubType" />
      <!-- 添加或修改菜单对话框 -->
      <el-dialog :title="title" :visible.sync="open2" width="1280px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="序号" prop="orderNum">
                <el-input v-model="form2.orderNum" type="number" min="1" :disabled="title == '详情'" placeholder="请输入序号" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="分类名称" prop="typeName">
                <el-input v-model="form2.typeName" :disabled="title == '详情'" placeholder="请输入法规名称" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="路径" prop="remark">
                <el-input v-model="form2.remark" :disabled="title == '详情'" placeholder="请输入路径" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="isEdit">
          <el-button type="primary" @click="submitForm">提 交</el-button>
          <el-button @click="reset">重 置</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
    </el-tabs>
  </div>
</template>
  
<script>
  import { quickAdd } from "@/api/workflow/audit";
  import { Loading } from 'element-ui';
  import { getSubAll, addSub, editSub, delSub, getTypeDic, addTypeDic, editTypeDic, delTypeDic } from "@/api/workflow/count";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
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
        //学科分类列表
        subTypeList: [],
        //是否可编辑
        isEdit: false,
        //列表数
        total: 1,
        total2: 1,
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
        activeName: 'sub',
        // 是否显示弹出层
        open: false,
        open2: false,
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
          typeId:''
        },
        STypeOptions:[],
        taskId: '',
        // 表单参数
        form: {
          id: null,
          orderNum: null,
          sname: '',
          stext: null,
          passNode: null,
          taskId: null,
          taskState: null,
          title: '',
          typeId: null,
          typeName: '',
          url: '',
          uploader: ''
        },
        form2: {
          typeId: null,
          orderNum: null,
          typeName: '',
          remark: '',
          taskId: null,
          taskState: null,
        },
        sClassification: [],
        sClassification2: [],
        // 表单校验
        rules: {
          SName: [
            { required: true, message: "名称不能为空", trigger: "blur" }
          ],
          orderNum: [
            { required: true, message: "序号不能为空", trigger: "blur" }
          ],
          typeName: [
            { required: true, message: "分类不能为空", trigger: "blur" }
          ],
          url: [
            { required: true, message: "路径不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.taskId = this.$route.query.taskId
      if(this.$route.query.types){
        this.activeName = this.$route.query.types
      }
      this.getList({page:1,limit:10});
      // this.getPageList({
      //   page: 1,
      //   limit: 10
      // });
    },
    mounted() {
      this.getSubType(false)
      this.getSubType({page:1,limit:10})
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
      uploadImg() {
        // 修改 uploadImage 菜单配置

      },
      getSubType(page){
        let par = ''
        if(!page){
          par = 'pageNum=1&pageSize=999'
        }else {
          this.loading = true
          par = 'pageNum='+page.page+'&pageSize='+page.limit
          if(this.$route.query.types == 'subType'){
            par += '&taskId='+this.taskId
          }
        }
        getTypeDic(par).then(res=>{
          this.STypeOptions = res.records.map(item=>{
            return {
              label: item.typeName,
              value: item.typeId
            }
          })
          if(page){
            this.subTypeList = res.records
            this.total2 = res.total
            this.loading = false
          }
        })
      },
      /** 查询菜单列表 */
     getList(data) {
      let list = []
      let str = 'pageNum='+data.page+'&pageSize='+data.limit
      if(this.taskId){
        str = 'pageNum=1&pageSize=10&taskId='+this.taskId
      }
      if(this.queryParams.typeId){
        str = 'pageNum=1&pageSize=10&typeId='+this.queryParams.typeId
      }
        getSubAll(str).then(response => {
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
      changeStat() {
        this.getList({page:1,limit:10});
      },
      handleInfo(row) {
        this.title = "详情";
        this.isEdit = false
        if(this.activeName == 'sub'){
          this.form = row
          this.open = true;
        }else {
          this.form2 = row
          this.open2 = true;
        }
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          orderNum: null,
          sname: '',
          stext: null,
          taskId: null,
          taskState: null,
          title: '',
          typeId: null,
          typeName: '',
          url: '',
          uploader: '',
          passNode: null
        };
        this.form2 = {
          typeId: null,
          orderNum: null,
          typeName: '',
          remark: '',
          taskId: null,
          taskState: null,
        };
        this.resetForm("form");
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams = {
          typeName: ''
        }
        this.getList({
          page: 1,
          limit: 10
        });
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        if(this.activeName == 'sub'){
          this.open = true;
        }else{
          this.open2 = true;
        }
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
        this.title = "修改";
        this.isEdit = true
        if(this.activeName == 'sub'){
          this.form = row
          this.open = true
        }else{
          this.form2 = row
          this.open2 = true
        }
      },
      /** 提交按钮 */
      submitForm: function() {
        const loading = Loading.service({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
        });
        //学科提交
        if(this.activeName == 'sub'){
        if(!this.form.sname || !this.form.url || !this.form.typeId || !this.form.orderNum){
          alert('必填项未填！')
          loading.close()
          return
        }
        if (this.title == "修改") {
          this.form.sName = this.form.sname
          this.form.typeName = this.STypeOptions.filter(item=>{
            if(item.value == this.form.typeId){
              return item
            }
          })[0].label
          this.form.sText = this.form.stext
          editSub(encode(this.form)).then(response => {
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
              title: this.form.sname,
              disciplineKey: '学科审批',
              creator: this.$store.state.user.name
            }
            quickAdd(par).then(res=>{
              this.form.taskId = res
              this.form.sName = this.form.sname
              this.form.typeName = this.STypeOptions.filter(item=>{
                if(item.value == this.form.typeId){
                  return item
                }
              })[0].label
              this.form.sText = this.form.stext
              addSub(encode(this.form)).then(response => {
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
        }

        //学科分类提交
        else {
          if(!this.form2.typeName || !this.form2.orderNum){
            alert('必填项未填！')
            loading.close()
            return
          }

          if (this.title == "修改") {
          editTypeDic(encode(this.form2)).then(response => {
              this.$modal.msgSuccess("修改成功");
              loading.close()
              this.open2 = false;
              this.getSubType({page:1,limit:10})
            });
          } else {
            let par = {
              title: this.form2.typeName,
              disciplineKey: '学科类型',
              creator: this.$store.state.user.name
            }
            quickAdd(par).then(res=>{
              this.form2.taskId = res
              addTypeDic(encode(this.form2)).then(response => {
                this.$modal.msgSuccess("新增成功");
                loading.close()
                this.open2 = false;
                this.getSubType({page:1,limit:10})
              });
            })
          }
        }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$modal.confirm('是否确认删除'+row.sname).then(function() {
          let par = {
          id: row.id
        }
          return delSub(encode(par));
        }).then(() => {
          this.getList({
            page: this.queryParams2.pageNum,
            limit: 10
          });
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 删除按钮操作 */
      handleDelete2(row) {
        this.$modal.confirm('是否确认删除'+row.typeName).then(function() {
          let par = {
            typeId: row.typeId
        }
          return delTypeDic(encode(par));
        }).then(() => {
          this.getSubType({
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
  