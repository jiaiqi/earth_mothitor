<template>
  <!--  台网列表 -->
  <div class="list">
    <el-input class="search" prefix-icon="el-icon-search" placeholder="输入关键字进行过滤" size="mini" v-model="filterText">
    </el-input>
    <el-tree ref="tree" :props="prop" :data="treeda" accordion :filter-node-method="filterNodeMethod"
      @node-click="nodeClick">
      <span slot-scope="{ node }">
        <i v-if="node.level == 1" class="el-icon-folder-opened" style="color:#409EFF"></i>
        <i v-else-if="node.level == 3" class="el-icon-location-outline" style="color:#409EFF"></i>
        <i v-else class="el-icon-collection-tag" style="color:#409EFF"></i>
        <span style="margin-left:10px">{{ node.label }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'leftDraw',
  data() {
    return {
      filterText: '',
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  props: {
    prop: {
      type: Object,
      default: () => {
        return {}
      }
    },
    filterNodeMethod: {
      type: Function,
      default: () => {
        return null
      }
    },
    nodeClick: {
      type: Function,
      default: () => {
        return null
      }
    },
    treeda: {
      type: Array,
      default: () => {
        return []
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  height: 620px;
  position: relative;

  .search {
    margin: 7px 0px;
    width: 100%;
  }

  .stationTxt {
    background-color: #f0f0f0;
    border-bottom: 2px solid #fff;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
