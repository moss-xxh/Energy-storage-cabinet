#!/usr/bin/env python3
"""修复price-settings.html的内容宽度为1193px"""

import re

# 读取price-settings.html
with open('price-settings.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 检查是否有隐藏的宽度限制
# 查找所有可能限制宽度的样式
potential_styles = ['.content', '.price-content', '.price-tabs', '.main-content']

# 2. 在.content样式中添加max-width
content_match = re.search(r'\.content\s*\{([^}]*)\}', content, re.DOTALL)
if content_match:
    content_style = content_match.group(1)
    # 检查是否已有max-width
    if 'max-width' not in content_style:
        # 添加max-width
        new_style = content_style.rstrip() + '\n            max-width: 1193px;\n            margin: 0 auto;\n        '
        content = content[:content_match.start()] + '.content {' + new_style + '}' + content[content_match.end():]
    else:
        # 更新现有的max-width
        content = re.sub(
            r'(\.content\s*\{[^}]*?max-width:\s*)\d+px',
            r'\g<1>1193px',
            content,
            flags=re.DOTALL
        )

# 3. 检查.price-content是否有宽度限制
price_content_match = re.search(r'\.price-content\s*\{([^}]*)\}', content, re.DOTALL)
if price_content_match:
    price_content_style = price_content_match.group(1)
    # 如果有max-width，确保不会限制宽度
    if 'max-width' in price_content_style and '1123' in price_content_style:
        content = re.sub(
            r'(\.price-content\s*\{[^}]*?max-width:\s*)\d+px',
            r'\g<1>100%',
            content,
            flags=re.DOTALL
        )

# 4. 添加一个wrapper来确保正确的宽度
# 查找是否有content-wrapper
if 'content-wrapper' not in content:
    # 在<!-- 内容区域 -->后添加wrapper
    insert_pos = content.find('<!-- 内容区域 -->')
    if insert_pos > 0:
        # 找到<div class="content">的位置
        content_div_pos = content.find('<div class="content">', insert_pos)
        if content_div_pos > 0:
            # 在content div内添加wrapper
            end_of_content_tag = content.find('>', content_div_pos) + 1
            wrapper_html = '\n            <div class="content-wrapper" style="max-width: 1193px; margin: 0 auto;">'
            
            # 找到对应的结束</div>
            # 在</main>之前找到最后一个</div>
            main_end = content.find('</main>')
            last_div_before_main = content.rfind('</div>', 0, main_end)
            
            # 插入wrapper
            content = (content[:end_of_content_tag] + wrapper_html + 
                      content[end_of_content_tag:last_div_before_main] + 
                      '\n            </div>' + content[last_div_before_main:])

# 保存文件
with open('price-settings.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ price-settings.html内容宽度已设置为1193px")