/**
 * 工商储能柜能源管理系统 - 主入口文件
 * @version 1.0.0
 * @author Energy Storage System Team
 */

// 导入核心模块
import './core/storage.js';
import './core/event-bus.js';
import './core/auth.js';
import './core/i18n.js';
import './core/router.js';
import './core/app.js';

// 导入认证模块
import './modules/auth/auth.js';

// 导入工具函数
import './utils/helpers.js';
import './utils/formatter.js';
import './utils/validator.js';
import './utils/datetime.js';

// 导入基础组件
import './components/base/component.js';
import './components/base/button.js';
import './components/base/input.js';
import './components/base/select.js';
import './components/base/form.js';

// 导入高级组件
import './components/advanced/table.js';
import './components/advanced/modal.js';
import './components/advanced/drawer.js';
import './components/advanced/tabs.js';

// 导入图表组件
import './components/chart/line-chart.js';
import './components/chart/bar-chart.js';
import './components/chart/pie-chart.js';
import './components/chart/gauge-chart.js';

// 导入反馈组件
import './components/feedback/toast.js';
import './components/feedback/notification.js';
import './components/feedback/confirm.js';
import './components/feedback/loading.js';

// 系统初始化检查
(function() {
    'use strict';
    
    // 检查浏览器兼容性
    const checkBrowserCompatibility = () => {
        const requiredFeatures = [
            'Promise',
            'fetch',
            'localStorage',
            'sessionStorage',
            'CustomEvent',
            'Map',
            'Set',
            'Symbol'
        ];
        
        const missingFeatures = requiredFeatures.filter(feature => {
            try {
                return !window[feature];
            } catch (e) {
                return true;
            }
        });
        
        if (missingFeatures.length > 0) {
            console.error('Browser missing required features:', missingFeatures);
            alert('您的浏览器版本过低，请升级到最新版本以使用本系统。');
            return false;
        }
        
        return true;
    };
    
    // 检查必要的依赖
    const checkDependencies = () => {
        if (typeof echarts === 'undefined') {
            console.error('ECharts library not loaded');
            return false;
        }
        
        return true;
    };
    
    // 设置全局错误处理
    const setupErrorHandling = () => {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            // 可以在这里添加错误上报逻辑
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            // 可以在这里添加错误上报逻辑
        });
    };
    
    // 初始化性能监控
    const initPerformanceMonitoring = () => {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page load performance:', {
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                        totalTime: perfData.loadEventEnd - perfData.fetchStart
                    });
                }, 0);
            });
        }
    };
    
    // 系统启动
    const bootstrap = () => {
        console.log('Energy Storage System starting...');
        
        // 检查兼容性
        if (!checkBrowserCompatibility()) {
            return;
        }
        
        // 检查依赖
        if (!checkDependencies()) {
            return;
        }
        
        // 设置错误处理
        setupErrorHandling();
        
        // 初始化性能监控
        initPerformanceMonitoring();
        
        // 应用初始化由 app.js 中的 DOMContentLoaded 事件触发
        console.log('System bootstrap completed');
    };
    
    // 启动系统
    bootstrap();
})();

// 导出版本信息
window.ESS_VERSION = '1.0.0';
window.ESS_BUILD_DATE = new Date().toISOString();