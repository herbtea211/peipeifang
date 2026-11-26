import { Image, Pressable, StyleSheet } from 'react-native';

import { BorderRadius, LightColors, Shadows } from '@/constants/theme';
import type { SocialProvider } from '@/types/auth';

type SocialLoginButtonProps = {
  provider: SocialProvider;
  onPress: () => void;
  disabled?: boolean;
};

const images = {
  apple: require('@/assets/images/auth/apple.png'),
  google: require('@/assets/images/auth/google.png'),
};

export function SocialLoginButton({ provider, onPress, disabled = false }: SocialLoginButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={provider === 'apple' ? '使用 Apple 登入' : '使用 Google 登入'}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, { opacity: disabled ? 0.4 : pressed ? 0.6 : 1 }]}>
      <Image source={images[provider]} style={styles.image} resizeMode="contain" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    backgroundColor: LightColors.surface,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.surface,
  },
  image: { width: 48, height: 48 },
});
