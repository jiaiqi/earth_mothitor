<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       <el-form-item label="是否置顶" prop="isTop">
              <el-select v-model="queryParams.isTop" placeholder="请选择"  clearable>
                <el-option   
                  value="1" label="是"></el-option>
                  <el-option label="否"
                  value="0"></el-option>
              </el-select>
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
          v-hasPermi="['workflow:platNews:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList({page: 1,limit:10})"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="menuList"
    >
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
        </template>
      </el-table-column> -->
      <el-table-column prop="title" label="标题" :show-overflow-tooltip="true"></el-table-column>
      <!-- <el-table-column prop="newsText" label="内容" :show-overflow-tooltip="true"></el-table-column> -->
      <el-table-column prop="uploader" label="发布人" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="uploadTime" label="发布时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">
            <div>
              {{ new Date(scope.row.uploadTime).toLocaleString() }}
            </div>
        </template>
      </el-table-column>
      <el-table-column prop="taskState" label="状态" :show-overflow-tooltip="true">
        <template slot-scope="scope">
            <div>
              <el-tag :type="scope.row.taskState == 1? 'success' : scope.row.taskState == -1?'danger': 'warning'">{{ scope.row.taskState==1?'已完成':scope.row.taskState==-1?'已结束':'待审核' }}</el-tag>
            </div>
        </template>
      </el-table-column>
       <el-table-column prop="isTop" label="是否置顶" :show-overflow-tooltip="true">
        <template slot-scope="scope">
            <div>
              <span>{{scope.row.isTop == '1'? "是":"否"}}</span>
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
            v-hasPermi="['workflow:platNews:index']"
          >详情</el-button>
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['workflow:platNews:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['workflow:platNews:delete']"
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
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" :disabled="title == '详情'" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
          <el-col :span="10">
            <el-form-item label="展示形式" prop="showType">
              <el-select v-model="showType" placeholder="请选择" :disabled="title == '详情'" clearable>
                <el-option
                  value="跳转">跳转</el-option>
                  <el-option
                  value="富文本">富文本</el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="10">
            <el-form-item label="是否置顶" prop="isTop">
              <el-select v-model="form.isTop" placeholder="请选择" :disabled="title == '详情'" clearable>
                <el-option   
                  value="1" label="是"></el-option>
                  <el-option label="否"
                  value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      <el-row>
          <el-col :span="25">
            <el-form-item v-if="showType == '跳转'" label="跳转路径" prop="url">
              <el-input v-model="form.url" :disabled="title == '详情'" placeholder="请输入跳转路径" />
            </el-form-item>
            <el-form-item v-else-if="showType == '富文本'" label="内容" prop="text">
              <div v-if="title != '详情'" style="border: 1px solid #ccc;margin-top: 20px;">
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
                <Editor ref="editor" style="height: 300px; width: 1000px; overflow-y: hidden;" v-model="form.newsText" :defaultConfig="editorConfig" :mode="mode"
                  @onCreated="onCreated" />
              </div>
              <div v-else>
                <div class="text" v-html="form.newsText"></div>
              </div>
            </el-form-item>
          </el-col>
          </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="isEdit" @click="submitForm">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
  import { delMenu, addMenu, updateMenu } from "@/api/system/menu";
  import { quickAdd } from "@/api/workflow/audit";
  import { getNewsAll, getNewsAdd, getNewsEdit, getNewsDel } from "@/api/workflow/count";
  import { socialList, getField, getClassification, socialAdd, socialEdit, socialDel } from "@/api/workflow/directory";
  import { getUserProfile } from "@/api/system/user"
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { IEditorConfig } from '@wangeditor/editor'
  import { encode, decode } from '@/utils/base/dataEncry.js';
import { value } from "dom7";
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
        showType: '富文本',
    
        // 菜单表格树数据
        menuList: [],
        //是否可编辑
        isEdit: false,
        //列表数
        total: 1,
        // 弹出层标题
        title: "新增",
        // 是否显示弹出层
        open: false,
        // 是否展开，默认全部折叠
        isExpandAll: false,
        // 重新渲染表格状态
        refreshTable: true,
        deptName: null,
        editorConfig: {
            placeholder: "请输入内容...",
            MENU_CONF: {
              // 配置上传图片
              uploadImage: {
                server: process.env.VUE_APP_PRODS_API + '/prodSer/uploadImage',
                fieldName: 'file'
              },
              uploadVideo: {
              // 文件名称
            fieldName: 'file',
            server: process.env.VUE_APP_PRODS_API + '/prodSer/uploadImage',
           
            // 单个文件的最大体积限制，默认为 60M
            maxFileSize: 200 * 1024 * 1024,
            // 最多可上传几个文件，默认为 100
            maxNumberOfFiles: 1,
            // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
            allowedFileTypes: [],
            // 跨域是否传递 cookie ，默认为 false
            withCredentials: false,
            // 超时时间，默认为 10 秒
            timeout: 60 * 1000        
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
          title: undefined,
          isTop:""
        },
        // 表单参数
        form: {
          id: '',
          title: '',
          newsText: '',
          uploader: '',
          taskId: '',
          taskState: '',
          url: '',
          auditTaskId: '',
          isTop: '0',
          uploadTime: ''
         
        },
        taskId: '',
        menuOptions: [],
        menuOptions2: [],
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
      handleItemChange(val) {
        console.log('active item:', val);
      },
      getPageList(data) {

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
      getUserDept() {
        getUserProfile().then((res) => {
            this.deptName = res.data.dept.deptName
        })
      },
      uploadImg() {
        // 修改 uploadImage 菜单配置

      },
      /** 查询菜单列表 */
     getList(data) {
      this.loading = true
      let par = 'pageNum='+data.page+'&pageSize='+data.limit+'&isTop='+this.queryParams.isTop 
      if(this.taskId){
        par = 'pageNum=1&pageSize=10&taskId='+this.taskId+'&isTop='+this.queryParams.isTop 
        if(this.queryParams.title){
          par = 'pageNum='+data.page+'&pageSize='+data.limit+'&taskId='+this.taskId + '&title='+this.queryParams.title+'&isTop='+this.queryParams.isTop 
        }
      }else{
        if(this.queryParams.title){
          par = 'pageNum='+data.page+'&pageSize='+data.limit+ '&title='+this.queryParams.title+'&isTop='+this.queryParams.isTop 
        }
      }

      getNewsAll(par).then(res=>{
        this.loading = false
        this.menuList = [...res.records]
        this.total = res.total
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
        this.isEdit = false
        this.open = true;
        this.form = row
        if(this.form.url){
          this.showType = "跳转"
        }else{
          this.showType = "富文本"
        }
      },
      // 表单重置
      reset() {
        this.form = {
          id: '',
          title: '',
          newsText: '',
          uploader: '',
          taskId: '',
          taskState: '',
          url: '',
          isTop: '0',
          auditTaskId: '',
          uploadTime: ''
        };
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList({page:1,limit:10});
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
        this.open = true;
        this.title = "新增";
        this.isEdit = true
      },
      handleUpdate(data) {
        this.form = data
        this.open = true;
        this.title = "修改";
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
      /** 提交按钮 */
      submitForm: function(type) {
        if (this.title == "修改") {
          getNewsEdit(encode(this.form)).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList({page:1,limit:10});
          });
        } else {
          this.form.uploader = this.$store.state.user.name
          // this.form.uploadTime = new Date().toLocaleString()
          let par = {
            title: this.form.title,
            disciplineKey: '平台动态',
            creator: this.$store.state.user.name,
            unitName: this.deptName
          }
          quickAdd(par).then(res=>{
            this.form.taskId = res
            getNewsAdd(encode(this.form)).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList({page:1,limit:10});
            });
          })
        }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const self = this
        this.$modal.confirm('是否确认删除' + row.title).then(function() {
          let par = {
            id: row.id
          }
          self.loading = true
          return getNewsDel(encode(par));
        }).then(() => {
          self.$modal.msgSuccess("删除成功");
          self.getList({page:1,limit:10});
          self.loading = false
        }).catch(() => {});

        // return
        // const self = this
        // this.$modal.confirm('是否确认删除"' + row.title+'"').then(function() {
        //   let par = {
        //     id: self.form.id
        //   }
        //   return getNewsDel(par);
        // }).then(res=>{
        //   self.$modal.msgSuccess("删除成功");
        //   self.getList({page:1,limit:10});
        // })
      }
    }
  };
  </script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
