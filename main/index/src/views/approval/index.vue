<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" placeholder="请选择订单状态" @change="changeStat" clearable>
            <el-option
              v-for="dict in statusList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->
    <div class="contain">
    <el-table
      v-loading="loading"
      :data="menuList"
    >
      <el-table-column prop="orderId" width="120" label="订单编号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="userName" width="150" label="用户名" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="subject" width="130" label="订单分类" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sentDept" width="160" label="分发单位" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="purpose" width="180" label="申请事由分类" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="下单时间" width="200" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{new Date(scope.row.ctime).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div :style="{'color': scope.row.orderStatus == 30 ? '#67C23A' : scope.row.orderStatus == 40? '#909399' : scope.row.orderStatus == -10 ? '#F56C6C' : 'rgb(255,157,0)'}">
            {{ scope.row.orderStatus | orderStates }}
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
          >详情</el-button>
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-s-order"
            @click="handleRecord(scope.row)"
          >处理记录</el-button>
          <el-button
            v-if="scope.row.orderStatus <= 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getList" />
    </div>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1280px" @close="handleClose" append-to-body>
      <el-form ref="form" :model="form" :inline="true" label-width="120px">
        <p style="width: 100%;border-bottom:1px solid rgb(234, 234, 234);font-size: 17px;line-height: 35px;">基础信息<i style="margin-left: 5px" class="el-icon-user-solid"></i></p>
        <el-form-item label="姓名" prop="userName">
            <el-input size="small" :disabled="true" v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unitName">
            <el-input size="small" :disabled="true" v-model="form.unitName"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
            <el-input size="small" v-model="form.department" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账户名称" prop="accountName">
            <el-input size="small" :disabled="true" v-model="form.accountName"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idNumber">
            <el-input size="small" v-model="form.idNumber" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="历史订单次数" prop="orderNum">
            <el-input size="small" :disabled="true" v-model="form.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
            <el-input type="number" size="small" v-model="form.phoneNumber" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input size="small" v-model="form.email" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="site">
            <el-input size="small" v-model="form.site" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="postcode">
            <el-input size="small" v-model="form.postcode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="传真" prop="fax">
            <el-input size="small" v-model="form.fax" :disabled="true"></el-input>
        </el-form-item>
        <p style="width: 100%;border-bottom:1px solid rgb(234, 234, 234);font-size: 17px;line-height: 35px;">其他信息<i style="margin-left: 5px" class="el-icon-user-solid"></i></p>
          <el-form-item label="单位性质" prop="unitNature">
            <el-select v-model="form.unitNature" size="small" :disabled="true" placeholder="请选择">
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
                    :disabled="true"
                    style="width:270px"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="form.unitSite"></el-input>
        </el-form-item>
        <el-form-item label="所属行业" prop="unitBusiness">
            <el-select v-model="form.unitBusiness" size="small" placeholder="请选择" :disabled="true">
                <el-option
                    v-for="item in industryList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="依托项目/课题" prop="research">
            <el-input style="width:270px" size="small" v-model="form.research" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="经费来源" prop="expenditure">
            <el-select v-model="form.expenditure" size="small" placeholder="请选择" :disabled="true">
                <el-option
                    v-for="item in moneySourceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="使用目的" prop="purpose">
            <el-select v-model="form.purpose" size="small" placeholder="请选择" :disabled="true">
                <el-option
                    v-for="item in targetList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input type="textarea"
                    v-if="form.purpose == '其他'"
                    :disabled="true"
                    style="width: 370px;margin-left: 30px;"
                    :rows="2"
                    placeholder="请输入其他内容"
                    v-model="form.targetOther"></el-input>
        </el-form-item>
        <el-form-item label="工作内容" prop="jobContent">
            <el-input type="textarea"
                    style="width:600px"
                    :rows="3"
                    :disabled="true"
                    placeholder="请输入工作内容"
                    v-model="form.jobContent"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <div :style="{'color': form.orderStatus == 30 ? '#67C23A' : form.orderStatus == 40? '#909399' : form.orderStatus == -10 ? '#F56C6C' : 'rgb(255,157,0)','font-weight':'bold'}">
            {{ form.orderStatus | orderStates }}
          </div>
        </el-form-item>
        <p style="width: 100%;border-bottom:1px solid rgb(234, 234, 234);font-size: 17px;line-height: 35px;">订单详情<i style="margin-left: 5px" class="el-icon-user-solid"></i></p>
            <div class="list">
          <ul style="overflow-y: auto;max-height: 400px;">
              <li v-for="item in form.orderDisplayList" :key="item.id">
                  <div class="cartItem">
                  <i class="el-icon-s-data" style="font-size: 36px;line-height:35px;vertical-align:middle;margin:0px 5px"></i>
                  <el-tag><span style="font-size: 17px;">{{ item.orderClasses }}</span></el-tag>
                    <div v-if="item.dataStat">
                      <p style="color: #888888;font-size: 14px;padding-left: 14px;">{{ item.dataDate }}</p>
                      <p style="color: green;padding-left: 14px;">{{ item.dataStat == 100 ? '数据完整' : '数据完整率：'+item.dataStat}}</p>
                    </div>
                      <div v-else style="font-size: 17px;padding-left: 20px;line-height: 30px;vertical-align: middle;">{{ item.classesStandby }}</div>
                  </div>
              </li>
          </ul>
      </div>
      </el-form>
    </el-dialog>
    <el-dialog title="处理记录" :visible.sync="open2" width="1000px" append-to-body>
      <div>
        <el-table
          v-loading="loading2"
          :data="recordList"
          height="500"
        >
        <el-table-column prop="user" label="处理人" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="recordTime" label="处理时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ new Date(scope.row.recordTime).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="record" label="说明" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="订单状态" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div :style="{'color': scope.row.orderStatus == 30 ? '#67C23A' : scope.row.orderStatus == 40? '#909399' :scope.row.orderStatus == -10 ? '#F56C6C' :'rgb(255,157,0)'}">
                {{ scope.row.orderStatus | orderStates }}
              </div>
            </template>
          </el-table-column>
      </el-table>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
  // import { Loading } from 'element-ui';
  import { getList, delList, getRecList } from "@/api/order";
  import { encode, decode } from '@/utils/base/dataEncry.js';
  import { getUser } from '@/utils/auth'
  // import { getIdList } from '@/api/workflow/audit'
  export default {
    data() {
      return {
        // 遮罩层
        loading: true,
        loading2: true,
        open2: false,
        open3: false,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        menuList: [],
        recordList: [],
        record: '',
        //是否可编辑
        isEdit: false,
        //列表数
        total: null,
        statusList: [  // 订单状态
          {
            value: -10,
            label: '已驳回'
          },
          {
            value: 0,
            label: '待审核'
          },
          {
            value: 10,
            label: '待处理'
          },
          {
            value: 20,
            label: '处理中'
          },
          {
            value: 30,
            label: '已办结'
          },
          {
            value: 40,
            label: '已关闭'
          }
        ],
        // 菜单选项
        typeList: [
          {
            value: 0,
            label: '数据目录'
          },
          {
            value: 1,
            label: '产品目录'
          },
          {
            value: 2,
            label: '技术服务目录'
          }
        ],
        // 弹出层标题
        title: "新增",
        // 是否显示弹出层
        open: false,
        // 是否展开，默认全部折叠
        isExpandAll: false,
        // 重新渲染表格状态
        refreshTable: true,
        isAdmin: false,
        userid: null,
        nickName: '',
        // 查询参数
        queryParams2: {
          pageNum: 1,
          pageSize: 10,
        },
        // 查询参数
        queryParams: {
          aName: undefined,
          orderStatus: null,
        },
        user: {},
        fieldId: '',
        userName: '',
        // 表单参数
        form: {
          userName: '',
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
          record: ''
        },
        props: {
          value: 'bClass',
          label: 'bClass',
          children: 'sClass'
        },
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
        deptName: '',
        userInfo: null,
        //状态过滤
        orderStatus: null,
      };
    },
    filters: {
      orderStates(val) {
        if(val == -10) return '已驳回'
        if(val == 0) return '待审核'
        if(val == 10) return '待处理'
        if(val == 20) return '处理中'
        if(val == 30) return '已办结'
        if(val == 40) return '已关闭'
      }
    },
    mounted() {
      this.userInfo = JSON.parse(getUser())
      this.getList({page:1,limit:10});
    },
    methods: {
      /** 查询菜单列表 */
     getList(data) {
      const self = this
      this.loading = true;
      let pages = {
          pageNum: data.page,
          pageSize: data.limit,
          userName: this.userInfo.userName,
        }
      getList(encode(pages)).then(res=>{
        let list = res.records
        self.menuList = list
        self.total = res.total
        self.loading = false;
      })
    },
      // 取消按钮
      cancel() {
        this.open = false;
        this.open3 = false;
        this.reset();
      },
      handleClose() {
        if(this.title != '详情'){
          this.getList({page:1,limit:10});
        }
      },
      handleRecord(row) {
        this.open2 = true
        this.loading2 = true
        let par = 'pageNum=1&pageSize=999&returnNum='+row.orderId
        getRecList(par).then(res=>{
          this.recordList = res.records
          this.loading2 = false
        })
      },
      handleInfo(row) {
        this.title = "详情";
        this.isEdit = false
        let par = {
          id: row.id
        }
        this.open = true;
        this.form = {
          ...row,
          record: ''
        }
      },
      changeStat(e) {
        this.getList({page:1,limit:10});
      },
      // 表单重置
      reset() {
        this.form = {
            userName: '',
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
            record: ''
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList({page:1,limit:10});
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const self = this
        self.$confirm('是否确认删除').then(function() {
          let par = {
            returnNum: row.orderId
          }
          delList(par).then(res=>{
            self.$modal.msgSuccess("删除成功");
            self.getList({page:1,limit:10});
          })
        })
      }
    }
  };
  </script>
<style scoped>
.info {
    padding-left:45px;
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.cartItem {
  display: flex;
    padding: 8px 15px;
    border-bottom: 1px solid #e1e1e1;
    background-color: rgb(249, 249, 251)
}
.contain {
  padding: 70px 8%;
}
.total {
    padding: 12px 5px;
    font-size: 16px;
    text-align: right;
}
ul li{
  list-style-type: none;
}
</style>
