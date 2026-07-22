/**
 * 關西親子隨身助手 - 動態互動邏輯
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化匯率計算
    convertCurrency();

    // 2. 綁定準備清單（Checklist）自動劃掉與 LocalStorage 記憶狀態功能
    initChecklist();
});

/**
 * 頁籤切換功能
 * @param {string} tabId - 要顯示的頁籤 ID
 * @param {Event} event - 觸發的事件對象
 */
function switchTab(tabId, event) {
    // 隱藏所有內容頁
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // 取消所有按鈕的 active 樣式
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 顯示目標頁籤與啟用對應按鈕
    document.getElementById(tabId).classList.add('active');
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    // 滾動回頂部以利閱讀
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

//**
 * 匯率與免稅計算 (日幣 JPY -> 台幣 TWD)
 */
function convertCurrency() {
    const jpyInput = document.getElementById('jpyInput');
    const twdResult = document.getElementById('twdResult');
    const twdTaxFreeResult = document.getElementById('twdTaxFreeResult');
    
    if (!jpyInput || !twdResult) return;

    const jpyValue = parseFloat(jpyInput.value) || 0;
    const exchangeRate = 0.21; // 預設參考匯率

    // 原價台幣
    const twdValue = Math.round(jpyValue * exchangeRate);
    twdResult.value = `$ ${twdValue.toLocaleString()} TWD`;

    // 免稅 (去除10%消費稅後的價格算台幣)
    if (twdTaxFreeResult) {
        const taxFreeJpy = jpyValue / 1.1;
        const taxFreeTwd = Math.round(taxFreeJpy * exchangeRate);
        twdTaxFreeResult.value = `$ ${taxFreeTwd.toLocaleString()} TWD`;
    }
}
/**
 * 初始化檢查清單互動與本地儲存
 */
function initChecklist() {
    const items = document.querySelectorAll('.checklist-item input[type="checkbox"]');

    items.forEach((checkbox, index) => {
        const storageKey = `checklist_item_${index}`;

        // 從 LocalStorage 載入歷史勾選狀態
        const savedState = localStorage.getItem(storageKey);
        if (savedState === 'true') {
            checkbox.checked = true;
            checkbox.parentElement.classList.add('checked');
        }

        // 監聽勾選事件
        checkbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            const parentLabel = e.target.parentElement;

            if (isChecked) {
                parentLabel.classList.add('checked');
            } else {
                parentLabel.classList.remove('checked');
            }

            // 保存狀態至本地
            localStorage.setItem(storageKey, isChecked);
        });
    });
}