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

## ListItem v1.23／ListGroup v1.9

### 已知缺陷與操作限制

- **P1-02**　收合時向右拖曳可能誤觸 onPress。拖曳沒有產生 click 時，Ref 也可能擋住下一次沒有 onPressIn 的 DOM 啟動。快速滑動與點擊收合有偶發誤觸，固定時序複測通過。
- **P1-03／P2-02**　Chromium 刪除並卸載列後，焦點回到 BODY，再按 Tab 可到下一個刪除入口。以滑鼠點擊滑動按鈕而父層保留資料時，焦點可能留在已遮住的按鈕。鍵盤刪除且保留資料時，焦點與按鈕提示仍維持。

### 套件相容與升級後重驗

- **P1-01**　Gesture Handler 3.3.0、Reanimated 4.7.1、Worklets 0.13.0 的 Web 收合工作可能在父層卸載展開列後更新已移除的 handler。刪除回呼保留雙重排程以先開始收合。外部提早卸載仍可能報 No handler for tag，重複啟動也可能執行多次回呼。見 [Issue #4680](https://github.com/software-mansion/react-native-gesture-handler/issues/4680) 與 [上游修正 #4682](https://github.com/software-mansion/react-native-gesture-handler/commit/2edcc620670d4bda5217dc78df6d1d97122d88ae)。
- [ ] Expo 相容版本包含上游修正後，使用原始 close()／onDelete() 對照重測同步卸載、保留資料與外部卸載。驗證通過後移除 Web 雙重排程。

### 尚未實際驗證

- [ ] **iOS、Android**　用原生觸控驗證動畫中斷、反向滑動、同組互斥、垂直捲動、Divider 厚度與系統字體縮放。確認 P1-02 的兩個 Ref 是否都需要。
- [ ] **VoiceOver、TalkBack**　確認自訂刪除 Action，特別是四種回呼組合、展開及收合動畫期間的可用性，以及裝飾 Icon 的閱讀順序。
- [ ] **Web 螢幕閱讀器、Safari、Firefox、實機行動瀏覽器**　驗證焦點順序、刪除、列卸載後的焦點接續、手勢與垂直捲動，並複驗快速操作。Gesture Handler Pressable 的無障礙啟動能力也尚未完整驗證。
- [ ] **Android Modal**　正式將 List 接入 Sheet 時，以 Modal 內的 GestureHandlerRootView 驗證原生 Swipeable。Web 在臨時展示已驗證可滑動。
- [ ] **正式頁面**　複驗資料更新、重新排序和切換回呼時的群組協調。Chromium 的臨時展示已驗證這些基本流程。

### 既有回歸測試發現

- [ ] **Chromium Tabs**　修改前後均觀察到，從配方切換採購時，路由與選中 Tab 已更新，但 Accessibility Tree 仍顯示配方，採購按鈕可能被重疊畫面擋住。直接載入採購路由可正常開關 Sheet。另行排查分頁畫面切換。

### 後續優化

- Icon 名稱型別、Divider 透明度與次要文字尺寸統一議題見 [開發計畫](./DEV_PLAN.md)。45% 保留為列內 Flexbox 上限。
- 專案的 lint script 為 expo lint。尚未有 ESLint 設定或本地 ESLint 依賴。本次以暫存 Expo SDK 58 flat config 檢查 src，專案正式設定另行決定。

參考 [List 規格](./LIST_SPEC.md)。

## Menu

- Code Review 後的 Chromium 回歸確認，DOM 無 aria-pressed、aria-selected。Accessibility Tree 呈現按鈕及停用狀態，選取狀態僅有視覺呈現。完整 Web 選單語意留待 Button 整合。
- [ ] **iOS、Android 觸控範圍**　自然列高約 26 pt，低於 iOS 44 pt、Android 48 dp 建議值。以實機驗證觸控，再於視覺調整時重新評估。

- [ ] **iOS、Android**　驗證觸控按壓、停用及選取狀態、系統字體縮放、陰影與分隔線。使用 VoiceOver／TalkBack 驗證按鈕名稱、選取、停用語意及啟動行為。
- [ ] **Safari、Firefox、實機行動瀏覽器及 Web 螢幕閱讀器**　驗證按鈕名稱與狀態、鍵盤順序、焦點描邊以及 Enter／Space。Chromium 的 DOM 與 Accessibility Tree 只涵蓋瀏覽器自動化。
- [ ] **Button 整合後**　驗證收合先於回呼、停用項目不收合、方向鍵與焦點移入／還原。

參考 [Menu 規格](./MENU_SPEC.md)。

## Alert — Reuse Native API

- [ ] **iOS、Android**　實測預設、單鍵、雙鍵、三鍵、cancel／destructive 與原生回呼。Android 複驗 cancelable 和 onDismiss，iOS 複驗 userInterfaceStyle。
- [ ] **Safari、Firefox、實機行動瀏覽器**　測試原生 alert／confirm、按鈕順序無關的回呼、對話框抑制行為與不支援情境。
- [ ] **Accessibility**　使用 VoiceOver、TalkBack 和 Web 螢幕閱讀器確認原生對話框的宣告、焦點與按鈕操作。

參考 [Alert 規格](./ALERT_SPEC.md)。

## 正式頁面接入後

- [ ] **P2-04**　NavigationBar 接入 `ScrollView` 後，檢查持續捲動是否造成不必要的重新渲染。
- [ ] **iOS、Android**　Bottom Sheet 接入正式表單後，確認鍵盤開啟時仍可操作內容與關閉按鈕。

## 主題與原生環境

- [ ] **iOS、Android**　分別在系統淺色、深色下啟動 App，並於執行中切換系統主題，確認 Root Layout、底部分頁和 Sheet 始終維持淺色（P2-01 Light Mode Only）。
- [ ] **iOS Simulator**　若使用模擬器，複驗開發環境紀錄中尚未排查的 `xcrun simctl` 啟動問題。

## 已完成的驗證

- Expo Web 已實測登入與驗證導覽、配方／採購切換，以及兩個 Bottom Sheet 開關和遮罩。
- Expo Web Hydration Mismatch 已在 Chromium 的淺色與深色重新整理流程複驗，使用者也已在 Codespaces 確認修正。詳見 [ERR-001](./ERROR_LOG.md#err-001expo-web-hydration-mismatch)。
- Button 已在 Web 驗證尺寸、按壓配色、節流、Loading 與無障礙狀態。iOS 和 Android 打包已通過。
- NavigationBar 已在 Web 驗證標題排版、圖示互動、捲動臨界值、高度動畫中斷與內容跟隨。
- Input 已在 Web 驗證受控輸入、`maxLength`、密碼遮蔽、Focus、Disabled、圖示回呼與提示文字。元件測試使用臨時頁面。
- List 已在 Chromium 驗證原生單行省略樣式、滑動展開、同組收合、跨組獨立、點擊收合及刪除，並驗證 Tab 聚焦、Enter 與 Space。
- P1-03 已用同一套 Chromium 操作流程對照修改前後，驗證刪除按鈕的焦點提示與隱藏、Tab／Shift+Tab、Enter／Space、無指標 DOM 啟動，以及父層移除或保留資料時的刪除。固定時序也複驗同組收合、跨組獨立與展開後點擊收合。
- Menu 已在 Chromium 以 360、768 px 驗證容器寬度、分隔線、空群組、長文字省略、四種文字狀態、按壓背景、停用回呼、Tab／Shift+Tab、可見焦點、Enter／Space、無指標 DOM 啟動與 Accessibility Tree。
- Alert 已在 Chromium 實測預設、單鍵及雙鍵原生對話框、交換雙鍵順序，以及不支援情境發出警告且不執行回呼。iOS／Android 參數原樣轉發以 mock 驗證，原生對話框待實機測試。
