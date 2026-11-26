import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { SocialLoginButton } from '@/components/ui/social-login-button';
import { LayoutSpacing, LightColors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { mockSocialLogin, requestOtp } from '@/services/mock-auth';
import type { SocialProvider } from '@/types/auth';
import { showAlert } from '@/utils/alert';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, setVerificationEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const normalizedEmail = email.trim().toLowerCase();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  useFocusEffect(useCallback(() => {
    setVerificationEmail(null);
  }, [setVerificationEmail]));

  function sendOtp() {
    if (!validEmail || pending.current) return;
    if (!requestOtp(normalizedEmail)) {
      showAlert('請稍候', '取得驗證碼後需等待 15 秒才能再次請求。');
      return;
    }
    setVerificationEmail(normalizedEmail);
    router.push('/verification');
  }

  async function loginWith(provider: SocialProvider) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    try {
      const session = mockSocialLogin(provider);
      if (session) await signIn(session);
    } catch {
      showAlert('登入失敗', '請稍後再試。');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <NavigationBar title="登入" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <Input
          accessibilityLabel="電子郵件"
          placeholder="mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          rightIcon="x"
          rightIconAccessibilityLabel="清除電子郵件"
          onRightIconPress={() => setEmail('')}
        />
        <Button label="取得驗證碼" showLeftIcon={false} disabled={!validEmail || busy} onPress={sendOtp} />
        <View style={styles.divider} />
        <View style={styles.providers}>
          <SocialLoginButton provider="apple" disabled={busy} onPress={() => void loginWith('apple')} />
          <SocialLoginButton provider="google" disabled={busy} onPress={() => void loginWith('google')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: LightColors.background },
  content: { width: '100%', maxWidth: 510, alignSelf: 'center', alignItems: 'center', paddingHorizontal: LayoutSpacing.xxl * 2, paddingTop: LayoutSpacing.xl * 4, paddingBottom: LayoutSpacing.xl, gap: LayoutSpacing.xxl },
  divider: { width: '100%', height: StyleSheet.hairlineWidth, backgroundColor: LightColors.buttonDisabled, marginVertical: LayoutSpacing.lg },
  providers: { flexDirection: 'row', gap: LayoutSpacing.xxl },
});
