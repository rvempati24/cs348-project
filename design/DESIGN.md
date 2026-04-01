# Design System Strategy: The Heritage Modernist

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Clubhouse"**
This design system moves away from the sterile, "tech-first" aesthetic of standard SaaS platforms, leaning instead into the world of high-end editorial and exclusive sporting clubs. We are building a digital experience that feels like a leather-bound scorecard—tactile, prestigious, and deeply intentional.

To achieve this, we employ **Intentional Asymmetry**. Rather than perfectly centered grids, we use staggered layouts and overlapping elements (e.g., a score badge breaking the frame of a card) to create a sense of bespoke craftsmanship. We avoid "templated" layouts by leveraging high-contrast typography scales and breathing room that suggests luxury.

---

## 2. Colors: Tonal Depth & Organic Textures
Our palette is rooted in the natural landscapes of the game: forest greens, bunker creams, and trophy golds.

### The "No-Line" Rule
**Borders are strictly prohibited for sectioning.** To create visual separation, use background shifts. A section intended to stand out should move from `surface` to `surface-container-low`. The transition should feel like a change in the weight of paper, not a line drawn on it.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
*   **Base:** `surface` (#fcf9f2) — The canvas.
*   **Primary Containers:** `surface-container-low` (#f6f3ec) — For large content areas.
*   **Elevated Details:** `surface-container-highest` (#e5e2db) — For high-interaction zones.
*   **The Glass & Gradient Rule:** For hero sections or primary CTAs, use a subtle linear gradient from `primary` (#002a15) to `primary_container` (#004225) at a 155-degree angle. This adds "soul" and prevents the deep green from feeling flat or "dead" on digital screens.

---

## 3. Typography: The Editorial Edge
We utilize a pairing of **Manrope** for authoritative displays and **Plus Jakarta Sans** for high-performance utility.

*   **Display (Manrope):** Set with tight letter-spacing (-2%) to create a "sporty" but refined headline. Used for course names and hero titles.
*   **Headline (Manrope):** Bold and unapologetic. This is our "Voice of Authority."
*   **Body (Plus Jakarta Sans):** Chosen for its wider apertures and modern geometric feel, ensuring legibility during mobile use on the course.
*   **Label (Plus Jakarta Sans):** Always Uppercase with +5% letter-spacing. This evokes the feeling of premium apparel branding.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop"; we use them to create "atmosphere."

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` (#ffffff) card placed on a `surface-container-low` (#f6f3ec) background creates a sophisticated lift that feels organic.
*   **Ambient Shadows:** For floating menus or scorecards, use a "Whisper Shadow": `0px 12px 32px rgba(28, 28, 24, 0.06)`. The tint is derived from the `on-surface` color, not pure black, ensuring the shadow looks like it's cast by natural light.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline-variant` (#c0c9c0) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Use `surface-tint` with a 60% opacity and a `24px` backdrop-blur for mobile navigation bars to allow course imagery to bleed through elegantly.

---

## 5. Components

### Beli-Inspired Score Badges
*   **Structure:** Perfect circles (`rounded-full`) with a `2px` inset "Ghost Border."
*   **Visuals:** Use high-contrast "on-color" text. For a "Birdie" (Green), use `primary_fixed` with `on_primary_fixed`.
*   **Placement:** These should always "anchor" the top-right of cards, often overlapping the edge by `spacing-2` to break the grid.

### Buttons: The "Gold Standard"
*   **Primary:** `secondary` (#735c00) background with `on_secondary` text. Apply a subtle grain texture overlay to the gold to mimic brushed metal.
*   **Secondary:** `outline` (#717971) ghost button with `title-sm` typography.
*   **Shape:** `rounded-md` (0.75rem) for a modern, architectural feel.

### Refined Form Elements
*   **Sliders:** The track should use `surface-container-highest`, while the thumb is a `secondary` (Gold) circle. No borders.
*   **Inputs:** Minimalist. No bounding box—just a `surface-container-lowest` fill and a `2px` bottom-bar that animates from `outline-variant` to `secondary` on focus.

### Cards & Lists
*   **The Divider Ban:** Never use horizontal lines. Separate reviews or course listings using `spacing-6` vertical white space or a subtle shift to `surface-container-low`.

### Specialized Component: The "Hole-by-Hole" Scroller
A horizontal carousel using `surface-container-highest` for the track and `primary` for the active state, utilizing `spacing-1.5` for gap consistency to mimic a professional yardage book.

---

## 6. Do's and Don'ts

### Do
*   **Do** use extreme white space. Luxury is defined by the space you *don't* use.
*   **Do** use `secondary_fixed_dim` (Gold) sparingly. It is a highlighter, not a primary fill.
*   **Do** utilize `surface_bright` for interactive states on cards to provide a "glow" effect without shadows.

### Don't
*   **Don't** use 1px solid black borders. This immediately destroys the premium "Clubhouse" feel.
*   **Don't** use standard blue for links. Use `primary_container` with an underline offset by `2px`.
*   **Don't** crowd the Beli badges. Let the bold colors of the score communicate the sentiment without adding extra "Success/Warning" text labels.