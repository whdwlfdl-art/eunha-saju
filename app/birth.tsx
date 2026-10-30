import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  Body,
  Field,
  Muted,
  PrimaryButton,
  Screen,
  Title,
} from '@/components/ui';
import { isValidBirthDate, isValidBirthTime, type Gender } from '@/content';
import { Brand } from '@/constants/Colors';
import { Copy } from '@/constants/Copy';
import { Font } from '@/constants/Typography';

/** Birth input — date / time / gender → fortune (or detail intent). */
export default function BirthScreen() {
  const { intent } = useLocalSearchParams<{ intent?: string }>();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [gender, setGender] = useState<Gender>('female');
  const [touched, setTouched] = useState(false);

  const forDetail = intent === 'detail';
  const dateOk = isValidBirthDate(date);
  const timeOk = timeUnknown || isValidBirthTime(time);
  const canSubmit = dateOk && timeOk;

  const errorMessage = useMemo(() => {
    if (!touched) return null;
    if (!dateOk) return Copy.birthDateError;
    if (!timeOk) return Copy.birthTimeError;
    return null;
  }, [touched, dateOk, timeOk]);

  const onSubmit = () => {
    setTouched(true);
    if (!canSubmit) return;

    const params = {
      date,
      time: timeUnknown ? '' : time,
      timeUnknown: timeUnknown ? '1' : '0',
      gender,
      intent: forDetail ? 'detail' : 'fortune',
    };

    if (forDetail) {
      router.push({ pathname: '/detail', params });
      return;
    }

    router.push({ pathname: '/fortune', params });
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <Title>{Copy.birthTitle}</Title>
      <Muted>{Copy.birthHint}</Muted>

      <View style={styles.form}>
        <View style={styles.block}>
          <Text style={styles.label}>{Copy.birthDateLabel}</Text>
          <Field
            placeholder={Copy.birthDatePlaceholder}
            value={date}
            onChangeText={setDate}
            keyboardType="numbers-and-punctuation"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{Copy.birthTimeLabel}</Text>
          <Field
            placeholder={Copy.birthTimePlaceholder}
            value={timeUnknown ? '' : time}
            onChangeText={setTime}
            editable={!timeUnknown}
            keyboardType="numbers-and-punctuation"
            autoCorrect={false}
            autoCapitalize="none"
            style={timeUnknown ? styles.fieldDimmed : undefined}
          />
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: timeUnknown }}
            onPress={() => setTimeUnknown((v) => !v)}
            style={styles.checkRow}>
            <View style={[styles.checkbox, timeUnknown && styles.checkboxOn]} />
            <Body>{Copy.birthTimeUnknown}</Body>
          </Pressable>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{Copy.birthGender}</Text>
          <View style={styles.segment}>
            {(
              [
                ['female', Copy.birthGenderFemale],
                ['male', Copy.birthGenderMale],
                ['other', Copy.birthGenderOther],
              ] as const
            ).map(([value, label]) => {
              const on = gender === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => setGender(value)}
                  style={[styles.segmentItem, on && styles.segmentItemOn]}>
                  <Text
                    style={[styles.segmentText, on && styles.segmentTextOn]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </View>

      <PrimaryButton
        label={forDetail ? Copy.birthSubmitDetail : Copy.birthSubmit}
        onPress={onSubmit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
  },
  form: {
    marginTop: 32,
    marginBottom: 36,
    gap: 26,
  },
  block: {
    gap: 10,
  },
  label: {
    fontFamily: Font.sansSemi,
    fontSize: 13,
    color: Brand.sky,
    letterSpacing: 0.2,
  },
  fieldDimmed: {
    opacity: 0.45,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Brand.line,
    backgroundColor: Brand.white,
  },
  checkboxOn: {
    backgroundColor: Brand.amber,
    borderColor: Brand.amber,
  },
  segment: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Brand.line,
    gap: 4,
  },
  segmentItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: -1,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  segmentItemOn: {
    borderBottomColor: Brand.amber,
  },
  segmentText: {
    fontFamily: Font.sansMedium,
    color: Brand.inkMuted,
    fontSize: 15,
  },
  segmentTextOn: {
    color: Brand.ink,
    fontFamily: Font.sansSemi,
  },
  error: {
    fontFamily: Font.sans,
    color: Brand.danger,
    fontSize: 14,
    lineHeight: 20,
  },
});
