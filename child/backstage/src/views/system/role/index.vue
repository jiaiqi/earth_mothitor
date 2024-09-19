<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入权限字符"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
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
          v-hasPermi="['system:role:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
          >删除</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
          >导出</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <el-table-column
        label="角色名称"
        prop="roleName"
        :show-overflow-tooltip="true"
        width="200"
      />
      <el-table-column
        label="权限字符"
        prop="roleKey"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column label="显示顺序" prop="roleSort" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
      <!-- 订单管理员与系统管理员禁止删除 -->
        <template slot-scope="scope" v-if="!stableRole.includes(scope.row.roleId)">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            >删除</el-button
          >
          <el-dropdown
            size="mini"
            @command="(command) => handleCommand(command, scope.row)"
            v-hasPermi="['system:role:edit']"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="handleAPI"
                icon="el-icon-circle-check"
                v-hasPermi="['system:role:edit']"
              >
                API权限
              </el-dropdown-item>
              <el-dropdown-item
                command="handleURL"
                icon="el-icon-circle-check"
                v-hasPermi="['system:role:edit']"
              >
                URL权限
              </el-dropdown-item>
              <el-dropdown-item
                command="handleDataScope"
                icon="el-icon-circle-check"
                v-hasPermi="['system:role:edit']"
              >
                数据权限
              </el-dropdown-item>
              <el-dropdown-item
                command="handleExamine"
                icon="el-icon-document"
                v-hasPermi="['system:role:edit']"
              >
                审核权限
              </el-dropdown-item>
              <el-dropdown-item
                command="handleAuthUser"
                icon="el-icon-user"
                v-hasPermi="['system:role:edit']"
              >
                分配用户
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <span slot="label">
            <el-tooltip
              content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
            权限字符
          </span>
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number
            v-model="form.roleSort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色API URL权限对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="openDataScope"
      width="600px"
      append-to-body
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item :label="title.slice(2)">
          <!-- <tre-transfer
            :data="deptOptions"
            :defaultProps="defaultProps"
            :toData="toData"
            @forParent="keyarr"
          ></tre-transfer> -->
          <tree-transfer
            v-loading="loading1"
            :title="treetitle"
            :from_data="deptOptions"
            :to_data="toData"
            :defaultProps="{ label: 'name' }"
            :mode="mode"
            @add-btn="add"
            @remove-btn="remove"
            height="280px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色审核权限对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="openDataScope1"
      width="600px"
      append-to-body
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item :label="title.slice(2)+'配置'">
          <!-- <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox> -->
          <div style="margin: 15px 0"></div>
          <el-cascader
          :options="cities"
          :props="props"
          @visible-change="visibleChange"
          @change="handleCheckedCitiesChange"
          clearable></el-cascader>
          <!-- <el-checkbox-group
            v-loading="loading1"
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox v-for="item in cities" :checked="checkAll" :key="item.disciplineId" :label="item.disciplineKey">{{
              item.disciplineKey
            }}</el-checkbox>
          </el-checkbox-group> -->
        </el-form-item>
        <el-form-item label="已拥有">
          <!-- <el-checkbox-group
            v-model="checkedCities1"
            @change="checkedCitiesChange"
          > -->
          <el-tabs v-model="selType">
            <el-tab-pane label="学科" name="sub">
              <el-tag
                :key="item.disciplineId"
                v-for="item in checkList"
                closable
                :disable-transitions="false"
                @close="handleClose(item)">
                {{item.disciplineKey}}
              </el-tag>
            </el-tab-pane>
            <el-tab-pane label="学科单位" name="dept">
              <div style="height:360px;overflow-y: auto;">
                <el-tag
                  :key="item.auditDepartmentId"
                  v-for="item in deptCheckList"
                  closable
                  :disable-transitions="false"
                  @close="handleClose2(item.auditDepartmentId)">
                  {{item.disciplineKey + '/' + item.departmentName}}
                </el-tag>
              </div>
            </el-tab-pane>
          </el-tabs>
            <!-- <el-checkbox
              v-for="item in checkList"
              :key="item.disciplineId"
              :label="item.disciplineKey"
            >
              {{ item.disciplineKey }}
            </el-checkbox> -->
          <!-- </el-checkbox-group> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope1">确 定</el-button>
        <el-button @click="cancelDataScope1">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAuditmodel } from '@/api/workflow/auditmodel'
