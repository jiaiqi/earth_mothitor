<template>
  <div class="jwchat">
    <!-- 
      v-model	输入框中的文字	String	-	""
      taleList	会话内容	Array	-	[]
      toolConfig	工具栏配置	Object	-	{}
      width	JwChat界面框宽度	string	-	750px
      height	JwChat界面框高度	string	-	570px
      config	组件配置	Object	-	{}
      scrollType	消息自动到低	String	scroll	noroll
      showRightBox	显示右边内容	Boolean	false	true
      winBarConfig	多窗口配置
      quickList   自动匹配快捷回复
      @enter	输入框点击就发送或者回车触发的事件	输入的原始数据
      @clickTalk	点击聊天框列中的用户和昵称触发事件	当前对话数据
     -->
    <JwChat-index
      v-model="inputMsg"
      :taleList="taleList"
      :config="config"
      :showRightBox="true"
      width="100%"
      height="93vh"
      scrollType="scroll"
      :winBarConfig="winBarConfig"
      :quickList="config.quickList"
      @enter="bindEnter"
      @clickTalk="talkEvent"
    >
      <!-- 窗口右边栏 -->
      <!-- <JwChat-rightbox :config="rightConfig" @click="rightClick" /> -->
      <!-- 快捷回复 -->
      <!-- <JwChat-talk :Talelist="talk" :config="quickConfig" @event="bindTalk" /> -->
      <!-- 工具栏自定义插槽 -->
      <!-- <template slot="tools">
        <div style="width: 20rem; text-align: right" @click="toolEvent(12)">
          <JwChat-icon type="icon-lishi" title="自定义" />
        </div>
      </template> -->
    </JwChat-index>
  </div>
</template>
 
