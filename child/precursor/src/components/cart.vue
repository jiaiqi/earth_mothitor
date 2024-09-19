<template>
    <div>
        <el-drawer
        :visible.sync="drawerState"
        :with-header="false"
        :modal="false"
        :append-to-body="true"
        @close="chengeShow(false)"
        size="23%">
        <div class="drawMain">
          <div class="drawHeader">
            <div style="display:flex">
              <i style="font-size: 33px;line-height:55px;vertical-align:middle;padding-right: 8px;" class="el-icon-shopping-cart-2"></i>
              <span style="font-size: 18px;">成果车</span>
            </div>
            <div style="line-height:65px;vertical-align:middle;cursor: pointer;" @click="chengeShow(false)">
              <i style="font-size: 26px;" class="el-icon-close"></i>
            </div>
          </div>
          <div class="cartList">
            <div class="nodata" v-if="addCartListData.length == 0">
              <div style="width: 100%;display:flex;justify-content:center">
                <img style="width: 150px;height:165px;margin-bottom: 8px;" src="@/assets/images/cart2.png"/>
              </div>
              <h4 style="text-align:center">成果车空空如也</h4>
              <p style="text-align:center;padding-top: 8px;text-decoration: underline;color: #1492ff;font-size: 14px;cursor: pointer;" @click="chengeShow(false)">去添加</p>
            </div>
            <ul>
              <li v-for="item,index in addCartListData" :key="item.id">
                <div class="cartItem">
                  <el-checkbox v-model="checkedItem[index]"></el-checkbox>
                  <i class="el-icon-s-data" style="font-size: 36px;line-height:50px;vertical-align:middle;margin:0px 5px"></i>
                  <el-tag class="name"><span style="font-size: 17px;">{{ item.orderClasses }}</span></el-tag>
                  <div class="info">
                    <div v-if="item.dataStat">
                      <p style="color: #888888;font-size: 14px;line-height: 20px;padding-left: 14px;">{{ item.dataDate }}</p>
                      <p style="color: green;padding-left: 14px;">{{ item.dataStat == 100 ? '数据完整' : '数据完整率：'+item.dataStat}}</p>
                    </div>
                    <!-- <div v-else-if="item.sta_name || item.staName">
                      <p v-if="item.staCode" style="line-height: 20px;padding-left: 16px;">台站代码：{{ item.staCode }}</p>
                      <p v-if="item.datasize" style="line-height: 20px;padding-left: 16px;">数据量：{{ item.datasize }}</p>
                    </div> -->
                    <div v-else>
                      <p style="line-height: 20px;padding-left: 16px;">{{ item.classesStandby }}
                      </p>
                    </div>
                    <div class="removeCart">
                      <el-button type="danger" plain round size="mini" @click="removeCartItem(index,item.orderId,1)">移除</el-button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="checkOut">
            <div style="line-height:30px;vertical-align:middle;font-size: 16px;" @click="handleAllSelect">
              <el-checkbox v-model="isAll">全选</el-checkbox>
            </div>
            <el-tooltip class="item" effect="dark" :value="showTip" :manual="true" content="请勾选要下单的商品" placement="top-start">
              <el-button type="primary" size="small" icon="el-icon-shopping-bag-2" @click="checkOut" style="width:120px;font-size: 16px;">结算</el-button>
            </el-tooltip>
            <el-button type="warning" plain size="small" icon="el-icon-shopping-cart-1" v-popover:popover style="width:130px;font-size: 16px;">清空成果车</el-button>
          </div>
          <el-popover
            ref="popover"
            placement="top"
            width="160"
            v-model="popoverVisible">
            <p style="line-height:50px">是否要清空成果车？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="clearCart">确定</el-button>
            </div>
          </el-popover>
        </div>
      </el-drawer>
    </div>
