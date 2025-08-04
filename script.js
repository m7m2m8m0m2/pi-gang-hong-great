<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>在 π 中尋找數字</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #f0f2f5;
            color: #1c1e21;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        .container {
            width: 100%;
            max-width: 680px;
            background: #fff;
            padding: 25px 30px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            font-size: 28px;
            margin-bottom: 10px;
            color: #333;
        }
        p {
            color: #606770;
            margin-bottom: 25px;
        }
        .search-box {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        #searchInput {
            flex-grow: 1;
            padding: 12px 15px;
            font-size: 16px;
            border: 1px solid #dddfe2;
            border-radius: 8px;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        #searchInput:focus {
            border-color: #1877f2;
            box-shadow: 0 0 0 2px rgba(24, 119, 242, 0.2);
        }
        #searchButton {
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
            background-color: #1877f2;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        #searchButton:hover {
            background-color: #166fe5;
        }
        .controls {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 10px;
            margin-bottom: 15px;
            color: #606770;
            font-size: 14px;
        }
        #fontSizeSlider {
            cursor: pointer;
        }
        #resultArea {
            background-color: #f7f7f7;
            padding: 20px;
            border-radius: 8px;
            min-height: 100px;
            text-align: left;
            white-space: pre-wrap; /* 讓 \n 換行符號生效 */
            word-wrap: break-word;
            font-size: 16px; /* 預設字體大小 */
            line-height: 1.6;
            color: #333;
            border: 1px solid #e0e0e0;
        }
        .loading-text {
            color: #999;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>π 中尋蹤</h1>
        <p>在圓周率 π 的前一百萬位小數中，尋找您生命中的幸運數字。</p>

        <div class="search-box">
            <input type="text" id="searchInput" placeholder="在此輸入數字，如 19910917" inputmode="numeric">
            <button id="searchButton">尋找</button>
        </div>

        <div class="controls">
            <label for="fontSizeSlider">調整字體大小：</label>
            <input type="range" id="fontSizeSlider" min="12" max="24" value="16">
        </div>

        <div id="resultArea" class="loading-text">π 數據載入中，請稍候...</div>
    </div>

    <script>
        let piDigits = "";

        // DOM 元素只獲取一次，提高效能
        const searchInput = document.getElementById("searchInput");
        const searchButton = document.getElementById("searchButton");
        const resultArea = document.getElementById("resultArea");
        const fontSizeSlider = document.getElementById("fontSizeSlider");

        // --- 核心功能：在 π 中尋找數字 ---
        function searchInPi() {
            const query = searchInput.value.trim();

            if (!piDigits) {
                resultArea.textContent = "⏳ π 數據仍在載入中，請稍後再試。";
                return;
            }

            if (!query || !/^\d+$/.test(query)) {
                resultArea.textContent = "❌ 請輸入純數字，例如 0424 或 0917...";
                resultArea.classList.remove('loading-text');
                return;
            }

            // 在手機上查詢後自動收起鍵盤
            searchInput.blur(); 

            const positions = [];
            // ⭐【修正一】: 從索引 0 開始尋找，統一處理所有情況
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
                // 索引 0 是整數 '3'，索引 1 是小數第 1 位
                if (pos === 0) {
                    // 如果數字串包含整數部分
                    if (query.length === 1) {
                        return `${i + 1}. 出現在整數位。`;
                    } else {
                        const decimalEnd = query.length - 1;
                        return `${i + 1}. 出現在整數位到小數點後第 ${decimalEnd} 位。`;
                    }
                } else {
                    // 只在小數部分
                    const start = pos; // 索引 pos 直接對應小數點後第 pos 位
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

            // 1. 載入 π 數據檔案
            fetch("pi-1million.txt")
                .then(response => {
                    if (!response.ok) {
                        throw new Error('網路回應錯誤，無法載入 pi-1million.txt');
                    }
                    return response.text();
                })
                .then(data => {
                    // 移除所有空白字元（如換行、空格）並儲存
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
                    searchInPi();
                }
            });

            // 4. ⭐【修正三】: 點擊輸入框時，清空輸入框文字，但不影響結果區域
            searchInput.addEventListener("focus", function() {
                // 使用 placeholder 的效果，而不是直接清空 value
                // 這樣如果使用者不小心點到，還能看到上次輸入的內容
                if(searchInput.value !== "") {
                    searchInput.select(); // 全選文字，方便使用者直接覆蓋
                }
            });

            // 5. ⭐【修正二】: 字體大小拉桿的事件監聽
            fontSizeSlider.addEventListener("input", function() {
                // `this.value` 會取得拉桿目前的值 (12-24)
                resultArea.style.fontSize = this.value + "px";
            });

            // 初始時禁用輸入，直到 π 數據載入完成
            searchInput.disabled = true;
            searchButton.disabled = true;
        });

    </script>

</body>
</html>