<script>
import { addSession, delSession, getSessionList, getReplyList, addReply, deleteReply, unreadNum, addRecList } from '@/api/chat'
import { decode, encode } from '@/utils/base/dataEncry';
import { getAuthRole } from '@/api/user'
import { getUser } from '@/utils/auth'
import { Loading } from 'element-ui';
const img = "https://www.baidu.com/img/flexible/logo/pc/result.png";
const listData = [
  {
    date: "2020/04/25 21:19:07",
    text: {
      text: "<i class='el-icon-document-checked' style='font-size:2rem;'/>",
      subLink: {
        text: "a.txt",
        prop: {
          underline: false,
        },
      },
    },
    mine: false,
    name: "公服小君",
    img: "https://img0.baidu.com/it/u=3066115177,3339701526&fm=26&fmt=auto&gp=0.jpg",
  },
  {
    text: "2020/04/25 21:19:07",
    type: "tip",
  },
  {
    date: "2020/04/25 21:19:07",
    text: {
      text: "<audio data-src='https://www.w3school.com.cn/i/horse.mp3'/>",
    },
    mine: false,
    name: "公服小君",
    img: "https://img1.baidu.com/it/u=31094377,222380373&fm=26&fmt=auto&gp=0.jpg",
  },
  {
    date: "2020/04/25 21:19:07",
    text: { text: "<img data-src='" + img + "'/>" },
    mine: false,
    name: "公服小君",
    img: "https://img1.baidu.com/it/u=31094377,222380373&fm=26&fmt=auto&gp=0.jpg",
  },
  {
    date: "2020/04/16 21:19:07",
    text: {
      text: "<video data-src='https://www.w3school.com.cn/i/movie.mp4' controls='controls' />",
    },
    mine: true,
    name: "公服小君",
    img: "https://img1.baidu.com/it/u=31094377,222380373&fm=26&fmt=auto&gp=0.jpg",
  },
  {
    date: "2021/03/02 13:14:21",
    mine: false,
    name: "公服小君",
    img: "https://img0.baidu.com/it/u=3066115177,3339701526&fm=26&fmt=auto&gp=0.jpg",
    text: {
      system: {
        title: "在接入人工前，智能助手将为您首次应答。",
        subtitle: "猜您想问:",
        content: [
          {
            id: `system1`,
            text: "平台如何下单数据产品",
          },
          {
            id: `system2`,
            text: "怎么进入后台管理系统",
          },
          {
            id: "system",
            text: "如何看到已下单的产品",
          },
        ],
      },
    },
  },
];
export default {
  components: {},
  data() {
    return {
      // 输入框中的文字
      inputMsg: "",
      // 会话内容
      taleList: [],
      // 工具栏配置
      tool: {
        // show: ['file', 'history', 'img', ['文件1', '', '美图']],
        showEmoji: true,
        callback: this.toolEvent,
      },
      // 组件配置
      config: {
        img: require('@/assets/images/info.png'),
        name: "公服平台小君",
        dept: "公服官方客服",
        callback: this.bindCover,
        historyConfig: {
          show: true,
          tip: "已滚动到顶部",
          callback: this.bindLoadHistory,
        },
        // 自动匹配快捷回复
        quickList: [
          { text: "平台如何下单数据产品？", id: 3 },
          { text: "怎么进入后台管理系统？", id: 4 },
          { text: "如何看到已下单的产品？", id: 5 },
          { text: "怎么注册一个账号", id: 6 },
          { text: "怎么登录后台管理系统", id: 7 },
          { text: "怎么上传数据目录？", id: 8 },
        ],
      },
      winBarConfig: {
        callback: this.bindWinBar,
      },
      // 多窗口配置
      // winBarConfig: {
      //   active: "win01", // 当前选中
      //   width: "200px", // 宽度大小
      //   listHeight: "80px", // 单个高度
      //   // 用户列表
      //   list: [
      //     {
      //       id: "1",
      //       img: require('@/assets/images/info.png'),
      //       name: "公服平台小君",
      //       dept: "公服官方客服",
      //       readNum: 1,
      //     },
      //     {
      //       id: "2",
      //       img: require('@/assets/images/info.png'),
      //       name: "平台小君2号",
      //       dept: "公服官方客服",
      //       readNum: 12,
      //     },
      //     {
      //       id: "3",
      //       img: require('@/assets/images/info.png'),
      //       name: "平台小君3号",
      //       dept: "公服官方客服",
      //       readNum: 0,
      //     },
      //   ],
      //   callback: this.bindWinBar,
      // },
      // 窗口右边栏配置
      // rightConfig: {
      //   tip: "群公告",
      //   notice:
      //     "【公告】",
      //   listTip: "当前在线",
      //   list: [
      //     {
      //       name: "JwChat",
      //       img: "https://img1.baidu.com/it/u=31094377,222380373&fm=26&fmt=auto&gp=0.jpg",
      //       id: 1,
      //     },
      //     {
      //       id: 2,
      //       name: "JwChat",
      //       img: "https://img1.baidu.com/it/u=31094377,222380373&fm=26&fmt=auto&gp=0.jpg",
      //     },
      //     {
      //       id: 3,
      //       name: "JwChat",
      //       img: "https://img1.baidu.com/it/u=31094377,222380373&fm=26&fmt=auto&gp=0.jpg",
      //     },
      //     {
      //       id: 4,
      //       name: "留恋人间不羡仙",
      //       img: "https://img0.baidu.com/it/u=3066115177,3339701526&fm=26&fmt=auto&gp=0.jpg",
      //     },
      //     {
      //       name: "只盼流星不盼雨",
      //       img: "https://img1.baidu.com/it/u=31094377,222380373&fm=26&fmt=auto&gp=0.jpg",
      //     },
      //   ],
      // },
      // 快捷回复配置
      talk: [
        "平台如何下单数据产品？",
        "怎么进入后台管理系统？",
        "如何看到已下单的产品？",
        "怎么注册一个账号",
      ],
      isAdmin: false,
      icon: this.avatar,
      //当前对话
      nowSession: null,
      loading: null,
      time:null,
      //拥有的角色列表
      roleList: [],
      sessionlist: [],
      play: null,
      quickConfig: {
        nav: ["常用问题"],
        showAdd: false,
        maxlength: 200,
        showHeader: true,
        showDeleteBtn: false,
      },
      // rightConfig2: {
      //   listTip: "当前在线",
      //   // notice: '【公告】这是一款高度自由的聊天组件，基于AVue、Vue、Element-ui开发。点个赞再走吧 ',
      //   list: [
      //     {
      //       name: "JwChat",
      //       img: "https://img1.baidu.com/it/u=2109725846,3376113789&fm=26&fmt=auto&gp=0.jpg",
      //     },
      //     {
      //       name: "留恋人间不羡仙",
      //       img: "https://img1.baidu.com/it/u=31094377,222380373&fm=26&fmt=auto&gp=0.jpg",
      //     },
      //     {
      //       name: "只盼流星不盼雨",
      //       img: "https://img1.baidu.com/it/u=2109725846,3376113789&fm=26&fmt=auto&gp=0.jpg",
      //     },
      //   ],
      // },
    };
  },
  mounted() {
    this.getUserImg()
    this.getRoleList().then(res=>{
      this.getSessionlist()
    })
    const self = this
    self.time = setInterval(() => {
      if(self.$route.path == '/backInfo'){
        if(self.play){
          self.getHisChat(self.play.data.talkingId)
        }else{
          self.getSessionlist()
        }
      }else{
        clearInterval(self.time)
      }
    }, 6000);
  },
  methods: {
    // 切换用户窗口，加载对应的历史记录
    bindWinBar(play = {}) {
      // const { type, data = {} } = play;
      this.play = play
      let info = {...play}
      let talkingId = info.data.talkingId
      let par = 'talkingId='+talkingId
      getReplyList(par).then(res=>{
        let list = res
        list.forEach(item=>{
          item.date = new Date(item.time).toLocaleString().replaceAll('/','.')
          item.text = { text: item.message }
          if(this.isAdmin){
            item.mine = item.oneself == 0 ? true:false
          }else{
            item.mine = item.oneself == 1 ? true:false
          }
          item.name = item.userName
          item.img = item.avatar
        })
        this.taleList = [...list]
      })
      // if (type === "winBar") {
      //   const { id, dept, name, img } = data;
      //   this.config = { ...this.config, id, dept, name, img };
      //   this.winBarConfig.active = id;
      //   if (id === "win00") {
      //     this.taleList = getListArr();
      //   } else this.taleList = getListArr((Math.random() * 4) >> 0);
      // }
      // if (type === "winBtn") {
      //   const { target: { id } = {} } = data;
      //   const { list } = this.winBarConfig;
      //   this.winBarConfig.list = list.reduce((p, i) => {
      //     if (id != i.id) p.push(i);
      //     return p;
      //   }, []);
      // }
    },
    getRoleList(){
      let user = JSON.parse(this.$store.state.user.users).userId
        this.loading = Loading.service({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
        });
      return new Promise((resolve,reject)=>{
        getAuthRole(user).then(res=>{
          res.user.roles.map(item=>{
            this.roleList.push(item.roleKey)
          })
          if(this.roleList.includes("platform_admin") || this.roleList.includes("admin")){
            this.isAdmin = true
          }else{
            this.isAdmin = false
          }
          resolve()
        })
      }) 
    },
    getHisChat(playId) {
      //普通用户默认选择和管理员对话
      let talkingId = this.nowSession[0].talkingId
      //管理员选择对话列表后展示该对话内容
      if(playId){
        talkingId = playId
      }
      let par = 'talkingId='+talkingId
      getReplyList(par).then(res=>{
        this.loading.close();
        let list = res
        list.forEach(item=>{
          item.date = new Date(item.time).toLocaleString().replaceAll('/','.')
          item.text = { text: item.message }
          if(this.isAdmin){
            item.mine = item.oneself == 0 ? true:false
          }else{
            item.mine = item.oneself == 1 ? true:false
          }
          item.name = item.userName
          item.img = item.avatar
        })
        this.taleList = [...list]
      })
    },
    getSessionlist() {
      let par = ''
      if(this.isAdmin){
        par = ''
      }else{
        par = 'userName='+JSON.parse(getUser()).userName
      }
      getSessionList(par).then(res=>{
        // console.log(res)
        if(res.length == 0){
          if(this.isAdmin){
            return
          }else{
            this.createSession()
            return
          }
        }
        let arr = [...res]
        this.nowSession = arr
        if(this.isAdmin){
          this.sessionlist = []
          //管理员显示对话人列表
          arr.forEach(item=>{
            this.getUnreadNum(item)
          })
        }else{
          this.winBarConfig = {
            callback: this.bindWinBar,
          }
        }
        this.getHisChat()
      })
    },
    //新用户自动创建聊天对话
    createSession() {
      let name = JSON.parse(getUser()).userName
      // let name = JSON.parse(getUser())
      let par = {userName: name, requsetName:"公服平台"}
      addSession(encode(par)).then(res=>{
        this.nowSession = [...decode(res)]
        this.loading.close();
      })
    },
    //获取未读消息数量
    getUnreadNum(item) {
      let par = 'talkingId='+item.talkingId
      let img = require('@/assets/images/info.png')
      unreadNum(par).then(res=>{
        this.sessionlist.push({
          id: item.id,
          talkingId: item.talkingId,
          name: item.userName,
          img: img,
          readNum: res
        })
        
        this.winBarConfig = {
          list: this.sessionlist,
          callback: this.bindWinBar,
        }
      })
    },
    getUserImg() {
      let user = JSON.parse(getUser())
      this.icon = user.avatar
    },
    // 点击聊天框列中的用户和昵称触发事件
    talkEvent(play) {
    },
    // 输入框点击就发送或者回车触发的事件
    bindEnter(e) {
      const msg = this.inputMsg;
      if (!msg) return;
      const msgObj = {
        date: new Date().toLocaleString().replaceAll('/','.'),
        text: { text: msg },
        mine: true,
        name: JSON.parse(getUser()).name,
        img: this.icon,
      };
      this.taleList.push(msgObj);
      let nowTalkingId = this.nowSession[0].talkingId
      if(this.isAdmin){
        //如果平台管理员点击了某个会话
        if(this.play){
          nowTalkingId = this.play.data.talkingId
        }else{
        //没有点击则自动开启与第一人会话
          nowTalkingId = this.nowSession[0].talkingId
        }
      }
      let par = {
        talkingId: nowTalkingId,
        userName: this.isAdmin ? '公服平台' : JSON.parse(this.$store.state.user.users).name,
        message: msg,
        avatar: this.icon,
        judgmentPhoto: 0,
        oneself: this.isAdmin ? 0:1
      }
      //发送聊天信息
      addReply(encode(par))
    },
    // 快捷回复，组件点击选中事件
    bindTalk(play) {
      const { key, value } = play;
      if (key === "select") {
        this.inputMsg = value;
        // this.bindEnter();
      }
      if (key === "delIndex") {
        this.talk.splice(value, 1);
      }
    },
    /**
     * @description: 点击加载更多的回调函数
     * @param {*}
     * @return {*}
     */
    bindLoadHistory() {
      // const history = new Array(3).fill().map((i, j) => {
      //   return {
      //     date: new Date().toLocaleString(),
      //     text: { text: j + new Date() },
      //     mine: false,
      //     name: "JwChat",
      //     img: "https://img1.baidu.com/it/u=31094377,222380373&fm=26&fmt=auto&gp=0.jpg",
      //   };
      // });
      // let list = history.concat(this.list);
      // this.taleList = list;
      // console.log("加载历史", list, history);
    },
    /**
     * @description:
     * @param {*} type 当前点击的按钮
     * @param {*} plyload 附加文件或者需要处理的数据
     * @return {*}
     */
    toolEvent(type, plyload) {
    },
    bindCover(event) {
    },
    rightClick(type) {
    },
  }
};
</script>

<style>
.jwchat {
  padding: 0px 5%;
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 15px;
}
.main {
  width: 100% !important;
}
</style>