import { encode, decode } from '@/utils/base/dataEncry.js'
import treeTransfer from 'el-tree-transfer' // 引入
import { getRoleAndDepPower, setRoleAndDepPower, auditDepDel, linkRoleDept } from '@/api/workflow/audit'
import {
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  // dataScope,
  roleauditList,
  editRoleaudit,
  addRoleaudit,
  changeRoleStatus
} from '@/api/system/role'
import { getIdList, setRoleAudit } from '@/api/workflow/audit'
import {
  treeselect as menuTreeselect,
  roleMenuTreeselect
} from '@/api/system/menu'
import {
  treeselect as deptTreeselect,
  roleDeptTreeselect,
  listDept
} from '@/api/system/dept'
import { apiListData, urlListData } from '@/api/system/dict/data'
import {
  addApi,
  addUrl,
  listUrl,
  listApi,
  removeApi,
  removeUrl
} from '@/api/system/urlapi'

export default {
  name: 'Role',
  dicts: ['sys_normal_disable'],
  components: { treeTransfer },
  data() {
    return {
      // 用户权限遮罩层
      loading1: true,
      treetitle: ['权限列表', '授权列表'],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      props: {
        lazy: true,
        multiple: true,
        children: 'children',
        label: 'disciplineKey',
        value: 'disciplineId',
        lazyLoad: this.lazyLoad
      },
      // 用户审核权限
      checkList: [], // 已授权
      checkedCities1: [],
      openDataScope1: false, // 弹框的开启关闭
      checkAll: false, // 是否全选
      checkedCities: [], // 选中的数据
      checkList2: [],
      cities: [], // 数据
      allAuthList: [],
      isIndeterminate: true,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 菜单列表
      menuOptions: [],
      // 权限列表
      deptOptions: [],
      // 添加的权限列表
      toData: [],
      //不能删除和修改的角色id
      stableRole: [1,112,114],
      mode: 'transfer',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      roleId: null,
      selType: 'sub',
      // 表单参数
      form: {},
      removeIds: [],
      allDeptList: [],
      //已选的权限列表
      selectAuth: [],
      //学科单位
      deptCheckList: [],
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // 示例用法
    // let array1 = [[2,204],[2,205],[3,212],[3,213],[6,214]];
    // let array2 = [{
    //   key: 204,
    //   deptName: '北京市地震局'
    // },
    // {
    //   key: 205,
    //   deptName: '山东地震局'
    // },
    // {
    //   key: 212,
    //   deptName: '广东地震局'
    // },{
    //   key: 213,
    //   deptName: '佛山市地震局'
    // },{
    //   key: 214,
    //   deptName: '上海市地震局'
    // }]
    // let result = this.processArray(array1,array2);
    // console.log(result);
  },
  methods: {
    // 给角色的权限
    keyarr(val) {
      this.toData = val
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.roleList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },
    lazyLoad(node, resolve) {
      this.getDeptList2(node.value).then(res=>{
        let deptList = [...this.allDeptList]
            deptList.forEach(item=>{
              item.disciplineId = item.deptId
              item.disciplineKey = item.deptName,
              item.leaf = true
            })
            resolve(deptList)
      })
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then((response) => {
        this.menuOptions = response.data
      })
    },
    /** 查询单位树结构 */
    getDeptTreeselect() {
      deptTreeselect().then((response) => {
        this.deptOptions = response.data
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then((response) => {
        this.menuOptions = response.menus
        return response
      })
    },
    /** 根据角色ID查询单位树结构 */
    getRoleDeptTreeselect(roleId) {
      return roleDeptTreeselect(roleId).then((response) => {
        this.deptOptions = response.depts
        return response
      })
    },
    // 根据角色ID查询api树结构
    getRoleApi() {
      return apiListData({}).then((response) => {
        let res = this.settree(this.quchong(response.rows))
        this.deptOptions = res
        return res
      })
    },
    //
    // 根据角色ID查询url树结构
    getRoleUrl() {
      return urlListData({}).then((response) => {
        let res = this.settree(this.quchong(response.rows))
        this.deptOptions = res
        return res
      })
    },
    // 查询已授权列表
    getListApi(roleId) {
      listApi({ roleId: roleId }).then((response) => {
        this.toData = this.settree(this.quchong(response.rows))
        return response
      })
    },
    getListUrl(roleId) {
      listUrl({ roleId: roleId }).then((response) => {
        this.toData = this.settree(this.quchong(response.rows))
        return response
      })
    },
    // 去重
    quchong(arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i].name === arr[j].name) {
            arr.splice(j, 1)
            j--
          }
        }
      }
      return arr
    },
    handleClose2(id) {
      auditDepDel(encode({id:id}))
      this.deptCheckList.forEach((item,index)=>{
        if(item.auditDepartmentId == id){
          this.deptCheckList.splice(index,1)
        }
      })
    },
    handleClose(itm) {
      this.checkList.forEach((item,index)=>{
        if(itm.disciplineId == item.disciplineId){
          this.checkList.splice(index,1)
        }
      })
    },
    getDeptList2(id) {
      let par = {
        roleId: this.roleId,
        disciplineId: id
      }
      return new Promise((resolve,reject)=>{
        listDept().then(resp=>{
          console.log(resp.data)
          this.allDeptList = resp.data.slice(4)
          this.allDeptList.unshift(...resp.data.slice(0,1))
          console.log(this.allDeptList)
          // resolve()
          getRoleAndDepPower(encode(par)).then(res=>{
            resolve(res)
          })
        })
      })
    },
    // 转为树结构
    settree(list) {
      let api0 = list.filter((item) => item.parentid === 0 || item.level === 0)
      api0.forEach((item) => {
        item.children = []
      })
      for (let i = 0; i < api0.length; i++) {
        if (api0[i].id) {
          list.forEach((item) => {
            item.pid = item.parentid
            const id = item.parentid
            if (id === api0[i].id) {
              api0[i].children.push(item)
            }
          })
        } else {
          list.forEach((item) => {
            item.pid = item.level
            // item.id = index + 1
            if (item.level === api0[i].parentid) {
              api0[i].children.push(item)
            }
          })
        }
      }
      return api0
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$modal
        .confirm('确认要"' + text + '""' + row.roleName + '"角色吗？')
        .then(() => {
          return changeRoleStatus(row.roleId, row.status)
        })
        .then(() => {
          this.$modal.msgSuccess(text + '成功')
        })
        .catch(() => {
          row.status = row.status === '0' ? '1' : '0'
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 取消按钮（API URL权限）
    cancelDataScope() {
      this.openDataScope = false
      this.loading1 = true
      this.deptOptions = []
      this.toData = []
      this.reset()
    },
    //  取消按钮（审核权限）
    cancelDataScope1() {
      this.openDataScope1 = false
      this.loading1 = true
      this.cities = []
      this.checkList = []
      this.checkedCities1 = []
      this.checkedCities = []
      this.reset()
    },
    // 审核权限全选按钮
    handleCheckAllChange(val) {
      this.checkAll = val
      if(val){
        this.checkList = this.allAuthList
      }
      this.checkedCities = val ? this.cities : []
      this.isIndeterminate = false
    },
    // 审核权限 单选按钮
    handleCheckedCitiesChange(value) {
      this.selectAuth = value
      // console.log(value)
    },
    visibleChange(show) {
      let deptList = this.selectAuth.map(item=>{
        return item[1]
      })
      let subList = this.selectAuth.map(item=>{
        return item[0]
      })
      let subList2 = []
      // console.log(deptList)
      subList2 = Array.from(new Set(Array.from(subList)))
      this.checkList = [...this.checkList2]
      this.allAuthList.forEach(item=>{
        if(subList2.includes(item.disciplineId)){
          this.checkList.push(item)
        }
      })
      let arr = this.processArray(this.selectAuth)
      arr.map(item=>{
        let deptlist = []
        item.list.forEach(i=>{
          this.allDeptList.map(it=>{
            if(it.deptId == i){
              deptlist.push({
                departmentId: i,
                departmentName: it.deptName
              })
            }
          })
        })
        let par = { roleId:this.roleId, disciplineId:item.key, depList: deptlist }
        setRoleAndDepPower(encode(par)).then(res=>{
          console.log(res)
        })
      })
    },
    processArray(array) {
      let result = [];
      
      // 遍历数组
      for (let i = 0; i < array.length; i++) {
        let key = array[i][0];
        let value = array[i][1];
        
        // 检查是否已经存在对应的key
        let index = result.findIndex(item => item.key === key);
        if (index === -1) {
          // 如果不存在，则创建一个新的对象
          let obj = {
            key: key,
            list: [value]
          };
          result.push(obj);
        } else {
          // 如果存在，则将value添加到对应key的list中
          result[index].list.push(value);
        }
      }
      
      return result;
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.menuExpand = false
      this.menuNodeAll = false
      this.deptExpand = true
      this.deptNodeAll = false
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: '0',
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'handleAPI':
          this.handleAPI(row)
          break
        case 'handleURL':
          this.handleURL(row)
          break
        case 'handleDataScope':
          this.handleDataScope(row)
          break
        case 'handleAuthUser':
          this.handleAuthUser(row)
          break
        case 'handleExamine':
          this.handleExamine(row)
          break
        default:
          break
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.getMenuTreeselect()
      this.open = true
      this.title = '添加角色'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const roleId = row.roleId || this.ids
      const roleMenu = this.getRoleMenuTreeselect(roleId)
      getRole(roleId).then((response) => {
        this.form = response.data
        this.open = true
        this.$nextTick(() => {
          roleMenu.then((res) => {
            let checkedKeys = res.checkedKeys
            checkedKeys.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false)
              })
            })
          })
        })
        this.title = '修改角色'
      })
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if (value !== '2') {
        this.$refs.dept.setCheckedKeys([])
      }
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset()
      this.toData = []
      // const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId)
      getRole(row.roleId).then((response) => {
        this.form = response.data
        this.defaultProps.label = 'label'
        this.openDataScope = true
        this.title = '分配数据权限'
      })
    },
    getDeptList() {
      let par = {
        roleId: this.roleId
      }
      linkRoleDept(encode(par)).then(res=>{
        this.deptCheckList = decode(res)
      })
    },
    /** 分配用户操作 */
    handleAuthUser(row) {
      const roleId = row.roleId
      this.$router.push('/system/role-auth/user/' + roleId)
    },
    // 分配审核权限
    handleExamine(row) {
      this.reset()
      this.toData = []
      // console.log(row)
      this.roleId = row.roleId
      this.form.roleName = row.roleName
      this.getDeptList()
      getIdList(row.roleId).then((response) => {
        this.cities = response.filter(item => {
          return item.roleFlag == 0
        })
        this.checkList = response.filter(item => {
          return item.roleFlag == 1
        })
        this.checkList2 = this.checkList
        this.allAuthList = response
        // this.form = response.data
        // 打开分派权限弹框
        this.openDataScope1 = true
        // 关闭遮罩层
        this.loading1 = false
        this.title = '分配审核权限'
      })
      // console.log(this.cities)
      // 获取所有审核权限
      // getAuditmodel(encode({})).then((res) => {
      //   let list = decode(res.data)
      //   this.cities = list
      //   this.loading1 = false
      // })
    },
    // 修改已拥有权限
    checkedCitiesChange(val) {
      let list = this.checkList.filter(
        (item) => !val.some((ele) => ele.dataType === item.dataType)
      )
      list.forEach((item) => {
        editRoleaudit(item.id).then((res) => {
          // console.log(res)
        })
      })
      this.checkList = val
    },
    // 分配api权限
    handleAPI(row) {
      this.reset()
      this.toData = []
      this.getRoleApi()
      this.getListApi(row.roleId)
      getRole(row.roleId).then((response) => {
        this.form = response.data
        // this.defaultProps.label = 'name'
        this.openDataScope = true
        this.title = '分配API权限'
        this.loading1 = false
        if (this.toData.length > 0) {
          this.deptOptions.forEach((item) => {})
          // console.log(this.toData, 1)
        }
      })
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      let remve = obj.nodes
      for (let i = 0; i < remve.length; i++) {
        this.removeIds.push(remve[i].uid)
      }
      if (this.title === '分配API权限') {
        removeApi(this.removeIds).then((res) => {
          this.$modal.msgSuccess('权限移除成功')
          this.this.removeIds = []
        })
      } else if (this.title === '分配URL权限') {
        removeUrl(this.removeIds).then((res) => {
          this.$modal.msgSuccess('权限移除成功')
          this.this.removeIds = []
        })
      }
      // console.log("fromData:", fromData)
      // console.log("toData:", toData)
      // console.log("obj:", obj)
    },
    // 分配URL权限
    handleURL(row) {
      this.reset()
      this.toData = []
      this.getRoleUrl()
      this.getListUrl(row.roleId)
      getRole(row.roleId).then((response) => {
        this.toData = response
        this.defaultProps.label = 'name'
        this.openDataScope = true
        this.loading1 = false
        this.title = '分配URL权限'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.roleId !== undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            updateRole(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            addRole(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },

    /** 提交按钮（API URL权限） */
    submitDataScope() {
      if (this.form.roleId !== undefined) {
        let roleId = this.form.roleId
        if (this.title === '分配API权限') {
          let api = this.toData
          let apis = {}
          let list = []
          for (let i = 0; i < api.length; i++) {
            if (api[i].record !== 0) {
              apis.roleId = roleId
              apis.apiarr = []
              for (let j = 0; j < api[i].children.length; j++) {
                if (api[i].children[j].record !== 0) {
                  let obj = {}
                  obj.name = api[i].children[j].name
                  obj.api = api[i].children[j].api
                  apis.apiarr.push(obj)
                }
              }
              apis.name = api[i].name
              // apis.id = api[i].id
              apis.parentid = api[i].id

              list[i] = apis
              apis = {}
            }
          }
          list = list.filter((item) => item !== null)
          addApi(list).then((res) => {
            this.$modal.msgSuccess('权限分配成功')
            this.openDataScope = false
            this.getList()
          })
        } else if (this.title === '分配URL权限') {
          let url = this.toData
          let urls = {}
          let list = []
          for (let i = 0; i < url.length; i++) {
            if (url[i].record !== 0) {
              urls.roleId = roleId
              urls.urlarr = []
              for (let j = 0; j < url[i].children.length; j++) {
                if (url[i].children[j].record !== 0) {
                  let obj = {}
                  obj.name = url[i].children[j].name
                  obj.api = url[i].children[j].url
                  urls.urlarr.push(obj)
                }
              }
              urls.name = url[i].name
              // apis.id = api[i].id
              urls.parentid = url[i].id

              list[i] = urls
              urls = {}
            }
          }
          list = list.filter((item) => item !== null)
          addUrl(list).then((res) => {
            this.$modal.msgSuccess('权限分配成功')
            this.openDataScope = false
            this.getList()
          })
        }
      }
    },
    // 提交审核权限
    submitDataScope1() {
      let par = ''
      this.checkList.forEach((item,index)=>{
        if(index != this.checkList.length - 1){
          par = par + item.disciplineId +':'+ item.disciplineKey + '-'
        }else{
          par = par + item.disciplineId +':'+ item.disciplineKey + '&roleId=' + item.roleId
        }
      })
      setRoleAudit(par).then(res=>{
        this.openDataScope1 = false
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids
      this.$modal
        .confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？')
        .then(() => {
          return delRole(roleIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'system/role/export',
        {
          ...this.queryParams
        },
        `role_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.el-transfer {
  display: flex;
  .el-transfer__buttons {
    padding: 0 10px !important;
  }
}
.el-button + .el-button {
  margin-left: 0 !important;
}
</style>
