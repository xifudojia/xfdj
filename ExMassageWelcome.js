/**
 * ExMassageWelcome - 幸福按摩欢迎内容组件
 * 
 * @example
 * // 基础使用
 * const welcome = new ExMassageWelcome({
 *   title: '欢迎来到幸福按摩',
 *   description: '我们提供专业的上门按摩服务，让您在家中享受五星级的放松体验。',
 *   badge: '100% 正规服务保障'
 * });
 * 
 * // 自定义样式
 * const welcome2 = new ExMassageWelcome({
 *   contentStyle: '++padding: 40px;',
 *   cardStyle: '++box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);'
 * });
 */
class ExMassageWelcome {
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
      title = '欢迎来到幸福按摩',
      description = '我们提供专业的上门按摩服务,让您在家中享受五星级的放松体验。<br>资深技师团队,标准化服务流程,为您的健康保驾护航。',
      badge = '100% 正规服务保障',
      showIcon = true,
      contentStyle = '',
      cardStyle = '',
      iconStyle = '',
      titleStyle = '',
      descriptionStyle = '',
      badgeStyle = ''
    } = options;

    this.target = target;
    this.title = title;
    this.description = description;
    this.badge = badge;
    this.showIcon = showIcon;

    // 处理用户自定义样式
    this.contentStyle = this.#processUserStyle(contentStyle);
    this.cardStyle = this.#processUserStyle(cardStyle);
    this.iconStyle = this.#processUserStyle(iconStyle);
    this.titleStyle = this.#processUserStyle(titleStyle);
    this.descriptionStyle = this.#processUserStyle(descriptionStyle);
    this.badgeStyle = this.#processUserStyle(badgeStyle);

    // 唯一 ID
    this.instanceId = `ex-massage-welcome-${ExMassageWelcome.instanceCount++}`;
    this.contentId = `ex-massage-content-${this.instanceId}`;

    this.injectGlobalStyle();
    this.injectInstanceStyle();
    this.render();
  }

  /**
   * 注入全局样式（只执行一次）
   */
  injectGlobalStyle() {
    if (ExMassageWelcome.styleInjected) return;

    const style = document.createElement('style');
    style.id = 'ex-massage-welcome-global-style';

    const styleText = `
      .ex-massage-content {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .ex-massage-welcome-card {
        background: white;
        border-radius: 16px;
        padding: 32px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .ex-massage-welcome-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
      }

      .ex-massage-welcome-title {
        font-size: 28px;
        font-weight: 700;
        color: #333;
        margin-bottom: 12px;
      }

      .ex-massage-welcome-text {
        font-size: 16px;
        color: #666;
        line-height: 1.8;
      }

      .ex-massage-feature-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: linear-gradient(135deg, #e8f5f3 0%, #d4f1ec 100%);
        color: #00bfa5;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        margin-top: 20px;
      }

      .ex-massage-feature-badge svg {
        width: 16px;
        height: 16px;
      }

      @media (max-width: 768px) {
        .ex-massage-content {
          padding: 16px;
        }

        .ex-massage-welcome-card {
          padding: 24px 20px;
        }

        .ex-massage-welcome-icon {
          width: 64px;
          height: 64px;
        }

        .ex-massage-welcome-title {
          font-size: 24px;
        }

        .ex-massage-welcome-text {
          font-size: 15px;
        }

        .ex-massage-feature-badge {
          font-size: 13px;
          padding: 7px 14px;
        }
      }
    `;

    style.textContent = styleText;
    document.head.appendChild(style);
    ExMassageWelcome.styleInjected = true;
  }

  /**
   * 注入实例样式
   */
  injectInstanceStyle() {
    const style = document.createElement('style');
    style.id = `${this.instanceId}-style`;

    let styleText = `
      #${this.contentId}.ex-massage-content {
        ${this.contentStyle}
      }
      #${this.contentId} .ex-massage-welcome-card {
        ${this.cardStyle}
      }
      #${this.contentId} .ex-massage-welcome-icon {
        ${this.iconStyle}
      }
      #${this.contentId} .ex-massage-welcome-title {
        ${this.titleStyle}
      }
      #${this.contentId} .ex-massage-welcome-text {
        ${this.descriptionStyle}
      }
      #${this.contentId} .ex-massage-feature-badge {
        ${this.badgeStyle}
      }
    `;

    style.textContent = ExMassageWelcome.keepAfterOverride(styleText);
    document.head.appendChild(style);
    this.styleElement = style;
  }

  /**
   * 渲染组件
   */
  render() {
    this.contentEl = document.createElement('div');
    this.contentEl.id = this.contentId;
    this.contentEl.className = 'ex-massage-content';

    const iconHtml = this.showIcon ? `
      <svg class="ex-massage-welcome-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#e8f5f3"/>
        <circle cx="50" cy="50" r="35" fill="#00bfa5" opacity="0.2"/>
        <path d="M35 45C35 45 40 40 45 40C50 40 52 42 52 42M48 42C48 42 50 40 55 40C60 40 65 45 65 45" stroke="#00bfa5" stroke-width="3" stroke-linecap="round"/>
        <path d="M35 60C35 60 40 70 50 70C60 70 65 60 65 60" stroke="#00bfa5" stroke-width="3" stroke-linecap="round"/>
        <circle cx="42" cy="50" r="3" fill="#00bfa5"/>
        <circle cx="58" cy="50" r="3" fill="#00bfa5"/>
      </svg>
    ` : '';

    this.contentEl.innerHTML = `
      <div class="ex-massage-welcome-card">
        ${iconHtml}
        <h1 class="ex-massage-welcome-title">${this.title}</h1>
        <p class="ex-massage-welcome-text">${this.description}</p>
        <div class="ex-massage-feature-badge">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 6V11C4 16 7 20 12 22C17 20 20 16 20 11V6L12 2Z" fill="currentColor" opacity="0.2"/>
            <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 2L4 6V11C4 16 7 20 12 22C17 20 20 16 20 11V6L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${this.badge}
        </div>
      </div>
    `;

    this.target.appendChild(this.contentEl);
  }

  /**
   * 更新内容
   */
  update(options = {}) {
    const { title, description, badge } = options;
    
    if (title !== undefined) {
      this.title = title;
      const titleEl = this.contentEl.querySelector('.ex-massage-welcome-title');
      if (titleEl) titleEl.textContent = title;
    }
    
    if (description !== undefined) {
      this.description = description;
      const descEl = this.contentEl.querySelector('.ex-massage-welcome-text');
      if (descEl) descEl.innerHTML = description;
    }
    
    if (badge !== undefined) {
      this.badge = badge;
      const badgeEl = this.contentEl.querySelector('.ex-massage-feature-badge');
      if (badgeEl) {
        const svg = badgeEl.querySelector('svg');
        badgeEl.innerHTML = '';
        badgeEl.appendChild(svg);
        badgeEl.appendChild(document.createTextNode(badge));
      }
    }
  }

  /**
   * 移除组件
   */
  remove() {
    this.contentEl?.remove();
    this.styleElement?.remove();
    this.contentEl = null;
    this.styleElement = null;
  }
}

// 使用示例
const welcome = new ExMassageWelcome({
  title: '欢迎来到幸福按摩',
  description: '我们提供专业的上门按摩服务,让您在家中享受五星级的放松体验。<br>资深技师团队,标准化服务流程,为您的健康保驾护航。',
  badge: '100% 正规服务保障'
});

// 自定义样式示例
// const welcome2 = new ExMassageWelcome({
//   contentStyle: '++padding: 40px;',
//   cardStyle: '++box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12); border-radius: 20px;',
//   titleStyle: '++color: #00bfa5;'
// });

// 3秒后更新内容
// setTimeout(() => {
//   welcome.update({
//     title: '新的标题',
//     badge: '专业认证服务'
//   });
// }, 3000);