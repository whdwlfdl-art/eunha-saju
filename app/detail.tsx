import { Alert, StyleSheet, View } from 'react-native';
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

/** Paid detail / IAP CTA stub — no real StoreKit/Play Billing yet. */
export default function DetailScreen() {
  const stubPay = () => {
    Alert.alert('준비 중', '인앱결제(IAP)는 아직 연결되지 않았어요.');
  };

  const stubRestore = () => {
    Alert.alert('준비 중', '구매 복원은 아직 연결되지 않았어요.');
  };

  return (
    <Screen>
      <Title>{Copy.productTitle}</Title>
      <Body>{Copy.productBody}</Body>
      <Muted>{Copy.productPriceStub}</Muted>

      <View style={styles.preview}>
        <Muted>{Copy.productPreview}</Muted>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label={Copy.productPayStub} onPress={stubPay} />
        <SecondaryButton label={Copy.productRestoreStub} onPress={stubRestore} />
        <SecondaryButton
          label={Copy.backHome}
          onPress={() => router.replace('/')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  },
  actions: {
    gap: 12,
  },
});
