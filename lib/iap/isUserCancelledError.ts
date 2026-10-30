/** Fallback cancel detector when the web stub has no expo-iap helpers. */
export function isUserCancelledError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const code = 'code' in error ? String((error as { code?: unknown }).code) : '';
  const message =
    'message' in error ? String((error as { message?: unknown }).message) : '';
  return /cancel/i.test(code) || /cancel/i.test(message);
}
