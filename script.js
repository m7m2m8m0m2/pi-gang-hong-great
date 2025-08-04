// script.js (v2 - 修正版)

document.addEventListener("DOMContentLoaded", function() {
  // --- 變數與 DOM 元素 ---
  let piDigits = "";
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultArea = document.getElementById("resultArea");
  const fontSizeSlider = document.getElementById("fontSizeSlider");
  const fontSizeValue = document.getElementById("fontSizeValue");

  // --- 核心功能：在 π 中尋找數字 ---
  // 將函式移至內部，確保它可以存取到上面的 DOM 元素
  function searchInPi() {
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

    searchInput.blur();

    const positions = [];
    let currentIndex = piDigits.indexOf(query, 0);

    while (currentIndex !== -1) {
      positions.push(currentIndex);
      currentIndex = piDigits.indexOf(query, currentIndex + 1);
    }

    resultArea.classList.remove('loading-text');

    if (positions.length === 0) {
      resultArea.textContent = `❌ 「${query}」未出現在 π 的前 1,000,000 位小數中。`;
      return;
    }

    const displayList = positions.map((pos, i) => {
      if (pos === 0) {
        const decimalEnd = query.length - 1;
        if (decimalEnd === 0) {
          return `${i + 1}. 出現在整數位。`;
        }
        return `${i + 1}. 出現在整數位到小數點後第 ${decimalEnd} 位。`;
      } else {
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

  // 1. 載入 π 數據檔案
  fetch("pi-1million.txt")
    .then(response => {
      if (!response.ok) {
        throw new Error('網路回應錯誤，無法載入 pi-1million.txt');
      }
      return response.text();
    })
    .then(data => {
      piDigits = data.replace(/\s+/g, "");
      resultArea.textContent = "π 數據已就緒，請開始輸入您想找的數字。";
      resultArea.classList.remove('loading-text');
      // 成功載入後，啟用按鈕和輸入框
      searchInput.disabled = false;
      searchButton.disabled = false;
      console.log("π 已成功載入，互動功能已啟用。");
    })
    .catch(error => {
      console.error("載入 π 數據失敗:", error);
      resultArea.textContent = "❌ 錯誤：無法載入 pi-1million.txt 檔案。\n請確認該檔案與 index.html 在同一個資料夾內，然後重新整理頁面。";
      resultArea.classList.remove('loading-text');
    });

  // 2. 搜尋按鈕點擊事件
  searchButton.addEventListener("click", searchInPi);

  // 3. 輸入框 Enter 鍵事件
  searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      searchInPi();
    }
  });

  // 4. 字體大小拉桿的事件監聽
  fontSizeSlider.addEventListener("input", function() {
    const newSize = this.value;
    resultArea.style.fontSize = newSize + "px";
    fontSizeValue.textContent = newSize + "px";
  });

  // 頁面載入時，先禁用輸入，直到 π 數據載入完成
  searchInput.disabled = true;
  searchButton.disabled = true;
});
