<template>
    <el-container>
        <div class="container">
                    <!-- 头部当行蓝 -->
        <div class="topNav">
            <top-nav :pageName="typeName"></top-nav>
        </div>
            <div class="back" @click="back">
                <i class="el-icon-back"></i>
                <span style="font-size: 16px;padding-left:5px;">返回</span>
            </div>
            <el-header>
                <p style="text-align: center;font-size: 27px;">核对订单信息</p>
            </el-header>
            <hr style="color: rgb(238, 238, 238);" />
            <el-main>
                <div class="main">
                    <el-collapse v-model="activeNames" @change="handleChange">
                        <el-collapse-item name="1">
                            <template slot="title">
                                <p class="item">基础信息<i style="margin-left: 5px" class="el-icon-user-solid"></i></p>
                            </template>
                            <div class="contant">
                                <el-form ref="form" :inline="true" :rules="rules" :model="form" label-width="120px">
                                    <el-form-item label="昵称" prop="userName">
                                        <el-input size="small" :disabled="true" v-model="form.userName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="单位" prop="unitName">
                                        <el-input size="small" :disabled="true" v-model="form.unitName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="部门" prop="department">
                                        <el-input size="small" v-model="form.department"></el-input>
                                    </el-form-item>
                                    <el-form-item label="用户名" prop="accountName">
                                        <el-input size="small" :disabled="true" v-model="form.accountName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="身份证号码" prop="idNumber">
                                        <el-input size="small" v-model="form.idNumber"></el-input>
                                    </el-form-item>
                                    <el-form-item label="历史订单次数" prop="orderNum">
                                        <el-input size="small" :disabled="true" v-model="form.orderNum"></el-input>
                                    </el-form-item>
                                    <el-form-item label="联系电话" prop="phoneNumber">
                                        <el-input type="number" size="small" v-model="form.phoneNumber"></el-input>
                                    </el-form-item>
                                    <el-form-item label="邮箱" prop="email">
                                        <el-input size="small" v-model="form.email"></el-input>
                                    </el-form-item>
                                    <el-form-item label="地址" prop="site">
                                        <el-input size="small" v-model="form.site"></el-input>
                                    </el-form-item>
                                    <el-form-item label="邮编" prop="postcode">
                                        <el-input size="small" v-model="form.postcode"></el-input>
                                    </el-form-item>
                                    <el-form-item label="传真" prop="fax">
                                        <el-input size="small" v-model="form.fax"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="2">
                            <template slot="title">
                                <p class="item">其他信息<i style="margin-left: 5px" class="el-icon-s-order"></i></p>
                            </template>
                            <div class="contant">
                                <el-form ref="form2" :inline="true" :rules="rules2" :model="form" label-width="120px">
                                    <el-form-item label="单位性质" prop="unitNature">
                                        <el-select v-model="form.unitNature" size="small" placeholder="请选择">
                                            <el-option
                                                v-for="item in unitTypeList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="单位地址" prop="unitSite">
                                        <el-input type="textarea"
                                                style="width:270px"
                                                :rows="2"
                                                placeholder="请输入内容"
                                                v-model="form.unitSite"></el-input>
                                    </el-form-item>
                                    <el-form-item label="所属行业" prop="unitBusiness">
                                        <el-select v-model="form.unitBusiness" size="small" placeholder="请选择">
                                            <el-option
                                                v-for="item in industryList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="依托项目/课题" prop="research">
                                        <el-input style="width:270px" size="small" v-model="form.research"></el-input>
                                    </el-form-item>
                                    <el-form-item label="经费来源" prop="expenditure">
                                        <el-select v-model="form.expenditure" size="small" placeholder="请选择">
                                            <el-option
                                                v-for="item in moneySourceList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="使用目的" prop="purpose">
                                        <el-select v-model="form.purpose" size="small" @change="otherShow" placeholder="请选择">
                                            <el-option
                                                v-for="item in targetList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <el-input type="textarea"
                                                v-if="showOther"
                                                style="width: 370px;margin-left: 30px;"
                                                :rows="2"
                                                placeholder="请输入其他内容"
                                                v-model="form.targetOther"></el-input>
                                    </el-form-item>
                                    <el-form-item label="工作内容" prop="jobContent">
                                        <el-input type="textarea"
                                                style="width:600px"
                                                :rows="3"
                                                placeholder="请输入工作内容"
                                                v-model="form.jobContent"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="3">
                            <template slot="title">
                                <p class="item">订单信息<i style="margin-left: 5px" class="el-icon-s-order"></i></p>
                            </template>
                            <div class="list">
                                <ul style="overflow-y: auto;max-height: 520px;">
                                    <li v-for="item in orderList" :key="item.id">
                                        <div class="cartItem">
                                        <i class="el-icon-s-data" style="font-size: 36px;line-height:50px;vertical-align:middle;margin:0px 5px"></i>
                                        <el-tag><span style="font-size: 17px;">{{ item.orderClasses }}</span></el-tag>
                                        <div class="info">
                                          <div v-if="item.dataStat">
                                            <p style="color: #888888;font-size: 14px;line-height: 20px;padding-left: 14px;">{{ item.dataDate }}</p>
                                            <p style="color: green;padding-left: 14px;">{{ item.dataStat == 100 ? '数据完整' : '数据完整率：'+item.dataStat}}</p>
                                          </div>
                                          <div v-else>
                                            <p style="line-height: 20px;padding-left: 16px;">{{ item.classesStandby }}
                                            </p>
                                          </div>
                                        </div>
                                        </div>
                                    </li>
                                </ul>
                                <div class="total">
                                    <span>合计：</span><span>{{ orderList.length }} 项</span>
                                </div>
                                <div class="agreement">
                                  <el-checkbox v-model="agree">承诺所填信息属实，所下载使用的数据如有违反国家法律相关规定的使用范围，本平台将会进行封号等处理手段。</el-checkbox>
                                </div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <div style="width: 100%;display:flex;justify-content:center;padding: 30px 0px;">
                        <el-button type="primary" size="medium" @click="submit" style="margin-right:15px">确认订单</el-button>
                        <el-button size="medium" @click="reSet">重置</el-button>
                    </div>
                </div>
            </el-main>
        </div>
    </el-container>
