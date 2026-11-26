import type { MockSession, SocialProvider } from '@/types/auth';

const challenges = new Map<string, { expiresAt: number; resendAt: number; used: boolean; saving: boolean }>();
const otpLifetime = 15 * 60 * 1000;
const resendDelay = 15 * 1000;

export function requestOtp(email: string, now = Date.now()) {
  const existing = challenges.get(email);
  if (existing && (existing.saving || existing.resendAt > now)) return null;

  const challenge = { expiresAt: now + otpLifetime, resendAt: now + resendDelay, used: false, saving: false };
  challenges.set(email, challenge);
  return challenge;
}

export function getOtpChallenge(email: string) {
  return challenges.get(email);
}

export async function verifyOtp(
  email: string,
  code: string,
  saveSession: (session: MockSession) => Promise<void>,
  now = Date.now(),
): Promise<string | undefined> {
  const challenge = challenges.get(email);
  if (!challenge || now >= challenge.expiresAt) return '驗證碼已過期，請重新取得';
  if (challenge.used) return '驗證碼已使用，請重新取得';
  if (challenge.saving) return '驗證正在進行，請稍候';
  if (code !== '123456') return '驗證碼錯誤';

  challenge.saving = true;
  try {
    await saveSession({ user: { id: `email:${email}`, email, provider: 'email' } });
    challenge.used = true;
  } finally {
    challenge.saving = false;
  }
}

export function mockSocialLogin(provider: SocialProvider, outcome: 'success' | 'cancel' | 'failure' = 'success'): MockSession | null {
  if (outcome === 'cancel') return null;
  if (outcome === 'failure') throw new Error('第三方登入失敗，請重試。');
  return { user: { id: `mock:${provider}`, provider } };
}
