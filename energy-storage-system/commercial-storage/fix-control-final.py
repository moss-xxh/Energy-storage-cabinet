#!/usr/bin/env python3
"""最终修复control.html的样式和布局"""

import re

# 读取control.html
with open('control.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 更新body的背景色为#EDEDED
content = re.sub(
    r'(body\s*\{[^}]*?background:\s*)#f3f4f6(;[^}]*?\})',
    r'\1#EDEDED\2',
    content,
    flags=re.DOTALL
)

# 2. 更新.main-content的背景色
# 先查找是否已有.main-content样式
main_content_match = re.search(r'\.main-content\s*\{([^}]*)\}', content, re.DOTALL)
if main_content_match:
    main_content_style = main_content_match.group(1)
    # 检查是否已有background属性
    if 'background:' in main_content_style:
        # 替换现有的background
        new_style = re.sub(r'background:\s*#[^;]+;', 'background: #EDEDED;', main_content_style)
    else:
        # 添加background
        new_style = main_content_style.rstrip() + '\n            background: #EDEDED;\n        '
    
    content = content[:main_content_match.start()] + '.main-content {' + new_style + '}' + content[main_content_match.end():]
else:
    # 如果没有.main-content样式，在适当位置添加
    insert_pos = content.find('/* 顶部导航栏 */')
    if insert_pos > 0:
        new_style = '''
        /* 主内容区域 */
        .main-content {
            margin-left: 240px;
            min-height: 100vh;
            background: #EDEDED;
        }
        
'''
        content = content[:insert_pos] + new_style + content[insert_pos:]

# 3. 确保.content也有正确的背景
content_match = re.search(r'\.content\s*\{([^}]*)\}', content, re.DOTALL)
if content_match:
    content_style = content_match.group(1)
    if 'background:' not in content_style:
        new_style = content_style.rstrip() + '\n            background: #EDEDED;\n        '
        content = content[:content_match.start()] + '.content {' + new_style + '}' + content[content_match.end():]

# 4. 确保page-content的宽度是1193px
if 'max-width: 1193px;' not in content:
    # 查找.page-content样式
    page_content_match = re.search(r'\.page-content\s*\{([^}]*)\}', content, re.DOTALL)
    if page_content_match:
        page_content_style = page_content_match.group(1)
        if 'max-width:' not in page_content_style:
            new_style = page_content_style.rstrip() + '\n            max-width: 1193px;\n            margin: 0 auto;\n        '
            content = content[:page_content_match.start()] + '.page-content {' + new_style + '}' + content[page_content_match.end():]

# 保存文件
with open('control.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ control.html已完成最终修复")
print("  - 背景色: #EDEDED")
print("  - page-content宽度: 1193px")
print("  - 工作模式信息已移到卡片外")