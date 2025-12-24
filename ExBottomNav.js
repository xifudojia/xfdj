class ExBottomNav {
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
      items = [],
      activeIndex = 0,
      navStyle = "",
      itemStyle = "",
      iconStyle = "",
      labelStyle = "",
      activeColor = "#4ECDC4",
      onItemClick = null
    } = {}
  ) {
    this.target = target || document.body;
    this.items = items.length > 0 ? items : this.#getDefaultItems();
    this.activeIndex = activeIndex;
    this.activeColor = activeColor;
    this.onItemClick = onItemClick;

    this.navStyle = this.#processUserStyle(navStyle);
    this.itemStyle = this.#processUserStyle(itemStyle);
    this.iconStyle = this.#processUserStyle(iconStyle);
    this.labelStyle = this.#processUserStyle(labelStyle);

    this.instanceId = `ex-bottom-nav-${ExBottomNav.instanceCount++}`;
    this.navId = `ex-nav-${this.instanceId}`;

    this.injectStyle();
    this.render();
  }

  #getDefaultItems() {
    return [
      { id: 'home', label: '首页', icon: 'home' },
      { id: 'teacher', label: '技师', icon: 'teacher' },
      { id: 'order', label: '订单', icon: 'order' },
      { id: 'profile', label: '我的', icon: 'profile' }
    ];
  }

  #processUserStyle(style) {
    if (style.startsWith("++")) return "userStyle:add;\n" + style.slice(2);
    else if (style) return "userStyle:override;\n" + style;
    return "";
  }

  injectStyle() {
    const styleId = `${this.instanceId}-style`;
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;

    let styleText = `
      #${this.navId}.ex-bottom-nav {
        width: 100%;
        background: white;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 10px 0;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        ${this.navStyle};
      }

      #${this.navId} .ex-nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        padding: 5px 20px;
        transition: transform 0.2s ease;
        user-select: none;
        min-width: 44px;
        min-height: 44px;
        box-sizing: border-box;
        ${this.itemStyle};
      }

      #${this.navId} .ex-nav-item:active {
        transform: scale(0.95);
      }

      #${this.navId} .ex-nav-icon {
        width: 28px;
        height: 28px;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        transition: color 0.2s ease;
        ${this.iconStyle};
      }

      #${this.navId} .ex-nav-item.active .ex-nav-icon {
        color: ${this.activeColor};
      }

      #${this.navId} .ex-nav-label {
        font-size: 12px;
        color: #666;
        transition: color 0.2s ease;
        ${this.labelStyle};
      }

      #${this.navId} .ex-nav-item.active .ex-nav-label {
        color: ${this.activeColor};
        font-weight: 500;
      }

      /* 图标绘制逻辑保持不变... */
      #${this.navId} .ex-icon-home { width: 28px; height: 28px; background: currentColor; clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); position: relative; }
      #${this.navId} .ex-icon-home::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-bottom: 6px solid white; }
      #${this.navId} .ex-icon-teacher { width: 28px; height: 28px; border: 2px solid currentColor; border-radius: 6px; position: relative; }
      #${this.navId} .ex-icon-teacher::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60%; height: 3px; background: currentColor; border-radius: 2px; }
      #${this.navId} .ex-icon-teacher::after { content: ''; position: absolute; top: 30%; left: 50%; transform: translateX(-50%); width: 60%; height: 3px; background: currentColor; border-radius: 2px; }
      #${this.navId} .ex-icon-order { width: 28px; height: 28px; border: 2px solid currentColor; border-radius: 6px; position: relative; }
      #${this.navId} .ex-icon-order::before { content: ''; position: absolute; left: 30%; top: 50%; transform: translateY(-50%); width: 2px; height: 60%; background: currentColor; }
      #${this.navId} .ex-icon-profile { width: 28px; height: 28px; position: relative; }
      #${this.navId} .ex-icon-profile::before { content: ''; position: absolute; top: 20%; left: 50%; transform: translateX(-50%); width: 10px; height: 10px; border: 2px solid currentColor; border-radius: 50%; }
      #${this.navId} .ex-icon-profile::after { content: ''; position: absolute; bottom: 15%; left: 50%; transform: translateX(-50%); width: 18px; height: 12px; border: 2px solid currentColor; border-top: none; border-radius: 0 0 50% 50%; }
    `;

    style.textContent = this.keepAfterOverride(styleText);
    document.head.appendChild(style);
  }

  render() {
    if (!this.target) return;

    this.navEl = document.createElement("nav");
    this.navEl.id = this.navId;
    this.navEl.className = "ex-bottom-nav";

    const itemsHTML = this.items.map((item, index) => `
      <div class="ex-nav-item ${index === this.activeIndex ? 'active' : ''}" 
           data-id="${item.id}" 
           data-index="${index}">
        <div class="ex-nav-icon">
          <div class="ex-icon-${item.icon}"></div>
        </div>
        <span class="ex-nav-label">${item.label}</span>
      </div>
    `).join('');

    this.navEl.innerHTML = itemsHTML;
    this.target.appendChild(this.navEl);

    this.bindEvents();
  }

  bindEvents() {
    if (!this.navEl) return;

    this.navEl.addEventListener('click', (e) => {
      const navItem = e.target.closest('.ex-nav-item');
      if (!navItem) return;

      const index = parseInt(navItem.dataset.index);
      const id = navItem.dataset.id;

      this.setActive(index);

      if (this.onItemClick) {
        this.onItemClick(id, index, navItem);
      }
    });
  }

  /**
   * 通过索引激活
   * @param {number} index 
   */
  setActive(index) {
    if (!this.navEl) return;

    const items = this.navEl.querySelectorAll('.ex-nav-item');
    if (index < 0 || index >= items.length) return;

    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.activeIndex = index;
  }

  /**
   * 通过 ID 激活 (新增)
   * @param {string} id 
   */
  setActive2(id) {
    if (!this.navEl) return;
    
    // 在配置项中查找 ID 对应的索引
    const index = this.items.findIndex(item => item.id === id);
    
    if (index !== -1) {
      this.setActive(index);
    } else {
      console.warn(`ExBottomNav: Item with id "${id}" not found.`);
    }
  }

  getActiveIndex() {
    return this.activeIndex;
  }

  remove() {
    this.navEl?.remove();
    this.navEl = null;
    document.getElementById(`${this.instanceId}-style`)?.remove();
  }
}

