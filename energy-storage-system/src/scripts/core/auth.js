// 认证管理模块
class Auth {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.init();
    }
    
    // 初始化
    init() {
        // 从localStorage恢复用户信息
        const savedUser = storage.get('user');
        const savedToken = storage.get('token');
        
        if (savedUser && savedToken) {
            this.currentUser = savedUser;
            this.token = savedToken;
        }
    }
    
    // 登录
    login(username, password) {
        // 模拟登录验证
        const user = CONFIG.DEFAULT_USERS.find(u => 
            u.username === username && u.password === password
        );
        
        if (!user) {
            return {
                success: false,
                message: i18n.t('login.error')
            };
        }
        
        // 生成模拟token
        const token = this.generateToken(user);
        
        // 保存用户信息
        const userInfo = {
            id: Date.now(),
            username: user.username,
            name: user.name,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        
        this.currentUser = userInfo;
        this.token = token;
        
        // 保存到localStorage（7天过期）
        storage.set('user', userInfo, 7 * 24 * 60 * 60 * 1000);
        storage.set('token', token, 7 * 24 * 60 * 60 * 1000);
        
        return {
            success: true,
            user: userInfo,
            token: token
        };
    }
    
    // 登出
    logout() {
        this.currentUser = null;
        this.token = null;
        
        storage.remove('user');
        storage.remove('token');
        
        // 触发登出事件
        window.dispatchEvent(new CustomEvent('userLogout'));
        
        // 跳转到登录页
        window.location.hash = CONFIG.ROUTES.LOGIN;
    }
    
    // 检查是否已登录
    isAuthenticated() {
        return this.currentUser !== null && this.token !== null;
    }
    
    // 获取当前用户
    getUser() {
        return this.currentUser;
    }
    
    // 获取用户角色
    getUserRole() {
        return this.currentUser?.role || 'guest';
    }
    
    // 检查权限
    hasPermission(permission) {
        const role = this.getUserRole();
        
        // 简单的权限判断
        const permissions = {
            admin: ['*'], // 管理员拥有所有权限
            user: ['view', 'export'], // 普通用户只能查看和导出
            guest: [] // 访客无权限
        };
        
        if (permissions[role]?.includes('*')) {
            return true;
        }
        
        return permissions[role]?.includes(permission) || false;
    }
    
    // 生成模拟token
    generateToken(user) {
        const payload = {
            username: user.username,
            role: user.role,
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天过期
        };
        
        // 简单的base64编码作为token
        return btoa(JSON.stringify(payload));
    }
    
    // 验证token
    validateToken() {
        if (!this.token) return false;
        
        try {
            const payload = JSON.parse(atob(this.token));
            
            // 检查是否过期
            if (payload.exp && Date.now() > payload.exp) {
                this.logout();
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Invalid token:', error);
            return false;
        }
    }
    
    // 更新用户信息
    updateUser(updates) {
        if (!this.currentUser) return false;
        
        this.currentUser = {
            ...this.currentUser,
            ...updates
        };
        
        storage.set('user', this.currentUser, 7 * 24 * 60 * 60 * 1000);
        
        // 触发用户更新事件
        window.dispatchEvent(new CustomEvent('userUpdated', { 
            detail: { user: this.currentUser } 
        }));
        
        return true;
    }
}

// 创建全局实例
const auth = new Auth();