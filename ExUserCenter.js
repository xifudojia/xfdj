/**
 * ExUserCenter - 个人中心组件
 * 特点：支持多实例、样式隔离、移动端优化、自定义样式覆写
 */

 class ExUserCenter {
    static instanceCount = 0;
  
    /**
     * 核心逻辑：处理样式覆写
     * 如果块内包含 userStyle:override，则只保留该行之后的样式
     */
    keepAfterOverride(cssText) {
      return cssText.replace(/([^{]+){([^}]*)}/g, (match, selector, body) => {
        const lines = body.split(';');
        let index = -1;
  
        for (let i = 0; i < lines.length; i++) {
          if (/userStyle\s*:\s*override\s*;/.test(lines[i] + ";")) {
            index = i;
            break;
          }
        }
  
        if (index !== -1) {
          const newBody = lines.slice(index).map(line => line.trimEnd()).join(';\n');
          return `${selector}{\n${newBody}\n}`;
        }
        return match;
      });
    }
  
    constructor(target, {
      userInfo = { name: "游客", role: "普通用户", avatar: "https://picsum.photos/100" },
      menuItems = [],
      containerStyle = "",
      headerStyle = "",
      listStyle = "",
      itemStyle = "",
      onItemClick = null
    } = {}) {
      this.target = target || document.body;
      this.userInfo = userInfo;
      this.menuItems = menuItems.length ? menuItems : this.getDefaultMenus();
      this.onItemClick = onItemClick;
  
      // 实例 ID
      this.instanceId = `ex-uc-${ExUserCenter.instanceCount++}`;
      this.containerId = `ex-uc-container-${this.instanceId}`;
  
      // 处理自定义样式标记
      this.containerStyle = this.#processUserStyle(containerStyle);
      this.headerStyle = this.#processUserStyle(headerStyle);
      this.listStyle = this.#processUserStyle(listStyle);
      this.itemStyle = this.#processUserStyle(itemStyle);
  
      this.injectStyle();
      this.render();
    }
  
    #processUserStyle(style) {
      if (!style) return "";
      if (style.startsWith("++")) return "userStyle:add;\n" + style.slice(2);
      return "userStyle:override;\n" + style;
    }
  
    getDefaultMenus() {
      return [
        { id: 'address', icon: '📍', title: '服务地址', sub: '你的常用地址及联系方式', extra: '编辑' },
        { id: 'service', icon: '🎧', title: '联系客服' },
        { id: 'report', icon: '⚠️', title: '投诉举报' },
        { id: 'recruit', icon: '➕', title: '技师招募' }
      ];
    }
  
    injectStyle() {
      const styleId = `style-${this.instanceId}`;
      if (document.getElementById(styleId)) return;
  
      const style = document.createElement("style");
      style.id = styleId;
  
      let styleText = `
        #${this.containerId}.ex-uc-container {
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          background: #f7f7f7;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
          box-sizing: border-box;
          user-select: none;
          ${this.containerStyle};
        }
  
        #${this.containerId} .ex-uc-header {
          display: flex;
          align-items: center;
          padding: 20px 16px;
          background: #fff;
          border-bottom: 8px solid #f5f5f5;
          ${this.headerStyle};
        }
  
        #${this.containerId} .ex-uc-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 16px;
          flex-shrink: 0;
          background_: #eee;
        }
  
        #${this.containerId} .ex-uc-avatar img {
          width: 100%; height: 100%; object-fit: cover;
        }
  
        #${this.containerId} .ex-uc-user-info h2 {
          font-size: 18px; color: #e85a4f; margin: 0 0 6px 0;
        }
  
        #${this.containerId} .ex-uc-user-info p {
          font-size: 13px; color: #999; margin: 0;
        }
  
        #${this.containerId} .ex-uc-list {
          background: #fff;
          ${this.listStyle};
        }
  
        #${this.containerId} .ex-uc-item {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: transform 0.1s ease;
          -webkit-tap-highlight-color: transparent;
          ${this.itemStyle};
        }
  
        #${this.containerId} .ex-uc-item:active {
          background-color: #f9f9f9;
          transform: scale(0.98);
        }
  
        #${this.containerId} .ex-uc-item:last-child {
          border-bottom: none;
        }
  
        #${this.containerId} .ex-uc-icon {
          width: 24px; font-size: 20px; margin-right: 20px; text-align: center;
        }
  
        #${this.containerId} .ex-uc-content {
          flex: 1;
        }
  
        #${this.containerId} .ex-uc-content-title {
          font-size: 16px; font-weight: bold; margin-bottom: 4px; color: #333;
        }
  
        #${this.containerId} .ex-uc-content-sub {
          font-size: 13px; color: #999;
        }
  
        #${this.containerId} .ex-uc-extra {
          font-size: 14px; color: #999; margin-right: 6px;
        }
  
        #${this.containerId} .ex-uc-arrow {
          font-size: 18px; color: #ccc;
        }
  
        /* 小屏手机适配 */
        @media (max-width: 375px) {
          #${this.containerId} .ex-uc-header { padding: 15px 12px; }
          #${this.containerId} .ex-uc-avatar { width: 56px; height: 56px; }
          #${this.containerId} .ex-uc-content-title { font-size: 15px; }
        }
      `;
  
      style.textContent = this.keepAfterOverride(styleText);
      document.head.appendChild(style);
    }
  
    render() {
      if (!this.target) return;
  
      // 使用模板字符串进行模块化渲染
      const menuHtml = this.menuItems.map(item => `
        <div class="ex-uc-item" data-id="${item.id}">
          <div class="ex-uc-icon">${item.icon || ''}</div>
          <div class="ex-uc-content">
            <div class="ex-uc-content-title">${item.title}</div>
            ${item.sub ? `<div class="ex-uc-content-sub">${item.sub}</div>` : ''}
          </div>
          ${item.extra ? `<div class="ex-uc-extra">${item.extra}</div>` : ''}
          <div class="ex-uc-arrow">›</div>
        </div>
      `).join('');
  
      this.container = document.createElement("div");
      this.container.id = this.containerId;
      this.container.className = "ex-uc-container";
  
      this.container.innerHTML = `
        <div class="ex-uc-header">
          <div class="ex-uc-avatar">

            <img src="${this.userInfo.avatar}" alt="avatar" />
          </div>
          <div class="ex-uc-user-info">
            <h2>${this.userInfo.name}</h2>
            <p>— ${this.userInfo.role} —</p>
          </div>
        </div>
        <div class="ex-uc-list">
          ${menuHtml}
        </div>
      `;
  
      this.target.appendChild(this.container);
      this.bindEvents();
    }
  
    bindEvents() {
      const items = this.container.querySelectorAll('.ex-uc-item');
      items.forEach(item => {
        item.addEventListener('click', (e) => {
          const id = item.getAttribute('data-id');
          const data = this.menuItems.find(m => m.id === id);
          if (this.onItemClick) {
            this.onItemClick(id, data, item);
          }
        });
      });
    }
  
    remove() {
      if (this.container) {
        this.container.remove();
        this.container = null;
      }
      const style = document.getElementById(`style-${this.instanceId}`);
      if (style) style.remove();
    }
  }










//   import ExUserCenter from './ExUserCenter.js';

// const uc = new ExUserCenter(document.body, {
//   userInfo: {
//     name: "张三",
//     role: "金牌会员",
//     avatar: "https://via.placeholder.com/100"
//   },
//   // 自定义菜单
//   menuItems: [
//     { id: 'wallet', icon: '💰', title: '我的钱包', sub: '余额：¥100.00' },
//     { id: 'order', icon: '📦', title: '我的订单' },
//     { id: 'setting', icon: '⚙️', title: '设置中心' }
//   ],
//   // 覆盖原有标题颜色
//   headerStyle: "background: #fff5f5; ++border-bottom: 2px solid #e85a4f;", 
//   // 点击回调
//   onItemClick: (id, data, el) => {
//     console.log(`点击了: ${id}`, data);
//     alert(`您点击了${data.title}`);
//   }
// });