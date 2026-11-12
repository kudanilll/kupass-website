# Kupass Design System

Design specification for the **Kupass** open-source password manager web experience, aligning the marketing surface with the Android/Pixel application UI.

---

## 1. Visual Direction

- **Brand Character**: Clean, daylight-first cryptographic clarity paired with energetic organic lime-green highlights.
- **Canvas Strategy**: High-contrast `#ffffff` upper canvas for editorial display typography, transitioning smoothly into a luminous lower radial dome that anchors the primary action and product trust copy.
- **Spatial Hierarchy**: Layered depth with the giant headline at `z-10`, an interactive full-viewport 3D hardware showcase at `z-20`, and elevated interactive controls at `z-30`.

---

## 2. Color Tokens

Defined in `app/globals.css` under Tailwind CSS v4 `@theme`:

| Token | Hex | Role | Usage |
| :--- | :--- | :--- | :--- |
| `--color-kupass-primary` | `#008c45` | Primary Brand Green | Hero display headline (`Stay secure`), CTA icon accent, primary badges |
| `--color-kupass-mint` | `#dffbc0` | Soft Lime Surface | Upper dome glow transition, button hover surface, pill badges, text selection |
| `--color-kupass-lime` | `#afec2c` | Electric Lime Accent | Mid-dome energy gradient, active focus rings, secondary tags, 3D bounce light |
| `--color-kupass-deep` | `#004d25` | Deep Forest Ink | Primary body text, CTA button label, modal headings, bottom dome anchor |
| `--color-kupass-surface` | `#f7faee` | App Warm Off-White | Mobile app canvas and secondary card surface |

### Contrast & Accessibility Rules

- **Display text on `#ffffff`**: `#008c45` meets WCAG AA for large bold display typography (`>= 3:1`, `4.46:1` actual).
- **Small copy over the hero dome**: The lower core anchors into `#004d25` / `#006632` behind the `12px–14px` white caption (`#ffffff`) to maintain `> 5.5:1` legibility.
- **Interactive buttons**: White pill CTA (`#ffffff`) uses `#004d25` label ink and `#008c45` icon fill (`> 9:1` contrast on label).

---

## 3. Typography

Configured via `next/font/local` in `common/font.ts` and exposed to Tailwind v4 via CSS variables:

| Role | Font Family | Variable | Weight Range | Usage |
| :--- | :--- | :--- | :--- | :--- |
| Primary Sans (`--font-sans`) | Google Sans Flex | `--font-google-sans-flex` | `100–900` | Display headlines, CTA buttons, modal UI, body copy |
| Security Mono (`--font-mono`) | Heming | `--font-heming` | `100–900` | Vault headings, keys, TOTP/code identifiers |

### Hero Type Scale

- **Hero Headline (`h1`)**: `clamp(3.35rem, 15vw, 12.5rem)`, `font-weight: 700`, `line-height: 0.9`, `letter-spacing: -0.045em`, single-line (`whitespace-nowrap`).
- **CTA Label**: `16px` (`text-base`) on mobile scaling to `18px` (`sm:text-lg`), `font-weight: 600`.
- **Trust Caption**: `12px` (`text-xs`) on mobile scaling to `14px` (`sm:text-sm`), `max-width: 28rem` (`max-w-md`).

---

## 4. Surfaces, Gradients & Elevation

### Luminous Security Dome

Built with two stacked radial gradients anchored below the fold (`108%` Y origin) so the glow rises naturally behind the 3D device without hard edges:

1. **Outer Luminous Field** (`h-[60%] min-h-[340px]`):
   `radial-gradient(125% 92% at 50% 108%, #006632 0%, #008c45 24%, #57c937 44%, #afec2c 60%, #dffbc0 76%, rgba(255,255,255,0) 90%)`
2. **Deep Anchor Core** (`h-[44%] min-h-[240px] opacity-90`):
   `radial-gradient(92% 70% at 50% 108%, #004d25 0%, #007036 28%, #008c45 55%, transparent 84%)`

### Elevation & Shadows

- **Primary Pill CTA**: `shadow-[0_14px_38px_-10px_rgba(0,77,37,0.42)]` with subtle scale micro-interaction (`hover:scale-[1.025]`, `active:scale-[0.985]`).
- **Download Dialog**: `rounded-3xl`, `border-[#dffbc0]`, backdrop `bg-[#004d25]/55 backdrop-blur-sm`.

---

## 5. Iconography

- **Icon Family**: Cupertino Icons (`framework7-icons` vector paths), rendered as inline `<svg>` with `aria-hidden="true"` for zero extra font requests and exact color control.
- **Primary Download CTA**: `arrow_down_to_line` (`20×20px`, `text-[#008c45]`).
- **Dialog Dismiss**: `xmark` (`20×20px`, inherits muted zinc / `#004d25` hover state).

---

## 6. 3D Hardware Showcase (`PixelPhoneCanvas`)

Implemented in `app/components/pixel-phone-canvas.tsx` with Three.js and dynamically imported (`ssr: false`) for optimal initial bundle weight:

- **Hardware Model**: Google Pixel 10 Pro proportions (`1.94 × 4.18` unit aspect), brushed titanium frame, right-rail power/volume buttons, bottom USB-C/speaker cutouts, frosted back glass, and detached floating camera pill visor.
- **Display Material**: Uses `public/kupass-screen.png` with `SRGBColorSpace`, `generateMipmaps: true`, `LinearMipmapLinearFilter`, `anisotropy` up to `8`, and `toneMapped: false` on `MeshPhysicalMaterial` (`color: 0x000000`, `emissiveMap`) so light-mode `#f7faee` UI elements stay sharp and unclipped by ACES tone mapping.
- **Lighting**: Studio `RoomEnvironment` PMREM + `#dffbc0` top rim light + `#afec2c` lower bounce light matching the hero dome.
- **Camera & Framing**: Full-hero `absolute inset-0 z-20` canvas with `ResizeObserver` sizing (`targetHeightFraction`: `0.62` landscape, `0.54` portrait) so idle floating bobbing (`±0.075`) and 360° pointer dragging never clip against container edges.
- **Motion & Fallbacks**: Respects `prefers-reduced-motion: reduce` (disables idle float/sway) and falls back to a styled hardware card when WebGL is unavailable.

---

## 7. Layout & Responsiveness

- **Viewport Lock**: Hero section uses `h-dvh min-h-[600px] overflow-hidden` so headline, 3D Pixel 10 Pro, CTA button, and 2-line caption remain cleanly framed above the fold from `390×844` mobile through `1280×720+` desktop with `overflow-x: 0`.
- **Keyboard & Dialog Accessibility**: Download modal exposes `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus rings (`#afec2c` / `#008c45`), backdrop dismiss, and `Escape` key closing.