// const nav = new ExBottomNav(document.body, {
//   items: [
//     { id: 'home', label: '首页', icon: 'home' },
//     { id: 'teacher', label: '技师', icon: 'teacher' }
//   ]
// });

// // 1秒后通过 ID 激活 "技师" 项
// setTimeout(() => {
//   nav.setActive2('teacher');
// }, 1000);

// class ExBottomNav {
//   static instanceCount = 0;

//   keepAfterOverride(cssText) {
//     return cssText.replace(/([^{]+){([^}]*)}/g, (match, selector, body) => {
//       const lines = body.split(';');
//       let index = -1;

//       for (let i = 0; i < lines.length; i++) {
//         if (/userStyle\s*:\s*override\s*;/.test(lines[i] + ";")) {
//           index = i;
//           break;
//         }
//       }

//       if (index !== -1) {
//         const newBody = lines.slice(index).map(line => line.trimEnd()).join(';\n');
//         return `${selector}{\n${newBody}\n}`;
//       }

//       return match;
//     });
//   }

//   constructor(
//     target,
//     {
//       items = [],
//       activeIndex = 0,
//       navStyle = "",
//       itemStyle = "",
//       iconStyle = "",
//       labelStyle = "",
//       activeColor = "#4ECDC4",
//       onItemClick = null
//     } = {}
//   ) {
//     this.target = target || document.body;
//     this.items = items.length > 0 ? items : this.#getDefaultItems();
//     this.activeIndex = activeIndex;
//     this.activeColor = activeColor;
//     this.onItemClick = onItemClick;

//     this.navStyle = this.#processUserStyle(navStyle);
//     this.itemStyle = this.#processUserStyle(itemStyle);
//     this.iconStyle = this.#processUserStyle(iconStyle);
//     this.labelStyle = this.#processUserStyle(labelStyle);

