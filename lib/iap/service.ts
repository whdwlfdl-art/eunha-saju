import { DETAIL_REPORT_PRODUCT_ID } from '@/constants/Iap';

import {
  grantDetailReportEntitlement,
  isDetailReportUnlocked,
} from './entitlement';
import { shouldUseMockIap } from './mode';
import {
  isUserCancelledError,
  nativeIsAvailable,
  nativePurchaseDetailReport,
  nativeRestoreDetailReport,
} from './nativeBridge';

export type PurchaseOutcome =
  | { status: 'unlocked'; mode: 'mock' | 'store' }
  | { status: 'cancelled' }
  | { status: 'error'; message: string };

export type RestoreOutcome =
  | { status: 'restored'; mode: 'mock' | 'store' }
  | { status: 'empty'; mode: 'mock' | 'store' }
  | { status: 'error'; message: string };

async function useMockPath(): Promise<boolean> {
  if (shouldUseMockIap()) {
    return true;
  }
  const available = await nativeIsAvailable();
  return !available;
}

/** Purchase (or mock-unlock) the detail report product. */
export async function purchaseDetailReport(): Promise<PurchaseOutcome> {
  try {
    if (await useMockPath()) {
      await grantDetailReportEntitlement();
      return { status: 'unlocked', mode: 'mock' };
    }

    await nativePurchaseDetailReport();
    await grantDetailReportEntitlement();
    return { status: 'unlocked', mode: 'store' };
  } catch (error) {
    if (isUserCancelledError(error) || isCancelLike(error)) {
      return { status: 'cancelled' };
    }
    return {
      status: 'error',
      message: errorMessage(error, '결제에 실패했어요. 잠시 후 다시 시도해 주세요.'),
    };
  }
}

/** Restore prior non-consumable ownership (or mock entitlement). */
export async function restoreDetailReport(): Promise<RestoreOutcome> {
  try {
    if (await useMockPath()) {
      const unlocked = await isDetailReportUnlocked();
      if (unlocked) {
        return { status: 'restored', mode: 'mock' };
      }
      // Dev convenience: first restore in mock grants unlock so UI can be exercised.
      await grantDetailReportEntitlement();
      return { status: 'restored', mode: 'mock' };
    }

    const owned = await nativeRestoreDetailReport();
    if (!owned) {
      return { status: 'empty', mode: 'store' };
    }
    await grantDetailReportEntitlement();
    return { status: 'restored', mode: 'store' };
  } catch (error) {
    return {
      status: 'error',
      message: errorMessage(error, '구매 복원에 실패했어요. 잠시 후 다시 시도해 주세요.'),
    };
  }
}

export async function loadDetailUnlockState(): Promise<boolean> {
  return isDetailReportUnlocked();
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

function isCancelLike(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const code = 'code' in error ? String((error as { code?: unknown }).code) : '';
  return /cancel/i.test(code);
}

/** Re-export for docs / debugging. */
export const DETAIL_PRODUCT_ID = DETAIL_REPORT_PRODUCT_ID;
