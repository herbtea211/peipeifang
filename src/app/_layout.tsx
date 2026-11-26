import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthStart } from '@/components/auth-start';
import { AuthProvider, useAuth } from '@/hooks/use-auth';

void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { initializing, session } = useAuth();

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  if (initializing) return <AuthStart />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Screen name="(starter)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider value={DefaultTheme}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
