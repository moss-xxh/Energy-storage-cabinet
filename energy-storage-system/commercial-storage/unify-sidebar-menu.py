#!/usr/bin/env python3
"""
统一所有页面的侧边栏菜单组件
1. 移除所有旧的内嵌菜单代码
2. 添加新的sidebar组件引用
3. 确保页面结构正确
"""

import os
import re
import glob

def clean_and_update_html(filepath):
    """清理旧菜单并添加新的sidebar组件"""
    
    # 读取文件内容
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. 移除旧的内嵌侧边栏代码
    # 移除 <aside class="sidebar">...</aside> 及其内容
    content = re.sub(
        r'<aside\s+class="sidebar"[^>]*>.*?</aside>\s*',
        '',
        content,
        flags=re.DOTALL | re.IGNORECASE
    )
    
    # 移除旧的 sidebar-container 如果包含内容
    content = re.sub(
        r'<div\s+id="sidebar-container"[^>]*>.*?</div>\s*',
        '<div id="sidebar-container"></div>\n',
        content,
        flags=re.DOTALL
    )
    
    # 移除旧的菜单相关样式（如果是内嵌的）
    content = re.sub(
        r'/\*\s*侧边栏样式\s*\*/.*?(?=/\*|</style>)',
        '',
        content,
        flags=re.DOTALL
    )
    
    # 2. 确保有正确的引用
    # 检查是否在子目录中
    dir_path = os.path.dirname(filepath)
    base_dir = os.path.basename(dir_path)
    is_subdir = base_dir in ['monitoring', 'analysis', 'alarm', 'device', 'report', 'system', 'user']
    
    # 设置正确的路径前缀
    path_prefix = '../' if is_subdir else './'
    
    # 3. 添加sidebar.css（如果没有）
    if 'sidebar.css' not in content:
        # 在</title>后添加
        content = re.sub(
            r'(</title>)',
            f'\\1\\n    <link rel="stylesheet" href="{path_prefix}sidebar.css">',
            content,
            count=1
        )
    else:
        # 更新已有的路径
        content = re.sub(
            r'href="[^"]*sidebar\.css"',
            f'href="{path_prefix}sidebar.css"',
            content
        )
    
    # 4. 确保有sidebar容器
    if '<div id="sidebar-container"></div>' not in content:
        # 在<body>后添加
        content = re.sub(
            r'(<body[^>]*>)',
            r'\1\n    <!-- 侧边栏容器 -->\n    <div id="sidebar-container"></div>\n',
            content,
            count=1
        )
    
    # 5. 确保主内容区域包裹
    if 'class="main-content"' not in content:
        # 查找主要内容区域并添加包裹
        # 尝试找到第一个主要内容div
        content = re.sub(
            r'(<div id="sidebar-container"></div>\s*\n)(.*?)(<script|</body>)',
            r'\1    <div class="main-content">\n\2    </div>\n\3',
            content,
            flags=re.DOTALL,
            count=1
        )
    
    # 6. 添加sidebar.js（如果没有）
    if 'sidebar.js' not in content:
        # 在</body>前添加
        content = re.sub(
            r'(</body>)',
            f'\\n    <!-- 引入侧边栏脚本 -->\\n    <script src="{path_prefix}sidebar.js"></script>\\n\\1',
            content,
            count=1
        )
    else:
        # 更新已有的路径
        content = re.sub(
            r'src="[^"]*sidebar\.js"',
            f'src="{path_prefix}sidebar.js"',
            content
        )
    
    # 7. 添加必要的基础样式（如果没有）
    if '* {' not in content and 'box-sizing: border-box' not in content:
        basic_styles = """
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f3f4f6;
            color: #1f2937;
        }

        .content {
            padding: 2rem;
        }

        .page-header {
            margin-bottom: 2rem;
        }

        .page-header h1 {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        """
        
        # 在现有style标签中添加或创建新的style标签
        if '<style>' in content:
            content = re.sub(
                r'(<style>)',
                f'\\1{basic_styles}',
                content,
                count=1
            )
        else:
            content = re.sub(
                r'(</head>)',
                f'    <style>{basic_styles}    </style>\\n\\1',
                content,
                count=1
            )
    
    # 8. 清理多余的空行
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    # 只有内容真正改变时才写入文件
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ 已更新: {filepath}")
        return True
    else:
        print(f"- 无需更新: {filepath}")
        return False

