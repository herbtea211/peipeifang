# 配配方｜Auth 規格

## 已確認的登入方式

- Google Login
- Apple Login
- Email OTP
- Persistent Session（持續登入）
- 合併 Login／Register 流程

## 目前階段｜Mock Auth

Page Integration 期間，所有登入方式均採用 Mock 實作。使用假使用者資料及模擬登入狀態，驗證登入、登出、登入狀態恢復與頁面跳轉。Auth 資料模型依頁面開發逐步確認，並同步記錄到 [資料需求文件](./DATA_REQUIREMENTS.md)。

本階段不串接真實 Google OAuth 或 Apple Login，不實際寄送 Email OTP，也不申請付費服務或加入 Apple Developer Program。

## Production Release Checklist

以下項目均尚未實作或驗證，皆為正式上線的 Release Blocker。

- [ ] 串接 Supabase Auth。
- [ ] 串接正式 Google Login。
- [ ] 申請 Apple Developer Program（US$99／年，以申請時官方價格為準）。
- [ ] 串接正式 Apple Login。
- [ ] 設定正式 SMTP 郵件服務。
- [ ] 串接正式 Email OTP。
- [ ] 實作正式 Session 保存、恢復及 Token 更新。
- [ ] 實作正式登入狀態及身分驗證。
- [ ] 驗證登入失敗、取消、Session 失效及登出流程。
- [ ] 確認正式環境無法透過 Mock Auth 繞過身分驗證。
- [ ] 驗證資料存取權限及 Supabase RLS。
- [ ] 完成正式跨平台登入測試。

## 正式環境安全規範

Mock Auth 僅限開發及測試環境使用。正式營運環境必須停用 Mock Auth，假使用者資料及模擬登入狀態不得作為有效的身分驗證憑證。

正式 Auth 完成且上述 Release Blocker 全數通過前，不得對外提供正式營運服務。

## Page Integration 實作

- Start 使用提供的啟動插圖及不定進度指示器。AsyncStorage 恢復完成後立即啟用 Expo Router Protected Routes，依 Session 開啟配方清單或登入。
- Login 以共用 Input 和 Button 輸入、清除、驗證 Email。Apple／Google 按鈕模擬成功，不開啟外部驗證。相同正規化 Email 對應同一測試使用者，各社群來源使用不同固定 ID。
- Verify 使用單一原生 TextInput，視覺分成六格。支援數字、貼上與平台提供的 OTP 自動填入。固定碼 123456，六位即驗證。驗證時檢查 15 分鐘到期，重發需等待 15 秒。同一 Email 的請求限制保存在共用 Mock 服務，返回登入後仍適用。
- Auth Context 提供目前 Session、初始化、登入與登出。AsyncStorage 只保存 Mock Session，是一般 Mock Data 不持久保存的例外。OTP 請求與驗證中的 Email 保存在記憶體。配方頁暫時提供登出測試入口。
- 前端路由保護套用至配方與採購分頁。Mock 使用者與 Session 只能用於開發／測試。

## 後續正式驗證

Production Release Checklist 另包含社群品牌與平台審核、憑證安全儲存、Access Token／Refresh Token 自動更新、OTP 重發及舊碼失效、後端 Rate Limit 與跨 Provider 帳號關聯策略。正式 Build 必須停用可繞過驗證的 Mock Auth。

## Auth Code Review 修正

- Verify 從 Auth Context 讀取驗證中的 Email，網址只使用 /verification。返回 Login 清除驗證中的 Email，表單仍保留原輸入。登入、登出也會清除驗證資料。OTP Challenge 與重發限制維持在共用 Mock 服務。
- Challenge 的 used 與 saving 旗標共用同一筆記憶體資料。開始儲存 Session 時鎖定該筆驗證與重發，成功才標記已使用，失敗釋放鎖定供重試。已使用的 Challenge 無法再次驗證，原重發期限仍生效。重發建立新的可用 Challenge。固定 Mock 碼無法驗證正式 OTP 新舊碼失效。
- 登出在操作開始時立即鎖定並停用按鈕。儲存清除成功時由 Protected Routes 導向，清除失敗時 Session 保留並提示錯誤。

## Auth UI 第一輪驗收調整

- Login 的 Email 提示為 xxxxxx@mail.com。取得驗證碼按鈕由頁面橫列置中，沿用共用 Button 的尺寸。共用 Input 的 Focus 邊框與陰影見 [Input 規格](./INPUT_SPEC.md)。
- Verify 沿用單一原生 TextInput。聚焦時依原生游標位置只高亮一格底線，Blur 後還原。原生 autoFocus 處理進頁聚焦，重發成功清除輸入並聚焦首格。Web 使用底線提供焦點提示。
- keyboardType 為 number-pad。原生虛擬鍵盤是否自動彈出由平台決定，實機結果待驗證。

## UI-06｜Verify 文字重疊

Android Expo Go 實機回報，輸入驗證碼後，六格數字與原生 TextInput 的小字同時顯示。此次僅在原生輸入欄加入 opacity: 0，保留原有屬性與輸入機制。重疊原因尚未確認，修正效果待 Android 實機驗收。
