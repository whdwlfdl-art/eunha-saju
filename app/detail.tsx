import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import {
  Body,
  Muted,
  PrimaryButton,
  Screen,
  SecondaryButton,
  Title,
} from '@/components/ui';
import { Brand } from '@/constants/Colors';
import { Copy } from '@/constants/Copy';
import { DETAIL_REPORT_PRODUCT_ID } from '@/constants/Iap';
import { useDetailPurchase } from '@/lib/iap';

/**
 * Paid detail CTA — wires expo-iap (non-consumable) with mock fallback
 * for web / Expo Go / unconfigured store.
 */
export default function DetailScreen() {
  const {
    unlocked,
    hydrated,
    mode,
    purchasing,
    restoring,
    purchase,
    restore,
  } = useDetailPurchase();

  const busy = purchasing || restoring;

  return (
    <Screen>
      <Title>{Copy.productTitle}</Title>
      <Body>{Copy.productBody}</Body>
      <Muted>{Copy.productPrice}</Muted>
      {mode === 'mock' ? <Muted>{Copy.productMockBadge}</Muted> : null}

      {!hydrated ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Brand.sky} />
        </View>
      ) : unlocked ? (
        <>
          <View style={styles.preview}>
            <Body>{Copy.productUnlockedSample}</Body>
          </View>
          <View style={styles.actions}>
            <SecondaryButton
              label={Copy.backHome}
              onPress={() => router.replace('/')}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.preview}>
            <Muted>{Copy.productPreview}</Muted>
            <Muted>{`상품 ID · ${DETAIL_REPORT_PRODUCT_ID}`}</Muted>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label={purchasing ? Copy.productPayLoading : Copy.productPay}
              onPress={() => {
                void purchase();
              }}
              disabled={busy}
            />
            <SecondaryButton
              label={
                restoring ? Copy.productRestoreLoading : Copy.productRestore
              }
              onPress={() => {
                void restore();
              }}
              disabled={busy}
            />
            <SecondaryButton
              label={Copy.backHome}
              onPress={() => router.replace('/')}
              disabled={busy}
            />
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: 48,
    alignItems: 'center',
  },
  preview: {
    marginTop: 28,
    marginBottom: 32,
    minHeight: 160,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.line,
    backgroundColor: Brand.paperDeep,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  actions: {
    gap: 12,
  },
});
