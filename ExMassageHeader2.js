/**
 * ExMassageHeader - 幸福按摩网站标题栏组件
 * 
 * @example
 * // 基础使用
 * const header = new ExMassageHeader({
 *   title: '幸福按摩',
 *   slogan: '专业·舒适·贴心',
 *   onAboutClick: () => console.log('点击了关于按钮'),
 *   onLogoClick: () => console.log('返回首页')
 * });
 * 
 * // 自定义样式
 * const header2 = new ExMassageHeader({
 *   headerStyle: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
 *   logoStyle: 'width: 45px; height: 45px;',
 *   titleStyle: 'font-size: 22px; color: #fff;',
 *   aboutButtonStyle: 'width: 44px; height: 44px;'
 * });
 */
class ExMassageHeader {
  static instanceCount = 0;
  static styleInjected = false;

  /**
   * 保留覆盖规则后的样式
   */
  static keepAfterOverride(cssText) {
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

  /**
   * 处理用户自定义样式
   * @private
   */
  #processUserStyle(style) {
    if (!style) return "";
    if (style.startsWith("++")) return "userStyle:add;\n" + style.slice(2);
    return "userStyle:override;\n" + style;
  }

  constructor(options = {}) {
    const {
      target = document.body,
      title = '幸福按摩',
      slogan = '专业·舒适·贴心',
      onAboutClick = null,
      onLogoClick = null,
      headerStyle = '',
      logoStyle = '',
      titleStyle = '',
      sloganStyle = '',
      aboutButtonStyle = ''
    } = options;

    this.target = target;
    this.title = title;
    this.slogan = slogan;
    this.onAboutClick = onAboutClick;
    this.onLogoClick = onLogoClick;

    // 处理用户自定义样式
    this.headerStyle = this.#processUserStyle(headerStyle);
    this.logoStyle = this.#processUserStyle(logoStyle);
    this.titleStyle = this.#processUserStyle(titleStyle);
    this.sloganStyle = this.#processUserStyle(sloganStyle);
    this.aboutButtonStyle = this.#processUserStyle(aboutButtonStyle);

    // 唯一 ID
    this.instanceId = `ex-massage-header-${ExMassageHeader.instanceCount++}`;
    this.headerId = `ex-massage-header-${this.instanceId}`;

    this.injectGlobalStyle();
    this.injectInstanceStyle();
    this.render();
  }

  /**
   * 注入全局样式（只执行一次）
   */
  injectGlobalStyle() {
    if (ExMassageHeader.styleInjected) return;

    const style = document.createElement('style');
    style.id = 'ex-massage-header-global-style';

    const styleText = `
      .ex-massage-header {
        background: linear-gradient(135deg, #00bfa5 0%, #00d4aa 100%);
        color: white;
        padding: 0 20px;
        box-shadow: 0 2px 8px rgba(0, 191, 165, 0.3);
        position: sticky;
        top: 0;
        z-index: 1000;
        width: 100%;
        box-sizing: border-box;
      }

      .ex-massage-header-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
      }

      .ex-massage-logo-area {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        user-select: none;
      }

      .ex-massage-logo-icon {
        width: 40px;
        height: 40px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      }

      .ex-massage-logo-icon svg {
        width: 24px;
        height: 24px;
      }

      .ex-massage-logo-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .ex-massage-site-name {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .ex-massage-site-slogan {
        font-size: 11px;
        opacity: 0.9;
        font-weight: 400;
      }

      .ex-massage-about-button {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        flex-shrink: 0;
      }

      .ex-massage-about-button:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
        box-shadow__: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .ex-massage-about-button:active {
        transform: translateY(0) scale(0.95);
      }

      .ex-massage-about-button svg {
        width: 22px;
        height: 22px;
      }

      @media (max-width: 768px) {
        .ex-massage-header-content {
          height: 56px;
        }

        .ex-massage-logo-icon {
          width: 36px;
          height: 36px;
        }

        .ex-massage-logo-icon svg {
          width: 20px;
          height: 20px;
        }

        .ex-massage-site-name {
          font-size: 18px;
        }

        .ex-massage-site-slogan {
          font-size: 10px;
        }

        .ex-massage-about-button {
          width: 36px;
          height: 36px;
        }

        .ex-massage-about-button svg {
          width: 20px;
          height: 20px;
        }
      }
    `;

    style.textContent = styleText;
    document.head.appendChild(style);
    ExMassageHeader.styleInjected = true;
  }

