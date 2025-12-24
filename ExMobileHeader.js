class ExMobileHeader {
  static instanceCount = 0;

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

  constructor(
    target,
    {
      location = "广东深圳",
      headerStyle = "",
      locationStyle = "",
      refreshBtnStyle = "",
      onRefresh = null
    } = {}
  ) {
    this.target = target || document.body;
    this.location = location;
    this.onRefresh = onRefresh;

    this.headerStyle = this.#processUserStyle(headerStyle);
    this.locationStyle = this.#processUserStyle(locationStyle);
    this.refreshBtnStyle = this.#processUserStyle(refreshBtnStyle);

    this.instanceId = `ex-mobile-header-${ExMobileHeader.instanceCount++}`;
    this.headerId = `ex-header-${this.instanceId}`;

    this.injectStyle();
    this.render();
  }

  #processUserStyle(style) {
    if (style.startsWith("++")) return "userStyle:add;\n" + style.slice(2);
    else if (style) return "userStyle:override;\n" + style;
    return "";
  }

  injectStyle() {
    if (document.getElementById(`${this.instanceId}-style`)) return;

    const style = document.createElement("style");
    style.id = `${this.instanceId}-style`;

    let styleText = `
    #${this.headerId}.ex-mobile-header {
      width: 100%;
      height: 56px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      box-sizing: border-box;
      user-select: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      ${this.headerStyle}
    }

    #${this.headerId} .ex-header-location {
      display: flex;
      align-items: center;
      color: #333333;
      font-size: 16px;
      font-weight: 500;
      ${this.locationStyle}
    }

    #${this.headerId} .ex-location-icon {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }

    #${this.headerId} .ex-refresh-btn {
      background: #f5f5f5;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      ${this.refreshBtnStyle}
    }

    #${this.headerId} .ex-refresh-btn:active {
      background: #e8e8e8;
      transform: scale(0.95);
    }

    #${this.headerId} .ex-refresh-icon {
      width: 24px;
      height: 24px;
      transition: transform 0.6s ease;
    }

    #${this.headerId} .ex-refresh-btn.spinning .ex-refresh-icon {
      animation: ex-spin-${this.instanceId} 1s linear infinite;
    }

    @keyframes ex-spin-${this.instanceId} {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
    style.textContent = this.keepAfterOverride(styleText);
    document.head.appendChild(style);
  }

  render() {
    this.headerEl = document.createElement("div");
    this.headerEl.id = this.headerId;
    this.headerEl.className = "ex-mobile-header";

    this.headerEl.innerHTML = `
    <div class="ex-header-location">
      <svg class="ex-location-icon" viewBox="0 0 24 24" fill="#667eea">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      <span>${this.location}</span>
    </div>
    <button class="ex-refresh-btn">
      <svg class="ex-refresh-icon" viewBox="0 0 24 24" fill="#666666">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
      </svg>
    </button>
  `;

    this.target.appendChild(this.headerEl);
    this.bindEvents();
  }

  bindEvents() {
    if (!this.headerEl) return;

    const refreshBtn = this.headerEl.querySelector(".ex-refresh-btn");
    
    refreshBtn.addEventListener("click", () => {
      refreshBtn.classList.add("spinning");

      if (this.onRefresh) {
        this.onRefresh(() => {
          refreshBtn.classList.remove("spinning");
        });
      } else {
        setTimeout(() => {
          refreshBtn.classList.remove("spinning");
        }, 1000);
      }
    });
  }

  updateLocation(newLocation) {
    if (!this.headerEl) return;
    const locationText = this.headerEl.querySelector(".ex-header-location span");
    if (locationText) {
      locationText.textContent = newLocation;
      this.location = newLocation;
    }
  }

  remove() {
    if (this.headerEl) {
      this.headerEl.remove();
      this.headerEl = null;
    }

    const style = document.getElementById(`${this.instanceId}-style`);
    if (style) {
      style.remove();
    }
  }
}







// // 基础使用
// const header = new ExMobileHeader(document.body, {
//     location: "广东深圳",
//     onRefresh: (done) => {
//       // 执行刷新操作
//       console.log("刷新中...");
//       setTimeout(() => {
//         console.log("刷新完成");
//         done(); // 停止旋转动画
//       }, 2000);
//     }
//   });
  
//   // 自定义样式 - 覆盖方式
//   const header2 = new ExMobileHeader(document.body, {
//     location: "北京",
//     headerStyle: `
//       background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
//       height: 60px;
//     `,
//     locationStyle: `
//       font-size: 18px;
//       font-weight: 600;
//     `
//   });
  
//   // 自定义样式 - 追加方式
//   const header3 = new ExMobileHeader(document.body, {
//     location: "上海",
//     headerStyle: `++
//       box-shadow: 0 4px 12px rgba(0,0,0,0.2);
//     `,
//     refreshBtnStyle: `++
//       background: rgba(255, 255, 255, 0.3);
//     `
//   });
  
//   // 更新位置
//   header.updateLocation("北京海淀");
  
//   // 移除组件
//   header.remove();