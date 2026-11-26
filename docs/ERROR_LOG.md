# Error Log｜錯誤修正紀錄

記錄開發、測試、環境與跨平台問題，保留根本原因、修正經驗及預防措施。尚未完成的測試與驗收見 [PENDING_TESTS.md](./PENDING_TESTS.md)，開發規範見 [AGENTS.md](../AGENTS.md)，流程與進度見 [DEV_PLAN.md](./DEV_PLAN.md)。

## 紀錄規範

- 依序分配唯一 Error ID，既有編號維持穩定。同一問題有新證據時更新原紀錄。
- 分類使用 Design Specification（設計規格）、Layout（版面）、Interaction（互動）、Platform Compatibility（平台相容）、Environment（環境）、Logic（邏輯）或 Testing Gap（測試缺口）。
- Date 記錄可查證的發生日期。若僅能確認驗收或回顧日期，須說明。Phase 可使用工作項目名稱以對照開發紀錄。
- 明確標示未確認的原因與未執行的驗證。實機問題須以對應實機結果結案。新增紀錄使用繁體中文並保留英文技術名詞。
- 保留歷史紀錄。可用 Error ID 或文件連結引用待測清單與規格。

## ERR-001｜Expo Web Hydration Mismatch

- **Error ID**：ERR-001
- **Date**：首次發生日期未確認（2026-11-19 修正提交）
- **Phase**：Phase 3｜頁面骨架
- **Category**：Platform Compatibility
- **Environment**：Expo Web、Chromium 深色模式
- **Symptom**：重整 `/login` 發生 Hydration Mismatch，Navigation 背景色在 SSR 和瀏覽器首次渲染時不同。
- **Root Cause**：SSR 使用 DefaultTheme，瀏覽器首次渲染直接按系統偏好選到 DarkTheme。
- **Solution**：當時以 `useSyncExternalStore` 讓 SSR 與 Hydration 使用相同主題，再訂閱系統偏好。
- **Prevention**：首次渲染維持 SSR 一致性，驗證支援的主題與重整流程。
- **Verification**：Chromium 淺色與深色複驗通過，使用者在 Codespaces 確認。原生未複驗。
- **Status**：已修正、Web 已複驗
- **Related Files**：`src/hooks/use-color-scheme.web.ts`、`src/app/_layout.tsx`、`src/components/app-tabs.web.tsx`、`src/components/web-badge.tsx`
- **Related Commit**：`b7b2e6ebc412f52d7bc6957b25dd3ca7f7ae880f`

<details>
<summary>原始 Hydration 修正與驗證紀錄</summary>

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

</details>

## ERR-002｜Login Placeholder 不符合設計規格

- **Error ID**：ERR-002
- **Date**：2026-11-26（驗收或回顧日期，首次發生時間未確認）
- **Phase**：Page Integration｜Auth
- **Category**：Design Specification
- **Environment**：Login Page UI 驗收
- **Symptom**：Email Placeholder 顯示 `mail`。
- **Root Cause**：頁面指定的 Placeholder 與設計文案不同。
- **Solution**：頁面改用 `xxxxxx@mail.com`。
- **Prevention**：逐項核對 Placeholder、Label 與設計文案。
- **Verification**：Chromium 核對 Placeholder。
- **Status**：已修正，Web 已驗證
- **Related Files**：`src/app/(auth)/login.tsx`
- **Related Commit**：`f394f05e854c9bf86adb9ad549bad8ed80951e92`

## ERR-003｜Button 水平置中失敗

- **Error ID**：ERR-003
- **Date**：2026-11-26（驗收或回顧日期，首次發生時間未確認）
- **Phase**：Page Integration｜Auth
- **Category**：Layout
- **Environment**：Login Page UI 驗收
- **Symptom**：取得驗證碼按鈕未在內容區水平置中。
- **Root Cause**：共用 Button 自帶 `alignSelf: 'flex-start'`。
- **Solution**：使用頁面橫列置中，沿用共用 Button 尺寸與樣式。
- **Prevention**：整合前先檢查共用元件的 Layout，頁面專屬排列由外層處理。
- **Verification**：Chromium 比對 Input 內容區與按鈕的水平中心。
- **Status**：已修正，Web 已驗證
- **Related Files**：`src/app/(auth)/login.tsx`、`src/components/ui/button.tsx`
- **Related Commit**：`f394f05e854c9bf86adb9ad549bad8ed80951e92`

