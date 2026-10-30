import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';

import {
  AdSlotPlaceholder,
  KeyChipRow,
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
  const fade = useSharedValue(0);

  useEffect(() => {
    let cancelled = false;
    const birth = {
      date: params.date ?? '',
      time: params.time ?? '',
      timeUnknown: params.timeUnknown === '1' || !params.time,
      gender: parseGender(params.gender),
    };

    loadDailyFortune({ birth }).then((result) => {
      if (cancelled) return;
      setFortune(result);
      fade.value = withTiming(1, { duration: 420 });
    });

    return () => {
      cancelled = true;
    };
  }, [params.date, params.time, params.timeUnknown, params.gender, fade]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: (1 - fade.value) * 10 }],
  }));

  const timeLabel =
    params.timeUnknown === '1' || !params.time ? '모름' : (params.time ?? '-');

  return (
    <Screen scroll>
      <Title>{Copy.fortuneHeader}</Title>
      <Muted>{`입력 · ${params.date ?? '-'} · ${timeLabel} · ${params.gender ?? '-'}`}</Muted>

      <Animated.View style={[styles.result, animStyle]}>
        {fortune ? (
          <>
            <View style={styles.panel}>
              <ResultBlock title={fortune.headline} body={fortune.body} />
              <View style={styles.divider} />
              <SectionLabel>{Copy.fortuneTipLabel}</SectionLabel>
              <ResultBlock body={fortune.tip} />
            </View>

            <SectionLabel>{Copy.fortuneKeyLabel}</SectionLabel>
            <KeyChipRow
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
          </>
        ) : (
          <Muted>흐름을 읽고 있어요…</Muted>
        )}
      </Animated.View>

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
    marginTop: 24,
    marginBottom: 20,
    gap: 16,
  },
  panel: {
    padding: 20,
    backgroundColor: Brand.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.line,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Brand.line,
    marginVertical: 4,
  },
  ad: {
    marginBottom: 28,
  },
});
