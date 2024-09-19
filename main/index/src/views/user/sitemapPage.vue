<template>
  <div class="sitemap">
    <div class="box commom">
      <div class="title">
        <p><i class="el-icon-s-home"></i>首页 / 网站地图</p>
      </div>
      <div class="main">
        <div class="contain">
          <div class="top"><h3>网站首页</h3></div>
          <ul>
            <li
              v-for="item in home"
              :key="item.name"
              @click="routePath(item.path)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="contain">
          <div class="top"><h3>数据服务</h3></div>
          <ul>
            <li
              v-for="item in service"
              :key="item.name"
              @click="routePath(item.path)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="contain">
          <div class="top"><h3>综合实况</h3></div>
          <ul>
            <li
              v-for="item in shikuang"
              :key="item.name"
              @click="routePath(item.path)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="contain">
          <div class="top"><h3>监测预警</h3></div>
          <ul>
            <li
              v-for="item in monitor"
              :key="item.name"
              @click="routePath(item.path)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="contain">
          <div class="top"><h3>风险防治</h3></div>
          <ul>
            <li
              v-for="item in hazard"
              :key="item.name"
              @click="routePath(item.path)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="contain">
          <div class="top"><h3>科普宣传</h3></div>
          <ul>
            <li
              v-for="item in propaganda"
              :key="item.name"
              @click="routePath(item.path)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="contain">
          <div class="top"><h3>标准规范</h3></div>
          <ul>
            <li
              v-for="item in standard"
              :key="item.name"
              @click="routePath(item.path)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      home: [
        {
          name: '平台简介',
          path: ''
        },
        {
          name: '地震动态',
          path: ''
        },
        {
          name: '热点访问',
          path: ''
        },
        {
          name: '即将上线',
          path: ''
        },
        {
          name: '联系我们',
          path: '/collmy'
        },
        {
          name: '网站地图',
          path: '/sitemap'
        },

      ],
      service: [
        {
          name: '数据目录',
          path: '/service/catalogue'
        },
        {
          name: '数据申请',
          path: ''
        },
        {
          name: '数据下载',
          path: '/service/datadown'
        },
        {
          name: '数据接口',
          path: '/service/interface'
        },
        {
          name: '数据工具集',
          path: '/service/toolkit'
        },
      ],
      shikuang: [
        {
          name: '地震时空演化过程',
          path: ''
        },
        {
          name: '地震活动趋势判定',
          path: ''
        },
        {
          name: '地震灾害快速评估',
          path: ''
        },
      ],
      monitor: [
        {
          name: '监测站网分布',
          path: '/monitor/monitor'
        },
        {
          name: '避难场所查询',
          path: '/monitor/refuge'
        },
        {
          name: '实时震情服务',
          path: '/monitor/realtime'
        },
      ],
      hazard: [
        {
          name: '抗震设防参数查询',
          path: '/hazard/fortification'
        },
        {
          name: '安评信息综合检索',
          path: '/hazard/retrieval'
        },
        {
          name: '陕西活动断层分布',
          path: '/hazard/fault'
        },
      ],
      propaganda: [
        {
          name: '科普视频点播',
          path: '/propaganda/science'
        },
        {
          name: '地震知识在线',
          path: '/propaganda/knowledge'
        },
        {
          name: 'VR展览馆',
          path: '/propaganda/vr'
        },
      ],
      standard: [
        {
          name: '国家标准',
          path: '/standard/country'
        },
        {
          name: '行业标准',
          path: '/standard/industry'
        },
        {
          name: '地方标准',
          path: '/standard/local'
        },
      ],
    }
  },
  methods: {
    routePath(name) {
      this.$router.push({
        path: name
      })
    }
  }
}
</script>

<style  lang="less" scoped>
.box {
  background-color: #fff;
  padding: 10px 20px;
  margin-bottom: 10px;
  .title {
    padding: 10px 20px;
    background-color: #e8f1f8;
    color: #333;
  }
  .main {
    padding: 60px 60px 0;
    .contain {
      border-top: 1px solid #e8f1f8;
      border-left: 1px solid #e8f1f8;
      margin-bottom: 20px;
      width: 100%;
      .top {
        color: #015293;
        background-color: #e8f1f8;
        padding: 20px;
        font-size: 18px;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        li {
          text-align: center;
          width: 207px;
          height: 50px;
          border-right: 1px solid #e8f1f8;
          border-bottom: 1px solid #e8f1f8;
          line-height: 50px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
