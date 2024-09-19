<template>
  <div class="earthTopic">
    <div class="container commom">
      <div class="topNav">
        <TopNav :pageName="'/大震专题'"></TopNav>
      </div>
      <div class="search">
        <el-input
          placeholder="请输入关键词"
          v-model="search"
          class="input-with-select"
          size="mini"
        >
          <el-button
            slot="append"
            style="background: #5ca5d8; color: #fff"
            size="mini"
            >搜索</el-button
          >
        </el-input>
      </div>
      <div class="main">
        <ul style="display: flex">
          <li
            v-for="item in list"
            :key="item.id"
            @click="goEarthOption(item.id)"
          >
            <div class="img">
              <p>{{ item.city }}{{ item.num }}级地震</p>
            </div>
            <h3>{{ item.city }}{{ item.num }}级地震</h3>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from '../../components/topNav.vue'
export default {
  data() {
    return {
      search: '',
      list: [
        {
          city: '西藏那曲市比如县',
          sum: '10KM',
          num: 3.2,
          id: '1',
          lat: '31.91',
          lon: '92.87',
          time: '2022-09-05 13:38:05',
          url: ''
        },
        {
          city: '四川甘孜州泸定县',
          sum: '12KM',
          num: 3.2,
          lat: '29.58',
          lon: '102.06',
          id: '2',
          time: '2022-09-05 13:28:46'
        },
        {
          city: '四川雅安市石棉县',
          sum: '10KM',
          num: 2.9,
          lat: '59.49',
          lon: '102.17',
          id: '3',
          time: '2022-09-05 13:28:23'
        },
        {
          id: '4',
          city: '四川甘孜州泸定县',
          sum: '8KM',
          num: 2.8,
          lat: '29.51',
          lon: '102.11',
          time: '2022-09-05 13:15:31'
        },
        {
          city: '四川雅安市石棉县',
          sum: '10KM',
          num: 2.9,
          lat: '29.46',
          lon: '102.14',
          id: '5',
          time: '2022-09-05 13:10:24'
        },
        {
          city: '四川甘孜州泸定县',
          sum: '9KM',
          num: 3.1,
          lat: '29.61',
          lon: '102.04',
          id: '6',
          time: '2022-09-05 13:03:14'
        },
        {
          city: '西藏那曲市比如县',
          sum: '10KM',
          num: 3.2,
          id: '7',
          lat: '31.91',
          lon: '92.87',
          time: '2022-09-05 13:38:05',
          url: ''
        },
        {
          city: '四川甘孜州泸定县',
          sum: '12KM',
          num: 3.2,
          lat: '29.58',
          lon: '102.06',
          id: '8',
          time: '2022-09-05 13:28:46'
        },
        {
          city: '四川雅安市石棉县',
          sum: '10KM',
          num: 2.9,
          lat: '59.49',
          lon: '102.17',
          id: '9',
          time: '2022-09-05 13:28:23'
        },
        {
          id: '10',
          city: '四川甘孜州泸定县',
          sum: '8KM',
          num: 2.8,
          lat: '29.51',
          lon: '102.11',
          time: '2022-09-05 13:15:31'
        }
      ]
    }
  },
  components: {
    TopNav
  },
  created() {
    const data = window.microApp.getData() // 返回基座下发的data数据
  },
  methods: {
    goEarthOption(id) {
      this.$router.push({
        path: '/earthOption?id=' + id
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background: #f6f6f7 url(@/assets/images/bgimg1.png) no-repeat top;
  background-size: 100%;
  position: relative;
  .topNav {
    position: absolute;
    top: 20px;
    left: -170px;
    background-color: #fff;
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 4px 0px rgb(143, 143, 143);
    opacity: 0.9;
  }
  .search {
    margin: 0 auto;
    width: 40%;
    position: relative;
    top: 40px;
  }
  .main {
    width: 80%;
    background-color: #fff;
    padding: 20px;
    margin: 100px auto 0;
    border-radius: 5px;
    ul {
      flex-flow: wrap;
      justify-content: space-between;
      li {
        width: 24%;
        margin-bottom: 10px;
        .img {
          margin: auto;
          width: 90%;
          height: 100px;
          box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
          margin-bottom: 10px;
          cursor: pointer;
          p {
            color: #ec243b;
            font-size: 14px;
            text-align: center;
            line-height: 100px;
          }
        }
        h3 {
          font-size: 14px;
          text-align: center;
          color: #4d9bca;
        }
      }
    }
  }
}
</style>
