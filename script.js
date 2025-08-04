let piDigits = "";

// 載入不含小數點的 π 資料（首位為 3，其餘為 100 萬位小數）
fetch("pi-1million.txt")
  .then((response) => response.text())
  .then((data) => {
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
  if (piDigits.slice(0, query.length) === query) {
    positions.push(0); // 表示從整數開頭出現
  }

  // 🔍 從第 1 位（即小數第 1 位）開始繼續找
  let index = piDigits.indexOf(query, 1);
  while (index !== -1) {
    positions.push(index);
    index = piDigits.indexOf(query, index + 1);
  }

  if (positions.length === 0) {
    resultArea.textContent = `❌「${query}」未出現在 π 的前 1,000,000 位中（含整數）。`;
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

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("searchInput");
  const resultArea = document.getElementById("resultArea");

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchInPi();
    }
  });

  input.addEventListener("focus", function () {
    input.value = ""; // ✅ 只清空輸入，不清空結果
  });
});
