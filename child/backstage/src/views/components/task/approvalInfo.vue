<template>
  <div class="app-container">
 
    <el-dialog
        width="100%"
        title="审核记录"
        :visible.sync="dialog">
        <div v-html="text"></div>
    </el-dialog>
    <div class="infoCard">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ data.name }}</span>
        </div>
        <div class="contant">
          <div class="name">审批流程：</div>
          <div class="steps">
            <el-steps :active="nowNode" finish-status="success" process-status="finish" align-center>
              <el-step v-for="item in spUser" :key="item.node" :title="item.name" icon="el-icon-user-solid">
              </el-step>
            </el-steps>
          </div>
          <el-divider></el-divider>
          <div class="row">
            <!-- <div class="column">
              <div class="item"><span class="name">编号：</span><span class="value">{{ data.code }}</span></div>
              <div class="item"><span class="name">发起人部门：</span><span class="value">{{ data.cdept }}</span></div>
              <div class="item"><span class="name">发起时间：</span><span class="value">{{ data.date }}</span></div>
            </div>
            <div class="column">
              <div class="item"><span class="name">发起人：</span><span class="value">{{ data.cuser }}</span></div>
              <div class="item"><span class="name">状态：</span><span class="value">{{ data.status }}</span></div>
              <div class="item"><span class="name">到本节点时间：</span><span class="value">{{ data.date2 }}</span></div>
            </div> -->
            <el-table
              :data="hisRecord"
              v-loading="loading"
              height="350"
              style="width: 100%;">
              <el-table-column
                prop="userName"
                label="审批人"
                width="190">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.userName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="ingAuditState"
                label="状态"
                width="100">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.ingAuditState| auditStates }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="时间"
                width="230">
                <template slot-scope="scope">
                  <div>
                    {{ new Date(scope.row.createTime).toLocaleString() }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="logMsg"
                label="意见">
              </el-table-column>
            </el-table>
          </div>
          <el-divider content-position="left">关联审批数据</el-divider>
          <div class="attach" @click="toInfo">{{ data.fileName }}</div>
          <!-- <div style="display:flex;padding:10px" v-if="data.url">
            <div class="attachs" @click="preView(data.url)"><i class="el-icon-document"></i> {{ data.fileName }}</div>
            <span class="attachs download">下载</span>
          </div>
          <div style="padding:10px" v-else>无审批附件</div> -->
          <!-- <el-divider content-position="left">审批操作</el-divider>
          <div style="display:flex;margin-top: 36px;">
            <span style="color:red">*</span><span>审批意见：</span>
            <el-input
              type="textarea"
              placeholder="请输入审批意见"
              v-model="textarea"
              rows="4"
              style="width:80%;"
            />
          </div> -->
          <!-- <div class="footer">
            <el-button type="primary" style="margin-left:20px" size="small" plain  @click="approval(1)">通 过</el-button>
            <el-button type="primary" size="small" plain @click="approval(2)">拟通过</el-button>
            <el-button type="warning" size="small" plain @click="approval(3)">驳 回</el-button>
          </div> -->
          <div style="height:50px"></div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getAuditLog } from '@/api/dataup/criterion'
import { encode, decode } from '@/utils/base/dataEncry.js';
import { getUserProfile, listUser } from '@/api/system/user'
export default {
   name: 'approvalInfo',
  props: {
    data: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
     // data: {},
      nowNode: 1,
      showIfr: false,
      loading: true,
      loading2: true,
      dialog: false,
      previewUrl: '', // 预览地址
      textarea: '',
      text: '', // 审核记录
      spUser: [
        {
          name: '未提交',
          node: 0
        },
        {
          name: '提交审核',
          node: 1
        },
        {
          name: '一审',
          node: 10
        },
        {
          name: '二审',
          node: 20
        },
        {
          name: '审核完成',
          node: 99
        },
        {
          name: '已分发',
          node: 100
        }
      ],
      hisRecord: []
    }
  },
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
  components: {},
  computed: {},
  mounted() {
    //this.data = this.$route.params.data
    //判断当前审批流处在的阶段
    this.spUser.map((item,index)=>{
      if(item.node == this.data.auditState){
        this.nowNode = (index + 1)
        if(this.data.auditState == 0){
          this.nowNode = 0
        }
      }
    })
    if(this.data.auditState < 0){
      this.nowNode = 0
    }
    this.spUser.unshift({
      name: this.data.uploader+"(发起人)",
      node: -1
    })
    // console.log(JSON.stringify(this.data))
    this.getHisList()
  },
  methods: {
    getHisList() {
      getAuditLog(encode({
        fileId: this.data.id,
        pageNum: 1,
        pageSize: 999
      })).then(res=>{
        this.hisRecord = decode(res).records
        this.loading = false
        // listUser().then(resp=>{
        //   resp.rows.forEach(itm=>{
        //     this.hisRecord = res
        //     this.hisRecord.forEach(item=>{
        //       if(itm.userId == item.userId){
        //         item.text = itm.userName
        //       }
        //     })
        //   })
        // })
      })
    },
    toInfo(){
      window.open(this.data.url)
    },
    goBack() {
      this.$router.go(-1)
    },
    preView(url) {
      this.previewUrl = url + '#toolbar=0'
      this.showIfr = true
    },
    close() {
      this.showIfr = false
    },
    openHistory() {
      this.text = ''
      this.hisRecord.forEach((item) => {
        this.text += item.text + '</br>'
      })
      this.dialog = true
    },
    approval(type) {
      if (this.textarea !== '') {
        if (type === 1) {
          this.textarea = ''
        }
        if (type === 2) {
          this.textarea = ''
        }
        if (type === 3) {
          this.textarea = ''
        }
      } else {
        alert('请填写审批意见！')
      }
    }
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.app-container {
  padding: 5px;
}
.attach {
  color: #409EFF;
  cursor: pointer;
}
.fauit {
  position: relative;
  min-height: 500px;
  padding: 80px 12%;
  .iframe {
    position: absolute;
    display: flex;
    top: 120px;
    left: 10%;
    width: 900px;
    height: 600px;
    justify-content: center;
    z-index: 1005;
    font-size: 30px;
    color: #fff;
  }
  .backBtn {
    font-size: 25px;
    font-weight: bold;
    position: relative;
    top: 0;
    left: 10px;
    cursor: pointer;
  }
  .topNav {
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: rgb(255, 255, 255);
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
  }
  .infoCard {
    margin-top: 15px;
    .clearfix {
      font-weight: bold;
    }
    .contant {
      padding: 20px 50px;
      width: 100%;
      font-size: 14px;
      .footer {
        position: relative;
        top: 30px;
        left: 55%;
      }
      .steps {
        padding: 10px 0px;
      }
      .row {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .name {
          font-weight: bold;
      }
      .column {
          display: flex;
          flex-direction: column;
          .item {
            display: flex;
            margin: 7px 0px;
          }
      }
      .attachs {
        color: #409EFF;
        cursor: pointer;
      }
      .download {
        margin-left: 20px;
      }
    }
  }
}
</style>
