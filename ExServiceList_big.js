class ExServiceList_big {
    static instanceCount = 0;
  
    constructor(
      target,
      {
        data,
        containerStyle = "",
        cardStyle = "",
        onBook = null
      } = {}
    ) {
      if (!target) return;
  
      this.target = target;
      this.onBook = onBook;
  
      this.data = data || [
        {
          title: "泰式古法",
          duration: "60分钟",
          count: "超353538人选择",
          price: 219,
          img: "ht1tps://images.unsplash.com/photo-1600334129128-685c5582fd35"
        },
        {
          title: "精油开背",
          duration: "80分钟",
          count: "超440438人选择",
          price: 289,
          img: "ht1tps://images.unsplash.com/photo-1556228724-4b3a9d9a1c2f"
        },
        {
          title: "全身精油SPA",
          duration: "90分钟",
          count: "超277658人选择",
          price: 389,
          img: "h1ttps://images.unsplash.com/photo-1544161515-4ab6ce6db874"
        },
        {
          title: "精油SPA+热灸",
          duration: "100分钟",
          count: "超194819人选择",
          price: 489,
          img: "ht1tps://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
        }
      ];
  
      this.containerStyle = this.#processUserStyle(containerStyle);
      this.cardStyle = this.#processUserStyle(cardStyle);
  
      this.instanceId = `ex-massage-${ExServiceList_big.instanceCount++}`;
      this.rootId = `${this.instanceId}-root`;
  
      this.injectStyle();
      this.render();
    }
  
    #processUserStyle(style) {
      if (!style) return "";
      if (style.startsWith("++")) return "userStyle:add;\n" + style.slice(2);
      return "userStyle:override;\n" + style;
    }
  
    keepAfterOverride(cssText) {
      return cssText.replace(/([^{]+){([^}]*)}/g, (m, sel, body) => {
        const lines = body.split(";");
        const index = lines.findIndex(l => /userStyle\s*:\s*override/.test(l));
        if (index !== -1) {
          return `${sel}{\n${lines.slice(index).join(";\n")}\n}`;
        }
        return m;
      });
    }
  
    injectStyle() {
      const styleId = `${this.instanceId}-style`;
      if (document.getElementById(styleId)) return;
  
      const style = document.createElement("style");
      style.id = styleId;
  
      let css = `
  #${this.rootId}.ex-massage {
    width: 100%;
    box-sizing: border-box;
    user-select: none;
    ${this.containerStyle};
  }
  
  #${this.rootId} .ex-massage-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  #${this.rootId} .ex-massage-card {
    flex: 1;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,.08);
    overflow: hidden;
    ${this.cardStyle};
  }
  
  #${this.rootId} .ex-massage-img {
    position: relative;
    width: 100%;
    padding-top: 75%;
    background-color: #f2f2f2;
    background-size: cover;
    background-position: center;
  }
  
  #${this.rootId} .ex-massage-duration {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 6px 14px;
    font-size: 14px;
    color: #fff;
    background: rgba(0,0,0,.7);
    border-radius: 20px;
  }
  
  #${this.rootId} .ex-massage-content {
    padding: 14px;
  }
  
  #${this.rootId} .ex-massage-title {
    font-size: 1em;
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
  }
  
  #${this.rootId} .ex-massage-count {
    font-size: 12px;
    color: #999;
    margin-bottom: 12px;
  }
  
  #${this.rootId} .ex-massage-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  #${this.rootId} .ex-massage-price {
    font-size: 1.1em;
    font-weight: bold;
    color: #2ec5b6;
  }
  
  #${this.rootId} .ex-massage-btn {
    min-width: 44px;
    min-height: 44px;
    padding: 10px 26px;
    font-size: 1.1em;
    font-weight: 600;
    color: #fff;
    background: #2ec5b6;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  
  #${this.rootId} .ex-massage-btn:active {
    transform: scale(0.95);
  }
  `;
  
      style.textContent = this.keepAfterOverride(css);
      document.head.appendChild(style);
    }
  
    render() {
      this.rootEl = document.createElement("div");
      this.rootEl.id = this.rootId;
      this.rootEl.className = "ex-massage";
  
      let html = "";
      for (let i = 0; i < this.data.length; i += 2) {
        html += `
  <div class="ex-massage-row">
    ${this.#cardTpl(this.data[i], i)}
    ${this.data[i + 1] ? this.#cardTpl(this.data[i + 1], i + 1) : ""}
  </div>`;
      }
  
      this.rootEl.innerHTML = html;
      this.target.appendChild(this.rootEl);
  
      this.bindEvents();
    }
  
    #cardTpl(item, index) {
      return `
  <div class="ex-massage-card" data-index="${index}">
    <div class="ex-massage-img" style="background-image:url('${item.image || ""}')">
      <span class="ex-massage-duration">${item.duration}</span>
    </div>
    <div class="ex-massage-content">
      <div class="ex-massage-title">${item.title}</div>
      <div class="ex-massage-count">${item.count}</div>
      <div class="ex-massage-bottom">
        <div class="ex-massage-price">¥${item.price}</div>
        <button class="ex-massage-btn">预约</button>
      </div>
    </div>
  </div>`;
    }
  
    bindEvents() {
      this.rootEl.addEventListener("click", e => {
        const btn = e.target.closest(".ex-massage-btn");
        if (!btn) return;
  
        const card = btn.closest(".ex-massage-card");
        const index = card.dataset.index;
        const item = this.data[index];
  
        this.onBook?.({
          id: index,
          title: item.title,
          price: item.price,
          element: card
        });
      });
    }
  
    remove() {
      this.rootEl?.remove();
    }
  }
  

// import ExMassageService from "./ExServiceList_big.js";

// const service = new ExServiceList_big(document.getElementById("app"), {
//   onBook: ({ title, price }) => {
//     alert(`预约服务：${title}\n价格：${price}`);
//   }
// });
