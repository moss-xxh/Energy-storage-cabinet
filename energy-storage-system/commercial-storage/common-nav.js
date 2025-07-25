// 通用导航栏组件
class CommonNav {
    constructor() {
        this.enterprises = [
            { id: '1', name: '杭州阳光新能源科技有限公司' },
            { id: '2', name: '上海绿能电力集团' },
            { id: '3', name: '北京储能科技有限公司' }
        ];
        this.currentEnterpriseId = '1';
    }

    create(pageTitle) {
        const nav = document.createElement('nav');
        nav.className = 'common-navbar';
        nav.innerHTML = `
            <div class="navbar-left">
                <button class="nav-button" onclick="commonNav.goHome()" title="首页">
                    <span>🏠</span>
                </button>
                <h1 class="navbar-title">${pageTitle}</h1>
                <div class="enterprise-selector" onclick="commonNav.toggleEnterpriseDropdown()">
                    <span id="selectedEnterprise">${this.enterprises[0].name}</span>
                    <span class="dropdown-arrow">▼</span>
                    <div class="enterprise-dropdown" id="enterpriseDropdown">
                        ${this.enterprises.map(enterprise => `
                            <div class="dropdown-item ${enterprise.id === '1' ? 'active' : ''}" 
                                 onclick="commonNav.selectEnterprise('${enterprise.name}', '${enterprise.id}')">
                                ${enterprise.name}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="navbar-right">
                <button class="nav-button" onclick="commonNav.toggleLanguage()">
                    <span>🌐</span>
                    <span id="lang-text">中文</span>
                </button>
                <button class="nav-button" onclick="commonNav.toggleTheme()">
                    <span id="theme-icon">🌙</span>
                </button>
                <div class="user-dropdown">
                    <button class="nav-button user-menu-btn" onclick="commonNav.toggleUserMenu()">
                        <span>👤</span>
                        <span>管理员</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="user-dropdown-menu" id="userDropdownMenu">
                        <div class="dropdown-item" onclick="commonNav.showAccountInfo()">
                            <span>账号信息</span>
                        </div>
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-item logout" onclick="commonNav.confirmLogout()">
                            <span>退出</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return nav;
    }

