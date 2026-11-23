import { useRouter } from 'expo-router';

import { PreviewScreen } from '@/components/preview-screen';
import { Button } from '@/components/ui/button';

export default function VerificationScreen() {
  const router = useRouter();

  return (
    <PreviewScreen title="Verification">
      <Button
        showLeftIcon={false}
        label="進入主要操作"
        onPress={() => router.replace('/recipes')}
      />
      <Button
        level="secondary"
        showRightIcon={false}
        label="返回 Login"
        onPress={() => router.dismissTo('/login')}
      />
    </PreviewScreen>
  );
}
