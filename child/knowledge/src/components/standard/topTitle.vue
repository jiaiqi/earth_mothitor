<template>
  <div class="title">
    <div class="box">
      <div class="topNav">
        <tabNav :pageName="'标准法规'"></tabNav>
      </div>
      <div class="box_commom commom">
        <div class="contain">
          <el-input
            placeholder="请输入内容"
            v-model="input"
            clearable
            class="input-with-select"
            @keyup.enter.native="search"
          >
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="全部" value="6"></el-option>
              <el-option label="全部标准" value="5"></el-option>
              <el-option label="国家标准" value="0"></el-option>
              <el-option label="行业标准" value="1"></el-option>
              <el-option label="地方标准" value="2"></el-option>
              <el-option label="团体标准" value="3"></el-option>
              <el-option label="法律法规" value="4"></el-option>
            </el-select>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
          <div class="txt">
            <!-- <div class="top">
              <span>实时热搜</span>
              <span><i class="el-icon-refresh"></i>换一批</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tabNav from '@/components/topNav.vue'
import { getStandard, getLawList } from '@/api/standard'
import { encode, decode } from '@/utils/dataEncry'
export default {
  data() {
    return {
      input: '',
      select: '6',
      list: []
    }
  },
  components: { tabNav },
  created() {},
  methods: {
    search() {
      if (this.input.trim().length > 0) {
        let isAll = false
        let obj = {
          mohu: this.input.trim(),
          type: this.select
        }
        if (obj.type === '6') {
          delete obj.type
          isAll = true
          getStandard(encode(obj)).then((res) => {
            let list = decode(res)
            this.$emit('tabList', list, 2)
          })
          let par = 'pageNum=1&pageSize=9999&status=1&name='+obj.mohu
          getLawList(par).then(response => {
            let list = response.records
            this.$emit('tabList1', list, 2)
          });
        }
        else if(obj.type != '4'){
          if(obj.type === '5'){
            delete obj.type
          }
          getStandard(encode(obj)).then((res) => {
            let list = decode(res)
            this.$emit('tabList', list, 0)
          })
        }else{
          let par = 'pageNum=1&pageSize=9999&status=1&name='+obj.mohu
          getLawList(par).then(response => {
            let list = response.records
            this.$emit('tabList1', list, 1)
          });
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  margin: -3px auto 0px auto;
  background-color: #fff;
  width: 100%;
  height: 230px;
  background: url(@/assets/images/index3.png) no-repeat top center;
  background-size: 100% 150%;
  position: relative;

  .topNav {
    position: absolute;
    z-index: 998;
    top: 20px;
    left: 20px;
    background-color: #fff;
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
    opacity: 0.9;
  }
  .box_commom {
    padding: 0 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .contain {
      width: 70%;
    }
  }
}
/deep/.el-select .el-input {
  width: 130px;
}
/deep/ .el-input__inner:focus {
  outline: none;
}
/deep/ .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
@media (max-width: 1600px) {
  .box {
    width: 100vw;
    height: 22vh;
  }
}
@media (max-width: 1200px) {
  .box {
    width: 1200px;
    height: 180px;
  }
}
</style>