</template>
<script>
import {
  delCart,
  getList
} from '@/api/cartList'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      checkedItem: new Array(999).fill(false),
      isAll: false, //是否全选
      comTreeList: [],
      addCartListData: [],
      drawerState: false,
      showTip: false, //未勾选商品后显示提示
      popoverVisible: false,
    }
  },
  watch: {
    //抽屉开关
    drawer(newVal, oldVal) {
        this.drawerState = newVal
    },
    addCartList(newVal, oldVal) {
        this.addCartListData = newVal
    }
  },
  methods: {
    //日期数据子组件勾选后传值
    addCartItem(list){
      this.comTreeList = list
    },
    //添加购物车事件
    addCart(list){
      if(list.length == 0){
        return
      }
      let token = getToken()
      if (!token) {
        Notification.error({
          title: '提示',
          message: '用户未登录！请登录再试'
        });
        return
      }
      if(list[0].staName){  //判断是否是选择的台站列表
        let list2 = list
        list2.forEach(item=>{
          item.source = '测震数据'+'_'+item.staName + '台站'
        })
        if(!this.includes(this.addCartListData,list2)){
          this.addCartListData = this.addCartListData.concat(list2)
        }
        this.comTreeList = []
      }else {
        let list2 = list
        list2.forEach(item=>{
          item.source = '测震数据'+'_'+this.drawerTitle
          // item.select = false
        })
        if(!this.includes(this.addCartListData,list2)){
          this.addCartListData = this.addCartListData.concat(list2)
        }
        this.comTreeList = []
      }
        this.chengeShow(true)
    },

    //判断是否包含另一个数组
    includes(arr1, arr2) {
      return arr2.every(val => arr1.includes(val));
    },
    // 多选框选中
    handleSelectionChange(val) {
      if (val.length === 0) {
        this.comTreeList = []
        this.showCartBtn = false
      } else {
        this.showCartBtn = true
        this.comTreeList = val
      }
    },
    handleCheckedChange(e) {
      // console.log(e)
    },
    chengeShow(state) {
      this.$emit('showDraw',state)
    },
    //清空购物车
    clearCart() {
      this.popoverVisible = false
      this.addCartListData = []
      this.comTreeList = []
      this.$emit('cartList',this.addCartListData)
      this.removeCartItem(null,null,2)
    },
    //移除购物车项
    removeCartItem(index,id,type) {
      let str = ''
      if(type == 1){
        str = 'returnName='+Cookies.get('username')+'&orderId='+id
        this.addCartListData.splice(index,1)
      }else {
        str = 'returnName='+Cookies.get('username')
      }
      delCart(str).then(res=>{
        getList({
          userName: Cookies.get('username')
        }).then(res=>{
          this.addCartListData = res
          this.$emit('cartList',this.addCartListData)
        })
      })
    },
    //购物车全选
    handleAllSelect(){
      if(!this.isAll){
        // this.checkedItem.forEach(item=>{
        //   item = true
        // })
        // this.checkedItem.slice(0,this.addCartList.length-1) .fill(true)
        this.addCartListData.forEach((item,index)=>{
          this.checkedItem[index] = true
        })
      }else {
        // this.checkedItem.forEach(item=>{
        //   item = false
        // })
        this.addCartListData.forEach((item,index)=>{
          this.checkedItem[index] = false
        })
        // this.checkedItem.fill(false)
      }
    },
    gotoCheck(name) {
      // 向基项目发送数据
      window.microApp && window.microApp.dispatch({ route: { name } })
    },
    //结算
    checkOut() {
      let selectList = []
      this.checkedItem.forEach((item,index)=>{
        if(item && this.addCartListData[index]){
          selectList.push(this.addCartListData[index])
        }
      })
      if(selectList.length == 0){
        this.showTip = true
        setTimeout(() => {
          this.showTip = false
        }, 1500);
        return
      }
      sessionStorage.setItem('orderList',JSON.stringify(selectList))
      this.gotoCheck('orderInfo')
    },
  },
  props: {
    drawerTitle: {
      type: String,
      default: ''
    },
    drawer: {
      type: Boolean,
      default: ()=>{
        return false
      }
    },
    addCartList: {
      type: Array,
      default: ()=>{
        return []
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.drawMain {
  width: 100%;
  height: 100%;
  background-color: #f1f1f1;
  .drawHeader {
    display: flex;
    justify-content: space-between;
    background-color: #2f77c9;
    color: #efefef;
    height: 55px;
    line-height: 55px;
    padding: 0px 18px;
    vertical-align: middle;
  }
  .cartList {
    padding: 0px 15px;
    height: 87%;
    overflow-y: auto;
    .nodata {
      height: 250px;
      width: 100%;
      padding-top: 150px;
    }
    .info {
      padding-left:45px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .cartItem {
      padding: 0px 10px;
      border-radius: 10px;
      box-shadow: 1px 1px 4px 1px #aaaaaa;
      margin: 15px 0px;
      background-color: #fff;
      .name {
        max-width: 250px;
        position: relative;
        top: 9px;
        margin-top: 10px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
    }
    .cartItem:hover {
      box-shadow: 1px 1px 6px 1px #aaaaaa;
    }
    .removeCart {
      line-height: 50px;
      vertical-align: middle;
    }
  }
  .checkOut {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0px 20px;
    margin-top: 5px;
  }
}
</style>
