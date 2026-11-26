# Alert — Reuse Native API

配配方 Phase 4 的共用原生對話框入口。React Native 0.88.1 的 Alert.alert 支援 iOS 與 Android，React Native Web 0.21.4 的 Alert.alert 是空實作。Expo 58.0.25 專案可沿用這些原生能力，以瀏覽器原生對話框提供 Web 相容入口。各平台接受原生外觀差異。

## 用法

```ts
import { showAlert } from '@/utils/alert';

showAlert('刪除項目？', '此操作無法復原。', [
  { text: '取消', style: 'cancel' },
  { text: '刪除', style: 'destructive', onPress: deleteItem },
]);
```

參數直接沿用 Parameters<typeof Alert.alert>，包含 title、message、buttons 和 options。iOS 與 Android 原樣傳遞參數，按鈕數量、順序、樣式、回呼與 Options 依各平台原生 API 決定。Android 原生 Alert 最多支援三個按鈕。

## Web 對應

| 輸入 | 行為 |
| --- | --- |
| 省略 buttons | 呼叫 window.alert |
| 一個按鈕 | 呼叫 window.alert，返回後執行該按鈕的回呼（若提供） |
| 兩個按鈕，恰好一個 cancel | 呼叫 window.confirm。true 對應非 cancel，false 對應 cancel，與陣列順序無關 |
| 空按鈕陣列、三個以上按鈕、兩個按鈕無法辨識唯一 cancel | Console Warning，結束呼叫 |
| 有欄位的 Options，或有 isPreferred: true 的按鈕 | Console Warning，結束呼叫。空 Options 物件可以使用 |
| SSR 無 window | 直接結束 |

Warning 情境不開啟對話框，也不執行任何按鈕或 onDismiss 回呼。Web 不處理 cancelable、userInterfaceStyle、onDismiss，也不指定預設聚焦按鈕。瀏覽器的原生 API 不提供獨立標題、按鈕文字、排列或 destructive 造型控制。Title 和 Message 以空行連接，按鈕外觀與本地化由瀏覽器決定。Alert.prompt 不在此介面範圍內。

瀏覽器可能因背景頁面或設定抑制原生對話框。confirm 被抑制時可能回傳 false，會走 cancel 路徑。alert 沒有可辨識是否實際顯示、或使用者如何關閉的回傳值，單鍵 Alert 用於通知及提示。回呼只代表函式已返回，不能作為使用者明確同意的依據。需要明確同意的操作必須使用含 cancel 的雙鍵確認，且取消回呼不得執行需要使用者同意的破壞性操作。

## 測試入口

Explore（/explore）的 Alert 測試區包含預設、單鍵、確認與取消、交換按鈕順序、三鍵、缺少 cancel 及原生 Options。回呼只寫入 Console，便於核對。跨平台待測見 [待實測清單](./PENDING_TESTS.md)。

參考 [React Native Alert](https://reactnative.dev/docs/alert)、[React Native Web Alert 原始碼](https://unpkg.com/react-native-web@0.21.4/src/exports/Alert/index.js)、[MDN alert](https://developer.mozilla.org/docs/Web/API/Window/alert) 與 [MDN confirm](https://developer.mozilla.org/docs/Web/API/Window/confirm)。
