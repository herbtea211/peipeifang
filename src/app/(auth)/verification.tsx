import { Redirect, useRouter } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { LayoutSpacing, LightColors, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { getOtpChallenge, requestOtp, verifyOtp } from '@/services/mock-auth';
import { showAlert } from '@/utils/alert';

export default function VerificationScreen() {
  const router = useRouter();
  const { verificationEmail, setVerificationEmail, signIn } = useAuth();
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now);
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  const pending = useRef(false);
  const challenge = verificationEmail ? getOtpChallenge(verificationEmail) : undefined;
  const activeCell = Math.min(selectionStart, code.length, 5);
  const remaining = Math.max(0, Math.ceil(((challenge?.resendAt ?? 0) - now) / 1000));

  useEffect(() => {
    if (!remaining) return;
    const timer = setTimeout(() => setNow(Date.now()), 250);
    return () => clearTimeout(timer);
  });

  if (!verificationEmail || !challenge) return <Redirect href="/login" />;
  const requestedEmail = verificationEmail;

  async function changeCode(text: string) {
    const next = text.replace(/\D/g, '').slice(0, 6);
    if (pending.current || next === code) return;

    setCode(next);
    setError('');
    if (next.length !== 6) return;

    pending.current = true;
    setBusy(true);
    try {
      const validationError = await verifyOtp(requestedEmail, next, signIn);
      if (validationError) setError(validationError);
    } catch {
      showAlert('登入失敗', '無法保存登入狀態，請稍後再試。');
      setCode('');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  function resend() {
    if (pending.current || remaining) return;
    if (!requestOtp(requestedEmail)) {
      showAlert('重新取得失敗', '請稍後再試。');
      return;
    }
    setCode('');
    setSelectionStart(0);
    setError('');
    setNow(Date.now());
    input.current?.focus();
  }

  return (
    <SafeAreaView style={styles.screen}>
      <NavigationBar title="驗證" leftIcon="chevron-left" leftIconAccessibilityLabel="返回登入"
        leftIconDisabled={busy} onLeftIconPress={() => {
          if (pending.current) return;
          setVerificationEmail(null);
          router.dismissTo('/login');
        }} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <ThemedText
          accessibilityLiveRegion="polite"
          themeColor={error ? 'error' : 'text'}
          style={styles.instructions}>
          {error || '輸入電子郵件中接收的驗證碼\n*有效期限15分鐘'}
        </ThemedText>
        <View style={styles.code}>
          {Array.from({ length: 6 }, (_, index) => (
            <View key={index} aria-hidden style={[styles.cell, focused && activeCell === index && styles.focusedCell]}>
              <ThemedText themeColor={error ? 'error' : 'text'} style={styles.digit}>{code[index]}</ThemedText>
            </View>
          ))}
          <TextInput
            ref={input}
            style={styles.input}
            accessibilityLabel="六位數驗證碼"
            keyboardType="number-pad"
            autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
            textContentType={Platform.OS === 'ios' ? 'oneTimeCode' : undefined}
            caretHidden
            value={code}
            onChangeText={(text) => void changeCode(text)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSelectionChange={({ nativeEvent }) => setSelectionStart(nativeEvent.selection.start)}
            editable={!busy}
            autoFocus
            underlineColorAndroid="transparent"
          />
        </View>
        {remaining > 0 ? (
          <ThemedText style={styles.countdown}>{`需等待 ${remaining} 秒後始能\n重發驗證碼`}</ThemedText>
        ) : (
          <Pressable accessibilityRole="button" disabled={busy} onPress={resend}>
            <ThemedText themeColor="primary">重發驗證碼</ThemedText>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: LightColors.background },
  content: { width: '100%', maxWidth: 420, alignSelf: 'center', alignItems: 'center', paddingHorizontal: LayoutSpacing.xxl * 2, paddingTop: LayoutSpacing.lg, gap: LayoutSpacing.lg },
  instructions: { ...Typography.button, textAlign: 'center' },
  code: { width: '100%', marginTop: LayoutSpacing.xxl * 2, flexDirection: 'row', gap: LayoutSpacing.sm },
  cell: { flex: 1, alignItems: 'center', borderBottomWidth: 2, borderColor: LightColors.text, minHeight: 50 },
  focusedCell: { borderColor: LightColors.primary },
  digit: { ...Typography.title, fontSize: 38, lineHeight: 48 },
  input: { ...StyleSheet.absoluteFill, color: 'transparent', backgroundColor: 'transparent', fontSize: Typography.body.fontSize, outlineWidth: 0 },
  countdown: { ...Typography.caption, textAlign: 'center' },
});
