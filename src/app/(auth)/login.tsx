import { useRouter } from 'expo-router';

import { PreviewScreen } from '@/components/preview-screen';
import { Button } from '@/components/ui/button';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <PreviewScreen title="Login">
      <Button showLeftIcon={false} label="前往驗證" onPress={() => router.push('/verification')} />
    </PreviewScreen>
  );
}
