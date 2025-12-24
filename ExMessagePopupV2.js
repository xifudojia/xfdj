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
 *   icon: '<svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
 * });
 * 
 * // 批量自定义所有类型图标
 * await ExMessagePopup.show({
 *   type: 'warn',
 *   title: '警告',
 *   message: '请注意',
 *   icons: {
 *     info: '<svg>...</svg>',
 *     success: '<svg>...</svg>',
 *     warn: '<svg>...</svg>',
 *     error: '<svg>...</svg>'
 *   }
 * });
 * 
 * if (result === 'confirm') console.log('用户点击了确认');
 * else if (result === 'cancel') console.log('用户点击了取消');
 */

class ExMessagePopup {
    static instanceCount = 0;
    static styleInjected = false;

    static icon_chat_info = `<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#B7B7B7"><path d="M479.99-689.33q15.01 0 25.18-10.16 10.16-10.15 10.16-25.17 0-15.01-10.15-25.17Q495.02-760 480.01-760q-15.01 0-25.18 10.15-10.16 10.16-10.16 25.17 0 15.01 10.15 25.18 10.16 10.17 25.17 10.17Zm-33.32 324.66h66.66V-612h-66.66v247.33ZM80-80v-733.33q0-27 19.83-46.84Q119.67-880 146.67-880h666.66q27 0 46.84 19.83Q880-840.33 880-813.33v506.66q0 27-19.83 46.84Q840.33-240 813.33-240H240L80-80Zm131.33-226.67h602v-506.66H146.67v575l64.66-68.34Zm-64.66 0v-506.66 506.66Z"/></svg>`;
    static icon_info = `<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#B7B7B7"><path d="M448.67-280h66.66v-240h-66.66v240Zm31.32-316q15.01 0 25.18-9.97 10.16-9.96 10.16-24.7 0-15.3-10.15-25.65-10.16-10.35-25.17-10.35-15.01 0-25.18 10.35-10.16 10.35-10.16 25.65 0 14.74 10.15 24.7 10.16 9.97 25.17 9.97Zm.19 516q-82.83 0-155.67-31.5-72.84-31.5-127.18-85.83Q143-251.67 111.5-324.56T80-480.33q0-82.88 31.5-155.78Q143-709 197.33-763q54.34-54 127.23-85.5T480.33-880q82.88 0 155.78 31.5Q709-817 763-763t85.5 127Q880-563 880-480.18q0 82.83-31.5 155.67Q817-251.67 763-197.46q-54 54.21-127 85.84Q563-80 480.18-80Zm.15-66.67q139 0 236-97.33t97-236.33q0-139-96.87-236-96.88-97-236.46-97-138.67 0-236 96.87-97.33 96.88-97.33 236.46 0 138.67 97.33 236 97.33 97.33 236.33 97.33ZM480-480Z"/></svg>`;
    static icon_cancel = `<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#B7B7B7"><path d="m332-285.33 148-148 148 148L674.67-332l-148-148 148-148L628-674.67l-148 148-148-148L285.33-628l148 148-148 148L332-285.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg>`;
    static icon_ok = `<svg width="32" height="32" viewBox="0 0 24 24">
    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
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
     * 注入全局样式（只执行一次）
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
          font-size: 32px;
          margin-bottom: 12px;
        }
  
        .ex-message-icon.info {
          background: linear-gradient(135deg, #e3f2fd, #bbdefb);
          color: #00bfa5;
        }
  
        .ex-message-icon.success {
          background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
          color: #00d4aa;
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

        // 默认图标映射
        this.defaultIcons = {
            info: 'ℹ️',
            success: '✓',
            warn: '⚠️',
            error:  this.setSvgStyle(ExMessagePopup.icon_cancel, "fill: red;")
        };

        // 用户自定义图标（支持 emoji、SVG、HTML）
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


   setSvgStyle(svgElement, style = "") {
      return  svgElement.replace(/<svg/, `<svg   style="${style}"`);
  }
    /**
     * 绑定事件
     */
    bindEvents() {
        // 使用事件委托处理按钮点击
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

        // 阻止弹窗内部点击冒泡
        this.messageBox.addEventListener('click', (e) => {
            // e.stopPropagation();
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
        // 移除 DOM
        // setTimeout(() => {
        //     this.remove();
        //     this.resolve(result);
        // }, 1);
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
     * 静态方法：显示弹窗
     */
    static show(options) {
        const popup = new ExMessagePopup(options);
        return popup.render();
    }

    /**
     * 快捷方法：信息弹窗
     */
    static info(message, title = '信息', options = {}) {
        return this.show({ type: 'info', title, message, ...options });
    }

    /**
     * 快捷方法：成功弹窗
     */
    static success(message, title = '成功', options = {}) {
        return this.show({ type: 'success', title, message, ...options });
    }

    /**
     * 快捷方法：警告弹窗
     */
    static warn(message, title = '警告', options = {}) {
        return this.show({ type: 'warn', title, message, ...options });
    }

    /**
     * 快捷方法：错误弹窗
     */




    // static error(message, title = '错误', options = {}) {
    //   // 解构用户传入的 options，获取可能存在的 icon
    //   const { icon: userIcon } = options;
      
    //   // 确定最终使用的图标：用户提供了则用用户的，否则用默认图标
    //   const icon = userIcon || setSvgStyle(ExMessagePopup.icon_cancel, "fill: red;");
    
    //   // 将处理后的 icon 合并到选项中，传递给 show 方法
    //   return this.show({ 
    //     type: 'error', 
    //     title, 
    //     message, 
    //     icon,  // 这里覆盖或设置 icon
    //     ...options 
    //   });
    // }








    static error(message, title = '错误', options = {}) {


      // icon: setSvgStyle(ExMessagePopup.icon_cancel, "fill: red;")

        return this.show({ type: 'error', title, message, ...options });
    }
}