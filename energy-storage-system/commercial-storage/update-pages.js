// 更新页面以应用统一的导航栏和响应式布局的脚本

const fs = require('fs');
const path = require('path');

// 需要在<head>标签中添加的样式链接
const stylesheets = `    <link rel="stylesheet" href="{PATH_PREFIX}sidebar.css">
    <link rel="stylesheet" href="{PATH_PREFIX}navbar.css">
    <link rel="stylesheet" href="{PATH_PREFIX}responsive.css">`;

// 需要在</body>标签前添加的脚本
const scripts = `    <script src="{PATH_PREFIX}sidebar.js"></script>
    <script src="{PATH_PREFIX}navbar.js"></script>`;

// 根据文件路径计算相对路径前缀
function getPathPrefix(filePath) {
    const depth = filePath.split('/').filter(p => p && p !== '.').length - 1;
    if (depth === 0) return './';
    return '../'.repeat(depth);
}

// 需要更新的主要页面列表
const pagesToUpdate = [
    'control.html',
    'station-management.html',
    'price-settings.html',
    'station-detail-3d.html',
    'group-control.html',
    'monitoring/device-list.html',
    'device/device1.html',
    'analysis/energy.html',
    'analysis/efficiency.html',
    'analysis/economic.html',
    'history/storage-history.html',
    'history/pcs-history.html',
    'history/battery-history.html',
    'history/pv-history.html',
    'history/load-history.html',
    'alarm/rules.html',
    'alarm/list.html',
    'alarm/analysis.html',
    'report/station-report.html',
    'report/inverter-report.html',
    'report/storage-report.html',
    'report/power-generation.html',
    'report/revenue-report.html',
    'report/custom-report.html',
    'system/enterprise.html',
    'system/electricity-price-template.html',
    'system/menus.html',
    'system/users.html',
    'system/roles.html',
    'system/settings.html',
    'system/logs.html'
];

// 处理每个页面
pagesToUpdate.forEach(page => {
    const filePath = path.join(__dirname, page);
    
    if (!fs.existsSync(filePath)) {
        console.log(`文件不存在: ${page}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const pathPrefix = getPathPrefix(page);
    
    // 检查是否已经包含了新的样式和脚本
    if (content.includes('navbar.css')) {
        console.log(`已更新: ${page}`);
        return;
    }
    
    // 添加响应式viewport meta标签（如果没有）
    if (!content.includes('viewport')) {
        content = content.replace(
            '<head>',
            '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
        );
    }
    
    // 在现有的sidebar.css之前添加新的样式链接
    if (content.includes('sidebar.css')) {
        // 替换现有的sidebar.css引用，添加新的样式
        content = content.replace(
            /<link\s+rel="stylesheet"\s+href="[^"]*sidebar\.css">/,
            stylesheets.replace(/{PATH_PREFIX}/g, pathPrefix)
        );
    } else {
        // 在</head>之前添加样式
        content = content.replace(
            '</head>',
            stylesheets.replace(/{PATH_PREFIX}/g, pathPrefix) + '\n</head>'
        );
    }
    
    // 在现有的sidebar.js之后添加navbar.js
    if (content.includes('sidebar.js')) {
        content = content.replace(
            /<script\s+src="[^"]*sidebar\.js"><\/script>/,
            scripts.replace(/{PATH_PREFIX}/g, pathPrefix)
        );
    } else {
        // 在</body>之前添加脚本
        content = content.replace(
            '</body>',
            scripts.replace(/{PATH_PREFIX}/g, pathPrefix) + '\n</body>'
        );
    }
    
    // 保存更新后的文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`已更新: ${page}`);
});

console.log('页面更新完成！');