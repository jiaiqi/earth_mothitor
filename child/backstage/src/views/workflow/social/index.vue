<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['workflow:social:index']"
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
      <el-table-column prop="pName" label="需求名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="pUnit" label="发布单位" :show-overflow-tooltip="true"></el-table-column>
      <!-- <el-table-column prop="situation" label="需求概况" :show-overflow-tooltip="true"></el-table-column> -->
      <el-table-column prop="fieldId" label="所属领域" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="classificationId" label="所属行业分类" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="开始时间" width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{new Date(scope.row.stime).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{new Date(scope.row.etime).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleInfo(scope.row)"
            v-hasPermi="['workflow:social:index']"
          >详情</el-button>
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['workflow:social:index']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['workflow:social:index']"
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
            <el-form-item label="需求名称" prop="pname">
              <el-input v-model="form.pName" :disabled="title == '详情'" placeholder="请输入需求名称" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="发布单位" prop="punit">
              <el-input v-model="form.pUnit" :disabled="title == '详情'" placeholder="请输入发布单位" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="需求概况" prop="situation">
              <el-input v-model="form.situation" :disabled="title == '详情'" placeholder="请输入需求概况" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="所属领域" prop="fieldId">
              <el-input v-model="form.fieldId" :disabled="true" v-if="title == '详情'" placeholder="请输入所属领域" />
              <el-cascader v-else v-model="form.fieldId2" :options="menuOptions" @change="handleItemChange"
               placeholder="选择所属领域" :props="props"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行业分类" prop="classificationId">
              <el-input v-model="form.classificationId" :disabled="true" v-if="title == '详情'" placeholder="请输入行业分类" />
              <el-cascader v-else v-model="form.classificationId2" @change="handleItemChange" :props="props"
              :options="menuOptions2"
                placeholder="选择行业分类"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="开始日期" prop="stime">
              <el-date-picker
                v-model="form.sTime"
                type="date"
                :disabled="title == '详情'"
                placeholder="选择开始日期">
              </el-date-picker>
           </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="结束日期" prop="etime">
              <el-date-picker
                v-model="form.eTime"
                type="date"
                :disabled="title == '详情'"
                placeholder="选择结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="相关材料" prop="cUnit">
              <el-input v-model="form.material" :disabled="title == '详情'" placeholder="请输入相关材料" />
            </el-form-item>
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
  import { delMenu, addMenu, updateMenu } from "@/api/system/menu";
  import { getUserProfile } from "@/api/system/user"
  import { socialList, getField, getClassification, socialAdd, socialEdit, socialDel } from "@/api/workflow/directory";
  // import { getField } from "@/api/workflow/directory";
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
        // 菜单表格树数据
        menuList: [],
        //是否可编辑
        isEdit: false,
        //列表数
        total: 1,
        // 菜单选项
        prodOptions: [
          {
            value: 0,
            label: '产品服务'
          },
          {
            value: 1,
            label: '技术服务'
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
          menuName: undefined,
          visible: undefined
        },
        user: {},
        postGroup: {},
        fieldId: '',
        classificationId: '',
        // 表单参数
        form: {
          pName: '',
          pUnit: '',
          situation: '',
          fieldId: '',
          fieldId2: [],
          classificationId: [],
          classificationId2: [],
          sTime: '',
          eTime: '',
          material: ''
        },
        props: {
          value: 'bClass',
          label: 'bClass',
          children: 'sClass'
        },
        sClassification: [],
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
      // this.getList();
      this.getPageList({
        page: 1,
        limit: 10
      });
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
        // console.log('active item:', val);
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
     getList() {
        proSerlist(encode({})).then(response => {
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
        this.open = true;
        this.form = row
      },
      // 表单重置
      reset() {
        this.form = {
          pName: '',
          pUnit: '',
          situation: '',
          fieldId: '',
          fieldId2: [],
          classificationId: [],
          classificationId2: [],
          sTime: '',
          eTime: '',
          material: ''
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
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
        this.getSelData()
        this.form.fieldId2 = [row.fieldId.split('/')[0],row.fieldId.split('/')[1]]
        this.form.classificationId2 = [row.classificationId.split('/')[0]]
        this.title = "修改";
        this.isEdit = true
        let par = {
          id: row.id
        }
        this.open = true;
      },
      /** 提交按钮 */
      submitForm: function() {
        if (this.title == "修改") {
            socialEdit(encode(this.form)).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getPageList({
                page: 1,
                limit: 10
              });
            });
          } else {
            socialAdd(encode(this.form)).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getPageList({
                page: 1,
                limit: 10
              });
            });
          }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$modal.confirm('是否确认删除' + row.pName).then(function() {
          let par = {
          id: row.id
        }
          return socialDel(encode(par));
        }).then(() => {
          this.getPageList({
            page: 1,
            limit: 10
          });
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }
    }
  };
  </script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
  