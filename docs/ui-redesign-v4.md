# Fame Drink — Espresso Studio / product revision v4

Updated 19 October 2026. This revision implements the user's accepted reference-fusion direction in the real storefront, including the product list, detail and cart, and expands the lower homepage beyond the initial visual demo.

## Workspace and preservation

Verified application: `E:\Website + Passport Energy\energy-passport-app`, inside the exact requested folder. Stack: Next.js 16.3.6 App Router, React 19.2.8, TypeScript, Tailwind 4, Supabase. Followed AGENTS.md and installed Next image/CSS documentation. Original branch `main`, baseline `59f0bf0`; original working tree was clean. Existing task changes were preserved. No commit, push, deployment, migration, payment configuration or database write was performed.

Run: `npm run dev`; verify: `npm run lint`, `npm run build`; preview this build: `npm run start -- --hostname 127.0.0.1 --port 3014`. Port 3014 avoids old IPv4/IPv6 servers on 3001. Preview: http://127.0.0.1:3014/.

## Visual direction and reference synthesis

The selected visual is `fame-reference-fusion-v3.png`. References contributed different principles rather than copied screens: #2 supplies generous product emphasis; #3 supplies espresso/cream contrast and condensed type; #4 supplies the immersive campaign hero and outlined category lettering; #5 supplies the longer shopping/discovery/contact/footer rhythm. Starbucks/McCafé logos, unsupported branches, ratings, rewards, discounts and newsletter forms were not copied into Fame.

The result uses a cinematic Biscoff hero, large Barlow Condensed headlines supporting Vietnamese, Plus Jakarta Sans UI text, occasional Playfair italic accents, tactile copper and pistachio surfaces, isolated product photography, pill actions, arch-shaped category discovery and a large typographic footer. All headings/actions are real HTML; a generated full-page mockup is never used as a website background.

### Page coverage

- `/`: campaign hero with real catalog links and dynamic Biscoff price; four featured active products; category navigation; brand ribbon; three flavour discovery panels; Matcha and optional Passport features; three real ordering steps; fanpage contact and complete footer.
- `/menu`: all active catalog items, category counts, sticky anchor navigation, category copy, responsive product grids and cart entry. Existing category anchors are preserved.
- `/menu/[slug]`: large product art, live name/price/description/tasting notes, add to cart, delivery guidance, optional Passport prompt and four related active items prioritising the same category. Inactive products still return not-found; the fallback does not resurrect them.
- `/checkout`: empty and populated states, individual item totals, quantity/removal actions, subtotal and demo delivery fee, recipient/address/note form and actual ordering-availability warning. Desktop uses two columns; narrow layouts stack. The existing submit, validation, retry/idempotency, pending-order and storage logic is unchanged.
- Shared header/footer apply to other public routes; their data/business flows were preserved.

### Tokens

| Role | Code token/value |
| --- | --- |
| Espresso ink | `--fd-ink: #29180f` |
| Ivory paper | `--fd-paper: #f5eee1` |
| Accessible copper action | `--fd-rust: #a84321` |
| Secondary text | `--fd-muted: #6e5b4d` |
| Rules | `--fd-line: #d9c9b5` |
| Pistachio | `--fd-green: #ccd6b0` |
| Campaign copper | `#b85b32` with darker complementary surfaces |
| Display type | Barlow Condensed 700/800, `--font-display` |
| Body type | Plus Jakarta Sans, `--font-jakarta` |
| Accent type | Playfair Display, `--font-playfair` |
| Header offset | 88px desktop; 76px mobile |

Public styling is scoped under `.takeaway-site` in `src/app/(public)/storefront.css`. Four-column desktop/two-column mobile product grids retain readable product text and 44px+ actions. Content maximum width is 1440px. Major breakpoints are 1100/900/600/360px; inspected at 1440/390/320px. Admin colours remain separate. Reduced motion disables decorative transitions. Skip link, focus outlines, mobile menu Escape/focus return and meaningful headings remain functional.

## Component mapping and data rules

| Design element | Source |
| --- | --- |
| Brand navigation / mobile menu | `src/components/Header.tsx` |
| Shared product card / category surfaces | `src/components/ProductCard.tsx` |
| Product art selection | `src/lib/constants/product-art.ts` |
| Add action and announcement | `src/features/orders/AddToCartButton.tsx` |
| Persistent cart / limits | Existing `CartProvider.tsx` and `cart-model` |
| Product detail / related items | `src/app/(public)/menu/[slug]/page.tsx` |
| Cart panels and recipient form | `src/features/orders/CheckoutClient.tsx` |
| Long homepage / campaign composition | `src/app/(public)/page.tsx` |
| Footer / public layout | `src/app/(public)/layout.tsx` |

