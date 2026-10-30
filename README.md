# 은하사주 (Eunha Saju)

밤하늘처럼 맑게, 오늘의 흐름을 편하게 읽는 사주·운세 앱.

Expo (React Native) + TypeScript + Expo Router MVP.

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm
- Expo Go on a phone (optional) — Cloud Agents / CI do **not** need Android/iOS emulators

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

## Core user flow

| Route | Screen |
|-------|--------|
| `/` | Home — brand hero + CTAs |
| `/birth` | Birth date · time · gender |
| `/fortune` | Free daily fortune (template) + AdMob placeholder |
| `/detail` | Paid detail CTA + result shell (IAP placeholder) |

**Tap path for design review:** 홈 → 오늘의 운세 보기 → 생년월일 입력 → 운세 보기 → (광고 자리) → 내 사주 자세히 → 미리 읽어보기 / 결제하기 스텁.

IAP, AdMob, Supabase, and real LLM APIs are **not** wired — placeholders / stubs only.

## Content module (`content/`)

Pipeline (locked product path B):

```
규칙 / 템플릿 → (선택) AI 초안 → 검수 → 출고
```

| Piece | Role |
|-------|------|
| `ContentProvider` | Interface: `getDailyFortune` / `getDetailReading` |
| `TemplateProvider` | **Implemented** — deterministic keys + template pools |
| `AiDraftProvider` | **Stub** — returns `null`; TODO real API + review queue |
| `CascadingContentProvider` | Prefer AI draft when non-null, else templates |

### MVP 사주 key assumptions (not professional 역술)

This app uses a **reasonable Korean 사주-inspired mapping** for MVP demos. It does **not** claim 만세력 / 명리 accuracy.

1. **일간·일지** — days since `1900-01-01` (UTC date) mapped onto 10 천간 × 12 지지. Anchor chosen so that epoch day ≈ 갑술 in this table; real 절기·야자시 보정 없음.
2. **띠** — `(year - 4) % 12` (쥐=0). 입춘 기준 연도 변경은 반영하지 않음.
3. **시진** — 2-hour branches; 23:00 starts 자. “시간 모름” → 시주 null.
4. **오행** — from 일간 only (갑을木 … 임계水).
5. **문장 선택** — `profileKey` / `dailyKey` hashed into template pools (same birth + day → same copy).

Templates are modern-casual Korean; free daily stays short; paid sections cover 성격·총운·재물·연애·올해 흐름.

## Brand tokens

See `constants/Colors.ts` and `constants/Copy.ts` (은하사주 brand brief: ink / paper / sky / amber).

## Cloud Agent `environment.json` hints

```json
{
  "install": "npm ci",
  "start": ""
}
```

- **install:** `npm ci` (requires committed `package-lock.json`)
- **start:** leave empty — Expo Metro is interactive; agents should run `npx expo start --tunnel` or `npx expo export --platform web` / `npm run typecheck` as needed

## Scripts

| Script | Purpose |
|--------|---------|
| `npm start` | Expo dev server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run export:web` | Static web export smoke test |
| `npm run web` | Expo web |

## License

See [LICENSE](./LICENSE).
