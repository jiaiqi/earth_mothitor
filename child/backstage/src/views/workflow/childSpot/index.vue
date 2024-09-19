<template>
    <div class="app-container">
        <div>
            <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                style="margin:15px 0px"
                v-hasPermi="['workflow:childSpot:add']"
            >新增</el-button>
            <el-table
                v-loading="loading"
                :data="list"
            >
        <el-table-column prop="unit" label="子站名称(单位)" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="cTime" label="创建时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              {{ new Date(scope.row.cTime).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="rtf1" label="省/自治区/直辖市" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="handleInfo(scope.row)"
              v-hasPermi="['workflow:childSpot:check']"
            >详情</el-button>
            <el-button 
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['workflow:childSpot:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['workflow:childSpot:delete']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
              @pagination="getList" />
        </div>
        <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1280px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="子站名称(单位)：" prop="unit">
              <el-input v-model="form.unit" :disabled="title == '详情'" placeholder="请输入子站名称" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="省/自治区/直辖市" prop="unit">
              <el-input v-model="form.rtf1" :disabled="title == '详情'" placeholder="请输入省/自治区/直辖市" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="form.remark" :disabled="title == '详情'" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="36">
          <div style="border: 1px solid #ccc;margin-top: 20px;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor2" :defaultConfig="toolbarConfig2" :mode="mode" />
            <Editor ref="editor" style="height: 500px; overflow-y: hidden;" v-model="form.rtf1" :defaultConfig="editorConfig" :mode="mode"
              @onCreated="onCreated2" />
          </div>
        </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" v-if="title != '详情'" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="reset">重 置</el-button>
      </div>
    </el-dialog>
    </div>
</template>
<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IEditorConfig } from '@wangeditor/editor';
import IconSelect from "@/components/IconSelect";
import { childSpotList, childSpotAdd, childSpotEdit, childSpotDel } from "@/api/workflow/order";
import { encode, decode } from '@/utils/base/dataEncry.js';
  export default {
    components: { IconSelect, Editor, Toolbar },
    data() {
      return {
        editor: null,
        editor2: null,
        toolbarConfig: { },
        toolbarConfig2: { },
        list: [],
        total: 0,
        loading: true,
        richText: '',
        mode: 'default', // or 'simple'
        activeNames: '',
        open: false,
        title: '',
        queryParams: {
            pageNum: 1,
            pageSize: 10,
        },
        form: {
            id: null,
            unit: '',
            cTime: '',
            rtf1: '',
            rtf2: '',
            remark: ''
        },
        editorConfig: {
            placeholder: "请输入内容...",
            MENU_CONF: {
                // 配置上传图片
                uploadImage: {
                    server: process.env.VUE_APP_PRODS_API + '/prodSer/uploadImage',
                    fieldName: 'file'
                }
            }
        },
      }
    },
    mounted() {
        this.getList({page:1,limit:10})
    },
    methods: {
        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        onCreated2(editor) {
            this.editor2 = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        getList(page) {
          this.loading = true
            childSpotList(encode({pageNum:page.page, pageSize: page.limit})).then(res=>{
                this.list = [...res.records]
                this.total = res.total
                this.loading = false
            })
        },
        handleAdd() {
            this.open = true
            this.form = {
                id: null,
                unit: '',
                cTime: '',
                rtf1: '',
                rtf2: '',
                remark: ''
            }
            this.title = '新增'
        },
        save() {

        },
        submitForm() {
            this.open = false;
            this.loading = true;
            if(this.title == '新增'){
                childSpotAdd(encode(this.form)).then(res=>{
                    this.$modal.msgSuccess("新增成功");
                    this.getList({
                        page: 1,
                        limit: 10
                    });
                })
            }
            if(this.title == '修改'){
                childSpotEdit(encode(this.form)).then(res=>{
                    this.$modal.msgSuccess("修改成功");
                    this.getList({
                        page: 1,
                        limit: 10
                    });
                })
            }
        },
        reset() {

        },
        handleDelete(row) {
            this.$modal.confirm('是否确认删除' + row.unit).then(function() {
                let par = {
                    id: row.id
                }
                return childSpotDel(encode(par));
            }).then(() => {
                this.getList({
                    page: 1,
                    limit: 10
                });
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleInfo(row) {
            this.form = {...row}
            this.title = '详情'
            this.open = true
        },
        handleUpdate(row) {
            this.form = {...row}
            this.title = '修改'
            this.open = true
        },
        handleChange(e) {
            let data = {}
            this.list.forEach(item=>{
                if(item.id == e){
                    data = {...item}
                }
            })
            this.form.id = data.id
            this.form.unit = data.unit
            this.form.cTime = data.cTime
            this.form.rtf1 = data.rtf1
            this.form.rtf2 = data.rtf2
            this.form.remark = data.remark
        }
    }
}

</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.row {
    width: 500px;
    display: flex;
    justify-content: space-between;
    padding: 10px 0px;
}
</style>