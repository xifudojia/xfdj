class ExPhoneModal {
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
      title = "输入电话号码",
      placeholder = "请输入11位手机号码",
      submitText = "确认",
      successText = "提交成功！",
      phoneValue = "",
      errorText = "请输入正确的手机号码",
      autoClose = 2000,
      overlayStyle = "",
      containerStyle = "",
      headerStyle = "",
      titleStyle = "",
      inputStyle = "",
      submitBtnStyle = "",
      closeBtnStyle = "",
      onSubmit = null,
      onClose = null
    } = {}) {
      
      this.title = title;
      this.placeholder = placeholder;
      this.submitText = submitText;
      this.successText = successText;
      this.errorText = errorText;
      this.phoneValue=phoneValue;
      this.autoClose = autoClose;
      this.onSubmit = onSubmit;
      this.onClose = onClose;
  
      // 处理用户样式
      this.overlayStyle = this.#processUserStyle(overlayStyle);
      this.containerStyle = this.#processUserStyle(containerStyle);
      this.headerStyle = this.#processUserStyle(headerStyle);
      this.titleStyle = this.#processUserStyle(titleStyle);
      this.inputStyle = this.#processUserStyle(inputStyle);
      this.submitBtnStyle = this.#processUserStyle(submitBtnStyle);
      this.closeBtnStyle = this.#processUserStyle(closeBtnStyle);
  
      // 唯一 ID
      this.instanceId = `ex-phone-modal-${ExPhoneModal.instanceCount++}`;
      this.overlayId = `ex-phone-overlay-${this.instanceId}`;
      this.modalId = `ex-phone-container-${this.instanceId}`;
  
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
        #${this.overlayId}.ex-phone-overlay {
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
  
        #${this.overlayId}.ex-phone-overlay.show {
          opacity: 1;
          visibility: visible;
        }
  
        #${this.overlayId}.ex-phone-overlay.show #${this.modalId} {
          transform: translateY(0);
        }
  
        #${this.modalId}.ex-phone-modal {
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
  
        #${this.modalId} .ex-phone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          ${this.headerStyle}
        }
  
        #${this.modalId} .ex-phone-title {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          ${this.titleStyle}
        }
  
        #${this.modalId} .ex-phone-close-btn {
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
  
        #${this.modalId} .ex-phone-close-btn:active {
          background: #e0e0e0;
          transform: scale(0.95);
        }
  
        #${this.modalId} .ex-phone-input-group {
          margin-bottom: 20px;
        }
  
        #${this.modalId} .ex-phone-label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #5a6c7d;
          font-weight: 500;
        }
  
        #${this.modalId} .ex-phone-input {
          width: 100%;
          padding: 16px;
          font-size: 18px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          outline: none;
          transition: border-color 0.3s;
          letter-spacing: 1px;
          box-sizing: border-box;
          ${this.inputStyle}
        }
  
        #${this.modalId} .ex-phone-input:focus {
          border-color: #00bfa5;
        }
  
        #${this.modalId} .ex-phone-input::placeholder {
          color: #ccc;
        }
  
        #${this.modalId} .ex-phone-error {
          color: #ff3b30;
          font-size: 13px;
          margin-top: 8px;
          display: none;
        }
  
        #${this.modalId} .ex-phone-error.show {
          display: block;
        }
  
        #${this.modalId} .ex-phone-submit {
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
  
        #${this.modalId} .ex-phone-submit:active {
          background: #00a991;
          transform: scale(0.98);
        }
  
        #${this.modalId} .ex-phone-submit:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
  
        #${this.modalId} .ex-phone-success {
          text-align: center;
          padding: 20px;
          display: none;
        }
  
        #${this.modalId} .ex-phone-success.show {
          display: block;
        }
  
        #${this.modalId} .ex-phone-success-icon {
          font-size: 60px;
          color: #00d4aa;
          margin-bottom: 16px;
        }
  
        #${this.modalId} .ex-phone-success-text {
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
      this.overlay.className = "ex-phone-overlay";
  
      this.overlay.innerHTML = `
        <div id="${this.modalId}" class="ex-phone-modal">
          <div class="ex-phone-form-content">
            <div class="ex-phone-header">
              <h2 class="ex-phone-title">${this.title}</h2>
              <button class="ex-phone-close-btn">×</button>
            </div>
  
            <div class="ex-phone-input-group">
              <label class="ex-phone-label">使用这该服务必须绑定手机号码</label>
              <input 
                type="tel" 
                class="ex-phone-input" 
                placeholder="${this.placeholder}"
                maxlength="11"
                value="${this.phoneValue}"
                inputmode="numeric"
              >
              <div class="ex-phone-error">${this.errorText}</div>
            </div>
  
            <button class="ex-phone-submit">${this.submitText}</button>
          </div>
  
          <div class="ex-phone-success">
            <div class="ex-phone-success-icon">✓</div>
            <div class="ex-phone-success-text">${this.successText}</div>
          </div>
        </div>
      `;
  
      document.body.appendChild(this.overlay);
  
      this.modal = this.overlay.querySelector(`#${this.modalId}`);
      this.formContent = this.modal.querySelector(".ex-phone-form-content");
      this.successContent = this.modal.querySelector(".ex-phone-success");
      this.closeBtn = this.modal.querySelector(".ex-phone-close-btn");
      this.input = this.modal.querySelector(".ex-phone-input");
      this.errorMsg = this.modal.querySelector(".ex-phone-error");
      this.submitBtn = this.modal.querySelector(".ex-phone-submit");
  
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
        e.target.value = e.target.value.replace(/\D/g, "");
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
  
    submit() {
      const phone = this.input.value.trim();
  
      if (!this.validatePhone(phone)) {
        this.errorMsg.classList.add("show");
        this.input.style.borderColor = "#ff3b30";
        return;
      }
  
      this.errorMsg.classList.remove("show");
      this.input.style.borderColor = "#e0e0e0";
  
      // 回调函数
      if (this.onSubmit) {
        this.onSubmit(phone);
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
  
//   // ========== 使用示例 ==========
  
//   // 创建实例
//   const phoneModal = new ExPhoneModal({
//     title: "绑定手机号",
//     placeholder: "请输入手机号码",
//     submitText: "立即绑定",
//     successText: "绑定成功！",
//     autoClose: 2000,
    
//     // 自定义样式（覆盖）
//     containerStyle: `
//       max-width: 400px;
//       border-radius: 16px 16px 0 0;
//     `,
    
//     // 自定义样式（追加）
//     submitBtnStyle: `++
//       background: linear-gradient(135deg, #00d4aa 0%, #00bfa5 100%);
//       box-shadow: 0 4px 15px rgba(0, 191, 165, 0.3);
//     `,
    
//     // 提交回调
//     onSubmit: (phone) => {
//       console.log("提交的手机号:", phone);
//       // 这里可以发送到服务器
//     },
    
//     // 关闭回调
//     onClose: () => {
//       console.log("弹窗已关闭");
//     }
//   });
  
//   // 直接显示弹窗
//   phoneModal.show();
  