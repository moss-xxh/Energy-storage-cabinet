#!/usr/bin/env python3
"""修复所有页面的logo路径和添加顶部导航栏"""

import os
import re
import glob

def fix_sidebar_js():
    """修复sidebar.js中的logo路径逻辑"""
    with open('sidebar.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 替换create方法中的logo路径逻辑
    # 查找create方法
    create_start = content.find('create() {')
    create_end = content.find('createMenuHTML() {')
    
    if create_start != -1 and create_end != -1:
        # 替换logo部分
        new_create = '''    // 创建侧边栏HTML
    create() {
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        
        // 根据当前路径确定logo路径
        const path = window.location.pathname;
        const isInSubdir = path.includes('/monitoring/') || path.includes('/analysis/') || 
                          path.includes('/alarm/') || path.includes('/device/') || 
                          path.includes('/report/') || path.includes('/system/') || 
                          path.includes('/user/');
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

    // '''
        
        # 找到create方法的结束位置
        method_end = content.find('\n    }\n', create_start)
        if method_end != -1:
            content = content[:create_start-4] + new_create + content[method_end+5:]
    
    # 保存修改后的sidebar.js
    with open('sidebar.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✓ 修复了sidebar.js中的logo路径逻辑")

def add_navbar_to_page(filepath):
    """为页面添加顶部导航栏"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已有导航栏
    if 'class="navbar"' in content:
        return False
    
    # 获取页面标题
    title_match = re.search(r'<title>(.*?)-', content)
    page_title = title_match.group(1).strip() if title_match else '页面'
    
    # 添加导航栏样式
    navbar_styles = '''
        /* 顶部导航栏 */
        .navbar {
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
        }

        .navbar-left {
            display: flex;
            align-items: center;
            gap: 2rem;
        }

        .page-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1e293b;
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
        }'''
    
    # 在</style>前添加导航栏样式
    style_end = content.rfind('</style>')
    if style_end != -1 and '.navbar {' not in content:
        content = content[:style_end] + navbar_styles + '\n    ' + content[style_end:]
    
    # 添加导航栏HTML
    navbar_html = f'''        <!-- 顶部导航栏 -->
        <nav class="navbar">
            <div class="navbar-left">
                <button class="nav-button" onclick="toggleSidebar()">
                    <span>☰</span>
                </button>
                <button class="nav-button" onclick="goBack()" title="返回场景选择">
                    <span>←</span>
                </button>
                <h1 class="page-title">{page_title}</h1>
            </div>
            <div class="navbar-right">
                <button class="nav-button" onclick="toggleLanguage()">
                    <span>🌐</span>
                    <span id="lang-text">中文</span>
                </button>
                <button class="nav-button" onclick="toggleTheme()">
                    <span id="theme-icon">🌙</span>
                </button>
                <button class="nav-button">
                    <span>👤</span>
                    <span>管理员</span>
                </button>
            </div>
        </nav>
'''
    
    # 在main-content内部添加导航栏
    main_content_match = re.search(r'<div class="main-content">\s*', content)
    if main_content_match:
        insert_pos = main_content_match.end()
        # 检查下一行是否已经是导航栏
        next_content = content[insert_pos:insert_pos+100]
        if '<nav' not in next_content:
            content = content[:insert_pos] + navbar_html + '\n' + content[insert_pos:]
    
    # 确保内容区域有正确的内边距
    if '.content {' not in content:
        content_styles = '''
        /* 内容区域 */
        .content {
            padding: 24px;
        }'''
        style_end = content.rfind('</style>')
        if style_end != -1:
            content = content[:style_end] + content_styles + '\n    ' + content[style_end:]
    
    # 保存文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    """主函数"""
    print("开始修复所有页面...\n")
    
    # 1. 修复sidebar.js
    fix_sidebar_js()
    
    # 2. 获取所有需要修复的HTML文件
    html_files = []
    
    # 根目录的HTML文件
    for file in glob.glob("*.html"):
        if file not in ['demo-with-sidebar.html', 'test-sidebar.html', 'control.html', 'price-settings.html']:
            html_files.append(file)
    
    # 子目录的HTML文件
    subdirs = ['monitoring', 'analysis', 'alarm', 'device', 'report', 'system', 'user']
    for subdir in subdirs:
        if os.path.exists(subdir):
            for file in glob.glob(f"{subdir}/*.html"):
                html_files.append(file)
    
    # 3. 为每个页面添加导航栏
    fixed_count = 0
    for file in sorted(html_files):
        if add_navbar_to_page(file):
            print(f"✓ 已添加导航栏: {file}")
            fixed_count += 1
        else:
            print(f"- 已有导航栏: {file}")
    
    print(f"\n修复完成！")
    print(f"- 处理文件数: {len(html_files)}")
    print(f"- 添加导航栏: {fixed_count}")

if __name__ == "__main__":
    main()