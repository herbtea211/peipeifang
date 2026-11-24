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

### Phase 3｜建立頁面（Pages / Screens）

- 依照 Figma 設計建立頁面。
- 完成頁面版面配置。
- 建立頁面之間的導覽流程。
- 先以畫面呈現為主要目標。

### Phase 4｜建立 UI Components

從已建立的頁面中整理重複使用的 UI 元素：

- Buttons
- Input Fields
- Cards
- Navigation
- Dialogs
- 其他共用元件

避免過早抽象化元件，應根據實際頁面需求建立。

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

### Phase 5｜資料模型與假資料

- 使用 TypeScript 定義資料型別。
- 建立 Mock Data。
- 建立資料存取服務（Services）。
- 使用假資料模擬資料庫回傳結果。

目前不建立 Supabase，也不需要永久保存資料。

### Phase 6｜完成操作流程

- 串接頁面與假資料。
- 實作新增、查詢、修改、刪除等操作。
- 建立假登入流程。
- 確認操作結果能正確反映在介面上。

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
- 串接 Authentication（Auth）。
- 實作註冊、登入、登出及密碼管理。
- 確認使用者資料隔離及權限。

### Phase 11｜實機測試

- Android 實機測試。
- iOS 實機測試。
- 確認不同裝置的畫面與操作。
- 修正問題並準備正式發布。

## 4. 資料存取程式碼規範

前期使用 Mock Data，但必須預留未來資料庫串接位置。

資料存取集中在 Services，不要讓各個 Page 直接呼叫資料庫。

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
