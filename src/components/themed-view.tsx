import { View, type ViewProps } from 'react-native';

import { LightColors, type ThemeColor } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  type?: ThemeColor;
};

export function ThemedView({ style, type, ...otherProps }: ThemedViewProps) {
  return <View style={[{ backgroundColor: LightColors[type ?? 'surface'] }, style]} {...otherProps} />;
}
