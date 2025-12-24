/**
 * 无权限访问提示组件
 * 使用方法: showNoPermission('your-div-id')
 */

function showNoPermission(targetDivId) {
    const targetDiv = document.getElementById(targetDivId);
    
    if (!targetDiv) {
        console.error(`找不到ID为 "${targetDivId}" 的元素`);
        return;
    }

    // CSS样式
    const styles = `
        <style id="no-permission-styles">
            .no-permission-wrapper * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            .no-permission-wrapper {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background-color: transparent;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 5px;
            }

            .no-permission-container {
                background: white;
                border-radius: 16px;
                box-shadow_: 0 20px 60px rgba(0, 0, 0, 0.3);
                padding: 20px;
                max-width: 500px;
                width: 100%;
                text-align: center;
            }

            .no-permission-icon {
                width: 80px;
                height: 80px;
                background: #fee;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
            }

            .no-permission-icon svg {
                width: 40px;
                height: 40px;
                stroke: #dc2626;
            }

            .no-permission-wrapper h1 {
                color: #1f2937;
                font-size: 28px;
                margin-bottom: 12px;
                font-weight: 700;
            }

            .no-permission-error-code {
                color: #6b7280;
                font-size: 14px;
                margin-bottom: 20px;
                font-weight: 500;
            }

            .no-permission-message {
                color: #4b5563;
                line-height: 1.6;
                margin-bottom: 32px;
                font-size: 16px;
            }

            .no-permission-actions {
                display: flex;
                gap: 12px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .no-permission-btn {
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
                text-decoration: none;
                display: inline-block;
            }

            .no-permission-btn-secondary {
                background: #f3f4f6;
                color: #374151;
            }

            .no-permission-btn-secondary:hover {
                background: #e5e7eb;
            }

            .no-permission-info-box {
                background: #f0f9ff;
                border-left: 4px solid #3b82f6;
                padding: 16px;
                margin-top: 24px;
                text-align: left;
                border-radius: 4px;
            }

            .no-permission-info-box p {
                color: #1e40af;
                font-size: 14px;
                line-height: 1.5;
            }
        </style>
    `;

    // HTML内容
    const htmlContent = `
        <div class="no-permission-wrapper">
            <div class="no-permission-container">
                <div class="no-permission-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>

                <h1>访问受限</h1>
                <p class="no-permission-error-code">错误代码: 403 - FORBIDDEN</p>
                
                <p class="no-permission-message">
                    抱歉，您没有权限访问此评价页面。请确认您的账户权限或联系管理员获取访问权限。
                </p>

                <div class="no-permission-actions">
                    <a href="#" class="no-permission-btn no-permission-btn-secondary">返回</a>
                </div>

                <div class="no-permission-info-box">
                    <p><strong>需要帮助？</strong><br>
                    如果您认为这是一个错误，请联系系统管理员或技术支持团队。</p>
                </div>
            </div>
        </div>
    `;

    // 检查样式是否已插入
    if (!document.getElementById('no-permission-styles')) {
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // 插入HTML内容
    targetDiv.innerHTML = htmlContent;
}

// 使用示例:
// showNoPermission('main-content');
// showNoPermission('app');
// showNoPermission('container');