<template>
  <div class="earthsituation">
    <div class="box commom">
      <div class="nav">当前位置：首页 > 信息播报</div>
      <div class="text">
        <div class="title">
          <h3>{{ text.localName }}发生{{ text.m }}级地震</h3>
          <p>发布时间：{{ new Date(text.oTime).toLocaleString() }}</p>
        </div>
        <div class="content">
          <p>
            据中国地震台网测定，北京时间{{ new Date(text.oTime).toLocaleString() }}{{ text.localName }}（北纬{{
              Math.floor(text.lat * 1000)/1000
            }}度，东经{{ Math.floor(text.lon * 1000)/1000 }}度）发生{{ text.m }}级地震，震源深度{{
              text.depth
            }}KM。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { encode, decode } from '@/utils/base/dataEncry'
import { getList } from '@/api/shikuang'
export default {
  data() {
    return {
      id: 0,
      text: null,
      list: []
    }
  },

  created() {
    let id = this.$route.query.id
    getList({}).then((res) => {
      this.list = decode(res)
      this.text = this.list.filter((item) => item.id == id)[0]
      }).catch((e) => {
      })
  }
}
</script>

<style lang="less" scoped>
.box {
  .nav {
    margin: 0 auto;
    width: 80%;
    padding: 20px 0;
    font-size: 14px;
  }
  .text {
    margin: 0 auto 50px;
    width: 80%;
    padding: 40px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid #dddddd;
    .title {
      h3 {
        font-size: 28px;
        font-weight: 400;
        letter-spacing: 2px;
      }
      p {
        margin-top: 30px;
        padding: 10px 0;
        font-size: 14px;
        color: #7f6697;
        border-bottom: 1px solid #ddd;
      }
    }
    .content {
      min-height: 300px;
      padding-top: 30px;
      font-size: 20px;
      color: rgb(102, 101, 101);
      line-height: 200%;
      text-indent: 1cm;
      text-align: left;
      letter-spacing: 1.5px;
    }
  }
}
</style>
