/**
 * 应用初始化模块
 * 负责初始化整个应用，包括配置加载、模块初始化、路由注册等
 */

class Application {
    constructor() {
        this.version = '1.0.0';
        this.config = null;
        this.modules = new Map();
        this.initialized = false;
    }

    /**
     * 初始化应用
     */
    async init() {
        try {
            console.log(`Energy Storage System v${this.version} initializing...`);

            // 加载配置
            await this.loadConfig();

            // 初始化核心模块
            await this.initCoreModules();

            // 注册路由
            this.registerRoutes();

            // 绑定全局事件
            this.bindGlobalEvents();

            // 初始化UI
            this.initUI();

            // 检查认证状态
            this.checkAuth();

            this.initialized = true;
            console.log('Application initialized successfully');

            // 触发应用就绪事件
            this.emit('app:ready');

        } catch (error) {
            console.error('Application initialization failed:', error);
            this.showError('系统初始化失败，请刷新页面重试');
        }
    }

    /**
     * 加载配置
     */
    async loadConfig() {
        try {
            // 从配置文件加载
            const response = await fetch('/src/config/app.config.js');
            if (response.ok) {
                const configModule = await import('/src/config/app.config.js');
                this.config = configModule.default || configModule.APP_CONFIG;
            } else {
                // 使用默认配置
                this.config = this.getDefaultConfig();
            }
        } catch (error) {
            console.warn('Failed to load config, using defaults:', error);
            this.config = this.getDefaultConfig();
        }
    }

    /**
     * 获取默认配置
     */
    getDefaultConfig() {
        return {
            appName: 'Energy Storage System',
            version: this.version,
            defaultLanguage: 'zh-CN',
            defaultTheme: 'light',
            apiBaseUrl: '/api',
            wsUrl: 'ws://localhost:8080',
            refreshInterval: {
                realtime: 1000,
                dashboard: 5000,
                device: 3000,
                alarm: 10000
            }
        };
    }

    /**
     * 初始化核心模块
     */
    async initCoreModules() {
        // 初始化存储模块
        const storage = new Storage('ess_');
        this.registerModule('storage', storage);

        // 初始化国际化
        const i18n = new I18n();
        await i18n.init();
        this.registerModule('i18n', i18n);

        // 初始化主题管理
        const themeManager = new ThemeManager();
        themeManager.init();
        this.registerModule('theme', themeManager);

        // 初始化认证模块
        const auth = new Auth();
        auth.init();
        this.registerModule('auth', auth);

        // 初始化路由
        const router = new Router();
        this.registerModule('router', router);

        // 初始化事件总线
        const eventBus = new EventBus();
        this.registerModule('eventBus', eventBus);
    }

    /**
     * 注册模块
     */
    registerModule(name, instance) {
        this.modules.set(name, instance);
        // 将常用模块挂载到window对象，方便调试
        if (['storage', 'auth', 'router', 'i18n'].includes(name)) {
            window[name] = instance;
        }
    }

    /**
     * 获取模块
     */
    getModule(name) {
        return this.modules.get(name);
    }

    /**
     * 注册路由
     */
    registerRoutes() {
        const router = this.getModule('router');
        
        // 登录页
        router.register('/login', {
            component: () => import('../modules/auth/login.js'),
            title: 'login.title',
            requiresAuth: false
        });

        // 仪表盘
        router.register('/dashboard', {
            component: () => import('../modules/dashboard/overview.js'),
            title: 'dashboard.title',
            requiresAuth: true
        });

        // 设备管理
        router.register('/device/list', {
            component: () => import('../modules/device/device-list.js'),
            title: 'device.list',
            requiresAuth: true
        });

        router.register('/device/detail/:id', {
            component: () => import('../modules/device/device-detail.js'),
            title: 'device.detail',
            requiresAuth: true
        });

        // 能源分析
        router.register('/energy/analysis', {
            component: () => import('../modules/analysis/energy-analysis.js'),
            title: 'energy.analysis',
            requiresAuth: true
        });

        // 告警管理
        router.register('/alarm/list', {
            component: () => import('../modules/alarm/alarm-list.js'),
            title: 'alarm.list',
            requiresAuth: true
        });

        // 系统设置
        router.register('/system/settings', {
            component: () => import('../modules/system/settings.js'),
            title: 'system.settings',
            requiresAuth: true,
            permissions: ['admin']
        });

        // 默认路由
        router.register('/', {
            redirect: '/dashboard'
        });

        // 404页面
        router.register('/404', {
            component: () => import('../modules/error/404.js'),
            title: '404',
            requiresAuth: false
        });
    }

