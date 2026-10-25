# 은하사주 (Eunha Saju)

밤하늘처럼 맑게, 오늘의 흐름을 편하게 읽는 사주·운세 앱.

Expo (React Native) + TypeScript + Expo Router MVP scaffold.

## Prerequisites

- Node.js 20+ (LTS recommended) — Expo SDK 58 targets Node 22.13.x when possible
- npm
- Expo Go on a phone (optional) — Cloud Agents / CI do **not** need Android/iOS emulators
- **Real IAP testing** needs Apple Developer + Google Play Console accounts, a **development build** (not Expo Go), and a physical device

## Install

```bash
npm ci
```

(First-time or lockfile refresh: `npm install`)

## Start (interactive)

```bash
npx expo start
```

Tunnel (useful on remote VMs / Cloud Agents when a device must reach Metro):

```bash
npx expo start --tunnel
```

Web preview:

```bash
npx expo start --web
```

## Verify without a device

```bash
npm run typecheck
npx expo export --platform web
```

`expo export` writes a static web bundle under `dist/` and confirms the project bundles. No emulator required.

## MVP screens

| Route | Screen |
|-------|--------|
| `/` | Home / brand hero + CTAs |
| `/birth` | Birth date · time · gender input |
| `/fortune` | Free daily fortune + AdMob **placeholder only** |
| `/detail` | Paid detail CTA — **expo-iap** purchase / restore / unlock |

## In-app purchase (IAP)

| Item | Value |
|------|-------|
| Library | `expo-iap` (Expo SDK 58, OpenIAP) |
| Product ID | `com.eunha.saju.detail.report` |
| Type | **Non-consumable** (Apple) / one-time non-consumable (Google Play) |
| UI price | **₩6,900** |
| AdMob | **Not added** — fortune screen keeps a placeholder slot only |

**Why non-consumable:** one payment permanently unlocks the detailed saju report for that store account; Restore Purchases can re-grant after reinstall. Not a subscription and not a consumable coin pack.

### Mock mode (default for `expo start` / web)

When the store cannot run (web, Expo Go, or `EXPO_PUBLIC_IAP_MOCK=1`), the app uses a **mock** path: purchase / restore unlock locally via AsyncStorage and **do not crash**. Real StoreKit / Play Billing needs a development or production build after store products exist.

```bash
# Force mock even in a native build
EXPO_PUBLIC_IAP_MOCK=1 npx expo start
```

### 종철 체크리스트 — App Store Connect + Google Play 상품 만들기

상세 한글 가이드: Project store `docs/iap-setup-checklist.md`.

**공통**

1. 번들 ID / 패키지명 확인: `com.eunhasaju.app` (`app.json`)
2. 상품 ID를 **정확히** `com.eunha.saju.detail.report` 로 생성
3. 가격 **₩6,900** (KRW) 설정
4. 타입: **Non-Consumable** (Apple) / **일회성·비소모성(Managed / one-time)** (Google) — 구독·소모성 아님
5. 계정·계약·세금·은행 정보 승인 완료 후 샌드박스 테스트

**Apple (App Store Connect) — 요약**

1. [App Store Connect](https://appstoreconnect.apple.com) → 내 앱 → 은하사주 (또는 앱 생성)
2. **수익화 → 앱 내 구입** → 비소모성(Non-Consumable) 추가
3. Product ID: `com.eunha.saju.detail.report`
4. 가격: ₩6,900 티어 선택, 심사 메타·스크린샷 준비
5. Sandbox 테스터 계정 추가 → 실기기 + development build로 결제 테스트

**Google Play Console — 요약**

1. [Play Console](https://play.google.com/console) → 앱 생성/선택 (`com.eunhasaju.app`)
2. **수익 창출 → 제품 → 인앱 상품** → 상품 만들기
3. Product ID: `com.eunha.saju.detail.report` (소모성 아님)
4. 가격: KRW 6,900, 활성(Active)
5. 내부 테스트 트랙에 빌드 업로드 + 라이선스 테스터 추가 후 실기기 테스트

**계정이 준비되면 팀에 이렇게 알려 주세요**

> Apple Developer / Play Console 가입·유료 멤버십·세금·계약 완료했어. 상품 ID `com.eunha.saju.detail.report` (₩6,900, non-consumable) 콘솔에 만들었고, 샌드박스/라이선스 테스터도 추가했어. development build로 실기기 IAP 테스트 진행해 줘.

Monetization sequence: **IAP now → AdMob later** (광고 SDK는 IAP 샌드박스가 통과한 뒤에).

## Cloud Agent `environment.json` hints

```json
{
  "install": "npm ci",
  "start": ""
}
```

- **install:** `npm ci` (requires committed `package-lock.json`)
- **start:** leave empty — Expo Metro is interactive; agents should run `npx expo start --tunnel` or `npx expo export --platform web` / `npm run typecheck` as needed for the task

## Scripts

| Script | Purpose |
|--------|---------|
| `npm start` | Expo dev server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run export:web` | Static web export smoke test |
| `npm run web` | Expo web |

## License

See [LICENSE](./LICENSE).
