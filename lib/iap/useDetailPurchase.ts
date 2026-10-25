import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { Copy } from '@/constants/Copy';
import { iapModeLabel } from '@/lib/iap/mode';
import {
  loadDetailUnlockState,
  purchaseDetailReport,
  restoreDetailReport,
} from '@/lib/iap/service';

type Busy = 'idle' | 'purchasing' | 'restoring';

/**
 * Detail-screen purchase / restore / unlock state.
 * Mock mode keeps `expo start` and web export working without a store account.
 */
export function useDetailPurchase() {
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState<Busy>('idle');
  const mode = iapModeLabel();

  useEffect(() => {
    let cancelled = false;
    loadDetailUnlockState().then((value) => {
      if (!cancelled) {
        setUnlocked(value);
        setHydrated(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const purchase = useCallback(async () => {
    if (busy !== 'idle') return;
    setBusy('purchasing');
    try {
      const result = await purchaseDetailReport();
      if (result.status === 'unlocked') {
        setUnlocked(true);
        Alert.alert(
          Copy.productPaySuccessTitle,
          result.mode === 'mock'
            ? Copy.productPaySuccessMockBody
            : Copy.productPaySuccessBody,
        );
        return;
      }
      if (result.status === 'cancelled') {
        return;
      }
      Alert.alert(Copy.productPayErrorTitle, result.message);
    } finally {
      setBusy('idle');
    }
  }, [busy]);

  const restore = useCallback(async () => {
    if (busy !== 'idle') return;
    setBusy('restoring');
    try {
      const result = await restoreDetailReport();
      if (result.status === 'restored') {
        setUnlocked(true);
        Alert.alert(
          Copy.productRestoreSuccessTitle,
          result.mode === 'mock'
            ? Copy.productRestoreSuccessMockBody
            : Copy.productRestoreSuccessBody,
        );
        return;
      }
      if (result.status === 'empty') {
        Alert.alert(
          Copy.productRestoreEmptyTitle,
          Copy.productRestoreEmptyBody,
        );
        return;
      }
      Alert.alert(Copy.productPayErrorTitle, result.message);
    } finally {
      setBusy('idle');
    }
  }, [busy]);

  return {
    unlocked,
    hydrated,
    busy,
    mode,
    purchasing: busy === 'purchasing',
    restoring: busy === 'restoring',
    purchase,
    restore,
  };
}
