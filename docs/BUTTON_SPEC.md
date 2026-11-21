
# Button Component Specification

- **產品**：配配方（Peipeifang）
- **版本**：v4.8
- **平台**：React Native + Expo + TypeScript（iOS / Android）
- **來源**：Figma To Tokens Compact TOON，以及逐項確認的元件與互動規格
- **用途**：供 Codex 依專案現有架構實作；不是已完成的程式碼

## 1. 元件類型與狀態

- `level`：`primary`、`secondary`。
- 視覺狀態：`default`、`pressed`、`disabled`。
- 額外支援外部控制的 `loading`；Loading 採用 Disabled 視覺配色，但 Spinner 為藍色。
- `pressed` 是按住時的暫態，不是 toggle。
- Figma TOON 中的 `disable` 對應程式命名 `disabled`。

## 2. 尺寸與版面

| 屬性 | Primary | Secondary |
|---|---|---|
| 高度 | 56px | 48px |
| 寬度 | Hug Contents | Hug Contents |
| 水平 Padding | 左右各 32px | 左右各 16px |
| Icon 尺寸 | 24 × 24px | 16 × 16px |
| 相鄰可見內容 Gap | 8px | 4px |
| 預設圓角 | 999px | 999px |
| Border | 無 | 1px，內側描邊視覺 |
| 水平／垂直對齊 | 置中／置中 | 置中／置中 |

- 高度、Padding、Gap、Icon 尺寸及對齊方式固定，不提供個別覆寫。
- `borderRadius` 可個別覆寫，且適用於所有狀態。
- 不提供 `fullWidth`、`minWidth`、`maxWidth`。
- Label 單行、不換行、不截斷；超出可用寬度由使用頁面處理。
- 隱藏或無效 Icon 不佔用空間，也不保留 Gap。
- Button 不可完全沒有內容；允許純 Icon Button。
- TOON 中垂直 Padding 數值與固定高度可能存在像素差異；實作以**固定高度、水平 Padding 與內容置中**為準，不應累加垂直 Padding 造成高度變化。

## 3. 顏色與邊框

### Primary

| 狀態 | 背景 | 文字／Icon | Border |
|---|---|---|---|
| Default | `#007AFF` | `#FFFFFF` | 無 |
| Pressed | `#007AFF`，60% 不透明度 | `#FFFFFF` | 無 |
| Disabled | `#D1D1D6` | `#FFFFFF` | 無 |
| Loading | `#D1D1D6` | `#FFFFFF` | 無 |

Primary Pressed 透明度**僅作用於背景填色**，不可降低整個 Button 或文字的透明度。

### Secondary

| 狀態 | 背景 | 文字／Icon | Border |
|---|---|---|---|
| Default | `#FFFFFF` | `#007AFF` | `#007AFF`，1px |
| Pressed | `#FFFFFF` | `#007AFF`，60% 不透明度 | `#007AFF`，60% 不透明度，1px |
| Disabled | `#D1D1D6` | `#FFFFFF` | `#FFFFFF`，1px |
| Loading | `#D1D1D6` | `#FFFFFF` | `#FFFFFF`，1px |

- 不提供 `backgroundColor`、`borderColor`、`borderWidth`、`textColor` 覆寫。
- 兩種 Level 均**不使用 Shadow 或 Background Blur**。
- 透明度可使用等效 RGBA 或 `#RRGGBBAA` 表示；避免把 60% 背景透明度誤做成純色混合值而改變疊加行為。

## 4. Typography

| 屬性 | 預設值 |
|---|---|
| Font Family | PingFang TC |
| Font Weight | Semibold / 600 |
| Font Size | 17px |
| Line Height | 22px |
| Letter Spacing | -0.41%（Figma 匯出值） |
| Lines | 1 |
| Text Align | Center |

- 允許個別覆寫 `fontFamily`、`fontWeight`、`fontSize`、`lineHeight`、`letterSpacing`。
- 文字顏色固定由 Level 與狀態決定，不可覆寫。
- React Native 的 `letterSpacing` 使用數值，須將 Figma 的百分比字距換算成適當數值；不得直接將字串 `-0.41%` 傳入。

## 5. Icon

- 內容順序固定：**Left Icon → Label → Right Icon**，不可重排。
- 左右 Icon 可獨立顯示／隱藏，亦可指定不同圖示。
- 預設顯示狀態：

| Level | Left Icon | Right Icon |
|---|---|---|
| Primary | 顯示 | 隱藏 |
| Secondary | 隱藏 | 顯示 |

- Figma 示意中 Primary 使用 `plus`（24px），Secondary 右側使用 `plus`（16px）。
- Icon 由**專案共用 Icon Library** 提供，透過名稱指定（例如 `leftIcon="plus"`）；不直接接受外部 React Icon 元件。
- Icon 尺寸、顏色由 Button Level 與狀態控制，不提供個別覆寫。
- Icon 名稱不存在時：開發環境輸出明確錯誤；正式環境不渲染該 Icon。不得自動替換成 `plus`。
- 實作前先確認現有 Icon Library，勿擅自安裝新套件。

## 6. Label 與內容

