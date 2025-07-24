#!/usr/bin/env python3
"""更新control.html的背景色为#EBEDF4"""

import re

# 读取control.html
with open('control.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 更新body的背景色
content = re.sub(
    r'(body\s*\{[^}]*?background:\s*)#EDEDED(;[^}]*?\})',
    r'\1#EBEDF4\2',
    content,
    flags=re.DOTALL
)

# 2. 更新.main-content的背景色
content = re.sub(
    r'(\.main-content\s*\{[^}]*?background:\s*)#EDEDED(;[^}]*?\})',
    r'\1#EBEDF4\2',
    content,
    flags=re.DOTALL
)

# 3. 更新.content的背景色（如果有的话）
content = re.sub(
    r'(\.content\s*\{[^}]*?background:\s*)#EDEDED(;[^}]*?\})',
    r'\1#EBEDF4\2',
    content,
    flags=re.DOTALL
)

# 保存文件
with open('control.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 背景色已更新为 #EBEDF4")