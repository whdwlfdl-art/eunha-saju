import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  FadeIn,
  KeyMeta,
  Muted,
  PrimaryButton,
  PriceHighlight,
  ResultBlock,
  Screen,
  SecondaryButton,
  SectionLabel,
  TextButton,
  Title,
  Body,
} from '@/components/ui';
import {
  loadDetailReading,
  type DetailReading,
  type Gender,
} from '@/content';
import { Brand } from '@/constants/Colors';
import { Copy } from '@/constants/Copy';
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
  const [readingReady, setReadingReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const birth = {
      date: params.date ?? '',
      time: params.time ?? '',
      timeUnknown: params.timeUnknown === '1' || !params.time,
      gender: parseGender(params.gender),
    };

    setReadingReady(false);
    loadDetailReading({ birth }).then((result) => {
      if (!cancelled) {
        setReading(result);
        setReadingReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [params.date, params.time, params.timeUnknown, params.gender]);

  return (
    <Screen scroll>
      <Title>{Copy.productTitle}</Title>
      <Body>{Copy.productBody}</Body>

      <PriceHighlight
        amount={Copy.productPriceAmount}
        caption={Copy.productPrice}
      />
      {mode === 'mock' ? (
        <View style={styles.mockNote}>
          <Muted>{Copy.productMockBadge}</Muted>
        </View>
      ) : null}

      {!hydrated ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Brand.sky} />
          <Muted>{Copy.purchaseHydrating}</Muted>
        </View>
      ) : !unlocked ? (
        <>
          <View style={styles.preview}>
            <SectionLabel>{Copy.productPreview}</SectionLabel>
            {readingReady && reading ? (
              <View style={styles.previewList}>
                {reading.sections.map((s) => (
                  <Muted key={s.id}>{s.title}</Muted>
                ))}
              </View>
            ) : (
              <Muted>{Copy.detailLoading}</Muted>
            )}
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
            <TextButton
              label={Copy.backHome}
              onPress={() => router.replace('/')}
              disabled={busy}
            />
          </View>
        </>
      ) : (
        <FadeIn style={styles.resultShell}>
          {!readingReady || !reading ? (
            <Muted>{Copy.detailLoading}</Muted>
          ) : (
            <>
              <ResultBlock body={reading.summary} />

              <View style={styles.keyBlock}>
                <SectionLabel>{Copy.detailKeyLabel}</SectionLabel>
                <KeyMeta
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
              </View>

              {reading.sections.map((section, index) => (
                <View key={section.id} style={styles.section}>
                  {index > 0 ? <View style={styles.hairline} /> : null}
                  <ResultBlock title={section.title} body={section.body} />
                </View>
              ))}

              <Muted>{Copy.detailDisclaimer}</Muted>
            </>
          )}

          <View style={styles.actions}>
            <TextButton
              label={Copy.backHome}
              onPress={() => router.replace('/')}
            />
          </View>
        </FadeIn>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  mockNote: {
    marginTop: 8,
  },
  loading: {
    marginTop: 48,
    alignItems: 'center',
    gap: 14,
  },
  preview: {
    marginTop: 28,
    marginBottom: 36,
    gap: 12,
    paddingTop: 4,
  },
  previewList: {
    gap: 8,
  },
  actions: {
    gap: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  resultShell: {
    marginTop: 28,
    gap: 22,
  },
  keyBlock: {
    gap: 6,
  },
  section: {
    gap: 14,
    paddingVertical: 4,
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Brand.line,
    marginBottom: 8,
  },
});
