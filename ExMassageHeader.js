/**
 * ExMassageHeader - 幸福按摩网站标题栏组件
 * 
 * @example
 * // 基础使用
 * const header = new ExMassageHeader({
 *   title: '幸福按摩',
 *   slogan: '专业·舒适·贴心',
 *   showNav: true,
 *   navItems: ['首页', '服务项目', '技师团队', '预约服务', '关于我们'],
 *   onNavClick: (item, index) => console.log('点击:', item),
 *   onLogoClick: () => console.log('返回首页')
 * });
 * 
 * // 自定义样式
 * const header2 = new ExMassageHeader({
 *   headerStyle: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
 *   logoStyle: 'width: 45px; height: 45px;',
 *   titleStyle: 'font-size: 22px; color: #fff;',
 *   navItemStyle: 'padding: 10px 20px;'
 * });
 * 
 * // 覆盖样式
 * const header3 = new ExMassageHeader({
 *   headerStyle: '++box-shadow: 0 4px 12px rgba(0, 191, 165, 0.5);'
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
      showNav = true,
      navItems = ['首页', '服务项目', '技师团队', '预约服务', '关于我们'],
      defaultActiveIndex = 0,
      onNavClick = null,
      onLogoClick = null,
      headerStyle = '',
      logoStyle = '',
      titleStyle = '',
      sloganStyle = '',
      navMenuStyle = '',
      navItemStyle = '',
      menuToggleStyle = ''
    } = options;

    this.target = target;
    this.title = title;
    this.slogan = slogan;
    this.showNav = showNav;
    this.navItems = navItems;
    this.activeIndex = defaultActiveIndex;
    this.onNavClick = onNavClick;
    this.onLogoClick = onLogoClick;

    // 处理用户自定义样式
    this.headerStyle = this.#processUserStyle(headerStyle);
    this.logoStyle = this.#processUserStyle(logoStyle);
    this.titleStyle = this.#processUserStyle(titleStyle);
    this.sloganStyle = this.#processUserStyle(sloganStyle);
    this.navMenuStyle = this.#processUserStyle(navMenuStyle);
    this.navItemStyle = this.#processUserStyle(navItemStyle);
    this.menuToggleStyle = this.#processUserStyle(menuToggleStyle);

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

      .ex-massage-nav-menu {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ex-massage-nav-item {
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        user-select: none;
      }

      .ex-massage-nav-item:active {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(0.95);
      }

      .ex-massage-nav-item.active {
        background: white;
        color: #00bfa5;
        font-weight: 600;
      }

      .ex-massage-menu-toggle {
        display: none;
        width: 36px;
        height: 36px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .ex-massage-menu-toggle svg {
        width: 20px;
        height: 20px;
      }

      .ex-massage-menu-toggle:active {
        transform: scale(0.95);
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

        .ex-massage-nav-menu {
          display: none;
          position: absolute;
          top: 56px;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #00bfa5 0%, #00d4aa 100%);
          flex-direction: column;
          padding: 12px 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .ex-massage-nav-menu.active {
          display: flex;
        }

        .ex-massage-nav-item {
          width: 100%;
          text-align: center;
          padding: 12px;
          box-sizing: border-box;
        }

        .ex-massage-menu-toggle {
          display: flex;
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
      #${this.headerId} .ex-massage-nav-menu {
        ${this.navMenuStyle}
      }
      #${this.headerId} .ex-massage-nav-item {
        ${this.navItemStyle}
      }
      #${this.headerId} .ex-massage-menu-toggle {
        ${this.menuToggleStyle}
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

    const navHtml = this.showNav ? `
      <nav class="ex-massage-nav-menu" id="${this.headerId}-nav">
        ${this.navItems.map((item, index) => `
          <div class="ex-massage-nav-item ${index === this.activeIndex ? 'active' : ''}" data-index="${index}">
            ${item}
          </div>
        `).join('')}
      </nav>
      <button class="ex-massage-menu-toggle">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21M3 6H21M3 18H21" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    ` : '';

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
        ${navHtml}
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

    if (!this.showNav) return;

    // 导航项点击事件
    const navItems = this.headerEl.querySelectorAll('.ex-massage-nav-item');
    navItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // 更新激活状态
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        this.activeIndex = index;

        // 关闭移动端菜单
        const navMenu = this.headerEl.querySelector('.ex-massage-nav-menu');
        if (navMenu) {
          navMenu.classList.remove('active');
        }

        // 触发回调
        if (this.onNavClick) {
          this.onNavClick(this.navItems[index], index);
        }
      });
    });

    // 移动端菜单按钮
    const menuToggle = this.headerEl.querySelector('.ex-massage-menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const navMenu = this.headerEl.querySelector('.ex-massage-nav-menu');
        if (navMenu) {
          navMenu.classList.toggle('active');
        }
      });
    }

    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
      const navMenu = this.headerEl.querySelector('.ex-massage-nav-menu');
      if (navMenu && !this.headerEl.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }

  /**
   * 设置激活的导航项
   */
  setActive(index) {
    if (index < 0 || index >= this.navItems.length) return;
    
    const navItems = this.headerEl.querySelectorAll('.ex-massage-nav-item');
    navItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    this.activeIndex = index;
  }

  /**
   * 显示/隐藏导航
   */
  toggleNav(show) {
    const navMenu = this.headerEl.querySelector('.ex-massage-nav-menu');
    const menuToggle = this.headerEl.querySelector('.ex-massage-menu-toggle');
    
    if (show) {
      if (navMenu) navMenu.style.display = 'flex';
      if (menuToggle) menuToggle.style.display = 'flex';
      this.showNav = true;
    } else {
      if (navMenu) navMenu.style.display = 'none';
      if (menuToggle) menuToggle.style.display = 'none';
      this.showNav = false;
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
// const header1 = new ExMassageHeader({
//   onNavClick: (item, index) => {
//     console.log(`点击了: ${item}, 索引: ${index}`);
//   },
//   onLogoClick: () => {
//     console.log('返回首页');
//   }
// });

// // 自定义样式示例
// const header2 = new ExMassageHeader({
//   target: document.body,
//   showNav: true,
//   headerStyle: '++box-shadow: 0 4px 12px rgba(0, 191, 165, 0.5);',
//   navItemStyle: '++font-size: 15px;'
// });

// // 3秒后切换导航可见性
// setTimeout(() => {
//   header1.toggleNav(false);
//   console.log('隐藏导航');
// }, 3000);

// setTimeout(() => {
//   header1.toggleNav(true);
//   console.log('显示导航');
// }, 6000);