// 侧边栏组件
class Sidebar {
    constructor() {
        this.menuData = [
            {
                id: 'overview',
                name: '首页',
                icon: '🏠',
                href: './index.html'
            },
            {
                id: 'station',
                name: '电站',
                icon: '⚡',
                children: [
                    { name: '电站详情', href: './station-detail-3d.html' },
                    { name: '电站管理', href: './station-management.html' },
                    { name: '电价模板', href: './price-settings.html' }
                ]
            },
            {
                id: 'device',
                name: '设备管理',
                icon: '⚙️',
                children: [
                    { name: '设备控制', href: './control.html' },
                    { name: '设备列表', href: './monitoring/device-list.html' },
                    { name: '设备1', href: './device/device1.html' },
                    { name: '设备群控', href: './group-control.html' }
                ]
            },
            {
                id: 'analysis',
                name: '数据分析',
                icon: '📊',
                children: [
                    { name: '能耗分析', href: './analysis/energy.html' },
                    { name: '效率分析', href: './analysis/efficiency.html' },
                    { name: '经济性分析', href: './analysis/economic.html' }
                ]
            },
            {
                id: 'history',
                name: '历史数据',
                icon: '📈',
                children: [
                    { name: '储能系统', href: './history/storage-history.html' },
                    { name: 'PCS数据', href: './history/pcs-history.html' },
                    { name: '电池组数据', href: './history/battery-history.html' },
                    { name: '光伏数据', href: './history/pv-history.html' },
                    { name: '负载数据', href: './history/load-history.html' }
                ]
            },
            {
                id: 'alarm',
                name: '告警管理',
                icon: '🔔',
                children: [
                    { name: '告警规则', href: './alarm/rules.html' },
                    { name: '告警列表', href: './alarm/list.html' },
                    { name: '告警分析', href: './alarm/analysis.html' }
                ]
            },
            {
                id: 'report',
                name: '报表中心',
                icon: '📋',
                children: [
                    { name: '电站报告', href: './report/station-report.html' },
                    { name: '逆变器报表', href: './report/inverter-report.html' },
                    { name: '储能报表', href: './report/storage-report.html' },
                    { name: '发电量报表', href: './report/power-generation.html' },
                    { name: '收益报表', href: './report/revenue-report.html' },
                    { name: '自定义报表', href: './report/custom-report.html' },
                    { name: '报表列表', href: './report/list.html' }
                ]
            },
            {
                id: 'system',
                name: '系统设置',
                icon: '🔧',
                children: [
                    { name: '企业管理', href: './system/enterprise.html' },
                    { name: '电价模板', href: './system/electricity-price-template.html' },
                    { name: '菜单管理', href: './system/menus.html' },
                    { name: '用户管理', href: './system/users.html' },
                    { name: '角色管理', href: './system/roles.html' },
                    { name: '系统设置', href: './system/settings.html' },
                    { name: '日志管理', href: './system/logs.html' }
                ]
            }
        ];
        
        this.expandedMenus = this.loadExpandedState();
    }

    // 创建侧边栏HTML
    // 创建侧边栏HTML
    create() {
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        
        // 根据当前路径确定logo路径
        const path = window.location.pathname;
        const isInSubdir = path.includes('/monitoring/') || path.includes('/analysis/') || 
                          path.includes('/alarm/') || path.includes('/device/') || 
                          path.includes('/report/') || path.includes('/system/') || 
                          path.includes('/user/') || path.includes('/history/');
        const logoPath = isInSubdir ? '../../logo.png' : '../logo.png';
        
        sidebar.innerHTML = `
            <div class="sidebar-logo">
                <img src="${logoPath}" alt="储能管理系统">
            </div>
            <nav class="sidebar-menu">
                ${this.createMenuHTML()}
            </nav>
        `;
        return sidebar;
    }

    // }

