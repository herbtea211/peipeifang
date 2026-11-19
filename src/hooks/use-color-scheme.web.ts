import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

function subscribe(onStoreChange: () => void) {
  const subscription = Appearance.addChangeListener(onStoreChange);
  return () => subscription.remove();
}

function getServerSnapshot() {
  return 'light' as const;
}

export function useColorScheme() {
  // Keep the server and hydration in sync, then follow the browser's current preference.
  return useSyncExternalStore(subscribe, Appearance.getColorScheme, getServerSnapshot);
}
