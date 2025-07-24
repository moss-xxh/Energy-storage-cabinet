#!/usr/bin/env python3
"""修复control.html的样式"""

import re

# 读取control.html
with open('control.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 修改body背景色
content = re.sub(
    r'body\s*\{([^}]*?)background:\s*#f3f4f6;',
    r'body {\1background: #EDEDED;',
    content,
    flags=re.DOTALL
)

# 2. 修改.page-content宽度
if '.page-content {' in content:
    content = re.sub(
        r'\.page-content\s*\{([^}]*?)\}',
        r'.page-content {\1    max-width: 1193px;\n    margin: 0 auto;\n}',
        content,
        flags=re.DOTALL
    )
else:
    # 如果没有.page-content样式，添加它
    style_end = content.find('</style>')
    if style_end != -1:
        new_style = '''
        .page-content {
            background: white;
            border-radius: 0.5rem;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            max-width: 1193px;
            margin: 0 auto;
        }'''
        content = content[:style_end] + new_style + '\n    ' + content[style_end:]

# 3. 修改工作模式标题区域的HTML结构，将信息移到卡片外
old_pattern = r'<!-- 工作模式选择 -->.*?</div>\s*</div>\s*</div>'
old_match = re.search(old_pattern, content, re.DOTALL)

if old_match:
    new_html = '''<!-- 工作模式选择 -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
                <h2 style="font-size: 1.25rem; font-weight: 600; color: #1e293b; margin: 0;" data-lang="control.workMode">设备工作模式</h2>
                
                <div style="display: flex; align-items: center; gap: 2rem;">
                    <!-- 储能柜选择器 -->
                    <div class="searchable-select" style="position: relative; min-width: 150px;">
                        <input type="text" 
                               id="cabinet-search-input" 
                               placeholder="搜索或选择储能柜" 
                               style="padding: 0.5rem 2rem 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; background: white; font-size: 0.875rem; width: 100%;"
                               autocomplete="off">
                        <svg class="dropdown-icon" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; pointer-events: none; color: #6b7280;" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        <div id="cabinet-dropdown" class="dropdown-list" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e2e8f0; border-radius: 0.375rem; margin-top: 0.25rem; max-height: 200px; overflow-y: auto; z-index: 100; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                            <div class="dropdown-item" data-value="cabinet1" data-demand="80" data-remaining="2000" style="padding: 0.5rem 0.75rem; cursor: pointer; font-size: 0.875rem;">储能柜1</div>
                            <div class="dropdown-item" data-value="cabinet2" data-demand="65" data-remaining="3500" style="padding: 0.5rem 0.75rem; cursor: pointer; font-size: 0.875rem;">储能柜2</div>
                            <div class="dropdown-item" data-value="cabinet3" data-demand="90" data-remaining="1000" style="padding: 0.5rem 0.75rem; cursor: pointer; font-size: 0.875rem;">储能柜3</div>
                            <div class="dropdown-item" data-value="cabinet4" data-demand="45" data-remaining="5500" style="padding: 0.5rem 0.75rem; cursor: pointer; font-size: 0.875rem;">储能柜4</div>
                        </div>
                    </div>
                    
                    <!-- 需量和剩余信息 -->
                    <div id="cabinet-info" style="display: flex; gap: 1.5rem; align-items: center; font-size: 0.875rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: #64748b;">需量:</span>
                            <span id="demand-display" style="font-weight: 600; color: #f59e0b;">80%</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: #64748b;">剩余:</span>
                            <span id="remaining-display" style="font-weight: 600; color: #3b82f6;">2000kW</span>
                        </div>
                    </div>
                    
                    <!-- VPP切换按钮 -->
                    <button onclick="enableVPPMode(!vppModeEnabled)" style="padding: 0.5rem 1rem; background: #f59e0b; color: white; border: none; border-radius: 6px; font-size: 0.875rem; cursor: pointer; font-weight: 500; transition: all 0.2s ease;">
                        切换VPP
                    </button>
                </div>
            </div>'''
    
    # 找到工作模式网格的起始位置
    grid_start = content.find('<div class="work-mode-grid"')
    if grid_start > 0:
        # 替换从标题到网格开始的部分
        section_start = content.find('<!-- 工作模式选择 -->')
        content = content[:section_start] + new_html + '\n            ' + content[grid_start:]

# 4. 修改main-content背景色
content = re.sub(
    r'\.main-content\s*\{([^}]*?)\}',
    lambda m: '.main-content {' + re.sub(r'background:\s*#[^;]+;', 'background: #EDEDED;', m.group(1)) + '}',
    content,
    flags=re.DOTALL
)

# 如果main-content没有背景色，添加它
if not re.search(r'\.main-content\s*\{[^}]*background:', content):
    content = re.sub(
        r'\.main-content\s*\{([^}]*?)\}',
        r'.main-content {\1    background: #EDEDED;\n}',
        content,
        flags=re.DOTALL
    )

# 保存文件
with open('control.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ control.html样式已更新")