  /**
   * 注入实例样式
   */
  injectInstanceStyle() {
    const style = document.createElement('style');
    style.id = `${this.instanceId}-style`;

    let styleText = `
      #${this.headerId}.ex-massage-header {
        ${this.headerStyle}
      }
      #${this.headerId} .ex-massage-logo-icon {
        ${this.logoStyle}
      }
      #${this.headerId} .ex-massage-site-name {
        ${this.titleStyle}
      }
      #${this.headerId} .ex-massage-site-slogan {
        ${this.sloganStyle}
      }
      #${this.headerId} .ex-massage-about-button {
        ${this.aboutButtonStyle}
      }
    `;

    style.textContent = ExMassageHeader.keepAfterOverride(styleText);
    document.head.appendChild(style);
    this.styleElement = style;
  }

  /**
   * 渲染组件
   */
  render() {
    this.headerEl = document.createElement('header');
    this.headerEl.id = this.headerId;
    this.headerEl.className = 'ex-massage-header';

    this.headerEl.innerHTML = `
      <div class="ex-massage-header-content">
        <div class="ex-massage-logo-area">
          <div class="ex-massage-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3Z" fill="#00bfa5" opacity="0.2"/>
              <path d="M12 8V12L15 15" stroke="#00bfa5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 3.5C9 3.5 10 3 12 3C14 3 15 3.5 15 3.5M12 3V1" stroke="#00bfa5" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="9" stroke="#00bfa5" stroke-width="2"/>
              <path d="M8 10C8 10 9 9 10 9C11 9 11.5 9.5 11.5 9.5M12.5 9.5C12.5 9.5 13 9 14 9C15 9 16 10 16 10" stroke="#00bfa5" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="ex-massage-logo-text">
            <div class="ex-massage-site-name">${this.title}</div>
            <div class="ex-massage-site-slogan">${this.slogan}</div>
          </div>
        </div>
        <button class="ex-massage-about-button" title="关于我们">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2"/>
            <path d="M12 16V12" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="8.5" r="0.5" fill="white" stroke="white" stroke-width="1.5"/>
          </svg>
        </button>
      </div>
    `;

    this.target.appendChild(this.headerEl);
    this.bindEvents();
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // Logo 点击事件
    const logoArea = this.headerEl.querySelector('.ex-massage-logo-area');
    if (logoArea) {
      logoArea.addEventListener('click', () => {
        if (this.onLogoClick) {
          this.onLogoClick();
        }
      });
    }

    // 关于按钮点击事件
    const aboutButton = this.headerEl.querySelector('.ex-massage-about-button');
    if (aboutButton) {
      aboutButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onAboutClick) {
          this.onAboutClick();
        }
      });
    }
  }

  /**
   * 移除组件
   */
  remove() {
    this.headerEl?.remove();
    this.styleElement?.remove();
    this.headerEl = null;
    this.styleElement = null;
  }
}

// // 使用示例
// const header = new ExMassageHeader({
//   onAboutClick: () => {
//     alert('关于我们：\n\n幸福按摩成立于2020年，致力于为客户提供专业、舒适、贴心的按摩服务。\n\n我们的团队由经验丰富的专业技师组成，秉承"健康生活，从放松开始"的理念。');
//   },
//   onLogoClick: () => {
//     console.log('返回首页');
//   }
// });

// // 自定义样式示例
// // const header2 = new ExMassageHeader({
// //   headerStyle: '++box-shadow: 0 4px 12px rgba(0, 191, 165, 0.5);',
// //   aboutButtonStyle: '++width: 44px; height: 44px; background: rgba(255, 255, 255, 0.2);'
// // });