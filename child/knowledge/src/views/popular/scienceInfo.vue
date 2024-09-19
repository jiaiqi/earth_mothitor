<template>
    <div class="container">
        <div class="back" @click="back">
            <i class="el-icon-back"></i>
            <span style="font-size: 16px;padding-left:5px;">返回</span>
        </div>
        <div class="title">
            {{ title }}
        </div>
        <div class="views">
            浏览量：{{ views }}
        </div>
        <div class="main">
            <div class="video" v-show="type == 'video'">
            <video :src="url" autoplay loop controls style="width: 100%;" type="video/mp4"></video>
            </div>
            <div class="gif" v-show="type == 'gif'">
            <img
                :src="url"
                style="width: 100%;"
                alt=""
            />
            </div>
        </div>
    </div>
</template>

<script>
import { encode,decode } from '@/utils/base/dataEncry';
export default {
  data() {
    return {
        professionList: [],
        title: '',
        type: '',
        url: '',
        views: 0
    }
    },
  mounted() {
    this.title = this.$route.query.title
    this.type = this.$route.query.type
    this.url = this.$route.query.url
    if(!this.$route.query.views){
        return
    }
    this.views = this.$route.query.views
  },
  methods: {
    back() {
        this.$router.push('/science')
    },
  }
}
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    padding: 25px;
    background-color: #fff;
    height: calc(100vh - 90px);
    .back {
        position: absolute;
        cursor:pointer;
        width: 100px;
        left: 30px;
        top: 130px;
    }
    .main {
        width: 100%;
        padding-top: 5px;
        padding-bottom: 25px;
        display: flex;
        justify-content: center;
        .video {
            width: 70%
        }
    }
    .title {
        width: 100%;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        line-height: 45px;
    }
    .views {
        text-align: right;
        color: rgb(149, 149, 149);
        font-size: 15px;
        position: relative;
        top: -10px;
        right: 20%;
        z-index: 99;
    }
}
</style>