<template>
  <div class="profession">
    <div class="container">
      <el-dialog :visible.sync="open" width="75%">
        <div style="margin-top: 10px">
          <el-table
          :data="professionList"
          style="width: 100%;font-size: 17px;"
          >
            <el-table-column
              prop="name"
              label="专业网站名称">
            </el-table-column>
            <el-table-column
              prop="url"
              label="链接">
              <template slot-scope="scope">
                <a class="url" :href="scope.row.url" target="_blank">
                  {{ scope.row.url }}
                </a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <!-- <i class="el-icon-arrow-left before" @click="changShow"></i>
      <i class="el-icon-arrow-right after" @click="changShow"></i> -->
      <div class="header">
        <img src="@/assets/images/hand.png" alt="" />
        <h3>专业服务</h3>
      </div>
      <!-- <div class="item-row" style="margin-top:25px;">
        <div class="welfare-item welfare-big" @click="toUrl('https://www.gb18306.net/')" style="box-shadow: 1px 1px 10px 1px #bfbfbf;">
      <div class="welfare-bg bg-one3">
        <div class="welfare-text">
            <div class="welfare-title welfare-title3">地震动参数区划图</div>
            <div>
              <img class="icon" src="../../../src/assets/images/qht.png" />
            </div>
            <div class="info">查看详情<i class="el-icon-d-arrow-right"></i></div>
          <div class="welfare-tips">
            <div class="welfare-details welfare-long">
              <p>为深入贯彻落实中国地震局党组关于震灾预防体制机制改革的部署，理顺震防中心、各研究所和省级地震局相关工作体制，强化业务中心对事业发展的业务支撑能力、对省局的业务指导能力和对社会的服务能力，根据《地震灾害风险防治体制改革顶层设计方案》要求，依托中国地震灾害防御中心成立地震活动断层探察数据中心及专家组，构建全新的业务管理体系。2019年8月，按照《关于加强地震活动断层探察管理工作的通知》要求，中国地震灾害防御中心成立了“地震活动断层数据中心。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
      <div class="welfare-item welfare-big" @click="toUrl('https://www.gb18306.net/')" style="box-shadow: 0px 0px 10px 1px #bfbfbf;">
      <div class="welfare-bg bg-one bg4">
        <div class="welfare-text">
          <div class="welfare-title">中国地震区划分图</div>
          <div class="info">查看详情<i class="el-icon-d-arrow-right"></i></div>
          <div class="welfare-tips">
            <div class="welfare-details welfare-long">
              <p>地震区划图是根据国家抗震设防需要和当前的科学技术水平，以地震烈度或地震动参数为指标，按照长时期内各地可能遭受的地震危险程度，将全国划分为不同抗震设防要求区域的图件及相关规定。它是随着国民经济的发展和地震科技不断发展的必然产物，广泛应用于一般建设工程的规划选址和抗震设防，同时也是编制社会经济发展规划、国土利用规划、防震减灾规划、城乡规划，以及地震监测设施建设、社会防御措施制定和应急准备等防震减灾各项工作的基础依据。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="welfare-item welfare-big" @click="toUrl('https://www.gb18306.net/')" style="box-shadow: 0px 0px 10px 1px #bfbfbf;">
      <div class="welfare-bg bg-one2">
        <div class="welfare-text">
          <div class="welfare-title welfare-title3">中国地震动参数区划图查询系统</div>
          <div>
              <img class="icon" style="width:75px;height:75px;" src="../../../src/assets/images/check.png" />
            </div>
            <div class="info">查看详情<i class="el-icon-d-arrow-right"></i></div>
          <div class="welfare-tips">
            <div class="welfare-details welfare-long">
              <p>为深入贯彻落实中国地震局党组关于震灾预防体制机制改革的部署，理顺震防中心、各研究所和省级地震局相关工作体制，强化业务中心对事业发展的业务支撑能力、对省局的业务指导能力和对社会的服务能力，根据《地震灾害风险防治体制改革顶层设计方案》要求，依托中国地震灾害防御中心成立地震活动断层探察数据中心及专家组，构建全新的业务管理体系。2019年8月，按照《关于加强地震活动断层探察管理工作的通知》要求，中国地震灾害防御中心成立了“地震活动断层数据中心。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->

  <div class="item-row" style="margin-top:25px;">
    <div class="welfare-item welfare-big" v-for="(item,index) in list.slice(0,3)" :key="item.id" @click="toUrl(item.url)" style="box-shadow: 0px 0px 10px 1px #bfbfbf; margin: 10px">
      <div class="welfare-bg bg-one2" :style="{'backgroundImage': `url(${item.photoUrl})`,backgroundPosition: 'center center'}" @mouseenter="active(index+1)" @mouseleave="active(0)">
        <div class="welfare-text">
          <div class="welfare-title welfare-title2" v-if="type != index+1">{{ item.deptName }}</div>
          <div class="info" v-if="type != index+1">查看详情<i class="el-icon-d-arrow-right"></i></div>
          <div class="welfare-tips">
            <div class="welfare-details welfare-long">
              <p>{{ item.descrip }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div class="item-row">
      <div class="welfare-item welfare-big" v-for="(item,index) in list.slice(3,5)" :key="item.id" @click="toUrl(item.url)" style="box-shadow: 0px 0px 10px 1px #bfbfbf; margin: 10px">
      <div class="welfare-bg bg-one2" :style="{'backgroundImage': `url(${item.photoUrl})`}" @mouseenter="active(index+4)" @mouseleave="active(0)">
        <div class="welfare-text">
          <div class="welfare-title welfare-title2" v-if="type != index+4">{{ item.deptName }}</div>
          <div class="info" v-if="type != index+4">查看详情<i class="el-icon-d-arrow-right"></i></div>
          <div class="welfare-tips">
            <div class="welfare-details welfare-long">
              <p>{{ item.descrip }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="welfare-item welfare-big" @click="more" style="box-shadow: 0px 0px 10px 1px #bfbfbf; margin: 10px">
      <div class="welfare-bg">
        <div class="welfare-text">
          <div class="welfare-title welfare-title3">更多</div>
            <div style="margin-top: 15px">
              <img class="icon" style="width:65px;height:65px;" src="../../../src/assets/images/more.png" />
            </div>
          <div class="welfare-tips">
            <div class="welfare-details welfare-long">
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <!-- <div class="welfare-item welfare-big" @click="toUrl('http://www.activefault-datacenter.cn/')" style="box-shadow: 0px 0px 10px 1px #bfbfbf;">
      <div class="welfare-bg bg-one2 bg" @mouseenter="active(1)" @mouseleave="active(0)">
        <div class="welfare-text">
          <div class="welfare-title welfare-title2" v-if="type != 1">地震活动断层</div>
          <div class="info" v-if="type != 1">查看详情<i class="el-icon-d-arrow-right"></i></div>
          <div class="welfare-tips">
            <div class="welfare-details welfare-long">
              <p>国内数据主要来源于第五代地震区划图基础数据（1：250万），国外数据主要来源于GEM全球活动断层数据库和俄罗斯科学院地质研究所AFEAD欧亚活动断层数据库，遵循CC BY-SA 4.0版权协议。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="welfare-item welfare-big" @click="toUrl('http://10.7.71.11/')" style="box-shadow: 0px 0px 10px 1px #bfbfbf;">
      <div class="welfare-bg bg-one2" @mouseenter="active(2)" @mouseleave="active(0)">
        <div class="welfare-text">
          <div class="welfare-title welfare-title3" v-if="type != 2">全国测震站网数据共享服务</div>
            <div v-if="type != 2">
              <div class="infoCenter">
                <img class="icon" style="width:75px;height:75px;" src="../../../src/assets/images/share.png" />
                <div class="introText">全国测震基础数据、产品数据、模拟地震资料数据共享服务平台</div>
              </div>
            </div>
            <div class="info" v-if="type != 2" style="color: #000;">查看详情<i class="el-icon-d-arrow-right"></i></div>
          <div class="welfare-tips">
            <div class="welfare-details welfare-long">
              <p>提供测震台网（站）或台阵产出的原始记录、次生数据以及相关基础数据和辅助数据共享服务。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="welfare-item welfare-big" @click="toUrl('http://10.7.71.12/')" style="box-shadow: 0px 0px 10px 1px #bfbfbf;">
      <div class="welfare-bg bg-one2 bg2" @mouseenter="active(3)" @mouseleave="active(0)">
        <div class="welfare-text">
          <div class="welfare-title welfare-title2" v-if="type != 3">中国大陆现今三维地壳运动产品服务平台</div>
          <div class="info" v-if="type != 3">查看详情<i class="el-icon-d-arrow-right"></i></div>
          <div class="welfare-tips">
            <div class="welfare-details welfare-long">
              <p>多尺度、高分辨率、高精度的区域三维地壳运动速度场和同震变形场等形变监测成果，为中国大陆地壳运动与变形的动力学理论研究、地震预测探索、防灾减灾、环境保护、公共安全等方面提供重要的基础数据服务。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="item-row">
      <div class="welfare-item welfare-big" @click="toUrl('https://www.gb18306.net/')" style="box-shadow: 0px 0px 10px 1px #bfbfbf;">
      <div class="welfare-bg bg-one2" @mouseenter="active(4)" @mouseleave="active(0)">
        <div class="welfare-text">
          <div class="welfare-title welfare-title3" v-if="type != 4">中国地震动参数区划图</div>
          <div v-if="type != 4">
            <div class="infoCenter">
                <img class="icon" style="width:75px;height:75px;" src="../../../src/assets/images/sanwei.png" />
                <div class="introText">科学提高地震灾害综合防范能力，保障社会经济安全发展</div>
              </div>
            </div>
            <div class="info" v-if="type != 4" style="color: #000;">查看详情<i class="el-icon-d-arrow-right"></i></div>
          <div class="welfare-tips">
            <div class="welfare-details welfare-long">
              <p>地震区划图是根据国家抗震设防需要和当前的科学技术水平，以地震烈度或地震动参数为指标，按照长时期内各地可能遭受的地震危险程度，将全国划分为不同抗震设防要求区域的图件及相关规定。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="welfare-item welfare-big" @click="toUrl('https://news.ceic.ac.cn/index.html?time=1676595305')" style="box-shadow: 0px 0px 10px 1px #bfbfbf;">
      <div class="welfare-bg bg-one2 bg3" @mouseenter="active(5)" @mouseleave="active(0)">
        <div class="welfare-text">
          <div class="welfare-title welfare-title2" style="color:#fff !important" v-if="type != 5">数据共享中心</div>
          <div class="info" v-if="type != 5">查看详情<i class="el-icon-d-arrow-right"></i></div>
          <div class="welfare-tips">
            <div class="welfare-details welfare-long">
              <p>数据共享中心是中国地震局直属事业单位,它是我国防震减灾工作的重要业务枢纽、核心技术平台和基础信息国际交流的重要窗口。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
      <!-- <div class="main" @click="toUrl('https://www.gb18306.net/')" v-if="show">
        <div class="left">
          <h3>中国地震区划分图</h3>
        </div>
        <div class="right">
          <p>
            <span style="font-weight:bold">地震区划图</span
            >是根据国家抗震设防需要和当前的科学技术水平，以地震烈度或地震动参数为指标，按照长时期内各地可能遭受的地震危险程度，将全国划分为不同抗震设防要求区域的图件及相关规定。它是随着国民经济的发展和地震科技不断发展的必然产物，广泛应用于一般建设工程的规划选址和抗震设防，同时也是编制社会经济发展规划、国土利用规划、防震减灾规划、城乡规划，以及地震监测设施建设、社会防御措施制定和应急准备等防震减灾各项工作的基础依据。
          </p>
          <el-button type="primary" size="mini">查看详情</el-button>
        </div>
      </div>
      <div class="main" @click="toUrl('http://activefault-datacenter.cn/')" v-else>
        <div class="left bg">
          <h3 style="color: #fff">地震活动断层数据服务</h3>
        </div>
        <div class="right">
          <p><span style="font-weight:bold">介绍</span></p>为深入贯彻落实中国地震局党组关于震灾预防体制机制改革的部署，理顺震防中心、各研究所和省级地震局相关工作体制，强化业务中心对事业发展的业务支撑能力、对省局的业务指导能力和对社会的服务能力，根据《地震灾害风险防治体制改革顶层设计方案》要求，依托中国地震灾害防御中心成立地震活动断层探察数据中心及专家组，构建全新的业务管理体系。2019年8月，按照《关于加强地震活动断层探察管理工作的通知》要求，中国地震灾害防御中心成立了“地震活动断层数据中心”。
          <el-button type="primary" size="mini">查看详情</el-button>
        </div>
      </div> -->
  </div>
</template>

<script>
import { encode,decode } from '@/utils/base/dataEncry';
import { industry } from '@/api/shikuang'
export default {
  data() {
    return {
      list: [],
      show: true,
      isActive: false,
      type: 0,
      open: false,
      professionList: [
        {
          name: '中国地震动参数区划图',
          url: 'https://www.gb18306.net/',
          icon: require('@/assets/images/dzd.png')
        },
        {
          name: '地震活动断层数据服务',
          url: 'http://www.activefault-datacenter.cn/',
          icon: require('@/assets/images/img2.png')
        },
        {
          name: '全国测震站网数据共享服务',
          url: 'http://10.7.71.11/',
          icon: require('@/assets/images/czzw.png')
        },
        {
          name: '地震监测数据质量监控与评价',
          url: 'http://10.7.208.178/',
          icon: require('@/assets/images/dzjc.png')
        },
        {
          name: '中国大陆现今三维地壳运动产品服务平台',
          url: 'http://10.7.71.12/',
          icon: require('@/assets/images/zgdl.png')
        },
        {
          name: '数据共享中心',
          url: 'https://news.ceic.ac.cn/index.html?time=1676595305',
          icon: require('@/assets/images/sjgx.png')
        },
        {
          name: '国家地震科学数据中心',
          url: 'https://data.earthquake.cn/',
          icon: require('@/assets/images/dzkx.png')
        },
        {
          name: '模拟资料',
          url: 'http://10.7.207.86:8078/#/analogRecords',
          icon: require('@/assets/images/mnzl.png')
        },
        {
          name: '地震科学数据中心',
          url: 'http://www.esdc.ac.cn',
          icon: require('@/assets/images/mnzl.png')
        },
        {
          name: '重力站网数据产品',
          url: 'http://10.5.80.55/gravity/home',
          icon: require('@/assets/images/zlzw.png')
        },
        {
          name: 'GNSS数据产品服务平台',
          url: 'http://10.5.107.70/',
          icon: require('@/assets/images/gnss.png')
        },
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    changShow() {
      this.show = !this.show
    },
    toUrl(url) {
      window.open(url)
    },
    getList() {
      industry(encode({pageNum: 1,pageSize: 5})).then(res=>{
        this.list = decode(res)
      })
    },
    more() {
      this.$router.push({name: 'specialList',params: {list: JSON.stringify(this.professionList)}})
    },
    //显示详情文字
    active(type) {
      this.type = type
    }
  }
}
</script>

<style lang="less" scoped>
.profession {
  background-color: #f2f3f3;
  width: 100%;
  .container {
    position: relative;
    width: 85%;
    margin: auto;
    padding: 20px;
    .header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 30px;
      img {
        width: 30px;
        height: 30px;
        transform: rotateZ(-40deg);
      }
      h3 {
        margin-left: 5px;
        height: 20px;
        color: #3d4e89;
        font-size: 21px;
      }
    }
    .main {
      display: flex;
      padding: 10px;
      .left {
        width: 55%;
        height: 245px;
        margin-right: 20px;
        background: url(@/assets/images/img1.png) no-repeat center center;
        background-size: 100% 100%;
        text-align: center;
        line-height: 245px;
        color: #ff6900;
        font-size: 22px;
      }
      .right {
        position: relative;
        padding: 10px;
        flex: 1;
        font-size: 16px;
        text-indent: 2em;
        line-height: 160%;
        letter-spacing: 1px;
        color: #707175;
        small {
          font-weight: 700;
        }
        .el-button {
          position: absolute;
          bottom: 0;
          right: 10px;
        }
      }
      .bg {
        background: url(@/assets/images/img2.png) no-repeat center center;
      }
    }
  }
  .before {
    cursor: pointer;
    position: absolute;
    font-size: 20px;
    width: 50px;
    height: 50px;
    background-color: #e8e8eb;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    top: 50%;
    transform: translateY(-50%);
    left: -50px;
  }
  .after {
    position: absolute;
    cursor: pointer;
    right: -50px;
    font-size: 20px;
    width: 50px;
    height: 50px;
    background-color: #e8e8eb;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    top: 50%;
    transform: translateY(-50%);
  }
  .url {
    text-align: center;
    color: #0099ff;
  }
  .bg {
        background: no-repeat center center !important;
      }
      .bg2 {
        background: url(@/assets/images/sanweiimg.png) no-repeat center center !important;
        background-size: cover !important;
      }
      .bg3 {
        background: url(@/assets/images/zgdztw.png) no-repeat center center !important;
        background-size: cover !important;
      }
      .bg4 {
        background: url(@/assets/images/img1.png) no-repeat center center;
      }

  .bg-one2::after {
    background: #0099ff;
    opacity: 1;
  }
  .bg-one3::after {
    background: #0099ff;
    opacity: 1;
  }
  .item-row {
    display: flex;
    justify-content: center;
  }
  .welfare-item {
      height: 250px;
      overflow: hidden;
  }
  .welfare-item .welfare-bg::after {
      content: "";
      display: inline-block;
      width: 100%;
      height: 280px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      transform: translate(0, 280px);
      transform-origin: bottom;
      transition: all .5s cubic-bezier(0.2, 0.0, 0.2, 1);
  }
    .welfare-item .welfare-bg.bg-move {
        background: rgba(155, 38, 182, 0.5)
    }
    .welfare-bg:hover::after,
    .welfare-bg::after {
        transform: translate(0, 0);
    }
    .welfare-bg {
      position: relative;
      cursor: pointer;
      width: 100%;
      height: 250px;
      box-sizing: border-box;
      overflow: hidden;
      transition: .5s top cubic-bezier(0.2, 0, 0.2, 1);
      background-size: 100% 100%;
    }
    .welfare-item .welfare-details {
      opacity: 0;
      position: relative;
      width: 92.765%;
      height: 100%;
      z-index: 4;
      padding-left: 25px;
      font-size: 18px;
      text-align: left;
      color: #FFFFFF;
      line-height: 24px;
      transform: translate(0, 80px);
      transform-origin: bottom;
      transition: transform .5s cubic-bezier(0.2, 0.0, 0.2, 1), opacity .3s cubic-bezier(0.2, 0.0, 0.2, 1);
}
.welfare-item.welfare-big:hover .welfare-details {
    opacity: 1;
    transform: translate(0, 0);
}
  .bg-one::after {
    background: #ffaa00;
    opacity: 0.85;
  }
  .welfare-title2 {
    color: #000000 !important;
    background-color: rgba(255,255,255,0.7);
  }
  .welfare-title3 {
    color: #000000 !important;
    width: 100%;
  }
  .welfare-item.welfare-big {
    width: 26%;
}
  .welfare-text {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 28px;
    text-align: center;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 26px;
    z-index: 2;
    box-sizing: border-box;
    .welfare-title {
      display: inline-block;
      width: 100%;
      margin-bottom: 15px;
      font-size: 25px;
      color: #000000;
      line-height: 32px;
      // padding-left: 25px;
      // padding-right: 30px;
      padding: 5px 30px 5px 25px;
      box-sizing: border-box;
    }
    .infoCenter {
      width: 90%;
      display: flex;
      justify-content: center;
      margin-top: 8px;
      .icon {
        width: 80px;
        height: 80px;
      }
      .introText {
        width: 180px;
        color: #727272;
        line-height: 22px;
        font-size: 15px;
        text-align: left;
        padding-left: 8px;
        padding-top: 5px;
      }
    }

    .info {
      text-align: right;
      position: absolute;
      bottom: 30px;
      right: 50px;
      color: #ffffff;
    }
    .welfare-tips {
      letter-spacing: -.035em;
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      font-size: 16px;
      color: #FFFFFF;
      line-height: 26px;
      margin: 0;
      padding: 0;
      vertical-align: middle;
      font-family: inherit;
      outline: none;
    }
}
}
</style>
