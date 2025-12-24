/**
 * ExMessagePopup - 移动端信息弹窗组件
 * 
 * @example
 * // 使用默认图标
 * const result = await ExMessagePopup.show({
 *   type: 'info',
 *   title: '提示',
 *   message: '这是一条信息',
 *   dismissible: true,
 *   duration: 5000
 * });
 * 
 * // 自定义单个 SVG 图标
 * await ExMessagePopup.show({
 *   type: 'success',
 *   title: '成功',
 *   message: '操作成功',
 *   icon: '<svg>...</svg>'
 * });
 * 
 * // 批量自定义所有类型图标
 * await ExMessagePopup.show({
 *   type: 'warn',
 *   title: '警告',
 *   message: '请注意',
 *   icons: {
 *     info: '...',
 *     success: '...',
 *     warn: '...',
 *     error: '...'
 *   }
 * });
 */
class ExMessagePopup {
  static instanceCount = 0;
  static styleInjected = false;

  // SVG 图标定义
  static icon_info = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
    <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  static icon_success = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
    <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  static icon_warn = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 20H22L12 2Z" fill="currentColor" opacity="0.2"/>
    <path d="M12 9V13M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  static icon_error = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
    <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

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
  static #processUserStyle(style) {
    if (!style) return "";
    if (style.startsWith("++")) return "userStyle:add;\n" + style.slice(2);
    return "userStyle:override;\n" + style;
  }

  /**
   * 设置 SVG 样式
   */
  static setSvgStyle(svgString, style = "") {
    if (!style) return svgString;
    return svgString.replace(/<svg/, `<svg style="${style}"`);
  }

  /**
   * 注入全局样式(只执行一次)
   */
  static injectGlobalStyle() {
    if (this.styleInjected) return;

    const style = document.createElement("style");
    style.id = "ex-message-popup-global-style";
    const styleText = `
      .ex-message-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        user-select: none;
      }

      .ex-message-overlay.show {
        opacity: 1;
        visibility: visible;
      }

      .ex-message-box {
        background: white;
        border-radius: 16px;
        padding: 24px;
        width: 100%;
        max-width: 340px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: scale(0.8) translateY(20px);
        transition: transform 0.3s ease;
        box-sizing: border-box;
      }

      .ex-message-overlay.show .ex-message-box {
        transform: scale(1) translateY(0);
      }

      .ex-message-header {
        text-align: center;
        margin-bottom: 20px;
      }

      .ex-message-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
      }

      .ex-message-icon svg {
        width: 36px;
        height: 36px;
      }

      .ex-message-icon.info {
        background: linear-gradient(135deg, #e3f2fd, #bbdefb);
        color: #2196F3;
      }

      .ex-message-icon.success {
        background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
        color: #4CAF50;
      }

      .ex-message-icon.warn {
        background: linear-gradient(135deg, #fff3e0, #ffe0b2);
        color: #ff9800;
      }

      .ex-message-icon.error {
        background: linear-gradient(135deg, #ffebee, #ffcdd2);
        color: #f44336;
      }

      .ex-message-title {
        font-size: 20px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px;
      }

      .ex-message-content {
        color: #5a6c7d;
        font-size: 15px;
        line-height: 1.6;
        text-align: center;
        margin-bottom: 24px;
        word-wrap: break-word;
        overflow: hidden;
      }

      .ex-message-actions {
        display: flex;
        gap: 10px;
      }

      .ex-message-button {
        flex: 1;
        padding: 14px;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease;
        user-select: none;
        min-height: 44px;
        box-sizing: border-box;
      }

      .ex-message-button:active {
        transform: scale(0.95);
      }

      .ex-message-button.primary {
        background: linear-gradient(135deg, #00d4aa, #00bfa5);
        color: white;
        box-shadow: 0 4px 12px rgba(0, 212, 170, 0.4);
      }

      .ex-message-button.secondary {
        background: #f5f5f5;
        color: #5a6c7d;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    `;
    style.textContent = styleText;
    document.head.appendChild(style);
    this.styleInjected = true;
  }

  /**
   * 注入实例样式
   */
  injectInstanceStyle() {
    const style = document.createElement("style");
    style.id = `${this.instanceId}-style`;
    let styleText = `
      #${this.overlayId}.ex-message-overlay {
        ${this.overlayStyle}
      }
      #${this.overlayId} .ex-message-box {
        ${this.containerStyle}
      }
      #${this.overlayId} .ex-message-icon {
        ${this.iconStyle}
      }
      #${this.overlayId} .ex-message-title {
        ${this.titleStyle}
      }
      #${this.overlayId} .ex-message-content {
        ${this.contentStyle}
      }
      #${this.overlayId} .ex-message-button.primary {
        ${this.confirmBtnStyle}
      }
      #${this.overlayId} .ex-message-button.secondary {
        ${this.cancelBtnStyle}
      }
    `;
    style.textContent = ExMessagePopup.keepAfterOverride(styleText);
    document.head.appendChild(style);
    this.styleElement = style;
  }

  constructor(options = {}) {
    const {
      type = 'info',
      title = '提示',
      message = '',
      dismissible = true,
      duration = 0,
      confirmBtnText = '确认',
      cancelBtnText = '取消',
      confirmBtnCallback = null,
      icon = null,
      icons = null,
      overlayStyle = '',
      containerStyle = '',
      iconStyle = '',
      titleStyle = '',
      contentStyle = '',
      confirmBtnStyle = '',
      cancelBtnStyle = ''
    } = options;

    // 处理用户自定义样式
    this.overlayStyle = ExMessagePopup.#processUserStyle(overlayStyle);
    this.containerStyle = ExMessagePopup.#processUserStyle(containerStyle);
    this.iconStyle = ExMessagePopup.#processUserStyle(iconStyle);
    this.titleStyle = ExMessagePopup.#processUserStyle(titleStyle);
    this.contentStyle = ExMessagePopup.#processUserStyle(contentStyle);
    this.confirmBtnStyle = ExMessagePopup.#processUserStyle(confirmBtnStyle);
    this.cancelBtnStyle = ExMessagePopup.#processUserStyle(cancelBtnStyle);

    this.confirmBtnCallback = confirmBtnCallback;
    this.confirmBtnText = confirmBtnText;
    this.cancelBtnText = cancelBtnText;
    this.type = type;
    this.title = title;
    this.message = message;
    this.dismissible = dismissible;
    this.duration = duration;

    // 唯一 ID
    this.instanceId = `ex-message-${ExMessagePopup.instanceCount++}`;
    this.overlayId = `ex-message-overlay-${this.instanceId}`;

    // 默认 SVG 图标映射
    this.defaultIcons = {
      info: ExMessagePopup.icon_info,
      success: ExMessagePopup.icon_success,
      warn: ExMessagePopup.icon_warn,
      error: ExMessagePopup.icon_error
    };

    // 用户自定义图标(支持 SVG、HTML)
    if (icons) {
      this.icons = { ...this.defaultIcons, ...icons };
    } else {
      this.icons = this.defaultIcons;
    }

    // 单个图标优先级最高
    if (icon) {
      this.customIcon = icon;
    }

    // 注入样式
    ExMessagePopup.injectGlobalStyle();
    this.injectInstanceStyle();
  }

  /**
   * 渲染弹窗
   */
  render() {
    return new Promise((resolve) => {
      this.resolve = resolve;

      // 创建遮罩层
      this.overlay = document.createElement('div');
      this.overlay.id = this.overlayId;
      this.overlay.className = 'ex-message-overlay';

      // 渲染 HTML
      this.overlay.innerHTML = `
        <div class="ex-message-box">
          <div class="ex-message-header">
            <div class="ex-message-icon ${this.type}">
              ${this.customIcon || this.icons[this.type] || this.icons.info}
            </div>
            <div class="ex-message-title">${this.title}</div>
          </div>
          <div class="ex-message-content">${this.message}</div>
          <div class="ex-message-actions">
            <button class="ex-message-button secondary" data-action="cancel">${this.cancelBtnText}</button>
            <button class="ex-message-button primary" data-action="confirm">${this.confirmBtnText}</button>
          </div>
        </div>
      `;

      document.body.appendChild(this.overlay);

      // 获取元素
      this.messageBox = this.overlay.querySelector('.ex-message-box');

      // 绑定事件
      this.bindEvents();

      // 显示动画
      setTimeout(() => {
        this.overlay.classList.add('show');
      }, 10);

      // 自动关闭
      if (this.duration > 0) {
        this.autoCloseTimer = setTimeout(() => {
          this.close('auto');
        }, this.duration);
      }
    });
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    this.overlay.addEventListener('click', (e) => {
      const button = e.target.closest('.ex-message-button');
      if (button) {
        const action = button.dataset.action;
        if (action === 'confirm' && this.confirmBtnCallback) {
          this.confirmBtnCallback();
        }
        this.close(action);
        return;
      }

      // 点击外部关闭
      if (this.dismissible && e.target === this.overlay) {
        this.close('dismiss');
      }
    });
  }

  /**
   * 关闭弹窗
   */
  close(result) {
    if (this.closed) return;
    this.closed = true;

    // 清除自动关闭定时器
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }

    // 隐藏动画
    this.overlay.classList.remove('show');
    this.remove();
    this.resolve(result);
  }

  /**
   * 移除弹窗
   */
  remove() {
    this.overlay?.remove();
    this.styleElement?.remove();
    this.overlay = null;
    this.styleElement = null;
  }

  /**
   * 静态方法:显示弹窗
   */
  static show(options) {
    const popup = new ExMessagePopup(options);
    return popup.render();
  }

  /**
   * 快捷方法:信息弹窗
   */
  static info(message, title = '信息', options = {}) {
    return this.show({ type: 'info', title, message, ...options });
  }

  /**
   * 快捷方法:成功弹窗
   */
  static success(message, title = '成功', options = {}) {
    return this.show({ type: 'success', title, message, ...options });
  }

  /**
   * 快捷方法:警告弹窗
   */
  static warn(message, title = '警告', options = {}) {
    return this.show({ type: 'warn', title, message, ...options });
  }

  /**
   * 快捷方法:错误弹窗
   */
  static error(message, title = '错误', options = {}) {
    return this.show({ type: 'error', title, message, ...options });
  }
}

// // 使用示例
// (async () => {
//   // 基础使用
//   await ExMessagePopup.info('这是一条信息提示');
  
//   // 成功提示
//   await ExMessagePopup.success('操作成功完成!');
  
//   // 警告提示
//   await ExMessagePopup.warn('请注意检查您的输入');
  
//   // 错误提示
//   const result = await ExMessagePopup.error('发生了一个错误', '错误', {
//     dismissible: true,
//     duration: 3000
//   });
  
//   console.log('用户操作:', result);
// })();