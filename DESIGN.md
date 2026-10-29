# Aeris — Design System & Product Direction

Aeris is a premium, atmospheric weather experience. It replaces the original purple
gradient card with a midnight-navy product surface, a restrained cyan accent, and a
weather-aware sky that responds to the conditions in the selected city.

The design is deliberately art-directed: one large hero, calm supporting panels, generous
space, and a single accent family. It should read as a real weather product, not an AI
dashboard.

---

## 1. Product principles

1. **Weather first.** The temperature, condition, and city are the loudest elements on
   the page. Everything else supports them.
2. **Calm, not noisy.** Deep navy surfaces, one cyan accent, and condition-driven tints.
   No neon, no purple gradients, no rainbow chips.
3. **Honest data.** Never invent values. Show only what the current API plan provides and
   label forecast intervals accurately.
4. **Atmosphere over decoration.** Depth comes from layered gradients, soft glows, and
   weather-aware motion — not from arbitrary glass cards or 3D objects.
5. **Fast and resilient.** No new runtime dependencies. Every non-essential API failure
   degrades gracefully while the last good weather stays readable.
6. **Accessible by default.** Semantic landmarks, visible focus, keyboard search,
   reduced-motion support, and comfortable touch targets.

---

## 2. Brand

- **Name:** Aeris
- **Mark:** a rounded portal with a sun and cloud cut from it.
- **Voice:** concise, observant, human. "Clear skies over Chennai" rather than
  "Weather data retrieved successfully."
- **Signature:** the accent cyan is used sparingly — live indicators, focus rings,
  selected states, and one highlight per panel.

---

## 3. Color palette & semantic tokens

Tokens live in `src/index.css` on `:root`. Weather themes override the glow values via
`[data-theme]`.

| Token | Value | Use |
| --- | --- | --- |
| `--bg-0` | `#050914` | Page base |
| `--bg-1` | `#081020` | Page top |
| `--bg-2` | `#0c1830` | Elevated background |
| `--surface` | `rgba(14, 25, 46, 0.72)` | Panels |
| `--surface-strong` | `#101d35` | Inputs, raised tiles |
| `--border` | `rgba(150, 184, 230, 0.14)` | Hairlines |
| `--border-strong` | `rgba(150, 184, 230, 0.26)` | Hover / focus borders |
| `--text` | `#f3f7ff` | Primary text |
| `--text-muted` | `#a7b6cd` | Secondary text |
| `--text-dim` | `#7386a2` | Metadata |
| `--accent` | `#66e0ff` | Primary accent |
| `--accent-strong` | `#19c2ec` | Accent fill |
| `--accent-soft` | `rgba(102, 224, 255, 0.12)` | Selected chips, hovers |
| `--sun` | `#ffd37a` | Clear conditions, sunrise |
| `--rain` | `#7fc8ff` | Rain, precipitation |
| `--storm` | `#b4a5ff` | Thunder (used sparingly) |
| `--snow` | `#e4f6ff` | Snow |
| `--success` | `#7ce3b1` | Positive status |
| `--danger` | `#ff9b9b` | Errors |
| `--warning` | `#ffc96b` | Geolocation / soft warnings |

### Weather themes

| Theme | Glow A | Glow B | Accent shift |
| --- | --- | --- | --- |
| `clear-day` | warm blue | soft gold | cyan |
| `clear-night` | indigo | deep blue | periwinkle |
| `clouds` | steel blue | slate | cool grey-blue |
| `rain` | ocean blue | teal | rain blue |
| `drizzle` | ocean blue | steel | rain blue |
| `thunder` | slate violet | deep indigo | storm violet |
| `snow` | ice blue | white haze | snow blue |
| `mist` | blue grey | fog | grey blue |

The page background is three stacked layers: two large radial glows plus a vertical
midnight gradient. A very low-opacity noise/grain layer adds material without images.

---

## 4. Typography

- **Display:** Sora (600/500/400) — city, temperature, section titles.
- **Body:** Inter (400/500/600) — labels, descriptions, controls.
- **Numeric:** tabular numerals for temperatures, times, percentages, and coordinates.
- **Scale (desktop → mobile):**
  - Hero temperature: `clamp(4.25rem, 9vw, 7.5rem)`, weight 300, tracking `-0.055em`
  - Hero city: `clamp(1.75rem, 3.2vw, 2.5rem)`, Sora 500
  - Page title / section title: 1.25rem, Sora 500
  - Body: 0.95rem, Inter 400
  - Label / eyebrow: 0.7rem, uppercase, tracking `0.14em`, muted
  - Caption: 0.78rem, muted
- No oversized marketing headlines. The weather fits above the fold on a 1280×800 laptop.

---

## 5. Spacing & layout

- Base unit: 4px. Practical steps: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Container: `max-width: 1180px`, horizontal padding `clamp(16px, 3vw, 32px)`.
- Desktop hero padding: 48px. Panel padding: 24px. Mobile: 20–24px.
- Header: two-row grid on small screens (brand + actions, then search), single row from
  900px upward.
- Main stack gaps: 24px desktop, 16px mobile.
- Forecasts sit in a 12-column grid: daily forecast 7 columns, details 5 columns on
  desktop; stacked below 1024px.

### Breakpoints

| Name | Width | Behavior |
| --- | --- | --- |
| Wide | ≥ 1200px | 1180px container, 7/5 grid |
| Desktop | 1024–1199px | 1180px container, 7/5 grid |
| Small laptop / tablet | 768–1023px | Stacked forecasts, hero stays 2-column until 760px |
| Tablet portrait | 560–767px | Hero single column, hourly scroll, details 2 columns |
| Mobile | ≤ 559px | Compact header, 2×3 metrics, daily rows simplified |
| Small mobile | ≤ 379px | 2-column details retained, reduced type, no horizontal overflow |

