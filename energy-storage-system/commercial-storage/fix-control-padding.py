#!/usr/bin/env python3
"""修复control.html内容区域的内边距"""

import re

# 读取control.html
with open('control.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 查找并更新.content样式
content_style_pattern = r'\.content\s*\{[^}]*\}'
content_style_match = re.search(content_style_pattern, content, re.DOTALL)

if content_style_match:
    # 替换为新的content样式
    new_content_style = '''        .content {
            flex: 1;
            padding: 24px;
        }'''
    content = content[:content_style_match.start()] + new_content_style + content[content_style_match.end():]
else:
    # 如果找不到，在.navbar样式后添加
    navbar_end = content.find('.nav-button:hover {')
    if navbar_end != -1:
        insert_pos = content.find('}', navbar_end) + 1
        new_styles = '''

        /* 内容区域 */
        .content {
            flex: 1;
            padding: 24px;
        }'''
        content = content[:insert_pos] + new_styles + content[insert_pos:]

# 查找并更新.page-content样式
page_content_pattern = r'\.page-content\s*\{[^}]*\}'
page_content_match = re.search(page_content_pattern, content, re.DOTALL)

if page_content_match:
    # 替换为新的page-content样式
    new_page_content_style = '''        .page-content {
            background: white;
            border-radius: 0.5rem;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }'''
    content = content[:page_content_match.start()] + new_page_content_style + content[page_content_match.end():]
else:
    # 如果找不到，在.content样式后添加
    content_end = content.find('.content {')
    if content_end != -1:
        insert_pos = content.find('}', content_end) + 1
        new_styles = '''
        
        /* 页面内容 */
        .page-content {
            background: white;
            border-radius: 0.5rem;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }'''
        content = content[:insert_pos] + new_styles + content[insert_pos:]

# 确保工作模式网格有适当的间距
work_mode_grid_pattern = r'\.work-mode-grid\s*\{[^}]*\}'
if '.work-mode-grid' not in content:
    # 添加工作模式网格样式
    style_end = content.find('</style>')
    if style_end != -1:
        new_styles = '''
        /* 工作模式网格 */
        .work-mode-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .mode-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            padding: 1.5rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }

        .mode-card:hover {
            border-color: #3b82f6;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .mode-card.active {
            border-color: #3b82f6;
            background: #eff6ff;
        }

        .mode-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .mode-title {
            font-size: 1rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.25rem;
        }

        .mode-desc {
            font-size: 0.875rem;
            color: #64748b;
        }

        .mode-check {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            width: 1.5rem;
            height: 1.5rem;
            background: #3b82f6;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .mode-card.active .mode-check {
            opacity: 1;
        }'''
        content = content[:style_end] + new_styles + '\n    ' + content[style_end:]

# 保存文件
with open('control.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ control.html内容区域内边距已修复（上下左右24px）")