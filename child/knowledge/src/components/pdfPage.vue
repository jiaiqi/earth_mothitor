<template>
  <div class="pdf-contain">
    <el-link type="primary" @click="downPdf">{{ pdfItem.title }}</el-link>
  </div>
</template>
<script>
export default {
  name: 'Pdf',
  props: {
    pdfItem: Object
  },
  data() {
    return {}
  },
  methods: {
    downPdf() {
      window.open(this.pdfItem.url)
    }
  }
}
</script>
