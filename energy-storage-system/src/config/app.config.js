/**
 * 应用配置文件
 */

export const APP_CONFIG = {
    // 应用基本信息
    appName: '工商储能柜能源管理系统',
    appNameEn: 'Energy Storage System',
    version: '1.0.0',
    author: 'Energy Storage System Team',
    copyright: '© 2024 Energy Storage System. All rights reserved.',

    // 默认设置
    defaultLanguage: 'zh-CN',
    defaultTheme: 'light',
    defaultPageSize: 20,

    // API配置
    apiBaseUrl: '/api',
    apiTimeout: 30000,
    apiRetryCount: 3,
    apiRetryDelay: 1000,

    // WebSocket配置
    wsUrl: 'ws://localhost:8080/ws',
    wsReconnectInterval: 5000,
    wsMaxReconnectAttempts: 10,

    // 数据刷新间隔（毫秒）
    refreshInterval: {
        realtime: 1000,      // 实时数据
        dashboard: 5000,     // 仪表盘
        device: 3000,        // 设备状态
        alarm: 10000,        // 告警信息
        energy: 60000        // 能源数据
    },

    // 存储配置
    storage: {
        prefix: 'ess_',
        expire: 7 * 24 * 60 * 60 * 1000, // 7天
        encrypt: false
    },

    // 认证配置
    auth: {
        tokenKey: 'ess_token',
        userKey: 'ess_user',
        tokenExpire: 24 * 60 * 60 * 1000, // 24小时
        rememberExpire: 7 * 24 * 60 * 60 * 1000, // 7天
        loginUrl: '/login',
        logoutUrl: '/logout',
        unauthorizedCode: [401, 403]
    },

    // 路由配置
    router: {
        mode: 'hash', // hash | history
        base: '/',
        defaultRoute: '/dashboard',
        loginRoute: '/login',
        notFoundRoute: '/404'
    },

    // 图表配置
    chart: {
        theme: 'default',
        colors: ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2'],
        animationDuration: 1000,
        defaultHeight: 300
    },

    // 表格配置
    table: {
        pageSize: 20,
        pageSizes: [10, 20, 50, 100],
        maxExportRows: 10000
    },

    // 上传配置
    upload: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        chunkSize: 2 * 1024 * 1024 // 2MB
    },

    // 错误处理
    errorHandling: {
        showErrorDetail: true,
        errorReporting: false,
        errorReportUrl: '/api/error/report'
    },

    // 性能监控
    performance: {
        enabled: true,
        sampleRate: 0.1, // 10%采样率
        reportUrl: '/api/performance/report'
    },

    // 功能开关
    features: {
        darkMode: true,
        multiLanguage: true,
        exportData: true,
        printReport: true,
        webSocket: true,
        notification: true,
        keyboard: true
    },

    // 开发配置
    development: {
        mockData: true,
        debugMode: true,
        logLevel: 'debug' // debug | info | warn | error
    }
};

// 环境相关配置
const ENV_CONFIG = {
    development: {
        apiBaseUrl: 'http://localhost:3000/api',
        wsUrl: 'ws://localhost:3000/ws',
        mockData: true,
        debugMode: true
    },
    production: {
        apiBaseUrl: 'https://api.energy-storage.com',
        wsUrl: 'wss://api.energy-storage.com/ws',
        mockData: false,
        debugMode: false
    }
};

// 根据环境合并配置
const environment = process.env.NODE_ENV || 'development';
const envConfig = ENV_CONFIG[environment] || {};

// 导出最终配置
export default Object.assign({}, APP_CONFIG, envConfig);