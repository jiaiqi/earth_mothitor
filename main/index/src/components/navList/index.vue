<template>
    <div class="slideTxtBox" style="color: rgb(51, 51, 51); border-color: rgb(51, 51, 51);"><div class="hd" style="color: rgb(51, 51, 51); border-color: rgb(51, 51, 51);"><ul style="color: rgb(51, 51, 51); border-color: rgb(51, 51, 51);">
      <li :class="{ 'on': isActive === '0' }" @mouseenter="isActive = '0'">省级地震局</li>
      <li :class="{ 'on': isActive === '1' }" @mouseenter="isActive = '1'">直属单位</li>
      <li :class="{ 'on': isActive === '2' }" @mouseenter="isActive = '2'">主要地震网站</li>
      <li :class="{ 'on': isActive === '3' }" @mouseenter="isActive = '3'">子站</li>
      </ul>
      </div>
      <div class="bd" style="color: rgb(51, 51, 51); background-color: rgb(231, 231, 231); border-color: rgb(51, 51, 51);">
        <ul v-if = "isActive === '0'" style="color: rgb(51, 51, 51); border-color: rgb(51, 51, 51); display: block;">
      <li><a href="https://www.bjdzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">北京</a></li>
      <li><a href="http://www.tjdzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">天津</a></li>
      <li><a href="http://www.hbdzj.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">河北</a></li>
      <li><a href="http://www.shxdzj.gov.cn/index.html" target="_blank" style="color: rgb(51, 51, 51);">山西</a></li>
      <li><a href="http://www.nmgdzj.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">内蒙古</a></li>
      <li><a href="http://www.lndzj.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">辽宁</a></li>
      <li><a href="http://dzj.jl.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">吉林</a></li>
      <li><a href="http://www.hea.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">黑龙江</a></li>
      <li><a href="https://www.shdzj.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">上海</a></li>
      <li><a href="http://www.jsdzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">江苏</a></li>
      <li><a href="http://www.zjdz.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">浙江</a></li>
      <li><a href="http://www.ahdzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">安徽</a></li>
      <li><a href="http://www.fjdzj.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">福建</a></li>
      <li><a href="http://www.jxsdzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">江西</a></li>
      <li><a href="http://www.sddzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">山东</a></li>
      <li><a href="http://www.hendzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">河南</a></li>
      <li><a href="http://www.eqhb.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">湖北</a></li>
      <li><a href="http://www.hundzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">湖南</a></li>
      <li><a href="http://www.gddzj.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">广东</a></li>
      <li><a href="http://www.gxdzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">广西</a></li>
      <li><a href="https://www.haindzj.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">海南</a></li>
      <li><a href="http://www.cqdzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">重庆</a></li>
      <li><a href="http://www.scdzj.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">四川</a></li>
      <li><a href="https://www.gzsdzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">贵州</a></li>
      <li><a href="http://yndzj.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">云南</a></li>
      <li><a href="http://www.xizdzj.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">西藏</a></li>
      <li><a href="http://www.sxdzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">陕西</a></li>
      <li><a href="https://www.gsdzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">甘肃</a></li>
      <li><a href="https://www.qhdzj.gov.cn" target="_blank" style="color: rgb(51, 51, 51);">青海</a></li>
      <li><a href="http://www.nxdzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">宁夏</a></li>
      <li><a href="http://www.xjdzj.gov.cn/" target="_blank" style="color: rgb(51, 51, 51);">新疆</a></li>
      </ul>
      <ul v-if = "isActive === '1'" style="color: rgb(51, 51, 51); display: block;">
        <li><a href="http://www.cea-igp.ac.cn" target="_blank" style="color: rgb(51, 51, 51);">地球物理研究所</a></li>
      <li><a href="http://www.Eq-igl.ac.cn" target="_blank" style="color: rgb(51, 51, 51);">地质研究所</a></li>
      <li><a href="https://www.ief.ac.cn" target="_blank" style="color: rgb(51, 51, 51);">地震预测研究所</a></li>
      <li><a href="http://www.iem.ac.cn" target="_blank" style="color: rgb(51, 51, 51);">工程力学研究所</a></li>
      <li><a href="http://www.cenc.ac.cn/" target="_blank" style="color: rgb(51, 51, 51);">中国地震台网中心</a></li>
      <li><a href="http://www.eq-cedpc.cn" target="_blank" style="color: rgb(51, 51, 51);">中国地震灾害防御中心</a></li>
      <li><a href="https://www.ceadrc.cn" target="_blank" style="color: rgb(51, 51, 51);">发展研究中心</a></li>
      <li><a href="http://www.gec.ac.cn/" target="_blank" style="color: rgb(51, 51, 51);">地球物理勘探中心</a></li>
      <li><a href="http://www.fmac.ac.cn/" target="_blank" style="color: rgb(51, 51, 51);">第一监测中心</a></li>
      <li><a href="http://www.smac.ac.cn/" target="_blank" style="color: rgb(51, 51, 51);">第二监测中心</a></li>
      <li><a href="https://www.cidp.edu.cn/" target="_blank" style="color: rgb(51, 51, 51);">防灾科技学院</a></li>
      </ul>
      <ul v-if = "isActive === '2'" style="color: rgb(51, 51, 51);display: block;">
      <li><a href="http://www.isc.ac.uk/" target="_blank" style="color: rgb(51, 51, 51);">国际地震中心（ISC）</a></li>
      <li><a href="http://www.iaspei.org/" target="_blank" style="color: rgb(51, 51, 51);">国际地震学与地球内部物理学联合会（IASPEI）</a></li>
      <li><a href="http://www.iris.edu/about/GSN/index.htm" target="_blank" style="color: rgb(51, 51, 51);">全球地震台网(GSN)</a></li>
      <li><a href="http://www.emsc-csem.org/" target="_blank" style="color: rgb(51, 51, 51);">欧洲地中海地震中心</a></li>
      <li><a href="http://www.seismo.ethz.ch/" target="_blank" style="color: rgb(51, 51, 51);">瑞士地震服务中心</a></li>
      <li><a href="http://www.iris.edu/" target="_blank" style="color: rgb(51, 51, 51);">美国地震学联合研究会</a></li>
      <li><a href="http://www.usgs.gov/" target="_blank" style="color: rgb(51, 51, 51);">美国地质调查局</a></li>
      <li><a href="http://earthquake.usgs.gov/contactus/golden/neic.php" target="_blank" style="color: rgb(51, 51, 51);">&nbsp;美国地震信息中心</a></li>
      <li><a href="http://www.fdsn.org" target="_blank" style="color: rgb(51, 51, 51);">美国数字宽频带地震台网联合会(FDSN)</a></li>
      <li><a href="http://www.iugg.org" target="_blank" style="color: rgb(51, 51, 51);">国际大地测量学与地球物理学联合会</a></li>
      </ul>
      <ul v-if = "isActive === '3'" style="color: rgb(51, 51, 51); display: block;">
        <li v-for="item in list2" :key="item.id"><div style="cursor:pointer" @click="toUrl(item)">{{ item.unit }}</div></li>
      </ul>
      </div>
    </div>
