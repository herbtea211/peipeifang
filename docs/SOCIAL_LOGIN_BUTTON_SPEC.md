# SocialLoginButton

Apple／Google 共用 React Native Pressable 與 PNG Image。公開介面為 provider（apple 或 google）、onPress 與選填 disabled。60 × 60 按鈕內置中 48 × 48 品牌圖示，保留素材比例。沿用 LightColors.surface、BorderRadius.md（12）與 Shadows.surface。整顆按鈕的透明度依預設、按壓、停用分別為 1、0.6、0.4。停用時不觸發回呼。

各品牌有獨立的按鈕無障礙名稱。素材來源為登入附件，位於 assets/images/auth。登入、取消及錯誤處理由 Auth 流程管理。正式品牌規範及平台審核列入 Auth 上線檢查。
