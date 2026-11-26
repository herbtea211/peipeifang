# 配配方｜開發計畫

## 1. 開發目標

開發「配配方」Recipe Management Application，讓廚師能夠在工作現場快速查詢、管理及使用配方。

技術架構：
- Frontend：React Native + Expo + TypeScript
- Backend：Supabase（後期導入）
- Product Analytics：PostHog（後期導入）
- Version Control：GitHub
- Cloud Development：GitHub Codespaces

目標平台：
- iOS
- Android
- Web（開發及測試用途）

## 2. 開發原則

1. 先完成前端頁面與操作流程，再導入後端。
2. 前期使用 Mock Data（假資料），不連接 Supabase。
3. 試用階段不需要永久保存資料，重新整理或關閉 App 後，資料可以消失。
4. 所有資料存取應集中管理，避免頁面直接依賴資料庫。
5. 程式碼中必須標示未來需要呼叫資料庫及接收資料的位置。
6. 優先完成可操作的產品，再進行多人測試。
7. 試用確認後，才正式建立 Supabase 並串接資料。

## 3. 開發順序

### Phase 1｜專案基礎架構

- 建立專案目錄。
- 定義檔案與資料夾命名規範。
- 確認程式碼組織方式。

目錄、命名與程式碼組織規範見 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)。

### Phase 2｜Design Tokens

建立設計系統基礎規範：

- Colors
- Typography
- Spacing
- Border Radius
- Shadows

### Phase 3｜頁面骨架與頁面整合

#### 頁面骨架（已完成）

- 依照 Figma 設計建立頁面。
- 完成頁面版面配置。
- 建立頁面之間的導覽流程。
- 先以畫面呈現為主要目標。

#### Page Integration（共用組件完成後進入）

採用 **UI First**，逐步開發、逐步發現、持續整合，最後以驗證後的核心頁面與操作流程定案資料需求。每次只定義當前功能需要的資料，頁面開發前無須先完成所有 Data Model 或 Database Schema。

每個頁面或功能流程依序執行：

1. 確認頁面設計及操作規格。
2. 確認頁面所需的資料，涵蓋 **Read**（讀取哪些資料）、**Write**（新增、修改或刪除哪些資料）與 **Relation**（和其他頁面或資料實體的關聯）。
3. 建立或擴充目前需要的 TypeScript Types 與共用 Mock Data。
4. 優先沿用已完成的共用組件與 Design Tokens，完成頁面整合。
5. 實作頁面操作與資料讀寫。
6. 驗證當前功能及既有頁面的資料一致性。
7. 更新 [資料需求](./DATA_REQUIREMENTS.md) 與開發進度。
8. 進行 Code Review。
9. 依該任務的提交與推送指示執行 Commit & Push。
10. 進入下一個頁面或功能流程。

共用 Mock Data 維持單一資料來源。涉及同一筆資料的頁面應同步反映變更。新頁面揭露新需求時，可以同輪調整既有型別、Mock Data 和受影響頁面，並同步更新文件與驗證相關流程。每輪都完成必要的資料整合。

延續既有 Mock Data 規範。資料在 App 執行期間模擬讀寫，無須永久保存。Hook、Context、Service、Repository 與 API 層按實際需要加入。此階段不串接 Supabase，也不定案正式 Database Schema。核心頁面及操作流程完成並驗證後，以資料需求紀錄作為後續 Schema 設計依據，依 Phase 9 的試用確認條件進入後端階段。

沿用 Native First、Reuse First、Minimal Implementation、No Overengineering、Single Responsibility 和 Necessary Only。共用組件的調整以當前頁面實際需求為限。

#### Auth｜模擬登入

已確認 Google Login、Apple Login、Email OTP、Persistent Session 與合併的 Login／Register 流程。Page Integration 期間各登入方式皆以 Mock Auth 驗證登入、登出、登入狀態恢復及頁面跳轉，並依頁面開發逐步確認 Auth 資料模型。本階段不串接正式服務、不寄送 OTP，也不申請付費服務或 Apple Developer Program。詳見 [Auth 規格](./AUTH_SPEC.md)。

- 登入模組整合 Start、Login、Verify、Mock Session 與 Protected Routes。正式串接與驗證仍依 Auth 上線清單。
- Auth Code Review 將驗證 Email 移至 Auth Context，Challenge 在 Session 保存成功後消耗，並加入登出防重複操作。
- 配方頁登出按鈕為暫時測試入口。正式開發配方頁時移除，待正式登出位置確認後再整合。
- Start 保留原生不定進度 ActivityIndicator，與設計稿水平 Progress Bar 的差異待 UI 驗收。
- Auth UI 第一輪調整 Login 文案與按鈕置中、共用 Input 聚焦回饋及 Verify 游標格提示。原生鍵盤待實機驗收。

### Phase 4｜建立 UI Components

從已建立的頁面中整理重複使用的 UI 元素：

- Buttons
- Input Fields
- Cards
- Navigation
- Dialogs
- 其他共用元件

避免過早抽象化元件，應根據實際頁面需求建立。

#### List Component

- ListItem 與 ListGroup 已實作。公開介面、群組協調及滑動刪除見 [List 規格](./LIST_SPEC.md)。
- List 專項 Code Review 已完成。修正父層移除 onDelete 後仍殘留展開狀態的問題。
- 已執行 TypeScript、Expo flat config ESLint、Expo Web 建置，以及 Chromium 版面、手勢、鍵盤和路由回歸。
- iOS／Android、實際螢幕閱讀器、Safari、Firefox 與實機行動瀏覽器仍待驗證。見 [待實測清單](./PENDING_TESTS.md)。

#### Menu Component