//     this.instanceId = `ex-bottom-nav-${ExBottomNav.instanceCount++}`;
//     this.navId = `ex-nav-${this.instanceId}`;

//     this.injectStyle();
//     this.render();
//   }

//   #getDefaultItems() {
//     return [
//       { id: 'home', label: '首页', icon: 'home' },
//       { id: 'teacher', label: '技师', icon: 'teacher' },
//       { id: 'order', label: '订单', icon: 'order' },
//       { id: 'profile', label: '我的', icon: 'profile' }
//     ];
//   }

//   #processUserStyle(style) {
//     if (style.startsWith("++")) return "userStyle:add;\n" + style.slice(2);
//     else if (style) return "userStyle:override;\n" + style;
//     return "";
//   }

//   injectStyle() {
//     if (document.getElementById(`${this.instanceId}-style`)) return;

//     const style = document.createElement("style");
//     style.id = `${this.instanceId}-style`;

//     let styleText = `
//       #${this.navId}.ex-bottom-nav {
//         width: 100%;
//         background: white;
//         display: flex;
//         justify-content: space-around;
//         align-items: center;
//         padding: 10px 0;
//         box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
//         box-sizing: border-box;
//         ${this.navStyle};
//       }

//       #${this.navId} .ex-nav-item {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         cursor: pointer;
//         padding: 5px 20px;
//         transition: transform 0.2s ease;
//         user-select: none;
//         min-width: 44px;
//         min-height: 44px;
//         box-sizing: border-box;
//         ${this.itemStyle};
//       }

//       #${this.navId} .ex-nav-item:active {
//         transform: scale(0.95);
//       }

//       #${this.navId} .ex-nav-icon {
//         width: 28px;
//         height: 28px;
//         margin-bottom: 4px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         color: #666;
//         transition: color 0.2s ease;
//         ${this.iconStyle};
//       }

//       #${this.navId} .ex-nav-item.active .ex-nav-icon {
//         color: ${this.activeColor};
//       }

//       #${this.navId} .ex-nav-label {
//         font-size: 12px;
//         color: #666;
//         transition: color 0.2s ease;
//         ${this.labelStyle};
//       }

//       #${this.navId} .ex-nav-item.active .ex-nav-label {
//         color: ${this.activeColor};
//         font-weight: 500;
//       }

//       /* 首页图标 - 六边形 */
//       #${this.navId} .ex-icon-home {
//         width: 28px;
//         height: 28px;
//         background: currentColor;
//         clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
//         position: relative;
//       }

//       #${this.navId} .ex-icon-home::after {
//         content: '';
//         position: absolute;
//         top: 50%;
//         left: 50%;
//         transform: translate(-50%, -50%);
//         width: 0;
//         height: 0;
//         border-left: 4px solid transparent;
//         border-right: 4px solid transparent;
//         border-bottom: 6px solid white;
//       }

//       /* 技师图标 */
//       #${this.navId} .ex-icon-teacher {
//         width: 28px;
//         height: 28px;
//         border: 2px solid currentColor;
//         border-radius: 6px;
//         position: relative;
//       }

//       #${this.navId} .ex-icon-teacher::before {
//         content: '';
//         position: absolute;
//         top: 50%;
//         left: 50%;
//         transform: translate(-50%, -50%);
//         width: 60%;
//         height: 3px;
//         background: currentColor;
//         border-radius: 2px;
//       }

//       #${this.navId} .ex-icon-teacher::after {
//         content: '';
//         position: absolute;
//         top: 30%;
//         left: 50%;
//         transform: translateX(-50%);
//         width: 60%;
//         height: 3px;
//         background: currentColor;
//         border-radius: 2px;
//       }

//       /* 订单图标 */
//       #${this.navId} .ex-icon-order {
//         width: 28px;
//         height: 28px;
//         border: 2px solid currentColor;
//         border-radius: 6px;
//         position: relative;
//       }

//       #${this.navId} .ex-icon-order::before {
//         content: '';
//         position: absolute;
//         left: 30%;
//         top: 50%;
//         transform: translateY(-50%);
//         width: 2px;
//         height: 60%;
//         background: currentColor;
//       }

