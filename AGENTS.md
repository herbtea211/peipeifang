# AGENTS.md

## Project Context

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## 配配方專案規則

### 1. 開始開發前必讀文件

開始任何開發工作前，先閱讀以下文件：

- `docs/PROJECT_GUIDE.md`：了解產品定位、功能與技術架構。
- `docs/DEV_SETUP.md`：了解開發環境與已完成的設定。
- `docs/DEV_PLAN.md`：了解開發階段與工作順序。

如果文件尚未建立或內容不足，不要自行假設其中的規劃。

### 2. 開發順序

嚴格遵循 `docs/DEV_PLAN.md` 定義的開發順序。

目前開發方向：

- Phase 1、2 建立專案基礎架構與 Design Tokens。
- Phase 3 先建立頁面骨架，完成 Phase 4 共用組件後進入 Page Integration。
- 原 Phase 5／6 的資料模型、假資料、頁面操作與假登入，併入 Page Integration 循環。
- Phase 7 至 11 依既有計畫部署 Web 測試版、試用與調整、建立 Supabase 後端、串接 Auth 與正式資料庫、進行 iOS／Android 實機測試。

不要自行跳過階段或提前實作後續功能。

### 3. 前期資料處理原則

目前階段使用 Mock Data，不連接 Supabase。

- 使用 TypeScript 定義資料型別。
- 使用 Mock Data 模擬資料庫回傳結果。
- 新增、修改、刪除操作先在應用程式執行期間模擬。
- 不需要永久保存資料。
- 不需要實作真正的帳號驗證。
- 不要提前安裝或設定 Supabase。

#### UI First 與漸進式資料整合

- 開始每個頁面或流程時，確認當前的 Read、Write、Relation，再按需建立或擴充 TypeScript Types 和共用 Mock Data。
- 同一業務資料使用同一來源，跨頁面須同步反映變更。新需求影響既有資料時，在同一輪更新受影響的資料及頁面，複驗一致性。
- 每輪依開發計畫完成頁面與讀寫整合，更新 [資料需求文件](docs/DATA_REQUIREMENTS.md) 與開發進度後進行 Code Review。
- 按當前需求採用 Hook、Context、Service、Repository 或 API 層。正式 Database Schema 以已驗證的核心流程為依據，留到後端階段設計。

### 4. 預留未來資料庫串接位置

需要共用資料存取邏輯或串接資料庫時沿用 `services/`。Page 不直接依賴資料庫。

程式碼中必須使用清楚的註解，標示未來需要：

- 呼叫資料庫的位置。
- 傳送資料庫的參數。
- 接收資料庫回傳資料的位置。
- 處理資料庫錯誤的位置。

範例：

```tsx
// TODO: 未來改為呼叫 Supabase，取得配方資料
const recipes = await recipeService.getRecipes();

// TODO: 接收資料庫回傳的配方資料
setRecipes(recipes);
```

未來切換 Supabase 時，應優先修改 Services，不應大幅修改既有頁面。

### 5. 頁面與 UI Components 開發原則

- 依 Figma 設計與操作規格整合頁面，優先沿用現有共用組件及 Design Tokens。
- 實際出現重複需求時，再整理可共用的 UI 元素。
- 根據實際需求建立共用 Components。
- 不要為了抽象化而過早建立大量共用元件。
- 優先維持頁面結構清楚及跨平台相容性。

#### Minimal Implementation

- Native First：優先使用 React Native、Expo 與既有套件的能力。
- No Overengineering：依目前需求決定元件結構與介面。
- Single Responsibility：分清元件、父層及頁面各自的責任。
- Reuse First：優先複用既有元件、Design Tokens 與依賴。
- Necessary Only：只建立目前需要的 Props、State、Hook、Ref 與 View。Figma 的 Frame 層級供視覺參考，程式結構依版面與互動責任決定。

#### Native Capability Assessment

開發新元件前，核對專案安裝版本，盤點 React Native、Expo 與既有套件的元件及 API。確認 iOS、Android、Web 的支援差異與產品需求，列出可直接複用及需自行實作的部分，再決定元件架構。

### 6. Supabase 與 Auth 延後實作

在產品完成前期試用與調整之前：

- 不建立 Supabase Project。
- 不建立正式資料表。
- 不實作正式 Auth。
- 不串接正式資料庫。

只有進入 `DEV_PLAN.md` 的後端開發階段，才開始處理這些工作。

### 7. 修改程式碼的原則

- 優先修改當前開發階段需要的檔案。
- 不要擅自修改與任務無關的程式碼。
- 不要擅自改變既定技術架構。
- 不要未經確認就新增大型套件或第三方依賴。
- 遇到規劃衝突時，先說明問題並等待確認。
- 完成任務後，說明修改的檔案及內容。

---

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch `https://docs.expo.dev/llms.txt` — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use Expo Router for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required.

Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.

Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies.
- Docs: https://docs.expo.dev/versions/latest/index.md