- Menu 本體已實作，Explore 提供單列、群組與操作狀態展示。見 [Menu 規格](./MENU_SPEC.md)。
- Menu Code Review 決議已實作，Chromium 已複驗鍵盤焦點、停用回呼及 DOM／Accessibility Tree。
- Button 整合及跨平台驗證留待後續。見 [待實測清單](./PENDING_TESTS.md)。

#### Alert — Reuse Native API

- 共用 `showAlert()` 已實作，Code Review 通過並維持現有行為。見 [Alert 規格](./ALERT_SPEC.md)。
- Chromium 原生對話框與回呼已驗證。原生裝置、其他瀏覽器及無障礙測試仍待實測。見 [待實測清單](./PENDING_TESTS.md)。

#### 元件 Code Review 決策

- P1-01 已完成。Input 的 `value` 和 `onChangeText` 為必填，由父層管理。見 [Input 規格](./INPUT_SPEC.md)。
- P1-02 已完成。NavigationBar 根據 callback 與 Disabled 狀態決定圖示的互動與無障礙語意。見 [NavigationBar 規格](./NAVIGATION_BAR_SPEC.md)。
- P2-01 已完成。App 固定使用 Light Mode，色彩集中在 `LightColors`，移除不再使用的主題切換邏輯。見 [App 架構](./APP_ARCHITECTURE.md#主題)。
- P2-02 已完成。Input 與 NavigationBar 的可操作圖示由父層提供無障礙名稱。
- P2-03 評估後保留 React Native `Modal`。現階段暫緩採用 Expo Router `formSheet` 或 Expo UI `BottomSheet`。見 [Bottom Sheet 規則](./APP_ARCHITECTURE.md#bottom-sheet-規則)。

正式頁面開發時，NavigationBar 接入 `ScrollView` 後檢查不必要的重新渲染（P2-04）。Bottom Sheet 接入正式表單後，確認鍵盤不遮住內容或關閉按鈕。驗證項目見 [待實測清單](./PENDING_TESTS.md)。

基礎元件全部完成後，安排一項 **Design Tokens Refactoring** 工作，合併 P3-01 與 P3-02：

- 統整 Component Size Tokens，將尺寸與間距分開管理。
- 統整 Disabled Color Tokens，確認命名與共用關係。
- List Divider 採既有不透明 #3C3C43。原始 Figma 顏色相同，透明度為 36%，厚度參考 1px。後續與全站 Divider 一併評估。
- List 次要文字沿用 Typography.caption 的 13／18、400。原始 Figma 參考 15／20、400，後續評估是否有共用的次要文字規格。

若日後統一 Icon 名稱型別，將 ListItem 與 Button、Input、NavigationBar 一起檢查。

### 原 Phase 5／6｜資料模型、Mock Data 與操作流程

原規劃的 TypeScript 資料型別、Mock Data、資料存取服務、頁面讀寫操作與假登入流程，納入 Phase 3 的 Page Integration 循環，依當前頁面或流程逐步完成。既有資料存取規範持續適用。Phase 7 至 Phase 11 保留原編號與安排。

### Phase 7｜部署 Web 測試版

- 將 Web 版本部署至雲端。
- 提供測試網址。
- 邀請多人試用。
- 收集操作問題與使用者回饋。

### Phase 8｜試用與調整

- 根據測試結果調整 UI。
- 修正操作流程。
- 調整資料欄位與功能。
- 確認產品需求。

### Phase 9｜建立 Supabase 後端

試用確認後才開始：

- 建立 Supabase Project。
- 建立 PostgreSQL 資料表。
- 設計資料表關聯。
- 設定 Row Level Security（RLS）。
- 設定 Storage（有需要時）。

### Phase 10｜串接正式資料

- 將 Mock Data 替換為 Supabase 資料。
- 實作正式資料查詢與寫入。
- 依 [Auth 規格](./AUTH_SPEC.md) 串接 Supabase Auth、正式登入方式與 Session 管理，完成合併的登入／註冊及登出流程。
- 確認使用者資料隔離及權限。

### Phase 11｜實機測試

- Android 實機測試。
- iOS 實機測試。
- 確認不同裝置的畫面與操作。
- 修正問題並準備正式發布。
- 正式營運前須停用 Mock Auth，並完成 [Auth Production Release Checklist](./AUTH_SPEC.md#production-release-checklist) 的所有 Release Blocker。

## 4. 資料存取程式碼規範

前期使用 Mock Data，但必須預留未來資料庫串接位置。

當頁面需要共用資料存取邏輯或資料庫串接時，使用既有的 Services 組織方式。Page 不直接呼叫資料庫。

範例：

```tsx
// TODO: 未來改為呼叫 Supabase，取得配方資料
const recipes = await recipeService.getRecipes();

// TODO: 接收資料庫回傳的配方資料
setRecipes(recipes);
```

新增、修改、刪除資料時，也必須標示未來需要呼叫資料庫的位置。

建議資料夾：

```text
src/
├── app/                  # Pages / Screens
├── components/           # UI Components
├── services/             # 資料存取服務
├── mocks/                # 假資料
├── types/                # TypeScript 資料型別
├── constants/            # Design Tokens
└── hooks/                # Custom Hooks
```

## 5. Codex 執行規則

1. 開始開發前，先閱讀本文件及專案其他相關規範。
2. 嚴格遵循開發階段與順序。
3. 不要自行提前建立 Supabase 或實作正式 Auth。
4. 未經確認，不要擅自新增大型套件或改變既定技術架構。
5. 每次修改應以當前階段的工作為範圍。
6. 修改既有檔案時，保留與當前任務無關的原有內容。
7. 若開發需求與本文件的規劃有衝突，先提出說明，不要自行改變開發方向。

---

文件版本：1.0
