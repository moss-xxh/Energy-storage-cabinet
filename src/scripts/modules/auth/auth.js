/**
 * 认证模块 - 处理登录、注册、忘记密码等功能
 */

(function() {
    'use strict';

class AuthModule {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initPasswordToggle();
    }

    bindEvents() {
        // 标签页切换
        document.querySelectorAll('.ess-auth__tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // 忘记密码链接
        const forgotLink = document.getElementById('forgot-password-link');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPassword();
            });
        }

        // 返回登录
        const backBtn = document.getElementById('back-to-login');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showLogin();
            });
        }

        // 表单提交
        this.bindFormEvents();

        // 语言切换
        const authLangToggle = document.getElementById('auth-lang-toggle');
        if (authLangToggle) {
            authLangToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }

        // 主题切换
        const authThemeToggle = document.getElementById('auth-theme-toggle');
        if (authThemeToggle) {
            authThemeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    bindFormEvents() {
        // 登录表单
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(new FormData(loginForm));
            });
        }

        // 注册表单
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(new FormData(registerForm));
            });
        }

        // 忘记密码表单
        const forgotForm = document.getElementById('forgot-password-form');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleForgotPassword(new FormData(forgotForm));
            });
        }
    }

    initPasswordToggle() {
        const toggleButtons = document.querySelectorAll('.ess-input__toggle');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.previousElementSibling;
                const icon = button.querySelector('.ess-icon');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.textContent = '🙈';
                } else {
                    input.type = 'password';
                    icon.textContent = '👁️';
                }
            });
        });
    }

    switchTab(tabName) {
        // 更新标签页状态
        document.querySelectorAll('.ess-auth__tab').forEach(tab => {
            tab.classList.remove('ess-auth__tab--active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('ess-auth__tab--active');

        // 显示对应面板
        document.querySelectorAll('.ess-auth__panel').forEach(panel => {
            panel.classList.remove('ess-auth__panel--active');
        });

        if (tabName === 'login') {
            document.getElementById('login-panel').classList.add('ess-auth__panel--active');
        } else if (tabName === 'register') {
            document.getElementById('register-panel').classList.add('ess-auth__panel--active');
        }
    }

    showForgotPassword() {
        document.querySelectorAll('.ess-auth__panel').forEach(panel => {
            panel.classList.remove('ess-auth__panel--active');
        });
        document.getElementById('forgot-password-panel').classList.add('ess-auth__panel--active');
        
        // 隐藏标签页
        document.querySelector('.ess-auth__tabs').style.display = 'none';
    }

    showLogin() {
        this.switchTab('login');
        document.querySelector('.ess-auth__tabs').style.display = 'flex';
    }

    async handleLogin(formData) {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const remember = document.getElementById('login-remember').checked;

        try {
            // 显示加载状态
            this.setButtonLoading('login-form', true);

            // 模拟API调用
            const result = await this.mockLogin(username, password);
            
            if (result.success) {
                // 保存登录状态
                if (remember) {
                    localStorage.setItem('ess_remember', 'true');
                    localStorage.setItem('ess_username', username);
                }
                
                // 保存用户信息
                sessionStorage.setItem('ess_user', JSON.stringify(result.user));
                sessionStorage.setItem('ess_token', result.token);

                // 显示成功消息
                this.showMessage('登录成功！正在跳转...', 'success');

                // 延迟跳转到主页面
                setTimeout(() => {
                    this.redirectToMain();
                }, 1000);
            } else {
                this.showMessage(result.message || '登录失败，请检查用户名和密码', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('登录失败，请稍后重试', 'error');
        } finally {
            this.setButtonLoading('login-form', false);
        }
    }

    async handleRegister(formData) {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const agreement = document.getElementById('register-agreement').checked;

        // 验证密码
        if (password !== confirmPassword) {
            this.showMessage('两次密码输入不一致', 'error');
            return;
        }

        if (!agreement) {
            this.showMessage('请同意服务条款和隐私政策', 'error');
            return;
        }

        try {
            this.setButtonLoading('register-form', true);

            const result = await this.mockRegister(username, email, password);
            
            if (result.success) {
                this.showMessage('注册成功！请查收邮箱验证邮件', 'success');
                setTimeout(() => {
                    this.switchTab('login');
                    document.getElementById('login-username').value = username;
                }, 2000);
            } else {
                this.showMessage(result.message || '注册失败，请稍后重试', 'error');
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showMessage('注册失败，请稍后重试', 'error');
        } finally {
            this.setButtonLoading('register-form', false);
        }
    }

    async handleForgotPassword(formData) {
        const email = document.getElementById('forgot-email').value;

        try {
            this.setButtonLoading('forgot-password-form', true);

            const result = await this.mockForgotPassword(email);
            
            if (result.success) {
                this.showMessage('重置密码链接已发送到您的邮箱', 'success');
                setTimeout(() => {
                    this.showLogin();
                }, 2000);
            } else {
                this.showMessage(result.message || '发送失败，请稍后重试', 'error');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            this.showMessage('发送失败，请稍后重试', 'error');
        } finally {
            this.setButtonLoading('forgot-password-form', false);
        }
    }

    // 模拟API调用
    async mockLogin(username, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (username === 'admin' && password === 'admin123') {
                    resolve({
                        success: true,
                        token: 'mock_token_' + Date.now(),
                        user: {
                            id: 1,
                            username: username,
                            email: 'admin@example.com',
                            avatar: '/src/assets/images/placeholder/avatar.png'
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: '用户名或密码错误'
                    });
                }
            }, 1000);
        });
    }

    async mockRegister(username, email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 模拟用户名已存在
                if (username === 'admin') {
                    resolve({
                        success: false,
                        message: '用户名已存在'
                    });
                } else {
                    resolve({
                        success: true,
                        message: '注册成功'
                    });
                }
            }, 1000);
        });
    }

    async mockForgotPassword(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: '重置链接已发送'
                });
            }, 1000);
        });
    }

    setButtonLoading(formId, loading) {
        const form = document.getElementById(formId);
        const button = form.querySelector('button[type="submit"]');
        
        if (loading) {
            button.disabled = true;
            button.textContent = '处理中...';
        } else {
            button.disabled = false;
            // 恢复原始文本
            const i18nKey = button.getAttribute('data-i18n');
            if (i18nKey && window.I18n) {
                button.textContent = window.I18n.t(i18nKey);
            }
        }
    }

    showMessage(message, type = 'info') {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `ess-message ess-message--${type}`;
        messageEl.textContent = message;

        // 添加到页面
        document.body.appendChild(messageEl);

        // 3秒后自动移除
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }

    toggleLanguage() {
        const currentLang = localStorage.getItem('ess_language') || 'zh-CN';
        const newLang = currentLang === 'zh-CN' ? 'en-US' : 'zh-CN';
        
        localStorage.setItem('ess_language', newLang);
        
        // 更新按钮文本
        const langText = document.getElementById('auth-lang-text');
        if (langText) {
            langText.textContent = newLang === 'zh-CN' ? '中文' : 'EN';
        }

        // 更新页面语言（如果有i18n模块的话）
        if (window.I18n) {
            window.I18n.setLanguage(newLang);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('ess_theme', newTheme);
        
        // 更新按钮图标
        const themeIcon = document.getElementById('auth-theme-icon');
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
        }
    }

    redirectToMain() {
        document.getElementById('ess-auth').style.display = 'none';
        document.getElementById('ess-main').style.display = 'block';
        
        // 触发主应用初始化
        if (window.App && window.App.init) {
            window.App.init();
        }
    }

    // 初始化时检查登录状态
    checkLoginStatus() {
        const token = sessionStorage.getItem('ess_token');
        const remember = localStorage.getItem('ess_remember');
        const savedUsername = localStorage.getItem('ess_username');

        if (token) {
            this.redirectToMain();
        } else {
            if (remember && savedUsername) {
                document.getElementById('login-username').value = savedUsername;
                document.getElementById('login-remember').checked = true;
            }
            document.getElementById('ess-auth').style.display = 'block';
        }
    }
}

// 导出模块
window.AuthModule = AuthModule;

})();