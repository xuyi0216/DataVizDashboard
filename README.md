# 数据中心运行监控大屏

基于 Vue 3 + TypeScript + ECharts + Node.js + MySQL 的数据中心运行监控可视化大屏项目。

## 项目结构

```
├── server/                    # Node.js + Express 后端 API
│   ├── src/
│   │   ├── index.js          # 服务入口
│   │   └── routes/
│   │       └── dashboard.js  # 数据接口路由
│   ├── package.json
│   ├── docker-compose.yml    # 仅 MySQL 服务
│   └── Dockerfile
├── database/
│   ├── schema.sql            # MySQL 表结构
│   └── seed.js               # 模拟数据生成脚本
├── src/                      # Vue 3 前端项目
│   ├── api/                  # API 接口定义
│   │   ├── datacenter.ts     # 数据中心监控接口
│   │   ├── sales.ts          # 销售模块接口
│   │   ├── types.ts          # TypeScript 类型定义
│   │   └── request.ts        # Axios 请求封装
│   ├── modules/datacenter/   # 数据中心监控模块
│   │   ├── CpuTrendModule.vue
│   │   ├── MemoryTrendModule.vue
│   │   ├── DiskTrendModule.vue
│   │   ├── NetworkTrendModule.vue
│   │   ├── HostStatusModule.vue
│   │   ├── AlertListModule.vue
│   │   ├── AlertDistributionModule.vue
│   │   ├── MetricDistributionModule.vue
│   │   ├── IdcStatusModule.vue
│   │   └── HostOverviewModule.vue
│   ├── stores/datacenter/    # 数据中心状态管理
│   ├── mock/datacenter/      # Mock 数据
│   ├── layouts/              # 布局组件
│   └── App.vue               # 根组件
├── docker-compose.yml        # 全栈 Docker 编排
├── Dockerfile                # 前端 Dockerfile
└── package.json
```

## 快速开始

### 方式一：Mock 模式（无需后端，直接运行）

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:5173/

### 方式二：完整全栈模式

#### 1. 启动 MySQL

```bash
# 使用 Docker 启动 MySQL
docker run --name datacenter-mysql -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=datacenter_monitor -p 3306:3306 -d mysql:8.0
```

#### 2. 初始化数据库

```bash
mysql -h localhost -u root -p root123 datacenter_monitor < database/schema.sql
node database/seed.js
```

#### 3. 启动后端服务

```bash
cd server
npm install
npm start
```

#### 4. 启动前端服务

```bash
# 在项目根目录
npm install
VITE_USE_MOCK=false npm run dev
```

### 方式三：Docker 全栈启动

```bash
docker-compose up --build
```

## 数据说明

数据来源于 `D:\shixi\day3` 目录中的监控数据文件：

| 文件            | 说明         | 记录数 |
| --------------- | ------------ | ------ |
| host_detail.dat | 主机详情     | 20     |
| mod_detail.dat  | 指标模块     | 55     |
| pref_tsar.dat   | 性能指标时序 | 67,200 |
| disk_tsar.dat   | 磁盘指标时序 | 12,000 |

数据包含 20 台主机、2 个机房、7 天监控周期，涵盖 CPU、内存、网络、磁盘、进程等维度指标。

## 技术栈

- **前端框架**：Vue 3 + TypeScript + Vite
- **图表渲染**：ECharts 5
- **状态管理**：Pinia
- **数据访问**：Axios + service 分层
- **Mock 支撑**：axios-mock-adapter
- **后端框架**：Node.js + Express
- **数据库**：MySQL 8.0
- **代码质量**：ESLint + Prettier + Stylelint

## 核心功能

### PC 端大屏

- **总览卡片**：总主机数、在线主机、告警主机、离线主机、平均 CPU、平均内存、活跃告警
- **CPU 趋势**：7 天 CPU 使用率趋势，含平均/最高/最低曲线
- **内存趋势**：7 天内存使用趋势
- **磁盘 I/O**：磁盘利用率柱状图
- **网络流量**：入站/出站带宽趋势
- **主机状态**：20 台主机实时状态表格
- **告警列表**：实时告警滚动列表
- **指标分布**：CPU/内存/网络/进程/磁盘指标分类统计
- **机房状态**：A/B 机房主机分布

### 移动端

- 自适应响应式布局
- 纵向滚动展示所有监控指标
- 768px 以下自动切换移动端视图

## 页面截图

![数据中心监控大屏](docs/screenshots/dashboard.png)

## 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run preview      # 预览构建产物
npm run lint         # 代码检查
npm run format       # 代码格式化
npm run test         # 单元测试
```

## 部署

### 生产环境

```bash
npm run build
# 将 dist/ 目录部署到 Nginx 或其他静态服务器
```

### Docker

```bash
docker-compose up --build
```

前端访问：http://localhost
后端 API：http://localhost:3001/api/dashboard

## License

MIT
