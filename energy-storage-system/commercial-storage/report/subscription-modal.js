// 报表订阅管理模态框组件
class SubscriptionModal {
    constructor() {
        this.modal = null;
        this.subscriptions = [];
        this.selectedReportType = 'all';
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        const modalHTML = `
            <div id="subscriptionModal" class="modal fade" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-envelope"></i> 报表订阅管理
                            </h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <!-- 新增订阅表单 -->
                            <div class="subscription-form mb-4">
                                <h6 class="mb-3">新增订阅</h6>
                                <form id="addSubscriptionForm">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>报表类型</label>
                                                <select class="form-control" id="reportType" required>
                                                    <option value="">请选择报表类型</option>
                                                    <option value="station">电站报表</option>
                                                    <option value="inverter">逆变器报表</option>
                                                    <option value="pcs">PCS报表</option>
                                                    <option value="storage">储能报表</option>
                                                    <option value="power">发电量报表</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>发送频率</label>
                                                <select class="form-control" id="frequency" required>
                                                    <option value="">请选择发送频率</option>
                                                    <option value="daily">日报表 (每日4:30)</option>
                                                    <option value="monthly">月报表 (每月1日4:30)</option>
                                                    <option value="yearly">年报表 (每年1月1日4:30)</option>
                                                    <option value="lifecycle">生命周期报表 (每年1月1日4:30)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>接收邮箱</label>
                                                <input type="email" class="form-control" id="email" 
                                                       placeholder="example@email.com" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>报表格式</label>
                                                <select class="form-control" id="format" required>
                                                    <option value="pdf">PDF</option>
                                                    <option value="excel">Excel</option>
                                                    <option value="both">PDF + Excel</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>订阅名称</label>
                                        <input type="text" class="form-control" id="subscriptionName" 
                                               placeholder="输入订阅名称" required>
                                    </div>
                                    <div class="form-group">
                                        <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" id="includeAnalysis">
                                            <label class="custom-control-label" for="includeAnalysis">
                                                包含智能分析报告
                                            </label>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-plus"></i> 添加订阅
                                    </button>
                                </form>
                            </div>

                            <hr>

                            <!-- 订阅列表 -->
                            <div class="subscription-list">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="mb-0">当前订阅</h6>
                                    <div class="btn-group btn-group-sm" role="group">
                                        <button type="button" class="btn btn-outline-secondary active" 
                                                data-filter="all">全部</button>
                                        <button type="button" class="btn btn-outline-secondary" 
                                                data-filter="active">启用</button>
                                        <button type="button" class="btn btn-outline-secondary" 
                                                data-filter="paused">暂停</button>
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>订阅名称</th>
                                                <th>报表类型</th>
                                                <th>发送频率</th>
                                                <th>接收邮箱</th>
                                                <th>状态</th>
                                                <th>下次发送</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="subscriptionTableBody">
                                            <!-- 动态生成 -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('subscriptionModal');
    }

    bindEvents() {
        // 表单提交
        const form = document.getElementById('addSubscriptionForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSubscription();
        });

        // 筛选按钮
        const filterButtons = this.modal.querySelectorAll('[data-filter]');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterSubscriptions(btn.dataset.filter);
            });
        });
    }

    addSubscription() {
        const formData = {
            id: Date.now(),
            name: document.getElementById('subscriptionName').value,
            reportType: document.getElementById('reportType').value,
            frequency: document.getElementById('frequency').value,
            email: document.getElementById('email').value,
            format: document.getElementById('format').value,
            includeAnalysis: document.getElementById('includeAnalysis').checked,
            status: 'active',
            createdAt: new Date().toISOString(),
            nextSend: this.calculateNextSend(document.getElementById('frequency').value)
        };

        this.subscriptions.push(formData);
        this.renderSubscriptions();
        document.getElementById('addSubscriptionForm').reset();
        showMessage('订阅添加成功', 'success');
    }

    calculateNextSend(frequency) {
        const now = new Date();
        const next = new Date();
        
        switch(frequency) {
            case 'daily':
                next.setDate(next.getDate() + 1);
                next.setHours(4, 30, 0, 0);
                break;
            case 'monthly':
                next.setMonth(next.getMonth() + 1);
                next.setDate(1);
                next.setHours(4, 30, 0, 0);
                break;
            case 'yearly':
            case 'lifecycle':
                next.setFullYear(next.getFullYear() + 1);
                next.setMonth(0);
                next.setDate(1);
                next.setHours(4, 30, 0, 0);
                break;
        }
        
        return next.toISOString();
    }

    renderSubscriptions() {
        const tbody = document.getElementById('subscriptionTableBody');
        const filteredSubscriptions = this.getFilteredSubscriptions();
        
        if (filteredSubscriptions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">暂无订阅记录</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredSubscriptions.map(sub => `
            <tr>
                <td>${sub.name}</td>
                <td>${this.getReportTypeName(sub.reportType)}</td>
                <td>${this.getFrequencyName(sub.frequency)}</td>
                <td>${sub.email}</td>
                <td>
                    <span class="badge badge-${sub.status === 'active' ? 'success' : 'warning'}">
                        ${sub.status === 'active' ? '启用' : '暂停'}
                    </span>
                </td>
                <td>${new Date(sub.nextSend).toLocaleString('zh-CN')}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="subscriptionModal.toggleStatus('${sub.id}')" 
                                title="${sub.status === 'active' ? '暂停' : '启用'}">
                            <i class="fas fa-${sub.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="subscriptionModal.editSubscription('${sub.id}')" 
                                title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="subscriptionModal.deleteSubscription('${sub.id}')" 
                                title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getFilteredSubscriptions() {
        const filter = this.modal.querySelector('[data-filter].active').dataset.filter;
        if (filter === 'all') return this.subscriptions;
        return this.subscriptions.filter(sub => 
            filter === 'active' ? sub.status === 'active' : sub.status === 'paused'
        );
    }

    getReportTypeName(type) {
        const types = {
            'station': '电站报表',
            'inverter': '逆变器报表',
            'pcs': 'PCS报表',
            'storage': '储能报表',
            'power': '发电量报表'
        };
        return types[type] || type;
    }

    getFrequencyName(frequency) {
        const frequencies = {
            'daily': '日报表',
            'monthly': '月报表',
            'yearly': '年报表',
            'lifecycle': '生命周期'
        };
        return frequencies[frequency] || frequency;
    }

    toggleStatus(id) {
        const sub = this.subscriptions.find(s => s.id == id);
        if (sub) {
            sub.status = sub.status === 'active' ? 'paused' : 'active';
            this.renderSubscriptions();
            showMessage(`订阅已${sub.status === 'active' ? '启用' : '暂停'}`, 'info');
        }
    }

    editSubscription(id) {
        // 实现编辑功能
        const sub = this.subscriptions.find(s => s.id == id);
        if (sub) {
            // 填充表单
            document.getElementById('subscriptionName').value = sub.name;
            document.getElementById('reportType').value = sub.reportType;
            document.getElementById('frequency').value = sub.frequency;
            document.getElementById('email').value = sub.email;
            document.getElementById('format').value = sub.format;
            document.getElementById('includeAnalysis').checked = sub.includeAnalysis;
            
            // 删除原订阅
            this.subscriptions = this.subscriptions.filter(s => s.id != id);
            this.renderSubscriptions();
        }
    }

    deleteSubscription(id) {
        if (confirm('确定要删除这个订阅吗？')) {
            this.subscriptions = this.subscriptions.filter(s => s.id != id);
            this.renderSubscriptions();
            showMessage('订阅已删除', 'success');
        }
    }

    filterSubscriptions(filter) {
        this.renderSubscriptions();
    }

    show() {
        $('#subscriptionModal').modal('show');
        this.loadSubscriptions();
    }

    loadSubscriptions() {
        // 模拟加载已有订阅
        this.subscriptions = [
            {
                id: 1,
                name: '电站月度运营报告',
                reportType: 'station',
                frequency: 'monthly',
                email: 'manager@company.com',
                format: 'pdf',
                includeAnalysis: true,
                status: 'active',
                createdAt: '2024-01-15T08:00:00Z',
                nextSend: this.calculateNextSend('monthly')
            },
            {
                id: 2,
                name: '逆变器日常监控',
                reportType: 'inverter',
                frequency: 'daily',
                email: 'tech@company.com',
                format: 'excel',
                includeAnalysis: false,
                status: 'active',
                createdAt: '2024-01-20T10:00:00Z',
                nextSend: this.calculateNextSend('daily')
            }
        ];
        this.renderSubscriptions();
    }
}

// 创建全局实例
const subscriptionModal = new SubscriptionModal();