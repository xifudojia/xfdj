/**
 * ExMassageList 组件
 * 功能：还原按摩服务列表，支持移动端优化与自定义样式注入
 */
 class ExServiceList {
  static instanceCount = 0;

  /**
   * 样式处理：支持追加(++)或覆盖
   */
  #keepAfterOverride(cssText) {
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

  #processUserStyle(style) {
    if (!style) return "";
    if (style.startsWith("++")) return "userStyle:add;\n" + style.slice(2);
    return "userStyle:override;\n" + style;
  }

  constructor(target, {
    items = [],
    containerStyle = "",
    itemStyle = "",
    titleStyle = "",
    priceStyle = "",
    buttonStyle = "",
    onItemClick = null
  } = {}) {
    this.target = target || document.body;
    this.items = items;
    this.onItemClick = onItemClick;

    // 实例唯一ID
    this.instanceId = `ex-massage-${ExServiceList.instanceCount++}`;
    this.containerId = `ex-cnt-${this.instanceId}`;

    // 处理自定义样式
    this.userStyles = {
      container: this.#processUserStyle(containerStyle),
      item: this.#processUserStyle(itemStyle),
      title: this.#processUserStyle(titleStyle),
      price: this.#processUserStyle(priceStyle),
      button: this.#processUserStyle(buttonStyle)
    };

    this.injectStyle();
    this.render();
  }

  injectStyle() {
    const styleId = `${this.instanceId}-style`;
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;

    let styleText = `
      #${this.containerId}.ex-massage-list {
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        background-color: #f9f9f9;
        display: flex;
        flex-direction: column;
        gap: 12px;
        user-select: none;
        ${this.userStyles.container}
      }

      #${this.containerId} .ex-massage-item {
        display: flex;
        align-items: center;
        background: #fff;
        padding: 12px;
        border-radius: 12px;
        box-sizing: border-box;
        width: 100%;
        ${this.userStyles.item}
      }

      #${this.containerId} .ex-massage-img {
        width: 110px;
        height: 75px;
        object-fit: cover;
        border-radius: 8px;
        flex-shrink: 0;
      }

      #${this.containerId} .ex-massage-info {
        flex: 1;
        margin-left: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
      }

      #${this.containerId} .ex-massage-title {
        font-size: 17px;
        font-weight: bold;
        color: #333;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        ${this.userStyles.title}
      }

      #${this.containerId} .ex-massage-duration {
        font-size: 13px;
        color: #999;
        margin-bottom: 6px;
      }

      #${this.containerId} .ex-massage-price {
        font-size: 19px;
        color: #ff7a00;
        font-weight: bold;
        display: flex;
        align-items: baseline;
        ${this.userStyles.price}
      }

      #${this.containerId} .ex-massage-price::before {
        content: "¥";
        font-size: 13px;
        margin-right: 2px;
      }

      #${this.containerId} .ex-massage-btn {
        background-color: #47b3ad;
        color: white;
        border: none;
        padding: 0 16px;
        height: 36px;
        min-width: 80px;
        border-radius: 18px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        transition: transform 0.1s ease;
        box-shadow: 0 3px 8px rgba(71, 179, 173, 0.2);
        ${this.userStyles.button}
      }

      /* 移动端点击反馈 */
      #${this.containerId} .ex-massage-btn:active {
        transform: scale(0.95);
        background-color: #3d9c97;
      }

      /* 小屏手机适配 */
      @media (max-width: 375px) {
        #${this.containerId} .ex-massage-img {
          width: 90px;
          height: 65px;
        }
        #${this.containerId} .ex-massage-title {
          font-size: 15px;
        }
        #${this.containerId} .ex-massage-btn {
          min-width: 70px;
          padding: 0 10px;
          font-size: 12px;
        }
      }
    `;

    style.textContent = this.#keepAfterOverride(styleText);
    document.head.appendChild(style);
  }

  render() {
    if (!this.target) return;

    // 模板字符串渲染
    const itemsHtml = this.items.map((item, index) => `
      <div class="ex-massage-item" data-index="${index}">
        <img src="${item.image}" alt="${item.title}" class="ex-massage-img">
        <div class="ex-massage-info">
          <div class="ex-massage-title">${item.title}</div>
          <div class="ex-massage-duration">时长：${item.duration}</div>
          <div class="ex-massage-price">${item.price}</div>
        </div>
        <button class="ex-massage-btn" data-index="${index}">立即下单</button>
      </div>
    `).join('');

    this.containerEl = document.createElement("div");
    this.containerEl.id = this.containerId;
    this.containerEl.className = "ex-massage-list";
    this.containerEl.innerHTML = itemsHtml;

    this.target.appendChild(this.containerEl);
    this.bindEvents();
  }

  bindEvents() {
    // 事件委托
    this.containerEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".ex-massage-btn");
      if (btn) {
        const index = btn.dataset.index;
        const data = this.items[index];
        if (this.onItemClick) {
          this.onItemClick(data, btn);
        }
      }
    });
  }

  remove() {
    if (this.containerEl) {
      this.containerEl.remove();
      this.containerEl = null;
    }
    const style = document.getElementById(`${this.instanceId}-style`);
    if (style) style.remove();
  }
}