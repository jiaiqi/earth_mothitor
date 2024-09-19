<template>
  <div class="myaqlDeploy">
    <el-col>
      <el-button
        type="warning"
        plain
        icon="el-icon-close"
        size="mini"
        @click="handleClose"
      >
        关闭
      </el-button>
    </el-col>
    <div class="deplouTitle" style="margin-top: 3%; margin-bottom: 4%">
      <span style="margin-left: 6%">申请人:<span>崔牛皮</span></span>

      <span style="margin-left: 8%">申请时间:</span><span>2021/8/17</span>
    </div>

    <div class="deployBox">
      <el-steps align-center :active="active" show-icon finish-status="success">
        <el-step title="提交证件资料" />

        <el-step title="绑定对公账户" />

        <el-step title="打款验证" />

        <el-step title="实名审核" />
      </el-steps>

      <div v-if="active === 0" class="basicInfo">
        <el-container>
          <el-main>
            <el-row class="substance">
              <h4>资料准备：</h4>

              <p>1.统一社会信用代码证；</p>

              <p>2.企业法人身份证件；</p>

              <p>
                3.管理员身份证件：即当前经办人员身份证件，管理员与企业法人不是同一人时，需提供管理员身份证件，管理员将负责贵司账号的管理及操作员账号管理；
              </p>

              <p>
                4.管理员授权委托书：管理员与法人不是同一人时，需
                下载授权委托书模板并根据要求填写内容，加盖公章后上传，当前账户的小米ID为2345548738；
              </p>

              <p>
                5.CFCA数字证书申请表：需下载机构数字证书申请表模板并根据要求填写内容，加盖公章后上传。
              </p>

              <h4>资料上传要求：</h4>

              <p>
                1.
                营业执照及身份证请上传最新证件原件的彩色扫描件，如使用复印件请加盖公章上传；
              </p>

              <p>
                2. 图片支持格式：jpg /jpeg /png /bmp格式，图片大小不超过20M；
              </p>

              <p>
                3.
                经微信传输过的图片会导致图片失真，请避免使用经微信传输过的图片；
              </p>

              <p>
                4.
                上传图片后，系统将自动识别并填写相关信息，请核对系统识别结果是否准确；
              </p>

              <p>
                5.
                请一并准备证件盖章复印件，与开通单项业务时需提交的增信资料统一邮寄。
              </p>
            </el-row>

            <el-row style="margin-top: 3%">
              <span style="font-size: 14px">
                <span class="separation" />
                营业执照
              </span>
              <span>(请您按下面流程进行操作)</span>
              <span style="color: #005cff">请核对系统识别结果是否正确</span>
            </el-row>
          </el-main>

          <el-container>
            <el-aside>
              <img src="" style="height: 400px; margin-left: 3%" />
            </el-aside>

            <el-main>
              <el-row>
                <el-col :span="8" style="text-align: right; line-height: 35px">
                  公司名称:
                </el-col>

                <el-col :span="16">
                  <el-input
                    v-model="corporate"
                    placeholder="请输入内容"
                    style="width: 40%"
                  />
                </el-col>
              </el-row>

              <el-row style="margin-top: 2%">
                <el-col :span="8" style="text-align: right; line-height: 35px">
                  <span style="width: 50px">统一社会信用代码/营业执照号:</span>
                </el-col>

                <el-col :span="16">
                  <el-input
                    v-model="credit"
                    placeholder="请输入内容"
                    style="width: 40%"
                  />
                </el-col>
              </el-row>

              <el-row style="margin-top: 2%">
                <el-col :span="8" style="text-align: right; line-height: 35px">
                  住所地:
                </el-col>

                <el-col :span="16">
                  <el-input
                    v-model="domicile"
                    placeholder="请输入内容"
                    style="width: 40%"
                  />
                </el-col>
              </el-row>

              <el-row style="margin-top: 2%">
                <el-col :span="8" style="text-align: right; line-height: 35px">
                  法定代表人:
                </el-col>

                <el-col :span="16">
                  <el-input
                    v-model="representative"
                    placeholder="请输入内容"
                    style="width: 40%"
                  />
                </el-col>
              </el-row>

              <el-row style="margin-top: 2%">
                <el-col :span="8" style="text-align: right; line-height: 35px">
                  注册资本:
                </el-col>

                <el-col :span="16">
                  <el-input
                    v-model="capital"
                    placeholder="请输入内容"
                    style="width: 40%"
                  />
                </el-col>
              </el-row>

              <el-row style="margin-top: 2%">
                <el-col :span="8" style="text-align: right; line-height: 35px">
                  <span class="demonstration">成立时间:</span>
                </el-col>

                <el-col :span="16">
                  <div class="block">
                    <el-date-picker
                      v-model="value2"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                    />
                  </div>
                </el-col>
              </el-row>

              <el-row style="margin-top: 2%">
                <el-col :span="8" style="text-align: right; line-height: 35px">
                  <span class="demonstration">营业期限(止): </span>
                </el-col>

                <el-col :span="16">
                  <div class="block">
                    <el-date-picker
                      v-model="value3"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                    />

                    <el-checkbox v-model="checked">长期有效</el-checkbox>
                  </div>
                </el-col>
              </el-row>

              <el-row style="margin-top: 2%">
                <el-col :span="8" style="text-align: right; line-height: 35px">
                  企业电话:
                </el-col>

                <el-col :span="16">
                  <el-input
                    v-model="telephone"
                    placeholder="请输入内容"
                    style="width: 40%"
                  />
                </el-col>
              </el-row>
            </el-main>
          </el-container>

          <el-main>
            <el-row style="margin-top: 3%">
              <span style="font-size: 14px">
                <span class="separation" />
                法定代表人身份证件
              </span>
              <span>(请按照要求上传法定代表人身份证证件图片)</span>
              <span style="color: #005cff">请核对系统识别结果是否正确</span>
            </el-row>

            <el-container>
              <el-aside width="400px" style="background-color: #fff">
                证件类型:<el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-aside>

              <el-aside width="220px" style="background-color: #fff">
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />

                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>

                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />

                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-aside>

              <el-main>
                <el-row>
                  <el-col
                    :span="8"
                    style="text-align: right; line-height: 35px"
                  >
                    姓名:
                  </el-col>

                  <el-col :span="16">
                    <el-input
                      v-model="namea"
                      placeholder="请输入内容"
                      style="width: 60%"
                    />
                  </el-col>
                </el-row>

                <el-row style="margin-top: 2%">
                  <el-col
                    :span="8"
                    style="text-align: right; line-height: 35px"
                  >
                    身份证号:
                  </el-col>

                  <el-col :span="16">
                    <el-input
                      v-model="umber"
                      placeholder="请输入内容"
                      style="width: 60%"
                    />
                  </el-col>
                </el-row>
              </el-main>
            </el-container>
          </el-main>

          <el-main>
            <el-row style="margin-top: 3%">
              <span style="font-size: 14px">
                <span class="separation" />账号管理员身份证件
              </span>
              <span>(请按照要求上传法定代表人身份证证件图片)</span>
              <span style="color: #005cff">请核对系统识别结果是否正确</span>
            </el-row>

            <el-container>
              <el-aside width="400px" style="background-color: #fff">
                证件类型:<el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-aside>

              <el-aside width="220px" style="background-color: #fff">
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />

                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>

                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />

                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-aside>
            </el-container>
          </el-main>
          <el-footer>
            <el-checkbox v-model="checked">我已阅读并同意</el-checkbox>
            <a href="">《xxxxxxxx融信协议》</a>
          </el-footer>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsAdd',
  data() {
    return {
      fileList: [{}],

      imageUrl: '',

      tabPosition: 'left',

      active: 0,

      establish: '',

      amount: '',

      input: '',

      corporate: '',

      Bank: '',

      number: '',

      operator: '',

      Phone: '',

      reviewer: '',

      Cad: '',

      name: '',

      namea: '',

      umber: '',

      telephone: '',

      domicile: '',

      capital: '',

      representative: '',

      credit: '',

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },

        shortcuts: [
          {
            text: '今天',

            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },

          {
            text: '昨天',

            onClick(picker) {
              const date = new Date()

              date.setTime(date.getTime() - 3600 * 1000 * 24)

              picker.$emit('pick', date)
            }
          },

          {
            text: '一周前',

            onClick(picker) {
              const date = new Date()

              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)

              picker.$emit('pick', date)
            }
          }
        ],

        options: [
          {
            value: '选项1',

            label: '黄金糕'
          },

          {
            value: '选项2',

            label: '双皮奶'
          },

          {
            value: '选项3',

            label: '蚵仔煎'
          },

          {
            value: '选项4',

            label: '龙须面'
          }
        ]
      },

      value1: '',

      value2: '',

      value3: ''
    }
  },

  created() {},

  methods: {
    // 返回按钮
    handleClose() {
      const obj = { path: '/workflow/check' }
      this.$tab.closeOpenPage(obj)
    },
    prev() {
      this.active

      if (this.active < 0) this.active = 0
    },

    next() {
      if (this.active++ > 2) {
        this.active = 0
      } else if (this.active++ > 3) this.active = 0
    },

    // 下载本地文件

    download() {
      window.location.href = 'http://localhost:8080/template/template.xlsx'
    },

    // 超过文件上传最大个数

    handleExceed(files, fileList) {
      this.$message.warning('很抱歉当前支持最大上传文件个数为 1 个！')
    },

    // 文件上传到服务器之前的文件校验

    beforeUpload(file) {
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)

      const size = file.size / 1024 / 1024

      if (extension !== 'xlsx') {
        // 校验文件格式

        this.$message.warning('只支持上传后缀名为.xlsx的Excel文件')
      }

      if (size > 10) {
        // 校验文件大小

        this.$message.warning('文件大小不能超过10MB')
      }
    },

    // 文件状态改变

    handleChange(file, fileList) {
      if (file) {
        this.fileList = fileList.slice(-3)
      }
    },

    // 文件删除时

    handleRemove(file, fileList) {
      // console.log(file, fileList)

      this.fileList = [] // 文件列表置空
    },

    // 点击文件列表中已上传的文件时的钩子

    handlePreview(file) {
    },

    // 文件上传成功

    handleSuccess(response, file, fileList) {


      this.$message.success('文件 [' + file.name + '] 上传成功')
    },

    // 文件上传失败

    handleError(err, file, fileList) {


      this.$message.error('文件上传失败')
    },

    // 覆盖默认的上传行为，可以自定义上传的实现

    httpRequest(param) {

      const fileObj = param.file // 获取file文件

      const formData = new FormData() // FormData对象

      formData.append('file', fileObj) // file封装到FormData里

      // 请求后台上传数据的接口

      this.$http

        .post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }

          // url: '/upload',

          // data: formData

          // method: 'post'
        })

        .then(
          (res) => {


            if (res.data.meta.status === '200') {
              this.$message.success(res.data.meta.msg)

              // 清空文件列表

              this.fileList = []
            } else {
              this.$message.error(res.data.meta.msg)
            }
          },

          (err) => {


            this.$message.error(
              '上传文件内容有问题，请保证上传文件字段均不为空且正确'
            )
          }
        )
    },

    // 上传文件

    submitUpload() {
      if (this.fileList.length === 0) {
        // 上传文件列表为空

        this.$message.warning('请选择一个上传文件')
      } else {
        // 执行上传操作

        this.$refs.upload.submit()
      }
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'

      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      return isJPG && isLt2M
    }
  }
}
</script>