- Label 可設定。
- Figma 預設文字：Primary 為「新增」，Secondary 為「人份」。
- 可只顯示文字、文字加單側／雙側 Icon，或只顯示 Icon。
- 純 Icon Button 必須有可辨識的 `accessibilityLabel`。
- 若 Label 與 Icon 均不存在，視為無效內容配置，不應呈現空白可點擊 Button。

## 7. 互動與動畫

### Pressed

- `onPressIn`：進入 Pressed。
- `onPressOut`：離開 Pressed，依外部 Disabled／Loading 條件恢復對應視覺狀態。
- Transition：**150ms，ease-in-out**，只針對規格中發生變化的顏色／透明度。
- 不增加縮放、位移或其他未定義動畫。
- Disabled、Loading 不可進入 Pressed。

### 點擊 Throttle

- 使用 **500ms leading-edge throttle**。
- 第一次有效點擊立即執行；500ms 內重複點擊忽略，且不排程補執行。
- Disabled、Loading 不執行 `onPress`。
- 被 Throttle 忽略的點擊也不應觸發 Haptic；實作需協調 `onPressIn` 與 `onPress` 的接受判定。

### Haptic

- 預設 `haptic=true`，允許 `haptic={false}` 關閉。
- 使用 Light 震動回饋，支援 iOS、Android（依裝置能力）。
- 於**有效的 `onPressIn`** 觸發，而非等到 `onPress`。
- Disabled、Loading、Throttle 忽略的點擊均不震動。

### 長按

- 暫不提供 `onLongPress`；有實際需求再擴充。

## 8. Loading

- `loading` 由使用頁面外部控制，不由 Button 自行管理 API 請求。
- 使用 Disabled 背景／文字／邊框配色，Spinner 顏色固定 `#007AFF`。
- 隱藏所有原本 Icon，顯示**恰好一個** Spinner。
- **有 Label**：Spinner 放在文字左側，內容群組水平與垂直置中。
- **純 Icon Button**：只顯示單一、水平與垂直置中的 Spinner。
- Spinner 尺寸：Primary 24 × 24px；Secondary 16 × 16px。
- Spinner 與 Label Gap：Primary 8px；Secondary 4px。
- Spinner 動畫：順時針旋轉、每圈 1000ms、linear、無限循環。
- Loading 時禁止點擊、Haptic 與 Pressed。
- Loading 結束後恢復原有 Icon 顯示配置，並依外部 `disabled` 值呈現 Default 或 Disabled。
- 維持各 Level 固定高度、Padding 與圓角規則。

## 9. Accessibility 與點擊區域

- `accessibilityRole="button"`。
- 有 Label 時，以 Label 作為預設無障礙名稱；純 Icon Button 必須傳入 `accessibilityLabel`。
- `accessibilityState` 反映 Disabled／Loading（可用 disabled、busy 等適當狀態）。
- 整個 Button 可見區域（包含 Padding）皆為點擊範圍。
- 不額外增加 `hitSlop`（視為 0）。

## 10. 建議的 TypeScript API

以下為規格對應的**建議介面**，不是已確認存在的專案型別。Icon 名稱應與專案實際 Library 整合；預設顯示邏輯應以 Level 決定。

```tsx
import type { TextStyle } from 'react-native';

type ButtonLevel = 'primary' | 'secondary';

interface ButtonProps {
  level?: ButtonLevel;
  label?: string;

  leftIcon?: string;
  rightIcon?: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;

  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  haptic?: boolean;

  borderRadius?: number;
  fontFamily?: string;
  fontWeight?: TextStyle['fontWeight'];
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;

  accessibilityLabel?: string;
}
```

### 預設值

| 屬性 | 預設 |
|---|---|
| `level` | `primary` |
| `label` | Primary：「新增」；Secondary：「人份」 |
| `showLeftIcon` | Primary：`true`；Secondary：`false` |
| `showRightIcon` | Primary：`false`；Secondary：`true` |
| `disabled` | `false` |
| `loading` | `false` |
| `haptic` | `true` |
| `borderRadius` | `999` |

## 11. 實作前檢查與驗收

1. 先檢查專案現有 Button、Icon Library、Theme Tokens、套件及 `docs/DEV_PLAN.md`；遵循既定開發階段。
2. 不擅自新增 Variant、Size、陰影、模糊、縮放動畫、長按或不在規格內的樣式覆寫。
3. 檢查 Primary／Secondary 各狀態的背景、文字、Icon、邊框與尺寸。
4. 檢查 Icon Boolean 預設值、左右獨立切換、隱藏後 Gap 消失、無效 Icon 處理。
5. 檢查文字單行、字體覆寫、純 Icon Button 與 Accessibility。
6. 檢查 Pressed 150ms 動畫、500ms Throttle、有效 `onPressIn` Haptic，以及 Disabled／Loading 事件阻擋。
7. 檢查有 Label／純 Icon 兩種 Loading 版型，Spinner 旋轉及狀態恢復。
8. 在 iOS 與 Android 驗證呈現和互動。

> **實作注意**：規格中尺寸沿用 Figma px 表述；React Native 使用無單位的邏輯尺寸（dp／pt），須依專案現有設計轉換慣例處理。若既有程式架構與本文件衝突，先回報差異，不擅自修改既有架構。
