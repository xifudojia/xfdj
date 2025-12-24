/**
 * ExImageCarousel - 图片轮播组件
 * 使用方式：
 * const carousel = new ExImageCarousel(document.body, {
 *   images: ['url1', 'url2', 'url3'],
 *   autoPlayInterval: 2000,
 *   onImageClick: (index, url) => {}
 * });
 */

class ExImageCarousel {
  static instanceCount = 0;

  /**
   * 保留 userStyle:override 之后的样式
   */
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

  constructor(target, {
    images = [],
    autoPlayInterval = 2000,
    containerStyle = "",
    imageStyle = "",
    indicatorStyle = "",
    onImageClick = null
  } = {}) {
    if (!images || images.length === 0) {
      throw new Error("ExImageCarousel requires at least one image.");
    }

    this.target = target || document.body;
    this.images = images;
    this.autoPlayInterval = autoPlayInterval;
    this.onImageClick = onImageClick;

    // 处理用户自定义样式
    this.containerStyle = this.#processUserStyle(containerStyle);
    this.imageStyle = this.#processUserStyle(imageStyle);
    this.indicatorStyle = this.#processUserStyle(indicatorStyle);

    // 唯一实例 ID
    this.instanceId = `ex-carousel-${ExImageCarousel.instanceCount++}`;
    this.containerId = `${this.instanceId}-container`;

    // 轮播状态
    this.currentIndex = 0;
    this.autoPlayTimer = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isDragging = false;

    this.injectStyle();
    this.render();
    this.startAutoPlay();
  }

  #processUserStyle(style) {
    if (style.startsWith("++")) return "userStyle:add;\n" + style.slice(2);
    else if (style) return "userStyle:override;\n" + style;
    return "";
  }

  injectStyle() {
    // 检查是否已注入样式
    if (document.getElementById(`${this.instanceId}-style`)) return;

    const style = document.createElement("style");
    style.id = `${this.instanceId}-style`;

    let styleText = `
      #${this.containerId}.ex-carousel {
        width: 100%;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        user-select: none;
        background___: #f0f0f0;
        ${this.containerStyle};
      }

      #${this.containerId} .ex-carousel-wrapper {
        display: flex;
        transition: transform 0.3s ease;
        width: 100%;
        height: 100%;
      }

      #${this.containerId} .ex-carousel-wrapper.no-transition {
        transition: none;
      }

      #${this.containerId} .ex-carousel-item {
        flex-shrink: 0;
        width: 100%;
        height: 100%;
        position: relative;
        cursor: pointer;
        ${this.imageStyle};
      }

      #${this.containerId} .ex-carousel-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      #${this.containerId} .ex-carousel-indicators {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        z-index: 10;
        ${this.indicatorStyle};
      }

      #${this.containerId} .ex-carousel-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: all 0.3s ease;
      }

      #${this.containerId} .ex-carousel-indicator.active {
        background: rgba(255, 255, 255, 1);
        width: 24px;
        border-radius: 4px;
      }

      #${this.containerId} .ex-carousel-indicator:active {
        transform: scale(0.9);
      }
    `;

    style.textContent = this.keepAfterOverride(styleText);
    document.head.appendChild(style);
  }

  render() {
    if (!this.target) return;

    const container = document.createElement("div");
    container.id = this.containerId;
    container.className = "ex-carousel";

    container.innerHTML = `
      <div class="ex-carousel-wrapper">
        ${this.images.map((img, index) => `
          <div class="ex-carousel-item" data-index="${index}">
            <img src="${img}" alt="轮播图 ${index + 1}">
          </div>
        `).join('')}
      </div>
      <div class="ex-carousel-indicators">
        ${this.images.map((_, index) => `
          <div class="ex-carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
        `).join('')}
      </div>
    `;

    this.target.appendChild(container);
    this.container = container;
    this.wrapper = container.querySelector('.ex-carousel-wrapper');
    this.indicators = container.querySelectorAll('.ex-carousel-indicator');

    this.bindEvents();
  }

  bindEvents() {
    if (!this.container) return;

    // 触摸事件
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.stopAutoPlay();
      this.isDragging = true;
    });

    this.container.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      this.touchEndX = e.touches[0].clientX;
    });

    this.container.addEventListener('touchend', () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      const diff = this.touchStartX - this.touchEndX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }

      this.startAutoPlay();
    });

    // 鼠标事件（支持PC端测试）
    this.container.addEventListener('mousedown', (e) => {
      this.touchStartX = e.clientX;
      this.stopAutoPlay();
      this.isDragging = true;
    });

    this.container.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      this.touchEndX = e.clientX;
    });

    this.container.addEventListener('mouseup', () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      const diff = this.touchStartX - this.touchEndX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }

      this.startAutoPlay();
    });

    this.container.addEventListener('mouseleave', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.startAutoPlay();
      }
    });

    // 指示器点击事件
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.goTo(index);
      });
    });

    // 图片点击事件
    this.container.querySelectorAll('.ex-carousel-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        if (this.onImageClick) {
          this.onImageClick(index, this.images[index]);
        }
      });
    });

    // 鼠标悬停时暂停自动播放
    this.container.addEventListener('mouseenter', () => {
      this.stopAutoPlay();
    });

    this.container.addEventListener('mouseleave', () => {
      if (!this.isDragging) {
        this.startAutoPlay();
      }
    });
  }

  goTo(index) {
    if (index < 0 || index >= this.images.length) return;
    
    this.currentIndex = index;
    this.updatePosition();
    this.updateIndicators();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updatePosition();
    this.updateIndicators();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updatePosition();
    this.updateIndicators();
  }

  updatePosition() {
    if (!this.wrapper) return;
    const offset = -this.currentIndex * 100;
    this.wrapper.style.transform = `translateX(${offset}%)`;
  }

  updateIndicators() {
    if (!this.indicators) return;
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  startAutoPlay() {
    if (this.autoPlayInterval <= 0) return;
    
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      this.next();
    }, this.autoPlayInterval);
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  // 更新图片列表
  updateImages(newImages) {
    if (!newImages || newImages.length === 0) return;
    
    this.images = newImages;
    this.currentIndex = 0;
    
    if (this.container) {
      this.container.remove();
    }
    
    this.stopAutoPlay();
    this.render();
    this.startAutoPlay();
  }

  // 销毁组件
  remove() {
    this.stopAutoPlay();
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}



// 使用示例
/*
const carousel = new ExImageCarousel(document.body, {
  images: [
    'https://via.placeholder.com/800x300/FF6B6B/ffffff?text=广告1',
    'https://via.placeholder.com/800x300/4ECDC4/ffffff?text=广告2',
    'https://via.placeholder.com/800x300/45B7D1/ffffff?text=广告3',
    'https://via.placeholder.com/800x300/FFA07A/ffffff?text=广告4'
  ],
  autoPlayInterval: 2000,
  onImageClick: (index, url) => {
    console.log(`点击了第 ${index + 1} 张图片:`, url);
  }
});

// 自定义样式示例
const customCarousel = new ExImageCarousel(document.body, {
  images: ['url1', 'url2', 'url3'],
  containerStyle: "++border-radius: 16px; overflow: hidden;",
  indicatorStyle: "++bottom: 20px;",
  imageStyle: "++border: 2px solid white;"
});
*/