    insertStyles() {
        if (document.getElementById('common-nav-styles')) return;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'common-nav-styles';
        styleSheet.textContent = `
            .common-navbar {
                background: white;
                border-bottom: 1px solid #e2e8f0;
                padding: 0 2rem;
                height: 64px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: sticky;
                top: 0;
                z-index: 50;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                margin: -20px -20px 20px -20px;
            }

            .navbar-left {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .navbar-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: #1e293b;
                margin: 0;
            }

            .navbar-right {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .nav-button {
                padding: 0.5rem 1rem;
                border: 1px solid #e2e8f0;
                background: white;
                border-radius: 0.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.875rem;
                color: #64748b;
                transition: all 150ms ease;
            }

            .nav-button:hover {
                background: #f8fafc;
                border-color: #cbd5e1;
                color: #1e293b;
            }

            .enterprise-selector {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 0.875rem;
                color: #1e293b;
                position: relative;
            }

            .enterprise-selector:hover {
                background: #f1f5f9;
                border-color: #cbd5e1;
            }

            .dropdown-arrow {
                font-size: 0.75rem;
                transition: transform 0.2s ease;
            }

            .enterprise-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                margin-top: 0.5rem;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.2s ease;
                min-width: 250px;
            }

            .enterprise-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .dropdown-item {
                padding: 0.75rem 1rem;
                cursor: pointer;
                transition: background-color 0.15s ease;
                font-size: 0.875rem;
            }

            .dropdown-item:hover {
                background: #f8fafc;
            }

            .dropdown-item.active {
                background: #e0f2fe;
                color: #0369a1;
            }

            .user-dropdown {
                position: relative;
            }

            .user-menu-btn {
                position: relative;
            }

            .user-menu-btn.active .dropdown-arrow {
                transform: rotate(180deg);
            }

            .user-dropdown-menu {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 0.5rem;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                min-width: 200px;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.2s ease;
            }

            .user-dropdown-menu.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .dropdown-divider {
                height: 1px;
                background: #e2e8f0;
                margin: 0.25rem 0;
            }

            .dropdown-item.logout:hover {
                background: #fef2f2;
                color: #dc2626;
            }

            @media (max-width: 768px) {
                .common-navbar {
                    padding: 0 1rem;
                    margin: -10px -10px 20px -10px;
                }

                .navbar-left {
                    gap: 0.75rem;
                }

                .navbar-title {
                    font-size: 1rem;
                }

                .enterprise-selector {
                    display: none;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    init(pageTitle) {
        this.insertStyles();
        
        // Find where to insert the navbar
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const navbar = this.create(pageTitle);
            mainContent.insertBefore(navbar, mainContent.firstChild);
        }

        // Setup event listeners
        document.addEventListener('click', (event) => {
            const selector = document.querySelector('.enterprise-selector');
            const dropdown = document.getElementById('enterpriseDropdown');
            const userBtn = document.querySelector('.user-menu-btn');
            const userMenu = document.getElementById('userDropdownMenu');
            
            if (selector && dropdown && !selector.contains(event.target)) {
                dropdown.classList.remove('show');
            }
            
            if (userBtn && userMenu && !userBtn.contains(event.target)) {
                userMenu.classList.remove('show');
                userBtn.classList.remove('active');
            }
        });
    }

    toggleEnterpriseDropdown() {
        const dropdown = document.getElementById('enterpriseDropdown');
        dropdown.classList.toggle('show');
    }

    selectEnterprise(name, id) {
        document.getElementById('selectedEnterprise').textContent = name;
        this.currentEnterpriseId = id;
        
        // Close dropdown
        document.getElementById('enterpriseDropdown').classList.remove('show');
        
        // Mark selected item
        document.querySelectorAll('.enterprise-dropdown .dropdown-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        this.showMessage(`已切换到：${name}`, 'success');
    }

    goHome() {
        // Determine the correct path based on current location
        const path = window.location.pathname;
        const isInSubdir = path.includes('/monitoring/') || path.includes('/analysis/') || 
                          path.includes('/alarm/') || path.includes('/device/') || 
                          path.includes('/report/') || path.includes('/system/') || 
                          path.includes('/user/');
        window.location.href = isInSubdir ? '../../index.html' : '../index.html';
    }

    toggleLanguage() {
        const langText = document.getElementById('lang-text');
        langText.textContent = langText.textContent === '中文' ? 'EN' : '中文';
    }

    toggleTheme() {
        const themeIcon = document.getElementById('theme-icon');
        const body = document.body;
        
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            themeIcon.textContent = '🌙';
        } else {
            body.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdownMenu');
        const button = document.querySelector('.user-menu-btn');
        
        if (dropdown && button) {
            dropdown.classList.toggle('show');
            button.classList.toggle('active');
        }
    }

    showAccountInfo() {
        this.toggleUserMenu();
        alert('账号信息功能开发中');
    }

    confirmLogout() {
        this.toggleUserMenu();
        
        if (confirm('您确定要退出系统吗？')) {
            alert('正在退出...');
            setTimeout(() => {
                // Determine the correct path
                const path = window.location.pathname;
                const isInSubdir = path.includes('/monitoring/') || path.includes('/analysis/') || 
                                  path.includes('/alarm/') || path.includes('/device/') || 
                                  path.includes('/report/') || path.includes('/system/') || 
                                  path.includes('/user/');
                window.location.href = isInSubdir ? '../../../index.html' : '../../index.html';
            }, 1000);
        }
    }

    showMessage(message, type) {
        if (typeof $ !== 'undefined') {
            const alertClass = type === 'success' ? 'alert-success' : 
                              type === 'error' ? 'alert-danger' : 'alert-info';
            
            const alertHtml = `
                <div class="alert ${alertClass} alert-dismissible fade show" role="alert" style="position: fixed; top: 80px; right: 20px; z-index: 9999;">
                    ${message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `;
            
            const alertElement = $(alertHtml);
            $('body').append(alertElement);
            
            setTimeout(() => {
                alertElement.alert('close');
            }, 3000);
        } else {
            alert(message);
        }
    }
}

// 创建全局实例
const commonNav = new CommonNav();

// 自动初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面标题（可以从页面的 h1 或 title 标签获取）
    const pageTitle = document.querySelector('.page-title')?.textContent || 
                     document.title.split(' - ')[0] || 
                     '工商储能管理系统';
    
    // 如果页面中有 .main-content 且没有导航栏，则自动插入
    if (document.querySelector('.main-content') && !document.querySelector('.common-navbar')) {
        commonNav.init(pageTitle);
    }
});