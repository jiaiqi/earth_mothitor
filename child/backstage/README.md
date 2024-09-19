## 后台管理

### 若依框架组件 components/
### 后台的各种统计图表组件 views/dashboard
### 后台系统管理 views/system/
### 后台数据上传/维护——法规标准 views/upLoad/criterion
### 后台数据上传/地下流体上传 views/upLoad/fluid/auditFileList
### 后台数据上传/地下流体台站上传 views/upLoad/fluid/stationList
### 后台数据上传/维护——地震地质 views/upLoad/geological
### 后台数据上传/维护——GNSS views/upLoad/gnss/auditFileList
### 后台数据上传/维护——GNSS台站维护 views/upLoad/gnss/index
### 后台数据上传/维护 钻孔联合剖面、人工地震勘探 views/upLoad/prevention
### 后台数据上传/维护——地震测深 views/upLoad/prospecting
### 后台数据上传/维护——测震 views/upLoad/seismometry/auditFileList
### 后台数据上传/维护——GNSS数据维护 views/upLoad/simulation
### 后台数据上传/维护——水准 views/upLoad/standard
### 后台数据上传/维护——强震动 views/upLoad/vibration
### 后台数据上传/维护——测震台网、台站维护 views/workflow/addstation
### 自动化接入管理 views/workflow/apiUnitCount
### 后台数据上传/维护——大震专题 views/workflow/bigEar
### 后台数据上传/维护——子站 views/workflow/childSpot
### 统计模块 views/workflow/count
### 后台数据上传/维护——特殊产品维护 views/workflow/expProduct
### 热点与推荐 views/workflow/hots
### 行业链接 views/workflow/industry
### 科普 views/workflow/knowledge
### 法律法规 views/workflow/laws
### 后台数据上传/维护——订单 views/workflow/order
### 后台数据上传/维护——产品 views/workflow/product
### 后台数据上传/维护——技术服务 views/workflow/serve
### 后台数据上传/维护——社会力量 views/workflow/social
### 后台数据上传/维护——学科管理 views/workflow/subject
### 后台审批任务 views/workflow/tasks
### 后台首页 views/index_v

```bash
# 克隆项目
git clone https://gitee.com/y_project/RuoYi-Vue

# 进入项目目录
cd ruoyi-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```