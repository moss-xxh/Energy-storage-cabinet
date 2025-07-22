# 菜单更新指南

## 问题说明
当前只有 `station-management.html` 更新了新的菜单结构，其他页面（如 `data-analysis.html`）仍使用旧菜单，导致切换页面时菜单样式不一致。

## 快速解决方案

### 方法1：手动更新每个页面（推荐）

1. **添加共享样式**
   在每个HTML页面的 `<head>` 部分添加：
   ```html
   <link rel="stylesheet" href="./shared-menu-styles.css">
   ```

2. **替换菜单HTML**
   将 `menu-template.html` 中的内容复制到每个页面的 `<nav class="sidebar-menu">` 标签内

3. **添加toggleSubmenu函数**
   在每个页面的JavaScript部分添加：
   ```javascript
   function toggleSubmenu(menuParent) {
       const submenu = menuParent.nextElementSibling;
       const isOpen = submenu.classList.contains('open');
       
       document.querySelectorAll('.submenu.open').forEach(menu => {
           if (menu !== submenu) {
               menu.classList.remove('open');
               menu.previousElementSibling.classList.remove('expanded');
           }
       });
       
       if (isOpen) {
           submenu.classList.remove('open');
           menuParent.classList.remove('expanded');
       } else {
           submenu.classList.add('open');
           menuParent.classList.add('expanded');
       }
   }
   ```

4. **更新i18n翻译**
   确保包含以下翻译键：
   ```javascript
   'menu.station': '电站' / 'Station',
   'menu.stationManagement': '电站管理' / 'Station Management',
   'menu.priceSettings': '电价设置' / 'Price Settings',
   ```

5. **设置当前页面的active状态**
   - station-management.html: 给 `#menu-station-management` 添加 `active` 类
   - data-analysis.html: 给 `#menu-data-analysis` 添加 `active` 类
   - 以此类推...

### 方法2：创建共享组件（长期方案）

创建一个 `shared-components.js` 文件，统一管理菜单的渲染和状态。

## 需要更新的文件列表

1. `/commercial-storage/data-analysis.html`
2. `/commercial-storage/station-monitoring.html`
3. 其他任何包含侧边栏菜单的页面

## 验证步骤

1. 在不同页面间切换，确保菜单样式一致
2. 检查二级菜单的展开/收起功能
3. 验证当前页面的菜单项高亮显示
4. 测试深色主题下的显示效果
5. 确认中英文切换正常工作