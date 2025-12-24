class ExInputModal {
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
  
    constructor({
      type = "textplain", // 新增：输入类型 'phonenum' | 'textplain'
      title = "请输入内容",
      label = "请输入信息",
      placeholder = "请输入",
      submitText = "确认",
      successText = "提交成功！",
      inputValue = "",
      errorText = "", // 将根据type自动设置
      maxLength = null, // 新增：最大长度限制
      autoClose = 2000,
      overlayStyle = "",
      containerStyle = "",
      headerStyle = "",
      titleStyle = "",
      labelStyle = "",
      inputStyle = "",
      submitBtnStyle = "",
      closeBtnStyle = "",
      onSubmit = null,
      onClose = null
    } = {}) {
      
      this.type = type;
      this.title = title;
      this.label = label;
      this.placeholder = placeholder;
      this.submitText = submitText;
      this.successText = successText;
      this.inputValue = inputValue;
      this.maxLength = maxLength || (type === "phonenum" ? 11 : null);
      this.autoClose = autoClose;
      this.onSubmit = onSubmit;
      this.onClose = onClose;
      
      // 根据类型设置默认错误文本
      if (!errorText) {
        this.errorText = type === "phonenum" ? "请输入正确的手机号码" : "请输入有效内容";
      } else {
        this.errorText = errorText;
      }
  
      // 处理用户样式
      this.overlayStyle = this.#processUserStyle(overlayStyle);
      this.containerStyle = this.#processUserStyle(containerStyle);
      this.headerStyle = this.#processUserStyle(headerStyle);
      this.titleStyle = this.#processUserStyle(titleStyle);
      this.labelStyle = this.#processUserStyle(labelStyle);
      this.inputStyle = this.#processUserStyle(inputStyle);
      this.submitBtnStyle = this.#processUserStyle(submitBtnStyle);
      this.closeBtnStyle = this.#processUserStyle(closeBtnStyle);
  
      // 唯一 ID
      this.instanceId = `ex-input-modal-${ExInputModal.instanceCount++}`;
      this.overlayId = `ex-input-overlay-${this.instanceId}`;
      this.modalId = `ex-input-container-${this.instanceId}`;
  
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
        #${this.overlayId}.ex-input-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          ${this.overlayStyle}
        }
  
        #${this.overlayId}.ex-input-overlay.show {
          opacity: 1;
          visibility: visible;
        }
  
        #${this.overlayId}.ex-input-overlay.show #${this.modalId} {
          transform: translateY(0);
        }
  
        #${this.modalId}.ex-input-modal {
          background: white;
          border-radius: 20px 20px 0 0;
          width: 100%;
          max-width: 500px;
          padding: 24px;
          box-sizing: border-box;
          transform: translateY(100%);
          transition: transform 0.3s ease;
          ${this.containerStyle}
        }
  
        #${this.modalId} .ex-input-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          ${this.headerStyle}
        }
  
        #${this.modalId} .ex-input-title {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          ${this.titleStyle}
        }
  
        #${this.modalId} .ex-input-close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f0f0f0;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #5a6c7d;
          user-select: none;
          transition: background 0.2s ease;
          ${this.closeBtnStyle}
        }
  
        #${this.modalId} .ex-input-close-btn:active {
          background: #e0e0e0;
          transform: scale(0.95);
        }
  
        #${this.modalId} .ex-input-group {
          margin-bottom: 20px;
        }
  
        #${this.modalId} .ex-input-label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #5a6c7d;
          font-weight: 500;
          ${this.labelStyle}
        }
  
        #${this.modalId} .ex-input-field {
          width: 100%;
          padding: 16px;
          font-size: 18px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          outline: none;
          transition: border-color 0.3s;
          box-sizing: border-box;
          ${this.inputStyle}
        }
  
        #${this.modalId} .ex-input-field:focus {
          border-color: #00bfa5;
        }
  
        #${this.modalId} .ex-input-field::placeholder {
          color: #ccc;
        }
  
        #${this.modalId} .ex-input-error {
          color: #ff3b30;
          font-size: 13px;
          margin-top: 8px;
          display: none;
        }
  
        #${this.modalId} .ex-input-error.show {
          display: block;
        }
  
        #${this.modalId} .ex-input-submit {
          width: 100%;
          padding: 16px;
          font-size: 18px;
          font-weight: 600;
          background: #00bfa5;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          margin-top: 16px;
          transition: background 0.2s ease;
          box-sizing: border-box;
          ${this.submitBtnStyle}
        }
  
        #${this.modalId} .ex-input-submit:active {
          background: #00a991;
          transform: scale(0.98);
        }
  
        #${this.modalId} .ex-input-submit:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
  
        #${this.modalId} .ex-input-success {
          text-align: center;
          padding: 20px;
          display: none;
        }
  
        #${this.modalId} .ex-input-success.show {
          display: block;
        }
  
        #${this.modalId} .ex-input-success-icon {
          font-size: 60px;
          color: #00d4aa;
          margin-bottom: 16px;
        }
  
        #${this.modalId} .ex-input-success-text {
          font-size: 18px;
          color: #2c3e50;
          font-weight: 600;
        }
      `;
  
      style.textContent = this.keepAfterOverride(styleText);
      document.head.appendChild(style);
    }
  
    render() {
      this.overlay = document.createElement("div");
      this.overlay.id = this.overlayId;
      this.overlay.className = "ex-input-overlay";
  
      const inputType = this.type === "phonenum" ? "tel" : "text";
      const inputMode = this.type === "phonenum" ? 'inputmode="numeric"' : "";
      const maxLengthAttr = this.maxLength ? `maxlength="${this.maxLength}"` : "";
  
      this.overlay.innerHTML = `
        <div id="${this.modalId}" class="ex-input-modal">
          <div class="ex-input-form-content">
            <div class="ex-input-header">
              <h2 class="ex-input-title">${this.title}</h2>
              <button class="ex-input-close-btn">×</button>
            </div>
  
            <div class="ex-input-group">
              <label class="ex-input-label">${this.label}</label>
              <input 
                type="${inputType}" 
                class="ex-input-field" 
                placeholder="${this.placeholder}"
                ${maxLengthAttr}
                value="${this.inputValue}"
                ${inputMode}
              >
              <div class="ex-input-error">${this.errorText}</div>
            </div>
  
            <button class="ex-input-submit">${this.submitText}</button>
          </div>
  
          <div class="ex-input-success">
            <div class="ex-input-success-icon">✓</div>
            <div class="ex-input-success-text">${this.successText}</div>
          </div>
        </div>
      `;
  
      document.body.appendChild(this.overlay);
  
      this.modal = this.overlay.querySelector(`#${this.modalId}`);
      this.formContent = this.modal.querySelector(".ex-input-form-content");
      this.successContent = this.modal.querySelector(".ex-input-success");
      this.closeBtn = this.modal.querySelector(".ex-input-close-btn");
      this.input = this.modal.querySelector(".ex-input-field");
      this.errorMsg = this.modal.querySelector(".ex-input-error");
      this.submitBtn = this.modal.querySelector(".ex-input-submit");
  
      this.bindEvents();
    }
  
    bindEvents() {
      // 关闭按钮
      this.closeBtn.addEventListener("click", () => this.hide("manuallyClosed"));
  
      // 点击遮罩关闭
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) this.hide("manuallyClosed");
      });
  
      // 提交按钮
      this.submitBtn.addEventListener("click", () => this.submit());
  
      // 输入验证
      this.input.addEventListener("input", (e) => {
        // 只有在 phonenum 类型时才过滤非数字字符
        if (this.type === "phonenum") {
          e.target.value = e.target.value.replace(/\D/g, "");
        }
        
        if (e.target.value.length > 0) {
          this.errorMsg.classList.remove("show");
          this.input.style.borderColor = "#e0e0e0";
        }
      });
  
      // 回车提交
      this.input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.submit();
      });
    }
  
    validatePhone(phone) {
      const regex = /^1[3-9]\d{9}$/;
      return regex.test(phone);
    }
  
    validateInput(value) {
      // 根据类型进行不同的验证
      if (this.type === "phonenum") {
        return this.validatePhone(value);
      } else if (this.type === "textplain") {
        // 纯文本类型：只要不为空即可
        return value.trim().length > 0;
      }
      return true;
    }
  
    submit() {
      const value = this.input.value.trim();
  
      if (!this.validateInput(value)) {
        this.errorMsg.classList.add("show");
        this.input.style.borderColor = "#ff3b30";
        return;
      }
  
      this.errorMsg.classList.remove("show");
      this.input.style.borderColor = "#e0e0e0";
  
      // 回调函数
      if (this.onSubmit) {
        this.onSubmit(value);
      }
  
      // 显示成功消息
      this.formContent.style.display = "none";
      this.successContent.classList.add("show");
  
      // 自动关闭
      if (this.autoClose) {
        setTimeout(() => {
          this.hide();
        }, this.autoClose);
      }
    }
  
    show() {
      this.overlay.classList.add("show");
      setTimeout(() => {
        this.input.focus();
      }, 300);
    }
  
    hide(manuallyClosed="") {
      this.overlay.classList.remove("show");
      
      if (this.onClose) {
        this.onClose(manuallyClosed);
      }
  
      setTimeout(() => {
        this.reset();
      }, 300);
    }
  
    reset() {
      this.input.value = "";
      this.errorMsg.classList.remove("show");
      this.input.style.borderColor = "#e0e0e0";
      this.formContent.style.display = "block";
      this.successContent.classList.remove("show");
    }
  
    remove() {
      this.overlay?.remove();
      const style = document.getElementById(`${this.instanceId}-style`);
      style?.remove();
    }
  }
  
// ========== 使用示例 ==========
  
// // 示例1：手机号码输入框
// const phoneModal = new ExInputModal({
//   type: "phonenum",
//   title: "绑定手机号",
//   label: "使用该服务必须绑定手机号码",
//   placeholder: "请输入11位手机号码",
//   submitText: "立即绑定",
//   successText: "绑定成功！",
//   autoClose: 2000,
  
//   onSubmit: (phone) => {
//     console.log("提交的手机号:", phone);
//   },
  
//   onClose: (reason) => {
//     console.log("弹窗关闭原因:", reason);
//   }
// });

// // 示例2：纯文本输入框（不验证格式，只要有内容即可）
// const textModal = new ExInputModal({
//   type: "textplain",
//   title: "请输入您的昵称",
//   label: "为了更好的服务体验，请设置昵称",
//   placeholder: "请输入昵称",
//   submitText: "确认",
//   successText: "设置成功！",
//   maxLength: 20,
//   autoClose: 2000,
  
//   // 自定义样式
//   submitBtnStyle: `++
//     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//     box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
//   `,
  
//   onSubmit: (nickname) => {
//     console.log("提交的昵称:", nickname);
//   }
// });

// 调用显示
// phoneModal.show();
// textModal.show();