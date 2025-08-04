let piDigits = "";

// --- 核心功能：在 π 中尋找數字 ---
function searchInPi() {
  const searchInput = document.getElementById("searchInput");
  const resultArea = document.getElementById("resultArea");
  const query = searchInput.value.trim();

  if (!piDigits) {
    resultArea.textContent = "⏳ π 數據仍在載入中，請稍後再試。";
    return;
  }

  if (!query || !/^\d+$/.test(query)) {
    resultArea.textContent = "❌ 請輸入純數字，例如 314159...";
    resultArea.classList.remove('loading-text');
    return;
  }

  // 在手機上查詢後自動收起鍵盤
  searchInput.blur();

  const positions = [];
  // 從索引 0 開始尋找，統一處理所有情況
  let currentIndex = piDigits.indexOf(query, 0);

  while (currentIndex !== -1) {
    positions.push(currentIndex);
    // 從找到的下一個位置繼續尋找
    currentIndex = piDigits.indexOf(query, currentIndex + 1);
  }

  resultArea.classList.remove('loading-text');

  if (positions.length === 0) {
    resultArea.textContent = `❌ 「${query}」未出現在 π 的前 1,000,000 位小數中。`;
    return;
  }

  // 產生顯示結果的文字列表
  const displayList = positions.map((pos, i) => {
    // 索引 0 是整數 '3' 的位置
    if (pos === 0) {
      // 搜尋的數字串從整數位 '3' 開始
      const decimalEnd = query.length - 1;
      if (decimalEnd === 0) {
        return `${i + 1}. 出現在整數位。`;
      }
      return `${i + 1}. 出現在整數位到小數點後第 ${decimalEnd} 位。`;
    } else {
      // 搜尋的數字串完全在小數部分
      // 索引 pos 直接對應小數點後第 pos 位
      const start = pos;
      const end = pos + query.length - 1;
      if (start === end) {
        return `${i + 1}. 出現在小數點後第 ${start} 位。`;
      }
      return `${i + 1}. 出現在小數點後第 ${start}～${end} 位。`;
    }
  });

  resultArea.textContent =
    `✅ 「${query}」在 π 中共出現了 ${positions.length} 次：\n\n` +
    displayList.join("\n");
}

// --- 事件監聽器設定 ---
document.addEventListener("DOMContentLoaded", function() {
  // DOM 元素只在文件載入後獲取一次，提高效能
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultArea = document.getElementById("resultArea");
  const fontSizeSlider = document.getElementById("fontSizeSlider");
  const fontSizeValue = document.getElementById("fontSizeValue");

  // 1. 載入 π 數據檔案
  fetch("pi-1million.txt")
    .then(response => {
      if (!response.ok) {
        throw new Error('網路回應錯誤，無法載入 pi-1million.txt');
      }
      return response.text();
    })
    .then(data => {
      // 假設檔案第一位是3，後面是小數。整個字串包含整數3和小數部分。
      piDigits = data.replace(/\s+/g, "");
      console.log("π 已成功載入，共 " + piDigits.length + " 位數字。");
      resultArea.textContent = "π 數據已就緒，請開始輸入您想找的數字。";
      resultArea.classList.remove('loading-text');
      searchInput.disabled = false;
      searchButton.disabled = false;
    })
    .catch(error => {
      console.error("載入 π 數據失敗:", error);
      resultArea.textContent = "❌ 錯誤：無法載入 π 數據檔案。請檢查檔案路徑是否正確，或查看主控台錯誤訊息。";
      resultArea.classList.remove('loading-text');
    });

  // 2. 搜尋按鈕點擊事件
  searchButton.addEventListener("click", searchInPi);

  // 3. 輸入框 Enter 鍵事件
  searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // 防止表單提交等預設行為
      searchInPi();
    }
  });

  // 4. 字體大小拉桿的事件監聽
  fontSizeSlider.addEventListener("input", function() {
    const newSize = this.value;
    resultArea.style.fontSize = newSize + "px";
    fontSizeValue.textContent = newSize + "px";
  });

  // 初始時禁用輸入，直到 π 數據載入完成
  searchInput.disabled = true;
  searchButton.disabled = true;
});
