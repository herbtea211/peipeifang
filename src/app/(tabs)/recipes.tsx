import { PreviewScreen } from '@/components/preview-screen';
import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { useOpenBottomSheet } from '@/hooks/use-bottom-sheet';

export default function RecipeScreen() {
  const open = useOpenBottomSheet();

  return (
    <PreviewScreen title="配方" hasBottomTab>
      <Button
        label="開啟 Sheet"
        showLeftIcon={false}
        onPress={() => open(<ThemedText>配方 Sheet 測試內容</ThemedText>)}
      />
    </PreviewScreen>
  );
}
