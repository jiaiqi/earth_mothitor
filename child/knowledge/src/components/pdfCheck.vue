<template>
  <div class="pdf-contain">
    <div id="pdfContent">
    </div>
  </div>
</template>
<script>
import PDFObject from 'pdfobject'
export default {
  name: 'pdfView',
  props: {
    pdfUrl: String
  },
  data() {
    return {}
  },
  mounted() {
    this.viewPdf()
  },
  methods: {
    viewPdf() {
      window.open('C:/Users/98719/Downloads/二测项目需求规格说明书v0_0804_1677233973882.pdf')
      // PDFObject.embed('C:/Users/98719/Downloads/二测项目需求规格说明书v0_0804_1677233973882.pdf', "#pdfContent");
    }
  }
}
</script>
<style>
.pdf-contain {
  width:100%;
  height: 100%;
}
</style>
