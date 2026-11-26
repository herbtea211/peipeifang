# 配配方｜資料需求

本文件隨 Page Integration 持續更新，記錄已確認的資料需求。核心頁面與操作流程完成並驗證後，以本文件作為後續 Supabase Database Schema 設計的依據。正式 Schema 於後端階段定案。

## 維護方式

- 每完成一個頁面或功能流程，更新本文件與開發進度。
- 僅將已確認的實體、欄位、型別和關聯列入對應表格。仍有疑問的需求放在「尚未確認的需求」。
- 每個頁面記錄 Read（讀取）、Write（新增、修改、刪除）與 Relation（跨頁面或資料實體關聯）。經確認無此需求時填「無」。
- 新需求影響既有資料時，在同一輪更新型別、共用 Mock Data 與受影響頁面，驗證跨頁一致性。重大調整需記錄原因與影響。

## 已確認的資料實體

| 實體 | 用途 | 確認來源或對應流程 |
| --- | --- | --- |
| Mock User | 識別測試使用者 | Auth 登入流程 |
| Mock Session | 保存目前模擬登入 | 啟動與登出 |
| OTP Challenge | 驗證及限制重發 | 登入與驗證 |

## 已確認的資料欄位

| 實體 | 欄位 | TypeScript 型別 | 必填或選填 | 用途與規則 |
| --- | --- | --- | --- | --- |
| Mock User | id／provider | string／email、apple、google | 必填 | 正規化 Email 或 Provider 決定 Mock 身分 |
| Mock User | email | string | Email 登入時提供 | 社群登入使用固定 Mock 身分 |
| Mock Session | user | MockSession user | 必填 | AsyncStorage 僅保存 Mock Session |
| OTP Challenge | email／expiresAt／resendAt | string／number／number | 必填 | Email 為記憶體索引，時間為毫秒 |
| OTP Challenge | used／saving | boolean／boolean | 必填 | Session 保存完成後才消耗，保存期間鎖定同一 Challenge |
| Auth Context | verificationEmail | string 或 null | 暫存 | Login 與 Verify 共用，範圍限目前驗證流程的記憶體 |
| Verify UI | code | string | 表單狀態 | 六位數字，Mock 固定碼不持久保存 |

## 頁面資料需求

| 頁面或功能流程 | Read | Write | Relation | 驗證紀錄 |
| --- | --- | --- | --- | --- |
| Start | Mock Session | 恢復共用 Session | Session → User | 工作區 Auth 測試 |
| Login | 同 Email 的重發限制 | 建立 OTP Challenge 與驗證中 Email，或社群 Session | Email → Challenge／User | 工作區 Auth 測試 |
| Verify | 驗證中 Email、OTP 與期限 | 重發 Challenge，保存 Session 後標記已使用 | Email → Challenge → User | 工作區 Auth 測試 |
| 配方分頁 | Mock Session | 登出時清除 Session | Session → User | 工作區 Auth 測試 |

## 已確認的資料關聯

| 來源實體 | 關聯實體 | 已確認的規則 | 受影響頁面或流程 |
| --- | --- | --- | --- |
| Mock Session | Mock User | 一個 Session 指向一個目前使用者 | Start、Login、Verify、配方 |
| OTP Challenge | Email | 每個 Email 一筆目前請求 | Login、Verify |

## 尚未確認的需求

| 頁面或功能流程 | 待確認事項 | 確認條件 |
| --- | --- | --- |
| 正式 Auth | 跨 Provider 帳號關聯與正式憑證模型 | Supabase Auth 規格與測試 |

## 重大調整紀錄

| 日期 | 調整內容 | 原因 | 受影響頁面、型別與 Mock Data |
| --- | --- | --- | --- |
| 2026-11-26 | Auth 加入 Mock Session 持久保存 | 驗證重啟後維持登入 | Auth Context、Mock Session 與 Auth 頁面 |
| 2026-11-26 | 驗證 Email 移至記憶體，Challenge 改為一次性使用 | 避免 Email 出現在網址與重複驗證 | Login、Verify、Auth Context、Mock Auth |
