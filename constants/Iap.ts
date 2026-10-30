/**
 * In-app purchase constants for 은하사주.
 *
 * Product choice (locked for MVP):
 * - Type: **non-consumable** (Apple) / one-time non-consumable product (Google Play)
 * - Why: one payment permanently unlocks the detailed saju report for that store
 *   account. Restore Purchases can re-grant the entitlement after reinstall.
 * - Not a subscription and not a consumable (report is not a re-buyable coin pack).
 * - Display price in UI: ₩6,900 — the store console must set the same KRW price;
 *   the app always shows this locked MVP price string (store localized price can
 *   be shown later once sandbox products return).
 */

/** App Store Connect / Play Console product ID — create with this exact id. */
export const DETAIL_REPORT_PRODUCT_ID = 'com.eunha.saju.detail.report' as const;

/** Locked MVP display price (KRW). */
export const DETAIL_REPORT_PRICE_DISPLAY = '₩6,900' as const;

/** Store product kind we configure in consoles. */
export const DETAIL_REPORT_PRODUCT_KIND = 'non-consumable' as const;

export const IapProducts = {
  detailReport: {
    id: DETAIL_REPORT_PRODUCT_ID,
    kind: DETAIL_REPORT_PRODUCT_KIND,
    priceDisplay: DETAIL_REPORT_PRICE_DISPLAY,
    /** finishTransaction isConsumable — false for permanent unlock. */
    isConsumable: false,
  },
} as const;
