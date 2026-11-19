import { Tabs } from 'expo-router';
import { useState, type ReactNode } from 'react';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { LightColors, Typography } from '@/constants/theme';
import { OpenBottomSheetContext } from '@/hooks/use-bottom-sheet';
import { useTheme } from '@/hooks/use-theme';

export default function MainTabsLayout() {
  const [sheetContent, setSheetContent] = useState<ReactNode>(null);
  const colors = useTheme();

  return (
    <OpenBottomSheetContext.Provider value={setSheetContent}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: LightColors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: Typography.caption,
          tabBarIcon: () => null,
          tabBarStyle: {
            backgroundColor: colors.backgroundElement,
            borderTopColor: colors.backgroundSelected,
          },
        }}>
        <Tabs.Screen name="recipes" options={{ title: '配方' }} />
        <Tabs.Screen name="purchase" options={{ title: '採購' }} />
      </Tabs>
      <BottomSheet visible={sheetContent !== null} onClose={() => setSheetContent(null)}>
        {sheetContent}
      </BottomSheet>
    </OpenBottomSheetContext.Provider>
  );
}
