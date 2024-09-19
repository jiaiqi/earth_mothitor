<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="名称" prop="keyName">
        <el-input
          v-model="queryParams.keyName"
          placeholder="请输入名称"
          clearable
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
          v-hasPermi="['workflow:hots:add']"
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
      <el-table-column prop="keyName" label="名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="hotNum" label="浏览量" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="del" label="是否展示" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div>
            {{ scope.row.del == 0?'是':'否' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="flag" label="热度" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleInfo(scope.row)"
            v-hasPermi="['workflow:hots:index']"
          >详情</el-button>
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['workflow:hots:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['workflow:hots:del']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getList" />
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="名称" prop="keyName">
              <el-input v-model="form.keyName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="推荐值(0为不推荐)" prop="flag">
              <el-input style="width: 250px;" v-model="form.flag" type="number" :min="0" :disabled="title == '详情'" placeholder="请输入热度" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="路径" prop="url">
              <el-input v-model="form.url" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="是否展示" prop="del">
              <el-select v-model="form.del" placeholder="请选择是否展示"  :disabled="title == '详情'" clearable>
                <el-option label="是" :value="0"></el-option>
                <el-option label="否" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="封面图片" prop="smallImg">
                <label class="fileText" @click="downLoadFile(form.smallImg)">
                  {{ form.smallImg }}
                </label>
              <el-upload
              :disabled="title == '详情'"
                class="upload-demo"
                :action="action"
                list-type="picture"
                :limit="1"
                :on-success="handlePreview"
                :file-list="fileList">
                <el-button :disabled="title == '详情'" size="small" type="primary">点击上传</el-button>
                <div v-if="title != '详情'" slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="isEdit">
        <el-button type="primary" @click="submitForm">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
  import { Loading } from 'element-ui';
  import { getFlagList, hotAdd, hotDataAdd, hotEdit, hotDel } from "@/api/workflow/count";
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
        action:  process.env.VUE_APP_PRODS_API + '/prodSer/uploadFile',
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
        // 是否展开，默认全部折叠
        isExpandAll: false,
        fileList: [],
        // 重新渲染表格状态
        refreshTable: true,
        // 查询参数
        queryParams2: {
          pageNum: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParams: {
          keyName:''
        },
        STypeOptions:[],
        // 表单参数
        form: {
          id: null,
          keyName: '',
          hotNum: 0,
          flag: 0,
          smallImg: null,
          url: null,
          linkUnit: '',
          del: null,
        },
        sClassification: [],
        sClassification2: [],
        // 表单校验
        rules: {
          // keyName: [
          //   { required: true, message: "名称不能为空", trigger: "blur" }
          // ],
          // url: [
          //   { required: true, message: "路径不能为空", trigger: "blur" }
          // ]
        }
      };
    },
    created() {
      this.getList({page:1,limit:10});
    },
    mounted() {

    },
    methods: {
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
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList({page:1,limit:10});
      },
      /** 查询菜单列表 */
     getList(data) {
      this.loading = true
      let list = []
      let str = 'pageNum='+data.page+'&pageSize='+data.limit
      if(this.queryParams.keyName){
        str = 'pageNum='+data.page+'&pageSize='+data.limit+'&keyName='+this.queryParams.keyName
      }
        getFlagList(str).then(response => {
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
        this.form = row
        this.open = true;
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          keyName: '',
          hotNum: 0,
          flag: 0,
          smallImg: null,
          url: null,
          linkUnit: '',
          del: null,
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
        //下载文件
        downLoadFile(url) {
          window.open(url)
        },
      /** 新增按钮操作 */
      handleAdd() {
        this.form = {
          id: null,
          keyName: '',
          hotNum: 0,
          flag: 0,
          smallImg: null,
          url: null,
          linkUnit: '',
          del: null,
        };
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
      handlePreview(url) {
        this.form.smallImg = url
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.title = "修改";
        this.isEdit = true
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
        //学科提交
        // if(!this.form.keyName || !this.form.url){
        //   alert('必填项未填！')
        //   loading.close()
        //   return
        // }
        if (this.title == "修改") {
          hotEdit(encode(this.form)).then(response => {
              this.$modal.msgSuccess("修改成功");
              loading.close()
              this.open = false;
              this.getList({
                  page: 1,
                  limit: 10
                });
            });
          } else {
              hotDataAdd(encode(this.form)).then(response => {
                this.$modal.msgSuccess("新增成功");
                loading.close()
                this.open = false;
                this.getList({
                  page: 1,
                  limit: 10
                });
              })
        }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$modal.confirm('是否确认删除'+row.keyName).then(function() {
          let par = {
          id: row.id
        }
          return hotDel(encode(par));
        }).then(() => {
          this.getList({
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
  