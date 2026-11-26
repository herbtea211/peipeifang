import { useRef, useState } from 'react';

import { PreviewScreen } from '@/components/preview-screen';
import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { useOpenBottomSheet } from '@/hooks/use-bottom-sheet';
import { useAuth } from '@/hooks/use-auth';
import { showAlert } from '@/utils/alert';

export default function RecipeScreen() {
  const open = useOpenBottomSheet();
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const pending = useRef(false);

  async function logout() {
    if (pending.current) return;
    pending.current = true;
    setSigningOut(true);
    try {
      await signOut();
    } catch {
      showAlert('登出失敗', '請稍後再試。');
    } finally {
      pending.current = false;
      setSigningOut(false);
    }
  }

  return (
    <PreviewScreen title="配方" hasBottomTab>
      <Button
        label="開啟 Sheet"
        showLeftIcon={false}
        onPress={() => open(<ThemedText>配方 Sheet 測試內容</ThemedText>)}
      />
      <Button
        label="登出"
        showLeftIcon={false}
        disabled={signingOut}
        onPress={() => void logout()}
      />
    </PreviewScreen>
  );
}
