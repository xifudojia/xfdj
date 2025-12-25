// fetchJson.js —— 通用 JSON 请求模块（失败返回 null）

/**
 * 请求 JSON 数据
 * @param {string} url - 请求地址
 * @param {Object} [options={}] - 可选配置，例如 { method: 'POST', body: {...} }
 * @returns {Promise<any|null>} - 成功返回 JSON 数据，失败返回 null
 */
async function fetchJson(url, errmsgPrefix = '', options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      console.error(`${errmsgPrefix} ❌ 请求失败: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`${errmsgPrefix}🚨 请求出错:`, error);
    return null;
  }
}


function getCookie(name, defaultValue = null) {
  const cookies = document.cookie.split("; ");  // 拆分多个 Cookie
  for (let c of cookies) {
    const [key, value] = c.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return defaultValue; // 找不到返回 null
}

function jsonParse(jsonStr, defaultValue = null) {

    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return defaultValue;
    }

  }


  // 对每个 CSS 块，如果里面包含 userStyle:override;，则从这一行向上删除原有属性，只保留 userStyle:override 及下面的内容。
  function keepAfterOverride(cssText) {
    // 匹配每个 CSS 块
    return cssText.replace(/([^{]+){([^}]*)}/g, (match, selector, body) => {

      const lines = body.split(';');
      let index = -1;

      // 找到包含 userStyle:override 的行
      for (let i = 0; i < lines.length; i++) {
        if (/userStyle\s*:\s*override\s*;/.test(lines[i] + ";")) {
          index = i;
          break;
        }
      }

      if (index !== -1) {
        // 保留从 override 行开始到结束的所有行
        const newBody = lines.slice(index).map(line => line.trimEnd()).join(';\n');
        return `${selector}{\n${newBody}\n}`;
      }

      // 没有 userStyle:override 的块保持原样
      return match;
    });
  }


  function sc(s) {
    console.log(s);
  }

  function ss(...args) {
    console.log(...args);
  }
  function scc(...args) {
    console.log(...args);
     throw new Error("error:2025-11-17 13:04:43");
  }


  async function checkNetwork() {
    try {
      // 向可靠的服务器发送 HEAD 请求（耗时短）
      const response = await fetch('https://www.baidu.com/favicon.ico', { 
        method: 'HEAD', 
        mode: 'no-cors', // 避免跨域限制
        cache: 'no-store' // 不缓存，确保实时性
      });
      // 只要能收到响应（无论状态码），都认为网络可用
      return true;
    } catch (error) {
      // 请求失败（如超时、无法连接），认为网络不可用
      return false;
    }
  }



  function disableButton(ele, yn) {
    const btn = document.getElementById(ele);
    if (!btn) return;

    if (yn) {
      // 如果按钮里没有 spinner，就插入
      if (!btn.querySelector(".btn-spinner")) {
        const spinner = document.createElement("span");
        spinner.classList.add("btn-spinner");
        btn.prepend(spinner);
      }

      btn.disabled = true;
      btn.style.opacity = "0.5";
      btn.style.cursor = "not-allowed";
    } else {
      // 恢复按钮，移除 spinner
      const spinner = btn.querySelector(".btn-spinner");
      if (spinner) spinner.remove();

      btn.disabled = false;
      btn.style.opacity = "1";
      btn.style.cursor = "pointer";
    }
  }




function addEventListener_message(){
  window.addEventListener("message", (event) => {
    // 可选：检查消息来源，确保安全
    // if (event.origin !== "http://example.com") return;

    console.log("父页面收到消息:", event.data);

    if (event.data.type === "notify") {
      alert("收到 iframe 通知: " + event.data.message);
    }
  });
}


function sendNotify(Type,Message){
  window.parent.postMessage({
    type: Type,
    message:Message
  }, "*"); // "*" 表示接受所有源，生产环境最好指定 origin
}








function isWeChatBrowser() {
  // 获取浏览器的 userAgent 并转为小写（避免大小写问题）
  const userAgent = navigator.userAgent.toLowerCase();
  // 检测是否包含微信标识 "micromessenger"
  return userAgent.includes('micromessenger');
}


/**
 * 获取 URL 查询参数
 * @param {string} [paramName] - 可选，要获取的参数名，不传则返回所有参数对象
 * @param {string} [url] - 可选，指定要解析的 URL，默认使用当前页面的 URL
 * @returns {string|object|null} - 返回指定参数值（不存在则返回null），或所有参数对象，解析失败返回null
 */
function getUrlQueryParams(paramName, url) {
  try {
    // 优先使用传入的URL，否则使用当前页面URL
    const targetUrl = url || window.location.href;
    
    // 提取URL中的查询参数部分（?后面的内容）
    const queryStr = targetUrl.split('?')[1] || '';
    if (!queryStr) return paramName ? null : {};

    // 解析查询参数为对象（处理多参数、编码问题）
    const params = {};
    const paramPairs = queryStr.split('&');
    
    paramPairs.forEach(pair => {
      // 处理空参数（如?&&a=1）
      if (!pair) return;
      
      // 分割键值对（处理没有值的参数，如?a&b=2）
      const [key, value = ''] = pair.split('=');
      
      // 解码（处理URL编码的字符，如%20对应空格）
      const decodedKey = decodeURIComponent(key.trim());
      const decodedValue = decodeURIComponent(value.trim());
      
      // 处理同名参数（如?a=1&a=2，转为数组）
      if (params[decodedKey]) {
        if (Array.isArray(params[decodedKey])) {
          params[decodedKey].push(decodedValue);
        } else {
          params[decodedKey] = [params[decodedKey], decodedValue];
        }
      } else {
        params[decodedKey] = decodedValue;
      }
    });

    // 根据是否传入paramName返回对应结果
    return paramName ? (params[paramName] || null) : params;
  } catch (error) {
    console.error('解析URL查询参数失败：', error);
    return null;
  }
}

// console.log(getUrlQueryParams("cvid","https://www.bing.com/search?q=2&form=CHRDEF&sp=-1&lq=0&pq=2&sc=10-1&qs=n&sk=&cvid=289B14F0340746C4BFE97633ECE7FA49"),5);