        // 创建菜单HTML
    createMenuHTML() {
        // 获取当前路径前缀
        const pathPrefix = this.getPathPrefix();
        
        return this.menuData.map(menu => {
            // 如果是一级菜单（有href属性）
            if (menu.href) {
                let href = menu.href;
                if (href.startsWith('./')) {
                    href = pathPrefix + href.substring(2);
                }
                return `
                    <div class="menu-group">
                        <a href="${href}" class="menu-item menu-link ${this.isCurrentPage(menu.href) ? 'active' : ''}" data-menu-id="${menu.id}">
                            <div class="menu-item-content">
                                <span class="menu-icon">${menu.icon}</span>
                                <span>${menu.name}</span>
                            </div>
                        </a>
                    </div>
                `;
            }
            
            // 如果是有子菜单的菜单
            const isExpanded = this.expandedMenus.includes(menu.id);
            return `
                <div class="menu-group">
                    <div class="menu-item ${isExpanded ? 'expanded' : ''}" data-menu-id="${menu.id}">
                        <div class="menu-item-content">
                            <span class="menu-icon">${menu.icon}</span>
                            <span>${menu.name}</span>
                        </div>
                        <span class="menu-arrow">▶</span>
                    </div>
                    <div class="submenu ${isExpanded ? 'open' : ''}">
                        ${menu.children.map(child => {
                            // 动态调整路径
                            let href = child.href;
                            if (href.startsWith('./')) {
                                // 根目录的文件
                                if (!href.includes('/')) {
                                    href = pathPrefix + href.substring(2);
                                } else {
                                    // 子目录的文件
                                    href = pathPrefix + href.substring(2);
                                }
                            }
                            return `
                                <a href="${href}" class="submenu-item ${this.isCurrentPage(child.href) ? 'active' : ''}">
                                    ${child.name}
                                </a>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // 获取路径前缀
    getPathPrefix() {
        const path = window.location.pathname;
        const isInSubdir = path.includes('/monitoring/') || path.includes('/analysis/') || 
                          path.includes('/alarm/') || path.includes('/device/') || 
                          path.includes('/report/') || path.includes('/system/') || 
                          path.includes('/user/') || path.includes('/history/');
        return isInSubdir ? '../' : './';
    }

    
    // 初始化事件
    init() {
        // 插入侧边栏
        const sidebarContainer = document.getElementById('sidebar-container');
        if (sidebarContainer) {
            sidebarContainer.appendChild(this.create());
        } else {
            document.body.insertBefore(this.create(), document.body.firstChild);
        }

        // 绑定菜单点击事件
        document.querySelectorAll('.menu-item:not(.menu-link)').forEach(item => {
            item.addEventListener('click', (e) => this.toggleMenu(e));
        });

        // 设置当前页面的激活状态
        this.setActiveMenu();
    }

    // 切换菜单
    toggleMenu(e) {
        const menuItem = e.currentTarget;
        const menuId = menuItem.dataset.menuId;
        const submenu = menuItem.nextElementSibling;
        
        menuItem.classList.toggle('expanded');
        submenu.classList.toggle('open');
        
        // 保存展开状态
        if (menuItem.classList.contains('expanded')) {
            if (!this.expandedMenus.includes(menuId)) {
                this.expandedMenus.push(menuId);
            }
        } else {
            this.expandedMenus = this.expandedMenus.filter(id => id !== menuId);
        }
        
        this.saveExpandedState();
    }

    // 设置当前页面的激活菜单
    setActiveMenu() {
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop();
        
        // 查找并激活对应的菜单项
        this.menuData.forEach(menu => {
            // 如果是一级菜单
            if (menu.href && menu.href.includes(currentFile)) {
                const menuItem = document.querySelector(`[data-menu-id="${menu.id}"]`);
                if (menuItem) {
                    menuItem.classList.add('active');
                }
            }
            // 如果有子菜单
            else if (menu.children) {
                menu.children.forEach(child => {
                    if (child.href.includes(currentFile)) {
                        // 展开父菜单
                        const menuItem = document.querySelector(`[data-menu-id="${menu.id}"]`);
                        const submenu = menuItem.nextElementSibling;
                        menuItem.classList.add('expanded');
                        submenu.classList.add('open');
                        
                        if (!this.expandedMenus.includes(menu.id)) {
                            this.expandedMenus.push(menu.id);
                            this.saveExpandedState();
                        }
                    }
                });
            }
        });
    }

    // 判断是否为当前页面
    isCurrentPage(href) {
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop();
        return href.includes(currentFile);
    }

    // 保存展开状态
    saveExpandedState() {
        localStorage.setItem('sidebarExpanded', JSON.stringify(this.expandedMenus));
    }

    // 加载展开状态
    loadExpandedState() {
        const saved = localStorage.getItem('sidebarExpanded');
        return saved ? JSON.parse(saved) : [];
    }

    // 切换侧边栏显示/隐藏（移动端）
    toggle() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
    }
}

// 初始化侧边栏
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = new Sidebar();
    sidebar.init();
    
    // 将侧边栏实例暴露到全局，以便其他地方调用
    window.sidebar = sidebar;
});