# Error Log｜錯誤修正紀錄

記錄開發過程中發現的錯誤、根本原因、修正方式與驗證結果。

---

## ERR-001｜Expo Web Hydration Mismatch

**狀態：** 已修正、已複驗

**類型：** SSR / Hydration / Theme

**發生環境：** Expo Web、Chromium 深色模式

**修正分支：** `phase-3/page-development`

**修正 Commit：** `b7b2e6ebc412f52d7bc6957b25dd3ca7f7ae880f`

### 1. 問題描述

在 Expo Web 開啟或重新整理登入頁面 `/login` 時，React 出現 Hydration Mismatch 警告。

錯誤發生位置：

`NativeStackView → Screen → Background → View`

伺服器與瀏覽器首次渲染的背景色不一致：
```arduino
+ backgroundColor: "rgba(1,1,1,1.00)"
- background-color: "rgb(242, 242, 242)"
```

### 2. 根本原因（Root Cause）

伺服器端渲染時使用 `DefaultTheme`（淺色主題），但瀏覽器首次渲染時，Root Layout 直接讀取系統深色偏好並使用 `DarkTheme`。

因此 SSR 產生的 HTML 與瀏覽器第一次渲染的結果不一致，觸發 React Hydration Mismatch。

### 3. 問題重現與定位

1. Chromium 使用深色模式時，重新整理 `/login` 可重現錯誤。
2. 使用 Chrome DevTools 將 `prefers-color-scheme` 設為 `light`。
3. 重新整理後錯誤消失。
4. 確認問題與伺服器、瀏覽器的初始主題設定不一致有關。

### 4. 修正方式（Solution）

使用 `useSyncExternalStore` 管理 Expo Web 的主題狀態，確保 SSR 與 Hydration 階段採用一致的初始值，並在 Hydration 完成後取得及訂閱系統主題偏好。

修改檔案：

- `src/hooks/use-color-scheme.web.ts`：統一 SSR 與 Hydration 的初始主題，並訂閱系統主題變化。
- `src/app/_layout.tsx`：React Navigation 的 `ThemeProvider` 改用共用主題 Hook。
- `src/components/app-tabs.web.tsx`：改用共用主題 Hook。
- `src/components/web-badge.tsx`：改用共用主題 Hook。

### 5. 驗證結果（Verification）

Codex 雲端工作區：

- TypeScript 檢查通過。
- ESLint 檢查通過。
- Expo Web 正式建置通過。
- Chromium 深色模式重新整理：無 Hydration 警告。
- Chromium 淺色模式重新整理：無 Hydration 警告。
- 系統主題切換後，導覽背景即時更新。
- 登入、驗證、配方、採購分頁及 Bottom Sheet 測試通過。

使用者於 Codespaces 測試，確認錯誤已消失。

iOS、Android 實機尚未複驗。

### 6. 經驗與預防（Prevention）

**核心原則：SSR 與瀏覽器首次渲染必須產生一致的結果。**

- 不要在首次渲染時直接依賴伺服器無法取得的瀏覽器狀態。
- 深色／淺色主題必須考慮 SSR 與 Hydration 的一致性。
- 新增使用系統主題的 Web 元件時，優先使用專案共用 Hook。
- Expo Web 測試應涵蓋深色與淺色模式，並重新整理頁面確認沒有 Hydration 警告。

---

## 後續紀錄規範

未來每次確認並修正錯誤後，應在 `docs/ERROR_LOG.md` 新增一筆紀錄。

每筆紀錄包含：

- 錯誤編號與名稱
- 狀態及發生環境
- 問題描述
- 根本原因（Root Cause）
- 問題重現與定位
- 修正方式（Solution）
- 修改檔案
- 驗證結果（Verification）
- 經驗與預防（Prevention）
- Git Commit Hash（若已有）

規範：

- 編號依序為 ERR-001、ERR-002、ERR-003。
- 新增紀錄，不覆蓋舊紀錄。
- 區分已驗證的事實與尚未確認的推測。
- 不得將未執行的測試標記為通過。
- 錯誤修正完成後才將狀態標記為「已修正」。
- 日誌以繁體中文撰寫，技術名詞保留英文。
