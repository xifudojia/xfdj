export default class ExPopupWindow {
  static instanceCount = 0;

  constructor(
    userElement,
    {
      title = "弹窗",
      containerStyle = "",
      containerStyle2 = "",
      closable = true,
      overlayStyle = "",
      headerStyle = "",
      titleStyle = "",
      closeBtn_innerHTML = "&times;",
      closeBtnStyle = "",
      url = ""
    } = {}
  ) {


    // 保存参数
    this.userElement = userElement;
    this.url = url;
    this.title = title;
    this.closable = closable;
    this.closeBtn_innerHTML = closeBtn_innerHTML;

    // 用户样式处理
    this.closeBtnStyle = this.#processUserStyle(closeBtnStyle);
    this.containerStyle = this.#processUserStyle(containerStyle);
    this.containerStyle2 = this.#processUserStyle(containerStyle2);
    this.overlayStyle = this.#processUserStyle(overlayStyle);
    this.headerStyle = this.#processUserStyle(headerStyle);
    this.titleStyle = this.#processUserStyle(titleStyle);

    // 唯一 ID
    this.instanceId = `ex-popup-${ExPopupWindow.instanceCount++}`;
    this.overlayId = `ex-popup-overlay-${this.instanceId}`;
    this.containerId = `ex-popup-container-${this.instanceId}`;

    this.injectStyle();
    this.render();
  }

  // 样式处理
  #processUserStyle(style) {
    if (style?.startsWith("++")) return "userStyle:add;\n" + style.slice(2);
    else if (style) return "userStyle:override;\n" + style;
    return "";
  }

  // 保留 userStyle:override 逻辑
  keepAfterOverride(cssText) {
    return cssText.replace(/([^{]+){([^}]*)}/g, (match, selector, body) => {
      const lines = body.split(";");
      let index = -1;
      for (let i = 0; i < lines.length; i++) {
        if (/userStyle\s*:\s*override\s*;/.test(lines[i] + ";")) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        const newBody = lines.slice(index).map((l) => l.trimEnd()).join(";\n");
        return `${selector}{\n${newBody}\n}`;
      }
      return match;
    });
  }

  injectStyle() {
    const style = document.createElement("style");
    style.id = `${this.instanceId}-ex-popup-style`;

    let styleText = `
      /* 使用 ID + 类名保证实例样式唯一 */
      #${this.overlayId}.ex-popup-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;

        background: rgba(0,0,0,0.4);
        display: flex; justify-content: center; align-items: center;
        z-index: 9999;
        opacity: 0; visibility: hidden;
        transition: opacity 0.25s ease, visibility 0.25s ease;
        user-select: none;
        ${this.overlayStyle};
      }

      #${this.overlayId}.ex-popup-overlay.show {
        opacity: 1; visibility: visible;
      }

      #${this.overlayId}.ex-popup-overlay.show #${this.containerId} {
        transform: scale(1);
      }

      #${this.containerId}.ex-popup-container {
        max-width: 800px;
        width: 80%;
        height: 80%;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        overflow: hidden;
        transform: scale(0.98);
        transition: transform 0.25s ease;
        display: flex;
        flex-direction: column;
        position: fixed;
        border-radius: 16px;
        background: white;
        ${this.containerStyle};
      }

      #${this.containerId} .ex-popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background: #f9f9f9;
        border-bottom: 1px solid #eee;
        position: relative;
        ${this.headerStyle};
      }

      #${this.containerId} .ex-popup-title {
        font-weight: bold;
        font-size: 16px;
        color: #2c3e50;
        ${this.titleStyle};
      }

      #${this.containerId} .ex-popup-close {
        position: absolute;
        right: 25px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        user-select: none;
        transition: transform 0.2s ease;
        ${this.closeBtnStyle};
      }

   

      #${this.containerId} .ex-popup-content {
        flex: 1;
        color: #2c3e50;
        overflow-y: auto;
        box-sizing: border-box;
        padding: 0;
        ${this.containerStyle2};
      }

      #${this.containerId} .ex-popup-content iframe {
        width: 100%;
        height: 100%;
        border: none;
        display: block;
      }
    `;

    style.textContent = this.keepAfterOverride(styleText);
    document.head.appendChild(style);
  }

  render() {
    this.overlay = document.createElement("div");
    this.overlay.id = this.overlayId;
    this.overlay.className = "ex-popup-overlay";

    // 结构模板
    this.overlay.innerHTML = `
      <div id="${this.containerId}" class="ex-popup-container">
        <div class="ex-popup-header">
          <div class="ex-popup-title">${this.title}</div>
          ${this.closable
        ? `<span class="ex-popup-close">${this.closeBtn_innerHTML}</span>`
        : ""
      }
        </div>
        <div class="ex-popup-content"></div>
      </div>
    `;

    this.contentEl = this.overlay.querySelector(".ex-popup-content");

    // 如果传入了 url，用 iframe 加载
    if (this.url) {
      const iframe = document.createElement("iframe");
      iframe.src = this.url;
      iframe.setAttribute("loading", "lazy");
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms  allow-popups allow-popups-to-escape-sandbox");


      // sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">


      this.iframe = iframe;
      this.contentEl.appendChild(iframe);
    } else if (this.userElement) {
      this.contentEl.appendChild(this.userElement);
    }

    document.body.appendChild(this.overlay);

    this.container = this.overlay.querySelector(".ex-popup-container");
    this.closeBtn = this.overlay.querySelector(".ex-popup-close");

    this.bindEvents();
  }

  get_iframeElement() {
    return this.iframe;
  }

  getContainerId() {
    return this.containerId
  }


  updateUserElement(userElement) {
    this.userElement = userElement;
    this.contentEl.innerHTML = ``;
    this.contentEl.appendChild(userElement);
  }

  getcontentElement() {
    return this.contentEl;
  }


updateTitle(title) {
  this.title = title;
  this.geContainerElement(".ex-popup-title").innerHTML = title;
}

  updateiframe(url) {
    if (this.iframe) {
      this.iframe.src = url;
    }
  }

  bindEvents() {
    if (this.closable && this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.hide());
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) this.hide();
      });
    }
  }

  geContainerElement(ele = ".ex-popup-header") {
    return this.container.querySelector(ele);
  }

  show() {
    if (this.userElement) this.userElement.style.display = "block";
    this.overlay.classList.add("show");
  }

  hide() {
    this.overlay.classList.remove("show");
    if (this.userElement) this.userElement.style.display = "none";
  }

  remove() {
    this.overlay?.remove();
  }
}
