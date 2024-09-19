<template>
  <div class="markees">
    <div v-if="title === '活动断层'">
    <div class="header1">
      <span>活动断层{{ title }}</span>
      <i @click="changShow" style="cursor: pointer" class="el-icon-close"></i>
    </div>
    <div>
      <div class="nav">
        <div class="title">断层名称</div>
        <div class="navTil">{{ this.markeArr.FaultName == " "? this.markeArr['断层名称']:this.markeArr.FaultName }}</div>
      </div>

      <div class="main">
        <div class="txtmain">
          <div class="header">
            <span>断层性质：{{ this.markeArr['断层性质'] }}</span>
          </div>
          <div class="txt">
            <span>活动时代: {{ this.markeArr['活动时代'] }}</span>
          </div>
        </div>
        <div
          class="txtmain"
          style="border-bottom: 1px solid #000; margin-bottom: 3px"
        >
          <div class="header">
            <span>断层倾向: {{ this.markeArr['断层倾向'] }}</span>
          </div>
          <div class="txt">
            <span>断层倾角：{{ this.markeArr['断层倾角'] }}</span>
            <span>断层走向：{{ this.markeArr['断层走向'] }}</span>
          </div>
        </div>
          <div
            class="txtmain"
            style="border-top: 1px solid #000"
          >
            <div class="header">
              <span>分发单位: </span>
            </div>
            <div class="txt">
              <span>联系人：王帅军</span>
              <span>联系方式：18337118971</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="title === '钻孔联合剖面'">
    <div class="header1">
      <span>{{ title }}</span>
      <i @click="changShow" style="cursor: pointer" class="el-icon-close"></i>
    </div>
    <div>
      <div class="nav">
        <div class="title">摘要描述</div>
        <div class="navTil">{{ this.markeArr.descriptions }}</div>
      </div>

      <div class="main">
        <div class="txtmain">
          <div class="header">
            <span>所属数据目录名称：{{ this.markeArr.directoryName }}</span>
          </div>
          <div class="txt">
            <span>数据目录提供单位: {{ this.markeArr.provider }}</span>
          </div>
          <div class="txt">
            <span>处理过程: {{ this.markeArr.processingProcess }}</span>
          </div>
        </div>
        <div
          class="txtmain"
          style="border-bottom: 1px solid #000; margin-bottom: 3px"
        >
          <div class="header">
            <span>所属项目名称: {{ this.markeArr.projectName }}</span>
          </div>
          <div class="txt">
            <span>剖面名称：{{ this.markeArr.lineName }}</span>
          </div>
          <div class="txt">
            <span>开工日期：{{ new Date(this.markeArr.dateOfCommence).toLocaleDateString() }}</span>
          </div>
          <div class="txt">
            <span>竣工日期：{{ new Date(this.markeArr.completionDate).toLocaleDateString() }}</span>
          </div>
        </div>
          <div
            class="txtmain"
            style="border-top: 1px solid #000"
          >
            <div class="header">
              <span>分发方式: {{ this.markeArr.distributionMode }}</span>
            </div>
            <div class="txt">
              <span>联系人：{{ this.markeArr.personToContact }}</span>
            </div>
            <div class="txt">
              <span>联系方式：{{ this.markeArr.phoneNum }}</span>
            </div>
            <div class="txt">
              <span>分发单位：{{ this.markeArr.distributionDepartment }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="title === '人工地震勘探'">
    <div class="header1">
      <span>{{ title }}</span>
      <i @click="changShow" style="cursor: pointer" class="el-icon-close"></i>
    </div>
    <div>
      <div class="nav">
        <div class="title">摘要描述</div>
        <div class="navTil">{{ this.markeArr.descriptions }}</div>
      </div>

      <div class="main">
        <div class="txtmain">
          <div class="header">
            <span>所属数据目录名称：{{ this.markeArr.directoryName }}</span>
          </div>
          <div class="txt">
            <span>数据目录提供单位: {{ this.markeArr.providerUnit }}</span>
          </div>
          <div class="txt">
            <span>处理过程: {{ this.markeArr.treatingProcesses }}</span>
          </div>
        </div>
        <div
          class="txtmain"
          style="border-bottom: 1px solid #000; margin-bottom: 3px"
        >
          <div class="header">
            <span>所属项目名称: {{ this.markeArr.projectName }}</span>
          </div>
          <div class="txt">
            <span>测线名称：{{ this.markeArr.profileName }}</span>
          </div>
          <div class="txt">
            <span>起点桩号：{{ this.markeArr.startNumber }}</span>
            <span>终点桩号：{{ this.markeArr.endNumber }}</span>
          </div>
          <div class="txt">
            <span>道间距（m）：{{ this.markeArr.trackPitch }}</span>
          </div>
          <div class="txt">
            <span>测线长度（km）：{{ this.markeArr.lineNumber }}</span>
          </div>
          <div class="txt">
            <span>开工日期：{{this.markeArr.dateOfCommence}}</span>
          </div>
          <div class="txt">
            <span>竣工日期：{{this.markeArr.completionDate }}</span>
          </div>
        </div>
          <div
            class="txtmain"
            style="border-top: 1px solid #000"
          >
            <div class="header">
              <span>分发方式: {{ this.markeArr.distributionMode }}</span>
            </div>
            <div class="txt">
              <span>联系人：{{ this.markeArr.personToContact }}</span>
            </div>
            <div class="txt">
              <span>联系方式：{{ this.markeArr.phoneNum }}</span>
            </div>
            <div class="txt">
              <span>分发单位：{{ this.markeArr.distributionDepartment }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="title === '地震测深'">
    <div class="header1">
      <span>地震测深</span>
      <i @click="changShow" style="cursor: pointer" class="el-icon-close"></i>
    </div>
    <div>
      <div class="nav">
        <div class="title">线名称：{{ this.markeArr.lineName }}</div>
      </div>

      <div class="main">
        <div class="txtmain">
          <div class="header">
            <span>目录名称：{{ this.markeArr.directoryName }}</span>
          </div>
          <div class="txt">
            <span>处理方式: {{ this.markeArr.processes }}</span>
          </div>
        </div>
        <div
          class="txtmain"
          style="border-bottom: 1px solid #000; margin-bottom: 3px"
        >
          <div class="header">
            <span>地域: {{ this.markeArr.region }}</span>
          </div>
          <div class="txt">
            <span>项目名称：{{ this.markeArr.projectName }}</span>
          </div>
          <div class="txt">
            <span>观测日期：{{ this.markeArr.viewDate }}</span>
          </div>
        </div>
          <div
            class="txtmain"
            style="border-top: 1px solid #000"
          >
            <div class="header">
              <span>分发单位: {{ this.markeArr.providerUnit }}</span>
            </div>
            <div class="txt">
              <span>联系人：{{ this.markeArr.linkMan }}</span>
            </div>
            <div class="txt">
              <span>联系方式：{{ this.markeArr.tel }}</span>
            </div>
            <div class="txt">
              <span>邮箱：{{ this.markeArr.email }}</span>
            </div>
            <div class="txt">
              <span>分发方式：{{ this.markeArr.sendType }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['markeArr', 'title'],
  data() {
    return {
      // markeArr: this.marke
    }
  },
  created() {
    // console.log(this.markeArr)
  },
  methods: {
    changShow() {
      this.$emit('markees', 'false')
    }
  }
}
</script>

<style lang="scss" scoped>
.markees {
  padding: 10px;
  .header1 {
    padding: 5px;
    display: flex;
    justify-content: space-between;
    background-color: #529dde;
    color: #fff;
    font-size: 14px;
    i {
      display: inline-block;
      background-color: #fff;
      color: #000;
      padding: 2px;
    }
  }
  .nav {
    font-size: 12px;
    border-bottom: 2px solid #000;
    .title {
      margin: 5px 0;
      padding: 3px 5px;
      background-color: #529dde;
      color: #fff;
    }
    .navTil {
      background: #f0f0f0;
      padding: 5px 7px;
    }
  }
  .main {
    .txtmain {
      font-size: 13px;
      .header {
        display: flex;
        justify-content: space-between;
        padding: 3px;
        background-color: #cccccc;
        color: #000;
        span {
          flex: 1;
        }
      }

      .txt {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        padding: 3px;
        background-color: #fff;

        span {
          flex: 1;
          margin-right: 20px;
        }
      }
    }
  }

  .el-button {
    margin-left: 70px;
    margin-bottom: 10px;
  }
}
</style>
