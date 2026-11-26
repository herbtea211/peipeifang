import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

export default function AppEntry() {
  const { session } = useAuth();
  return <Redirect href={session ? '/recipes' : '/login'} />;
}
