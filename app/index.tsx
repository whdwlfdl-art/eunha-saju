import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
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

/** Home — brand hero + CTAs (visuals swappable later). */
export default function HomeScreen() {
  const heroFade = useSharedValue(0);
  const heroRise = useSharedValue(14);
  const actionsFade = useSharedValue(0);

  useEffect(() => {
    heroFade.value = withTiming(1, { duration: 560 });
    heroRise.value = withTiming(0, { duration: 560 });
    actionsFade.value = withDelay(160, withTiming(1, { duration: 480 }));
  }, [heroFade, heroRise, actionsFade]);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroFade.value,
    transform: [{ translateY: heroRise.value }],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: actionsFade.value,
  }));

  return (
    <Screen style={styles.screen} contentStyle={styles.content}>
      <Animated.View style={[styles.hero, heroStyle]}>
        <View style={styles.skyBand} />
        <BrandMark />
        <Body>{Copy.tagline}</Body>
      </Animated.View>

      <Animated.View style={[styles.actions, actionsStyle]}>
        <PrimaryButton
          label={Copy.homeCtaFortune}
          onPress={() =>
            router.push({ pathname: '/birth', params: { intent: 'fortune' } })
          }
        />
        <SecondaryButton
          label={Copy.homeCtaSaju}
          onPress={() =>
            router.push({ pathname: '/birth', params: { intent: 'detail' } })
          }
        />
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: 14,
    paddingBottom: 32,
  },
  skyBand: {
    height: 3,
    width: 40,
    backgroundColor: Brand.sky,
    borderRadius: 1,
    marginBottom: 18,
    opacity: 0.85,
  },
  actions: {
    gap: 12,
    paddingBottom: 8,
  },
});