    /**
     * 绑定全局事件
     */
    bindGlobalEvents() {
        // 监听窗口大小变化
        window.addEventListener('resize', this.debounce(() => {
            this.emit('window:resize');
        }, 300));

        // 监听网络状态
        window.addEventListener('online', () => {
            this.emit('network:online');
            this.showNotification('网络已连接', 'success');
        });

        window.addEventListener('offline', () => {
            this.emit('network:offline');
            this.showNotification('网络已断开', 'error');
        });

        // 监听存储变化（多标签页同步）
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('ess_')) {
                this.emit('storage:change', {
                    key: e.key,
                    oldValue: e.oldValue,
                    newValue: e.newValue
                });
            }
        });

        // 全局错误处理
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason);
        });
    }

    /**
     * 初始化UI
     */
    initUI() {
        // 设置页面标题
        document.title = this.config.appName;

        // 初始化加载状态
        this.hideLoader();

        // 初始化通知系统
        this.initNotificationSystem();

        // 初始化快捷键
        this.initKeyboardShortcuts();

        // 显示认证页面
        document.getElementById('ess-auth').style.display = 'block';
    }

    /**
     * 检查认证状态
     */
    checkAuth() {
        // 初始化新的认证模块
        if (window.AuthModule) {
            const authModule = new window.AuthModule();
            authModule.checkLoginStatus();
            this.registerModule('authModule', authModule);
        }
    }

    /**
     * 初始化通知系统
     */
    initNotificationSystem() {
        // 创建通知容器
        const container = document.createElement('div');
        container.id = 'ess-notification-container';
        container.className = 'ess-notification-container';
        document.body.appendChild(container);
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = new Notification({
            message,
            type,
            duration
        });
        notification.show();
    }

    /**
     * 初始化快捷键
     */
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S: 保存
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.emit('shortcut:save');
            }

            // Ctrl/Cmd + /: 显示快捷键帮助
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showShortcutsHelp();
            }

            // ESC: 关闭模态框
            if (e.key === 'Escape') {
                this.emit('shortcut:escape');
            }
        });
    }

    /**
     * 显示快捷键帮助
     */
    showShortcutsHelp() {
        // TODO: 实现快捷键帮助弹窗
        console.log('Keyboard shortcuts help');
    }

    /**
     * 处理错误
     */
    handleError(error) {
        // 记录错误
        console.error('Application error:', error);

        // 发送错误报告（如果配置了）
        if (this.config.errorReporting) {
            this.reportError(error);
        }

        // 显示用户友好的错误信息
        const message = error.message || '系统出现错误';
        this.showNotification(message, 'error');
    }

    /**
     * 报告错误
     */
    async reportError(error) {
        // TODO: 实现错误上报逻辑
        console.log('Reporting error:', error);
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        // TODO: 实现错误提示UI
        alert(message);
    }

    /**
     * 显示/隐藏加载器
     */
    showLoader() {
        const loader = document.getElementById('ess-loader');
        if (loader) {
            loader.style.display = 'flex';
        }
    }

    hideLoader() {
        const loader = document.getElementById('ess-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    /**
     * 事件发射
     */
    emit(event, data) {
        const eventBus = this.getModule('eventBus');
        if (eventBus) {
            eventBus.emit(event, data);
        }
    }

    /**
     * 事件监听
     */
    on(event, handler) {
        const eventBus = this.getModule('eventBus');
        if (eventBus) {
            eventBus.on(event, handler);
        }
    }

    /**
     * 防抖函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 节流函数
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// 创建应用实例
const app = new Application();

// 导出应用实例
window.App = app;

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});