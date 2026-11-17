# 配配方｜專案總說明

## 1. 專案基本資訊

- 專案名稱：配配方
- 英文名稱：Peipeifang
- 專案類型：Recipe Management Application
- 產品定位：提供廚師在餐廳工作現場使用的配方管理工具。

## 2. 產品目的

「配配方」是一個讓廚師能夠儲存、查詢及管理料理配方的應用程式。

產品源自餐廳廚房的實際工作經驗，開發時應優先考慮廚師在工作現場的使用情境。

設計與開發應重視：
- 操作效率
- 資訊清楚
- 容易查詢
- 操作流程簡單
- 適合手機使用
- 符合廚房工作情境

## 3. 目標平台

- iOS
- Android
- Web（開發與測試用途）

採用 React Native + Expo，盡可能共用程式碼，支援不同平台。

## 4. 技術架構

### Frontend
- React Native
- Expo
- TypeScript
- Expo Router

### Backend（後期導入）
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Realtime
- Row Level Security（RLS）

### Product Analytics（後期導入）
- PostHog

### Development Tools
- GitHub
- GitHub Codespaces
- Visual Studio Code
- Codex
- Expo EAS

## 5. 開發策略

採用前端優先的開發方式。

第一階段先完成可操作的產品，再導入正式後端。

開發期間：
- 使用 Mock Data 模擬資料庫資料。
- 不需要永久保存測試資料。
- 先完成頁面與操作流程。
- 預留未來資料庫串接位置。
- 試用確認後，再建立 Supabase 並串接正式資料。

詳細開發順序請參閱：

`docs/DEV_PLAN.md`

## 6. 相關文件

| 文件 | 用途 |
|---|---|
| `AGENTS.md` | Codex 專案開發指引 |
| `docs/PROJECT_GUIDE.md` | 專案總說明 |
| `docs/DEV_SETUP.md` | 開發環境技術紀錄 |
| `docs/DEV_PLAN.md` | 開發順序與計畫 |

## 7. 開發原則

1. 以實際廚房工作情境作為產品設計依據。
2. 優先考慮手機操作體驗。
3. 保持 iOS 與 Android 跨平台相容性。
4. 先完成產品操作流程，再導入正式後端。
5. 避免不必要的技術複雜度。
6. 依照 DEV_PLAN.md 的開發順序執行。

---

文件版本：1.0