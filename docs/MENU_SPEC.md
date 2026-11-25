# Menu Component Specification

配配方 Phase 4 的行內 Menu。可在 Explore（`/explore`）預覽單列、單群組、多群組與空群組。

## 原生能力

專案使用 Expo 58.0.25、React Native 0.88.1、React Native Web 0.21.4 和 Expo UI 58.0.28。React Native Core 的 View、Pressable 和既有 ThemedText 可在三端共用。Expo UI 提供 iOS SwiftUI Menu／ContextMenu 和 Android Compose DropdownMenu，這些元件以觸發器或錨點呈現平台選單。Universal List 提供資料列，但也包含捲動容器。本次需要由父層排版的行內內容與自訂群組分隔，採用 Core 元件。

## 公開介面

```ts
export type MenuItem = {
  id: string;
  label: string;
  onPress: () => void;
  selected?: boolean;
  disabled?: boolean;
};

export type MenuProps = {
  groups: MenuItem[][];
};
```

id 必須在同一 Menu 內唯一且穩定。label 與 onPress 必填。selected、disabled 缺省時，在視覺上皆為 false。父層決定單選或多選及選取值。Menu 執行各列自己的回呼，停用列不執行回呼。Pressed 由 Pressable 提供，只改變背景。停用文字優先於選取文字。

每個非空群組內的列之間有細 Divider，兩個非空群組之間有一個粗 Separator。首尾無分隔，空群組跳過。沒有可顯示資料時回傳 null。

## 版面與 Design Tokens

Menu 以 100% 寬度填滿父層，由外部決定寬度、位置、可用高度及捲動。高度依內容延伸。外層保留陰影，內層使用同樣圓角裁切背景與分隔線。標籤使用 ThemedText 與原生單行尾端省略，保留原生字體縮放。

| 用途 | 實際使用 | Figma 差異 |
| --- | --- | --- |
| 表面、預設、選取文字 | surface #FFFFFF、text #1C1C1E、primary #007AFF | 相同 |
| 停用文字、按壓背景 | buttonDisabled #D1D1D6、backgroundElement #F0F0F3 | 沿用共用狀態色 |
| 字體 | Typography.caption，13／18、400 | 參考 15／20、400 |
| 列內距 | LayoutSpacing.xs 4、lg 16 | 相同 |
| 細 Divider | hairlineWidth，divider #3C3C43 | 厚度依平台，Chromium 為 1 CSS px。參考 0.5 及 36% 透明度 |
| 粗 Separator | LayoutSpacing.sm 8，backgroundSelected #E0E1E6 | 高度相同，參考黑色 10% 透明度 |
| 圓角與陰影 | BorderRadius.lg 16，Shadows.surface 0px 0px 20px 0px #0000001A | 沿用既有表面規格 |
| Web 焦點 | primary #007AFF，2 px 內縮描邊 | 描邊置於裁切範圍內 |

## Accessibility 與整合責任

列使用 button 語意與 Pressable 的 selected／disabled 狀態。Code Review P2-01／P2-02 決議，省略 selected 時保持未指定，Web 移除 aria-pressed。Chromium 實測 DOM 未輸出 aria-selected 或 aria-pressed，Accessibility Tree 保留按鈕名稱及停用狀態，未呈現選取狀態。Web 完整選單語意留待 Button 整合。React Native Web Pressable 的 focused 提供可見描邊，Tab／Shift+Tab 移動焦點，Enter／Space 執行操作。

Code Review P2-03 保留約 26 pt 的自然列高，低於 iOS 建議的 44 pt 與 Android 建議的 48 dp。實機驗證及後續視覺調整時重新評估。P3-01 至 P3-03 的 Typography、Divider、Separator 差異已由設計端確認，沿用上表數值。

本體提供資料及列回呼介面。將來由 Button 整合層控制開關、錨點、外部點擊、浮層、動畫及可用高度。有效操作先觸發收合，再執行項目的回呼。停用操作兩者皆不執行。項目間方向鍵、Home、End、Escape、自動聚焦和焦點還原也由整合階段處理。

相關實測與限制見 [待實測清單](./PENDING_TESTS.md)。
