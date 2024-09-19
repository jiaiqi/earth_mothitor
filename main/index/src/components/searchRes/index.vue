<template>
    <div class="container">
        <div class="main">
            <el-table
            :data="list"
            style="width: 100%"
            :default-sort = "{prop: 'visit', order: 'descending'}">
                <el-table-column
                type="index">
                </el-table-column>
                <el-table-column
                    prop="keyName"
                    label="名称">
                    <template slot-scope="scope">
                        <div class="active" @click="toUrl(scope.row)">
                        {{ scope.row.keyName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="hotNum"
                    sortable
                    width="170"
                    label="浏览量">
                </el-table-column>
            </el-table>
            <div class="pages">
                <el-pagination v-show="total > 0" :total="total" :page-sizes="[10, 20, 50, 100]" 
                    :current-page="queryParams.pageNum" :page-size="queryParams.pageSize"
                @size-change="sizeChange" @current-change="getList" layout="total, sizes, prev, pager, next, jumper" />
            </div>
        </div>
    </div>
</template>

<script>
import { getHotSpotListPage } from '@/api/count'
export default {
  data() {
    return {
        list: [],
        searchVal: '',
        total: 0,
        queryParams: {
            pageNum: 1,
            pageSize: 10,
        },
    }
  },
  mounted() {
    this.searchVal = this.$route.query.val
    this.getList(1)
  },
  methods:{
    toUrl(item) {
        if(!sessionStorage.getItem('hotInfo')){
            sessionStorage.setItem('hotInfo',JSON.stringify(item))
        }
        if(item.linkUnit){
            sessionStorage.setItem('tips',item.linkUnit)
        }
        if(item.url.indexOf('http://') != -1 || item.url.indexOf('https://') != -1){
            window.open(item.url)
        }else {
            this.$router.push(item.url)
        }
    },
    sizeChange(size) {
        this.queryParams.pageSize = size
        this.getList(this.queryParams.pageNum)
    },
    getList(page) {
        let pages = 'pageNum='+page+'&pageSize='+this.queryParams.pageSize+'&keyName='+this.searchVal
        getHotSpotListPage(pages).then(res=>{
            this.list = [...res.records]
            this.total = res.total
        })
    }
  }
}
</script>
<style lang="less" scoped>
.container{
    width: 100%;
    height: 75vh;
    display: flex;
    justify-content: center;
    .main {
        width:50%;
        margin-top: 35px;
        .active {
            cursor: pointer;
            font-size: 18px;
        }
        .active:hover {
            color: rgb(10, 93, 236);
        }
    }
    .pages {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 30px 0px;
    }
}
</style>