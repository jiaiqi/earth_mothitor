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
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
      <right-toolbar @queryTable="getAuditInfo({page:1,limit:10});"></right-toolbar>
        <el-dialog
          width="30%"
          title="审核记录"
          :visible.sync="dialogVisible"
          append-to-body>
          <div v-html="text"></div>
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
              prop="fileName"
              width="320"
              label="文件名">
              <template slot-scope="scope">
                <div style="color: #409EFF;cursor: pointer;" @click="toInfo(scope.row)">{{ scope.row.fileName }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="uploader"
              label="发起人">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="审批人">
            </el-table-column>
            <el-table-column
              prop="createTime"
              width="170"
              label="创建时间">
              <template slot-scope="scope">
                <div>{{ new Date(scope.row.createTime).toLocaleString() }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="ingAuditState"
              width="120"
              label="状态">
              <template slot-scope="scope">
                <el-tag :type="(scope.row.ingAuditState >= 99)? 'success' : scope.row.ingAuditState == -1?'danger': 
                (scope.row.ingAuditState == 1||scope.row.ingAuditState == 10||scope.row.ingAuditState == 20) ?'' : 'warning'"
                  style="font-weight:bold">
                  {{ scope.row.ingAuditState | auditStates }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              width="360"
              label="操作">
              <template slot-scope="scope">
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
    </div>
  </template>
  
  <script>
  import { historyAudit } from '@/api/dataup/criterion.js'
  import { getAuditList } from '@/api/workflow/audit'
  import { encode, decode } from '@/utils/base/dataEncry.js';
  
  export default {
    data() {
      return {
        dialogVisible: false,
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
          status: null,
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
          // {
          //   label: '一审通过',
          //   value: 10
          // },
          // {
          //   label: '二审通过',
          //   value: 20
          // },
          // {
          //   label: '三审通过',
          //   value: 30
          // },
          {
            label: '审核完成',
            value: 99
          },
          {
            label: '已分发',
            value: 100
          }
        ],
        data: {},
        nodeType: '', //点击审批时的类型
        userid: null,
        userName: null,
        userDept: null,
        //单位审核权限
        tableData: [],
        hisRecord: []
      }
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
      this.userName = this.$route.params.userName
      this.getAuditInfo({page:1,limit:10})
    },
    methods: {
      check(row,type) {
        this.id = row.id
        this.data = {...row}
        this.nodeType = type
        this.dialogVisible = true
      },
      getAuditInfo(page) {
        const self = this
        this.loading = true
        let par = {
            pageSize: page.limit,
            pageNum: page.page,
            userName: this.userName
        }
        historyAudit(encode(par)).then(res=>{
          self.loading = false
          let list = decode(res).records
          self.total = decode(res).total
          self.tableData = list
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

      handleQuery(){
        this.getAuditInfo({page:1,limit:10})
      },
      selectMenu(item) {
        this.selIndex = item
      },
      toInfo(item) {
        let data = {...item}
        data.auditState = item.ingAuditState
        data.id = data.fileId
        this.$router.push({ name: 'approvalInfo', params: { data: data } })
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
  