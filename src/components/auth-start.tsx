import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { LayoutSpacing, LightColors, Typography } from '@/constants/theme';

export function AuthStart() {
  return (
    <View style={styles.screen}>
      <Image source={require('@/assets/images/auth/start.png')} style={styles.image} resizeMode="contain" />
      <ActivityIndicator color={LightColors.primary} accessibilityLabel="啟動中" />
      <ThemedText style={Typography.button}>啟動中，請稍候</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: LayoutSpacing.lg, backgroundColor: LightColors.background },
  image: { width: '65%', maxWidth: 260, height: 290 },
});
