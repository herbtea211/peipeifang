# 配配方｜待實測清單

整理截至 2026-11-23 的驗證狀態，對應 `phase-3/page-development`。下列核取方塊代表尚未完成的實測。記錄結果時，請附上測試 Commit、裝置與系統版本，以及通過或重現的結果。

## 實機啟動與導覽

- [ ] **iOS、Android**　使用支援專案 Expo SDK 的執行環境啟動 App，確認啟動畫面正常離開，首頁會進入 Login。Android 先前已安裝 Expo Go，連線與執行仍待確認。
- [ ] **iOS、Android**　走過 Login → Verification → 配方，也測試 Verification 返回 Login，並確認 Auth 頁沒有 Bottom Tab。
- [ ] **iOS、Android**　切換配方與採購，分別開啟 Sheet，確認內容對應目前頁面。Sheet 展開時應覆蓋底部分頁並阻擋操作，關閉後可再切換。
- [ ] **iOS、Android**　確認 Safe Area 與系統導覽列不遮住 Bottom Tab 或 Sheet 的關閉按鈕。在 Android 也測試用系統返回鍵關閉 Sheet。

參考 [App 架構](./APP_ARCHITECTURE.md) 與 [開發環境紀錄](./DEV_SETUP.md)。

## Button v4.8

- [ ] **iOS、Android**　確認 Primary／Secondary 的尺寸、標籤與左右圖示，並檢查按壓、停用和 Loading 的配色、動畫與排版。Loading 各驗證一次有文字及純圖示的版型。
- [ ] **iOS、Android**　快速連點，確認 500ms 節流無延後補觸發。只在有效按下時產生一次 Light 觸覺回饋。停用、Loading、節流擋下的點擊及 `haptic={false}` 都不應震動。
- [ ] **iOS、Android**　用 VoiceOver／TalkBack 確認文字按鈕與純圖示按鈕的可讀名稱，以及 Disabled、Loading 狀態。

參考 [Button 規格](./BUTTON_SPEC.md)。

## NavigationBar v5.4

目前元件已實作，尚未接入正式頁面。可在接入畫面或 Sheet 後，用父層實際的 `scrollY` 驗證。

- [ ] **iOS、Android**　確認頂部 Safe Area、24 × 24 的圖示與觸控範圍、標題置中與單行省略。隱藏標題或左右圖示時，保留原本的排版空間。
- [ ] **iOS、Android**　確認不可捲動或 `scrollY <= 0` 時為 96，`scrollY > 0` 時為 44。快速來回捲動時，動畫從目前高度續接，下方內容跟隨且不重疊。換頁與返回時，確認高度依各自頁面的捲動位置決定。
- [ ] **iOS、Android**　左右圖示各自驗證點擊、未設定、隱藏與 Disabled。確認 Disabled 不觸發回呼，按下也沒有額外動畫或 Haptic。

參考 [NavigationBar 規格](./NAVIGATION_BAR_SPEC.md)。

## Input v5.3

目前元件已實作，尚未接入正式頁面。

- [ ] **iOS、Android**　實測單行輸入、文字與 Placeholder 對齊、游標與選字，以及複製、剪下、貼上。確認 Focus 前後外觀一致，Android 沒有非預期的原生底線或文字偏移。
- [ ] **iOS、Android**　實測 `maxLength`、鍵盤類型、自動聚焦、密碼遮蔽與送出事件。特別留意 Android 安全輸入搭配 email 或電話鍵盤，以及 iOS 電話鍵盤的原生送出限制。
- [ ] **iOS、Android**　檢查 Disabled 不可編輯、不彈出鍵盤、無陰影，右側圖示灰階且無法觸發動作。正常狀態下確認圖示有回呼時可點擊，無回呼時只顯示，隱藏時保留 24 × 24 空間。
- [ ] **iOS、Android**　確認一般與錯誤提示能換行，未提供提示時不佔空間，錯誤只改變提示文字顏色。

參考 [Input 規格](./INPUT_SPEC.md)。

## 主題與原生環境

- [ ] **iOS、Android**　在系統淺色、深色下啟動 App，並於執行中切換系統主題，確認 Root Layout、底部分頁和 Sheet 正常更新。
- [ ] **iOS Simulator**　若使用模擬器，複驗開發環境紀錄中尚未排查的 `xcrun simctl` 啟動問題。

## 已完成的驗證

- Expo Web 已實測登入與驗證導覽、配方／採購切換，以及兩個 Bottom Sheet 開關和遮罩。
- Expo Web Hydration Mismatch 已在 Chromium 的淺色與深色重新整理流程複驗，使用者也已在 Codespaces 確認修正。詳見 [ERR-001](./ERROR_LOG.md#err-001expo-web-hydration-mismatch)。
- Button 已在 Web 驗證尺寸、按壓配色、節流、Loading 與無障礙狀態。iOS 和 Android 打包已通過。
- NavigationBar 已在 Web 驗證標題排版、圖示互動、捲動臨界值、高度動畫中斷與內容跟隨。
- Input 已在 Web 驗證受控輸入、`maxLength`、密碼遮蔽、Focus、Disabled、圖示回呼與提示文字。元件測試使用臨時頁面。
