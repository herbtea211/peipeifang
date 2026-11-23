# NavigationBar Component Specification v5.4

**Project：** 配配方（Peipeifang）\
**Component：** NavigationBar\
**Tech Stack：** React Native + Expo + TypeScript\
**Status：** Ready for Implementation

---

## 01｜開發原則

請以 **Minimal Implementation** 為原則。

- 使用最簡單、最少程式碼、容易理解及維護的方式實作。
- 優先沿用專案現有元件與依賴，不新增非必要套件。
- 不建立不必要的 Hook、Context、Provider、工具函式或抽象層。
- 不預先開發未確認的功能。
- 不增加規格以外的 Props、狀態或互動。
- 不修改無關檔案。

**先檢查現有程式碼，再決定最簡單的實作方式。不要為了擴充性而過度設計。**

## 02｜Component Layout

建立單一 NavigationBar 元件，包含三個區域：
```css
NavigationBar
├── Left Icon
├── Title
└── Right Icon
```

| Property           | Value       |
| ------------------ | ----------- |
| Width              | 100%        |
| Default Height     | 96px        |
| Short Height       | 44px        |
| Horizontal Padding | 16px        |
| Background         | Transparent |
| Border / Shadow    | None        |
| Layout             | Horizontal  |
| Vertical Alignment | Center      |

- NavigationBar 固定於 Screen 或 Sheet 頂部。
- Safe Area 由父層處理。
- 左右 Icon 各保留 24 × 24px 空間，即使未顯示也不影響排版。
- Title 永遠相對整個 NavigationBar 水平置中。
- Title 與左右 Icon 至少相距 8px。

## 03｜Title

| Property    | Value          |
| ----------- | -------------- |
| Font        | PingFang TC    |
| Weight      | Semibold / 600 |
| Size        | 20px           |
| Line Height | 24px           |
| Color       | #1C1C1E        |
| Alignment   | Center         |
| Lines       | 1              |
| Overflow    | Ellipsis (…)   |

- Title 可以直接指定固定文字，或由頁面資料動態傳入。
- 使用同一個 `title` Prop。
- 不設定預設標題。
- `showTitle` 預設為 `true`。
- 隱藏 Title 時，保留中央排版區域。
- 不提供額外的字體樣式設定。

## 04｜Icon

| Property       | Value     |
| -------------- | --------- |
| Size           | 24 × 24px |
| Touch Area     | 24 × 24px |
| Normal Color   | #007AFF   |
| Disabled Color | #D1D1D6   |
| Press Feedback | None      |

- 左右 Icon 可分別指定、顯示或隱藏。
- 不設定預設 Icon。
- 顯示設定預設為 `true`。
- 未指定 Icon 時不顯示，但保留空間。
- 左右 Icon 各自支援 Disabled。
- Disabled 時不觸發點擊事件。
- 不實作長按、Haptic、Loading 或額外點擊動畫。
- 使用既有 `src/components/ui/icon.tsx`，必要時才擴充 Icon Library。

## 05｜Scroll Behavior

NavigationBar 只根據**目前頁面的垂直捲動位置**決定高度。
```javascript
const isShort = scrollY > 0;
```

| Condition      | Height       |
| -------------- | ------------ |
| `scrollY <= 0` | Default：96px |
| `scrollY > 0`  | Short：44px   |

- 不判斷捲動方向。
- 不設定捲動距離門檻。
- 不處理水平捲動。
- 不記錄前一頁的 NavigationBar 狀態。
- 無法捲動的頁面維持 Default。
- 新頁面及返回上一頁時，都依目前頁面的 `scrollY` 決定高度。

由 Screen 或 Sheet 提供 `scrollY`，NavigationBar 負責高度切換。

## 06｜Animation

| Property          | Value       |
| ----------------- | ----------- |
| Animated Property | Height      |
| Duration          | 200ms       |
| Easing            | Ease-in-out |
| Interruptible     | Yes         |

- 高度在 96px 與 44px 之間平滑切換。
- 動畫進行中若目標高度改變，從目前高度平滑銜接。
- Title 與 Icon 始終垂直置中，不需要獨立動畫。
- 下方頁面內容跟隨 NavigationBar 高度變化，不與 NavigationBar 重疊。

**使用專案現有且最簡單的動畫實作方式。**

## 07｜Component Props

| Prop                | Type     | Default   |
| ------------------- | -------- | --------- |
| `title`             | string   | undefined |
| `showTitle`         | boolean  | true      |
| `leftIcon`          | string   | undefined |
| `rightIcon`         | string   | undefined |
| `showLeftIcon`      | boolean  | true      |
| `showRightIcon`     | boolean  | true      |
| `leftIconDisabled`  | boolean  | false     |
| `rightIconDisabled` | boolean  | false     |
| `onLeftIconPress`   | function | undefined |
| `onRightIconPress`  | function | undefined |
| `scrollY`           | 依現有架構決定  | 0         |

- 左右 Icon 的事件由使用 NavigationBar 的頁面自行指定。
- NavigationBar 不內建返回、新增、關閉等業務行為。
- `scrollY` 的型別依專案現有捲動與動畫架構決定，不為此建立額外狀態管理系統。

## 08｜驗收條件

- [ ] Default 高度 96px，Short 高度 44px。
- [ ] 只依 `scrollY > 0` 切換高度。
- [ ] 高度動畫 200ms、Ease-in-out，可中斷。
- [ ] Title 固定或動態文字皆可正常顯示。
- [ ] Title 水平置中，過長時單行省略。
- [ ] 左右 Icon 可獨立設定、隱藏、Disabled 及點擊事件。
- [ ] 隱藏 Icon 不影響 Title 位置。
- [ ] 沿用既有 Icon Library。
- [ ] Safe Area 由父層處理。
- [ ] 下方內容正常跟隨高度變化。
- [ ] 不包含規格外的功能或不必要的架構。

---

## 09｜Codex 執行要求

1. 先閱讀現有專案結構與相關元件。
2. 確認既有 Icon Library、動畫依賴及 Screen／Sheet 的捲動方式。
3. 選擇符合上述規格且最簡單的實作方案。
4. 只建立或修改必要檔案。
5. 不擅自重構其他元件。
6. 完成後執行適當的 TypeScript 檢查。
7. 回報修改的檔案、實作結果，以及是否有尚未完成的項目。

**不要增加規格以外的功能，也不要為假設性的未來需求建立額外架構。**
