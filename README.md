# WXT + React + shadcn/ui Chrome Extension Starter

A batteries-included Chrome MV3 (and Firefox) extension starter built with:

- [WXT](https://wxt.dev) — modern web-ext toolchain (auto manifests, HMR)
- [React 18](https://react.dev) + [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [i18next](https://www.i18next.com) (per-namespace lazy loading)
- TypeScript with `strict` + `noUncheckedIndexedAccess`

## What's included

| Surface              | Where                          | Notes                                     |
| -------------------- | ------------------------------ | ----------------------------------------- |
| Popup                | `entrypoints/popup/`           | Toolbar-icon click target; quick actions  |
| Side panel UI        | `entrypoints/sidepanel/`       | MV3 `sidePanel` API                       |
| Options page         | `entrypoints/options/`         | `chrome://extensions` → Details → Options |
| Content script UI    | `entrypoints/content/`         | Mounted in a shadow root via `createShadowRootUi` |
| Background service   | `entrypoints/background.ts`    | Typed message broker + command handler    |
| Shared app shell     | `components/app/`              | One implementation used across surfaces   |
| shadcn primitives    | `components/ui/`               | `npx shadcn-ui@latest add` to extend      |
| Typed IPC            | `lib/messaging.ts`             | Discriminated-union messages              |
| Typed storage        | `lib/storage.ts`               | `browser.storage.local` with a schema     |
| Theme                | `components/theme-provider.tsx`| `light` / `dark` / `system` + accent presets, persisted |
| Localization         | `locales/` + `public/_locales/`| i18next for UI, Chrome `_locales` for manifest |

### How the surfaces connect

```
                       ┌──────────────┐
 Toolbar icon click ─► │    Popup     │── "Open Side Panel" ──► sidePanel.open()
                       └──────┬───────┘── "Toggle Widget"   ──► content script
                              │
                              └── "Open Options" ──► options page
```

Keyboard shortcuts (declared in `wxt.config.ts → manifest.commands`):

| Shortcut       | Action                                     |
| -------------- | ------------------------------------------ |
| `Alt+Shift+S`  | Open the side panel                        |
| `Alt+Shift+W`  | Toggle the in-page widget on the active tab |

Users can rebind both at `chrome://extensions/shortcuts`.

## Getting started

```bash
nvm use            # uses .nvmrc → Node 20
npm install
npm run dev        # Chrome
npm run dev:firefox
```

Then load `/.output/chrome-mv3` (or `/.output/firefox-mv2`) as an unpacked
extension. WXT will hot-reload on save.

## Scripts

| Script                  | What it does                                |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Dev server (Chrome)                         |
| `npm run dev:firefox`   | Dev server (Firefox)                        |
| `npm run build`         | Production build (Chrome)                   |
| `npm run build:firefox` | Production build (Firefox)                  |
| `npm run zip`           | Build + zip for the Chrome Web Store        |
| `npm run zip:firefox`   | Build + zip for AMO                         |
| `npm run compile`       | `tsc --noEmit` typecheck                    |
| `npm run lint`          | ESLint, zero warnings                       |
| `npm run format`        | Prettier write                              |
| `npm run test`          | Vitest (JSDOM unit + component tests)       |
| `npm run test:watch`    | Vitest in watch mode                        |
| `npm run test:coverage` | Vitest with v8 coverage                     |
| `npm run check`         | Typecheck + lint + format + test (CI mirror)|

## Adding a shadcn component

```bash
npx shadcn-ui@latest add <component>
```

`components.json` is already wired (`baseColor: zinc`, CSS variables, no prefix).

## Messaging

Send a message from anywhere in the extension:

```ts
import { sendMessage } from "@/lib/messaging";

await sendMessage({ type: "changeTheme", theme: "dark" });
```

Subscribe (returns an unsubscribe for `useEffect` cleanup):

```ts
import { onMessage } from "@/lib/messaging";

useEffect(() =>
  onMessage((m) => {
    if (m.type === "changeLocale") void i18n.changeLanguage(m.locale);
  }),
);
```

Add a new variant in `lib/messaging.ts` and TypeScript's exhaustiveness
checking will guide every consumer.

## Storage

```ts
import { getStored, setStored } from "@/lib/storage";

const theme = await getStored("theme");        // ThemeMode | undefined
await setStored("locale", "zh_CN");
```

Extend the `StorageSchema` interface to add typed keys.

## Cross-surface state (Zustand)

`lib/store.ts` exposes `useAppStore` — a Zustand store that is mirrored to
`browser.storage.local` and kept in sync across every surface via
`browser.storage.onChanged`. Change the locale in the popup and the side
panel updates instantly; toggle the theme in the in-page widget and the
options page follows. No manual broadcasting required.

```ts
import { useAppStore } from "@/lib/store";

const theme = useAppStore((s) => s.theme);
useAppStore.getState().setTheme("dark");        // persists + syncs everywhere
```

The store is hydrated by the `ThemeProvider` (which calls `useStoreHydration`
internally), so any entrypoint that wraps its tree in `<ThemeProvider>` gets
this for free. State mutations are persisted automatically — if you only
need to read/write state, do it through the store and skip `lib/storage.ts`
entirely.

## Localization

UI strings live in `locales/<locale>/<namespace>.json`. Each entrypoint loads
the namespaces it needs:

```ts
initTranslations(i18nConfig.defaultLocale, ["common", "sidepanel"]);
```

Manifest-level strings (extension name, description) live in
`public/_locales/<locale>/messages.json` — referenced as `__MSG_extName__` in
`wxt.config.ts`.

## Theme presets

Four accent palettes ship out of the box: `violet` (default), `zinc`, `green`,
`rose`. Each is a small block of CSS variable overrides in `assets/main.css`
and is selected via a `data-theme-preset="..."` attribute on the theme root.

Add a new preset by:

1. Defining `[data-theme-preset="..."]` and `.dark[data-theme-preset="..."]`
   blocks in `assets/main.css`.
2. Appending the id to `THEME_PRESETS` in `lib/storage.ts`.

The `ThemeRoot` component (`components/app/theme-root.tsx`) applies both the
`light`/`dark` class and the preset attribute — wrap each entrypoint's tree
in `<ThemeRoot>`.

## Testing

[Vitest](https://vitest.dev) drives unit + component tests in JSDOM. The
`wxt/browser` module is globally mocked by `tests/setup.ts` — every test
gets a fresh in-memory `browser.storage.local`, message bus and command
registry from `tests/mocks/browser.ts`. Call `emitStorageChange(...)` from
the mock to simulate writes from another extension surface.

Run on every save:

```bash
npm run test:watch
```

Examples that ship:

| File                                    | What it covers                            |
| --------------------------------------- | ----------------------------------------- |
| `lib/storage.test.ts`                   | Typed get/set + the legacy locale key     |
| `lib/messaging.test.ts`                 | `sendMessage`, broadcasting, unsubscribe  |
| `lib/store.test.ts`                     | Setters persist, hydration, cross-surface sync |
| `components/app/sidebar.test.tsx`       | Renders, click → callback, aria-current   |

There are no end-to-end (Playwright) tests by default. If you need one,
build the extension (`npm run build`) and load `.output/chrome-mv3` with
`--disable-extensions-except=...` from a Playwright spec — but most
template changes are well-covered by Vitest alone.

## Notes on Tailwind in shadow DOM

Tailwind's `rem` unit resolves against the host page's root font-size, so the
content-script UI can drift visually from the side panel. We use
`@thedutchcoder/postcss-rem-to-px` to convert `rem` → `px` at build time —
see `postcss.config.js`.

## Project layout

```
.
├── assets/                # Tailwind base CSS (shared)
├── components/
│   ├── app/               # Shared feature components (Header, Sidebar, ...)
│   ├── settings/          # Theme + locale settings panels
│   ├── ui/                # shadcn primitives
│   ├── i18n.ts            # i18next bootstrap
│   ├── i18nConfig.ts      # Locales registry
│   └── theme-provider.tsx
├── entrypoints/
│   ├── background.ts
│   ├── content/           # Content script (shadow-root UI)
│   └── sidepanel/         # MV3 side panel
├── lib/
│   ├── messaging.ts       # Typed IPC
│   ├── storage.ts         # Typed storage
│   └── utils.ts           # `cn()` helper
├── locales/               # i18next translations
├── public/_locales/       # Chrome manifest translations
└── wxt.config.ts
```

## License

MIT — see [LICENSE](./LICENSE).
