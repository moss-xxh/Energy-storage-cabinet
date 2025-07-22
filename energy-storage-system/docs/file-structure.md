# 工商储能柜能源管理系统文件结构规划

## 项目根目录结构
```
energy-storage-system/
├── docs/                          # 文档目录
│   ├── requirements.md            # 需求文档
│   ├── task-list.md              # 任务清单
│   ├── technical-architecture.md  # 技术架构
│   ├── file-structure.md         # 文件结构（本文档）
│   ├── api-docs.md               # API文档
│   ├── user-manual.md            # 用户手册
│   └── deployment.md             # 部署文档
│
├── src/                          # 源代码目录
│   ├── pages/                    # 页面文件
│   ├── styles/                   # 样式文件
│   ├── scripts/                  # JavaScript文件
│   ├── components/               # 组件文件
│   ├── assets/                   # 静态资源
│   └── config/                   # 配置文件
│
├── dist/                         # 构建输出目录
├── tests/                        # 测试文件目录
├── tools/                        # 工具脚本目录
├── .gitignore                    # Git忽略文件
├── README.md                     # 项目说明文档
├── package.json                  # 项目配置文件
└── LICENSE                       # 许可证文件
```

## 1. 页面文件（src/pages/）
```
src/pages/
├── index.html                    # 主入口页面
├── login.html                    # 登录页面
├── dashboard.html                # 仪表盘页面
├── device-list.html             # 设备列表页面
├── device-detail.html           # 设备详情页面
├── energy-analysis.html         # 能源分析页面
├── alarm-manage.html            # 告警管理页面
├── report-center.html           # 报表中心页面
├── system-settings.html         # 系统设置页面
└── user-profile.html            # 用户信息页面
```

## 2. 样式文件（src/styles/）
```
src/styles/
├── base/                        # 基础样式
│   ├── reset.css               # 样式重置
│   ├── variables.css           # CSS变量
│   ├── typography.css          # 排版样式
│   └── animations.css          # 动画效果
│
├── layout/                      # 布局样式
│   ├── grid.css                # 网格系统
│   ├── header.css              # 顶部导航
│   ├── sidebar.css             # 侧边栏
│   ├── footer.css              # 底部
│   └── responsive.css          # 响应式
│
├── components/                  # 组件样式
│   ├── button.css              # 按钮
│   ├── form.css                # 表单
│   ├── input.css               # 输入框
│   ├── select.css              # 下拉框
│   ├── checkbox.css            # 复选框
│   ├── radio.css               # 单选框
│   ├── switch.css              # 开关
│   ├── table.css               # 表格
│   ├── pagination.css          # 分页
│   ├── modal.css               # 模态框
│   ├── drawer.css              # 抽屉
│   ├── tabs.css                # 标签页
│   ├── card.css                # 卡片
│   ├── badge.css               # 徽标
│   ├── tooltip.css             # 提示框
│   ├── dropdown.css            # 下拉菜单
│   ├── breadcrumb.css          # 面包屑
│   ├── loading.css             # 加载
│   ├── progress.css            # 进度条
│   └── notification.css        # 通知
│
├── modules/                     # 模块样式
│   ├── auth.css                # 认证模块
│   ├── dashboard.css           # 仪表板
│   ├── device.css              # 设备管理
│   ├── analysis.css            # 数据分析
│   ├── alarm.css               # 告警管理
│   ├── report.css              # 报表中心
│   └── system.css              # 系统设置
│
├── themes/                      # 主题样式
│   ├── default.css             # 默认主题
│   ├── dark.css                # 深色主题
│   └── custom.css              # 自定义主题
│
├── utils/                       # 工具样式
│   ├── helpers.css             # 辅助类
│   └── print.css               # 打印样式
│
└── main.css                     # 主样式文件
```

## 3. JavaScript文件（src/scripts/）
```
src/scripts/
├── core/                        # 核心模块
│   ├── app.js                  # 应用初始化
│   ├── router.js               # 路由管理
│   ├── auth.js                 # 认证管理
│   ├── permission.js           # 权限管理
│   ├── request.js              # HTTP请求
│   ├── websocket.js            # WebSocket
│   ├── storage.js              # 存储管理
│   ├── event-bus.js            # 事件总线
│   └── i18n.js                 # 国际化
│
├── components/                  # 组件脚本
│   ├── base/                   # 基础组件
│   │   ├── component.js        # 组件基类
│   │   ├── button.js           # 按钮组件
│   │   ├── input.js            # 输入组件
│   │   ├── select.js           # 下拉组件
│   │   └── form.js             # 表单组件
│   │
│   ├── advanced/               # 高级组件
│   │   ├── table.js            # 表格组件
│   │   ├── modal.js            # 模态框
│   │   ├── drawer.js           # 抽屉组件
│   │   ├── tabs.js             # 标签页
│   │   └── upload.js           # 上传组件
│   │
│   ├── chart/                  # 图表组件
│   │   ├── line-chart.js       # 折线图
│   │   ├── bar-chart.js        # 柱状图
│   │   ├── pie-chart.js        # 饼图
│   │   ├── gauge-chart.js      # 仪表盘
│   │   └── flow-chart.js       # 流向图
│   │
│   └── feedback/               # 反馈组件
│       ├── toast.js            # 轻提示
│       ├── notification.js     # 通知
│       ├── confirm.js          # 确认框
│       └── loading.js          # 加载
│
├── modules/                     # 业务模块
│   ├── auth/                   # 认证模块
│   │   ├── login.js            # 登录逻辑
│   │   ├── register.js         # 注册逻辑
│   │   └── logout.js           # 退出逻辑
│   │
│   ├── dashboard/              # 仪表板模块
│   │   ├── overview.js         # 总览
│   │   ├── statistics.js       # 统计
│   │   └── realtime.js         # 实时数据
│   │
│   ├── device/                 # 设备模块
│   │   ├── device-list.js      # 设备列表
│   │   ├── device-detail.js    # 设备详情
│   │   ├── device-control.js   # 设备控制
│   │   └── device-config.js    # 设备配置
│   │
│   ├── monitor/                # 监控模块
│   │   ├── realtime-monitor.js # 实时监控
│   │   ├── history-data.js     # 历史数据
│   │   └── data-export.js      # 数据导出
│   │
│   ├── analysis/               # 分析模块
│   │   ├── energy-analysis.js  # 能源分析
│   │   ├── efficiency.js       # 效率分析
│   │   └── cost-benefit.js     # 成本效益
│   │
│   ├── alarm/                  # 告警模块
│   │   ├── alarm-list.js       # 告警列表
│   │   ├── alarm-config.js     # 告警配置
│   │   └── alarm-history.js    # 告警历史
│   │
│   ├── report/                 # 报表模块
│   │   ├── report-generate.js  # 报表生成
│   │   ├── report-template.js  # 报表模板
│   │   └── report-export.js    # 报表导出
│   │
│   └── system/                 # 系统模块
│       ├── settings.js         # 系统设置
│       ├── user-manage.js      # 用户管理
│       ├── role-manage.js      # 角色管理
│       └── log-manage.js       # 日志管理
│
├── utils/                      # 工具函数
│   ├── formatter.js            # 格式化
│   ├── validator.js            # 验证器
│   ├── datetime.js             # 日期时间
│   ├── calculator.js           # 计算器
│   ├── converter.js            # 转换器
│   └── helpers.js              # 辅助函数
│
├── config/                     # 配置文件
│   ├── app.config.js           # 应用配置
│   ├── api.config.js           # API配置
│   ├── chart.config.js         # 图表配置
│   └── theme.config.js         # 主题配置
│
└── main.js                     # 入口文件
```

