/**
 * 菜单配置文件
 */

export const MENU_CONFIG = [
    {
        id: 'dashboard',
        name: '仪表盘',
        nameKey: 'menu.dashboard',
        icon: 'dashboard',
        path: '/dashboard',
        component: 'dashboard/overview',
        meta: {
            requiresAuth: true,
            permissions: []
        }
    },
    {
        id: 'monitor',
        name: '监控管理',
        nameKey: 'menu.monitor',
        icon: 'monitor',
        children: [
            {
                id: 'realtime',
                name: '实时监控',
                nameKey: 'menu.monitor.realtime',
                path: '/monitor/realtime',
                component: 'monitor/realtime-monitor',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            },
            {
                id: 'history',
                name: '历史数据',
                nameKey: 'menu.monitor.history',
                path: '/monitor/history',
                component: 'monitor/history-data',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            }
        ]
    },
    {
        id: 'device',
        name: '设备管理',
        nameKey: 'menu.device',
        icon: 'device',
        children: [
            {
                id: 'device-list',
                name: '设备列表',
                nameKey: 'menu.device.list',
                path: '/device/list',
                component: 'device/device-list',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            },
            {
                id: 'battery',
                name: '电池管理',
                nameKey: 'menu.device.battery',
                path: '/device/battery',
                component: 'device/battery-manage',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            },
            {
                id: 'pcs',
                name: 'PCS管理',
                nameKey: 'menu.device.pcs',
                path: '/device/pcs',
                component: 'device/pcs-manage',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            },
            {
                id: 'bms',
                name: 'BMS管理',
                nameKey: 'menu.device.bms',
                path: '/device/bms',
                component: 'device/bms-manage',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            }
        ]
    },
    {
        id: 'energy',
        name: '能源分析',
        nameKey: 'menu.energy',
        icon: 'energy',
        children: [
            {
                id: 'energy-analysis',
                name: '能效分析',
                nameKey: 'menu.energy.analysis',
                path: '/energy/analysis',
                component: 'analysis/energy-analysis',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            },
            {
                id: 'cost-benefit',
                name: '成本效益',
                nameKey: 'menu.energy.costBenefit',
                path: '/energy/cost-benefit',
                component: 'analysis/cost-benefit',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            },
            {
                id: 'optimization',
                name: '优化建议',
                nameKey: 'menu.energy.optimization',
                path: '/energy/optimization',
                component: 'analysis/optimization',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            }
        ]
    },
    {
        id: 'alarm',
        name: '告警管理',
        nameKey: 'menu.alarm',
        icon: 'alarm',
        children: [
            {
                id: 'alarm-current',
                name: '当前告警',
                nameKey: 'menu.alarm.current',
                path: '/alarm/current',
                component: 'alarm/alarm-list',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            },
            {
                id: 'alarm-history',
                name: '历史告警',
                nameKey: 'menu.alarm.history',
                path: '/alarm/history',
                component: 'alarm/alarm-history',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            },
            {
                id: 'alarm-config',
                name: '告警配置',
                nameKey: 'menu.alarm.config',
                path: '/alarm/config',
                component: 'alarm/alarm-config',
                meta: {
                    requiresAuth: true,
                    permissions: ['admin']
                }
            }
        ]
    },
    {
        id: 'report',
        name: '报表中心',
        nameKey: 'menu.report',
        icon: 'report',
        children: [
            {
                id: 'report-daily',
                name: '日报表',
                nameKey: 'menu.report.daily',
                path: '/report/daily',
                component: 'report/daily-report',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            },
            {
                id: 'report-monthly',
                name: '月报表',
                nameKey: 'menu.report.monthly',
                path: '/report/monthly',
                component: 'report/monthly-report',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            },
            {
                id: 'report-custom',
                name: '自定义报表',
                nameKey: 'menu.report.custom',
                path: '/report/custom',
                component: 'report/custom-report',
                meta: {
                    requiresAuth: true,
                    permissions: []
                }
            }
        ]
    },
    {
        id: 'system',
        name: '系统设置',
        nameKey: 'menu.system',
        icon: 'setting',
        children: [
            {
                id: 'system-config',
                name: '系统配置',
                nameKey: 'menu.system.config',
                path: '/system/config',
                component: 'system/settings',
                meta: {
                    requiresAuth: true,
                    permissions: ['admin']
                }
            },
            {
                id: 'user-manage',
                name: '用户管理',
                nameKey: 'menu.system.user',
                path: '/system/user',
                component: 'system/user-manage',
                meta: {
                    requiresAuth: true,
                    permissions: ['admin']
                }
            },
            {
                id: 'role-manage',
                name: '角色管理',
                nameKey: 'menu.system.role',
                path: '/system/role',
                component: 'system/role-manage',
                meta: {
                    requiresAuth: true,
                    permissions: ['admin']
                }
            },
            {
                id: 'log-manage',
                name: '日志管理',
                nameKey: 'menu.system.log',
                path: '/system/log',
                component: 'system/log-manage',
                meta: {
                    requiresAuth: true,
                    permissions: ['admin']
                }
            }
        ]
    }
];

/**
 * 获取扁平化菜单列表
 */
export function getFlatMenuList() {
    const flatList = [];
    
    function flatten(menus, parent = null) {
        menus.forEach(menu => {
            const item = {
                ...menu,
                parent: parent ? parent.id : null
            };
            
            flatList.push(item);
            
            if (menu.children && menu.children.length > 0) {
                flatten(menu.children, menu);
                delete item.children;
            }
        });
    }
    
    flatten(MENU_CONFIG);
    return flatList;
}

/**
 * 根据路径查找菜单项
 */
export function findMenuByPath(path) {
    const flatList = getFlatMenuList();
    return flatList.find(menu => menu.path === path);
}

/**
 * 根据权限过滤菜单
 */
export function filterMenuByPermission(permissions = []) {
    function filter(menus) {
        return menus.filter(menu => {
            // 检查权限
            if (menu.meta && menu.meta.permissions && menu.meta.permissions.length > 0) {
                const hasPermission = menu.meta.permissions.some(p => permissions.includes(p));
                if (!hasPermission) {
                    return false;
                }
            }
            
            // 递归过滤子菜单
            if (menu.children && menu.children.length > 0) {
                menu.children = filter(menu.children);
                return menu.children.length > 0;
            }
            
            return true;
        });
    }
    
    return filter(JSON.parse(JSON.stringify(MENU_CONFIG)));
}