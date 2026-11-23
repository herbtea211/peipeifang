/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;
// as const 表示 TypeScript 將物件屬性視為唯讀，不能直接重新賦值；但不代表執行時物件被凍結。

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
// 確保顏色名稱一致，但兩邊如果有遺漏，不會直接報錯，只會取兩邊共同存在的屬性名稱。

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
// Safe Area 可透過 React Native 相關套件動態取得；此處為依平台設定的固定底部間距，需與實際 Bottom Tab 高度分開確認。
export const MaxContentWidth = 800;

// Light appearance from the iOS 3.0 login, email entry, and recipe detail designs.
export const LightColors = {
  primary: '#007AFF',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#636366',
  placeholder: '#8E8E93',
  error: '#C62828',
  buttonDisabled: '#D1D1D6',
  divider: '#3C3C43',
} as const;

const bodyFontFamily = Platform.select({
  ios: 'PingFang TC',
  default: Fonts.sans,
});

export const Typography = {
  title: {
    fontFamily: bodyFontFamily,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    fontFamily: bodyFontFamily,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0.41,
  },
  button: {
    fontFamily: bodyFontFamily,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  caption: {
    fontFamily: bodyFontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.08,
  },
} as const;

export const LayoutSpacing = {
  xs: Spacing.one,
  sm: Spacing.two,
  md: 12,
  lg: Spacing.three,
  xl: Spacing.four,
  xxl: Spacing.five,
} as const;

// Estimated from the login screenshot. Pill corners follow the control height.
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 48,
  full: 9999,
} as const;

export const Shadows = {
  surface: { boxShadow: '0px 0px 20px 0px #0000001A' },
} as const;
