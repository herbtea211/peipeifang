# 配配方 App 架構參考

本文件記錄目前的路由、Layout 職責與導覽規則。開發階段與進度由 [DEV_PLAN.md](./DEV_PLAN.md) 維護。

## 已實作的頁面架構

```text
Root Layout
│
├── Auth Layout
│   ├── Login Screen
│   └── Verification Screen
│
└── Main Tabs Layout
    ├── Recipe Screen
    ├── Purchase Screen
    ├── Bottom Tab
    └── Bottom Sheet
        ├── Recipe Sheet Content
        └── Purchase Sheet Content
```

Root 也保留原有 Expo 範例的獨立路由 `/starter` 與 `/explore`。這兩頁由 Starter Layout 管理。

## Layout 職責

| Layout | 檔案 | 職責 |
| --- | --- | --- |
| Root | `src/app/_layout.tsx` | 管理頂層 Stack，保留全域 Theme Provider 與啟動畫面。 |
| Auth | `src/app/(auth)/_layout.tsx` | 管理 Login 與 Verification 的測試導覽。此 Stack 不顯示 Bottom Tab。 |
| Main Tabs | `src/app/(tabs)/_layout.tsx` | 固定顯示配方與採購的 Bottom Tab，管理共用 Bottom Sheet 的開關和目前內容。 |
| Starter | `src/app/(starter)/_layout.tsx` | 保留 Expo 範例原有的 Web 與原生分頁介面。 |

## 實際畫面與路由

Expo Router 的括號群組不會出現在網址中。

| 路由或元件 | 實際檔案 |
| --- | --- |
| `/` 啟動入口 | `src/app/index.tsx`，轉往 `/login` |
| `/login` | `src/app/(auth)/login.tsx` |
| `/verification` | `src/app/(auth)/verification.tsx` |
| `/recipes` | `src/app/(tabs)/recipes.tsx` |
| `/purchase` | `src/app/(tabs)/purchase.tsx` |
| `/starter` | `src/app/(starter)/starter.tsx` |
| `/explore` | `src/app/(starter)/explore.tsx` |
| Bottom Tab | `src/app/(tabs)/_layout.tsx` |
| 共用 Bottom Sheet | `src/components/ui/bottom-sheet.tsx` |
| 開啟 Sheet 的 Context 與 hook | `src/hooks/use-bottom-sheet.ts` |
| 臨時測試畫面框架 | `src/components/preview-screen.tsx` |

執行 `npm run web`，開啟 Expo 顯示的網址即可依序操作 Login → Verification → 配方。Verification 也可返回 Login。進入配方後可用 Bottom Tab 切換採購，兩頁各有「開啟 Sheet」測試按鈕。

## Bottom Sheet 規則

- Main Tabs Layout 保存目前的 Sheet 內容。預設關閉，關閉時清空內容。
- 配方和採購的 Screen 透過 hook 傳入自己的內容。共用容器處理顯示、遮罩和關閉，頁面專屬內容留在對應的 Screen。
- 容器使用 React Native 的透明 Modal 與底部 Safe Area。展開時全頁遮罩覆蓋 Bottom Tab 並攔截操作。按「關閉 Sheet」後可繼續使用分頁。
- 目前以測試按鈕觸發。未來預計在容器內加入向上滑動展開、向下滑動收合與動畫。

## 未來規劃

- 配方、採購的詳情等瀏覽頁面原則上保留 Bottom Tab。
- 驗證畫面目前以導覽測試為主。正式登入、驗證、配方 CRUD 和採購流程依開發計畫實作。
- 正式頁面完成時可移除臨時測試文字、按鈕及畫面框架。

## 維護方式

新增、移除或調整頁面、Layout 或導覽規則時，同步更新本文件的路由圖、職責與檔案對照。功能驗證後才從「未來規劃」移到已實作說明。
