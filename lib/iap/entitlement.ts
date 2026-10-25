import AsyncStorage from '@react-native-async-storage/async-storage';

import { DETAIL_REPORT_PRODUCT_ID } from '@/constants/Iap';

const ENTITLEMENT_KEY = `eunha.iap.entitlement.${DETAIL_REPORT_PRODUCT_ID}`;

/** Local unlock flag — MVP client entitlement until server receipt validation exists. */
export async function isDetailReportUnlocked(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ENTITLEMENT_KEY);
    return value === '1';
  } catch {
    return false;
  }
}

export async function grantDetailReportEntitlement(): Promise<void> {
  await AsyncStorage.setItem(ENTITLEMENT_KEY, '1');
}

export async function clearDetailReportEntitlement(): Promise<void> {
  await AsyncStorage.removeItem(ENTITLEMENT_KEY);
}