def main():
    """主函数：处理所有HTML文件"""
    
    print("开始统一侧边栏菜单组件...\n")
    
    # 获取所有HTML文件
    html_files = []
    
    # 根目录的HTML文件
    for file in glob.glob("*.html"):
        if file not in ['demo-with-sidebar.html', 'test-sidebar.html']:  # 排除测试文件
            html_files.append(file)
    
    # 子目录的HTML文件
    subdirs = ['monitoring', 'analysis', 'alarm', 'device', 'report', 'system', 'user']
    for subdir in subdirs:
        if os.path.exists(subdir):
            for file in glob.glob(f"{subdir}/*.html"):
                html_files.append(file)
    
    # 处理每个文件
    updated_count = 0
    for file in sorted(html_files):
        if clean_and_update_html(file):
            updated_count += 1
    
    print(f"\n处理完成！")
    print(f"- 扫描文件数: {len(html_files)}")
    print(f"- 更新文件数: {updated_count}")
    
    # 创建缺失的目录和文件
    print("\n检查并创建缺失的页面...")
    create_missing_pages()

def create_missing_pages():
    """创建缺失的子目录和页面"""
    
    # 定义需要创建的页面
    pages_to_create = {
        'monitoring': ['device-list.html', 'device-detail.html', 'topology.html'],
        'device': ['manage.html', 'control.html', 'firmware.html'],
        'alarm': ['rules.html', 'list.html', 'history.html'],
        'report': ['list.html', 'create.html', 'templates.html'],
        'system': ['settings.html', 'users.html', 'roles.html', 'logs.html'],
        'user': ['profile.html', 'password.html']
    }
    
    # 页面模板
    template = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - 工商储能管理系统</title>
    <link rel="stylesheet" href="../sidebar.css">
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f3f4f6;
            color: #1f2937;
        }}

        .content {{
            padding: 2rem;
        }}

        .page-header {{
            margin-bottom: 2rem;
        }}

        .page-header h1 {{
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }}

        .page-header p {{
            color: #6b7280;
            font-size: 1rem;
        }}

        .placeholder {{
            background: white;
            border-radius: 8px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}

        .placeholder-icon {{
            font-size: 3rem;
            margin-bottom: 1rem;
        }}

        .placeholder-text {{
            color: #6b7280;
            font-size: 1.125rem;
        }}
    </style>
</head>
<body>
    <!-- 侧边栏容器 -->
    <div id="sidebar-container"></div>
    
    <div class="main-content">
        <div class="content">
            <div class="page-header">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>

            <div class="placeholder">
                <div class="placeholder-icon">{icon}</div>
                <div class="placeholder-text">页面开发中...</div>
            </div>
        </div>
    </div>

    <!-- 引入侧边栏脚本 -->
    <script src="../sidebar.js"></script>
</body>
</html>"""
    
    # 页面信息
    page_info = {
        'device-list.html': ('设备列表', '实时监控所有储能设备状态', '📱'),
        'device-detail.html': ('设备详情', '查看设备详细信息和运行参数', '📊'),
        'topology.html': ('拓扑图', '系统拓扑结构可视化展示', '🗺️'),
        'manage.html': ('设备台账', '管理所有设备的基本信息', '📋'),
        'control.html': ('远程控制', '远程控制设备运行状态', '🎮'),
        'firmware.html': ('固件管理', '管理设备固件版本和升级', '💾'),
        'rules.html': ('告警规则', '配置系统告警规则', '📏'),
        'list.html': ('告警列表', '查看当前告警信息', '🔔'),
        'history.html': ('历史告警', '查看历史告警记录', '📜'),
        'create.html': ('创建报表', '创建自定义报表', '✏️'),
        'templates.html': ('报表模板', '管理报表模板', '📑'),
        'settings.html': ('系统设置', '配置系统参数', '⚙️'),
        'users.html': ('用户管理', '管理系统用户', '👥'),
        'roles.html': ('角色管理', '管理用户角色和权限', '🎭'),
        'logs.html': ('日志管理', '查看系统操作日志', '📝'),
        'profile.html': ('个人信息', '查看和修改个人信息', '👤'),
        'password.html': ('修改密码', '修改登录密码', '🔐')
    }
    
    created_count = 0
    
    for dir_name, files in pages_to_create.items():
        # 创建目录
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)
            print(f"✓ 创建目录: {dir_name}/")
        
        # 创建文件
        for filename in files:
            filepath = os.path.join(dir_name, filename)
            if not os.path.exists(filepath):
                title, desc, icon = page_info.get(filename, ('页面', '页面描述', '📄'))
                content = template.format(title=title, description=desc, icon=icon)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✓ 创建页面: {filepath}")
                created_count += 1
    
    if created_count > 0:
        print(f"\n✓ 创建了 {created_count} 个缺失的页面")
    else:
        print("\n✓ 所有页面已存在")

if __name__ == "__main__":
    main()