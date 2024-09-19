<template>
  <div v-if="!item.hidden">
    <!-- 没有子级 渲染这个 -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link
        v-if="onlyOneChild.meta"
        :to="resolvePath(onlyOneChild.path, onlyOneChild.query)"
      >
        <!-- 一级菜单 -->
        <el-menu-item
        style="min-width:240px !important;margin-left: -10px;"
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest}"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        <el-badge v-if="orderNames.includes(onlyOneChild.name) && showNum" style="margin-right: 5px;margin-left: -5px;"
         :value="onlyOneChild.name == 'Order1'? orderStatusList[0].num : onlyOneChild.name == 'Order2'? orderStatusList[1].num : 
         onlyOneChild.name == 'Order3'? orderStatusList[2].num : onlyOneChild.name == 'Order4'? orderStatusList[3].num : orderStatusList[4].num" class="item"></el-badge>
        </el-menu-item>
      </app-link>
    </template>
    <!-- 有子级的一级菜单 -->
    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <!-- 一级菜单名称 -->
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <!-- 在调一次自身 渲染二级菜单-->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: { // 子菜单的每一项
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: { // 子菜单路由
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null
    return {
      longTitle: false,
      orderNames: ['Order1','Order2','Order3','Order4','Order5'],
      orderStatusList: [],
      showNum: false,
    }
  },
  mounted() {
    setTimeout(() => {
      this.orderStatusList = [...this.$store.state.user.orderStatus]
      this.showNum = true
    }, 2000);

  },
  methods: {
    // 判段 获取菜单
    hasOneShowingChild(children = [], parent) {
      if (!children) {
        children = []
      }
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          if(this.onlyOneChild.meta.title.length>=6){
            this.longTitle = true
          }
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        if(this.onlyOneChild.meta.title.length>=6){
          this.longTitle = true
        }
        return true
      }

      return false
    },
    resolvePath(routePath, routeQuery) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      if (routeQuery) {
        let query = JSON.parse(routeQuery)
        return { path: path.resolve(this.basePath, routePath), query: query }
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style scoped>
.title-padding {
  padding-left: 50px !important;
}
</style>