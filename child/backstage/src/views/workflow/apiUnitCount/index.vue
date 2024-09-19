<template>
    <div class="app-container">
      <!-- <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="选择单位" prop="userName">
            <el-select v-model="selUnit" @change="changeUnit" size="small" placeholder="请选择单位">
                <el-option
                v-for="dict in unitList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
                />
            </el-select>
        </el-form-item>
      </el-form> -->
  
      <!-- <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['workflow:order:index']"
          >新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row> -->
      <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
        <!-- <el-tab-pane label="用户访问列表" name="user">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
      >
        <el-table-column prop="userName" label="用户名" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="userProvince" label="省份" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="loginTime" label="登入时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.loginTime? new Date(scope.row.loginTime).toLocaleString(): ''}}
          </template>
        </el-table-column>
        <el-table-column label="用户状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div :style="{'color': scope.row.userState == '在线' ? '#67C23A' : '#909399' }">
              {{ scope.row.userState }}
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
              v-hasPermi="['workflow:count:index']"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
              @pagination="getPageList" />
        </el-tab-pane> -->
        <el-tab-pane style="padding: 35px 5px" v-if="selUnit != '台网中心'" label="地球物理" name="precursor">
          <div>
            时间：<el-select v-model="dateType" @change="changeVal(null,selUnit+'定时API接口')" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dateTypeList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
          </div>
          <div class="title">同步记录数情况：</div>
          <div v-if="showChart" style="width:100%;padding: 20px 0px;">
            <lineChartApiCount :chart-data="lineChartData" :yList="xList" :typeList="classList" />
          </div>
          <div style="padding-left: 20px;font-size: 19px;">
            同步记录数：{{ dataNum }}
          </div>
            <div class="title">同步的数据内容：</div>
            <el-table
                v-loading="loading"
                :data="contentList"
            >
                <el-table-column prop="staName" label="台站" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="dataDate" label="数据时间" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{scope.row.dataDate? new Date(scope.row.dataDate).toLocaleString(): ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="netName" label="台网" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="dataStat" label="完整率" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="uPoint" label="测点" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="uFreq" label="采样率" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="u_item" label="测向及测向分量" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="uFreq" label="状态" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div style="color: #67C23A;">
                      正常
                    </div>
                  </template>
                </el-table-column>
            </el-table>
            <pagination :total="total3" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
              @pagination="getPageList" />
        </el-tab-pane>
        <el-tab-pane v-if="selUnit != '台网中心'" label="测震数据目录" name="service">
            <div style="float: right;padding-right:25px">
                <el-button type="primary" @click="checkLog" size="small">同步日志</el-button>
            </div>
            <div>
              时间：<el-select v-model="dateType" @change="changeVal(null,selUnit+'定时API接口')" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dateTypeList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
          </div>
          <div class="title">同步记录数情况：</div>
          <div v-if="showChart" style="width:100%;padding: 20px 0px;">
            <lineChartApiCount :chart-data="serviceLineData" :yList="['测震']" />
          </div>
          <div style="padding-left: 20px;font-size: 19px;">
            同步记录数：{{ dataNum }}
          </div>
            <div class="title">同步的数据内容：</div>
            <el-table
                v-loading="loading"
                :data="contentList"
            >
            <el-table-column prop="staName" label="台站" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="dataDate" label="数据时间" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{scope.row.dataDate? new Date(scope.row.dataDate).toLocaleString(): ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="dataStat" label="完整率" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="netName" label="台网" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="uFreq" label="状态" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div style="color: #67C23A;">
                      正常
                    </div>
                  </template>
                </el-table-column>
            </el-table>
            <pagination :total="total3" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
              @pagination="getPageList" />
        </el-tab-pane>
        <el-tab-pane v-if="selUnit == '台网中心'" label="速报目录pulsar" name="pulsar">
          <div class="title">速报目录</div>
          <div style="margin: 5px 0px 30px 0px">
            <el-table
              :data="pulsarList"
              stripe
              border
            >
              <el-table-column label="震级" prop="m" width="120" />
              <el-table-column label="发震时刻" prop="otime" width="180">
                <template slot-scope="scope">
                  <div>{{ new Date(scope.row.otime).toLocaleString() }}</div>
                </template>
              </el-table-column>
              <el-table-column label="纬度(°)" prop="lat" width="100">
                <template slot-scope="scope">
                  <div>{{ scope.row.lat }}</div>
                </template>
              </el-table-column>
              <el-table-column label="经度(°)" prop="lon" width="150">
                <template slot-scope="scope">
                  <div>{{ scope.row.lon  }}</div>
                </template>
              </el-table-column>
              <el-table-column label="深度(km)" prop="depth" width="150" />
              <el-table-column label="位置" prop="localName"></el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getSoonEarth" />
          </div>
            <div style="float: right;padding-right:25px">
                <el-button type="primary" @click="checkLog" size="small">同步日志</el-button>
            </div>
            <div>
              时间：<el-select v-model="dateType" @change="pulsarChange" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dateTypeList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
          </div>
          <div class="title">同步记录数情况：</div>
          <div v-if="showChart" style="width:100%;padding: 20px 0px;">
            <lineChartApiCount :chart-data="lineChartData" :yList="xList2" />
          </div>
          <div style="padding-left: 20px;font-size: 19px;">
            同步记录数：{{ dataNum }}
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="selUnit == '台网中心'" label="统一编目目录" name="cata">
          <div class="title">统一编目目录</div>
          <div style="margin: 5px 0px 30px 0px">
            <el-table
              :data="earthList"
              stripe
              border
            >
              <el-table-column label="震级" prop="m" width="120" />
              <el-table-column label="发震时刻" prop="occurTime" width="180">
                <!-- <template slot-scope="scope">
                  <div>{{ new Date(scope.row.occurTime).toLocaleString() }}</div>
                </template> -->
              </el-table-column>
              <el-table-column label="纬度(°)" prop="latitude" width="100">
                <template slot-scope="scope">
                  <div>{{ scope.row.latitude }}</div>
                </template>
              </el-table-column>
              <el-table-column label="经度(°)" prop="longitude" width="150">
                <template slot-scope="scope">
                  <div>{{ scope.row.longitude  }}</div>
                </template>
              </el-table-column>
              <el-table-column label="深度(km)" prop="depth" width="150" />
              <el-table-column label="位置" prop="location"></el-table-column>
              <el-table-column label="地震类型" prop="eqType" width="180" />
            </el-table>
            <pagination v-show="total1 > 0" :total="total1" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getSoonEarth" />
          </div>
            <div style="float: right;padding-right:25px">
                <el-button type="primary" @click="checkLog" size="small">同步日志</el-button>
            </div>
            <div>
              时间：<el-select v-model="dateType" @change="changeVal(null,'台网中心定时API接口')" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dateTypeList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
          </div>
          <div class="title">同步记录数情况：</div>
          <div v-if="showChart" style="width:100%;padding: 20px 0px;">
            <lineChartApiCount :chart-data="lineChartData" :yList="xList" />
          </div>
          <div style="padding-left: 20px;font-size: 19px;">
            同步记录数：{{ dataNum }}
          </div>
            <!-- <div class="title">同步的数据内容：</div>
            <el-table
                v-loading="loading"
                :data="contentList"
            >
                <el-table-column prop="name" label="内容" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="cTime" label="时间" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{scope.row.cTime? new Date(scope.row.cTime).toLocaleString(): ''}}
                    </template>
                </el-table-column>
            </el-table> -->
        </el-tab-pane>
        <el-tab-pane v-if="selUnit == '台网中心'" label="震源机制解目录" name="zyjz">
          <div style="margin: 5px 0px 30px 0px">
            <el-table
              :data="smsList"
              stripe
              border
            >
              <el-table-column label="速报震级" prop="magnitude" width="100" />
              <el-table-column label="Mw震级" prop="mwMagnitude" width="100" />
              <el-table-column label="发震时刻" prop="dateTime" width="180">
                <template slot-scope="scope">
                  <div>{{ new Date(scope.row.dateTime).toLocaleString() }}</div>
                </template>
              </el-table-column>
              <el-table-column label="纬度(°)" prop="latitude" width="100">
                <template slot-scope="scope">
                  <div>{{ scope.row.latitude }}</div>
                </template>
              </el-table-column>
              <el-table-column label="经度(°)" prop="longitude" width="100">
                <template slot-scope="scope">
                  <div>{{ scope.row.longitude  }}</div>
                </template>
              </el-table-column>
              <el-table-column label="深度(km)" prop="depth" width="85" />
              <el-table-column label="位置" prop="location">
              </el-table-column>
              <el-table-column label="断层面1走向" prop="trend1" width="70" />
              <el-table-column label="断层面2走向" prop="trend2" width="70" />
              <el-table-column label="断层面1倾角" prop="dipAngle1" width="70" />
              <el-table-column label="断层面1滑动角" prop="slidingAngle1" width="70" />
              <el-table-column label="断层面2倾角" prop="dipAngle2" width="70" />
              <el-table-column label="断层面2滑动角" prop="slidingAngle2" width="70" />
              <el-table-column label="矩心深度(KM）" prop="centroidDepth" width="70" />
            </el-table>
            <pagination v-show="total2 > 0" :total="total2" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getSoonEarth" />
          </div>
            <div style="float: right;padding-right:25px">
                <el-button type="primary" @click="checkLog" size="small">同步日志</el-button>
            </div>
            <div>
              时间：<el-select v-model="dateType" @change="changeVal(null,'台网中心定时API接口')" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dateTypeList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
          </div>
          <div class="title">同步记录数情况：</div>
          <div v-if="showChart" style="width:100%;padding: 20px 0px;">
            <lineChartApiCount :chart-data="lineChartData" :yList="xList" />
          </div>
          <div style="padding-left: 20px;font-size: 19px;">
            同步记录数：{{ dataNum }}
          </div>
            <!-- <div class="title">同步的数据内容：</div>
            <el-table
                v-loading="loading"
                :data="contentList"
            >
                <el-table-column prop="name" label="内容" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="cTime" label="时间" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{scope.row.cTime? new Date(scope.row.cTime).toLocaleString(): ''}}
                    </template>
                </el-table-column>
            </el-table> -->
        </el-tab-pane>
        <el-tab-pane v-if="selUnit == '台网中心'" label="震源机制解目录-西瓜皮" name="xgp">
          <div style="margin: 5px 0px 30px 0px">
            <el-table
              :data="xgpList"
              stripe
              border
            >
              <el-table-column label="发震地点" prop="location" />
              <el-table-column label="震级" prop="magnitude" width="100" />
              <el-table-column label="发震时刻" prop="originTime" width="180">
                <template slot-scope="scope">
                  <div>{{ new Date(scope.row.originTime).toLocaleString() }}</div>
                </template>
              </el-table-column>
              <el-table-column label="纬度(°)" prop="latitude" width="100">
                <template slot-scope="scope">
                  <div>{{ scope.row.latitude }}</div>
                </template>
              </el-table-column>
              <el-table-column label="经度(°)" prop="longitude" width="100">
                <template slot-scope="scope">
                  <div>{{ scope.row.longitude  }}</div>
                </template>
              </el-table-column>
              <el-table-column label="深度(km)" prop="focalDepth" width="100" />
              <el-table-column label="名称" prop="uploader" width="200" >
              </el-table-column>
              <el-table-column label="上传时间" prop="uploadTime" width="250" />
              <el-table-column label="下载链接" prop="surl" width="100">
                <template slot-scope="scope">
                  <a style="color:#409EFF" :href="scope.row.surl" target="_blank">下载</a>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total4 > 0" :total="total4" :page.sync="queryParams2.pageNum" :limit.sync="queryParams2.pageSize"
            @pagination="getSoonEarth" />
          </div>
            <div style="float: right;padding-right:25px">
                <el-button type="primary" @click="checkLog" size="small">同步日志</el-button>
            </div>
            <div>
              时间：<el-select v-model="dateType" @change="changeVal(null,'台网中心定时API接口')" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dateTypeList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
          </div>
          <div class="title">同步记录数情况：</div>
          <div v-if="showChart" style="width:100%;padding: 20px 0px;">
            <lineChartApiCount :chart-data="lineChartData" :yList="xList" />
          </div>
          <div style="padding-left: 20px;font-size: 19px;">
            同步记录数：{{ dataNum }}
          </div>
            <!-- <div class="title">同步的数据内容：</div>
            <el-table
                v-loading="loading"
                :data="contentList"
            >
                <el-table-column prop="name" label="内容" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="cTime" label="时间" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{scope.row.cTime? new Date(scope.row.cTime).toLocaleString(): ''}}
                    </template>
                </el-table-column>
            </el-table> -->
        </el-tab-pane>
      </el-tabs>
      <!-- 添加或修改菜单对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="1280px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="form.userName" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="省份" prop="userProvince">
                <el-input v-model="form.userProvince" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="IP地址" prop="userIp">
                <el-input v-model="form.userIp" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="20">``
              <el-form-item label="登入时间" prop="loginTime">
                <el-input v-model="form.loginTime" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="登出时间" prop="outTime">
                <el-input v-model="form.outTime" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="用户状态" prop="userState">
                <el-input v-model="form.userState" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
    
  <script>
    import { getList, getPVStat, getUVStat, getOnlineNum, getSubAll } from "@/api/workflow/count";
    import { getCountByQuarter, getCount } from "@/api/workflow/count"
    import { getEveList } from "@/api/workflow/bigEar"
    import { knowledgeCount } from "@/api/workflow/knowledge"
    import { listUser } from "@/api/system/user"
    import { seisserverApicount, seisserverOR, seisserverSMS, seisserverORList, 
      seisserverSMSList, getStationData, seisserverXGP, seisserverXGPList } from "@/api/workflow/selsmometry"
    import { ufProdCount, catalogProdCount, gnssProdCount, prodServeCount } from "@/api/workflow/prods"
    import { precataCount, predataList } from "@/api/workflow/underFluid"
    import { lawCount, standardCount } from "@/api/dataup/criterion"
    import { socialList, getField, getClassification, socialAdd, socialEdit, socialDel } from "@/api/workflow/directory";
    // import { getField } from "@/api/workflow/directory";
    import LineChart from '@/views/dashboard/LineChart'
    import lineChartApiCount from '@/views/dashboard/lineChartApiCount'
    import Treeselect from "@riophae/vue-treeselect";
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    import IconSelect from "@/components/IconSelect";
    import { encode, decode } from '@/utils/base/dataEncry.js';
    import PieChart from '@/views/dashboard/PieChart'
    import BarChart from '@/views/dashboard/BarChart'
  
    export default {
      name: "Menu",
      dicts: ['sys_show_hide', 'sys_normal_disable'],
      components: { Treeselect, IconSelect, LineChart, PieChart, BarChart, lineChartApiCount },
      data() {
        return {
          editor: null,
          toolbarConfig: { },
          mode: 'default', // or 'simple'
          selMon: '',
          // 遮罩层
          loading: true,
          showLog: false,
          // 显示搜索条件
          showSearch: true,
          // 菜单表格树数据
          menuList: [],
          //是否可编辑
          isEdit: false,
          //列表数
          total: 1,
          dataNum: 0,
          total2: 0,
          total3: 0,
          yearList: [],
          yearList2: [],
          monthList: [],
          monthList2: [],
          monthList3: [],
          dayList: [],
          pulsarList: [],
          seledType: [],
          seledTypeName: [],
          monList: [],
          xgpList: [],
          //柱状图x
          barxList:[],
          //柱状图y
          baryList:[],
          pielist:[],
          pieListAll: [],
          dateType: '年',
          dateTypeList: [
            {
              value: '年',
              label: '年(今日前一年)'
            },
            {
              value: '月',
              label: '月(今日前一月)'
            },
            {
              value: '周',
              label: '周(今日前一周)'
            },
          ],
          subType: 1,
          subType2: '',
          weekList: [
            {
              value: '第一周',
              label: '第一周'
            },
            {
              value: '第二周',
              label: '第二周'
            },
            {
              value: '第三周',
              label: '第三周'
            },
            {
              value: '第四周',
              label: '第四周'
            },
          ],
          unitList: [
            {
              value: '二测中心',
              label: '二测中心'
            },
            {
              value: '台网中心',
              label: '台网中心'
            },
            {
              value: '陕西局',
              label: '陕西局'
            },
            {
              value: '山东局',
              label: '山东局'
            },
            {
              value: '河北局',
              label: '河北局'
            }
          ],
          yearVal: new Date().getFullYear(),
          monthVal: (new Date().getMonth() +1) >= 10?(new Date().getMonth() +1):'0'+(new Date().getMonth() +1),
          dayVal: '第一周',
          monthVal2: (new Date().getMonth() +1) >= 10?(new Date().getMonth() +1):'0'+(new Date().getMonth() +1),
          yearVal2: new Date().getFullYear(),
          several: null,
          xList: [],  //x轴列表
          xList2: [],
          catalist: [],
          pieData: [],  //法规
          serviceLineData: [],
          selUnit: '',
          contentList: [
          ],
          prodOption: [
            {
              value: '地下流体',
              label: '地下流体'
            },
            {
              value: 'GNSS',
              label: 'GNSS'
            },
            {
              value: 'InSAR',
              label: 'InSAR'
            },
            {
              value: '地震区划图',
              label: '地震构造图'
            },
            {
              value: '地震活动断层',
              label: '地震活动断层'
            },
            {
              value: '工程抗震',
              label: '工程抗震'
            },
            {
              value: '地磁、地电、重力、定点形变',
              label: '地磁、地电、重力、定点形变'
            },
            {
              value: '地倾斜、地应变',
              label: '地倾斜、地应变'
            }
          ],
          viewType: '按每天',
          pietype: '月份',
          showLine: false,
          showLine2: false,
          activeName: 'precursor',
          statusList: [  // 订单状态
            {
              value: '完成',
              label: '完成'
            },
            {
              value: '待处理',
              label: '待处理'
            },
            {
              value: '已关闭',
              label: '已关闭'
            },
            {
              value: '其他',
              label: '其他'
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
          showPie: false,
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
            userName: null,
            pageNum: 1,
            pageSize: 10,
          },
          showChart: false,
          userlist: [],
          user: {},
          postGroup: {},
          fieldId: '',
          total4: 0,
          total1: 0,
          classificationId: '',
          // 表单参数
          form: {
            id: '',
            userName: '',
            userIp: '',
            userProvince: '',
            loginTime: '',
            outTime: '',
            userState: '',
          },
          classList: [],
          props: {
            value: 'bClass',
            label: 'bClass',
            children: 'sClass'
          },
          lineChartData: {
              qzd: [],
              dxlt: [],
              ddxb: [],
              gnss: [],
              sz: []
          },
          earthList: [],
          allpulsarList: [],
          smsList: [],
          sClassification: [],
          menuOptions: [],
          menuOptions2: [],
          lineChartData2: {
            newVisitis: {
              expectedData: [100, 120, 161, 134, 105, 160, 165],
              userNumData: [120, 82, 91, 154, 162, 140, 145]
            },
            messages: {
              expectedData: [200, 192, 120, 144, 160, 130, 140],
              userNumData: [180, 160, 151, 106, 145, 150, 130]
            },
            purchases: {
              expectedData: [80, 100, 121, 104, 105, 90, 100],
              userNumData: [120, 90, 100, 138, 142, 130, 130]
            },
            shoppings: {
              expectedData: [130, 140, 141, 142, 145, 150, 160],
              userNumData: [120, 82, 91, 154, 162, 140, 130]
            },
          },
          // 表单校验
          rules: {
            menuName: [
              { required: true, message: "菜单名称不能为空", trigger: "blur" }
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
        // this.getPageList({
        //   page: 1,
        //   limit: 10
        // });
      },
      mounted() {
        this.getCataList()
        this.selUnit = this.$route.query.unit
        this.changeVal(null,this.selUnit+'定时API接口')
        this.getSoonEarth({page:1,limit:10},1)
      },
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
      /** 查询学科列表 */
       getCataList(data) {
        let list = []
        let str = 'pageNum=1&pageSize=999'
          getSubAll(str).then(response => {
            list = response.records;
             list.map(item=>{
              this.catalist.push(item)
            })
          });
        },
        clearSel() {
          this.seledType = []
          this.catalist.forEach(item=>{
            document.getElementById(item.id).style = ''
          })
          this.seledType = []
          this.seledTypeName = []
        },
        pulsarChange() {
          let year = new Date().getTime() - 60*60*24*365*1000
          let month = new Date().getTime() - 60*60*24*30*1000
          let week = new Date().getTime() - 60*60*24*7*1000
          let arr = []
          if(this.dateType == '年') {
            this.allpulsarList.map(item=>{
              if(new Date(item.otime).getTime() > year){
                arr.push(item)
              }
            })
          }
          if(this.dateType == '月') {
            this.allpulsarList.map(item=>{
              if(new Date(item.otime).getTime() > month){
                arr.push(item)
              }
            })
          }
          if(this.dateType == '周') {
            this.allpulsarList.map(item=>{
              if(new Date(item.otime).getTime() > week){
                arr.push(item)
              }
            })
          }
          this.dataNum = arr.length
          this.lineChartData = [this.dataNum]
          this.xList2 = ['同步数量']
        },
        getSoonEarth(page,type) {
          console.log(page)
          let par = {
            pageNum: page.page,
            pageSize: page.limit,
          }
          if(this.activeName == 'cata' || type == 1){
            seisserverORList(par).then((res)=>{
              this.total1 = res.total
              this.earthList = [...res.records]
            })
          }
          if(this.activeName == 'zyjz' || type == 1){
            seisserverSMSList(par).then((res)=>{
              this.total2 = res.total
              this.smsList = [...res.records]
            })
          }
          if(this.activeName == 'xgp' || type == 1){
            seisserverXGPList(par).then(res=>{
              this.total4 = res.total
              this.xgpList = [...res.records]
            })
          }
          if(this.activeName == 'pulsar' || type == 1){
            getEveList({...par,m:''}).then(res=>{
              this.pulsarList = [...res.records]
              this.total = res.total
            })
            getEveList({
              pageNum: 1,
              pageSize: 99999,
              m:''
            }).then(res=>{
              this.allpulsarList = [...res.records]
            })
          }
        },

        changeProdType() {
          //地下流体
          if(this.subType2 == this.prodOption[0].value) {
            this.changeSub(1)
          }
          //GNSS、区划图、活断层等
          if(this.subType2 == this.prodOption[1].value || this.subType2 == this.prodOption[2].value ||
          this.subType2 == this.prodOption[3].value || this.subType2 == this.prodOption[4].value || 
          this.subType2 == this.prodOption[5].value) {
            this.gnssCount()
          }
          //地磁地电定点形变等
          if(this.subType2 == this.prodOption[6].value || this.subType2 == this.prodOption[7].value) {
            this.getCatalogCount()
          }
        },
        //获取用户列表
        getUserList() {
          listUser({pageNum:1,pageSize: 9999}).then(res=>{
            this.userlist = [...res.rows]
          })
        },
        selCata(item) {
          let par = ''
          let name = ''
          let date = this.yearVal2 + '-' + this.monthVal2
          if(!this.seledType.includes(item.id)){
            if(this.pietype == '季度'){
              date = this.yearVal2 + '-' + this.several
            }
            this.seledType.push(item.id)
            this.seledTypeName.push(item.sname)
            this.seledTypeName.map(itm=>{
              let name2 = itm
              if(name2 == '强震动'){
                name2 = '强震'
              }
              name += name2 + ';'
            })
            document.getElementById(item.id).style = 'background-color: rgb(200,200,200)'
            par = 'date='+date+'&disciplineKey='+name+'&type='+this.pietype
            getCountByQuarter(par).then(res=>{
              let data = []
              res.map(itm=>{
                if(itm.length != 0){
                  let data2 = []
                  itm.map(ite=>{
                    data2.push({
                      name: ite.distributeUnit,
                      value: ite.count
                    })
                  })
                  data.push(data2)
                }
              })
              this.pieListAll = data
              this.showPie = true
            })
          }else{
            document.getElementById(item.id).style = ''
            this.seledType.splice(this.seledType.indexOf(item.id),1)
            this.seledTypeName.splice(this.seledTypeName.indexOf(item.sname),1)
            name = ''
            this.seledTypeName.map(itm=>{
              name += itm + ';'
            })
            par = 'date='+date+'&disciplineKey='+name+'&type='+this.pietype
            getCountByQuarter(par).then(res=>{
              let data = []
              res.map(itm=>{
                if(itm.length != 0){
                  let data2 = []
                  itm.map(ite=>{
                    data2.push({
                      name: ite.distributeUnit,
                      value: ite.count
                    })
                  })
                  data.push(data2)
                }
              })
              this.pieListAll = data
              this.showPie = true
            })
          }
        },
        //地磁地电定点形变统计
        getCatalogCount() {
          this.barxList = []
          this.baryList = []
          let par = {year: this.yearVal,month: this.selMon}
          if(this.selMon == ''){
            delete(par.month)
          }
          catalogProdCount(encode(par)).then(res=>{
            res.map((item)=>{
              this.barxList.push(item.distribution_unit)
              this.baryList.push(item.count)
            })
          })
        },
        getSel(){
          //获取前五年列表
          let now = new Date().getFullYear()
          this.monthList = []
          this.yearList = []
          this.yearList2 = []
          this.dayList = []
          for(let i = parseInt(now) - 20; i<= parseInt(now); i++){
            this.yearList.push({
              label: i+'年',
              value: i
            })
          }
          for(let i = 2008; i<= parseInt(now); i++){
            this.yearList2.push({
              label: i+'年',
              value: i
            })
          }
          //获取月列表
          for(let i = 1;i<=12;i++){
            let month = i
            if(i<10){
              month  = '0' + i
            }
            if(now == this.yearVal){
              if(i<= new Date().getMonth()+1){
                this.monthList.push({
                  label: month+'月',
                  value: month
                })
              }
            }else {
              this.monthList.push({
                label: month+'月',
                value: month
              })
            }
          }
          this.monList = this.monthList.map(item=>{
            return item.value
          })
          this.monthList2 = this.monthList
          this.monthList3 = this.monthList
          //获取日列表
          let day = this.getDays(this.yearVal,this.monthVal)
          for(let i = 1;i<=day;i++){
            let d = i
            if(d<10){
              d='0'+i
            }
            if(this.yearVal == new Date().getFullYear() && this.monthVal == new Date().getMonth()+1){
              if(i <= new Date().getDate()){
                this.xList.push(d.toString())
                this.dayList.push({
                  label: d.toString(),
                  value: d.toString()
                })
              }
            }else{
              this.xList.push(d.toString())
              this.dayList.push({
                label: d.toString(),
                value: d.toString()
              })
            }
          }
        },
        // 选择图标
        selected(name) {
          this.form.icon = name;
        },
        handleItemChange(val) {
        },
        getClassificationName(data) {
          getClassification().then(res => {
           return res.filter((item)=>{
              if(item.id == data){
                return item.bClass + '/' + item.sClass
              }
            })
          })
        },
        //获取一个月内天数
        getDays(year, month) {
          var d = new Date(year, month, 0);
          return d.getDate();
        },
        //gnss产品统计
        gnssCount() {
          this.barxList = []
          this.baryList = []
          let par = {year: this.yearVal,month: this.selMon}
          if(this.selMon == ''){
            delete(par.month)
          }
          gnssProdCount(encode(par)).then(res=>{
            res.map((item)=>{
              this.barxList.push(item.send_unit)
              this.baryList.push(item.count)
            })
          })
        },
        changeVal3(e) {
          let allMon = []
          if(this.yearVal2 != new Date().getFullYear()){
            for(let i=1;i<=12;i++){
              let month = ''
              if(i<10){
                month = '0' + i
              }else{
                month = i.toString()
              }
              allMon.push({
                label: month,
                value: month
              })
            }
            this.monthList2 = allMon
          }else{
            this.monthList2 = this.monthList3
          }
          this.clearSel()
        },
        checkLog() {
           window.open('http://10.7.203.149:5601/app/kibana#/home')
        },
        changeYear(year) {
          if(this.subType == 1 && this.subType2 == '地下流体'){
            this.changeSub(1)
            return
          }
          //GNSS、区划图、活断层等
          if(this.subType == 1 && (this.subType2 == this.prodOption[1].value || this.subType2 == this.prodOption[2].value ||
          this.subType2 == this.prodOption[3].value || this.subType2 == this.prodOption[4].value || 
          this.subType2 == this.prodOption[5].value)) {
            this.gnssCount()
            return
          }
          //地磁地电定点形变等
          if(this.subType == 1 && (this.subType2 == this.prodOption[6].value || this.subType2 == this.prodOption[7].value)) {
            this.getCatalogCount()
            return
          }
          if(this.subType == 2){
            this.changeSub(2)
            return
          }
          if(this.subType == 4){
            this.changeSub(4)
            return
          }
          this.yearVal = year
          this.getbarData()
        },
        changeUnit(e) {

        },
        getPageList(page) {
          let par = {
            uploader: this.selUnit+'定时API接口',
            uploadPerson: this.selUnit+'定时API接口',
            getDays: this.dateType,
            uploadDate: this.dateType,
            pageNum: page.page,
            pageSize: page.limit
          }
          if(this.yearVal == '' && this.monthVal == '' && this.dayVal == ''){
            delete(par.getDays)
          }
          this.loading = true
          if(this.activeName == 'service'){
            delete(par.uploader)
            delete(par.getDays)
            delete(par.uploadDate)
            if(this.dateType != '年'){
             par.getDate = this.dateType
            }
            getStationData(encode(par)).then(res=>{
              this.loading = false
              this.contentList = decode(res).results
              this.total3 = decode(res).total
            })
        }
        console.log(this.activeName)
        if(this.activeName == 'precursor'){
          delete(par.uploadDate)
          delete(par.uploader)
          delete(par.getDays)
          if(this.dateType != '年'){
             par.getDate = this.dateType
            }
          predataList(encode(par)).then(resp=>{
            this.loading = false
            this.contentList = decode(resp).results
            this.total3 = decode(resp).total
          })
        }
        },
        changeVal(e,typeName) {
          let par = {
            uploader: typeName,
            uploadPerson: typeName,
            getDays: this.dateType,
            uploadDate: this.dateType,
            pageNum: 1,
            pageSize: 10
          }
          if(this.yearVal == '' && this.monthVal == '' && this.dayVal == ''){
            delete(par.getDays)
          }
          console.log(par)
          this.xList = []
          // this.getSel()
        setTimeout(() => {
            this.showChart = true
        }, 100);
        setTimeout(() => {
        }, 600);
        if(this.activeName == 'service'){
          seisserverApicount(par).then(res=>{
              this.loading = false
              this.dataNum = res
              this.xList = ['测震']
              this.serviceLineData = [res]
            })
            delete(par.uploader)
            delete(par.getDays)
            delete(par.uploadDate)
            if(this.dateType != '年'){
             par.getDate = this.dateType
            }
            getStationData(encode(par)).then(res=>{
              this.loading = false
              this.contentList = decode(res).results
              this.total3 = decode(res).total
            })
        }
        console.log(this.activeName)
        if(this.activeName == 'precursor'){
          precataCount(par).then(res=>{
            console.log(res)
            this.loading = false
            let data = [...res]
            let list = []
            data.forEach(itm=>{
              list.push(itm.number)
              this.xList.push(itm.itemName)
            })
            let num = 0
            res.map(i=>{
              num += parseInt(i.number)
            })
            this.dataNum = num
            this.lineChartData = [...list]
          })
          delete(par.uploadDate)
          delete(par.uploader)
          delete(par.getDays)
          if(this.dateType != '年'){
             par.getDate = this.dateType
            }
          predataList(encode(par)).then(resp=>{
            this.loading = false
            this.contentList = decode(resp).results
            this.total3 = decode(resp).total
          })
        }
        if(this.activeName == 'cata'){
          seisserverOR(par).then(res=>{
            this.loading = false
            this.dataNum = res
            this.xList = ['同步数量']
            this.lineChartData = [res]
          })
        }
        if(this.activeName == 'zyjz'){
          seisserverSMS(par).then(res=>{
            this.loading = false
            this.dataNum = res
            this.xList = ['同步数量']
            this.lineChartData = [res]
          })
        }
        if(this.activeName == 'xgp'){
          seisserverXGP(par).then(resp=>{
            this.loading = false
            this.dataNum = resp
            this.xList = ['同步数量']
            this.lineChartData = [resp]
          })
        }
        
        },
  
        //用户同时在线数
        changeVal2(e) {
          let par = 'year='+this.yearVal
          let data = []
          let monList = [] //有数据的月份
          let monList2 = []
          this.xList = []
          this.lineChartData.expectedData = []
          this.lineChartData.userNumData = []
          // this.getSel()
          //仅选年
          if(this.yearVal && !this.monthVal){
            getOnlineNum(par).then(res=>{
              data = res
              data.forEach(item=>{monList.push(item.date.split('-')[1])})
              this.xList = ['01','02','03','04','05','06','07','08','09','10','11','12']
              this.xList.forEach(item=>{
                if(monList.includes(item)){
                  let viewNum = 0
                  data.forEach(itm=>{
                    if(itm.date.split('-')[1] == item){
                      viewNum = itm.userOnlineNum
                      this.lineChartData.expectedData.push(viewNum)
                    }
                  })
                }else {
                  this.lineChartData.expectedData.push(0)
                }
              })
            })
          }
            //年月都选
            if(this.yearVal && this.monthVal && !this.dayVal){
              par = 'year='+this.yearVal+'&month='+this.monthVal
              getOnlineNum(par).then(res=>{
                data = res
                data.forEach(item=>{monList.push(item.date.split('-')[2])})
                this.xList.forEach(item=>{
                  if(monList.includes(item)){
                    let viewNum = 0
                    data.forEach(itm=>{
                      if(itm.date.split('-')[2] == item){
                        viewNum = itm.userOnlineNum
                        this.lineChartData.expectedData.push(viewNum)
                      }
                    })
                  }else {
                    this.lineChartData.expectedData.push(0)
                  }
                })
              })
            }
            //年月日都选
            if(this.yearVal && this.monthVal && this.dayVal){
              par = 'year='+this.yearVal+'&month='+this.monthVal+'&day='+this.dayVal
              this.xList = []
              monList = []
              this.lineChartData.expectedData = []
              getOnlineNum(par).then(res=>{
                data = res
                data.forEach(item=>{monList.push(item.date.split(' ')[1])})
                let hours = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13',
                '14','15','16','17','18','19','20','21','22','23']
                this.xList = hours
                hours.forEach(item=>{
                  if(monList.includes(item)){
                    let viewNum = 0
                    data.forEach(itm=>{
                      if(itm.date.split(' ')[1] == item){
                        viewNum = itm.userOnlineNum
                        this.lineChartData.expectedData.push(viewNum)
                      }
                    })
                  }else {
                    this.lineChartData.expectedData.push(0)
                  }
                })
              })
            }
        },
        changeSub(e) {
          if(e == 1){
            this.barxList = []
            this.baryList = []
            let par = {year: this.yearVal,month: this.selMon}
            if(this.selMon == ''){
              delete(par.month)
            }
            ufProdCount(encode(par)).then(res=>{
              res.map((item)=>{
                this.barxList.push(item.send_unit)
                this.baryList.push(item.count)
              })
            })
          }
          if(e == 2){
            this.barxList = []
            this.baryList = []
            let par = {year: this.yearVal,month: this.selMon}
            if(this.selMon == ''){
              delete(par.month)
            }
            prodServeCount(encode(par)).then(res=>{
              res.map((item)=>{
                this.barxList.push(item.c_unit)
                this.baryList.push(item.count)
              })
            })
          }
          if(e == 3){
            this.pieData = []
            lawCount().then(res=>{
              console.log(res)
              this.pieData.push({ value: res, name: '法规数据总数' })
            })
            standardCount().then(res=>{
              console.log(res)
              this.pieData.push({ value: res, name: '标准数据总数' })
            })
          }
          if(e == 4){
            this.barxList = []
            this.baryList = []
            let par = {year: this.yearVal,month: this.selMon}
            if(this.selMon == ''){
              delete(par.month)
            }
            knowledgeCount(encode(par)).then(res=>{
              let deptName = ''
              console.log(this.userlist)
              res.map((item)=>{
                this.userlist.map(itm=>{
                  if(item.uploader == itm.userName && itm.dept.deptName){
                    deptName = itm.dept.deptName
                  }
                })
                this.barxList.push(deptName)
                this.baryList.push(item.count)
              })
            })
          }
        },
  
        tabChange(e) {
            this.showChart = false
            this.changeVal(null,this.selUnit+'定时API接口')
            setTimeout(() => {
                this.showChart = true
                this.pulsarChange()
            }, 100);
        },
        uploadImg() {
          // 修改 uploadImage 菜单配置
  
        },
        changeMonth(mon) {
          if(this.subType == 1 && this.subType2 == '地下流体'){
            this.changeSub(1)
            return
          }
          //GNSS、区划图、活断层等
          if(this.subType == 1 && (this.subType2 == this.prodOption[1].value || this.subType2 == this.prodOption[2].value ||
          this.subType2 == this.prodOption[3].value || this.subType2 == this.prodOption[4].value || 
          this.subType2 == this.prodOption[5].value)) {
            this.gnssCount()
            return
          }
          //地磁地电定点形变等
          if(this.subType == 1 && (this.subType2 == this.prodOption[6].value || this.subType2 == this.prodOption[7].value)) {
            this.getCatalogCount()
            return
          }
          if(this.subType == 2){
            this.changeSub(2)
            return
          }
          if(this.subType == 4){
            this.changeSub(4)
            return
          }
          this.selMon = mon
          this.getbarData()
        },
      getbarData() {
        let par = this.yearVal
        this.barxList = []
        this.baryList = []
        if(this.selMon != ''){
          par += '-'+this.selMon
        }
        getCount('year='+par).then(res=>{
          res.map((ite,index)=>{
            res[index].forEach(item=>{
              this.barxList.push(item.distributeUnit)
              this.baryList.push(item.count)
            })
          })
        })
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
          this.showLog = false
          this.reset();
        },
        handleInfo(row) {
          this.title = "详情";
          this.open = true;
          this.form = row
          this.form.loginTime = new Date(this.form.loginTime).toLocaleString()
          this.form.outTime = new Date(this.form.outTime).toLocaleString()
        },
        // 表单重置
        reset() {
          this.form = {
            id: '',
            aType: '',
            aName: '',
            userName: '',
            classification: '',
            stime: '',
            status: '',
            status2: ''
          };
          this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
          this.getPageList({
            page: 1,
            limit: 10
          });
        },
        /** 重置按钮操作 */
        resetQuery() {
          this.resetForm("queryForm");
          this.handleQuery();
        },
        getSelData() {
          let bClass = []
          let sClass = []
          let bClass2 = []
          this.menuOptions2 = []
          this.menuOptions = []
          getClassification().then(res => {
            res.map(item => {
              bClass2.push(item.bClass)
            })
            bClass2 = Array.from(new Set(bClass2))
            bClass2.forEach((itm,index) => {
              this.menuOptions2.push({
                bClass: itm
              })
            })
          })
  
          getField().then(res => {
            res.map(item => {
              bClass.push(item.bClass)
              sClass.push({bClass: item.sClass})
            })
            bClass = Array.from(new Set(bClass))
            bClass.forEach((itm,index) => {
              if(index == 0){
                this.menuOptions.push({
                  bClass: itm,
                  sClass: sClass.slice(0,7)
                })
              }
              if(index == 1){
                this.menuOptions.push({
                  bClass: itm,
                  sClass: sClass.slice(7,13)
                })
              }
              if(index == 2){
                this.menuOptions.push({
                  bClass: itm,
                  sClass: sClass.slice(13,17)
                })
              }
              if(index == 3){
                this.menuOptions.push({
                  bClass: itm,
                  sClass: sClass.slice(17,21)
                })
              }
              if(index == 4){
                this.menuOptions.push({
                  bClass: itm,
                  sClass: sClass.slice(21,27)
                })
              }
            })
          })
        },
        /** 新增按钮操作 */
        handleAdd() {
          this.reset();
          this.getSelData()
            this.open = true;
            this.title = "新增";
            this.isEdit = true
        },
        handle(item) {
          if(item.status != '待处理'){
            this.$message({
            message: '订单已处理',
            type: 'warning'
          });
            return
          }
          this.form = item
          this.isEdit = true
          this.open = true;
          this.title = "订单处理";
        },
        /** 展开/折叠操作 */
        toggleExpandAll() {
          this.refreshTable = false;
          this.isExpandAll = !this.isExpandAll;
          this.$nextTick(() => {
            this.refreshTable = true;
          });
        },
        /** 提交按钮 */
        submitForm: function(type) {
          if (this.title == "订单处理") {
            if(type == 1){
              this.menuList.forEach(item=>{
                if(this.form.id == item.id){
                  item.status = '完成'
                }
              }) 
            }else if(type == 3){
              this.menuList.forEach(item=>{
                if(this.form.id == item.id){
                  item.status = this.form.status != '其他'?this.form.status:this.form.status2
                }
              }) 
            }else {
              this.menuList.forEach(item=>{
                if(this.form.id == item.id){
                  item.status = '已关闭'
                }
              })
            }
              this.$modal.msgSuccess("订单处理成功");
              this.open = false;
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
          const self = this
          this.$modal.confirm('是否确认删除"' + row.aName+'"').then(function() {
            self.menuList.forEach((item,index)=>{
              if(row.id == item.id){
                self.menuList.splice(index,1)
              }
            })
            self.$modal.msgSuccess("删除成功");
          })
        }
      }
    };
    </script>
  <style src="@wangeditor/editor/dist/css/style.css"></style>
  <style lang="css">
  .selCata {
    width: 100%;
    margin: 20px 0px;
    padding: 0px 60px;
    display: flex;
    flex-wrap: wrap;
  }
  .selCata div{
      margin: 5px 8px;
      cursor: pointer;
    }
  .selCata div:hover{
    font-weight: bold;
  }
  .selType {
    font-size: 18px;
    padding: 15px 10px;
  }
  .tab {
    width: 500px;
    display: flex;
    justify-content: flex-start;
  }
  .title {
    padding: 20px 0px;
    font-weight: bold;
  }
  </style>
  