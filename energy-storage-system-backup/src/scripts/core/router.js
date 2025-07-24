// 路由管理模块
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.beforeEachHooks = [];
        this.afterEachHooks = [];
        this.init();
    }
    
    // 初始化
    init() {
        // 监听hash变化
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('load', () => this.handleRouteChange());
    }
    
    // 注册路由
    register(path, options) {
        this.routes.set(path, {
            path,
            component: options.component,
            title: options.title,
            requiresAuth: options.requiresAuth !== false, // 默认需要认证
            permissions: options.permissions || [],
            meta: options.meta || {}
        });
    }
    
    // 添加全局前置守卫
    beforeEach(hook) {
        this.beforeEachHooks.push(hook);
    }
    
    // 添加全局后置守卫
    afterEach(hook) {
        this.afterEachHooks.push(hook);
    }
    
    // 处理路由变化
    async handleRouteChange() {
        const hash = window.location.hash || '#/';
        const path = hash.replace('#', '');
        
        // 查找匹配的路由
        const route = this.routes.get(path) || this.routes.get('/404');
        
        if (!route) {
            console.error(`Route not found: ${path}`);
            return;
        }
        
        // 执行前置守卫
        for (const hook of this.beforeEachHooks) {
            const result = await hook(route, this.currentRoute);
            if (result === false) {
                return; // 取消导航
            }
            if (typeof result === 'string') {
                // 重定向
                window.location.hash = result;
                return;
            }
        }
        
        // 更新当前路由
        const fromRoute = this.currentRoute;
        this.currentRoute = route;
        
        // 渲染组件
        await this.renderRoute(route);
        
        // 执行后置守卫
        for (const hook of this.afterEachHooks) {
            await hook(route, fromRoute);
        }
    }
    
    // 渲染路由
    async renderRoute(route) {
        const container = document.getElementById('page-container');
        if (!container) return;
        
        // 显示加载状态
        this.showLoader(true);
        
        try {
            // 清空容器
            container.innerHTML = '';
            
            // 渲染组件
            if (typeof route.component === 'function') {
                await route.component(container);
            } else if (typeof route.component === 'string') {
                container.innerHTML = route.component;
            }
            
            // 更新页面标题
            if (route.title) {
                document.title = `${i18n.t(route.title)} - ${i18n.t('system.title')}`;
            }
            
            // 更新导航状态
            this.updateNavigation(route.path);
            
            // 重新初始化i18n
            i18n.updatePage();
            
        } catch (error) {
            console.error('Route render error:', error);
            container.innerHTML = `
                <div class="error-page">
                    <h2>${i18n.t('common.error')}</h2>
                    <p>${error.message}</p>
                </div>
            `;
        } finally {
            this.showLoader(false);
        }
    }
    
    // 更新导航状态
    updateNavigation(path) {
        // 更新顶部导航
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${path}`) {
                link.classList.add('nav-link--active');
            } else {
                link.classList.remove('nav-link--active');
            }
        });
        
        // 更新侧边栏菜单
        document.querySelectorAll('.menu-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href === `#${path}`) {
                item.classList.add('menu-item--active');
            } else {
                item.classList.remove('menu-item--active');
            }
        });
    }
    
    // 导航到指定路由
    push(path) {
        window.location.hash = path;
    }
    
    // 替换当前路由
    replace(path) {
        window.location.replace(`#${path}`);
    }
    
    // 返回
    back() {
        window.history.back();
    }
    
    // 前进
    forward() {
        window.history.forward();
    }
    
    // 显示/隐藏加载器
    showLoader(show) {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }
    
    // 获取当前路由
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    // 获取路由参数
    getParams() {
        const hash = window.location.hash;
        const queryIndex = hash.indexOf('?');
        if (queryIndex === -1) return {};
        
        const queryString = hash.slice(queryIndex + 1);
        const params = {};
        
        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            params[key] = decodeURIComponent(value || '');
        });
        
        return params;
    }
}

// 创建全局实例
const router = new Router();

// 添加认证守卫
router.beforeEach((to, from) => {
    // 检查是否需要认证
    if (to.requiresAuth && !auth.isAuthenticated()) {
        // 重定向到登录页
        return CONFIG.ROUTES.LOGIN;
    }
    
    // 检查权限
    if (to.permissions.length > 0) {
        const hasPermission = to.permissions.some(permission => 
            auth.hasPermission(permission)
        );
        
        if (!hasPermission) {
            console.warn('No permission to access:', to.path);
            return false; // 取消导航
        }
    }
    
    return true;
});