## ERR-004｜共用 Input Focus 樣式不符合規格

- **Error ID**：ERR-004
- **Date**：2026-11-26（驗收或回顧日期，首次發生時間未確認）
- **Phase**：Page Integration｜Auth
- **Category**：Interaction
- **Environment**：Login Page 與共用 Input
- **Symptom**：聚焦時缺少指定的邊框及陰影。
- **Root Cause**：既有 Input 規格及實作在聚焦時維持原樣。
- **Solution**：加入絕對定位邊框與獨立 Focus Shadow Token，由原生焦點事件切換。
- **Prevention**：驗證適用的 Default、Focus、Blur、Pressed、Disabled 狀態，並比對聚焦前後尺寸及位置。
- **Verification**：Chromium 驗證 Tab 聚焦、邊框、陰影及無 Layout Shift。
- **Status**：已修正，原生視覺待驗收
- **Related Files**：`src/components/ui/input.tsx`、`src/constants/theme.ts`、`docs/INPUT_SPEC.md`
- **Related Commit**：`f394f05e854c9bf86adb9ad549bad8ed80951e92`

## ERR-005｜OTP Focus 指示不符合規格

- **Error ID**：ERR-005
- **Date**：2026-11-26（驗收或回顧日期，首次發生時間未確認）
- **Phase**：Page Integration｜Auth
- **Category**：Interaction
- **Environment**：Verification Page
- **Symptom**：六格 UI 缺少會隨實際游標位置移動的單格焦點指示。
- **Root Cause**：視覺欄位原先未追蹤原生輸入的選取位置。
- **Solution**：使用原生 `onSelectionChange`，聚焦時僅高亮游標所在格，退焦時還原。
- **Prevention**：自訂輸入 UI 應同步原生 Selection，測試中途移動游標、刪除及貼上。
- **Verification**：Chromium 測試聚焦、游標移動及退焦。Android Expo Go 已觀察到藍色底線切換。
- **Status**：已修正，跨平台複驗待完成
- **Related Files**：`src/app/(auth)/verification.tsx`、`docs/AUTH_SPEC.md`
- **Related Commit**：`f394f05e854c9bf86adb9ad549bad8ed80951e92`

## ERR-006｜OTP 自動聚焦及原生鍵盤驗證不足

- **Error ID**：ERR-006
- **Date**：2026-11-26（驗收或回顧日期，首次發生時間未確認）
- **Phase**：Page Integration｜Auth
- **Category**：Testing Gap
- **Environment**：桌面 Chromium、Android Expo Go
- **Symptom**：初期 Web 測試僅確認焦點，原生數字鍵盤仍需實機驗收。
- **Root Cause**：桌面 Chromium 無法驗證原生虛擬鍵盤是否彈出。
- **Solution**：保留原生 `autoFocus`、`focus()` 與 `keyboardType="number-pad"`，分開記錄焦點及鍵盤結果。
- **Prevention**：用實機分別驗證進頁、重發及手動點擊後的鍵盤行為。
- **Verification**：Android Expo Go 已觀察到數字鍵盤顯示。Chromium 已驗證焦點。
- **Status**：實機部分驗證，完整情境待測
- **Related Files**：`src/app/(auth)/verification.tsx`、`docs/PENDING_TESTS.md`
- **Related Commit**：`f394f05e854c9bf86adb9ad549bad8ed80951e92`

## ERR-007｜Expo Tunnel 建立失敗

