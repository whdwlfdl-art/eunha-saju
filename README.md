# 은하사주 (Eunha Saju)

밤하늘처럼 맑게, 오늘의 흐름을 편하게 읽는 사주·운세 앱.

Expo (React Native) + TypeScript + Expo Router MVP scaffold.

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

## MVP screen stubs

| Route | Screen |
|-------|--------|
| `/` | Home / brand hero + CTAs |
| `/birth` | Birth date · time · gender input |
| `/fortune` | Free daily fortune + AdMob placeholder |
| `/detail` | Paid detail CTA (IAP placeholder) |

IAP, AdMob, and Supabase are **not** wired yet — placeholders only.

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
