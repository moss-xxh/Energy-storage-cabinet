#!/usr/bin/env python3
"""修复sidebar.js中的路径问题"""

# 读取sidebar.js
with open('sidebar.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 新的createMenuHTML方法，动态处理路径
new_create_menu_html = '''    // 创建菜单HTML
    createMenuHTML() {
        // 获取当前路径前缀
        const pathPrefix = this.getPathPrefix();
        
        return this.menuData.map(menu => {
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
                          path.includes('/user/');
        return isInSubdir ? '../' : './';
    }'''

# 替换createMenuHTML方法
import re

# 找到createMenuHTML方法的开始和结束
method_start = content.find('// 创建菜单HTML')
if method_start == -1:
    method_start = content.find('createMenuHTML()')

if method_start != -1:
    # 找到该方法的结束位置（下一个方法的开始）
    next_method = content.find('\n    // ', method_start + 10)
    if next_method == -1:
        next_method = content.find('\n    init()', method_start)
    
    if next_method != -1:
        # 替换整个方法
        content = content[:method_start] + new_create_menu_html + '\n\n    ' + content[next_method:]

# 保存修改后的文件
with open('sidebar.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ sidebar.js路径问题已修复")