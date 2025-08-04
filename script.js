let piDigits = "";

// 載入不含小數點的 π 資料（首位為 3，其餘為 100 萬位小數）
fetch("pi-1million.txt")
  .then(response => response.text())
  .then(data => {
    piDigits = data.replace(/\s+/g, "");
    console.log("π 已載入，共 " + piDigits.length + " 位數字（含整數）");
  });

function searchInPi() {
  const input = document.getElementById("searchInput");
  const resultArea = document.getElementById("resultArea");
  const query = input.value.trim();

  if (!query || !/^\d+$/.test(query)) {
    resultArea.textContent = "❌ 請輸入純數字，例如 0424 或 0917...";
    return;
  }

  input.blur(); // 手機收鍵盤

  const positions = [];

  // ✅ 正確處理：是否從整數 3 開始
  if (piDigits.substring(0, query.length) === query) {
    positions.push(0);
  }

  // 🔍 從第 2 位（小數第 1 位）開始搜尋剩餘
  let idx = piDigits.indexOf(query, 1);
  while (idx !== -1) {
    positions.push(idx);
    idx = piDigits.indexOf(query, idx + 1);
  }

  if (positions.length === 0) {
    resultArea.textContent = `❌「${query}」未出現在 π（100 萬位內）`;
    return;
  }

  const decimalStart = 1; // 第 2 位是小數第 1 位

  const displayList = positions.map((pos, i) => {
    if (pos === 0) {
      const decimalEnd = query.length - 1;
      return `第 ${i + 1} 次出現在整數至小數點後第 ${decimalEnd} 位`;
    } else {
      const start = pos - decimalStart + 1;
      const end = start + query.length - 1;
      return `第 ${i + 1} 次出現在小數點後第 ${start}～${end} 位`;
    }
  });

  resultArea.textContent =
    `✅「${query}」在 π（100 萬位數內）中共出現了 ${positions.length} 次：\n\n` +
    displayList.join("\n");
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const resultArea = document.getElementById("resultArea");
  const slider = document.getElementById("fontSizeSlider");
  const sizeValue = document.getElementById("fontSizeValue");

  // Enter / GO 觸發搜尋
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") searchInPi();
  });

  // 點擊輸入框只清空欄位，不清空結果
  input.addEventListener("focus", () => {
    input.value = "";
  });

  // 字體大小拉桿：同步更新顯示文字與結果區字體
  slider.addEventListener("input", () => {
    const fontSize = slider.value;
    sizeValue.textContent = fontSize;
    resultArea.style.fontSize = fontSize + "px";
  });
});
