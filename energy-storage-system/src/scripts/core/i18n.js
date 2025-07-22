// 国际化模块
class I18n {
    constructor() {
        this.locale = this.getLocale();
        this.translations = {};
        this.loadedLanguages = new Set();
    }
    
    // 获取当前语言
    getLocale() {
        const savedLocale = localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE);
        if (savedLocale && CONFIG.SUPPORTED_LANGUAGES.includes(savedLocale)) {
            return savedLocale;
        }
        
        // 获取浏览器语言
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.split('-')[0];
        
        // 匹配支持的语言
        for (const lang of CONFIG.SUPPORTED_LANGUAGES) {
            if (lang.startsWith(shortLang)) {
                return lang;
            }
        }
        
        return CONFIG.DEFAULT_LANGUAGE;
    }
    
    // 设置语言
    async setLocale(locale) {
        if (!CONFIG.SUPPORTED_LANGUAGES.includes(locale)) {
            console.error(`Unsupported language: ${locale}`);
            return;
        }
        
        this.locale = locale;
        localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, locale);
        
        // 加载翻译文件
        await this.loadTranslations(locale);
        
        // 更新页面
        this.updatePage();
        
        // 触发语言改变事件
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { locale } }));
    }
    
    // 加载翻译文件
    async loadTranslations(locale) {
        if (this.loadedLanguages.has(locale)) {
            return;
        }
        
        try {
            const response = await fetch(`locales/${locale}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${locale}`);
            }
            
            this.translations[locale] = await response.json();
            this.loadedLanguages.add(locale);
        } catch (error) {
            console.error('Error loading translations:', error);
            // 回退到默认语言
            if (locale !== CONFIG.DEFAULT_LANGUAGE) {
                await this.loadTranslations(CONFIG.DEFAULT_LANGUAGE);
            }
        }
    }
    
    // 获取翻译文本
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.locale];
        
        if (!value) {
            console.warn(`No translations loaded for ${this.locale}`);
            return key;
        }
        
        // 遍历键路径
        for (const k of keys) {
            value = value?.[k];
            if (!value) {
                console.warn(`Translation not found: ${key}`);
                return key;
            }
        }
        
        // 替换参数
        if (typeof value === 'string') {
            return value.replace(/\{(\w+)\}/g, (match, param) => {
                return params[param] !== undefined ? params[param] : match;
            });
        }
        
        return value;
    }
    
    // 更新页面上的翻译
    updatePage() {
        // 更新元素文本
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
        
        // 更新占位符
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // 更新标题
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
        
        // 更新页面标题
        document.title = this.t('system.title');
        
        // 更新语言按钮显示
        const langButton = document.querySelector('.icon-lang');
        if (langButton) {
            langButton.textContent = this.locale === 'zh-CN' ? '中' : 'EN';
        }
    }
    
    // 初始化
    async init() {
        await this.loadTranslations(this.locale);
        this.updatePage();
    }
}

// 创建全局实例
const i18n = new I18n();