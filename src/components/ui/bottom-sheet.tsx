import type { ReactNode } from 'react';
import { Button, Modal, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { BorderRadius, LayoutSpacing, MaxContentWidth } from '@/constants/theme';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent>
      <SafeAreaProvider>
        <SafeAreaView edges={['top']} style={styles.overlay}>
          <ThemedView accessibilityViewIsModal style={styles.surface}>
            <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.body}>
              <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
              <Button title="關閉 Sheet" onPress={onClose} />
            </SafeAreaView>
          </ThemedView>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  surface: {
    width: '100%',
    maxWidth: MaxContentWidth,
    maxHeight: '90%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  body: { padding: LayoutSpacing.xl, gap: LayoutSpacing.lg, flexShrink: 1 },
  content: { gap: LayoutSpacing.lg },
});
