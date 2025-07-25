// 报表订阅管理模态框组件 - 完整闭环版本
class SubscriptionModalV2 {
    constructor() {
        this.modal = null;
        this.subscriptions = [];
        this.history = [];
        this.templates = [];
        this.currentStep = 1;
        this.subscriptionData = {};
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
        this.loadData();
    }

    createModal() {
        const modalHTML = `
            <div id="subscriptionModalV2" class="modal fade" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-envelope"></i> 报表订阅中心
                            </h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <!-- 标签页导航 -->
                            <ul class="nav nav-tabs mb-4" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" data-toggle="tab" href="#newSubscription">
                                        <i class="fas fa-plus-circle"></i> 新建订阅
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-toggle="tab" href="#mySubscriptions">
                                        <i class="fas fa-list"></i> 我的订阅
                                        <span class="badge badge-primary ml-1" id="subscriptionCount">0</span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-toggle="tab" href="#subscriptionHistory">
                                        <i class="fas fa-history"></i> 发送记录
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-toggle="tab" href="#subscriptionSettings">
                                        <i class="fas fa-cog"></i> 订阅设置
                                    </a>
                                </li>
                            </ul>

                            <!-- 标签页内容 -->
                            <div class="tab-content">
                                <!-- 新建订阅 -->
                                <div class="tab-pane fade show active" id="newSubscription">
                                    <div class="subscription-wizard">
                                        <!-- 步骤指示器 -->
                                        <div class="wizard-steps mb-4">
                                            <div class="step active" data-step="1">
                                                <div class="step-number">1</div>
                                                <div class="step-title">选择报表</div>
                                            </div>
                                            <div class="step" data-step="2">
                                                <div class="step-number">2</div>
                                                <div class="step-title">配置参数</div>
                                            </div>
                                            <div class="step" data-step="3">
                                                <div class="step-number">3</div>
                                                <div class="step-title">设置接收</div>
                                            </div>
                                            <div class="step" data-step="4">
                                                <div class="step-number">4</div>
                                                <div class="step-title">预览确认</div>
                                            </div>
                                        </div>

                                        <!-- 步骤内容 -->
                                        <div class="wizard-content">
                                            <!-- 步骤1：选择报表类型 -->
                                            <div class="step-content active" data-step="1">
                                                <h6 class="mb-3">选择要订阅的报表类型</h6>
                                                <div class="report-type-grid">
                                                    <div class="report-type-card" data-type="station">
                                                        <div class="report-icon">📊</div>
                                                        <h6>电站报表</h6>
                                                        <p class="text-muted small">电站运行综合数据分析报告</p>
                                                    </div>
                                                    <div class="report-type-card" data-type="inverter">
                                                        <div class="report-icon">⚡</div>
                                                        <h6>逆变器报表</h6>
                                                        <p class="text-muted small">逆变器设备性能监控报告</p>
                                                    </div>
                                                    <div class="report-type-card" data-type="pcs">
                                                        <div class="report-icon">🔌</div>
                                                        <h6>PCS报表</h6>
                                                        <p class="text-muted small">储能变流器运行数据报告</p>
                                                    </div>
                                                    <div class="report-type-card" data-type="storage">
                                                        <div class="report-icon">🔋</div>
                                                        <h6>储能报表</h6>
                                                        <p class="text-muted small">电池充放电统计分析报告</p>
                                                    </div>
                                                    <div class="report-type-card" data-type="power">
                                                        <div class="report-icon">💡</div>
                                                        <h6>发电量报表</h6>
                                                        <p class="text-muted small">发电量性能与趋势报告</p>
                                                    </div>
                                                    <div class="report-type-card" data-type="custom">
                                                        <div class="report-icon">📋</div>
                                                        <h6>自定义报表</h6>
                                                        <p class="text-muted small">根据需求定制报表内容</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- 步骤2：配置参数 -->
                                            <div class="step-content" data-step="2">
                                                <h6 class="mb-3">配置报表参数</h6>
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>订阅名称 <span class="text-danger">*</span></label>
                                                            <input type="text" class="form-control" id="subName" 
                                                                   placeholder="例如：北京电站月度运营报告">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>发送频率 <span class="text-danger">*</span></label>
                                                            <select class="form-control" id="frequency">
                                                                <option value="">请选择发送频率</option>
                                                                <option value="daily">每日 (每天 07:00)</option>
                                                                <option value="weekly">每周 (每周一 08:00)</option>
                                                                <option value="monthly">每月 (每月1日 08:00)</option>
                                                                <option value="quarterly">每季度 (季度首日 08:00)</option>
                                                                <option value="yearly">每年 (每年1月1日 08:00)</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>报表格式 <span class="text-danger">*</span></label>
                                                            <div class="format-options">
                                                                <label class="format-option">
                                                                    <input type="checkbox" name="format" value="pdf" checked>
                                                                    <span class="format-icon">📄</span>
                                                                    <span>PDF</span>
                                                                </label>
                                                                <label class="format-option">
                                                                    <input type="checkbox" name="format" value="excel">
                                                                    <span class="format-icon">📊</span>
                                                                    <span>Excel</span>
                                                                </label>
                                                                <label class="format-option">
                                                                    <input type="checkbox" name="format" value="word">
                                                                    <span class="format-icon">📝</span>
                                                                    <span>Word</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>数据范围</label>
                                                            <select class="form-control" id="dataRange">
                                                                <option value="last_period">上一周期</option>
                                                                <option value="last_30_days">最近30天</option>
                                                                <option value="last_90_days">最近90天</option>
                                                                <option value="custom">自定义范围</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="form-group">
                                                    <label>报表内容选项</label>
                                                    <div class="content-options">
                                                        <div class="custom-control custom-checkbox">
                                                            <input type="checkbox" class="custom-control-input" id="includeCharts" checked>
                                                            <label class="custom-control-label" for="includeCharts">
                                                                包含图表分析
                                                            </label>
                                                        </div>
                                                        <div class="custom-control custom-checkbox">
                                                            <input type="checkbox" class="custom-control-input" id="includeAnalysis" checked>
                                                            <label class="custom-control-label" for="includeAnalysis">
                                                                包含AI智能分析
                                                            </label>
                                                        </div>
                                                        <div class="custom-control custom-checkbox">
                                                            <input type="checkbox" class="custom-control-input" id="includeRawData">
                                                            <label class="custom-control-label" for="includeRawData">
                                                                包含原始数据表
                                                            </label>
                                                        </div>
                                                        <div class="custom-control custom-checkbox">
                                                            <input type="checkbox" class="custom-control-input" id="includeSummary" checked>
                                                            <label class="custom-control-label" for="includeSummary">
                                                                包含执行摘要
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- 步骤3：设置接收 -->
                                            <div class="step-content" data-step="3">
                                                <h6 class="mb-3">设置接收方式</h6>
                                                
                                                <div class="form-group">
                                                    <label>接收邮箱 <span class="text-danger">*</span></label>
                                                    <div class="email-input-group">
                                                        <input type="email" class="form-control" id="primaryEmail" 
                                                               placeholder="主要接收邮箱">
                                                        <button type="button" class="btn btn-sm btn-outline-primary" 
                                                                onclick="subscriptionModalV2.addEmailField()">
                                                            <i class="fas fa-plus"></i> 添加抄送
                                                        </button>
                                                    </div>
                                                    <div id="additionalEmails" class="mt-2"></div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>邮件主题模板</label>
                                                            <input type="text" class="form-control" id="emailSubject"
                                                                   value="[{reportName}] {period} - 自动报表"
                                                                   placeholder="支持变量：{reportName}, {period}, {date}">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>发送时间</label>
                                                            <input type="time" class="form-control" id="sendTime" value="08:00">
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="form-group">
                                                    <label>高级设置</label>
                                                    <div class="advanced-settings">
                                                        <div class="custom-control custom-checkbox">
                                                            <input type="checkbox" class="custom-control-input" id="compressAttachment">
                                                            <label class="custom-control-label" for="compressAttachment">
                                                                压缩附件（减小邮件大小）
                                                            </label>
                                                        </div>
                                                        <div class="custom-control custom-checkbox">
                                                            <input type="checkbox" class="custom-control-input" id="enableRetry" checked>
                                                            <label class="custom-control-label" for="enableRetry">
                                                                发送失败自动重试（最多3次）
                                                            </label>
                                                        </div>
                                                        <div class="custom-control custom-checkbox">
                                                            <input type="checkbox" class="custom-control-input" id="notifyFailure" checked>
                                                            <label class="custom-control-label" for="notifyFailure">
                                                                发送失败时通知我
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="alert alert-info">
                                                    <i class="fas fa-info-circle"></i>
                                                    <strong>提示：</strong>
                                                    <ul class="mb-0 mt-2">
                                                        <li>报表将在指定时间自动生成并发送</li>
                                                        <li>如遇节假日，将顺延至下一个工作日</li>
                                                        <li>大型报表可能需要几分钟生成时间</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <!-- 步骤4：预览确认 -->
                                            <div class="step-content" data-step="4">
                                                <h6 class="mb-3">确认订阅信息</h6>
                                                
                                                <div class="subscription-preview">
                                                    <div class="preview-section">
                                                        <h6 class="preview-title">基本信息</h6>
                                                        <table class="preview-table">
                                                            <tr>
                                                                <td>订阅名称：</td>
                                                                <td id="previewName">-</td>
                                                            </tr>
                                                            <tr>
                                                                <td>报表类型：</td>
                                                                <td id="previewType">-</td>
                                                            </tr>
                                                            <tr>
                                                                <td>发送频率：</td>
                                                                <td id="previewFrequency">-</td>
                                                            </tr>
                                                            <tr>
                                                                <td>报表格式：</td>
                                                                <td id="previewFormat">-</td>
                                                            </tr>
                                                        </table>
                                                    </div>

                                                    <div class="preview-section">
                                                        <h6 class="preview-title">接收设置</h6>
                                                        <table class="preview-table">
                                                            <tr>
                                                                <td>接收邮箱：</td>
                                                                <td id="previewEmails">-</td>
                                                            </tr>
                                                            <tr>
                                                                <td>发送时间：</td>
                                                                <td id="previewTime">-</td>
                                                            </tr>
                                                            <tr>
                                                                <td>下次发送：</td>
                                                                <td id="previewNextSend">-</td>
                                                            </tr>
                                                        </table>
                                                    </div>

                                                    <div class="preview-section">
                                                        <h6 class="preview-title">邮件预览</h6>
                                                        <div class="email-preview">
                                                            <div class="email-header">
                                                                <strong>主题：</strong> <span id="previewSubject">-</span>
                                                            </div>
                                                            <div class="email-body">
                                                                <p>尊敬的用户：</p>
                                                                <p>您订阅的报表已生成，请查收附件。</p>
                                                                <p>报表概要：</p>
                                                                <ul>
                                                                    <li>报告周期：<span id="previewPeriod">-</span></li>
                                                                    <li>生成时间：<span id="previewGenTime">-</span></li>
                                                                    <li>数据范围：<span id="previewDataRange">-</span></li>
                                                                </ul>
                                                                <p>如有任何问题，请联系系统管理员。</p>
                                                                <p>此邮件由系统自动发送，请勿回复。</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="custom-control custom-checkbox mt-3">
                                                    <input type="checkbox" class="custom-control-input" id="agreeTerm">
                                                    <label class="custom-control-label" for="agreeTerm">
                                                        我已确认以上信息无误，同意创建订阅任务
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- 向导按钮 -->
                                        <div class="wizard-buttons mt-4">
                                            <button type="button" class="btn btn-secondary" onclick="subscriptionModalV2.prevStep()" 
                                                    id="prevBtn" style="display: none;">
                                                <i class="fas fa-arrow-left"></i> 上一步
                                            </button>
                                            <button type="button" class="btn btn-primary ml-auto" onclick="subscriptionModalV2.nextStep()" 
                                                    id="nextBtn">
                                                下一步 <i class="fas fa-arrow-right"></i>
                                            </button>
                                            <button type="button" class="btn btn-success ml-auto" onclick="subscriptionModalV2.createSubscription()" 
                                                    id="createBtn" style="display: none;">
                                                <i class="fas fa-check"></i> 创建订阅
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 我的订阅 -->
                                <div class="tab-pane fade" id="mySubscriptions">
                                    <div class="subscription-toolbar mb-3">
                                        <div class="toolbar-left">
                                            <select class="form-control form-control-sm" style="width: 150px;">
                                                <option value="all">全部状态</option>
                                                <option value="active">已启用</option>
                                                <option value="paused">已暂停</option>
                                                <option value="expired">已过期</option>
                                            </select>
                                        </div>
                                        <div class="toolbar-right">
                                            <button class="btn btn-sm btn-outline-danger" onclick="subscriptionModalV2.batchDelete()">
                                                <i class="fas fa-trash"></i> 批量删除
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="subscription-list">
                                        <div class="table-responsive">
                                            <table class="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th width="30">
                                                            <input type="checkbox" id="selectAll">
                                                        </th>
                                                        <th>订阅名称</th>
                                                        <th>报表类型</th>
                                                        <th>发送频率</th>
                                                        <th>接收邮箱</th>
                                                        <th>状态</th>
                                                        <th>下次发送</th>
                                                        <th>创建时间</th>
                                                        <th width="120">操作</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="subscriptionList">
                                                    <!-- 动态生成 -->
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 发送记录 -->
                                <div class="tab-pane fade" id="subscriptionHistory">
                                    <div class="history-filter mb-3">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <select class="form-control form-control-sm">
                                                    <option value="">全部订阅</option>
                                                    <option value="1">北京电站月度报告</option>
                                                    <option value="2">设备日常监控报表</option>
                                                </select>
                                            </div>
                                            <div class="col-md-3">
                                                <select class="form-control form-control-sm">
                                                    <option value="">全部状态</option>
                                                    <option value="success">发送成功</option>
                                                    <option value="failed">发送失败</option>
                                                    <option value="pending">等待发送</option>
                                                </select>
                                            </div>
                                            <div class="col-md-3">
                                                <input type="date" class="form-control form-control-sm" placeholder="开始日期">
                                            </div>
                                            <div class="col-md-3">
                                                <input type="date" class="form-control form-control-sm" placeholder="结束日期">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="history-list">
                                        <div class="table-responsive">
                                            <table class="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>订阅名称</th>
                                                        <th>发送时间</th>
                                                        <th>接收邮箱</th>
                                                        <th>报表文件</th>
                                                        <th>文件大小</th>
                                                        <th>状态</th>
                                                        <th>耗时</th>
                                                        <th width="100">操作</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="historyList">
                                                    <!-- 动态生成 -->
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 订阅设置 -->
                                <div class="tab-pane fade" id="subscriptionSettings">
                                    <div class="settings-section">
                                        <h6 class="mb-3">全局设置</h6>
                                        
                                        <div class="form-group">
                                            <label>默认发送时间</label>
                                            <input type="time" class="form-control" value="08:00" style="width: 200px;">
                                            <small class="text-muted">新建订阅时的默认发送时间</small>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label>邮件发送限制</label>
                                            <div class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" id="enableLimit" checked>
                                                <label class="custom-control-label" for="enableLimit">
                                                    启用发送限制（每日最多发送 <input type="number" value="100" style="width: 60px;"> 封邮件）
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label>失败处理</label>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <label class="small">重试次数</label>
                                                    <select class="form-control">
                                                        <option value="1">1次</option>
                                                        <option value="3" selected>3次</option>
                                                        <option value="5">5次</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="small">重试间隔</label>
                                                    <select class="form-control">
                                                        <option value="5">5分钟</option>
                                                        <option value="10" selected>10分钟</option>
                                                        <option value="30">30分钟</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <hr>
                                        
                                        <h6 class="mb-3">邮件服务器配置</h6>
                                        
                                        <div class="alert alert-warning">
                                            <i class="fas fa-exclamation-triangle"></i>
                                            修改邮件服务器配置需要管理员权限
                                        </div>
                                        
                                        <div class="form-group">
                                            <label>SMTP服务器</label>
                                            <input type="text" class="form-control" value="smtp.company.com" readonly>
                                        </div>
                                        
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>端口</label>
                                                    <input type="text" class="form-control" value="587" readonly>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>加密方式</label>
                                                    <input type="text" class="form-control" value="TLS" readonly>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button class="btn btn-primary" onclick="subscriptionModalV2.testEmailConnection()">
                                            <i class="fas fa-paper-plane"></i> 测试邮件连接
                                        </button>
                                    </div>
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

        // 添加样式
        const styleHTML = `
            <style>
                /* 向导步骤样式 */
                .wizard-steps {
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                }
                
                .wizard-steps::before {
                    content: '';
                    position: absolute;
                    top: 20px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #e5e7eb;
                    z-index: -1;
                }
                
                .step {
                    text-align: center;
                    position: relative;
                }
                
                .step-number {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #e5e7eb;
                    color: #6b7280;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 0.5rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .step.active .step-number {
                    background: #3b82f6;
                    color: white;
                }
                
                .step.completed .step-number {
                    background: #10b981;
                    color: white;
                }
                
                .step-title {
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                
                .step.active .step-title {
                    color: #1f2937;
                    font-weight: 600;
                }
                
                /* 步骤内容 */
                .step-content {
                    display: none;
                    animation: fadeIn 0.3s ease;
                }
                
                .step-content.active {
                    display: block;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                /* 报表类型卡片 */
                .report-type-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                }
                
                .report-type-card {
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 1.5rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .report-type-card:hover {
                    border-color: #3b82f6;
                    background: #f0f9ff;
                }
                
                .report-type-card.selected {
                    border-color: #3b82f6;
                    background: #eff6ff;
                }
                
                .report-icon {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }
                
                /* 格式选项 */
                .format-options {
                    display: flex;
                    gap: 1rem;
                }
                
                .format-option {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .format-option:hover {
                    border-color: #3b82f6;
                    background: #f0f9ff;
                }
                
                .format-option input[type="checkbox"]:checked + .format-icon + span {
                    color: #3b82f6;
                    font-weight: 600;
                }
                
                /* 邮件输入 */
                .email-input-group {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .email-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.25rem 0.75rem;
                    background: #e5e7eb;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    margin: 0.25rem;
                }
                
                .email-tag .remove {
                    cursor: pointer;
                    color: #6b7280;
                }
                
                .email-tag .remove:hover {
                    color: #ef4444;
                }
                
                /* 预览样式 */
                .subscription-preview {
                    background: #f8fafc;
                    border-radius: 8px;
                    padding: 1.5rem;
                }
                
                .preview-section {
                    margin-bottom: 1.5rem;
                }
                
                .preview-section:last-child {
                    margin-bottom: 0;
                }
                
                .preview-title {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.75rem;
                }
                
                .preview-table {
                    width: 100%;
                }
                
                .preview-table td {
                    padding: 0.5rem 0;
                    font-size: 0.875rem;
                }
                
                .preview-table td:first-child {
                    color: #6b7280;
                    width: 120px;
                }
                
                /* 邮件预览 */
                .email-preview {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    padding: 1rem;
                }
                
                .email-header {
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid #e5e7eb;
                    margin-bottom: 1rem;
                }
                
                .email-body {
                    font-size: 0.875rem;
                    line-height: 1.6;
                }
                
                /* 向导按钮 */
                .wizard-buttons {
                    display: flex;
                    justify-content: space-between;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 1rem;
                }
                
                /* 订阅列表 */
                .subscription-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                /* 历史记录状态 */
                .status-success {
                    color: #10b981;
                }
                
                .status-failed {
                    color: #ef4444;
                }
                
                .status-pending {
                    color: #f59e0b;
                }
                
                /* 设置区域 */
                .settings-section {
                    max-width: 600px;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styleHTML);
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('subscriptionModalV2');
    }

    bindEvents() {
        // 报表类型选择
        document.querySelectorAll('.report-type-card').forEach(card => {
            card.addEventListener('click', (e) => {
                document.querySelectorAll('.report-type-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.subscriptionData.reportType = card.dataset.type;
            });
        });

        // 全选功能
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                document.querySelectorAll('.subscription-checkbox').forEach(cb => {
                    cb.checked = e.target.checked;
                });
            });
        }
    }

    // 下一步
    nextStep() {
        if (this.validateStep(this.currentStep)) {
            if (this.currentStep < 4) {
                this.currentStep++;
                this.updateWizard();
            }
        }
    }

    // 上一步
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateWizard();
        }
    }

    // 更新向导界面
    updateWizard() {
        // 更新步骤指示器
        document.querySelectorAll('.step').forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            
            if (stepNum === this.currentStep) {
                step.classList.add('active');
            } else if (stepNum < this.currentStep) {
                step.classList.add('completed');
                step.querySelector('.step-number').innerHTML = '<i class="fas fa-check"></i>';
            }
        });

        // 更新步骤内容
        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.remove('active');
            if (parseInt(content.dataset.step) === this.currentStep) {
                content.classList.add('active');
            }
        });

        // 更新按钮
        document.getElementById('prevBtn').style.display = this.currentStep > 1 ? 'inline-block' : 'none';
        document.getElementById('nextBtn').style.display = this.currentStep < 4 ? 'inline-block' : 'none';
        document.getElementById('createBtn').style.display = this.currentStep === 4 ? 'inline-block' : 'none';

        // 如果是最后一步，更新预览
        if (this.currentStep === 4) {
            this.updatePreview();
        }
    }

    // 验证步骤
    validateStep(step) {
        switch (step) {
            case 1:
                if (!this.subscriptionData.reportType) {
                    showMessage('请选择报表类型', 'error');
                    return false;
                }
                break;
            case 2:
                const name = document.getElementById('subName').value;
                const frequency = document.getElementById('frequency').value;
                const formats = document.querySelectorAll('input[name="format"]:checked');
                
                if (!name || !frequency || formats.length === 0) {
                    showMessage('请填写必填项', 'error');
                    return false;
                }
                
                this.subscriptionData.name = name;
                this.subscriptionData.frequency = frequency;
                this.subscriptionData.formats = Array.from(formats).map(f => f.value);
                break;
            case 3:
                const email = document.getElementById('primaryEmail').value;
                if (!email) {
                    showMessage('请填写接收邮箱', 'error');
                    return false;
                }
                this.subscriptionData.email = email;
                break;
        }
        return true;
    }

    // 更新预览
    updatePreview() {
        document.getElementById('previewName').textContent = this.subscriptionData.name;
        document.getElementById('previewType').textContent = this.getReportTypeName(this.subscriptionData.reportType);
        document.getElementById('previewFrequency').textContent = this.getFrequencyName(this.subscriptionData.frequency);
        document.getElementById('previewFormat').textContent = this.subscriptionData.formats.join(', ').toUpperCase();
        document.getElementById('previewEmails').textContent = this.subscriptionData.email;
        document.getElementById('previewTime').textContent = document.getElementById('sendTime').value || '08:00';
        document.getElementById('previewNextSend').textContent = this.calculateNextSend(this.subscriptionData.frequency);
        
        // 更新邮件预览
        const subject = document.getElementById('emailSubject').value
            .replace('{reportName}', this.subscriptionData.name)
            .replace('{period}', '2024年1月')
            .replace('{date}', new Date().toLocaleDateString());
        document.getElementById('previewSubject').textContent = subject;
    }

    // 添加邮箱输入框
    addEmailField() {
        const container = document.getElementById('additionalEmails');
        const emailDiv = document.createElement('div');
        emailDiv.className = 'input-group mb-2';
        emailDiv.innerHTML = `
            <input type="email" class="form-control" placeholder="抄送邮箱">
            <div class="input-group-append">
                <button class="btn btn-outline-danger" type="button" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        container.appendChild(emailDiv);
    }

    // 创建订阅
    createSubscription() {
        if (!document.getElementById('agreeTerm').checked) {
            showMessage('请确认订阅信息', 'error');
            return;
        }

        // 收集所有数据
        const subscription = {
            ...this.subscriptionData,
            id: Date.now(),
            status: 'active',
            createdAt: new Date().toISOString(),
            nextSend: this.calculateNextSend(this.subscriptionData.frequency),
            additionalEmails: Array.from(document.querySelectorAll('#additionalEmails input')).map(i => i.value).filter(v => v),
            settings: {
                includeCharts: document.getElementById('includeCharts').checked,
                includeAnalysis: document.getElementById('includeAnalysis').checked,
                includeRawData: document.getElementById('includeRawData').checked,
                includeSummary: document.getElementById('includeSummary').checked,
                compressAttachment: document.getElementById('compressAttachment').checked,
                enableRetry: document.getElementById('enableRetry').checked,
                notifyFailure: document.getElementById('notifyFailure').checked,
                sendTime: document.getElementById('sendTime').value,
                dataRange: document.getElementById('dataRange').value
            }
        };

        // 保存订阅
        this.subscriptions.push(subscription);
        this.saveSubscriptions();
        
        // 显示成功消息
        showMessage('订阅创建成功！', 'success');
        
        // 切换到我的订阅标签
        $('a[href="#mySubscriptions"]').tab('show');
        this.renderSubscriptions();
        
        // 重置向导
        this.resetWizard();
    }

    // 重置向导
    resetWizard() {
        this.currentStep = 1;
        this.subscriptionData = {};
        document.getElementById('addSubscriptionForm').reset();
        document.querySelectorAll('.report-type-card').forEach(c => c.classList.remove('selected'));
        this.updateWizard();
    }

    // 加载数据
    loadData() {
        // 从localStorage加载订阅数据
        const saved = localStorage.getItem('subscriptions');
        if (saved) {
            this.subscriptions = JSON.parse(saved);
        } else {
            // 模拟数据
            this.subscriptions = [
                {
                    id: 1,
                    name: '北京电站月度运营报告',
                    reportType: 'station',
                    frequency: 'monthly',
                    email: 'manager@company.com',
                    formats: ['pdf', 'excel'],
                    status: 'active',
                    createdAt: '2024-01-15T08:00:00Z',
                    nextSend: this.calculateNextSend('monthly')
                },
                {
                    id: 2,
                    name: '设备日常监控报表',
                    reportType: 'inverter',
                    frequency: 'daily',
                    email: 'tech@company.com',
                    formats: ['excel'],
                    status: 'active',
                    createdAt: '2024-01-20T10:00:00Z',
                    nextSend: this.calculateNextSend('daily')
                }
            ];
        }
        
        // 加载历史记录
        this.loadHistory();
        
        // 更新界面
        this.renderSubscriptions();
        this.updateSubscriptionCount();
    }

    // 加载历史记录
    loadHistory() {
        // 模拟历史数据
        this.history = [
            {
                id: 1,
                subscriptionId: 1,
                subscriptionName: '北京电站月度运营报告',
                sendTime: '2024-01-01 08:00:00',
                email: 'manager@company.com',
                fileName: '北京电站月度运营报告_202401.pdf',
                fileSize: '2.3MB',
                status: 'success',
                duration: '45s'
            },
            {
                id: 2,
                subscriptionId: 2,
                subscriptionName: '设备日常监控报表',
                sendTime: '2024-01-24 07:00:00',
                email: 'tech@company.com',
                fileName: '设备日常监控报表_20240124.xlsx',
                fileSize: '1.5MB',
                status: 'success',
                duration: '23s'
            },
            {
                id: 3,
                subscriptionId: 1,
                subscriptionName: '北京电站月度运营报告',
                sendTime: '2023-12-01 08:00:00',
                email: 'manager@company.com',
                fileName: '北京电站月度运营报告_202312.pdf',
                fileSize: '2.1MB',
                status: 'failed',
                duration: '-',
                error: '邮件服务器连接失败'
            }
        ];
        
        this.renderHistory();
    }

    // 渲染订阅列表
    renderSubscriptions() {
        const tbody = document.getElementById('subscriptionList');
        if (!tbody) return;
        
        if (this.subscriptions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center text-muted">暂无订阅记录</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.subscriptions.map(sub => `
            <tr>
                <td><input type="checkbox" class="subscription-checkbox" value="${sub.id}"></td>
                <td>${sub.name}</td>
                <td>${this.getReportTypeName(sub.reportType)}</td>
                <td>${this.getFrequencyName(sub.frequency)}</td>
                <td>${sub.email}</td>
                <td>
                    <span class="badge badge-${sub.status === 'active' ? 'success' : 'warning'}">
                        ${sub.status === 'active' ? '已启用' : '已暂停'}
                    </span>
                </td>
                <td>${new Date(sub.nextSend).toLocaleString('zh-CN')}</td>
                <td>${new Date(sub.createdAt).toLocaleDateString('zh-CN')}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="subscriptionModalV2.toggleStatus(${sub.id})" 
                                title="${sub.status === 'active' ? '暂停' : '启用'}">
                            <i class="fas fa-${sub.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="subscriptionModalV2.editSubscription(${sub.id})" 
                                title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="subscriptionModalV2.testSend(${sub.id})" 
                                title="立即发送">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="subscriptionModalV2.deleteSubscription(${sub.id})" 
                                title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 渲染历史记录
    renderHistory() {
        const tbody = document.getElementById('historyList');
        if (!tbody) return;
        
        if (this.history.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted">暂无发送记录</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.history.map(record => `
            <tr>
                <td>${record.subscriptionName}</td>
                <td>${record.sendTime}</td>
                <td>${record.email}</td>
                <td>${record.fileName}</td>
                <td>${record.fileSize}</td>
                <td>
                    <span class="status-${record.status}">
                        <i class="fas fa-${record.status === 'success' ? 'check-circle' : 'times-circle'}"></i>
                        ${record.status === 'success' ? '成功' : '失败'}
                    </span>
                    ${record.error ? `<br><small class="text-danger">${record.error}</small>` : ''}
                </td>
                <td>${record.duration}</td>
                <td>
                    ${record.status === 'success' ? `
                        <button class="btn btn-sm btn-outline-primary" onclick="subscriptionModalV2.downloadReport(${record.id})">
                            <i class="fas fa-download"></i> 下载
                        </button>
                    ` : `
                        <button class="btn btn-sm btn-outline-warning" onclick="subscriptionModalV2.retry(${record.id})">
                            <i class="fas fa-redo"></i> 重试
                        </button>
                    `}
                </td>
            </tr>
        `).join('');
    }

    // 更新订阅数量
    updateSubscriptionCount() {
        const count = this.subscriptions.filter(s => s.status === 'active').length;
        document.getElementById('subscriptionCount').textContent = count;
    }

    // 获取报表类型名称
    getReportTypeName(type) {
        const types = {
            'station': '电站报表',
            'inverter': '逆变器报表',
            'pcs': 'PCS报表',
            'storage': '储能报表',
            'power': '发电量报表',
            'custom': '自定义报表'
        };
        return types[type] || type;
    }

    // 获取频率名称
    getFrequencyName(frequency) {
        const frequencies = {
            'daily': '每日',
            'weekly': '每周',
            'monthly': '每月',
            'quarterly': '每季度',
            'yearly': '每年'
        };
        return frequencies[frequency] || frequency;
    }

    // 计算下次发送时间
    calculateNextSend(frequency) {
        const now = new Date();
        const next = new Date();
        
        switch(frequency) {
            case 'daily':
                next.setDate(next.getDate() + 1);
                next.setHours(8, 0, 0, 0);
                break;
            case 'weekly':
                next.setDate(next.getDate() + (7 - next.getDay() + 1) % 7);
                next.setHours(8, 0, 0, 0);
                break;
            case 'monthly':
                next.setMonth(next.getMonth() + 1);
                next.setDate(1);
                next.setHours(8, 0, 0, 0);
                break;
            case 'quarterly':
                next.setMonth(Math.floor(next.getMonth() / 3) * 3 + 3);
                next.setDate(1);
                next.setHours(8, 0, 0, 0);
                break;
            case 'yearly':
                next.setFullYear(next.getFullYear() + 1);
                next.setMonth(0);
                next.setDate(1);
                next.setHours(8, 0, 0, 0);
                break;
        }
        
        return next.toISOString();
    }

    // 切换状态
    toggleStatus(id) {
        const sub = this.subscriptions.find(s => s.id === id);
        if (sub) {
            sub.status = sub.status === 'active' ? 'paused' : 'active';
            this.saveSubscriptions();
            this.renderSubscriptions();
            this.updateSubscriptionCount();
            showMessage(`订阅已${sub.status === 'active' ? '启用' : '暂停'}`, 'info');
        }
    }

    // 测试发送
    testSend(id) {
        const sub = this.subscriptions.find(s => s.id === id);
        if (sub) {
            showMessage('正在发送测试邮件...', 'info');
            
            // 模拟发送
            setTimeout(() => {
                showMessage('测试邮件发送成功！', 'success');
                
                // 添加到历史记录
                this.history.unshift({
                    id: Date.now(),
                    subscriptionId: sub.id,
                    subscriptionName: sub.name,
                    sendTime: new Date().toLocaleString('zh-CN'),
                    email: sub.email,
                    fileName: `${sub.name}_测试.${sub.formats[0]}`,
                    fileSize: '1.2MB',
                    status: 'success',
                    duration: '15s'
                });
                
                this.renderHistory();
            }, 2000);
        }
    }

    // 删除订阅
    deleteSubscription(id) {
        if (confirm('确定要删除这个订阅吗？删除后将无法恢复。')) {
            this.subscriptions = this.subscriptions.filter(s => s.id !== id);
            this.saveSubscriptions();
            this.renderSubscriptions();
            this.updateSubscriptionCount();
            showMessage('订阅已删除', 'success');
        }
    }

    // 批量删除
    batchDelete() {
        const selected = Array.from(document.querySelectorAll('.subscription-checkbox:checked')).map(cb => parseInt(cb.value));
        
        if (selected.length === 0) {
            showMessage('请选择要删除的订阅', 'error');
            return;
        }
        
        if (confirm(`确定要删除选中的 ${selected.length} 个订阅吗？`)) {
            this.subscriptions = this.subscriptions.filter(s => !selected.includes(s.id));
            this.saveSubscriptions();
            this.renderSubscriptions();
            this.updateSubscriptionCount();
            showMessage(`已删除 ${selected.length} 个订阅`, 'success');
        }
    }

    // 下载报表
    downloadReport(id) {
        showMessage('开始下载报表...', 'info');
        // 实际实现中这里会调用下载接口
    }

    // 重试发送
    retry(id) {
        showMessage('正在重新发送...', 'info');
        
        setTimeout(() => {
            // 更新历史记录状态
            const record = this.history.find(h => h.id === id);
            if (record) {
                record.status = 'success';
                record.duration = '18s';
                record.error = null;
                this.renderHistory();
                showMessage('重新发送成功！', 'success');
            }
        }, 2000);
    }

    // 测试邮件连接
    testEmailConnection() {
        showMessage('正在测试邮件服务器连接...', 'info');
        
        setTimeout(() => {
            showMessage('邮件服务器连接正常', 'success');
        }, 1500);
    }

    // 保存订阅到localStorage
    saveSubscriptions() {
        localStorage.setItem('subscriptions', JSON.stringify(this.subscriptions));
    }

    // 加载邮件模板
    loadEmailTemplates() {
        // 这里可以从服务器加载邮件模板
    }

    // 显示模态框
    show() {
        $('#subscriptionModalV2').modal('show');
        this.loadData();
    }
}

// 创建全局实例
let subscriptionModalV2;

// 确保DOM加载完成后再初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        subscriptionModalV2 = new SubscriptionModalV2();
        window.subscriptionModalV2 = subscriptionModalV2;
    });
} else {
    subscriptionModalV2 = new SubscriptionModalV2();
    window.subscriptionModalV2 = subscriptionModalV2;
}

// 辅助函数 - 显示消息提示
function showMessage(message, type) {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 99999; min-width: 250px;';
    toast.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert">
            <span>&times;</span>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}