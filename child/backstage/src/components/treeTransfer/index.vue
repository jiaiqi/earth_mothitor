<template>
  <div
    class="tranferbox"
    style="
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    "
  >
    <div
      class="conbox"
      style="
        width: 200px;
        height: 400px;
        border: 1px solid #ebeef5;
        padding: 10px;
      "
    >
      <div class="titbox" style="font-size: 18px; color: #000">权限列表</div>
      <div class="wordbox">
        <el-tree
          @check="getData"
          show-checkbox
          class="filter-tree"
          node-key="id"
          empty-text="加载中，请稍候"
          :data="data"
          :props="defaultProps"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <span>{{ data.name }}</span>
            <span> </span>
          </span>
        </el-tree>
      </div>
    </div>
    &emsp;
    <div class="iconarrow" style="display: flex; flex-direction: column">
      <i
        class="el-icon-arrow-right"
        @click="addToRight(toData)"
        style="margin-bottom: 20px"
      ></i>
      <!-- <i class="el-icon-arrow-left" @click="addToleft(toData)"></i> -->
    </div>
    <div
      class="conbox"
      style="
        width: 200px;
        height: 400px;
        border: 1px solid #ebeef5;
        padding: 10px;
      "
    >
      <div class="titbox">
        <h2 style="font-size: 18px">
          已授权({{ toData.length }})<small style="font-size: 12px; color: red"
            >单击删除授权</small
          >
        </h2>
      </div>
      <div class="wordbox">
        <el-tree
          :data="toData"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span @click="() => remove(node, data)">{{ data.name }}</span>
            <span> </span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input3: '',
      checkList: [],
      keyarr: [],
      filterText: '',
      chickRole: []
    }
  },
  props: ['data', 'defaultProps', 'toData'],
  watch: {
    'defaultProps.label'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.keyarr = []
      }
    }
  },
  methods: {
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
    },

    // 复选框被选中时
    getData() {
      this.keyarr = []
      this.checkList = this.$refs.tree.getCheckedNodes()
      let parent = this.$refs.tree.getHalfCheckedNodes()

      if (this.checkList.length != 0) {
        for (var i = 0; i < this.checkList.length; i++) {
          if (!this.checkList[i].children) {
            parent.children = []
            parent.children.push(this.checkList)
            this.keyarr.push(parent)
          }
          if (this.checkList[i].children) {
            this.keyarr.push(this.checkList[i])
          }
        }
      } else {
        this.keyarr = []
      }
    },
    // 把选中的权限移到右侧
    addToRight(toData) {
      toData = []
      toData = toData.concat(this.keyarr)
      this.$emit('forParent', toData)
    },
    // 设置权限列表的选中
    setCheckedNodes(arr) {
      this.$refs.tree.setCheckedNodes(arr)
    },
    // 移除授权
    removeData(toData, event) {
      let checklist = toData
      let index = event.target.getAttribute('data-index')
      checklist.splice(index, 1)
      toData = checklist
      this.setCheckedNodes(toData)
      this.$emit('forParent', toData)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-icon-arrow-left,
.el-icon-arrow-right {
  padding: 13px;
  background: #8cc8ff;
  border-radius: 50%;
  color: #fff;
  flex-direction: column;
}
.iconarrow i:hover {
  background-color: #46a6ff;
}
</style>