---

## 6. Component conventions

- **Header:** translucent sticky bar, 64–72px, hairline border, brand + search + actions.
- **Search:** inset field with icon, submit button, live suggestion listbox. 44px minimum
  height. Suggestions show city, region, country and a pin.
- **Unit toggle:** segmented control, two options, `aria-pressed`, min 36×36 inside a
  44px row.
- **Location button:** icon button with tooltip text via `aria-label`.
- **Hero:** one large surface with a faint weather glow, city/date/time, temperature,
  condition, high/low and feels-like, plus an atmospheric SVG scene. No card-in-card.
- **Hourly:** horizontal snap track, 84–96px items, first item subtly accented, scroll
  buttons on hover/focus, hidden scrollbar but keyboard/touch scrollable.
- **Daily:** list rows with day, condition glyph, precipitation chance, min/max and a
  range track. The range track is the only decorative data viz.
- **Details:** 6 equal metric tiles (feels like, humidity, wind, visibility, pressure,
  sun). Tiles use a consistent icon + value + label rhythm.
- **Skeleton:** mirrors the real layout with shimmering blocks; no spinner-only screen.
- **Empty / not found / error:** a centered panel with a glyph, one sentence, and one
  clear action (retry or focus search).
- **Toasts/banners:** inline, non-blocking, `role="alert"`, above the main content.

### Surfaces

- Radius: panels 24px, tiles 18px, hourly items 16px, inputs 14px, pills 999px.
- Border: 1px hairline; hover raises to `--border-strong`.
- Shadow: `0 24px 60px -32px rgba(0,0,0,0.75)` for large panels; none for small tiles.
- Translucency: only the header and large panels use `backdrop-filter`; avoid glass
  everywhere.

---

## 7. Weather imagery

- **Icon system:** custom inline SVG (`src/components/icons.jsx`). Conditions:
  clear day/night, partly cloudy, cloudy, drizzle, rain, thunder, snow, mist.
- **Hero visual:** a large WeatherGlyph inside a CSS atmosphere: layered halos, orbit
  rings, and condition-specific particles (rain streaks, snow dots, stars). All CSS/SVG,
  no raster assets, no network cost.
- **Raster assets:** the original PNGs are retained for the favicon only. The 1.4 MB wind
  PNG and other legacy card art are not used.
- **3D:** `img2threejs` is not installed in this environment. A 3D object was evaluated
  and rejected: it would add a large dependency and render cost without improving weather
  comprehension. CSS atmosphere delivers the intended depth at a fraction of the cost.

---

## 8. Motion & interaction

- Durations: 140ms for hovers, 240ms for surfaces, 600–900ms for ambient weather loops.
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Ambient motion is slow and low-contrast: sun halo pulse, cloud drift, rain streaks,
  snow fall.
- Never animate layout-affecting properties; animate transform/opacity only.
- `@media (prefers-reduced-motion: reduce)` removes ambient loops and smooth scrolling.
- Hover feedback on buttons, suggestions, hourly items, and daily rows.
- Focus-visible: 2px accent outline, 3px offset, never removed.

---

## 9. Accessibility requirements

- Semantic landmarks: `header`, `nav`, `main`, `section` with headings, `footer`.
- Search is a combobox: `role="combobox"`, `aria-expanded`, `aria-controls`,
  `aria-activedescendant`; suggestions use `role="option"` and keyboard navigation
  (ArrowUp/Down, Enter, Escape).
- Icons are decorative (`aria-hidden`) unless they carry meaning; icon-only buttons have
  labels and tooltips.
- Live region announces successful updates and errors.
- Temperature and unit are announced together (`aria-label="29 degrees Celsius"`).
- Color contrast: primary text on navy ≥ 12:1; muted text ≥ 5:1; never rely on color
  alone for precipitation or status.
- Touch targets ≥ 44×44px.
- Horizontal overflow is clipped/contained; forecast tracks scroll internally.
- Reduced-motion, forced-colors, and keyboard-only paths are supported.

---

## 10. Responsive behavior

- **≥ 1024px:** single-row header; hero split with large atmosphere; daily 7 / details 5.
- **768–1023px:** header single row; hero split; forecasts stacked.
- **560–767px:** header two rows; hero single column with the visual behind/above the
  temperature; hourly scroll; details 3 columns or 2 depending on width.
- **≤ 559px:** hero compact; temperature stays on one line; details 2×3; daily rows drop
  the range track; hourly items 76px; search full width.
- **≤ 379px:** type scales down via clamp; 2-column metrics retained; no clipped degree
  symbol.

---

## 11. Data contract & limitations

Source: OpenWeather **Current Weather** + **5 day / 3 hour Forecast** + **Geocoding**.

- Current: temperature, feels-like, min/max, humidity, pressure, visibility, wind
  speed/gust/direction, clouds, sunrise/sunset, timezone offset, condition.
- Forecast: 40 three-hour slots → next 24 hours (8 slots) and a 5-day daily summary.
- Precipitation probability (`pop`) comes from the forecast; the current endpoint does
  not provide it, so the hero never shows a fabricated current chance of rain.
- **Hourly** is therefore labeled "3-hour intervals · next 24 hours".
- **Daily** is a 5-day forecast, not 7-day, because the free plan does not expose 7 days.
- **UV index** is not available on the current One Call plan (verified 401), so it is not
  shown. No value is invented.
- Search suggestions use the free Geocoding API.
- The API key is read from `VITE_OPENWEATHER_API_KEY`; local development uses a
  git-ignored `.env.local`. Production must set the same variable in the Render
  dashboard. The key is no longer committed in source.
