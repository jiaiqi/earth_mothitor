<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="技术服务名称" prop="menuName">
        <el-input
          v-model="queryParams.SName"
          placeholder="请输入技术服务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="技术服务类型" prop="status">
        <el-select v-model="queryParams.SType" placeholder="请选择技术服务类型" clearable>
          <el-option
            v-for="dict in prodOptions2"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系单位" prop="cUnit">
        <el-input
          v-model="queryParams.cUnit"
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
          v-hasPermi="['workflow:serve:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList({})"></right-toolbar>
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
      <el-table-column prop="SName" label="技术服务名称" :show-overflow-tooltip="true"></el-table-column>
      <!-- <el-table-column prop="sType2" label="产品类型" :show-overflow-tooltip="true"></el-table-column> -->
      <!-- <el-table-column prop="sClassification" label="服务分类" :show-overflow-tooltip="true"></el-table-column> -->
      <el-table-column prop="ssort" label="分类" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="cUnit" label="联系单位" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="mdate" label="更新时间" :show-overflow-tooltip="true"></el-table-column>






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
            v-hasPermi="['workflow:serve:index']"
          >详情</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['workflow:serve:edit']"
          >修改</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['workflow:serve:del']"
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
            <el-form-item label="技术服务名称" prop="SName">
              <el-input v-model="form.SName" :disabled="title == '详情'" placeholder="请输入技术服务名称" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="产品类型" prop="stype">
              <el-select v-model="form.stype" :disabled="title == '详情'" placeholder="请选择产品类型">
                <el-option v-for="item in prodOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="分类" prop="stype">
              <el-select v-model="form.sSort" :disabled="title == '详情'" placeholder="请选择分类">
                <el-option v-for="item in prodOptions2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="联系单位" prop="cUnit">
              <el-input v-model="form.cUnit" :disabled="title == '详情'" placeholder="请输入联系单位" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="20">
            <el-form-item label="服务分类" prop="sClassification">
                <el-input v-model="form.sClassification" :disabled="true" v-if="title == '详情'" placeholder="请输入服务分类" />
                <el-cascader v-else v-model="sClassification2" :options="menuOptions" :props="{ expandTrigger: 'hover' }"
                  placeholder="选择服务分类"></el-cascader>
            </el-form-item>
          </el-col> -->
          <el-col :span="36">
          <div style="border: 1px solid #ccc;margin-top: 20px;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
            <!-- {{form.sText}} -->
            <Editor ref="editor" style="height: 500px; overflow-y: hidden;" v-model="form.sText" :defaultConfig="editorConfig" :mode="mode"
              @onCreated="onCreated" />
          </div>
        </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                是否外链
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                组件路径
              </span>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item>
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
              <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                是否缓存
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">缓存</el-radio>
                <el-radio label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                显示状态
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in dict.type.sys_show_hide"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                菜单状态
              </span>
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
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
  import { delMenu, addMenu, updateMenu } from "@/api/system/menu";
  import { proSerlist, getHtml, listPage, serDel, addServe, editServe, getClassification } from "@/api/workflow/prods";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { IEditorConfig } from '@wangeditor/editor'
  import { encode, decode } from '@/utils/base/dataEncry.js';
  import { getUserProfile } from "@/api/system/user"
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
        prodOptions2: [],
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
          SName: '',
          SType: '',
          cUnit: '',
        },
        STypeOptions:[
          {
            value: 0,
            label: '产品服务'
          },
          {
            value: 1,
            label: '技术服务'
          },
        ],
        deptName: null,
        // 表单参数
        form: {
          id: '',
          SName: '',
          sType: 0,
          cUnit: '',
          sClassification: '',
          sText: '',
          sSort: ''
        },
        sClassification: [],
        sClassification2: [],
        menuOptions: [
          { value: '公众服务', label: '公众服务', children: [
            { value: '地震速报信息', label: '地震速报信息'},
            { value: '地震预警信息', label: '地震预警信息'},
            { value: '地震烈度信息', label: '地震烈度信息'},
            { value: '历史地震信息', label: '历史地震信息'},
            { value: '地震活动断层基础信息', label: '地震活动断层基础信息'},
            { value: '地震风险区划基础信息', label: '地震风险区划基础信息'},
            { value: '防震减灾科学普及', label: '防震减灾科学普及'},
          ]},
          { value: '专业服务', label: '专业服务', children: [
            { value: '强震动观测', label: '强震动观测'},
            { value: '专用地震监测台网建设和运维', label: '专用地震监测台网建设和运维'},
            { value: '地震预警', label: '地震预警'},
            { value: '地震活动断层探察', label: '地震活动断层探察'},
            { value: '地震灾害风险评估', label: '地震灾害风险评估'},
            { value: '建设工程安全监测与健康诊断', label: '建设工程安全监测与健康诊断'},
            { value: '地震现场建筑物调查评估和安全鉴定技术服务', label: '地震现场建筑物调查评估和安全鉴定技术服务'},
            { value: '房屋设施加固技术服务', label: '房屋设施加固技术服务'},
            { value: '减隔震技术服务', label: '减隔震技术服务'},
          ]},
          { value: '决策服务', label: '决策服务', children: [
            { value: '地震速报信息', label: '地震速报信息'},
            { value: '地震灾害快速评估', label: '地震灾害快速评估'},
            { value: '地震烈度信息', label: '地震烈度信息'},
            { value: '地震烈度信息', label: '地震烈度信息'},
            { value: '震后趋势研判', label: '震后趋势研判'},
            { value: '短期地震预测', label: '短期地震预测'},
            { value: '年度地震危险区信息', label: '年度地震危险区信息'},
            { value: '地震重点监视防御区信息', label: '地震重点监视防御区信息'},
            { value: '地震灾害损失评估和恢复重建技术建议', label: '地震灾害损失评估和恢复重建技术建议'},
            { value: '地质灾害和其它地面震动事件监测信息', label: '地质灾害和其它地面震动事件监测信息'}
          ]},
          { value: '专项服务', label: '专项服务', children: [
            { value: '地震安全保障服务', label: '地震安全保障服务'},
            { value: '“一带一路”地震灾害风险防治技术服务', label: '“一带一路”地震灾害风险防治技术服务'}
          ]},
        ],
        // 表单校验
        rules: {
          SName: [
            { required: true, message: "名称不能为空", trigger: "blur" }
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
      let taskId = this.$route.query.taskId
      this.getPageList({
        page: 1,
        limit: 10,
        taskId: taskId
      });
      this.getUserDept()
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
      getPageList(data) {
        this.menuList = []
        let list = []
        let info = {
          pageNum: data.page,
          pageSize: data.limit,
          sort: this.queryParams.SType
        }
        if(data.taskId){
          info = {
            pageNum: 1,
            pageSize: 9999,
            taskId: data.taskId
          }
        }
        listPage(info).then(response => {
            list = response.records

          console.log(list)
            this.total = response.total
            this.loading = false;
            // this.queryParams2.pageSize = response.size;
            // this.queryParams2.pageNum = response.current;
            //字段替换
            list.forEach((item,index) => {
              item.cUnit = item.cunit
              item.sClassification = item.sclassification
              item.SName = item.sname
              item.sText = item.stext
              item.sSort = item.ssort
              // if(item.stype == 0) {
              //   item.sType2 = '产品服务'
              // }else if(item.stype == 1) {
              //   item.sType2 = '技术服务'
              // }else {
                // list[index].splice(index,1)
              // }
            this.menuList = list;
          })
        });
        getClassification().then(res=>{
          this.prodOptions2 = res.filter(itm=>{return itm.type == 2}).map(item=>{
              return {
                value: item.classification,
                label: item.classification
              }
          })
        })
      },
      uploadImg() {
        // 修改 uploadImage 菜单配置

      },
      /** 查询菜单列表 */
     getList(data) {
      listPage(data).then(response => {
          this.loading = false;
          this.queryParams2.pageSize = response.size;
          this.queryParams2.pageNum = response.current;
          this.total = response.total;
          let list = response.records
          //字段替换
          list.forEach((item,index) => {
            item.cUnit = item.cunit
            item.sClassification = item.sclassification
            item.SName = item.sname
            item.sText = item.stext
            item.sSort = item.ssort
          })
          this.menuList = list;
        });
        // proSerlist(encode(data)).then(response => {
        //   this.loading = false;
        //   this.menuList = decode(response);
        //   this.menuList.forEach((item)=>{
        //     if(item.sType == 0) {
        //       item.sType2 = '产品服务'
        //     }
        //     if(item.sType == 1) {
        //       item.sType2 = '技术服务'
        //     }
        //   })
        //   //字段替换
        //   this.menuList.forEach((item,index) => {
        //     item.ssort = item.sSort
        //   })
        // });
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
        this.$nextTick(()=>{
          getHtml(encode(par)).then(response => {
            this.form.sText = response;
            this.open = true;
          });
        })
      },
      // 表单重置
      reset() {
        this.form = {
          id: '',
          SName: '',
          sType: 0,
          cUnit: '',
          sClassification: [],
          sClassification2: [],
          sText: '',
          sSort: ''
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        let par = {
          sort: this.queryParams.SType
        }
        if(this.queryParams.SName != ''){
          par.name = this.queryParams.SName
        }
        if(this.queryParams.cUnit != ''){
          par.unit = this.queryParams.cUnit
        }
        par.pageNum = 1
        par.pageSize = 10
        this.getList(par);
      },
      getUserDept() {
        getUserProfile().then((res) => {
            this.deptName = res.data.dept.deptName
        })
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams = {
          SName: '',
          SType: '',
          cUnit: ''
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
        this.sClassification2 = [row.sClassification.split('/')[0],row.sClassification.split('/')[1]]
        this.title = "修改";
        this.isEdit = true
        let par = {
          id: row.id
        }
        this.form = row
        this.$nextTick(()=>{
          getHtml(encode(par)).then(response => {
            this.form.sText = response;
            this.open = true;
          });
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        if(this.form.SName == ''){
          return
        }
        if (this.title == "修改") {
            editServe(encode(this.form)).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getPageList({
                page: 1,
                limit: 10
              });
            });
          } else {
            // this.form.sClassification = this.sClassification[0] + '/' + this.sClassification[1]
            // this.form.sType = this.form.stype
            let par = {
              title: this.form.SName,
              disciplineKey: '技术服务',
              creator: this.$store.state.user.name,
              unitName: this.deptName
            }
            quickAdd(par).then(res=>{
              this.form.auditTaskId = res
              addServe(encode(this.form)).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getPageList({
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
          return serDel(encode(par));
        }).then(() => {
          this.getPageList({
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
