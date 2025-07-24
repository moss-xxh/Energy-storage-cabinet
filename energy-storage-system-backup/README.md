# 工商储能柜能源管理系统

> 一个基于纯前端技术的工商储能柜能源管理系统，采用 HTML5 + CSS3 + JavaScript 原生技术栈开发，提供完整的储能设备监控和管理功能。

## 🚀 项目特性

- ✅ **纯前端实现** - 无需后端服务器，使用 localStorage 存储数据
- ✅ **模块化架构** - JS/HTML/CSS 完全分离，易于维护和扩展
- ✅ **响应式设计** - 完美支持 PC 端和移动端访问
- ✅ **多语言支持** - 内置中英文切换，可扩展其他语言
- ✅ **主题切换** - 支持浅色/深色主题，跟随系统设置
- ✅ **数据可视化** - 集成 ECharts 图表库，丰富的数据展示
- ✅ **组件化开发** - 可复用的 UI 组件库
- ✅ **实时数据模拟** - 内置数据生成器，模拟真实场景

## 📋 功能模块

### 1. 用户认证
- 用户登录/登出
- 权限管理（管理员/操作员/访客）
- 记住登录状态

### 2. 仪表盘
- 系统总览
- 实时数据监控
- 关键指标展示
- 设备状态统计

### 3. 设备管理
- 设备列表展示
- 设备详情查看
- 设备参数配置
- 设备控制操作
- 电池/PCS/BMS 管理

### 4. 能源分析
- 充放电数据统计
- 能效分析计算
- 成本收益分析
- 优化建议生成

### 5. 告警管理
- 实时告警监控
- 告警历史记录
- 告警级别分类
- 告警配置管理

### 6. 报表中心
- 日/月/年度报表
- 自定义报表生成
- 数据导出（CSV/Excel）
- 报表打印

### 7. 系统设置
- 系统参数配置
- 用户管理
- 角色权限管理
- 操作日志查看

## 🛠️ 技术栈

- **前端基础**: HTML5, CSS3, JavaScript (ES6+)
- **CSS 架构**: BEM 命名规范, CSS 变量, 模块化
- **JavaScript**: 原生 ES6+, 模块化开发, 面向对象
- **数据可视化**: ECharts 5.x
- **构建工具**: 原生模块化，无需构建工具
- **版本控制**: Git

## 📦 项目结构

```
energy-storage-system/
├── docs/                    # 项目文档
├── src/                     # 源代码
│   ├── pages/              # 页面文件
│   ├── styles/             # 样式文件
│   │   ├── base/          # 基础样式
│   │   ├── layout/        # 布局样式
│   │   ├── components/    # 组件样式
│   │   ├── modules/       # 模块样式
│   │   ├── themes/        # 主题样式
│   │   └── utils/         # 工具样式
│   ├── scripts/            # JavaScript文件
│   │   ├── core/          # 核心模块
│   │   ├── components/    # UI组件
│   │   ├── modules/       # 业务模块
│   │   ├── utils/         # 工具函数
│   │   └── config/        # 配置文件
│   ├── components/         # 组件文件
│   ├── assets/             # 静态资源
│   └── config/             # 配置文件
├── dist/                    # 构建输出
├── tests/                   # 测试文件
├── tools/                   # 工具脚本
└── index.html              # 入口文件
```

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-username/energy-storage-system.git
cd energy-storage-system
```

### 2. 安装依赖（可选）
本项目为纯前端项目，无需安装依赖。如需使用开发服务器：
```bash
# 使用 Python 启动简单服务器
python -m http.server 8080

# 或使用 Node.js 的 http-server
npx http-server -p 8080
```

### 3. 访问系统
在浏览器中打开 `http://localhost:8080` 或直接打开 `index.html` 文件

### 4. 默认账号
- 管理员：用户名 `admin`，密码 `admin123`
- 普通用户：用户名 `user`，密码 `user123`

## 📖 开发指南

### 代码规范
- JavaScript: ESLint 配置，遵循 Airbnb 规范
- CSS: BEM 命名规范，使用 CSS 变量
- HTML: 语义化标签，无障碍支持

### 组件开发
```javascript
// 创建新组件示例
class MyComponent extends Component {
    constructor(options) {
        super(options);
        this.init();
    }
    
    init() {
        this.render();
        this.bindEvents();
    }
    
    render() {
        this.element.innerHTML = this.template();
    }
    
    template() {
        return `<div class="ess-my-component">...</div>`;
    }
}
```

### 添加新页面
1. 在 `src/pages/` 创建页面文件
2. 在 `src/scripts/modules/` 创建页面逻辑
3. 在 `src/config/router.config.js` 注册路由
4. 在 `src/config/menu.config.js` 添加菜单项

## 🔧 配置说明

### 应用配置
编辑 `src/config/app.config.js` 文件：
```javascript
export const APP_CONFIG = {
    appName: '工商储能柜能源管理系统',
    version: '1.0.0',
    defaultLanguage: 'zh-CN',
    defaultTheme: 'light',
    // ... 其他配置
};
```

### 主题定制
编辑 `src/styles/base/variables.css` 文件自定义主题颜色：
```css
:root {
    --color-primary: #1890ff;
    --color-success: #52c41a;
    /* ... 其他颜色变量 */
}
```

## 🌐 浏览器支持

| 浏览器 | 版本 |
|--------|------|
| Chrome | 最新版 |
| Firefox | 最新版 |
| Safari | 最新版 |
| Edge | 最新版 |
| IE | 11+ (部分功能降级) |

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📞 联系方式

- 项目主页: [https://github.com/your-username/energy-storage-system](https://github.com/your-username/energy-storage-system)
- Issue 反馈: [https://github.com/your-username/energy-storage-system/issues](https://github.com/your-username/energy-storage-system/issues)

## 🙏 致谢

- [ECharts](https://echarts.apache.org/) - 优秀的数据可视化库
- [MDN Web Docs](https://developer.mozilla.org/) - Web 技术文档
- 所有贡献者和支持者

---

⭐ 如果这个项目对您有帮助，请给一个 Star！