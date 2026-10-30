import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';

import {
  Body,
  KeyChipRow,
  Muted,
  PrimaryButton,
  ResultBlock,
  Screen,
  SecondaryButton,
  SectionLabel,
  Title,
} from '@/components/ui';
import {
  loadDetailReading,
  type DetailReading,
  type Gender,
} from '@/content';
import { Brand } from '@/constants/Colors';
import { Copy } from '@/constants/Copy';
import { DETAIL_REPORT_PRODUCT_ID } from '@/constants/Iap';
import { useDetailPurchase } from '@/lib/iap';

function parseGender(raw?: string): Gender {
  if (raw === 'male' || raw === 'other' || raw === 'female') return raw;
  return 'female';
}

/**
 * Paid detail CTA + result shell.
 * Wires expo-iap (non-consumable) with mock fallback for web / Expo Go /
 * unconfigured store; unlocked state shows template content from the engine.
 */
export default function DetailScreen() {
  const params = useLocalSearchParams<{
    date?: string;
    time?: string;
    timeUnknown?: string;
    gender?: string;
  }>();

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
  const [reading, setReading] = useState<DetailReading | null>(null);
  const fade = useSharedValue(0);

  useEffect(() => {
    let cancelled = false;
    const birth = {
      date: params.date ?? '',
      time: params.time ?? '',
      timeUnknown: params.timeUnknown === '1' || !params.time,
      gender: parseGender(params.gender),
    };

    loadDetailReading({ birth }).then((result) => {
      if (!cancelled) setReading(result);
    });

    return () => {
      cancelled = true;
    };
  }, [params.date, params.time, params.timeUnknown, params.gender]);

  useEffect(() => {
    if (unlocked) {
      fade.value = withTiming(1, { duration: 420 });
    }
  }, [unlocked, fade]);

  const resultStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: (1 - fade.value) * 8 }],
  }));

  return (
    <Screen scroll>
      <Title>{Copy.productTitle}</Title>
      <Body>{Copy.productBody}</Body>
      <View style={styles.priceGap}>
        <Muted>{Copy.productPrice}</Muted>
      </View>
      {mode === 'mock' ? <Muted>{Copy.productMockBadge}</Muted> : null}

      {!hydrated ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Brand.sky} />
        </View>
      ) : !unlocked ? (
        <>
          <View style={styles.preview}>
            <Muted>{Copy.productPreview}</Muted>
            <Muted>{`상품 ID · ${DETAIL_REPORT_PRODUCT_ID}`}</Muted>
            {reading ? (
              <View style={styles.previewList}>
                {reading.sections.map((s) => (
                  <Muted key={s.id}>{`· ${s.title}`}</Muted>
                ))}
              </View>
            ) : null}
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
      ) : (
        <Animated.View style={[styles.resultShell, resultStyle]}>
          {reading ? (
            <>
              <View style={styles.summaryPanel}>
                <ResultBlock body={reading.summary} />
              </View>

              <SectionLabel>사주 키</SectionLabel>
              <KeyChipRow
                items={[
                  { label: '일간', value: reading.keys.dayStem },
                  { label: '일지', value: reading.keys.dayBranch },
                  { label: '띠', value: reading.keys.zodiac },
                  { label: '오행', value: reading.keys.element },
                  {
                    label: '시',
                    value: reading.keys.hourBranch ?? '모름',
                  },
                ]}
              />

              {reading.sections.map((section) => (
                <View key={section.id} style={styles.section}>
                  <ResultBlock title={section.title} body={section.body} />
                </View>
              ))}

              <Muted>{Copy.detailDisclaimer}</Muted>
            </>
          ) : (
            <Muted>풀이를 준비하고 있어요…</Muted>
          )}

          <View style={styles.actions}>
            <SecondaryButton
              label={Copy.backHome}
              onPress={() => router.replace('/')}
            />
          </View>
        </Animated.View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  priceGap: {
    marginTop: 10,
  },
  loading: {
    marginTop: 48,
    alignItems: 'center',
  },
  preview: {
    marginTop: 28,
    marginBottom: 32,
    minHeight: 140,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.line,
    backgroundColor: Brand.paperDeep,
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  previewList: {
    gap: 4,
  },
  actions: {
    gap: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  resultShell: {
    marginTop: 24,
    gap: 18,
  },
  summaryPanel: {
    padding: 20,
    backgroundColor: Brand.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.line,
  },
  section: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Brand.line,
  },
});