## 4. 组件文件（src/components/）
```
src/components/
├── button/                     # 按钮组件
│   ├── button.html            # 组件模板
│   ├── button.js              # 组件逻辑
│   └── button.css             # 组件样式
│
├── modal/                      # 模态框组件
│   ├── modal.html
│   ├── modal.js
│   └── modal.css
│
├── table/                      # 表格组件
│   ├── table.html
│   ├── table.js
│   └── table.css
│
└── ...                         # 其他组件
```

## 5. 静态资源（src/assets/）
```
src/assets/
├── images/                     # 图片资源
│   ├── logo/                  # Logo图片
│   ├── icons/                 # 图标
│   ├── bg/                    # 背景图
│   └── placeholder/           # 占位图
│
├── fonts/                      # 字体文件
│   ├── roboto/
│   └── iconfont/
│
├── data/                       # 静态数据
│   ├── menu.json              # 菜单数据
│   ├── mock.json              # 模拟数据
│   └── i18n/                  # 国际化数据
│       ├── zh-CN.json
│       └── en-US.json
│
└── libs/                       # 第三方库
    ├── echarts/               # ECharts
    └── ...
```

## 6. 配置文件（src/config/）
```
src/config/
├── app.config.js              # 应用配置
├── api.config.js              # API接口配置
├── router.config.js           # 路由配置
├── menu.config.js             # 菜单配置
├── permission.config.js       # 权限配置
├── theme.config.js            # 主题配置
└── chart.config.js            # 图表配置
```

## 7. 测试文件（tests/）
```
tests/
├── unit/                       # 单元测试
│   ├── components/            # 组件测试
│   ├── utils/                 # 工具测试
│   └── modules/               # 模块测试
│
├── integration/               # 集成测试
│   ├── auth.test.js          # 认证测试
│   ├── api.test.js           # API测试
│   └── workflow.test.js      # 流程测试
│
└── e2e/                       # 端到端测试
    ├── login.e2e.js          # 登录测试
    ├── dashboard.e2e.js      # 仪表板测试
    └── device.e2e.js         # 设备管理测试
```

## 8. 工具脚本（tools/）
```
tools/
├── build.js                   # 构建脚本
├── dev-server.js             # 开发服务器
├── compress.js               # 压缩脚本
├── deploy.js                 # 部署脚本
└── generate-docs.js          # 文档生成
```

## 命名规范

### 1. 文件命名
- HTML文件：小写，用连字符分隔（`device-list.html`）
- CSS文件：小写，用连字符分隔（`button-group.css`）
- JS文件：小写，用连字符分隔（`auth-manager.js`）
- 组件文件夹：小写，用连字符分隔（`date-picker/`）

### 2. 代码命名
- 类名：大驼峰（`DeviceManager`）
- 函数名：小驼峰（`getUserInfo`）
- 常量名：大写下划线（`API_BASE_URL`）
- CSS类名：BEM规范（`.ess-button--primary`）

### 3. 路径别名
- `@/` → `src/`
- `@components/` → `src/components/`
- `@utils/` → `src/scripts/utils/`
- `@config/` → `src/config/`

## 开发规范

### 1. 组件开发
- 每个组件独立文件夹，包含HTML、JS、CSS
- 组件命名语义化，功能明确
- 提供组件文档和使用示例

### 2. 模块划分
- 按功能模块组织代码
- 模块间低耦合高内聚
- 统一的模块接口定义

### 3. 样式隔离
- 使用BEM命名规范
- 组件样式独立文件
- 避免全局样式污染

### 4. 代码复用
- 提取公共组件
- 封装工具函数
- 配置统一管理

### 5. 文档注释
- 函数必须有注释
- 复杂逻辑添加说明
- 维护更新日志

### 6. 版本管理
- 使用Git进行版本控制
- 遵循Git Flow工作流
- 规范的提交信息格式