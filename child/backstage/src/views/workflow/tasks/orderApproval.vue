<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="任务名称" prop="taskName">
          <el-input
            v-model="queryParams.taskName"
            placeholder="请输入任务名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择任务状态" @change="changeStat" clearable>
              <el-option
                v-for="dict in statusList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
        </el-form-item>
          <el-form-item  label="学科" prop="disciplineKey">
        <el-select v-model="queryParams.disciplineKey" placeholder="请选择学科" @change="changeStat(queryParams.status);" clearable>
            <el-option
              v-for="dict in disciplineList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
      <right-toolbar @queryTable="changeStat(queryParams.status);"></right-toolbar>
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
          <span style="color:red">*</span><span>审批意见：</span>
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
          <el-button v-if="nodeType == 1" type="warning" size="medium" @click="approval(2)">不通过</el-button>
          <!-- <el-button type="primary" size="medium" @click="approval(2)">拟通过</el-button> -->
          <el-button v-else type="warning" size="medium" @click="approval(2)">驳 回</el-button>
          <el-button size="medium" @click="approval(4)">关 闭</el-button>
        </span>
      </el-dialog>
      <div class="container">
        <div class="main">
      <div>
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
              prop="taskName"
              width="300"
              label="待办任务">
              <template slot-scope="scope">
                <div style="color: #409EFF;cursor: pointer;" @click="toInfo(scope.row)">{{ scope.row.taskName }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="creator"
              label="发起人">
            </el-table-column>
            <el-table-column
              prop="unitName"
              label="部门">
            </el-table-column>
            <el-table-column
              prop="ctime"
              width="170"
              label="创建时间">
              <template slot-scope="scope">
                <div>{{ new Date(scope.row.ctime).toLocaleString() }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="taskNode"
              width="120"
              label="节点">
              <template slot-scope="scope">
                <div>{{ scope.row.taskNode == 1? '一审' : scope.row.taskNode == 2 ? '二审' : scope.row.taskNode == 0? '终止' :scope.row.taskNode == 4? '完成' :'三审'  }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="disciplineKey"
              label="学科">
            </el-table-column>
            <el-table-column
              prop="taskStatus"
              width="120"
              label="状态">
              <template slot-scope="scope">
                <el-tag :type="scope.row.taskStatus == '已完成'? 'success' : scope.row.taskStatus == '已结束'?'danger': 'warning'">{{ scope.row.taskStatus }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              width="360"
              label="操作">
              <template slot-scope="scope">
                <el-button v-hasPermi="['workflow:tasks:approval1']" v-if="scope.row.taskNode != 0 && scope.row.taskNode != 4" :disabled="!(scope.row.taskNode == 1)" @click="check(scope.row.id,1)" type="primary" size="small">一审</el-button>
                <el-button v-hasPermi="['workflow:tasks:approval2']" v-if="scope.row.taskNode != 0 && scope.row.taskNode != 4" :disabled="!(scope.row.taskNode == 2)" @click="check(scope.row.id,2)" type="primary" size="small">二审</el-button>
                <el-button v-hasPermi="['workflow:tasks:approval3']" v-if="scope.row.taskNode != 0 && scope.row.taskNode != 4" :disabled="!(scope.row.taskNode == 3)" @click="check(scope.row.id,3)" type="primary" size="small">三审</el-button>
                <el-button v-hasPermi="['workflow:tasks:approvalInfo']" type="primary" size="small" @click="toInfo(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total > 0" :total="total" :page.sync="pages.pageNum" :limit.sync="pages.pageSize"
                @pagination="getPageList" />
        </div>
      </div>
    </div>
    </div>
     <el-dialog
      title="审批任务详情"
      :visible.sync="dialogVisible3"
      width="70%">
        <orderApprovalInfo
         ref="orderApprovalInfo"
      :data="data"> 
      </orderApprovalInfo>
    </el-dialog>
    </div>
  </template>
  
  <script>
  import { getAuditList, editStatus, addAuditRecord, passTask } from '@/api/workflow/audit'
  import { encode, decode } from '@/utils/base/dataEncry.js';
  import { listUser } from '@/api/system/user'
  import { getUserProfile } from "@/api/system/user"
  import  orderApprovalInfo from '@/views/components/task/orderApprovalInfo'

  
  export default {
      components: {  orderApprovalInfo },
    data() {
      return {
        dialogVisible: false,
        dialogVisible3:false,
        innerVisible: false,
        loading: true,
        id: null,
        opinion: '',
        text: '', // 审核记录
        showIfr: false,
        selIndex: 1,
        total: 0,
        pages: {
          pageNum: 1,
          pageSize: 10
        },
        queryParams: {
          taskName: '',
          status: '待审核'
        },
        statusList: [
          {
            label: '已完成',
            value: '已完成'
          },
          {
            label: '已结束',
            value: '已结束'
          },
          {
            label: '待审核',
            value: '待审核'
          }
        ],  
        disciplineList:[ {
            label: '地震科普',
            value: '地震科普'
          },
          {
            label: '学科',
            value: '学科'
          },
          {
            label: '技术服务',
            value: '技术服务'
          },
          {
            label: '大震专题',
            value: '大震专题'
          },
          {
            label: '平台动态',
            value: '平台动态'
          } ],
        approContrl1: false,
        approContrl2: false,
        approContrl3: false,
        deptName: null,
        isAdmin: false,
        nodeType: '', //点击审批时的类型
        userid: null,
        tableData: [],
        hisRecord: [
          {
            text: '2023年01月12日 15:21:10  张三审核通过'
          },
          {
            text: '2023年01月16日 20:02:09  王五审核通过'
          },
          {
            text: '2023年01月19日 18:01:53  赵六审核通过'
          }
        ]
      }
    },
     beforeCreate () { 
    this.$options.components.orderApprovalInfo = require('@/views/components/task/orderApprovalInfo').default ; 
  },
     
    watch: {},
    computed: {},
    mounted() {
      this.getUserDept().then(res=>{
        this.changeStat('待审核')
      })
      // this.getPageList({
      //   pageNum: 1,
      //   pageSize: 15
      // })
      //超级管理员或查看全部的权限
      if(this.$store.state.user.permissions[0] == '*:*:*' || this.$store.state.user.permissions.includes('workflow:tasks:orderApproval:checkAll')){
        this.isAdmin = true
      }else{
        this.isAdmin = false
      }
      // this.getUserId()
    },
    methods: {
      check(id,type) {
        this.id = id
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
      changeStat(e) {
        this.loading = true

        let page = 'pageNum=1&pageSize=10&disciplineKey='+this.queryParams.disciplineKey
        if(this.queryParams.taskName != '' && e != ''){
          page += '&status='+e+'&like='+this.queryParams.taskName
        }else{
          if(this.queryParams.taskName != ''){
            page += '&like='+this.queryParams.taskName
          }
          if(e != ''){
            page += '&status='+e
          }
        }
        if(!this.isAdmin){
          page += '&unitName='+this.deptName
        }
        getAuditList(page).then(res=>{
          this.tableData = res.records
          this.total = res.total
          this.loading = false
        })
      },
      getUserDept() {
        return new Promise((resolve,reject)=>{
          getUserProfile().then((res) => {
            this.deptName = res.data.dept.deptName
            resolve()
          }).catch(e=>{
            reject()
          })
        })
      },
      getPageList(e) {
        this.loading = true
        let page = 'pageNum='+e.page+'&pageSize='+e.limit
        if(this.queryParams.taskName != ''){
          page += '&like='+this.queryParams.taskName
        }
        if(this.queryParams.status != ''){
          page += '&status='+this.queryParams.status
        }

        if(!this.isAdmin){
          page += '&unitName='+this.deptName
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
        if (this.opinion !== '') {
          //通过
          if(type == 1){
            this.tableData.forEach(item=>{
            if(item.id == this.id){
              if(parseInt(item.taskNode) < 3){
                item.taskNode = parseInt(item.taskNode) + 1;
              }else {
                item.taskNode = 4;
                item.taskStatus = '已完成'
                item.type = 'success'
                this.finishTask(1,this.id,item.disciplineKey)
              }
            let par = {
              atime: new Date().toLocaleString().replaceAll('/','-'),
              opinion: this.opinion,
              status: '通过',
              userId: this.$store.state.user.userId,
              taskId: this.id,
              taskNode: item.taskNode
            }
              addAuditRecord(encode(par)).then(res=>{
                editStatus(encode(item)).then(res=>{
                  this.$message({
                    message: '审批成功！',
                    type: 'success'
                  });
                })
              })
            }
          })
          if (this.nodeType === 1) {
            this.approContrl1 = true
          }
          if (this.nodeType === 2) {
            this.approContrl2 = true
          }
          if (this.nodeType === 3) {
            this.approContrl3 = true
          }
        }
        //不通过
          if(type == 2){
            this.tableData.forEach(item=>{
              if(item.id == this.id){
                // if(item.taskNode > 1){
                //   item.taskNode = 1;
                // }else {
                  item.taskNode = 0;
                  item.taskStatus = '已结束'
                  item.type = 'danger'
                  this.approContrl1 = true
                  this.approContrl2 = true
                  this.approContrl3 = true
                  this.finishTask(-1,this.id,item.disciplineKey)
                let par = {
                  atime: new Date().toLocaleString().replaceAll('/','-'),
                  opinion: this.opinion,
                  status: '驳回',
                  userId: this.userid,
                  taskId: this.id,
                  taskNode: item.taskNode
                }
                addAuditRecord(encode(par)).then(res=>{
                  editStatus(encode(item)).then(res=>{
                    this.$message({
                      message: '审批成功！',
                      type: 'success'
                    });
                  })
                })
              }
            })
          }
          this.opinion = ''
          this.dialogVisible = false
        } else {
          alert('请填写审批意见！')
        }
      },
      handleQuery(){
        this.changeStat(this.queryParams.status)
      },
      selectMenu(item) {
        this.selIndex = item
      },
      toInfo(item) {
        this.data=item;
        this.dialogVisible3=true;

        //this.$router.push({ name: 'orderApprovalInfo', params: { data: item } })
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
  