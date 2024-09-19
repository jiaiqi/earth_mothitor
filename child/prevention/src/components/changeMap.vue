<template>
  <div class="div">
    <div class="switch-btn" @click="changeBaseLayer('dx')">
      <el-card :body-style="{ padding: '0px' }">
        <img :src="imageDX" class="image" />
        <div class="bottom">
          <span>地形图</span>
        </div>
      </el-card>
    </div>
    <div class="switch-btn sl" @click="changeBaseLayer('sl')">
      <el-card :body-style="{ padding: '0px' }">
        <img :src="imageSL" class="image" />
        <div class="bottom">
          <span>矢量图</span>
        </div>
      </el-card>
    </div>
    <div class="switch-btn yx" @click="changeBaseLayer('yx')">
      <el-card :body-style="{ padding: '0px' }">
        <img :src="imageYX" class="image" />
        <div class="bottom">
          <span>影像图</span>
        </div>
      </el-card>
    </div>
    <div class="switch-btn yx" @click="changeLayer">
      <el-card :body-style="{ padding: '0px' }">
        <img :src="imageLW" class="image" />
        <div class="bottom">
          <span>路网开关</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import imageDX from '@/assets/images/dx.png'
import imageSL from '@/assets/images/sl.png'
import imageYX from '@/assets/images/yx.png'
import imageLW from '@/assets/images/lw.png'
export default {
  data() {
    return {
      imageDX: imageDX,
      imageSL: imageSL,
      imageYX: imageYX,
      imageLW: imageLW
    }
  },
  methods: {
    // 切换底图
    changeBaseLayer(e) {
      this.$store.commit('changeShow', e)
    },
    changeLayer() {
      let lwshow = this.$store.state.lwShow
      this.$store.commit('lwOpenUp', !lwshow)
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-btn {
  height: 80px;
  width: 120px;
  padding: 5px;
  border-radius: 5px;
  background-clip: content-box;
  display: inline-block;
}
.circle {
  width: 80px;
}
::v-deep .el-card__body {
  flex-direction: column;
}
.switch-btn .image {
  width: 100%;
  height: 60px;
  display: block;
  opacity: 0.8;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  margin: 0 auto;
}
.circle .image {
  margin-top: 10px;
  width: 60px;
  border-radius: 40px;
  border: 2px solid #99999966;
}
.bottom {
  text-align: center;
  cursor: default;
  color: #409eff;
}
</style>
