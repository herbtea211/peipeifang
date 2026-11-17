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

1. 專案目錄與命名規範
2. Design Tokens
3. 建立 Pages / Screens
4. 建立共用 UI Components
5. 建立 TypeScript 資料模型與 Mock Data
6. 完成頁面操作與假登入流程
7. 部署 Web 測試版
8. 試用與調整
9. 建立 Supabase 後端
10. 串接 Auth 與正式資料庫
11. iOS / Android 實機測試

不要自行跳過階段或提前實作後續功能。

### 3. 前期資料處理原則

目前階段使用 Mock Data，不連接 Supabase。

- 使用 TypeScript 定義資料型別。
- 使用 Mock Data 模擬資料庫回傳結果。
- 新增、修改、刪除操作先在應用程式執行期間模擬。
- 不需要永久保存資料。
- 不需要實作真正的帳號驗證。
- 不要提前安裝或設定 Supabase。

### 4. 預留未來資料庫串接位置

資料存取應集中在 `services/`，不要讓 Page 直接依賴資料庫。

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

- 先依照 Figma 設計建立頁面。
- 頁面完成後，再整理重複使用的 UI 元素。
- 根據實際需求建立共用 Components。
- 不要為了抽象化而過早建立大量共用元件。
- 優先維持頁面結構清楚及跨平台相容性。

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