- **Error ID**：ERR-007
- **Date**：2026-11-26（驗收或回顧日期，首次發生時間未確認）
- **Phase**：Page Integration｜Auth
- **Category**：Environment
- **Environment**：GitHub Codespaces、Expo CLI
- **Symptom**：預設 Expo Tunnel 未建立，手機無法依原流程連線。
- **Root Cause**：本次預設 Tunnel 流程要求登入 Expo 帳號。
- **Solution**：使用 `npx expo start --tunnel ngrok`，依提示安裝全域 `@expo/ngrok`。
- **Prevention**：雲端手機測試優先使用已驗證的啟動方式，全域工具留在開發環境。
- **Verification**：使用者確認 Tunnel 已建立，Android Expo Go 已連線。
- **Status**：已排除，使用者已驗證
- **Related Files**：無專案檔案變更
- **Related Commit**：無

## ERR-008｜Android OTP 文字重疊

- **Error ID**：ERR-008
- **Date**：2026-11-26（驗收或回顧日期，首次發生時間未確認）
- **Phase**：Page Integration｜Auth
- **Category**：Platform Compatibility
- **Environment**：Android Expo Go、Verification Page
- **Symptom**：輸入 `12` 時，自訂六格與原生 TextInput 小字同時顯示。
- **Root Cause**：尚未確認。已觀察到原生文字仍顯示，底層渲染原因待查。
- **Solution**：在原生 TextInput 的既有樣式加入 `opacity: 0`，保留單一輸入欄與 OTP 行為。
- **Prevention**：自訂原生輸入應實機驗證文字渲染、焦點、鍵盤、AutoFill 與無障礙。
- **Verification**：Chromium Web 回歸通過。Android 修正效果依 [待實測清單](./PENDING_TESTS.md#auth-ui-第一輪驗收)驗收。
- **Status**：修正方案已提交，待 Android Expo Go 實機驗收
- **Related Files**：`src/app/(auth)/verification.tsx`、`docs/AUTH_SPEC.md`、`docs/PENDING_TESTS.md`
- **Related Commit**：`7f04502ba9074cd3fe45fbf8c51d8045f7d4b2b0`

## ERR-009｜驗證 Email 出現在網址

- **Error ID**：ERR-009
- **Date**：2026-11-26（驗收或回顧日期，首次發生時間未確認）
- **Phase**：Page Integration｜Auth
- **Category**：Logic
- **Environment**：Mock Auth、Expo Web Code Review
- **Symptom**：Login 將 Email 放入路由參數，Verify URL 含 Email。
- **Root Cause**：驗證中的 Email 透過 Route Params 傳遞。
- **Solution**：將驗證中 Email 暫存於 Auth Context，Verify 無有效流程時返回 Login。
- **Prevention**：檢查驗證網址與重新整理的行為，個資留在必要的記憶體狀態。
- **Verification**：Auth 回歸確認 Verify URL 無 Email、無 Challenge 會回 Login、返回保留輸入且冷卻仍生效。
- **Status**：已修正，Web 已驗證
- **Related Files**：`src/app/(auth)/login.tsx`、`src/app/(auth)/verification.tsx`、`src/hooks/use-auth.tsx`
- **Related Commit**：`7fe24e6806a24a8e50dbfca4a986105986de76ec`

## ERR-010｜Mock OTP Challenge 可重複驗證

- **Error ID**：ERR-010
- **Date**：2026-11-26（驗收或回顧日期，首次發生時間未確認）
- **Phase**：Page Integration｜Auth
- **Category**：Logic
- **Environment**：Mock Auth 服務、Auth Code Review
- **Symptom**：成功驗證過的 Challenge 可在有效期限內再次通過。
- **Root Cause**：原驗證成功流程未標記 Challenge 為已使用。
- **Solution**：Session 保存成功後才消耗該筆 Challenge，保存期間阻擋重複驗證及重發，失敗允許重試。
- **Prevention**：驗證一次性使用、並行操作、儲存失敗重試及重發限制。
- **Verification**：Auth 回歸驗證已用 Challenge 拒絕、保存失敗可重試、冷卻仍生效且重發後可驗證。
- **Status**：Mock 已修正並驗證，正式驗證碼輪替待串接
- **Related Files**：`src/services/mock-auth.ts`、`docs/AUTH_SPEC.md`
- **Related Commit**：`7fe24e6806a24a8e50dbfca4a986105986de76ec`
