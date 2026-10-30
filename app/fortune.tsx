import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  AdSlotPlaceholder,
  FadeIn,
  KeyMeta,
  Muted,
  PrimaryButton,
  ResultBlock,
  Screen,
  SectionLabel,
  Title,
} from '@/components/ui';
import {
  loadDailyFortune,
  type DailyFortune,
  type Gender,
} from '@/content';
import { Brand } from '@/constants/Colors';
import { Copy } from '@/constants/Copy';

function parseGender(raw?: string): Gender {
  if (raw === 'male' || raw === 'other' || raw === 'female') return raw;
  return 'female';
}

/** Free daily fortune + ad slot + paid CTA. */
export default function FortuneScreen() {
  const params = useLocalSearchParams<{
    date?: string;
    time?: string;
    timeUnknown?: string;
    gender?: string;
  }>();

  const [fortune, setFortune] = useState<DailyFortune | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const birth = {
      date: params.date ?? '',
      time: params.time ?? '',
      timeUnknown: params.timeUnknown === '1' || !params.time,
      gender: parseGender(params.gender),
    };

    setReady(false);
    loadDailyFortune({ birth }).then((result) => {
      if (cancelled) return;
      setFortune(result);
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [params.date, params.time, params.timeUnknown, params.gender]);

  const timeLabel =
    params.timeUnknown === '1' || !params.time ? '모름' : (params.time ?? '-');

  return (
    <Screen scroll>
      <Title>{Copy.fortuneHeader}</Title>
      <Muted>
        {`${Copy.fortuneInputPrefix} · ${params.date ?? '-'} · ${timeLabel} · ${params.gender ?? '-'}`}
      </Muted>

      <View style={styles.result}>
        {!ready ? (
          <Muted>{Copy.fortuneLoading}</Muted>
        ) : fortune ? (
          <FadeIn>
            <View style={styles.sections}>
              <ResultBlock title={fortune.headline} body={fortune.body} />
              <View style={styles.hairline} />
              <SectionLabel>{Copy.fortuneTipLabel}</SectionLabel>
              <ResultBlock body={fortune.tip} />
              <View style={styles.keyBlock}>
                <SectionLabel>{Copy.fortuneKeyLabel}</SectionLabel>
                <KeyMeta
                  items={[
                    { label: '일간', value: fortune.keys.dayStem },
                    { label: '일지', value: fortune.keys.dayBranch },
                    { label: '띠', value: fortune.keys.zodiac },
                    { label: '오행', value: fortune.keys.element },
                    {
                      label: '시',
                      value: fortune.keys.hourBranch ?? '모름',
                    },
                  ]}
                />
              </View>
            </View>
          </FadeIn>
        ) : (
          <Muted>{Copy.fortuneEmpty}</Muted>
        )}
      </View>

      <View style={styles.ad}>
        <AdSlotPlaceholder />
      </View>

      <PrimaryButton
        label={Copy.paidCta}
        onPress={() =>
          router.push({
            pathname: '/detail',
            params: {
              date: params.date ?? '',
              time: params.time ?? '',
              timeUnknown: params.timeUnknown ?? '1',
              gender: params.gender ?? 'female',
            },
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  result: {
    marginTop: 28,
    marginBottom: 28,
    minHeight: 120,
  },
  sections: {
    gap: 18,
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Brand.line,
    marginVertical: 4,
  },
  keyBlock: {
    marginTop: 4,
    gap: 6,
  },
  ad: {
    marginBottom: 28,
  },
});
