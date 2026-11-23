# Input Component Specification v5.3

**Project：** 配配方（Peipeifang）\
**Component：** Input\
**Tech Stack：** React Native + Expo + TypeScript\
**Status：** Ready for Implementation

---

## 01｜開發原則

採用 **Minimal Implementation**。

- 優先使用 React Native 原生功能及既有元件。
- 使用最少且容易維護的程式碼。
- 不新增非必要套件。
- 不建立額外的 Hook、Context、Provider 或狀態管理架構。
- 不預先實作未確認的功能。
- 不修改無關元件或頁面。
- 先檢查專案既有 Design Tokens 與 Icon Library。

### Design Tokens 使用原則

- Input 的高度、內距、字體及陰影，**優先選用現有 Design Tokens 中最適合的數值**。
- 現階段不要求與 Figma 設計數值完全一致。
- 優先重用既有 Tokens，不為了微小的數值差異新增 Token。
- 後續檢視實際畫面後，再調整相關數值。
- 不自行建立另一套樣式系統。
- 若現有 Tokens 沒有適合的數值，先回報，不擅自新增。

## 02｜Component Structure
```css
Input
├── Input Container
│   ├── TextInput
│   └── Right Icon Slot
└── Helper Text（選用）
```

| Property           | Specification           |
| ------------------ | ----------------------- |
| Width              | 100%                    |
| Height             | 固定，優先使用既有 Token         |
| Border Radius      | 既有 Full Radius Token    |
| Background         | 既有 White Token          |
| Shadow             | 既有 Shadow Token         |
| Text Alignment     | Left                    |
| Vertical Alignment | Center                  |
| Horizontal Padding | 固定，優先使用既有 Spacing Token |
| Focus Style        | 不改變外觀                   |

- Input 為單行輸入。
- 輸入框高度固定，提示文字高度不包含在內。
- 不提供自訂高度、寬度、內距、圓角、背景或陰影的 Props。
- 使用外層容器處理背景、圓角、陰影及排列。

## 03｜Text & Placeholder

- 輸入文字使用既有 Typography Token。
- 輸入文字顏色：`#1C1C1E`，優先引用對應 Color Token。
- Placeholder 使用獨立的灰色 Color Token。
- Placeholder 色碼先選定合理數值並加入 Tokens，後續再調整。
- Placeholder 可自行指定，未指定時不顯示。
- 輸入文字與 Placeholder 使用相同字體規格。
- 不提供自訂文字樣式 Props。

## 04｜Right Icon

- 右側固定保留 24 × 24px Icon Slot。
- Icon 使用既有 `src/components/ui/icon.tsx`。
- Icon 可由使用 Input 的父層指定。
- 透過 `Pressable` 接收點擊事件。
- 點擊事件由 `onRightIconPress` 傳入。
- 不預設清除文字、搜尋或密碼顯示切換等功能。
- Icon 顏色固定使用 Primary Color Token。
- 點擊範圍 24 × 24px，不增加 hitSlop。
- 不顯示點擊回饋或 Haptic。
- 未指定 Icon 時仍保留空間。

**目前測試階段：** 暫時使用 X Icon 展示版面，不綁定事件。正式使用時由父層指定 Icon 與事件。

## 05｜Disabled

提供 `disabled`，預設 `false`。

Enabled：

- 白色背景。
- 顯示陰影。
- Icon 使用 Primary Color。

Disabled：

- 不可編輯，不彈出鍵盤。
- Input 改為灰階外觀。
- 移除陰影。
- Icon 改為灰階且不可點擊。
- 不提供獨立的 Icon Disabled Prop。

使用 `editable={!disabled}` 控制輸入功能。

Disabled 灰階顏色優先使用既有 Design Tokens；若沒有適合的 Token，先回報。

## 06｜Helper Text & Error

提供：

- `helperText`：提示文字內容。
- `error`：是否為錯誤狀態，預設 `false`。

規則：

