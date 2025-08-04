let piDigits = "";

// 載入不含小數點的 π 資料（首位為 3，其餘為 100 萬位小數）
fetch("pi-1million.txt")
  .then(response => response.text())
  .then(data => {
    piDigits = data.replace(/\s+/g, "");
    console.log("π 已載入，共 " + piDigits.length + " 位數字");
  });

function searchInPi() {
  const input = document.getElementById("searchInput");
  const resultArea = document.getElementById("resultArea");
  const query = input.value.trim();

  if (!query || !/^\d+$/.test(query)) {
    resultArea.textContent = "❌ 請輸入純數字，例如 0424 或 0917...";
    return;
  }

  input.blur(); // 手機自動收鍵盤

  // Easter egg: 只有完全輸入「314」才彈窗播放
  if (query === "314") {
    return showVideoModal();
  }

  const positions = [];
  // 檢查是否從整數開頭
  if (piDigits.substring(0, query.length) === query) {
    positions.push(0);
  }
  // 從第 2 位（小數第 1 位）開始搜尋
  let idx = piDigits.indexOf(query, 1);
  while (idx !== -1) {
    positions.push(idx);
    idx = piDigits.indexOf(query, idx + 1);
  }

  if (positions.length === 0) {
    resultArea.textContent = `❌「${query}」未出現在 π（100 萬位內）`;
    return;
  }

  const decimalStart = 1;
  const displayList = positions.map((pos, i) => {
    if (pos === 0) {
      const decimalEnd = query.length - 1;
      return `第 ${i+1} 次出現在整數至小數點後第 ${decimalEnd} 位`;
    } else {
      const start = pos - decimalStart + 1;
      const end = start + query.length - 1;
      return `第 ${i+1} 次出現在小數點後第 ${start}～${end} 位`;
    }
  });

  resultArea.textContent =
    `✅「${query}」在 π（100 萬位數內）中共出現了 ${positions.length} 次：\n\n` +
    displayList.join("\n");
}

function showVideoModal() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("popupVideo");
  const closeBtn = modal.querySelector(".close");

  modal.style.display = "block";
  video.currentTime = 0;
  video.play();

  closeBtn.onclick = () => {
    video.pause();
    modal.style.display = "none";
  };
  modal.onclick = e => {
    if (e.target === modal) {
      video.pause();
      modal.style.display = "none";
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const resultArea = document.getElementById("resultArea");
  const slider = document.getElementById("fontSizeSlider");
  const sizeValue = document.getElementById("fontSizeValue");

  // Enter / GO 觸發搜尋
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") searchInPi();
  });

  // 點擊輸入框只清空輸入，不影響結果
  input.addEventListener("focus", () => {
    input.value = "";
  });

  // 字體大小拉桿
  slider.addEventListener("input", () => {
    const fs = slider.value;
    sizeValue.textContent = fs;
    resultArea.style.fontSize = fs + "px";
  });
});
