import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Brand } from '@/constants/Colors';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Brand.paper },
          headerTintColor: Brand.ink,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Brand.paper },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="birth" options={{ title: '생년월일', headerBackTitle: '홈' }} />
        <Stack.Screen name="fortune" options={{ title: '오늘의 운세', headerBackTitle: '입력' }} />
        <Stack.Screen name="detail" options={{ title: '상세 사주', headerBackTitle: '뒤로' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
