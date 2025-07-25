// 导航栏组件
class Navbar {
    constructor() {
        // 简化构造函数
    }

    // 创建导航栏HTML
    create() {
        const navbar = document.createElement('nav');
        navbar.className = 'main-header';
        navbar.innerHTML = `
            <div class="header-left">
                <button class="menu-btn" onclick="window.sidebar.toggle()">
                    <span>☰</span>
                </button>
                <button class="back-btn" onclick="history.back()">
                    <span>←</span>
                </button>
                <h1 class="page-title"></h1>
            </div>
            <div class="header-right">
                <button class="nav-btn" onclick="window.navbar.toggleLanguage()">
                    <span>🌐</span>
                    <span class="hide-mobile">中文</span>
                </button>
                <button class="nav-btn" onclick="window.navbar.toggleTheme()">
                    <span>🌙</span>
                </button>
                <button class="nav-btn" onclick="window.navbar.showUserMenu()">
                    <span>👤</span>
                    <span class="hide-mobile">管理员</span>
                </button>
            </div>
        `;
        
        return navbar;
    }


    // 初始化
    init() {
        // 设置页面标题
        const pageTitle = document.querySelector('title').textContent.split(' - ')[0];
        const titleElement = document.querySelector('.page-title');
        if (titleElement) {
            titleElement.textContent = pageTitle;
        }
        
    }


    // 切换语言
    toggleLanguage() {
        // 这里可以实现语言切换逻辑
        this.showToast('语言切换功能开发中...');
    }

    // 切换主题
    toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // 更新按钮图标
        const themeBtn = document.querySelector('.nav-btn:nth-child(3) span');
        themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    // 显示用户菜单
    showUserMenu() {
        // 这里可以实现用户菜单逻辑
        this.showToast('用户菜单开发中...');
    }

    // 显示提示消息
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }
}

// 初始化导航栏
document.addEventListener('DOMContentLoaded', function() {
    // 创建导航栏容器
    const existingHeader = document.querySelector('.main-header, .navbar');
    if (existingHeader) {
        const navbar = new Navbar();
        const newHeader = navbar.create();
        existingHeader.parentNode.replaceChild(newHeader, existingHeader);
        navbar.init();
        window.navbar = navbar;
    }
    
    // 应用保存的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
});