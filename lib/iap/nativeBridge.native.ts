import {
  endConnection,
  finishTransaction,
  getAvailablePurchases,
  initConnection,
  isUserCancelledError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  restorePurchases,
  type Purchase,
} from 'expo-iap';

import { DETAIL_REPORT_PRODUCT_ID, IapProducts } from '@/constants/Iap';

export type NativePurchase = {
  productId: string;
};

let connectionPromise: Promise<boolean> | null = null;

async function ensureConnection(): Promise<boolean> {
  if (!connectionPromise) {
    connectionPromise = initConnection()
      .then(() => true)
      .catch((error) => {
        connectionPromise = null;
        console.warn('[iap] initConnection failed', error);
        return false;
      });
  }
  return connectionPromise;
}

export async function nativeIsAvailable(): Promise<boolean> {
  try {
    return await ensureConnection();
  } catch {
    return false;
  }
}

function matchesDetailProduct(purchase: Purchase): boolean {
  return purchase.productId === DETAIL_REPORT_PRODUCT_ID;
}

async function finalizePurchase(purchase: Purchase): Promise<void> {
  await finishTransaction({
    purchase,
    isConsumable: IapProducts.detailReport.isConsumable,
  });
}

/**
 * Runs the native purchase sheet and waits for the matching product update.
 */
export async function nativePurchaseDetailReport(): Promise<NativePurchase> {
  const ready = await ensureConnection();
  if (!ready) {
    throw new Error('Store connection unavailable');
  }

  const purchase = await new Promise<Purchase>((resolve, reject) => {
    const successSub = purchaseUpdatedListener((event) => {
      if (!matchesDetailProduct(event)) return;
      successSub.remove();
      errorSub.remove();
      resolve(event);
    });

    const errorSub = purchaseErrorListener((error) => {
      successSub.remove();
      errorSub.remove();
      reject(error);
    });

    void requestPurchase({
      type: 'in-app',
      request: {
        apple: { sku: DETAIL_REPORT_PRODUCT_ID },
        google: { skus: [DETAIL_REPORT_PRODUCT_ID] },
      },
    }).catch((error) => {
      successSub.remove();
      errorSub.remove();
      reject(error);
    });
  });

  await finalizePurchase(purchase);
  return { productId: purchase.productId };
}

/**
 * Restore non-consumable purchases and return whether detail report was found.
 */
export async function nativeRestoreDetailReport(): Promise<boolean> {
  const ready = await ensureConnection();
  if (!ready) {
    throw new Error('Store connection unavailable');
  }

  await restorePurchases();
  const purchases = await getAvailablePurchases({
    onlyIncludeActiveItemsIOS: true,
  });

  const owned = purchases.find(matchesDetailProduct);
  if (!owned) {
    return false;
  }

  try {
    await finalizePurchase(owned);
  } catch (error) {
    // Already finished purchases may reject; entitlement still applies.
    console.warn('[iap] finishTransaction on restore', error);
  }

  return true;
}

export { isUserCancelledError, endConnection };
