# 配配方｜專案目錄與命名規範

## 目錄

| 路徑 | 用途 |
| --- | --- |
| `src/app/` | Expo Router 頁面與導覽配置。 |
| `src/components/` | 跨頁面重用的介面元件。 |
| `src/components/ui/` | 可在不同場景重用的基礎 UI 元件。 |
| `src/constants/` | Design Tokens 與跨模組使用的常數。 |
| `src/hooks/` | 可重用的 React hooks。 |
| `src/services/` | 資料存取介面與實作。 |
| `src/mocks/` | 模擬資料庫回傳的假資料。 |
| `src/types/` | 跨模組共用的 TypeScript 資料型別。 |
| `assets/` | 圖片、圖示與其他靜態資源。 |
| `docs/` | 產品、環境與開發規範。 |
| `scripts/` | 專案維護腳本。 |

`services/`、`mocks/` 和 `types/` 先用 `.gitkeep` 保留目錄。對應程式碼在 Phase 5 開始加入。

## 命名

- 一般檔名與資料夾使用小寫 kebab-case，例如 `recipe-card.tsx`、`recipe-service.ts`。包含 JSX 的檔案使用 `.tsx`，其他 TypeScript 檔案使用 `.ts`。
- 路由沿用 Expo Router 的命名，例如首頁 `index.tsx`、導覽配置 `_layout.tsx` 和動態路由 `[id].tsx`。
- 平台變體使用相同的基本檔名和平台後綴，例如 `app-tabs.tsx` 和 `app-tabs.web.tsx`。
- React 元件與 TypeScript 型別使用 PascalCase，例如 `RecipeCard` 和 `Recipe`。函式與變數使用 camelCase。自訂 hook 的函式名稱以 `use` 開頭，例如 `useTheme`，對應檔名為 `use-theme.ts`。

## 程式碼組織

- 頁面在 `src/app/` 組合畫面、管理頁面狀態並處理導覽。專屬於單一頁面的程式碼可留在該路由檔中，共用元件與 hooks 放在路由目錄外。
- 跨目錄匯入沿用 `@/` 別名，例如 `@/components/themed-text`。根目錄的資源使用 `@/assets/`。
- 資料流程由頁面呼叫 `services/`，共用型別取自 `types/`。前期由 services 使用 `mocks/` 提供假資料，並標示未來資料庫呼叫、參數、回傳結果與錯誤處理的位置。
