import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import {
  Body,
  Field,
  Muted,
  PrimaryButton,
  Screen,
  Title,
} from '@/components/ui';
import { Brand } from '@/constants/Colors';
import { Copy } from '@/constants/Copy';

type Gender = 'female' | 'male' | 'other';

/** Birth-date input stub — no real calendar/saju engine yet. */
export default function BirthScreen() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [gender, setGender] = useState<Gender>('female');

  return (
    <Screen>
      <Title>{Copy.birthTitle}</Title>
      <Muted>{Copy.birthHint}</Muted>

      <View style={styles.form}>
        <View style={styles.block}>
          <Text style={styles.label}>생년월일</Text>
          <Field
            placeholder="예: 1990-05-12"
            value={date}
            onChangeText={setDate}
            keyboardType="numbers-and-punctuation"
            autoCorrect={false}
          />
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>태어난 시간</Text>
          <Field
            placeholder="예: 14:30"
            value={timeUnknown ? '' : time}
            onChangeText={setTime}
            editable={!timeUnknown}
            keyboardType="numbers-and-punctuation"
            autoCorrect={false}
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
      </View>

      <PrimaryButton
        label={Copy.birthSubmit}
        onPress={() =>
          router.push({
            pathname: '/fortune',
            params: {
              date: date || '미입력',
              time: timeUnknown ? '모름' : time || '미입력',
              gender,
            },
          })
        }
      />
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
});
