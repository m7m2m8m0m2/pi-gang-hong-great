let piDigits = "";

// 載入 pi 資料（開頭包含 "3."）
fetch("pi-1million.txt")
  .then((response) => response.text())
  .then((data) => {
    piDigits = data.replace(/\s+/g, ""); // 去除空白與換行，但保留 "3."
    console.log("π 已載入，共 " + piDigits.length + " 位字元（含小數點）");
  });

function searchInPi() {
  const query = document.getElementById("searchInput").value.trim();
  const resultArea = document.getElementById("resultArea");

  if (!query || !/^\d+$/.test(query)) {
    resultArea.textContent = "❌ 請輸入純數字，例如 0424 或 0917...";
    return;
  }

  const positions = [];
  let index = piDigits.indexOf(query);

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
    } else if (pos < decimalStart) {
      return `第 ${i + 1} 次出現在（含小數點）前的未知位置`;
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
