#!/usr/bin/env python3
import re

# 读取文件
with open('station-management.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 查找表格头部
table_match = re.search(r'<table class="station-table">.*?</thead>', content, re.DOTALL)

if table_match:
    table_header = table_match.group(0)
    
    # 查找所有th标签
    th_pattern = r'<th[^>]*>(.*?)</th>'
    th_matches = re.findall(th_pattern, table_header, re.DOTALL)
    
    print("找到的表格列：")
    for i, th in enumerate(th_matches):
        # 提取列名
        col_name = re.search(r'<span>([^<]+)</span>', th)
        if col_name:
            name = col_name.group(1)
        else:
            name = "未知"
            
        # 统计箭头
        up_arrows = th.count('↑')
        down_arrows = th.count('↓')
        
        print(f"\n第{i+1}列: {name}")
        if up_arrows > 0 or down_arrows > 0:
            print(f"  - 上箭头(↑): {up_arrows}个")
            print(f"  - 下箭头(↓): {down_arrows}个")
            
            # 显示具体的排序代码
            sort_icons = re.search(r'<div class="sort-icons">.*?</div>', th, re.DOTALL)
            if sort_icons:
                print(f"  - 排序代码: {sort_icons.group(0)}")
else:
    print("未找到表格")