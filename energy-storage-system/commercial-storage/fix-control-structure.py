#!/usr/bin/env python3
"""修复control.html的结构问题"""

import re

# 读取文件
with open('control.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到body标签的位置
body_start = content.find('<body>')
if body_start == -1:
    print("找不到body标签")
    exit(1)

# 找到</body>的位置
body_end = content.find('</body>')
if body_end == -1:
    print("找不到</body>标签")
    exit(1)

# 提取body内容
body_content = content[body_start+6:body_end]

# 查找主要内容（从navbar开始）
navbar_start = body_content.find('<nav class="navbar">')
if navbar_start == -1:
    print("找不到navbar")
    exit(1)

# 提取主要内容
main_content = body_content[navbar_start:]

# 查找sidebar.js的引用
sidebar_js_match = re.search(r'<script src="[^"]*sidebar\.js"[^>]*></script>', content)

# 重构body内容
new_body = f'''<body>
    <!-- 侧边栏容器 -->
    <div id="sidebar-container"></div>
    
    <!-- 主内容区 -->
    <div class="main-content">
        {main_content.strip()}
    </div>

    <!-- 引入侧边栏脚本 -->
    <script src="./sidebar.js"></script>
</body>'''

# 替换body部分
new_content = content[:body_start] + new_body + content[body_end+7:]

# 添加必要的导航栏样式（如果缺少）
if '.navbar {' not in new_content:
    navbar_styles = '''
        /* 顶部导航栏 */
        .navbar {
            background: white;
            border-bottom: 1px solid #e2e8f0;
            padding: 0 1.5rem;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .navbar-left {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .navbar-right {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .nav-button {
            padding: 0.5rem 1rem;
            border: 1px solid #e2e8f0;
            background: white;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 0.875rem;
            color: #374151;
            transition: all 0.2s ease;
        }

        .nav-button:hover {
            background: #f9fafb;
            border-color: #d1d5db;
        }
        
        /* 主内容区域调整 */
        .main-content {
            margin-left: 260px;
            min-height: 100vh;
            background: #f3f4f6;
        }
        
        @media (max-width: 768px) {
            .main-content {
                margin-left: 0;
            }
        }'''
    
    # 在</style>前插入导航栏样式
    style_end = new_content.rfind('</style>')
    if style_end != -1:
        new_content = new_content[:style_end] + navbar_styles + '\n    ' + new_content[style_end:]

# 保存文件
with open('control.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✓ control.html结构已修复")