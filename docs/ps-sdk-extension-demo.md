# PS SDK Demo Extension

這份文件是給你在原本 workshop 主線之外，再加上一段 Polygon Streaming SDK 展示時使用的延伸版 demo 設計。

它不是一個獨立 workshop。

比較正確的定位是：

1. 先完成原本的 publish + auth + avatar + leaderboard 主線
2. 再加一段較進階的 PS SDK integration showcase

## 這段延伸 Demo 的目的

原本的 workshop 已經能證明一件事：

AI IDE 在有 skill 的情況下，能更可靠地完成 VIVERSE 平台整合。

PS SDK 延伸段則是把這個論點再往前推一步：

AI IDE 不只可以整合平台身份與服務能力，也可以處理較複雜的 3D runtime asset streaming integration。

## 為什麼不建議把它變成獨立 Workshop

PS SDK integration 比 auth 或 leaderboard 更容易掉進細節。

如果把它獨立成 workshop，焦點會很快從「skill 讓 AI 更可靠」偏移成「如何 debug streaming runtime」。

比較好的做法是把它當成第二段加碼內容：

1. 主線先交付一個完整、清楚、可重播的 skill story
2. 再用 PS SDK 當進階案例，證明 skill 也能處理 3D asset integration

## 建議 Demo App

如果要補 PS SDK integration，最適合的展示 app 不是 hide-and-seek。

建議改用 flight simulator 類型的範例，因為它的「替換前 / 替換後」差異最容易被觀眾立即看懂。

建議來源：

- `viverse-ai-agent/templates/demo-flight-simulator-v2`

原因：

1. 它已經有明確的 Polygon Streaming aircraft swap support
2. 它本身也已具備 VIVERSE auth 與 leaderboard 上下文
3. `aircraftUrl` 是非常清楚的可操作 hook
4. 視覺變化比 tank 類範例更容易在短時間 demo 中被理解

## 延伸版 Demo 故事線

這個版本不要改寫原本 workshop 的主線。

請把它講成兩段：

### 第一段：核心整合主線

1. 從 standalone app 開始
2. 先 publish 到 VIVERSE
3. 用 skills 整合 auth、avatar、leaderboard
4. 重新 publish
5. 比較 baseline world 與 upgraded world

### 第二段：進階資產整合延伸

1. 換到 flight simulator demo
2. 說明這次不是要展示身份或排行榜，而是展示 Polygon Streaming asset replacement
3. 讓 AI IDE 讀 `viverse-polygon-streaming-threejs` skill
4. 指定要把既有 procedural aircraft 替換成 `.xrg` streamed asset
5. 驗證 service worker、transcoder、wrapper events、bounding-box fitting 是否正確
6. 展示替換前後的飛行器差異

## 這段 Demo 想傳達的重點

你要觀眾看到的不是「AI 幫我載入一個模型」。

你要觀眾看到的是：

1. AI 有能力遵守一套嚴格的 runtime integration 規則
2. AI 不只是改 UI，而是能處理 service worker、SDK wrapper events、fallback policy、model fitting 這些細節
3. skill 的價值在於把這些本來很容易漏掉的工程知識封裝起來

## 建議 Live Demo 流程

1. 先用原本 workshop 主線完成第一段內容
2. 明確告訴觀眾：下面是進階版 skill 範例
3. 打開 flight simulator template
4. 指出 `aircraftUrl` 與 aircraft replacement hook
5. 請 AI IDE 先讀 `viverse-polygon-streaming-threejs/SKILL.md`
6. 要 AI 檢查目前 app 是否已具備 PS SDK 的必要前置條件
7. 要 AI 實作或確認 streamed model replacement
8. 執行最窄驗證
9. 展示 procedural aircraft 與 streamed aircraft 的差異

## 建議 Prompt 形狀

### Prompt A：先分類目前 app 的 PS readiness

```text
Read the skill at skills/viverse-polygon-streaming-threejs/SKILL.md from the VIVERSE SDK Skills repository and inspect demo-flight-simulator-v2. Tell me whether this app already has the required Polygon Streaming runtime structure, what still needs to be verified, and what the safest next step is.
```

### Prompt B：要求 AI 實作或確認 aircraft replacement

```text
Read the VIVERSE Polygon Streaming Three.js skill and integrate a Polygon Streaming aircraft replacement into demo-flight-simulator-v2 using the existing aircraftUrl hook. Preserve gameplay, keep a visible fallback until wrapper-level load success is confirmed, and validate the required service worker, transcoder assets, wrapper events, and post-load fitting behavior.
```

### Prompt C：要求 AI 做最窄驗證

```text
Run the narrowest validation for the Polygon Streaming integration in demo-flight-simulator-v2. Confirm build output, required static assets, expected wrapper event wiring, and whether the streamed aircraft replacement is ready for live demo use.
```

## 建議在投影片上怎麼說

這一段不要講成「我們現在換一個新的 workshop」。

更好的說法是：

「前面的主線展示了平台能力整合。現在我用一個較進階的 3D asset streaming 案例，補充說明同一套 skill-based AI IDE workflow 也能處理更複雜的 runtime integration。」

## 適合放進投影片的對照句

主線案例回答的是：

- AI 能不能可靠地整合平台身份與服務能力？

PS 延伸案例回答的是：

- AI 能不能可靠地整合高約束的 3D streaming runtime？