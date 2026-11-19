import { Button } from 'react-native';

import { PreviewScreen } from '@/components/preview-screen';
import { ThemedText } from '@/components/themed-text';
import { useOpenBottomSheet } from '@/hooks/use-bottom-sheet';

export default function RecipeScreen() {
  const open = useOpenBottomSheet();

  return (
    <PreviewScreen title="配方" hasBottomTab>
      <Button
        title="開啟 Sheet"
        onPress={() => open(<ThemedText>配方 Sheet 測試內容</ThemedText>)}
      />
    </PreviewScreen>
  );
}
