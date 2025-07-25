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
                    { 
                        name: '设备列表', 
                        href: './monitoring/device-list.html',
                        children: [
                            { name: '设备1', href: './device/device1.html' }
                        ]
                    },
                    { name: '设备群控', href: './group-control.html' }
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
                    { name: '告警分析', href: './alarm/analysis.html' },
                    { name: '告警列表', href: './alarm/list.html' },
                    { name: '告警规则', href: './alarm/rules.html' }
                ]
            },
            {
                id: 'report',
                name: '报表中心',
                icon: '📋',
                children: [
                    { name: '电站报表', href: './report/station-report.html' },
                    { name: '收益报表', href: './report/revenue-report.html' },
                    { name: '自定义报表', href: './report/custom-report.html' }
                ]
            },
            {
                id: 'system',
                name: '系统设置',
                icon: '🔧',
                children: [
                    { name: '企业管理', href: './system/enterprise.html' },
                    { name: '菜单管理', href: './system/menus.html' },
                    { name: '用户管理', href: './system/users.html' },
                    { name: '角色管理', href: './system/roles.html' },
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
                            // 如果子菜单还有子菜单（3级菜单）
                            if (child.children) {
                                const childId = `${menu.id}-${child.name.replace(/\s+/g, '')}`;
                                const isChildExpanded = this.expandedMenus.includes(childId);
                                let href = child.href;
                                if (href.startsWith('./')) {
                                    href = pathPrefix + href.substring(2);
                                }
                                return `
                                    <div class="submenu-item-with-children">
                                        <a href="${href}" class="submenu-item ${this.isCurrentPage(child.href) ? 'active' : ''}" data-menu-id="${childId}">
                                            ${child.name}
                                            <span class="submenu-arrow ${isChildExpanded ? 'expanded' : ''}" onclick="event.preventDefault(); this.closest('.sidebar').dispatchEvent(new CustomEvent('toggleSubmenu', {detail: '${childId}'}))">▶</span>
                                        </a>
                                        <div class="sub-submenu ${isChildExpanded ? 'open' : ''}">
                                            ${child.children.map(grandchild => {
                                                let grandchildHref = grandchild.href;
                                                if (grandchildHref.startsWith('./')) {
                                                    grandchildHref = pathPrefix + grandchildHref.substring(2);
                                                }
                                                return `
                                                    <a href="${grandchildHref}" class="sub-submenu-item ${this.isCurrentPage(grandchild.href) ? 'active' : ''}">
                                                        ${grandchild.name}
                                                    </a>
                                                `;
                                            }).join('')}
                                        </div>
                                    </div>
                                `;
                            } else {
                                // 普通的2级菜单项
                                let href = child.href;
                                if (href.startsWith('./')) {
                                    href = pathPrefix + href.substring(2);
                                }
                                return `
                                    <a href="${href}" class="submenu-item ${this.isCurrentPage(child.href) ? 'active' : ''}">
                                        ${child.name}
                                    </a>
                                `;
                            }
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

        // 插入遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', () => this.toggle());
        document.body.appendChild(overlay);

        // 绑定菜单点击事件
        document.querySelectorAll('.menu-item:not(.menu-link)').forEach(item => {
            item.addEventListener('click', (e) => this.toggleMenu(e));
        });

        // 绑定3级菜单切换事件
        document.querySelector('.sidebar').addEventListener('toggleSubmenu', (e) => {
            this.toggleSubmenu(e.detail);
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

    // 切换3级子菜单
    toggleSubmenu(menuId) {
        const submenuItem = document.querySelector(`[data-menu-id="${menuId}"]`);
        const arrow = submenuItem.querySelector('.submenu-arrow');
        const subSubmenu = submenuItem.parentElement.querySelector('.sub-submenu');
        
        arrow.classList.toggle('expanded');
        subSubmenu.classList.toggle('open');
        
        // 保存展开状态
        if (subSubmenu.classList.contains('open')) {
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
                    if (child.href && child.href.includes(currentFile)) {
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
                    
                    // 如果子菜单还有子菜单（3级菜单）
                    if (child.children) {
                        child.children.forEach(grandchild => {
                            if (grandchild.href && grandchild.href.includes(currentFile)) {
                                // 展开父菜单
                                const menuItem = document.querySelector(`[data-menu-id="${menu.id}"]`);
                                const submenu = menuItem.nextElementSibling;
                                menuItem.classList.add('expanded');
                                submenu.classList.add('open');
                                
                                // 展开子菜单
                                const childId = `${menu.id}-${child.name.replace(/\s+/g, '')}`;
                                const childMenuItem = document.querySelector(`[data-menu-id="${childId}"]`);
                                const childArrow = childMenuItem.querySelector('.submenu-arrow');
                                const subSubmenu = childMenuItem.parentElement.querySelector('.sub-submenu');
                                
                                childArrow.classList.add('expanded');
                                subSubmenu.classList.add('open');
                                
                                if (!this.expandedMenus.includes(menu.id)) {
                                    this.expandedMenus.push(menu.id);
                                }
                                if (!this.expandedMenus.includes(childId)) {
                                    this.expandedMenus.push(childId);
                                }
                                this.saveExpandedState();
                            }
                        });
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
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }
}

// 初始化侧边栏
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = new Sidebar();
    sidebar.init();
    
    // 将侧边栏实例暴露到全局，以便其他地方调用
    window.sidebar = sidebar;
});