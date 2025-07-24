// 公共脚本 - 侧边栏和导航功能

// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    // 恢复侧边栏状态
    restoreSidebarState();
    
    // 设置当前页面的激活状态
    setActiveMenuItem();
});

// 切换侧边栏
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content, .main-content');
    
    sidebar.classList.toggle('active');
    content.classList.toggle('sidebar-active');
    
    // 保存侧边栏状态
    localStorage.setItem('sidebarState', sidebar.classList.contains('active') ? 'open' : 'closed');
}

// 恢复侧边栏状态
function restoreSidebarState() {
    const sidebarState = localStorage.getItem('sidebarState');
    const expandedMenu = localStorage.getItem('expandedMenu');
    
    if (sidebarState === 'closed') {
        const sidebar = document.querySelector('.sidebar');
        const content = document.querySelector('.content, .main-content');
        
        if (sidebar && content) {
            sidebar.classList.remove('active');
            content.classList.remove('sidebar-active');
        }
    }
    
    // 恢复展开的菜单
    if (expandedMenu === 'station') {
        const stationMenu = document.querySelector('.menu-parent');
        const submenu = stationMenu?.nextElementSibling;
        
        if (stationMenu && submenu) {
            stationMenu.classList.add('expanded');
            submenu.classList.add('open');
        }
    }
}

// 切换子菜单
function toggleSubmenu(menuParent) {
    const submenu = menuParent.nextElementSibling;
    const isOpen = submenu.classList.contains('open');
    
    // 关闭所有其他子菜单
    document.querySelectorAll('.submenu.open').forEach(menu => {
        if (menu !== submenu) {
            menu.classList.remove('open');
            menu.previousElementSibling.classList.remove('expanded');
        }
    });
    
    // 切换当前子菜单
    if (isOpen) {
        submenu.classList.remove('open');
        menuParent.classList.remove('expanded');
        localStorage.removeItem('expandedMenu');
    } else {
        submenu.classList.add('open');
        menuParent.classList.add('expanded');
        // 保存展开状态
        localStorage.setItem('expandedMenu', 'station');
    }
}

// 设置当前页面的激活菜单项
function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop();
    
    // 移除所有激活状态
    document.querySelectorAll('.menu-item.active, .submenu-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置当前页面的激活状态
    document.querySelectorAll('.menu-item, .submenu-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href && (href === currentFile || href === './' + currentFile)) {
            item.classList.add('active');
            
            // 如果是子菜单项，确保父菜单展开
            if (item.classList.contains('submenu-item')) {
                const submenu = item.closest('.submenu');
                const menuParent = submenu?.previousElementSibling;
                
                if (submenu && menuParent) {
                    submenu.classList.add('open');
                    menuParent.classList.add('expanded');
                    localStorage.setItem('expandedMenu', 'station');
                }
            }
        }
    });
}

// 返回上一页
function goBack() {
    window.location.href = '../scenario-selection.html';
}

// 切换语言
function toggleLanguage() {
    const langText = document.getElementById('lang-text');
    const currentLang = localStorage.getItem('language') || 'zh';
    
    if (currentLang === 'zh') {
        langText.textContent = 'EN';
        localStorage.setItem('language', 'en');
    } else {
        langText.textContent = '中文';
        localStorage.setItem('language', 'zh');
    }
    
    // 如果页面支持国际化，触发语言切换
    if (typeof updateLanguage === 'function') {
        updateLanguage();
    }
}

// 切换主题
function toggleTheme() {
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// 恢复主题设置
function restoreTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '☀️';
    }
}

// 页面加载时恢复主题
restoreTheme();