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
            <el-steps :active="(data.taskNode - 1)" finish-status="success" process-status="finish" align-center>
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
              height="350"
              style="width: 100%;">
              <el-table-column
                prop="text"
                label="审批人"
                width="190">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.text }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="taskNode"
                label="节点"
                width="100">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.taskNode == 2? '一审' : scope.row.taskNode == 3 ? '二审' : scope.row.taskNode == 0? '终止' :scope.row.taskNode == 4? '三审' :'' }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                width="100">
              </el-table-column>
              <el-table-column
                prop="atime"
                label="时间"
                width="230">
                <template slot-scope="scope">
                  <div>
                    {{ new Date(scope.row.atime).toLocaleString() }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="opinion"
                label="意见">
              </el-table-column>
            </el-table>
          </div>
          <el-divider content-position="left">关联审批数据</el-divider>
          <div class="attach" @click="toInfo">{{ data.taskName }}</div>
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
import { listById } from '@/api/workflow/audit'
import { getUserProfile, listUser } from '@/api/system/user'
export default {
  props: {
      name: 'orderApprovalInfo',
    data: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
     // data: {},
      nowNode: 2,
      showIfr: false,
      dialog: false,
      previewUrl: '', // 预览地址
      textarea: '',
      text: '', // 审核记录
      spUser: [
        {
          name: '一审',
          node: 1
        },
        {
          name: '二审',
          node: 2
        },
        {
          name: '三审',
          node: 3
        }
      ],
      hisRecord: []
    }
  },
  components: {},
  computed: {},
  mounted() {
   // this.data = this.$route.params.data
    this.spUser.unshift({
      name: this.data.creator,
      node: 0
    })
    this.getHisList()
  },
  methods: {
    getHisList() {
      listById({
        taskId: this.data.id,
      }).then(res=>{
        listUser({pageNum:1,pageSize:999}).then(resp=>{
          resp.rows.forEach(itm=>{
            this.hisRecord = res
            this.hisRecord.forEach(item=>{
              if(itm.userId == item.userId){
                item.text = itm.userName
              }
            })
          })
        })
      })
    },
    toInfo(){
      // if(this.data.disciplineKey == '测震数据'){
      //   this.$router.push('/workflow/workflow/dataclg/seismometry?taskId='+this.data.id)
      // }
      // if(this.data.disciplineKey == '强震数据'){
      //   this.$router.push('/workflow/workflow/dataclg/vibration/upload?taskId='+this.data.id)
      // }
      if(this.data.disciplineKey == '地震科普'){
        this.$router.push('/workflow/knowledge?taskId='+this.data.id)
      }
      if(this.data.disciplineKey == '大震专题'){
        this.$router.push('/workflow/bigEar?taskId='+this.data.id)
      }
      if(this.data.disciplineKey == '产品服务'){
        if(this.data.taskName.indexOf('特殊产品') != -1){
          this.$router.push('/workflow/workflow/productclg/expProduct?taskId='+this.data.id)
        }else{
          this.$router.push('/workflow/workflow/productclg/product?taskId='+this.data.id)
        }
      }
      if(this.data.disciplineKey == '技术服务'){
        this.$router.push('/workflow/serve?taskId='+this.data.id)
      }
      if(this.data.disciplineKey == '法律法规'){
        this.$router.push('/workflow/workflow/lawsta/laws?taskId='+this.data.id)
      }
      if(this.data.disciplineKey == '平台动态'){
        this.$router.push('/workPlatform/page/platNews?taskId='+this.data.id)
      }
      if(this.data.disciplineKey == '学科审批'){
        this.$router.push('/workPlatform/subject?taskId='+this.data.id+'&types=sub')
      }
      if(this.data.disciplineKey == '学科类型'){
        this.$router.push('/workPlatform/subject?taskId='+this.data.id+'&types=subType')
      }
      // if(this.data.disciplineKey == '测深数据'){
      //   this.$router.push('/workflow/workflow/dataclg/prospecting?taskId='+this.data.id)
      // }
      // if(this.data.disciplineKey == 'GNSS数据'){
      //   this.$router.push('/workflow/workflow/dataclg/gnss/upload?taskId='+this.data.id)
      // }
      // if(this.data.disciplineKey == '地质数据'){
      //   this.$router.push('/workflow/workflow/dataclg/upLoad/geological?taskId='+this.data.id)
      // }
      // if(this.data.disciplineKey == '地下流体数据'){
      //   this.$router.push('/workflow/workflow/dataclg/fluid?taskId='+this.data.id)
      // }
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
