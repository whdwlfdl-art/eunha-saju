/**
 * Default / web stub for the native IAP bridge.
 * On iOS & Android Metro loads `nativeBridge.native.ts` instead.
 * Keeps `expo start` (web) and `expo export --platform web` free of StoreKit / Play Billing.
 */

import { isUserCancelledError as detectCancel } from './isUserCancelledError';

export type NativePurchase = {
  productId: string;
};

export async function nativeIsAvailable(): Promise<boolean> {
  return false;
}

export async function nativePurchaseDetailReport(): Promise<NativePurchase> {
  throw new Error('Native IAP is unavailable on web');
}

export async function nativeRestoreDetailReport(): Promise<boolean> {
  return false;
}

export function isUserCancelledError(error: unknown): boolean {
  return detectCancel(error);
}

export async function endConnection(): Promise<boolean> {
  return false;
}