</template>
<script>
import { getUserList } from '@/api/user.js'
import { Loading } from 'element-ui';
import { getInfo } from '@/api/login.js'
import { addOrder,addDisplay, productOrderAdd } from '@/api/order.js'
import TopNav from '../../components/layout/topNav.vue'
import { encode, decode } from '@/utils/base/dataEncry'
export default {
  data() {
    return {
        activeNames: ['1','2','3'],
        showOther: false,
        typeName: '', //订单源
        form:{
            userName: '',
            userId: '',
            unitName: '',
            department: '',
            accountName: '',
            idNumber: '',
            orderNum: '',
            phoneNumber: '',
            email: '',
            site: '',
            postcode: '',
            fax: '',
            unitNature: '',
            research: '',
            unitBusiness: '',
            unitSite: '',
            expenditure: '',
            purpose: '',
            targetOther: '',
            jobContent: '',
            returnName: '',
        },
        agree: false, //确认订单勾选
        loading: null,
        orderList: [], //订单表
        unitTypeList: [{
          value: '政府机关',
          label: '政府机关'
        }, {
          value: '事业单位',
          label: '事业单位'
        }, {
          value: '国有企业',
          label: '国有企业'
        }, {
          value: '社会组织、团体与组织',
          label: '社会组织、团体与组织'
        }, {
          value: '个人',
          label: '个人'
        }, {
          value: '其他',
          label: '其他'
        }],
        industryList: [{
          value: '地质与矿产(地调局系统)',
          label: '地质与矿产(地调局系统)'
        }, {
          value: '地质与矿产(非地调局系统)',
          label: '地质与矿产(非地调局系统)'
        }, {
          value: '自然资源',
          label: '自然资源'
        }, {
          value: '高校',
          label: '高校'
        }, {
          value: '科研院所',
          label: '科研院所'
        }, {
          value: '煤炭',
          label: '煤炭'
        }, {
          value: '有色',
          label: '有色'
        }, {
          value: '冶金',
          label: '冶金'
        }, {
          value: '核工业',
          label: '核工业'
        }, {
          value: '建材(非金属)',
          label: '建材(非金属)'
        }, {
          value: '城市建设',
          label: '城市建设'
        }, {
          value: '测绘',
          label: '测绘'
        }, {
          value: '海洋',
          label: '海洋'
        }, {
          value: '农业',
          label: '农业'
        }, {
          value: '科技',
          label: '科技'
        }, {
          value: '生态环境',
          label: '生态环境'
        }, {
          value: '规划设计',
          label: '规划设计'
        }, {
          value: '交通',
          label: '交通'
        }, {
          value: '铁路',
          label: '铁路'
        }, {
          value: '能源',
          label: '能源'
        }, {
          value: '水利',
          label: '水利'
        }, {
          value: '电力',
          label: '电力'
        }, {
          value: '灾害应急',
          label: '灾害应急'
        }, {
          value: '地震',
          label: '地震'
        }, {
          value: '其他',
          label: '其他'
        }],
        moneySourceList: [{
          value: '中央财政',
          label: '中央财政'
        }, {
          value: '地方财政',
          label: '地方财政'
        }, {
          value: '企业委托',
          label: '企业委托'
        }, {
          value: '企业自筹',
          label: '企业自筹'
        }, {
          value: '中央地方混合',
          label: '中央地方混合'
        }, {
          value: '其他',
          label: '其他'
        }],
        targetList: [{
          value: '科研项目',
          label: '科研项目'
        }, {
          value: '商业使用',
          label: '商业使用'
        }, {
          value: '个人研究',
          label: '个人研究'
        }, {
          value: '其它',
          label: '其它'
        }],
        userList: [],
        rules: {
            dept: [
            { required: true, message: '请输入部门', trigger: 'blur' },
          ],
            idCart: [
                { required: true, message: '请输入身份证号码', trigger: 'blur' },
            ],
            number: [
                { required: true, message: '请输入联系电话', trigger: 'blur' },
            ],
            email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
            ]
        },
        rules2: {
            unitType: [
                { required: true, message: '请选择单位性质', trigger: 'blur' },
            ],
            unitAddress: [
                { required: true, message: '请输入单位地址', trigger: 'blur' },
            ],
            industry: [
                { required: true, message: '请输入所属行业', trigger: 'blur' },
            ],
            project: [
                { required: true, message: '请输入依托项目/课题', trigger: 'blur' },
            ],
            moneySource: [
                { required: true, message: '请选择经费来源', trigger: 'blur' },
            ],
            target: [
                { required: true, message: '请选择使用目的', trigger: 'blur' },
            ],
            workContant: [
                { required: true, message: '请输入工作内容', trigger: 'blur' },
            ],
        }
    }
  },
  components: {
    TopNav
  },
  created() {
    let data = JSON.parse(localStorage.getItem(encode('Admin-User')))
    this.orderList = JSON.parse(sessionStorage.getItem('orderList'))
    this.typeName = this.orderList[0].orderClasses.split('_')[0]
    getInfo().then(res=>{
      let data = res.user
      this.form.accountName = data.nickName
      this.form.returnName = data.userName
      this.form.unitName = data.dept.deptName
      this.form.userName = data.userName
      this.form.userId = data.userId
      this.form.email = data.email
      this.form.phoneNumber = data.phonenumber

    })
  },
  methods:{
    handleChange(){

    },
    back() {
        this.$router.go(-1)
    },
    otherShow(e) {
        if(e == '其它'){
            this.showOther = true
        }else {
            this.showOther = false  
        }
    },
    submit() {
      if(this.form.dept == '' || this.form.idCart == '' || this.form.number == ''
      || this.form.email == '' || this.form.unitType == '' || this.form.unitAddress == ''
      || this.form.industry == '' || this.form.project == '' || this.form.moneySource == ''
      || this.form.target == '' || this.form.workContant == ''){
          alert('有必填项未填')
          return
        }
        if(!this.agree){
          alert('请勾选承诺后再下单')
          return
        }
        this.loading = Loading.service({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
        });
        let shoppingTrolley = ''
        //产品类型的订单
        if(this.orderList[0].subjectId == 99){
          let info = {
            ...this.orderList[0]
          }
          this.form = Object.assign({},info,this.form)
          productOrderAdd(encode(this.form)).then(res=>{
            this.$message({
                message: '提交成功！',
                type: 'success'
              });
              this.loading.close()
              this.back()
          })
        }else{
          //数据目录的订单
          this.orderList.forEach((item,index)=>{
            if(index != this.orderList.length - 1){
              shoppingTrolley = shoppingTrolley + item.orderId + ':'
            }else {
              shoppingTrolley = shoppingTrolley + item.orderId
            }
          })
          this.form.shoppingTrolley = shoppingTrolley
          addOrder(encode(this.form)).then(res=>{
            addDisplay(encode(this.form)).then(resp=>{
              this.$message({
                message: '提交成功！',
                type: 'success'
              });
              this.loading.close()
              this.back()
            })
          })
        }

      },
    reSet() {
        this.form.dept = ''
        this.form.idCart = ''
        this.form.orderNum = ''
        this.form.number = ''
        this.form.email = ''
        this.form.address = ''
        this.form.code = ''
        this.form.fax = ''
        this.form.unitType = ''
        this.form.industry = ''
        this.form.unitAddress = ''
        this.form.moneySource = ''
        this.form.targetOther = ''
        this.form.workContant = ''
        this.form.project = ''
        this.form.target = ''
        this.form.userId = ''
        this.form.returnName = ''
    }
  }
}
</script>
<style lang="less" scoped>
.topNav {
    // position: absolute;
    max-width: 240px;
    z-index: 998;
    height: 33px;
    // top: 65px;
    // left: 20px;
    background-color: #fff;
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
}
.container {
    width: 100%;
    padding: 50px 350px;
    .back {
        float: right;
        font-size:20px;
        cursor: pointer;
    }
    .back:hover {
        color: #0073ff;
    }
    .main {
        width: 100%;
        .item {
            font-size: 18px;
            padding-left: 10px;
        }
        .contant {
            background-color: rgb(240, 243, 246);
            padding: 12px 30px;
        }
        .info {
            padding-left:45px;
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
        .cartItem {
            padding: 8px 15px;
            border-bottom: 1px solid #e1e1e1;
            background-color: rgb(249, 249, 251)
        }
        .removeCart {
            line-height: 50px;
            vertical-align: middle;
        }
        .total {
            padding: 12px 5px;
            font-size: 16px;
            text-align: right;
        }
        .agreement {
          margin: 10px 0px;
        }
    }
}
/deep/ .el-collapse-item__header.is-active {
    background-color: #cecece;
}
/deep/ .el-form-item {
    margin-bottom: 8px;
}
// /deep/ .el-collapse-item__content {
    // padding-bottom: 0px !important
// }
/deep/ .el-input.is-disabled .el-input__inner {
    background-color: #eeeeee;
    color: #a5a5a5
}
/deep/ .el-select {
    width: 200px;
}
</style>