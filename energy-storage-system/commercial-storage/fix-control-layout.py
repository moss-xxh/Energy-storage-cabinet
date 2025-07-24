#!/usr/bin/env python3
"""修复control.html的布局问题"""

import re

# 读取control.html
with open('control.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 移除脚本添加的重复基础样式，保留原有的样式
# 查找并移除第一个样式块（脚本添加的）
content = re.sub(
    r'<style>\s*\*\s*\{[^}]+\}[^<]+?\.page-header h1[^}]+\}[^<]+?</style>\s*<style>',
    '<style>',
    content,
    flags=re.DOTALL
)

# 确保main-content包裹正确
# 先检查是否有错误的包裹
if content.count('<div class="main-content">') > 1:
    # 移除多余的main-content包裹
    content = re.sub(
        r'<div class="main-content">\s*<div class="main-content">',
        '<div class="main-content">',
        content,
        flags=re.DOTALL
    )
    # 移除多余的结束标签
    content = re.sub(
        r'</div>\s*</div>\s*</div>\s*</body>',
        '</div>\n    </div>\n\n    <!-- 引入侧边栏脚本 -->\n    <script src="./sidebar.js"></script>\n</body>',
        content,
        flags=re.DOTALL
    )

# 确保页面结构正确
# 查找主要内容区域的开始
main_content_start = content.find('<div class="container">')
if main_content_start == -1:
    main_content_start = content.find('<div class="content-wrapper">')
if main_content_start == -1:
    main_content_start = content.find('<!-- 页面标题')

# 如果找到了内容区域，确保它被正确包裹
if main_content_start > 0 and '<div class="main-content">' not in content[main_content_start-100:main_content_start]:
    # 在内容前插入main-content div
    content = content[:main_content_start] + '\n    <div class="main-content">\n        ' + content[main_content_start:]
    # 在</body>前关闭main-content
    content = re.sub(
        r'(\s*)(<!-- 引入侧边栏脚本 -->)',
        r'    </div>\n\n\1\2',
        content
    )

# 写回文件
with open('control.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ control.html布局已修复")