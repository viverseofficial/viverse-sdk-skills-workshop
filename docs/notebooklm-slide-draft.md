# VIVERSE SDK Skills Workshop

## 標題
VIVERSE SDK Skills for AI IDEs：從獨立可執行 App 到已發布的 VIVERSE World

## 一句話摘要
這場 workshop 示範如何把一個可獨立執行的 web app，透過可重用的 AI IDE skills，逐步變成一個已發布到 VIVERSE 的 world，並完成 publishing、authentication、avatar integration 與 leaderboard 功能升級。

## 受眾定位
這場 workshop 適合已經知道 AI 能幫忙產生程式碼的人，但想進一步看到：當工作流程知識被包裝成可重用 skills 時，AI 在真實平台整合任務上的表現，如何變得更可靠。

## 核心論點
這個 skills repository 的價值，不只是讓程式碼生成更快。真正的價值在於，它能把正確的整合順序、部署規則、執行環境假設，以及避免失敗的 guardrails，提供給 AI IDE，讓它能更穩定地完成真實的 VIVERSE app 開發工作。

## 主要故事線
這場 workshop 採用一個很清楚的生命週期：

1. 從一個可獨立執行的 app 開始。
2. 先把 baseline app 發布到 VIVERSE。
3. 再用 AI IDE skills 整合 VIVERSE 平台能力。
4. 重新發布升級後的版本。
5. 對照 baseline world 與 upgraded world 的差異。

## Demo Base
這次的 baseline app 是一個可獨立執行的 hide-and-seek 遊戲。

它被刻意設計成在 VIVERSE integration 之前就能運作，這樣才能成為一個乾淨的 before-state。

這個 app 可以先在本機展示，但這場 workshop 的真正目標執行環境是 VIVERSE。

## 為什麼 Publish 要放在前面
在這個 demo 裡，publish 不是最後一個營運步驟。

Publish 要先做，因為這個 app 的目標是跑在 VIVERSE 上，而有些 VIVERSE capability 只有在真實平台執行環境裡驗證時才有意義。

這也代表 workshop 應該先介紹 publishing，再介紹 auth、avatar 與 leaderboard。

## 第一個 Skill：World Publishing
這場 workshop 的第一個 skill 是 VIVERSE world publishing skill。

它的目的，是幫助 AI IDE 判斷正確的 publish strategy、維持 App ID 處理一致、避免上傳錯誤資料夾，並把第一個可分享的 baseline world 發布到 VIVERSE。

這建立了 workshop 的第一個重要觀念：部署知識本身就是 skill system 的一部分，而不是另外分開的事情。

## Baseline World
完成 publish 後，workshop 就有第一個真實里程碑：

一個已經跑在平台上的 baseline VIVERSE world，但它還沒有使用 VIVERSE login、authenticated avatar loading 或 leaderboard submission。

這會是第一個可以分享的版本。

## 第二個 Skill：Auth
下一個 skill 是 VIVERSE auth。

這個 skill 教 AI IDE 如何正確整合 login，包括 app ID resolution、SDK detection、handshake timing，以及 profile fallback behavior。

這一段的重要 workshop 訊息是：AI 不是從零亂猜一個 auth flow，而是在遵循一套有根據的 VIVERSE integration playbook。

## 第三個 Skill：Avatar
完成 auth 之後，下一個 skill 是 avatar SDK skill。

這個 skill 會把遊戲裡原本通用的 placeholder player representation，升級成已登入使用者的 VIVERSE avatar。

這是 workshop 中最容易被看見的轉變，也是最強的 feature-level demo moment。

## 第四個 Skill：Leaderboard
下一個 skill 是 leaderboard integration。

這個 skill 會加入分數提交與排行榜顯示，同時也包含平台特有的規則，例如 Studio configuration、score upload shape、result deduplication，以及 ranking fetch behavior。

這能清楚說明：skills 編碼的不只是 UI code，而是實際的操作知識。

## Before And After
這場 workshop 應該強調同一個 app 的兩個已發布版本之間的差異：

1. Baseline world：已發布、可執行，但缺少平台身份與競技功能。
2. Upgraded world：在 skill-based integration 之後再次發布，現在具備 login、個人化 avatar 與 leaderboard 行為。

這會讓 skill system 的價值變得非常具體。

## 主要教訓
最重要的 lesson 是：當整合知識被外部化成可重用 skills 之後，AI IDE workflow 會變得更可靠。

不用再期待模型自己記住分散在各處的文件，skill repository 會把真實平台工作需要的規則、順序與 guardrails 直接提供出來。

## 次要教訓
第二個 lesson 是：部署與 runtime context 必須被視為工程流程的一部分。

在這場 workshop 裡，publish 是有意義平台驗證的前置條件，不只是最後一個 release checkbox。

## 建議投影片流程
Slide 1：標題與核心論點

Slide 2：只靠 AI prompt 做 SDK integration 的問題

Slide 3：什麼是 skill

Slide 4：從 standalone app 到 upgraded VIVERSE world 的 workshop lifecycle

Slide 5：standalone baseline app

Slide 6：為什麼這個 demo 要先 publish 再 integration

Slide 7：publish skill 作為第一個平台 workflow

Slide 8：跑在 VIVERSE 上的 baseline world

Slide 9：auth skill integration

Slide 10：avatar skill integration

Slide 11：leaderboard skill integration

Slide 12：baseline world 與 upgraded world 的對照

Slide 13：skills 相較於 plain prompting 多帶來什麼

Slide 14：最後結論

## 講者 framing 備註
在描述這場 workshop 時，不要把 baseline app 講成一個不完整或偏弱的版本。

更好的 framing，是把它描述成一個刻意保留的 standalone starting point，這樣後續 integration 的價值才會更容易被觀察到。

在描述 publish 時，要強調這是 AI skill story 的一部分，而不是獨立存在的 DevOps 收尾工作。

在描述 auth、avatar 與 leaderboard 時，可以反覆強調同一件事：AI 之所以能成功，是因為它使用了已打包好的平台知識。

## 結尾訊息
這場 workshop 示範的不是一組可重用 prompts 而已。

它示範的是一組可重用、具平台感知能力的 AI workflows。

從一個 standalone app 出發，先把它發布到真實 runtime，再透過 skills 逐層加入 VIVERSE capabilities，這場 workshop 呈現的是：AI IDE 如何在真實產品工作裡，變得更可靠、更可重複，也更實用。

## 投影片生成短版
這場 workshop 從一個可獨立執行的遊戲開始，先把它發布成 VIVERSE 上的 baseline world，再透過 AI IDE skills 逐步整合 publishing、authentication、avatar loading 與 leaderboard 功能，最後重新發布升級版本。核心概念是：skill repository 會把正確的 workflow 規則與平台限制提供給 AI IDE，讓它能在真實的 VIVERSE app lifecycle 中可靠運作，而不只是停留在 localhost 上。