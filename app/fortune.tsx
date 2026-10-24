import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  AdSlotPlaceholder,
  Body,
  Muted,
  PrimaryButton,
  Screen,
  Title,
} from '@/components/ui';
import { Brand } from '@/constants/Colors';
import { Copy } from '@/constants/Copy';

/** Free daily fortune result stub + ad slot + paid CTA. */
export default function FortuneScreen() {
  const { date, time, gender } = useLocalSearchParams<{
    date?: string;
    time?: string;
    gender?: string;
  }>();

  return (
    <Screen>
      <Title>{Copy.fortuneHeader}</Title>
      <Muted>{`입력 · ${date ?? '-'} · ${time ?? '-'} · ${gender ?? '-'}`}</Muted>

      <View style={styles.card}>
        <Body>{Copy.fortunePlaceholder}</Body>
      </View>

      <View style={styles.ad}>
        <AdSlotPlaceholder />
      </View>

      <PrimaryButton
        label={Copy.paidCta}
        onPress={() => router.push('/detail')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
    marginBottom: 20,
    padding: 20,
    backgroundColor: Brand.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.line,
  },
  ad: {
    marginBottom: 28,
  },
});