- 一般提示與錯誤提示共用同一個文字區域。
- 一般提示使用 Helper Text Color Token。
- 錯誤提示使用 Error Color Token。
- `error` 只改變提示文字顏色，不改變輸入框外觀。
- 提示文字使用獨立且較小的 Typography Token。
- 與輸入框保持固定 Spacing Token 間距。
- 支援多行及自動換行。
- 未提供提示文字時，不保留高度或間距。
- 不內建驗證邏輯或額外錯誤圖示。

## 07｜Native TextInput Props

沿用 React Native 原生功能，不重新實作。

| Prop              | 規格              |
| ----------------- | --------------- |
| `value`           | 父層管理輸入內容        |
| `onChangeText`    | 回傳文字變更          |
| `placeholder`     | 可自行指定           |
| `maxLength`       | 可自行指定，預設不限制     |
| `keyboardType`    | 可自行指定，預設一般鍵盤    |
| `secureTextEntry` | 支援密碼遮蔽，預設 false |
| `returnKeyType`   | 可自行指定           |
| `onSubmitEditing` | 由父層指定事件         |
| `autoFocus`       | 預設 false        |
| `autoCorrect`     | 沿用原生預設，可覆寫      |
| `autoCapitalize`  | 沿用原生預設，可覆寫      |

其他行為：

- `multiline={false}`。
- 使用系統預設游標及文字選取行為。
- 支援原生複製、剪下、貼上。
- Focus 時使用原生鍵盤，不額外修改輸入框外觀。
- 鍵盤收起由 Screen／Sheet 負責。
- 不自行監聽外部點擊。

## 08｜React Native 相容性要求

1. Android 使用 `underlineColorAndroid="transparent"`，避免出現原生底線。
2. 處理 Android 原生文字內距，確保固定高度下的文字位置正確。
3. 不使用 `clearButtonMode`，避免與自訂右側 Icon 重複。
4. `secureTextEntry` 與 `email-address`、`phone-pad` 在 Android 存在已知相容性限制，不額外開發複雜補救機制。
5. iOS `phone-pad` 不支援 `onSubmitEditing`，保留平台原生行為。
6. 不覆寫系統預設游標顏色或鍵盤收起行為。
7. 使用既有 Design Tokens，不建立重複的色彩、字體、圓角或陰影設定。

## 09｜驗收條件

- [ ] 單行文字輸入正常。
- [ ] Input 寬度 100%，高度與圓角使用適合的既有 Tokens。
- [ ] 輸入文字與 Placeholder 樣式正確。
- [ ] Focus 前後輸入框外觀一致。
- [ ] Disabled 時灰階、無陰影且不可編輯。
- [ ] 右側 Icon 固定保留 24 × 24px 區域。
- [ ] Icon 點擊事件可由父層指定。
- [ ] 未指定 Icon 事件時不執行動作。
- [ ] Helper Text 支援一般／錯誤兩種顏色。
- [ ] Helper Text 可換行，未設定時不佔空間。
- [ ] `value` 與 `onChangeText` 正常運作。
- [ ] `maxLength`、`keyboardType`、`secureTextEntry` 等原生 Props 正常傳遞。
- [ ] iOS 與 Android 沒有非預期的原生底線或排版偏移。
- [ ] 沒有增加規格以外的功能。

## 10｜Codex 執行要求

1. 先執行 `git status`，確認工作區狀態。
2. 檢查既有 Icon Library、Design Tokens 及相關 UI 元件。
3. Input 的高度、內距、字體及陰影，優先選用現有 Tokens 中最適合的數值。
4. 現階段不要求與 Figma 完全一致，後續再進行視覺微調。
5. 若既有 Tokens 沒有適合的數值，先回報，不擅自新增。
6. 使用最簡單的方式建立 Input 元件。
7. 只修改必要檔案。
8. 不額外建立表單驗證、清除文字或密碼切換邏輯。
9. 完成後執行 TypeScript 檢查。
10. 回報修改檔案及測試結果。

---

**核心原則：先使用既有 Design Tokens 完成可運作的 Input 元件，符合規格即可，不為未來需求過度設計。**
