#!/usr/bin/env python3
"""恢复control.html的原始样式和布局"""

# 读取文件
with open('control.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到样式部分
style_start = content.find('<style>')
style_end = content.find('</style>')

if style_start != -1 and style_end != -1:
    # 提取现有样式
    existing_styles = content[style_start:style_end+8]
    
    # 移除脚本添加的基础样式，只保留控制页面特定样式
    new_styles = '''<style>
        /* 控制页面特定样式 */

        /* 页面标题 */
        .page-header {
            margin-bottom: 2rem;
        }

        .page-subtitle {
            color: #64748b;
            font-size: 0.875rem;
        }

        /* 控制面板样式 */
        .control-sections {
            display: flex;
            flex-direction: column;
            gap: 0;
        }

        .control-section {
            background: transparent;
            border-radius: 0;
            box-shadow: none;
            overflow: visible;
        }

        .section-header {
            padding: 0;
            border-bottom: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .section-title {
            font-size: 1rem;
            font-weight: 600;
            color: #1e293b;
        }

        .section-status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #22c55e;
        }

        .status-dot.inactive {
            background: #e2e8f0;
        }

        .section-content {
            padding: 0;
        }

        /* 控制网格 */
        .control-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }

        .control-item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .control-label {
            font-size: 0.875rem;
            color: #64748b;
            font-weight: 500;
        }

        .control-value {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        /* 输入控件样式 */
        .control-input {
            flex: 1;
            padding: 0.5rem 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            transition: all 0.2s ease;
        }

        .control-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .control-unit {
            font-size: 0.875rem;
            color: #64748b;
        }

        /* 开关控件 */
        .switch-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .switch-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .switch {
            position: relative;
            width: 44px;
            height: 24px;
            background: #e2e8f0;
            border-radius: 12px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .switch.active {
            background: #3b82f6;
        }

        .switch-handle {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: left 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .switch.active .switch-handle {
            left: 22px;
        }

        .switch-label {
            font-size: 0.875rem;
            color: #374151;
        }

        /* 按钮样式 */
        .control-btn {
            padding: 0.5rem 1rem;
            border: 1px solid #3b82f6;
            background: white;
            color: #3b82f6;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .control-btn:hover {
            background: #3b82f6;
            color: white;
        }

        .control-btn.primary {
            background: #3b82f6;
            color: white;
        }

        .control-btn.primary:hover {
            background: #2563eb;
        }

        /* 监控卡片样式 */
        .monitor-card {
            background: white;
            border-radius: 0.5rem;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .monitor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .monitor-title {
            font-size: 1rem;
            font-weight: 600;
            color: #1e293b;
        }

        .monitor-badge {
            padding: 0.25rem 0.75rem;
            background: #f3f4f6;
            color: #374151;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 500;
        }

        .monitor-badge.active {
            background: #dbeafe;
            color: #1d4ed8;
        }

        .monitor-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }

        .stat-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .stat-label {
            font-size: 0.75rem;
            color: #64748b;
        }

        .stat-value {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1e293b;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .control-grid {
                grid-template-columns: 1fr;
            }
            
            .monitor-stats {
                grid-template-columns: 1fr;
            }
        }

        /* 选择框样式 */
        .select-wrapper {
            position: relative;
            display: inline-block;
        }

        .control-select {
            appearance: none;
            padding: 0.5rem 2.5rem 0.5rem 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 200px;
        }

        .control-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .select-arrow {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: #64748b;
        }

        /* 标签页样式 */
        .tabs {
            display: flex;
            gap: 2rem;
            border-bottom: 2px solid #e2e8f0;
            margin-bottom: 2rem;
        }

        .tab {
            padding: 0.75rem 0;
            color: #64748b;
            font-weight: 500;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
        }

        .tab:hover {
            color: #374151;
        }

        .tab.active {
            color: #3b82f6;
            border-bottom-color: #3b82f6;
        }

        /* 内容包装器 */
        .content-wrapper {
            max-width: 1400px;
            margin: 0 auto;
        }

        /* 面包屑导航 */
        .breadcrumb {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
            color: #64748b;
        }

        .breadcrumb-separator {
            color: #cbd5e1;
        }

        .breadcrumb-current {
            color: #374151;
            font-weight: 500;
        }

        /* 操作栏 */
        .action-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .action-group {
            display: flex;
            gap: 0.75rem;
        }

        /* 储能柜选择器 */
        .cabinet-selector {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        /* 搜索框样式 */
        .search-box {
            position: relative;
        }

        .search-input {
            padding: 0.5rem 2.5rem 0.5rem 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            min-width: 300px;
        }

        .search-icon {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: #64748b;
        }

        /* 可搜索选择器样式 */
        .searchable-select {
            position: relative;
            display: inline-block;
        }

        .searchable-select-trigger {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            background: white;
            min-width: 250px;
            cursor: pointer;
            font-size: 0.875rem;
        }

        .searchable-select-trigger:hover {
            border-color: #cbd5e1;
        }

        .searchable-select-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 0.25rem;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            display: none;
            z-index: 50;
        }

        .searchable-select-dropdown.show {
            display: block;
        }

        .searchable-select-search {
            padding: 0.75rem;
            border-bottom: 1px solid #e2e8f0;
        }

        .searchable-select-search input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.25rem;
            font-size: 0.875rem;
        }

        .searchable-select-options {
            max-height: 200px;
            overflow-y: auto;
        }

        .searchable-select-option {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            font-size: 0.875rem;
            transition: background 0.15s ease;
        }

        .searchable-select-option:hover {
            background: #f3f4f6;
        }

        .searchable-select-option.selected {
            background: #dbeafe;
            color: #1d4ed8;
        }

        /* 修正内容区域布局 */
        .container {
            width: 100%;
        }

        .content {
            padding: 1.5rem;
        }

        @media (min-width: 1024px) {
            .content {
                padding: 2rem;
            }
        }
    </style>'''
    
    # 替换样式部分
    content = content[:style_start] + new_styles + content[style_end+8:]

# 保存文件
with open('control.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ control.html样式已恢复")