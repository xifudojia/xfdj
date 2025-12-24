/**
 * ExTechnicianDetail 组件
 * 功能：高度还原技师详情页，支持主图全屏预览，移动端适配
 */
class ExTechnicianDetail {
    static instanceCount = 0;
  
    // 样式覆盖/追加逻辑
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
      data = {},
      containerStyle = "",
      headerStyle = "",
      cardStyle = "",
      onBackClick = null,
      onFavClick = null
    } = {}) {
      this.target = target || document.body;
      this.data = Object.assign({
        name: "周晓晓",
        level: "银牌",
        mainImage: "https://via.placeholder.com/600x800",
        thumbImage: "https://via.placeholder.com/100x150",
        brand: "晓凡健康",
        views: 891,
        intro: "本人90后，性格随和温柔，服务热情 工作态度认真负责 手法柔软细腻，欢迎下单体验最专业的服务"
      }, data);
  
      this.instanceId = `ex-td-${ExTechnicianDetail.instanceCount++}`;
      this.onBackClick = onBackClick;
      this.onFavClick = onFavClick;
  
      this.userStyles = {
        container: this.#processUserStyle(containerStyle),
        header: this.#processUserStyle(headerStyle),
        card: this.#processUserStyle(cardStyle)
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
        #${this.instanceId}.ex-td {
          width: 100%;
          background-color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          user-select: none;
          box-sizing: border-box;
          overflow-x: hidden;
          ${this.userStyles.container}
        }
  
        /* Banner区域 */
        #${this.instanceId} .ex-td__banner {
          position: relative;
          width: 100%;
          height: 450px;
          background: #f0f0f0;
        }
  
        #${this.instanceId} .ex-td__main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
  
        /* --- 新设计的返回按钮 --- */
        #${this.instanceId} .ex-td__back-btn {
          position: absolute;
          top: 44px; 
          left: 16px;
          width: 34px;
          height: 34px;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          display: none;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
  
        #${this.instanceId} .ex-td__back-btn:active {
          transform: scale(0.85);
          background: rgba(0, 0, 0, 0.5);
        }
  
        #${this.instanceId} .ex-td__back-btn svg {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          margin-right: 2px; /* 视觉对齐修正 */
        }
  
        /* 缩略图 */
        #${this.instanceId} .ex-td__thumb-wrap {
          position: absolute;
          bottom: 20px; left: 15px;
          width: 60px; height: 80px;
          border: 2px solid #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
  
        /* 认证Bar */
        #${this.instanceId} .ex-td__auth-bar {
          display: flex;
          justify-content: space-around;
          padding: 12px 0;
          background: linear-gradient(to bottom, #fff9e6, #fff);
          border-bottom: 1px solid #f5f5f5;
        }
        #${this.instanceId} .ex-td__auth-item {
          font-size: 13px; color: #8a6d3b;
          display: flex; align-items: center; gap: 4px;
        }
  
        /* 信息区 */
        #${this.instanceId} .ex-td__info {
          padding: 15px;
        }
        #${this.instanceId} .ex-td__header {
          display: flex; justify-content: space-between; align-items: center;
          ${this.userStyles.header}
        }
        #${this.instanceId} .ex-td__name-row {
          display: flex; align-items: center; gap: 8px;
        }
        #${this.instanceId} .ex-td__name {
          font-size: 22px; font-weight: bold;
        }
        #${this.instanceId} .ex-td__level {
          background: #d1d9e6; color: #5a6b82;
          font-size: 12px; padding: 2px 8px; border-radius: 10px;
        }
        #${this.instanceId} .ex-td__fav-btn {
        display:none;
          border: 1px solid #ddd; padding: 6px 15px; border-radius: 20px;
          font-size: 14px; color: #666; cursor: pointer; transition: 0.2s;
        }
        #${this.instanceId} .ex-td__fav-btn:active { background: #f5f5f5; }
  
        #${this.instanceId} .ex-td__brand-row {
          margin-top: 10px; display: flex; justify-content: space-between;
          align-items: center; color: #999; font-size: 13px;
        }
        #${this.instanceId} .ex-td__brand-tag {
          background: #fff4e5; color: #ff9800; padding: 2px 10px; border-radius: 4px;
        }
  
        /* 简介卡片 */
        #${this.instanceId} .ex-td__intro-card {
          margin-top: 20px; background: #f8fafd; border-radius: 12px;
          padding: 15px; ${this.userStyles.card}
        }
        #${this.instanceId} .ex-td__intro-title {
          color: #4a90e2; font-weight: bold; font-size: 16px; margin-bottom: 10px;
        }
        #${this.instanceId} .ex-td__intro-text {
          background: #fff; padding: 12px; border-radius: 8px;
          line-height: 1.6; color: #333; font-size: 14px;
        }
  
        /* 全屏预览容器 */
        .ex-td-fullscreen {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: #000; z-index: 9999; display: flex; align-items: center;
          justify-content: center; opacity: 0; visibility: hidden;
          transition: all 0.3s ease;
        }
        .ex-td-fullscreen.show { opacity: 1; visibility: visible; }
        .ex-td-fullscreen img { max-width: 100%; max-height: 100%; object-fit: contain; }
  
        @media (max-width: 375px) {
          #${this.instanceId} .ex-td__banner { height: 380px; }
          #${this.instanceId} .ex-td__name { font-size: 19px; }
        }
      `;
  
      style.textContent = this.#keepAfterOverride(styleText);
      document.head.appendChild(style);
    }
  
    render() {
      const template = `
        <div id="${this.instanceId}" class="ex-td">
          <!-- Banner -->
          <div class="ex-td__banner">
            <div class="ex-td__back-btn">
              <!-- 矢量向左箭头图标 -->
              <svg viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </div>
            <img class="ex-td__main-img" src="${this.data.mainImage}" />
            <div class="ex-td__thumb-wrap">
              <img style="width:100%;height:100%;object-fit:cover" src="${this.data.thumbImage}" />
            </div>
          </div>
  
          <!-- Auth Bar -->
          <div class="ex-td__auth-bar">
            <div class="ex-td__auth-item">🛡️ 正规安全</div>
            <div class="ex-td__auth-item">🆔 实名认证</div>
            <div class="ex-td__auth-item">📜 资格证书</div>
          </div>
  
          <!-- Basic Info -->
          <div class="ex-td__info">
            <div class="ex-td__header">
              <div class="ex-td__name-row">
                <span class="ex-td__name">${this.data.name}</span>
                <span class="ex-td__level">💎 ${this.data.level}</span>
              </div>
              <div class="ex-td__fav-btn">♡ 收藏</div>
            </div>
  
            <div class="ex-td__brand-row">
              <div class="ex-td__brand-tag">${this.data.brand} ›</div>
              <div>浏览量 ${this.data.views}</div>
            </div>
  
            <!-- Intro -->
            <div class="ex-td__intro-card">
              <div class="ex-td__intro-title">商家简介</div>
              <div class="ex-td__intro-text">
                ${this.data.intro}
              </div>
            </div>
          </div>
        </div>
      `;
  
      this.target.innerHTML = template;
      this.containerEl = document.getElementById(this.instanceId);
      this.bindEvents();
    }
  
    bindEvents() {
      const backBtn = this.containerEl.querySelector('.ex-td__back-btn');
      backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onBackClick) this.onBackClick();
      });
  
      const favBtn = this.containerEl.querySelector('.ex-td__fav-btn');
      favBtn.addEventListener('click', (e) => {
        if (this.onFavClick) this.onFavClick(e.target);
      });
  
      const mainImg = this.containerEl.querySelector('.ex-td__main-img');
      mainImg.addEventListener('click', () => this.showFullScreen(this.data.mainImage));
    }
  
    showFullScreen(src) {
      let overlay = document.querySelector('.ex-td-fullscreen');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'ex-td-fullscreen';
        overlay.innerHTML = `<img src="" />`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => overlay.classList.remove('show'));
      }
      overlay.querySelector('img').src = src;
      setTimeout(() => overlay.classList.add('show'), 10);
    }
  
    remove() {
      if (this.containerEl) this.containerEl.remove();
      const style = document.getElementById(`${this.instanceId}-style`);
      if (style) style.remove();
    }
  }


// import { ExTechnicianDetail } from './ExTechnicianDetail.js';

// const page = new ExTechnicianDetail(document.getElementById('app'), {
//   data: {
//     name: "周晓晓",
//     level: "金牌技师",
//     // 替换为真实图片地址
//     mainImage: "technician_large.jpg",
//     thumbImage: "technician_thumb.jpg"
//   },
//   // 自定义样式示例：追加简介卡片的背景
//   cardStyle: "++background-color: #f0fdfa;",
//   onBackClick: () => {
//     history.back();
//   }
// });