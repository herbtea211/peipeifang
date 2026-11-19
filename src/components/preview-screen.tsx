import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LayoutSpacing } from '@/constants/theme';

type PreviewScreenProps = {
  title: string;
  children: ReactNode;
  hasBottomTab?: boolean;
};

export function PreviewScreen({ title, children, hasBottomTab }: PreviewScreenProps) {
  return (
    <ThemedView style={styles.page}>
      <SafeAreaView
        edges={hasBottomTab ? ['top', 'left', 'right'] : ['top', 'left', 'right', 'bottom']}
        style={styles.content}>
        <ThemedText type="title" accessibilityRole="header">
          {title}
        </ThemedText>
        {children}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: LayoutSpacing.xl,
    gap: LayoutSpacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