//       /* 我的图标 */
//       #${this.navId} .ex-icon-profile {
//         width: 28px;
//         height: 28px;
//         position: relative;
//       }

//       #${this.navId} .ex-icon-profile::before {
//         content: '';
//         position: absolute;
//         top: 20%;
//         left: 50%;
//         transform: translateX(-50%);
//         width: 10px;
//         height: 10px;
//         border: 2px solid currentColor;
//         border-radius: 50%;
//       }

//       #${this.navId} .ex-icon-profile::after {
//         content: '';
//         position: absolute;
//         bottom: 15%;
//         left: 50%;
//         transform: translateX(-50%);
//         width: 18px;
//         height: 12px;
//         border: 2px solid currentColor;
//         border-top: none;
//         border-radius: 0 0 50% 50%;
//       }
//     `;

//     style.textContent = this.keepAfterOverride(styleText);
//     document.head.appendChild(style);
//   }

//   render() {
//     if (!this.target) return;

//     this.navEl = document.createElement("nav");
//     this.navEl.id = this.navId;
//     this.navEl.className = "ex-bottom-nav";

//     const itemsHTML = this.items.map((item, index) => `
//       <div class="ex-nav-item ${index === this.activeIndex ? 'active' : ''}" 
//            data-id="${item.id}" 
//            data-index="${index}">
//         <div class="ex-nav-icon">
//           <div class="ex-icon-${item.icon}"></div>
//         </div>
//         <span class="ex-nav-label">${item.label}</span>
//       </div>
//     `).join('');

//     this.navEl.innerHTML = itemsHTML;
//     this.target.appendChild(this.navEl);

//     this.bindEvents();
//   }

//   bindEvents() {
//     if (!this.navEl) return;

//     this.navEl.addEventListener('click', (e) => {
//       const navItem = e.target.closest('.ex-nav-item');
//       if (!navItem) return;

//       const index = parseInt(navItem.dataset.index);
//       const id = navItem.dataset.id;

//       this.setActive(index);

//       if (this.onItemClick) {
//         this.onItemClick(id, index, navItem);
//       }
//     });
//   }

//   setActive(index) {
//     if (!this.navEl) return;

//     const items = this.navEl.querySelectorAll('.ex-nav-item');
//     items.forEach((item, i) => {
//       if (i === index) {
//         item.classList.add('active');
//       } else {
//         item.classList.remove('active');
//       }
//     });

//     this.activeIndex = index;
//   }

//   getActiveIndex() {
//     return this.activeIndex;
//   }

//   remove() {
//     this.navEl?.remove();
//     this.navEl = null;
//     document.getElementById(`${this.instanceId}-style`)?.remove();
//   }
// }

// 导出
// export default ExBottomNav;

// ============= 使用示例 =============
/*
// 基础使用
const nav = new ExBottomNav(document.body, {
  activeIndex: 0,
  onItemClick: (id, index, element) => {
    console.log(`点击了: ${id}, 索引: ${index}`);
  }
});

// 自定义导航项
const customNav = new ExBottomNav(document.getElementById('nav-container'), {
  items: [
    { id: 'home', label: '首页', icon: 'home' },
    { id: 'shop', label: '商城', icon: 'teacher' },
    { id: 'cart', label: '购物车', icon: 'order' },
    { id: 'user', label: '我的', icon: 'profile' }
  ],
  activeColor: '#FF6B6B',
  onItemClick: (id, index) => {
    console.log(`切换到: ${id}`);
  }
});

// 自定义样式 - 覆盖模式
const styledNav = new ExBottomNav(document.body, {
  navStyle: `
    userStyle:override;
    background: linear-gradient(to right, #667eea 0%, #764ba2 100%);
    padding: 15px 0;
  `,
  itemStyle: `
    ++padding: 8px 15px;
    border-radius: 8px;
  `,
  labelStyle: `
    userStyle:override;
    font-size: 14px;
    font-weight: 600;
  `
});

// 程序化设置激活项
nav.setActive(2); // 激活第3个菜单项

// 获取当前激活项
const currentIndex = nav.getActiveIndex();

// 移除组件
nav.remove();
*/