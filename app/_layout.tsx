import {
  NotoSansKR_400Regular,
  NotoSansKR_500Medium,
  NotoSansKR_600SemiBold,
  NotoSansKR_700Bold,
} from '@expo-google-fonts/noto-sans-kr';
import {
  NotoSerifKR_600SemiBold,
  NotoSerifKR_700Bold,
} from '@expo-google-fonts/noto-serif-kr';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Brand } from '@/constants/Colors';
import { Font } from '@/constants/Typography';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [Font.display]: NotoSerifKR_700Bold,
    [Font.displaySemi]: NotoSerifKR_600SemiBold,
    [Font.sans]: NotoSansKR_400Regular,
    [Font.sansMedium]: NotoSansKR_500Medium,
    [Font.sansSemi]: NotoSansKR_600SemiBold,
    [Font.sansBold]: NotoSansKR_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Brand.paper },
          headerTintColor: Brand.ink,
          headerTitleStyle: {
            fontFamily: Font.sansSemi,
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Brand.paper },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="birth"
          options={{ title: '생년월일', headerBackTitle: '홈' }}
        />
        <Stack.Screen
          name="fortune"
          options={{ title: '오늘의 운세', headerBackTitle: '입력' }}
        />
        <Stack.Screen
          name="detail"
          options={{ title: '상세 사주', headerBackTitle: '뒤로' }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
