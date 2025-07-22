// localStorage 封装模块
class Storage {
    constructor(prefix = 'ems_') {
        this.prefix = prefix;
    }
    
    // 生成键名
    getKey(key) {
        return `${this.prefix}${key}`;
    }
    
    // 设置数据
    set(key, value, expireTime = null) {
        try {
            const data = {
                value: value,
                timestamp: Date.now(),
                expire: expireTime ? Date.now() + expireTime : null
            };
            
            localStorage.setItem(this.getKey(key), JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    }
    
    // 获取数据
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.getKey(key));
            if (!item) return defaultValue;
            
            const data = JSON.parse(item);
            
            // 检查是否过期
            if (data.expire && Date.now() > data.expire) {
                this.remove(key);
                return defaultValue;
            }
            
            return data.value;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    }
    
    // 删除数据
    remove(key) {
        try {
            localStorage.removeItem(this.getKey(key));
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }
    
    // 清空所有数据
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
    
    // 检查键是否存在
    has(key) {
        return localStorage.getItem(this.getKey(key)) !== null;
    }
    
    // 获取所有键
    keys() {
        const keys = [];
        const storageKeys = Object.keys(localStorage);
        
        storageKeys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                keys.push(key.replace(this.prefix, ''));
            }
        });
        
        return keys;
    }
    
    // 获取存储大小
    getSize() {
        let size = 0;
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                size += localStorage.getItem(key).length;
            }
        });
        
        return size;
    }
}

// 创建全局实例
const storage = new Storage();