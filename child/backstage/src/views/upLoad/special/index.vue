<template>
  <div class="home">
    <Editor ref="editor" @submit="submit" />
  </div>
</template>
<script>
import Editor from '@/components/upLoad/tinyMce'
export default {
  name: 'Special',
  components: { Editor },
  data() {
    return {}
  },
  methods: {
    submit(data) {
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  padding: 10px;
}
</style>
