<template>
  <div class="tinymce-box">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="60px"
      label-position="left"
    >
      <el-form-item label="标题" prop="headTitle">
        <el-input v-model="form.headTitle" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <quill-editor
        style="height: 300px;"
          v-model="form.content"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
          @ready="onEditorReady($event)"
        >
        </quill-editor>
      </el-form-item>
      <el-form-item style="margin-top: 50px">
        <el-button size="mini" type="primary" @click="submit">保存</el-button>
        <el-button type="danger" size="mini" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
    <el-upload
      v-show="false"
      class="avatar-uploader"
      ref="upload"
      :data="fileUpload"
      :show-file-list="false"
      :action="action"
      :headers="headers"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
    >
    </el-upload>
  </div>
</template>

<script>
import { getUser, getToken } from '@/utils/auth'
// vue富文本
import { quillEditor } from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// import * as Quill from "quill"
// // 调整上传图片大小
// import ImageResize from "quill-image-resize-module"

// Quill.register("modules/imageResize", ImageResize)
import { encode, decode } from '@/utils/base/dataEncry.js'
import { upSpeList } from '@/api/dataup/special.js'
export default {
  props: {},
  components: { quillEditor },
  data() {
    return {
      action: process.env.VUE_APP_SEIS_API + '/station/importstationdata',
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      fileUpload: {},
      form: {
        content: '',
        headTitle: ''
      },
      rules: {
        headTitle: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入具体内容', trigger: 'blur' }
        ]
      },
      // 富文本编辑器配置
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
              ['blockquote', 'code-block'], // 引用  代码块
              [{ header: 1 }, { header: 2 }], // 1、2 级标题
              [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
              [{ script: 'sub' }, { script: 'super' }], // 上标/下标
              [{ indent: '-1' }, { indent: '+1' }], // 缩进
              [{ direction: 'rtl' }], // 文本方向
              [
                {
                  size: [
                    '12',
                    '14',
                    '16',
                    '18',
                    '20',
                    '22',
                    '24',
                    '28',
                    '32',
                    '36'
                  ]
                }
              ], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6] }], // 标题
              [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
              // [{ font: ['songti'] }], // 字体种类
              [{ align: [] }], // 对齐方式
              ['clean'], // 清除文本格式
              ['image', 'video'] // 链接、图片、视频
            ],
            handlers: {
              image: function (value) {
                if (value) {
                  // value === true
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
          // 调整图片大小
          // imageResize: {
          //   displayStyles: {
          //     backgroundColor: "black",
          //     border: "none",
          //     color: "white"
          //   },
          //   modules: ["Resize", "DisplaySize", "Toolbar"]
          // }
        },
        placeholder: '请输入正文'
      },
      // toolbar标题
      titleConfig: [
        { Choice: '.ql-insertMetric', title: '跳转配置' },
        { Choice: '.ql-bold', title: '加粗' },
        { Choice: '.ql-italic', title: '斜体' },
        { Choice: '.ql-underline', title: '下划线' },
        { Choice: '.ql-header', title: '段落格式' },
        { Choice: '.ql-strike', title: '删除线' },
        { Choice: '.ql-blockquote', title: '块引用' },
        { Choice: '.ql-code', title: '插入代码' },
        { Choice: '.ql-code-block', title: '插入代码段' },
        { Choice: '.ql-font', title: '字体' },
        { Choice: '.ql-size', title: '字体大小' },
        { Choice: '.ql-list[value="ordered"]', title: '编号列表' },
        { Choice: '.ql-list[value="bullet"]', title: '项目列表' },
        { Choice: '.ql-direction', title: '文本方向' },
        { Choice: '.ql-header[value="1"]', title: 'h1' },
        { Choice: '.ql-header[value="2"]', title: 'h2' },
        { Choice: '.ql-align', title: '对齐方式' },
        { Choice: '.ql-color', title: '字体颜色' },
        { Choice: '.ql-background', title: '背景颜色' },
        { Choice: '.ql-image', title: '图像' },
        { Choice: '.ql-video', title: '视频' },
        { Choice: '.ql-link', title: '添加链接' },
        { Choice: '.ql-formula', title: '插入公式' },
        { Choice: '.ql-clean', title: '清除字体格式' },
        { Choice: '.ql-script[value="sub"]', title: '下标' },
        { Choice: '.ql-script[value="super"]', title: '上标' },
        { Choice: '.ql-indent[value="-1"]', title: '向左缩进' },
        { Choice: '.ql-indent[value="+1"]', title: '向右缩进' },
        { Choice: '.ql-header .ql-picker-label', title: '标题大小' },
        {
          Choice: '.ql-header .ql-picker-item[data-value="1"]',
          title: '标题一'
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="2"]',
          title: '标题二'
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="3"]',
          title: '标题三'
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="4"]',
          title: '标题四'
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="5"]',
          title: '标题五'
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="6"]',
          title: '标题六'
        },
        { Choice: '.ql-header .ql-picker-item:last-child', title: '标准' },
        {
          Choice: '.ql-size .ql-picker-item[data-value="small"]',
          title: '小号'
        },
        {
          Choice: '.ql-size .ql-picker-item[data-value="large"]',
          title: '大号'
        },
        {
          Choice: '.ql-size .ql-picker-item[data-value="huge"]',
          title: '超大号'
        },
        { Choice: '.ql-size .ql-picker-item:nth-child(2)', title: '标准' },
        { Choice: '.ql-align .ql-picker-item:first-child', title: '居左对齐' },
        {
          Choice: '.ql-align .ql-picker-item[data-value="center"]',
          title: '居中对齐'
        },
        {
          Choice: '.ql-align .ql-picker-item[data-value="right"]',
          title: '居右对齐'
        },
        {
          Choice: '.ql-align .ql-picker-item[data-value="justify"]',
          title: '两端对齐'
        }
      ]
    }
  },
  watch: {},
  mounted() {
    for (let item of this.titleConfig) {
      let tip = document.querySelector('.quill-editor ' + item.Choice)
      if (!tip) continue
      tip.setAttribute('title', item.title)
    }
  },
  methods: {
    // 点击保存
    submit() {
      let user = JSON.parse(getUser())
      this.form.nickName = user.nickName
      this.$refs.form.validate((valid) => {
        if (valid) {
        }
      })
      upSpeList(encode({ content: this.myValue })).then((res) => {})
      // this.$emit('submit', this.myValue)
    },
    // 清空
    clear() {
      this.form = {
        headTitle: '',
        content: ''
      }
    },
    // 上传图片成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.$message.success('上传成功')
        this.isUploading = false
      } else {
        this.$message.error('上传失败, 请重试')
        this.fileList = []
      }
      // const imageUrl = 上传七牛云后返回来的一串在线链接
      // 获取光标所在位置
      // let quill = this.$refs.myQuillEditor.quill
      // let length = quill.getSelection().index
      // // 插入图片
      // quill.insertEmbed(length, "image", imageUrl)
      // // 调整光标到最后
      // quill.setSelection(length + 1)
      // this.content += url
    },
    // 上传失败回调
    handleUploadError(err) {
      console.log(err)
    },
    // 失去焦点事件
    onEditorBlur(quill) {
      // console.log("editor blur!", quill)
    },
    // 获得焦点事件
    onEditorFocus(quill) {
      // console.log("editor focus!", quill)
    },
    // 准备富文本编辑器
    onEditorReady(quill) {
      // console.log("editor ready!", quill)
    },
    // 内容改变事件
    onEditorChange({ quill, html, text }) {
      // console.log("editor change!", quill, html, text)
      this.content = html
    }
  }
}
</script>
<style lang="scss" scoped>
.tinymce-box {
  .tox .tox-promotio {
    display: none;
  }
}
</style>
