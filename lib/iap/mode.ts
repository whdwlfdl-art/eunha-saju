import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Use mock IAP when the real store cannot run:
 * - web / static export
 * - Expo Go (no custom native module)
 * - explicit EXPO_PUBLIC_IAP_MOCK=1
 *
 * Real StoreKit / Play Billing needs a development or production build.
 */
export function shouldUseMockIap(): boolean {
  if (process.env.EXPO_PUBLIC_IAP_MOCK === '1') {
    return true;
  }

  if (Platform.OS === 'web') {
    return true;
  }

  // Expo Go cannot load expo-iap native code.
  if (Constants.appOwnership === 'expo') {
    return true;
  }

  return false;
}

export function iapModeLabel(): 'mock' | 'store' {
  return shouldUseMockIap() ? 'mock' : 'store';
}
