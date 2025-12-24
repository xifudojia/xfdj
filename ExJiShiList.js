/**
 * ExJiShiList - 服务人员列表组件
 * 使用方式：
 * const serviceList = new ExJiShiList(document.body, {
 *   data: [...],
 *   onFavoriteClick: (id, isFavorite) => {},
 *   onOrderClick: (id, item) => {}
 * });
 */

class ExJiShiList {
  static instanceCount = 0;

  /**
   * 保留 userStyle:override 之后的样式
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
    data = [],
    cardStyle = "",
    imageStyle = "",
    contentStyle = "",
    buttonStyle = "",
    onFavoriteClick = null,
    onOrderClick = null
  } = {}) {
    this.target = target || document.body;
    this.data = data;
    this.onFavoriteClick = onFavoriteClick;
    this.onOrderClick = onOrderClick;

    // 处理用户自定义样式
    this.cardStyle = this.#processUserStyle(cardStyle);
    this.imageStyle = this.#processUserStyle(imageStyle);
    this.contentStyle = this.#processUserStyle(contentStyle);
    this.buttonStyle = this.#processUserStyle(buttonStyle);

    // 唯一实例 ID
    this.instanceId = `ex-service-list-${ExJiShiList.instanceCount++}`;
    this.containerId = `${this.instanceId}-container`;

    this.injectStyle();
    this.render();
  }

  #processUserStyle(style) {
    if (style.startsWith("++")) return "userStyle:add;\n" + style.slice(2);
    else if (style) return "userStyle:override;\n" + style;
    return "";
  }

  injectStyle() {
    // 检查是否已注入样式
    if (document.getElementById(`${this.instanceId}-style`)) return;

    const style = document.createElement("style");
    style.id = `${this.instanceId}-style`;

    let styleText = `
      #${this.containerId}.ex-service-list {
        width: 100%;
        box-sizing: border-box;
        padding: 16px;
        background: #f5f5f5;
      }

      #${this.containerId} .ex-service-card {
        background: white;
        border-radius: 16px;
        margin-bottom: 16px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        ${this.cardStyle};
      }

      #${this.containerId} .ex-card-image {
        width: 100%;
        height: 400px;
        background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        ${this.imageStyle};
      }

      #${this.containerId} .ex-card-image-bg {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }

      #${this.containerId} .ex-favorite-btn {
        position: absolute;

        top: 16px;
        right: 16px;
        width: 44px;
        height: 44px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        user-select: none;
        transition: transform 0.2s ease;
        display:none;

      }

      #${this.containerId} .ex-favorite-btn svg {
        display:none;

        width: 24px;
        height: 24px;
        fill: none;
        stroke: #666;
        stroke-width: 2;
      }

      #${this.containerId} .ex-favorite-btn.active svg {
        fill: #ff6b6b;
        stroke: #ff6b6b;
      }

      #${this.containerId} .ex-favorite-btn:active {
        transform: scale(0.95);
      }

      #${this.containerId} .ex-card-content {
        padding: 16px;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4));
        position: relative;
        margin-top: -120px;
        color: white;
        ${this.contentStyle};
      }

      #${this.containerId} .ex-distance {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-bottom: 12px;
        opacity: 0.9;
      }

      #${this.containerId} .ex-distance svg {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }

      #${this.containerId} .ex-name-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      #${this.containerId} .ex-name {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 24px;
        font-weight: bold;
      }

      #${this.containerId} .ex-rating {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(255, 255, 255, 0.2);
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 14px;
      }

      #${this.containerId} .ex-rating svg {
        width: 16px;
        height: 16px;
        fill: #ffc107;
      }

      #${this.containerId} .ex-badge {
        background: rgba(255, 255, 255, 0.25);
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 12px;
        display: inline-block;
      }

      #${this.containerId} .ex-stats-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      #${this.containerId} .ex-stats {
        display: flex;
        gap: 20px;
        font-size: 14px;
        opacity: 0.9;
      }

      #${this.containerId} .ex-tag {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        opacity: 0.9;
      }

      #${this.containerId} .ex-order-btn {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #4fd1c5, #38b2ac);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s ease;
        user-select: none;
        ${this.buttonStyle};
      }

      #${this.containerId} .ex-order-btn:active {
        transform: scale(0.98);
      }
    `;

    style.textContent = this.keepAfterOverride(styleText);
    document.head.appendChild(style);
  }

  render() {
    if (!this.target) return;

    const container = document.createElement("div");
    container.id = this.containerId;
    container.className = "ex-service-list";

    container.innerHTML = this.data.map((item, index) => `
      <div class="ex-service-card" data-index="${index}" data-id="${item.id || index}">
        <div class="ex-card-image">
          <div class="ex-card-image-bg" style="background-image: url('${item.image || ''}');"></div>
          <button class="ex-favorite-btn ${item.isFavorite ? 'active' : ''}" data-index="${index}">
            <svg viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>
        <div class="ex-card-content">
          <div class="ex-distance">
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            ${item.distance || ''}
          </div>
          <div class="ex-name-row">
            <div class="ex-name">
              ${item.name || ''}
              <div class="ex-rating">
                <svg viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                ${item.rating || '5.0'}
              </div>
              ${item.badge ? `<span class="ex-badge">${item.badge}</span>` : ''}
            </div>
          </div>
          <div class="ex-stats-row">
            <div class="ex-stats">
              <span>单量 ${item.orderCount || 0}</span>
              <span>收藏 ${item.favoriteCount || 0}</span>
              ${item.reviewCount ? `<span>${item.reviewCount}评价</span>` : ''}
            </div>
            ${item.tag ? `
              <div class="ex-tag">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                ${item.tag}
              </div>
            ` : ''}
          </div>
          <button class="ex-order-btn" data-index="${index}">立即下单</button>
        </div>
      </div>
    `).join('');

    this.target.appendChild(container);
    this.container = container;

    this.bindEvents();
  }

  bindEvents() {
    if (!this.container) return;

    // 收藏按钮事件
    this.container.querySelectorAll('.ex-favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        const item = this.data[index];
        const isFavorite = btn.classList.toggle('active');
        
        if (item) {
          item.isFavorite = isFavorite;
        }

        if (this.onFavoriteClick) {
          this.onFavoriteClick(item.id || index, isFavorite, item);
        }
      });
    });

    // 下单按钮事件
    this.container.querySelectorAll('.ex-order-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        const item = this.data[index];

        if (this.onOrderClick) {
          this.onOrderClick(item.id || index, item);
        }
      });
    });
  }

  // 更新数据
  updateData(newData) {
    this.data = newData;
    if (this.container) {
      this.container.remove();
    }
    this.render();
  }

  // 添加单个项目
  addItem(item) {
    this.data.push(item);
    if (this.container) {
      this.container.remove();
    }
    this.render();
  }

  // 移除组件
  remove() {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}

// 导出模块
// 示例数据格式
/*
const sampleData = [
  {
    id: 1,
    name: "王亿亿",
    image: "./jishi/未标题-2.png",
    distance: "1.97km",
    rating: "5.0",
    badge: "银牌",
    orderCount: 0,
    favoriteCount: "50+",
    reviewCount: 1,
    tag: "亿粒米养生",
    isFavorite: false
  },
  {
    id: 2,
    name: "江素素",
    image: "./jishi/未标题-3.png",
    distance: "1.98km",
    rating: "5.0",
    badge: "银牌",
    orderCount: 11,
    favoriteCount: 13,
    tag: "柚一健康",
    isFavorite: false
  }
];

// 使用示例
const serviceList = new ExJiShiList(document.body, {
  data: sampleData,
  onFavoriteClick: (id, isFavorite, item) => {
    console.log(`收藏状态改变: ID=${id}, isFavorite=${isFavorite}`, item);
  },
  onOrderClick: (id, item) => {
    console.log(`点击下单: ID=${id}`, item);
  }
});
*/