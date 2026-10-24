import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import {
  Body,
  BrandMark,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from '@/components/ui';
import { Brand } from '@/constants/Colors';
import { Copy } from '@/constants/Copy';

/** Home / onboarding stub — brand hero + CTAs only. */
export default function HomeScreen() {
  return (
    <Screen style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.skyBand} />
        <BrandMark />
        <Body>{Copy.tagline}</Body>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label={Copy.homeCtaFortune}
          onPress={() => router.push('/birth')}
        />
        <SecondaryButton
          label={Copy.homeCtaSaju}
          onPress={() => router.push('/birth')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  skyBand: {
    height: 4,
    width: 48,
    backgroundColor: Brand.sky,
    borderRadius: 2,
    marginBottom: 20,
  },
  actions: {
    gap: 12,
  },
});
