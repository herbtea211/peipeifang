export type SocialProvider = 'apple' | 'google';
export type AuthProvider = SocialProvider | 'email';

export type MockSession = {
  user: {
    id: string;
    provider: AuthProvider;
    email?: string;
  };
};
