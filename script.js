let piDigits = "";

// 載入 pi 資料（應包含 3. 開頭）
fetch("pi-1million.txt")
  .then((response) => response.text())
  .then((data) => {
    piDigits = data.replace(/\s+/g, "");
    console.log("π 已載入，共 " + piDigits.length + " 位字元（含整數與小數點）");
  });

function searchInPi() {
  const input = document.getElementById("searchInput");
  const resultArea = document.getElementById("resultArea");
  const query = input.value.trim();

  if (!query || !/^\d+$/.test(query)) {
    resultArea.textContent = "❌ 請輸入純數字，例如 0424 或 0917...";
    return;
  }

  input.blur(); // 手機輸入後自動收鍵盤

  const positions = [];

  // ✅ 正確處理「從整數開始」的判斷
  const candidate = "3" + piDigits.slice(piDigits.indexOf(".") + 1, piDigits.indexOf(".") + 1 + query.length - 1);
  if (candidate === query) {
    positions.push(0); // index = 0 表示從整數開頭
  }

  // 🔍 從第 1 位（即小數點）後繼續找
  let index = piDigits.indexOf(query, 1);
  while (index !== -1) {
    positions.push(index);
    index = piDigits.indexOf(query, index + 1);
  }

  if (positions.length === 0) {
    resultArea.textContent = `❌「${query}」未出現在 π 的前 1,000,000 位中（含整數與小數點）。`;
    return;
  }

  const decimalStart = piDigits.indexOf(".") + 1;

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
    input.value = "";             // ✅ 清空輸入內容
    resultArea.textContent = "";  // ✅ 清空結果區
  });
});
