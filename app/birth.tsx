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

/** Birth input — date / time / gender → fortune (or detail intent). */
export default function BirthScreen() {
  const { intent } = useLocalSearchParams<{ intent?: string }>();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [gender, setGender] = useState<Gender>('female');
  const [touched, setTouched] = useState(false);

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
      intent: intent === 'detail' ? 'detail' : 'fortune',
    };

    if (intent === 'detail') {
      router.push({ pathname: '/detail', params });
      return;
    }

    router.push({ pathname: '/fortune', params });
  };

  return (
    <Screen scroll>
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
          <View style={styles.chips}>
            {(
              [
                ['female', Copy.birthGenderFemale],
                ['male', Copy.birthGenderMale],
                ['other', Copy.birthGenderOther],
              ] as const
            ).map(([value, label]) => (
              <Pressable
                key={value}
                onPress={() => setGender(value)}
                style={[styles.chip, gender === value && styles.chipOn]}>
                <Text
                  style={[
                    styles.chipText,
                    gender === value && styles.chipTextOn,
                  ]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </View>

      <PrimaryButton label={Copy.birthSubmit} onPress={onSubmit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 28,
    marginBottom: 32,
    gap: 22,
  },
  block: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.sky,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
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
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Brand.line,
    backgroundColor: Brand.white,
  },
  chipOn: {
    backgroundColor: Brand.sky,
    borderColor: Brand.sky,
  },
  chipText: {
    color: Brand.ink,
    fontSize: 15,
    fontWeight: '500',
  },
  chipTextOn: {
    color: Brand.white,
  },
  error: {
    color: '#8b3a3a',
    fontSize: 14,
    lineHeight: 20,
  },
});
