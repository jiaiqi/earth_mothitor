<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="文件名称" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          placeholder="请输入文件名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="发起人" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入发起人"
          clearable
        />
      </el-form-item>
      <el-form-item v-if="auth == 99" label="审批状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择审批状态" @change="getAuditInfo({page:1,limit:10})" clearable>
            <el-option
              v-for="dict in statusList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
      </el-form-item>
      <el-form-item  label="学科" prop="subject_id">
        <el-select v-model="queryParams.subject_id" placeholder="请选择学科" @change="getAuditInfo({page:1,limit:10})" clearable>
            <el-option
              v-for="dict in disciplineList"
              :key="dict.id"
              :label="dict.sname"
              :value="dict.id"
            />
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <right-toolbar @queryTable="getAuditInfo({page:1,limit:10});"></right-toolbar>
    <el-dialog
      title="审批信息"
      :visible.sync="dialogVisible"
      width="40%">
      <el-dialog
        width="30%"
        title="审核记录"
        :visible.sync="innerVisible"
        append-to-body>
        <div v-html="text"></div>
      </el-dialog>
      <div style="display:flex">
        <span>审批意见：</span>
        <el-input
          type="textarea"
          placeholder="请输入审批意见"
          v-model="opinion"
          rows="3"
          style="width:80%;"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button size="small" @click="openHistory">审核记录</el-button> -->
        <el-button type="primary" size="medium" @click="approval(1)">通 过</el-button>
        <el-button v-if="nodeType == 1" type="warning" size="medium" @click="approval(2)">驳回</el-button>
        <!-- <el-button type="primary" size="medium" @click="approval(2)">拟通过</el-button> -->
        <el-button v-else type="warning" size="medium" @click="approval(2)">驳 回</el-button>
        <el-button size="medium" @click="approval(4)">关 闭</el-button>
      </span>
    </el-dialog>
    <div class="container">
      <div class="main">
    <div>
      <el-button type="success" size="small" @click="getHisList">审批历史</el-button>
      <div class="approval">
        <el-table
        v-loading="loading"
          :data="tableData"
          style="width: 100%;">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="realName"
            width="300"
            label="文件名">
            <template slot-scope="scope">
              <div style="color: #409EFF;cursor: pointer;" @click="toInfo(scope.row)">{{ scope.row.realName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="uploader"
            label="发起人">
          </el-table-column>
          <el-table-column
            prop="uploadDepartment"
            label="上传单位">
          </el-table-column>
          <el-table-column
            prop="uploadTime"
            width="170"
            label="创建时间">
            <template slot-scope="scope">
              <div>{{ new Date(scope.row.uploadTime).toLocaleString() }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="disciplineKey"
            label="学科">
          </el-table-column>
          <el-table-column
            prop="auditState"
            width="120"
            label="状态">
            <template slot-scope="scope">
              <el-tag :type="(scope.row.auditState >= 99)? 'success' : scope.row.auditState == -1?'danger': 
              (scope.row.auditState == 1||scope.row.auditState == 10||scope.row.auditState == 20) ?'' : 'warning'"
                style="font-weight:bold">
                {{ scope.row.auditState | auditStates }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            width="360"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.auditState >= 1 && scope.row.auditState < 99" @click="check(scope.row,1)" type="primary" size="small">审核</el-button>
              <el-button v-hasPermi="['workflow:tasks:approvalInfo']" type="info" size="small" @click="toInfo(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="pages.pageNum" :limit.sync="pages.pageSize"
              @pagination="getAuditInfo" />
      </div>
    </div>
  </div>
  </div>
   <el-dialog
      title="审批历史"
      :visible.sync="dialogVisible2"      
      width="70%">
      <approvalHis
      ref="approvalHis"
      :userName="userName"> 
      </approvalHis>
    </el-dialog>
     <el-dialog
      title="审批任务详情"
      :visible.sync="dialogVisible3"
      width="70%">
        <approvalInfo
         ref="approvalInfo"
      :data="data"> 
      </approvalInfo>
    </el-dialog>
  </div>

   
</template>

<script>
import { excelfileList, excelCreate, excelRemove, excelUpdate, setAuditState, getJobList, addAuditLog } from '@/api/dataup/criterion.js'
import { getAuditList, editStatus, addAuditRecord, passTask, getRoleAndDepPower, setRoleAndDepPower } from '@/api/workflow/audit'
import { encode, decode } from '@/utils/base/dataEncry.js';
import { listUser, getAuthRole } from '@/api/system/user'
import { getIdList } from '@/api/workflow/audit' 
import  approvalHis  from '@/views/components/task/approvalHis'
import  approvalInfo from '@/views/components/task/approvalInfo'

export default {  
  components: { approvalHis, approvalInfo },
  data() {
    return {
      dialogVisible: false,
      dialogVisible2:false,
      dialogVisible3:false,
      innerVisible: false,
      loading: true,
      id: null,
      opinion: '',
      text: '', // 审核记录
      showIfr: false,
      selIndex: 1,
      total: 0,
      //当前用户角色列表
      roleList: [],
      //当前用户拥有的学科审批权限列表
      hasSubList: [],
      pages: {
        pageNum: 1,
        pageSize: 10
      },
      queryParams: {
        taskName: '',
        status: null,
        userName: '',
      },
      statusList: [
        // {
        //   label: '未提交',
        //   value: 0
        // },
        {
          label: '提交审核',
          value: 1
        },
        {
          label: '一审驳回',
          value: -10
        },
        {
          label: '二审驳回',
          value: -20
        },
        {
          label: '三审驳回',
          value: -30
        },
        {
          label: '一审通过',
          value: 10
        },
        {
          label: '二审通过',
          value: 20
        },
        {
          label: '三审通过',
          value: 30
        },
        {
          label: '审核完成',
          value: 99
        },
        {
          label: '已分发',
          value: 100
        } 
      ],
      disciplineList: [ 
      ],
      approContrl1: false,
      approContrl2: false,
      approContrl3: false,
      auth: null,
      data: {},
      nodeType: '', //点击审批时的类型
      userid: null,
      userName: null,
      userDept: null,
      subjectList: [],
      //单位审核权限
      deptAuthList: [],
      tableData: [],
      hisRecord: []
    }
  },
   beforeCreate () {

    this.$options.components.approvalInfo = require('@/views/components/task/approvalInfo').default ;
    this.$options.components.approvalHis = require('@/views/components/task/approvalHis').default 

  },

 
  components: {},
  watch: {},
  computed: {},
  filters: {
    auditStates(val) {
      if(val == -10) return '一审驳回'
      if(val == -20) return '二审驳回'
      if(val == -30) return '三审驳回'
      if(val == 0) return '未提交'
      if(val == 1) return '提交审核'
      if(val == -1) return '被驳回'
      if(val == 10) return '一审通过'
      if(val == 20) return '二审通过'
      if(val == 99) return '审核完成'
      if(val == 100) return '已分发'
    }
  },
  mounted() {
    // this.getPageList({
    //   pageNum: 1,
    //   pageSize: 15
    // })
    // console.log(this.$store.state.user)
    this.subjectList = JSON.parse(sessionStorage.getItem('subjectArr'))   
    this.disciplineList=this.subjectList.filter(a=>a.typeId ===1);
    //超级管理员或查看全部的权限
    if(this.$store.state.user.permissions[0] == '*:*:*' || this.$store.state.user.permissions.includes('workflow:tasks:approval:checkAll')){
      //管理员拥有所有审批权限
      this.auth = 99
      this.getUserId().then(res=>{
        this.getAuditInfo({page:1,limit:10})
      })
      return
    }
    if(this.$store.state.user.permissions.includes('workflow:tasks:approval1')){
      this.auth = 1
    }
    if(this.$store.state.user.permissions.includes('workflow:tasks:approval2')){
      this.auth = 10
    }
    if(this.$store.state.user.permissions.includes('workflow:tasks:approval3')){
      this.auth = 20
    }
    this.getUserId().then(res=>{
      this.getSubAuth().then(resp=>{
        setTimeout(() => {
          this.getAuditInfo({page:1,limit:10})
        }, 200);
      })
    })
  },
  methods: {
    check(row,type) {
      this.id = row.id
      this.data = {...row}
      this.nodeType = type
      this.dialogVisible = true
    },
    //完成审批任务
    finishTask(status,id,disciplineKey) {
      //完成大震专题
      let form = {
        taskId: id,
        status: status,
        disciplineKey: disciplineKey
      }
      passTask(form).then(response => {
        // this.getList({page:1,limit:10});
      });
    },
    getSubAuth() {
      const self = this
      return new Promise((resolve,reject)=>{
        self.roleList.forEach(item=>{
        getIdList(item).then((resp) => {
          
          resp.map(itm=>{
            if(itm.roleFlag == 1){
              self.hasSubList.push({
                name: itm.disciplineKey,
                id: itm.disciplineId
              })
            }
          })
          // console.log(self.hasSubList)
          if(self.hasSubList.length == 0){
            resolve(true)
            return
          }
          self.roleList.forEach(item=>{
            self.hasSubList.forEach(itm=>{
              let par = {
                roleId: item,
                disciplineId: itm.id
              }
          
              getRoleAndDepPower(encode(par)).then(res=>{
                let obj = res
                if(obj.depList && obj.depList.length != 0){
                  obj.depList.map(itm=>{
                    self.deptAuthList.push({
                      subId: obj.disciplineId,
                      deptName: itm.departmentName
                    })
                  })
                }
                resolve(true)
              })
          })
        })
          })
        })
      })
    },
    getAuditInfo(page) {
      const self = this
      this.loading = true
      let roles = self.$store.state.user.roles
      let limit = page.limit
      //省局用户
      // if(roles.includes("Audit_1st") || roles.includes("Audit_2nd")){
      //   limit = 99
      // }
      let par = {
        uploader: this.queryParams.userName,
        pageNum: page.page,
        pageSize: limit,
        realName: this.queryParams.taskName,
        auditState: this.queryParams.status,
        subject_id:this.queryParams.subject_id
      }
      if(!this.queryParams.status){
        delete(par.auditState)
      }
      if(this.queryParams.taskName == ""){
        delete(par.realName)
      }
      //省局用户只审自己省局的
      if(roles.includes("Audit_1st") || roles.includes("Audit_2nd")){
        par.uploadDepartment = self.userDept
        // list.forEach(itm=>{
        //   if(itm.uploadDepartment == self.userDept){
        //     list2.push(itm)
        //   }
        // })
        // self.total = list2.length
        // self.tableData = list2
        // return
      }
      // console.log(this.auth)
      if(this.auth){
        par.auditState = this.auth
        //管理员查看所有审批
        if(this.auth == 99){
          if(!this.queryParams.status){
            delete(par.auditState)
          }else{
            par.auditState = this.queryParams.status
          }
        }
      }
      getJobList(encode(par)).then(res=>{
        self.loading = false
        let list = decode(res).records
        let list2 = []
        list.forEach(item=>{
          self.subjectList.forEach(itm=>{
            if(item.subjectId == itm.id){
              item.disciplineKey = itm.sname
            }
          })
        })
        //超级管理员
        if(self.auth == 99){
          self.tableData = list
          self.total = decode(res).total
          return
        }
        // console.log(self.roleList)
        // console.log(self.hasSubList)
        // console.log(list)
        // console.log(self.deptAuthList)
        //只展示有审批学科权限的
        self.hasSubList.map(item=>{
          list.forEach(itm=>{
            self.deptAuthList.map(ite=>{
              if(item.id == itm.subjectId && (itm.uploadDepartment == ite.deptName && ite.subId == itm.subjectId)){
                if(!list2.includes(itm)){
                  list2.push(itm)
                }
              }
            })
          })
        })
        if(roles.includes("Audit_1st") || roles.includes("Audit_2nd")){
          self.total = decode(res).total
          self.tableData = list
          return
        }
        self.total = list2.length
        self.tableData = list2
      })
    },
    changeStat(e) {
      this.loading = true
      let page = 'pageNum=1&pageSize=10'
      if(e != ''){
        page += '&status='+e+'&like='+this.queryParams.taskName
      }
      getAuditList(page).then(res=>{
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      })
    },
    //获取当前登录用户的id
    getUserId(){
      const self = this
      return new Promise((resolve,reject)=>{
        listUser({pageNum:1,pageSize:9999}).then(resp=>{
          resp.rows.forEach(itm=>{
            if(itm.userName == self.$store.state.user.name){
              self.userid = itm.userId
              self.userName = itm.userName
              self.userDept = itm.dept.deptName
            }
          })
          getAuthRole(self.userid).then(res=>{
            res.user.roles.map(item=>{
              self.roleList.push(item.roleId)
            })
            resolve(true)
          })
        })
      })
    },
    getPageList(e) {
      this.loading = true
      let page = 'pageNum='+e.page+'&pageSize='+e.limit
      if(e != ''){
        page += '&status='+this.queryParams.status+'&like='+this.queryParams.taskName
      }
      getAuditList(page).then(res=>{
        this.tableData = res.records
        this.total = res.total
        this.tableData.forEach(item=>{
          item.ctime = new Date(item.ctime).getTime()
        })
        this.loading = false
      })
    },
    approval(type) {
      if (type === 4) {
        this.opinion = ''
        this.dialogVisible = false
        return
      }
        //通过
        if(type == 1){
          // this.tableData.forEach(item=>{
          // if(item.id == this.id){
            // if(parseInt(item.taskNode) < 3){
            //   item.taskNode = parseInt(item.taskNode) + 1;
            // }else {
            //   item.taskNode = 4;
            //   item.taskStatus = '已完成'
            //   item.type = 'success'
            //   this.finishTask(1,this.id,item.disciplineKey)
            // }
            let auditState = 10
            //一审
            if(this.data.auditState == 1) {
              auditState = 10
            }
            //二审
            if(this.data.auditState == 10) {
              auditState = 20
            }
            //三审
            if(this.data.auditState == 20) {
              auditState = 99
            }
          let par2 = {
            fileId: this.data.id,
            roleId: this.roleList[0],
            logMsg: this.opinion,
            userName: this.userName,
            ingAuditState: auditState,
          }
          let par = {
            fileId: this.data.id,
            auditState: auditState
          }
          setAuditState(encode(par)).then(res=>{
            this.$message({
              message: '审批成功！',
              type: 'success'
            });
            this.getAuditInfo({page:1,limit:10})
          })
          addAuditLog(encode(par2)).then()
          // }
        // })
        // if (this.nodeType === 1) {
        //   this.approContrl1 = true
        // }
        // if (this.nodeType === 2) {
        //   this.approContrl2 = true
        // }
        // if (this.nodeType === 3) {
        //   this.approContrl3 = true
        // }
      }
      //不通过
        if(type == 2){
          let auditState = 10
          //一审
          if(this.data.auditState == 1) {
            auditState = -10
          }
          //二审
          if(this.data.auditState == 10) {
            auditState = -20
          }
          //三审
          if(this.data.auditState == 20) {
            auditState = -30
          }
          let par2 = {
            fileId: this.data.id,
            logMsg: this.opinion,
            userName: this.userName,
            ingAuditState: auditState,
          }
          let par = {
            fileId: this.data.id,
            auditState: auditState
          }
          setAuditState(encode(par)).then(res=>{
            this.$message({
              message: '驳回成功！',
              type: 'success'
            });
            this.getAuditInfo({page:1,limit:10})
          })
          addAuditLog(encode(par2)).then()
        }
        this.opinion = ''
        this.dialogVisible = false
    },
    handleQuery(){
      this.getAuditInfo({page:1,limit:10})
    },
    selectMenu(item) {
      this.selIndex = item
    },
    toInfo(item) {
      this.data=item;
       this.dialogVisible3=true;
      //this.$router.push({ name: 'approvalInfo', params: { data: item } })
    },
    getHisList() {
      this.dialogVisible2=true;
     // this.$router.push({ name: 'approvalHis', params: { userName: this.userName } })
    },
    openHistory() {
      this.text = ''
      this.hisRecord.forEach((item) => {
        this.text += item.text + '</br>'
      })
      this.innerVisible = true
    }
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.retrieval {
  position: relative;
  padding: 85px 80px;
  .container {
    .main {
      display: flex;
    }
    .approval {
      margin: 0px 15px;
    }
  }
}
</style>
