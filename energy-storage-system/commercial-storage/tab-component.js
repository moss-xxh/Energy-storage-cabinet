// Tab Component JavaScript
class TabComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            width: 1129,
            contentSpacing: 24,
            animation: true,
            ...options
        };
        this.tabs = [];
        this.activeTab = null;
    }

    addTab(id, label, content) {
        this.tabs.push({ id, label, content });
    }

    render() {
        if (!this.container) return;

        // Create tab container with specified width
        const tabContainer = document.createElement('div');
        tabContainer.className = 'tab-container';
        tabContainer.style.width = `${this.options.width}px`;

        // Create tab header
        const tabHeader = document.createElement('div');
        tabHeader.className = 'tab-header';

        // Create tab buttons
        this.tabs.forEach((tab, index) => {
            const button = document.createElement('button');
            button.className = 'tab-button';
            if (index === 0) {
                button.classList.add('active');
                this.activeTab = tab.id;
            }
            button.innerHTML = `<span class="i18n" data-i18n="${tab.id}">${tab.label}</span>`;
            button.onclick = () => this.switchTab(tab.id);
            tabHeader.appendChild(button);
        });

        tabContainer.appendChild(tabHeader);

        // Create tab content area
        const contentArea = document.createElement('div');
        contentArea.className = 'tab-content-area';
        contentArea.style.marginTop = `${this.options.contentSpacing}px`;

        // Create tab panels
        this.tabs.forEach((tab, index) => {
            const panel = document.createElement('div');
            panel.className = 'tab-content';
            panel.id = `${tab.id}-panel`;
            if (index === 0) {
                panel.classList.add('active');
            }

            // Create dynamic panel content
            const tabPanel = document.createElement('div');
            tabPanel.className = 'tab-panel';
            
            if (typeof tab.content === 'string') {
                tabPanel.innerHTML = tab.content;
            } else if (typeof tab.content === 'function') {
                tabPanel.innerHTML = tab.content();
            }

            panel.appendChild(tabPanel);
            contentArea.appendChild(panel);
        });

        tabContainer.appendChild(contentArea);

        // Clear container and append new content
        this.container.innerHTML = '';
        this.container.appendChild(tabContainer);

        // Update i18n if available
        if (typeof updateTexts === 'function') {
            updateTexts();
        }
    }

    switchTab(tabId) {
        // Update active button
        const buttons = this.container.querySelectorAll('.tab-button');
        const panels = this.container.querySelectorAll('.tab-content');

        buttons.forEach((button, index) => {
            if (this.tabs[index].id === tabId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Update active panel
        panels.forEach((panel) => {
            if (panel.id === `${tabId}-panel`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        this.activeTab = tabId;

        // Trigger custom event
        this.container.dispatchEvent(new CustomEvent('tabChanged', {
            detail: { tabId }
        }));
    }

    updateContent(tabId, content) {
        const panel = this.container.querySelector(`#${tabId}-panel .tab-panel`);
        if (panel) {
            if (typeof content === 'string') {
                panel.innerHTML = content;
            } else if (typeof content === 'function') {
                panel.innerHTML = content();
            }
        }
    }

    getActiveTab() {
        return this.activeTab;
    }
}

// Export for use in other files
window.TabComponent = TabComponent;