</template>
<script>
import { childSpotList } from '@/api/chat'
import { encode,decode } from '@/utils/base/dataEncry';
export default {
  data() {
    return {
        isActive: '0',
        list: [],
        list2: []
    }
  },
  mounted() {
    childSpotList(encode({pageNum: 1,pageSize: 50})).then(res=>{
      this.list2 = [...res.records]
    })
  },
  methods:{
    toUrl(item){
        sessionStorage.setItem('province',item.rtf1)
        this.$router.push({name:'secondHome',params:{name:item.rtf1}});
    }
  }
}
</script>
<style lang="less" scoped>
.slideTxtBox{margin:30px 0px;width:81%;text-align:left;}
  .slideTxtBox .hd{height:50px;line-height:50px;position:relative;}
  .slideTxtBox .hd ul{float:left;position:absolute;height:32px;}
  .slideTxtBox .hd ul li{float:left;padding:0 25px;cursor:pointer;font-size:18px;color:#1d60a7;}
  .slideTxtBox .hd ul li.on{height:50px;background:rgba(229, 229, 229, 0.5);border-top:2px solid #1e61a8;color:#1d60a7;font-weight:bold;}
  .slideTxtBox .bd{background:rgba(229, 229, 229, 0.5) !important}
  .slideTxtBox .bd ul{height:95px;padding:10px 20px;zoom:1;}
  .slideTxtBox .bd li{height:32px;line-height:32px;float:left;margin-right:25px;}
  .slideTxtBox .bd li a{font-size:16px;}
  .slideTxtBox .bd li a:hover{color:#1e61a8;}
  .slideTxtBox .bd li .date{float:right;color:#999;}
</style>