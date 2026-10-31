import * as Linking from 'expo-linking';

/**
 * Legal / support contacts for store listing and in-app links.
 * Privacy policy is hosted on GitHub Pages (no paid hosting required).
 */
export const PRIVACY_POLICY_URL =
  'https://whdwlfdl-art.github.io/eunha-saju/privacy-policy.html' as const;

export const SUPPORT_EMAIL = 'whdwlfdl@gmail.com' as const;

/** Open the public privacy policy page in the system browser. */
export async function openPrivacyPolicy(): Promise<void> {
  await Linking.openURL(PRIVACY_POLICY_URL);
}
