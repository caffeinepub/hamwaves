# HamWaves – UV-K5 Standalone PWA Viewer

## Current State
- `/equipment-reviews/uv-k5-live-mirror` contains the full WebSerial + Canvas viewer (UVK5LiveMirror.tsx, ~1439 lines) with all protocol logic, keypad, remote control, themes, and PWA install prompt.
- Site uses a single TanStack Router rootRoute that always wraps every page with `<Navbar />` and `<Footer />`.
- `/manifest.json` and `/sw.js` exist, pointing to the equipment-reviews mirror page as the PWA start_url.
- PWA icons (192×192, 512×512) already generated in `/assets/generated/`.

## Requested Changes (Diff)

### Add
- New route `/uv-k5-viewer` rendering `UVK5ViewerPage` (standalone, no nav/footer chrome).
- `UVK5ViewerPage.tsx` — full viewer (canvas, connect, keypad, remote control, FPS, themes, v5.2.0 protocol) in a compact full-viewport layout with no site chrome.
- `/viewer-manifest.json` — separate PWA manifest with `name: "HamWaves UV-K5 Viewer"`, `short_name: "UV-K5 Mirror"`, `start_url: "/uv-k5-viewer"`, new viewer icons.
- `/viewer-sw.js` — service worker scoped to viewer assets only, offline fallback message.
- Viewer-specific PWA icons (192×192, 512×512) with neon cyan glow walkie-talkie.
- "Install Viewer App" neon cyan button using `beforeinstallprompt`.

### Modify
- `App.tsx` — make rootRoute component conditionally hide Navbar and Footer when `pathname === '/uv-k5-viewer'`.
- `UVK5ViewerPage` registers `/viewer-sw.js` (not `/sw.js`) and swaps `<link rel="manifest">` to `/viewer-manifest.json` via DOM manipulation in useEffect.

### Remove
- Nothing removed from existing pages.

## Implementation Plan
1. Generate viewer PWA icons (192×192, 512×512).
2. Write `/viewer-manifest.json` and `/viewer-sw.js` to public.
3. Create `UVK5ViewerPage.tsx` — compact full-viewport layout, all viewer logic, registers viewer-sw.js, swaps manifest, Install Viewer App button.
4. Update `App.tsx` — add `/uv-k5-viewer` route, hide Navbar/Footer on that route via `useRouterState`.
