let piDigits = "";

fetch("pi-1million.txt")
  .then((response) => response.text())
  .then((data) => {
    piDigits = data.replace(/\s+/g, "");
    console.log("π 已載入，共 " + piDigits.length + " 位字元（含小數點）");
  });

function searchInPi() {
  const input = document.getElementById("searchInput");
  const resultArea = document.getElementById("resultArea");
  const query = input.value.trim();

  if (!query || !/^\d+$/.test(query)) {
    resultArea.textContent = "❌ 請輸入純數字，例如 0424 或 0917...";
    return;
  }

  input.blur(); // 觸發失焦，手機收鍵盤

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

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("searchInput");
  const resultArea = document.getElementById("resultArea");
  let firstFocus = true;

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchInPi();
    }
  });

  input.addEventListener("focus", function () {
    input.value = "";
    resultArea.textContent = "";
  });
});
