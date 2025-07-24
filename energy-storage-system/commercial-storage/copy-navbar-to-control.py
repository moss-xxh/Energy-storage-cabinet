#!/usr/bin/env python3
"""从price-settings.html复制顶部导航栏到control.html"""

import re

# 读取control.html
with open('control.html', 'r', encoding='utf-8') as f:
    control_content = f.read()

# 要添加的导航栏样式
navbar_styles = '''
        /* 主内容区域 */
        .main-content {
            margin-left: 240px;
            min-height: 100vh;
            background: #EBEDF5;
        }

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
        }

        /* 内容区域 */
        .content {
            flex: 1;
            padding: 2rem;
        }
        
        /* 页面内容 */
        .page-content {
            background: white;
            border-radius: 0.5rem;
            padding: 2rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
            .main-content {
                margin-left: 0;
            }
        }'''

# 导航栏HTML结构
navbar_html = '''        <!-- 顶部导航栏 -->
        <nav class="navbar">
            <div class="navbar-left">
                <button class="nav-button" onclick="toggleSidebar()">
                    <span>☰</span>
                </button>
                <button class="nav-button" onclick="goBack()" title="返回场景选择">
                    <span>←</span>
                </button>
                <h1 class="page-title">电站控制</h1>
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
        </nav>'''

# 1. 先更新样式部分
style_end = control_content.find('</style>')
if style_end != -1:
    # 查找是否已有.main-content样式
    if '.main-content {' not in control_content[:style_end]:
        # 在</style>前插入导航栏样式
        control_content = control_content[:style_end] + navbar_styles + '\n    ' + control_content[style_end:]

# 2. 更新body结构
# 查找当前的navbar
navbar_match = re.search(r'<nav class="navbar">.*?</nav>', control_content, re.DOTALL)
if navbar_match:
    # 替换现有的navbar
    control_content = control_content[:navbar_match.start()] + navbar_html + control_content[navbar_match.end():]
else:
    # 在main-content内部开始处添加navbar
    main_content_match = re.search(r'<div class="main-content">\s*', control_content)
    if main_content_match:
        insert_pos = main_content_match.end()
        control_content = control_content[:insert_pos] + navbar_html + '\n' + control_content[insert_pos:]

# 3. 确保页面内容被正确包裹
# 查找页面内容的开始位置（工作模式选择）
page_content_start = control_content.find('<!-- 工作模式选择 -->')
if page_content_start == -1:
    page_content_start = control_content.find('<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">')

if page_content_start > 0:
    # 检查是否已有content包裹
    content_check = control_content[page_content_start-200:page_content_start]
    if '<div class="content">' not in content_check:
        # 在页面内容前添加content div
        control_content = control_content[:page_content_start] + '\n        <!-- 内容区域 -->\n        <div class="content">\n            <div class="page-content">\n            ' + control_content[page_content_start:]
        
        # 找到main-content的结束位置，在其前添加结束标签
        main_content_end = control_content.rfind('</div>', 0, control_content.find('<!-- 引入侧边栏脚本 -->'))
        if main_content_end > 0:
            control_content = control_content[:main_content_end] + '\n            </div>\n        </div>\n    ' + control_content[main_content_end:]

# 保存文件
with open('control.html', 'w', encoding='utf-8') as f:
    f.write(control_content)

print("✓ 已从price-settings.html复制顶部导航栏到control.html")