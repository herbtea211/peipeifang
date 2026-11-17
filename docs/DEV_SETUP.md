# 配配方｜本機開發環境技術紀錄

-   **紀錄日期：** 2026-11-15
-   **專案名稱：** peipeifang
-   **專案階段：** 本機開發環境建置與基本驗證

## 1. 本機環境

  項目                                       目前版本／狀態
  ------------------------------------------ ------------------------------------
  作業系統                                   macOS 12.7.6 Monterey
  電腦架構                                   Intel x86_64
  Node.js                                    v22.14.0
  npm                                        10.9.2
  Git                                        2.42.0
  Homebrew                                   4.1.12
  Visual Studio Code                         已安裝，可正常開啟；版本號尚未確認
  Expo CLI（由 `npx expo --version` 回報）   58.1.20
  create-expo-app                            5.0.0（建立專案時由 npx 下載執行）

## 2. 專案路徑

**專案根目錄**

``` text
/Users/burgerchen/peipeifang
```

**目前主要目錄結構**

``` text
peipeifang/
├── .git/
├── .vscode/
├── AGENTS.md
├── app.json
├── assets/
├── node_modules/
├── package.json
├── package-lock.json
├── scripts/
├── src/
│   ├── app/
│   │   ├── index.tsx
│   │   ├── _layout.tsx
│   │   └── explore.tsx
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   └── global.css
└── tsconfig.json
```

專案使用 `src/app` 作為 Expo Router 的路由根目錄。

## 3. 專案套件版本

以下版本來自目前專案的 `package.json` 與 `npm ls` 輸出。

  套件                                  版本
  -------------------------------- ---------
  Expo                               58.0.25
  React                               19.3.0
  React DOM                           19.3.0
  React Native                        0.88.1
  Expo Router                        58.0.31
  TypeScript                           6.0.3
  @types/react                        19.3.0
  React Native Web                    0.21.4
  Expo CLI                           58.1.20
  React Native Gesture Handler         3.3.0
  React Native Reanimated              4.7.1
  React Native Safe Area Context      5.11.1
  React Native Screens                4.30.1
  React Native Worklets               0.13.0

`npx expo install --check` 的結果：

``` text
Dependencies are up to date
```

`npm ls react @types/react react-native expo-router expo`
顯示主要套件依賴使用同一組已安裝版本，未顯示 `invalid` 或重複版本衝突。

## 4. 已修改的程式碼

### 檔案

``` text
src/components/app-tabs.web.tsx
```

### 修改目的

修正 Expo Router 的 `TabTriggerSlotProps` 傳入 React Native `Pressable`
時，TypeScript 對 `ref` 型別產生的不相容錯誤（TS2322）。

### 修改一：新增型別匯入

新增：

``` tsx
import type { ComponentProps } from 'react';
```

### 修改二：在 Pressable 的 Props 傳遞處加入型別斷言

修改前：

``` tsx
<Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
```

修改後：

``` tsx
<Pressable {...(props as ComponentProps<typeof Pressable>)} style={({ pressed }) => pressed && styles.pressed}>
```

### 修改範圍

-   只修改 `src/components/app-tabs.web.tsx`。
-   沒有修改 `node_modules`。
-   沒有修改 Expo、React 或 React Native 套件版本。
-   沒有關閉 TypeScript `strict`。
-   沒有移除 `ref` 傳遞。

## 5. 已完成的驗證

  驗證項目                       結果
  ------------------------------ -----------------------------
  `npx expo start --web`         成功啟動 Metro Bundler
  Expo Router                    成功載入 `src/app`
  Web 首頁                       成功顯示
  Web Explore 頁面               可正常切換
  Explore 返回 Home              正常
  `npx expo install --check`     Dependencies are up to date
  `npx tsc --noEmit`（修改前）   發現 1 個 TS2322 錯誤
  `npx tsc --noEmit`（修改後）   無輸出，檢查通過

## 6. 已知事項與尚未驗證項目

1.  啟動 Expo 時曾出現：

    ``` text
    Unable to run simctl:
    Error: xcrun simctl help exited with non-zero code: 72
    ```

    本階段沒有使用 iOS Simulator；Web
    開發伺服器仍成功啟動。此問題尚未處理。

2.  建立專案時 npm 回報 3 個 moderate severity vulnerabilities。尚未執行
    `npm audit fix` 或 `npm audit fix --force`。

3.  Android 手機已安裝 Expo Go，但尚未完成實機連線與執行測試。

4.  iOS 實機測試尚未進行。

5.  VS Code 可正常開啟，但 `code --version`
    當時未取得版本輸出，因此未記錄 VS Code 版本號。

6.  Supabase、PostHog、GitHub Codespaces 與 Expo 雲端建置尚未設定。

## 7. 目前開發環境狀態

**已完成：** - 本機 Node.js、npm、Git 與 Homebrew 環境確認。 - Expo SDK
58 專案建立。 - React Native、TypeScript 與 Expo Router 專案載入。 - Web
預覽啟動。 - 修正一個 Web 導覽元件的 TypeScript 型別錯誤。 - TypeScript
檢查與 Web 基本導覽驗證通過。

**尚待處理：** - Android Expo Go 實機測試。 -
專案正式資料夾架構與範例內容整理。 - Supabase 設定。 - PostHog 設定。 -
GitHub Repository 與 Codespaces 工作流程。 - iOS 測試與雲端建置流程。

------------------------------------------------------------------------

本文件記錄截至 2026-11-15
已實際執行及確認的環境資訊；尚未驗證的項目已明確標示，不代表已完成。
