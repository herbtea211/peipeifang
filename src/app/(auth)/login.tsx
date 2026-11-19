import { useRouter } from 'expo-router';
import { Button } from 'react-native';

import { PreviewScreen } from '@/components/preview-screen';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <PreviewScreen title="Login">
      <Button title="前往驗證" onPress={() => router.push('/verification')} />
    </PreviewScreen>
  );
}
