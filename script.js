let piDigits = "";

// 載入不含小數點的 π 資料
fetch("pi-1million.txt")
  .then(r => r.text())
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

  // 彩蛋：314 播影片，0424 顯示圖片
  if (query === "314") {
    return showVideoModal();
  }
  if (query === "0424") {
    return showImageModal();
  }

  const positions = [];
  // 整數開頭檢查
  if (piDigits.substring(0, query.length) === query) {
    positions.push(0);
  }
  // 從小數第 1 位開始搜尋
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
    `✅「${query}」在 π（100 萬位內）中共出現了 ${positions.length} 次：\n\n` +
    displayList.join("\n");
}

function showVideoModal() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("popupVideo");
  const closeBtn = modal.querySelector(".close");

  modal.removeAttribute("hidden");
  video.currentTime = 0;
  video.play();

  closeBtn.onclick = () => {
    video.pause();
    modal.setAttribute("hidden", "");
  };
  modal.onclick = e => {
    if (e.target === modal) {
      video.pause();
      modal.setAttribute("hidden", "");
    }
  };
}

function showImageModal() {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("popupImage");
  const closeBtn = modal.querySelector(".close");

  modal.removeAttribute("hidden");

  closeBtn.onclick = () => {
    modal.setAttribute("hidden", "");
  };
  modal.onclick = e => {
    if (e.target === modal) {
      modal.setAttribute("hidden", "");
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const resultArea = document.getElementById("resultArea");
  const slider = document.getElementById("fontSizeSlider");
  const sizeValue = document.getElementById("fontSizeValue");

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") searchInPi();
  });
  input.addEventListener("focus", () => {
    input.value = "";
  });
  slider.addEventListener("input", () => {
    const fs = slider.value;
    sizeValue.textContent = fs;
    resultArea.style.fontSize = fs + "px";
  });
});