<style>
.substance p {
  font-family: '微软雅黑', sans-serif;

  font-weight: 400;

  font-style: normal;

  font-size: 14px;

  letter-spacing: normal;

  color: #666666;

  line-height: normal;

  margin: 0px;

  text-rendering: optimizeLegibility;

  font-kerning: normal;
}

.substance h4 {
  font-family: '微软雅黑', sans-serif;

  font-weight: 700;

  font-style: normal;

  font-size: 14px;

  letter-spacing: normal;

  color: #666666;

  line-height: normal;

  margin: 0px;

  text-rendering: optimizeLegibility;

  font-kerning: normal;
}

.separation {
  width: 200px;

  height: 60px;

  margin-top: 10px;

  border-right: 5px solid #005cff;
}

.approved {
  height: 150px;

  width: 60%;

  /* background-color: #f2f2f2; */

  text-align: center;

  border: 1px solid #f2f2f2;

  margin-left: 20%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;

  border-radius: 6px;

  cursor: pointer;

  position: relative;

  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;

  color: #8c939d;

  width: 178px;

  height: 178px;

  line-height: 178px;

  text-align: center;
}

.avatar {
  width: 178px;

  height: 178px;

  display: block;
}

.div-label {
  padding: 20px 0;

  width: 100%;
}
</style>
