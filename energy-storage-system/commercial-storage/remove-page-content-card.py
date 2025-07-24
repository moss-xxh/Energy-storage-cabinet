#!/usr/bin/env python3
"""移除control.html中page-content的卡片样式"""

import re

# 读取control.html
with open('control.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 移除或修改.page-content样式
page_content_match = re.search(r'\.page-content\s*\{([^}]*)\}', content, re.DOTALL)
if page_content_match:
    # 新的样式：只保留宽度和边距，移除背景、阴影、圆角等卡片样式
    new_style = '''        .page-content {
            max-width: 1193px;
            margin: 0 auto;
        }'''
    content = content[:page_content_match.start()] + new_style + content[page_content_match.end():]

# 2. 确保工作模式卡片等子元素有自己的背景（因为父容器不再是白色）
# 工作模式卡片已经有白色背景，不需要修改

# 3. 给控制面板等其他白色区域确保有背景
# 查找监控卡片等区域，确保它们有白色背景
if '.monitor-card {' in content:
    # monitor-card已经有背景设置
    pass
else:
    # 如果需要，可以添加其他区域的样式
    pass

# 保存文件
with open('control.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 已移除page-content的卡片样式")
print("  - 保留了1193px宽度限制")
print("  - 移除了白色背景、阴影、圆角等卡片效果")