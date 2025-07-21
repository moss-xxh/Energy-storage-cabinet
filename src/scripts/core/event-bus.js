/**
 * 事件总线模块
 * 实现发布-订阅模式，用于模块间通信
 */

class EventBus {
    constructor() {
        this.events = new Map();
        this.onceEvents = new Map();
    }

    /**
     * 订阅事件
     * @param {string} event - 事件名称
     * @param {Function} handler - 事件处理函数
     * @param {Object} context - 执行上下文
     * @returns {Function} 取消订阅函数
     */
    on(event, handler, context = null) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        const handlers = this.events.get(event);
        const wrappedHandler = {
            handler,
            context,
            id: this.generateId()
        };

        handlers.push(wrappedHandler);

        // 返回取消订阅函数
        return () => this.off(event, wrappedHandler.id);
    }

    /**
     * 订阅一次性事件
     * @param {string} event - 事件名称
     * @param {Function} handler - 事件处理函数
     * @param {Object} context - 执行上下文
     */
    once(event, handler, context = null) {
        const onceHandler = (...args) => {
            handler.apply(context, args);
            this.off(event, onceHandler);
        };

        this.on(event, onceHandler, context);
    }

    /**
     * 取消订阅
     * @param {string} event - 事件名称
     * @param {string|Function} handlerOrId - 处理函数或ID
     */
    off(event, handlerOrId) {
        if (!this.events.has(event)) {
            return;
        }

        const handlers = this.events.get(event);
        
        if (typeof handlerOrId === 'string') {
            // 通过ID取消
            const index = handlers.findIndex(h => h.id === handlerOrId);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        } else if (typeof handlerOrId === 'function') {
            // 通过函数引用取消
            const index = handlers.findIndex(h => h.handler === handlerOrId);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        } else if (!handlerOrId) {
            // 取消该事件的所有订阅
            this.events.delete(event);
        }

        // 如果没有处理函数了，删除事件
        if (handlers && handlers.length === 0) {
            this.events.delete(event);
        }
    }

    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {...any} args - 事件参数
     */
    emit(event, ...args) {
        // 触发具体事件
        if (this.events.has(event)) {
            const handlers = this.events.get(event).slice(); // 复制数组，防止在执行过程中修改
            handlers.forEach(({ handler, context }) => {
                try {
                    handler.apply(context, args);
                } catch (error) {
                    console.error(`Error in event handler for "${event}":`, error);
                }
            });
        }

        // 触发通配符事件
        if (this.events.has('*')) {
            const wildcardHandlers = this.events.get('*').slice();
            wildcardHandlers.forEach(({ handler, context }) => {
                try {
                    handler.apply(context, [event, ...args]);
                } catch (error) {
                    console.error('Error in wildcard event handler:', error);
                }
            });
        }
    }

    /**
     * 异步触发事件
     * @param {string} event - 事件名称
     * @param {...any} args - 事件参数
     * @returns {Promise<void>}
     */
    async emitAsync(event, ...args) {
        if (!this.events.has(event)) {
            return;
        }

        const handlers = this.events.get(event).slice();
        const promises = handlers.map(({ handler, context }) => {
            return new Promise((resolve, reject) => {
                try {
                    const result = handler.apply(context, args);
                    if (result instanceof Promise) {
                        result.then(resolve).catch(reject);
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        await Promise.all(promises);
    }

    /**
     * 检查是否有事件订阅
     * @param {string} event - 事件名称
     * @returns {boolean}
     */
    hasListeners(event) {
        return this.events.has(event) && this.events.get(event).length > 0;
    }

    /**
     * 获取事件订阅者数量
     * @param {string} event - 事件名称
     * @returns {number}
     */
    getListenerCount(event) {
        return this.events.has(event) ? this.events.get(event).length : 0;
    }

    /**
     * 清除所有事件订阅
     */
    clear() {
        this.events.clear();
        this.onceEvents.clear();
    }

    /**
     * 生成唯一ID
     * @returns {string}
     */
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 创建命名空间
     * @param {string} namespace - 命名空间
     * @returns {Object} 命名空间事件总线
     */
    namespace(namespace) {
        const self = this;
        return {
            on: (event, handler, context) => {
                return self.on(`${namespace}:${event}`, handler, context);
            },
            once: (event, handler, context) => {
                self.once(`${namespace}:${event}`, handler, context);
            },
            off: (event, handlerOrId) => {
                self.off(`${namespace}:${event}`, handlerOrId);
            },
            emit: (event, ...args) => {
                self.emit(`${namespace}:${event}`, ...args);
            },
            emitAsync: (event, ...args) => {
                return self.emitAsync(`${namespace}:${event}`, ...args);
            }
        };
    }
}

// 创建全局事件总线实例
const eventBus = new EventBus();

// 预定义系统事件
const SystemEvents = {
    // 应用事件
    APP_READY: 'app:ready',
    APP_ERROR: 'app:error',
    
    // 用户事件
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    USER_UPDATE: 'user:update',
    
    // 路由事件
    ROUTE_CHANGE: 'route:change',
    ROUTE_BEFORE_CHANGE: 'route:before-change',
    
    // 数据事件
    DATA_LOADED: 'data:loaded',
    DATA_UPDATE: 'data:update',
    DATA_ERROR: 'data:error',
    
    // 设备事件
    DEVICE_ONLINE: 'device:online',
    DEVICE_OFFLINE: 'device:offline',
    DEVICE_UPDATE: 'device:update',
    DEVICE_ALARM: 'device:alarm',
    
    // 网络事件
    NETWORK_ONLINE: 'network:online',
    NETWORK_OFFLINE: 'network:offline',
    
    // WebSocket事件
    WS_CONNECTED: 'ws:connected',
    WS_DISCONNECTED: 'ws:disconnected',
    WS_MESSAGE: 'ws:message',
    WS_ERROR: 'ws:error',
    
    // UI事件
    THEME_CHANGED: 'theme:changed',
    LANGUAGE_CHANGED: 'language:changed',
    SIDEBAR_TOGGLE: 'sidebar:toggle',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close'
};

// 导出
window.EventBus = EventBus;
window.eventBus = eventBus;
window.SystemEvents = SystemEvents;