`getProductArt` substitutes cutouts only for bundled default photographs of four featured products. A custom catalog `image_url` always takes precedence. Other products keep their original photography; remote upload support remains. Product titles, prices, active state, descriptions and cart entries remain catalog-driven. Cart storage was not migrated and saved carts remain compatible. No unsupported size/milk options were introduced.

## Raster assets and prompts

Built-in ImageGen was used, followed by WebP size/format conversion with Sharp. Original generated files remain intact. Final project assets live in `public/images/campaign/`:

| Asset | File bytes | Purpose |
| --- | ---: | --- |
| `espresso-hero-v4.webp` | 121328 | Decorative text-free campaign photograph |
| `biscoff-cutout-v4.webp` | 92222 | Product cutout |
| `matcha-cutout-v4.webp` | 53012 | Product cutout |
| `peach-cutout-v4.webp` | 132012 | Product cutout |
| `mango-cutout-v4.webp` | 69234 | Product cutout |

Hero prompt: production website hero photograph, not UI; accepted mockup as lighting/composition reference and existing Biscoff photo as product reference; wide landscape; cinematic espresso brown `#29180f`, warm side lighting; exact creamy Biscoff cup on sandstone pedestal in the right 45%; quiet dark left 48% for HTML; entire cup and biscuit visible; no typography, price, logo, UI or watermark.

Cutout prompt set (one built-in call per product): clean ecommerce cutout of the exact cup in each existing photo; preserve drink appearance, colours, layers, toppings and clear-plastic geometry; fully visible centred cup with generous padding; remove beige background; transparent output; no floor, props, added leaves/fruit, text or extra ingredients; crisp neutral edges. Sources: existing `ca-phe-sot-biscoff.jpg`, `matcha-latte.jpg`, `tra-dao-luu-do.jpg`, `tra-xoai-yakult.jpg`. All four cutout outputs were verified to have alpha channels and visually inspected in the storefront. Campaign photography is illustrative artwork, not a packaging/recipe specification.

Next Image responsive sizes, local optimisation, eager main detail image and lazy lower images remain in use. The hero is prioritised. Raster art is separate from live text and controls.

## Validation and release limits

- `npm run build`: passed; TypeScript and all routes built. Existing Next middleware→proxy deprecation warning remains.
- `npm run lint`: passed.
- `node --test src/features/orders/cart.test.mjs scripts/orders-security.test.cjs`: 19/19 passed.
- Production browser matrix: home, menu, Matcha detail and empty checkout at 1440, 390 and 320px; status 200, one h1 each, metadata inspected, no horizontal overflow, broken images or browser JS errors; automated WCAG 2 A/AA, 2.1 AA and 2.2 AA scans.
- Final automated result: 15 page/state/viewport scans, zero reported accessibility violations, horizontal overflow, broken images or browser JavaScript errors. Automated scans do not certify complete WCAG compliance.
- Filled cart checked separately at those widths: two distinct items, increase quantity, reload persistence, remove item, recipient input, current ordering config and disabled submit; no order POST was sent.
- Screenshot artifacts: `v4-home-*`, `v4-menu-*`, `v4-menu-matcha-latte-*`, `v4-checkout-filled-*`; reports `v4-production-audit.json` and `v4-cart-audit.json` in the task outputs folder. Earlier `before-*` screenshots are preserved for comparison.
- Performance checks cover responsive WebP delivery, priority/lazy loading, explicit image sizing and transfer-size observations. These are local checks, not a production Lighthouse/Core Web Vitals certification.
- Online ordering currently reports `orderingAvailable: false`; checkout honestly shows unavailable and requests no payment. A real paid order/delivery flow was not exercised. No setting was changed to enable it.
- Existing private-route `noindex` policies and public title/description/canonical metadata were retained. Local canonical origin currently resolves to `http://localhost:3000` from existing configuration; set the verified production origin before publishing. No production domain was guessed or deployed.

## Figma status

Existing file: https://www.figma.com/design/8lNyWv7q6BmS5IsI9psUCf. Baseline node `2:2` remains preserved. Earlier native editorial frames `4:2` / `5:27`, foundations and component variants belong to the previous direction. **They are historical and do not represent this v4 product revision.** This iteration implemented the accepted raster art direction directly as responsive application components; v4 has not been rebuilt/synchronised into native Figma screens. Code, current browser screenshots and the mapping above are the current review source. No new Figma/library capability is claimed.
