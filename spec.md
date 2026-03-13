# HamWaves – UV-K5 Live Mirror Elite Upgrade

## Current State
The page at `/equipment-reviews/uv-k5-live-mirror` (`UVK5LiveMirror.tsx`) exists with a basic WebSerial + Canvas viewer: 8× pixel scale, 4 color themes, AA55 frame parser (type 01 full / 02 diff), FPS display, screenshot, zoom +/-, invert, disconnect. Single-column layout. No keypad overlay, no model selector, no auto-reconnect, no language toggle, no glassmorphism control bar.

## Requested Changes (Diff)

### Add
- Model selector (UV-K5 / UV-K1 V3) as radio buttons above canvas
- Top control bar (glassmorphism, dark navy): Connect / Disconnect / Keypad toggle / Help modal / Language dropdown (EN/FR) / Theme selector
- Right-side keypad overlay panel: realistic radio button grid (PTT, MENU, EXIT, arrows, 0-9, *, #, F1/F2, A/B) – visual only with hover glow; on mobile stacks below canvas
- Status badge top-right: READY / Connecting / Connected–F4HWN vX.X / Reconnecting / Error states with coloured dot
- Auto-reconnect logic: retry every 3s on disconnect, up to 5 attempts
- LCD emulation upgrades: blue backlit background (#0a1628), scanline overlay, subtle outer glow/shine on canvas container
- Scale increased to default 10× (range 8–16×)
- Language toggle (EN/FR) changes UI labels
- Help modal explaining requirements and protocol
- Updated SEO title/meta for UV-K5 & UV-K1 V3
- Updated page H1/subtitle to cover both radios + F4HWN firmware
- Mobile warning for USB OTG

### Modify
- Canvas default scale: 8× → 10× (desktop), responsive max-width
- Theme: add 'Invert' as a named theme option in the control bar selector
- Status area: more descriptive labels including firmware version placeholder
- Instructions section: updated to cover UV-K1 V3 as well
- Control layout: horizontal top bar (glassmorphism) instead of stacked rows
- Frame parser: keep AA55 + type 01/02 logic; add firmware version sniff from special frame type 0x03 if present

### Remove
- Old stacked control rows (replace with top bar + right panel)
- Old simple status row (replaced by top-right badge)

## Implementation Plan
1. Rewrite `UVK5LiveMirror.tsx` entirely with the elite viewer layout
2. Top bar: glassmorphism strip with all controls in one row, wraps on mobile
3. Canvas section: side-by-side with keypad overlay on desktop; stacked on mobile
4. LCD canvas: blue backlit bg, scanline CSS overlay, outer glow box-shadow
5. Keypad overlay component: grid of styled buttons, visual-only, hover glow
6. Status badge: absolute-positioned top-right of control bar
7. Auto-reconnect: useRef counter + setTimeout loop
8. Language state: EN/FR labels object, dropdown in top bar
9. Help modal: Dialog component with requirements list
10. Update SEO meta tags for both radio models
