import { useRouter } from 'expo-router';
import { Button } from 'react-native';

import { PreviewScreen } from '@/components/preview-screen';

export default function VerificationScreen() {
  const router = useRouter();

  return (
    <PreviewScreen title="Verification">
      <Button title="進入主要操作" onPress={() => router.replace('/recipes')} />
      <Button title="返回 Login" onPress={() => router.dismissTo('/login')} />
    </PreviewScreen>
  );
}
