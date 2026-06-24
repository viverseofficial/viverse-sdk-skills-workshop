# VIVERSE SDK Skills Workshop With PS SDK Extension

## 標題
VIVERSE SDK Skills for AI IDEs：從平台能力整合到 Polygon Streaming 資產整合

## 一句話摘要
這個版本的 workshop 先用一條清楚的主線，示範如何把 standalone app 發布到 VIVERSE，並透過 AI IDE skills 完成 auth、avatar 與 leaderboard 整合；接著再加上一段 Polygon Streaming SDK 延伸 demo，證明同一套 skill-based workflow 也能處理高約束的 3D runtime asset integration。

## 版本定位
這不是一個全新的 workshop。

它是原本 workshop 的延伸版。

整體結構仍然只有一條主線，再加上一段進階補充內容。

## 受眾定位
這個版本適合想同時看到兩類 skill 能力的人：

1. 平台能力整合，例如 publish、auth、avatar、leaderboard
2. 3D runtime 資產整合，例如 Polygon Streaming 模型替換

## 核心論點
skill repository 的價值，不只是讓 AI 更快產生程式碼。

它真正提供的是：

1. 正確的整合順序
2. 真實執行環境的規則
3. 容易出錯處的防呆邊界
4. 可重播、可驗證的工程工作流程

## Workshop 結構
這個版本分成兩段。

### 第一段：核心主線

1. 從 standalone app 開始
2. 將 baseline app 發布到 VIVERSE
3. 用 AI IDE skills 整合 auth、avatar、leaderboard
4. 重新發布升級後版本
5. 比較 baseline world 與 upgraded world

### 第二段：PS SDK 延伸

1. 切換到適合展示 streamed asset replacement 的 app
2. 讓 AI IDE 讀取 Polygon Streaming skill
3. 以 `.xrg` streamed asset 取代既有 procedural 或 placeholder 模型
4. 驗證 runtime integration 規則是否被正確遵守
5. 展示替換前後差異

## 第一段 Demo Base
第一段仍然使用原本的 baseline demo app。

它的角色不變：

作為一個乾淨的 before-state，讓 publish、auth、avatar、leaderboard 的價值容易被看見。

## 為什麼第一段仍然先講 Publish
因為主線案例的真正 runtime 是 VIVERSE。

publish 不是最後才補上的部署動作，而是後續平台能力驗證的前提。

## 第一段的技能順序
第一段仍然維持這個順序：

1. `viverse-world-publishing`
2. `viverse-auth`
3. `viverse-avatar-sdk`
4. `viverse-leaderboard`

## 第二段為什麼要另外選 App
PS SDK integration 最重要的是 streamed asset replacement 的可視化差異。

因此第二段不適合硬塞進 hide-and-seek。

更好的做法，是改用更適合顯示模型替換效果的 flight simulator 類型範例。

## 第二段建議 Demo Base
建議使用 flight simulator 類型的 demo，因為 aircraft replacement 的前後對照最直觀。

這一段要展示的不是平台身份，而是 runtime asset streaming integration。

## 第二段的核心 Skill
第二段的主角是：

- `viverse-polygon-streaming-threejs`

這個 skill 的價值，不只是告訴 AI 怎麼呼叫 SDK。

它還會把下列高風險細節一起交給 AI IDE：

1. `StreamController` 的使用方式
2. service worker 與 transcoder 資產的輸出要求
3. 以 wrapper event 而不是 user callback 作為成功判定來源
4. streamed model 的 bounding-box fitting
5. fallback visual 的保留與切換政策

## 為什麼這段很重要
如果沒有 skill，PS integration 很容易失敗在一些看似細小、但其實致命的地方。

例如：

1. 事件名稱接錯
2. service worker 沒有輸出到正確路徑
3. model 實際載入了，但 app 沒有正確接收到 success signal
4. streamed asset 已經掛上去，但 scale、center、ground offset 完全不對

這一段正好能證明：skill 對 AI 的價值不只是在 UI 層，而是在 runtime integration 的可靠性。

## 第二段的前後對照
第二段要強調的前後差異是：

1. 替換前：app 仍使用原本的 procedural 或 placeholder aircraft
2. 替換後：app 改用 streamed `.xrg` model，並且在正確的 runtime 規則下完成替換

這個差異會比口頭說明更有說服力。

## 整體教訓
這個延伸版本想讓觀眾看到兩層結論：

1. AI IDE 可以在 skill 幫助下可靠地完成平台能力整合
2. AI IDE 也可以在 skill 幫助下可靠地完成較複雜的 3D runtime integration

## 次要教訓
另一個重要教訓是：

當整合知識被封裝成 skill，AI 的行為就會更接近可重播的工程流程，而不只是臨場生成程式碼。

## 建議投影片流程
Slide 1：標題與核心論點

Slide 2：為什麼 skill 比 plain prompting 更可靠

Slide 3：主線 workshop lifecycle

Slide 4：standalone baseline app

Slide 5：為什麼 publish 要先做

Slide 6：publish、auth、avatar、leaderboard 這條主線

Slide 7：baseline world 與 upgraded world 的對照

Slide 8：為什麼還要補一段 PS SDK extension

Slide 9：Polygon Streaming skill 解決的不是單純模型載入，而是 runtime integration

Slide 10：PS integration 的高風險細節：service worker、wrapper events、fitting、fallback policy

Slide 11：PS demo 的前後對照

Slide 12：skills 如何把平台整合與 3D streaming 整合都變得更可靠

Slide 13：最後結論

## 講者 framing 備註
這個版本不要講成「多了一個新 workshop」。

要講成：

「前面那條主線證明 AI IDE 能處理平台整合。接下來我用 Polygon Streaming 再補一個進階案例，證明同一套 skill-based 方法也能處理更複雜的 3D runtime integration。」

## 結尾訊息
這個版本最重要的訊息是：

skills 不只是把 AI 的回答變長，或讓 AI 更像會查文件。

skills 真正做的是把容易失敗的工程知識、執行順序與驗證規則，包裝成 AI 可以穩定遵循的 workflow。

## 投影片生成短版
這個延伸版 workshop 先展示原本的主線流程：從 standalone app 出發，發布到 VIVERSE，然後用 AI IDE skills 完成 auth、avatar 與 leaderboard 整合，最後重新發布並比較前後差異。接著再補上一段 Polygon Streaming SDK 延伸 demo，展示 AI IDE 如何在 `viverse-polygon-streaming-threejs` skill 的幫助下，可靠地完成 streamed `.xrg` asset replacement、wrapper event handling、static asset publishing 與 post-load fitting。整體要傳達的是：skill-based AI workflow 不只適用於平台服務整合，也適用於高約束的 3D runtime integration。