# List Component Specification

配配方共用清單規格，涵蓋 SectionTitle v1.6、ListItem v1.23 和 ListGroup v1.9。

## 元件與職責

| 層級 | 責任 |
| --- | --- |
| Screen／Sheet | 頁面排版、單一垂直 ScrollView、NavigationBar 的 scrollY、空狀態 |
| ListGroup | 選填標題、依 ID 渲染資料、分隔線、群組背景與裁切、陰影、群組內滑動收合 |
| ListItem | 單列文字與圖示、點擊回饋、滑動與可及的刪除入口 |
| 父層 | 資料、刪除確認、API、載入與錯誤處理 |

群組採用一般陣列與 React Native View。外層保留陰影，內層使用相同圓角裁切白色背景和滑動操作。SectionTitle 使用 ThemedText，Divider 使用原生 View。每個群組使用頁面既有捲動。適合多個短清單，資料量出現效能問題時再評估虛擬化。

## 公開介面

| 元件 | Prop | 型別 |
| --- | --- | --- |
| ListGroup | title | 選填 string |
| ListGroup | items | 必填 ListGroupItem[] |
| ListItem | label | 必填 string |
| ListItem | labelDetail、detail | 選填 string |
| ListItem | leftIcon、rightIcon | 選填 string，共用 Icon Library 名稱 |
| ListItem | onPress、onDelete | 選填 () => void |

ListGroupItem 為 ListItemProps 加上穩定、群組內唯一的字串 id。以 id 作為 React key，資料由父層持有。空陣列時整組省略，父層可在原位置顯示空狀態。

## 版面與 Tokens

| 用途 | Token 或規則 |
| --- | --- |
| 群組標題與刪除文字 | Typography.button，17／22、600 |
| 主要文字 | Typography.body，17／22、400 |
| 次要文字與右側文字 | Typography.caption，13／18、400 |
| 標題與主要文字 | LightColors.text，#1C1C1E |
| 次要文字與右側文字 | LightColors.textSecondary，#636366 |
| 列與群組背景、刪除文字 | LightColors.surface，#FFFFFF |
| 圖示 | LightColors.primary，#007AFF。LayoutSpacing.xl，24 |
| 刪除背景 | LightColors.error，#C62828 |
| 左右內距、右側文字與圖示間距、刪除左右內距 | LayoutSpacing.lg，16 |
| 上下內距 | LayoutSpacing.md，12 |
| 標題與群組間距、列內區塊間距 | LayoutSpacing.sm，8 |
| 主要與次要文字間距 | LayoutSpacing.xs，4 |
| 圓角 | BorderRadius.lg，16 |
| 群組陰影 | Shadows.surface，0px 0px 20px 0px #0000001A |
| 分隔線 | LightColors.divider，#3C3C43。厚度使用 StyleSheet.hairlineWidth |
| 按壓回饋 | 內容透明度 0.7，沿用 Explore 的按壓值 |

標題在群組白底之外。省略標題或選填列內容時，省略其空間與間距。每個文字欄位採原生單行尾端省略，保留字體縮放。列高由內容、圖示與內距決定。右側區塊最大寬度為列內容區域的 45%，主文字區塊填滿剩餘空間。分隔線左端與該列 label 對齊，右端延伸到邊界，只有相鄰列之間顯示。

## 操作與無障礙

- 提供 onPress 時，整列為 Pressable。純資訊列使用 View。
- 提供 onDelete 時，以 ReanimatedSwipeable 向左展開右側「刪除」。滑動只展開按鈕，點擊按鈕會呼叫 close() 並觸發 onDelete。Web 若仍在展開狀態，回呼排在 close() 開始的同一影格，避免父層先卸載手勢處理器。各平台皆無須等待收合動畫結束。
- 每組以 Ref 保存展開中列的穩定 close 回呼。onSwipeableWillOpen 開始展開時登記並收合舊列。onSwipeableClose 在動畫完成後解除登記，卸載或移除 onDelete 也會清理。只在回呼身分相符時解除登記，避免舊列清掉新列。移除 onDelete 時同步重設展開語意並清除按壓與拖曳旗標，重新提供 onDelete 時從收合狀態開始。群組彼此獨立。
- 展開時點擊列只收合。收合後才恢復原有 onPress。僅提供 onDelete 的列也可以點擊收合。
- iOS／Android 提供原生「刪除」Accessibility Action。展開時，焦點可移至有名稱的「刪除」操作。
- React Native Web 0.21.4 未實作原生 Accessibility Actions。可刪除的列提供一個有名稱的鍵盤按鈕。P1-03 沿用 Web Pressable 的 style callback 所提供的 focused 控制按鈕的透明度與指標命中。未聚焦時隱藏按鈕並允許指標操作底下的列，聚焦後可用 Enter 或 Space 刪除。手勢展開的操作不進入 Web Tab 順序。
- Chromium 中，刪除並卸載列後焦點可回到 BODY。若父層保留資料，鍵盤刪除按鈕會保持可見，但以滑鼠點擊滑動刪除按鈕時，收合後焦點可能留在被遮住的按鈕上。跨瀏覽器與螢幕閱讀器的結果見待實測清單。
- Android 使用 React Native Modal 時，手勢內容需要在 Modal 內的 GestureHandlerRootView 之下。現有展示設在 Explore，正式接入 Sheet 時須一併實機驗證。

## Code Review 決策

- Icon 名稱沿用專案的 string 介面，由 getIconSymbol 轉換共用登錄名稱。無效名稱不渲染，Divider 依實際 Icon 是否存在決定縮排。
- Divider 使用既有不透明色碼與 hairlineWidth。右側 45% 上限保留。Figma 的 Divider 透明度與次要文字尺寸差異列入開發計畫的 Design Tokens Refactoring。
- GestureHandlerRootView 維持在 App 根節點。Web 的既有 Sheet 可容納 Swipeable。Android 的原生 Modal 要求獨立手勢根，正式接入時驗證。
- 中斷動畫、鍵盤與 Chromium 實測範圍，以及原生無障礙待測項目見 [待實測清單](./PENDING_TESTS.md)。

## 專案位置

- [ListItem](../src/components/ui/list-item.tsx)
- [ListGroup](../src/components/ui/list-group.tsx)
- [Explore 展示](../src/app/(starter)/explore.tsx) 路徑 `/explore`
- [通用開發規範](../AGENTS.md)
- [待實測清單](./PENDING_TESTS.md)
