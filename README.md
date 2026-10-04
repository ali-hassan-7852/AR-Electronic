# AR Electronics website

A complete electronics catalogue for a physical retailer. Browse, compare, select variants and quantity, and send a purchase inquiry through WhatsApp. No accounts, database, payments, cart, API routes or Server Actions.

> **Before production launch, verify all product names, model numbers, specifications, prices, warranties, stock status, images, addresses, phone numbers and delivery policies with AR Electronics.**

The catalogue ships with 24 **sample listings**, 12 categories and nine brand filters. Model identifiers ending in DEMO, prices, specifications, stock and variants are illustrative. Generated, unbranded images are not exact manufacturer product photography or actual shop photographs. Brand labels imply no authorized dealership. Discounts are supported but none are invented.

## Stack and setup

Next.js 16.3.8 (latest stable reported by npm at setup), App Router, React 19.3, TypeScript, Tailwind CSS 4, Lucide React. Node 20.9+ is required; Node 24 was used for validation. Pinning and package-lock.json make installs reproducible.

```powershell
cd D:\codex-projects\ar-electronics-website
npm install
npm run dev
```

Open http://localhost:3000. Production checks:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run start
```

Browser QA (against the running production server):

```powershell
npx playwright install chromium
npx playwright test
```

Screenshots and browser artifacts are ignored by Git. Product routes, primary pages, sitemap and robots are statically generated. The catalogue uses a Suspense boundary and URL query parameters for client-side filtering. Next Image serves optimized local images. No external image requests or remote fonts are needed.

## Architecture

- `src/app/`: route pages, root layout, metadata, robots, sitemap and favicon.
- `src/components/layout/`: Header, native-dialog Modal for search/menu/filter drawer, Footer, FloatingWhatsApp.
- `src/components/home/`: CategoryGrid, Brands, StoreSection, FAQ. Homepage composes hero, promotions, benefits and final CTA.
- `src/components/products/`: ProductCard, ProductGrid, Catalogue, ProductGallery, WhatsAppPurchase and RecentlyViewed.
- `src/components/forms/ContactWhatsAppForm.tsx`: browser-only inquiry form.
- `src/components/shared/`: Breadcrumbs, safe JsonLd and WhatsAppLink.
- `src/lib/catalogue.ts`: typed data access, filtering, sorting, price and stock logic.
- `src/lib/whatsapp.ts`: reusable, encoded WhatsApp messages and links.
- `src/lib/seo.ts`: common page metadata.
- `src/data/`: all editable business, product, category, banner, FAQ and long-form starter content.
- `public/images/`: local replacement-ready assets.
- `tests/`: functional unit checks and browser QA.

Routes: `/`, `/products`, `/products/[slug]` (24), `/categories`, `/brands`, `/about`, `/contact`, `/privacy`, `/terms`, custom 404, `/sitemap.xml`, `/robots.txt`.

## Maintain the catalogue

Edit JSON files directly and commit changes. Vercel rebuilds when the GitHub main branch changes. No admin system is required.

### Add or edit a product

In `src/data/products.json`, duplicate an existing object and give it a unique `id` and URL-safe `slug`. Change name, brand, model, categoryId, description, images, price, options, specifications, features and warranty. Set `sampleData` to false **only after verification**. Use a matching category ID from categories.json. Local image paths begin with `/images/`. `gallery` can contain multiple images; the detail page automatically supplies thumbnail controls.

Each option has `label` and `values`. Only list available variants. The current data has sample variants without separate prices. Products whose variants have different prices should use separate product listings or verified display text and a latest-price inquiry.

- Remove a product: remove its entire object; the old URL becomes a 404 after deployment.
- Change price: update `price`, set `showPrice: true`, normally leave `priceLabel: null` for consistent currency formatting. `priceLabel` is an optional custom display label and must be kept in sync with price.
- Hide price: set `showPrice: false` or `price: null`. The UI shows Contact for Latest Price, never Rs. 0.
- Real discount: set `oldPrice` only when the previous price is genuine and higher than price. The UI displays the previous price without invented discount claims.
- Out of stock: set `inStock: false`, `outOfStock: true`, `lowStock: false`, `onOrder: false`. The CTA becomes Ask About Availability.
- Low stock: set `inStock: true`, `lowStock: true`, `outOfStock: false`, `onOrder: false`.
- On order: set `onOrder: true`, `inStock: false`, `outOfStock: false`, `lowStock: false`.
- Regular stock: set `inStock: true` and all other stock flags false.
- New / featured: update `newArrival`, `featured`, `popular`, and the verified `addedAt` date used for newest sorting.

### Categories, brands and promotions

Add a category object in `categories.json` with unique id, name, description and local image. Assign products to that category. Product counts are calculated automatically. Brands are derived from product data; adding a product from a new brand adds a useful filter automatically. No brand logos are bundled.

Edit `banners.json` for promotional heading, text, local image, link and theme. Edit `faqs.json` for accordion content. Edit `content.json` for the hero, about and starter legal content. Homepage editorial headings live in the homepage component; all business identities and contact details come from JSON.

### Business and WhatsApp

Edit `business.json`: business name, legal name, tagline, description, WhatsApp, phone, email, address, hours, currency, siteUrl, notices, map link and socials. The number is normalized to digits when generating wa.me links. Use country code plus number (e.g. 92...) without the local leading zero after the country code. Never enter credentials in JSON.

Set `googleMapsUrl` to the verified shop pin URL. Until supplied, buttons ask for directions through WhatsApp rather than open an invented location. Social links are hidden until real URLs are provided. Update the address and hours in this file; contact, store and footer update together.

`siteUrl` must match the **actual deployment domain**. Product inquiry clicks use the current browser origin and route so a preview links back to its actual host. Server-rendered links and all SEO canonical/sitemap URLs use siteUrl. There is no assumption that the requested domain is owned or available.

### Demo and SEO safeguards

`isDemo: true` displays a visible demo notice, marks pages noindex/nofollow and blocks crawling in robots. `publishStructuredData: false` suppresses LocalBusiness, Product and FAQ rich-data claims. Breadcrumb schema remains descriptive. Before launch, verify content, replace images and contacts, then set isDemo false and publishStructuredData true. Individual demo products must also have sampleData false before Product schema is published. Product schema contains no fabricated ratings, reviews or offers. Confirmed prices and stock remain in visible UI; no offer claim is generated automatically.

Review all FAQ and legal content before changing these flags. Privacy and terms are editable starter content, not legal advice. Once verified, metadata, Open Graph, Twitter cards, canonical URLs, sitemap, LocalBusiness, FAQ and product schema use business and product data. Update siteUrl before deploying.

## Image and branding replacements

All final images live locally under public/images. Generated source prompts and asset provenance are in ASSETS.md.

Recommended sizes:

| Asset | Recommended | Current demo |
| --- | --- | --- |
| Product / gallery | 1000 x 1000 WebP, white backdrop | 600 x 600 |
| Category | 400 x 400 | 600 x 600 |
| Hero | 1920 x 1080, products right, copy space left | 1672 x 941 |
| Promotional appliance | 600 x 600, white backdrop | 600 x 600 |
| Store interior/exterior | 1600 x 900 | 1672 x 941 |
| Social share | 1200 x 630 | 1200 x 630 |

Replace assets at their existing paths or change the corresponding JSON paths. Use actual product photos with permission. The two listings in each category currently share a category illustration; these do not represent exact models. Replace each product/gallery with its own verified imagery. Add additional gallery paths for alternate views.

The temporary logo is text in Header/Footer plus the simple AR mark. Replace the Header logo with a local Next Image asset and retain its accessible home link. Replace `src/app/icon.svg` for the favicon and `public/images/branding/social.webp` for sharing. A copy of the mark is in public/images/branding/logo-mark.svg. Change the CSS variables at the top of globals.css for navy, lime, green, text, surface and border colors.

## WhatsApp flow

`createWhatsAppUrl()` strips non-digits and uses encodeURIComponent. `createProductPurchaseMessage()` includes the product, brand/model when present, display price, quantity, nonempty selected options and product URL. Cards create shorter quick inquiries. Product detail CTA uses current values and the actual browser URL. It asks to confirm price, stock, warranty and delivery/pickup. All links use a new tab with noopener/noreferrer. The contact form validates required name/message, then opens an inquiry for the customer to review and send. Nothing is sent automatically or stored by a backend.

Recently viewed identifiers are saved locally, gracefully handling unavailable storage. Native dialogs trap keyboard focus, support Escape, restore focus and lock background scrolling. Mobile WhatsApp floats as a compact button and bottom padding leaves clearance for content.

## GitHub and Vercel deployment

GitHub/Vercel account authentication is not configured in this environment. No public repository or deployment URL is claimed. The code is prepared for a standard Vercel Next.js Git integration.

1. Sign into GitHub and create an **empty** repository named `ar-electronics-website`; do not initialize a README or .gitignore.
2. Copy the repository URL. From this project folder:

```powershell
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ar-electronics-website.git
git push -u origin main
```

Authenticate using Git Credential Manager/browser when prompted. If origin already exists, use git remote set-url origin with the correct URL. The local initial commit is prepared by the agent if QA succeeds.

3. Sign into Vercel, choose **Add New → Project → Import Git Repository**, authorize GitHub access and select this repository.
4. Framework preset: Next.js. Root directory: repository root. Install: npm install (or npm ci). Build: npm run build. Leave output directory at the Next.js default. Choose Node 24.x if offered, otherwise a supported Node version >=20.9. No environment variables or database services are required.
5. Deploy. Use only the URL Vercel actually assigns. Set business.json siteUrl to that URL while the desired domain is unavailable, commit and push; Vercel automatically redeploys the main branch.
6. Verify all route types, local images, filters, product selection, quantity, WhatsApp messages, contact form, mobile navigation, robots, sitemap and 404 on production. Run the browser suite against production by overriding baseURL in playwright.config.ts if desired.
7. Subsequent edits: run checks, git add ., git commit -m "Update catalogue", git push. Main pushes trigger production deployments; PRs can receive preview deployments through Vercel.

## Connect www.ARElectronics.com

Ownership and availability are **not confirmed**. After ownership and DNS access are verified:

1. In Vercel Project → Settings → Domains, add `arelectronics.com` and `www.arelectronics.com`.
2. Choose your canonical host (the brief requests www) and configure the other host to redirect to it.
3. At the domain registrar/DNS provider, enter the **exact current records shown by Vercel** for both hosts, including any required verification TXT record. Do not assume a fixed IP/CNAME, as Vercel's assigned values may vary. Remove conflicting records only after checking their purpose; preserve mail records.
4. Wait for Vercel to mark domain verification and TLS active. Test both HTTPS hosts and the redirect.
5. Update business.json siteUrl to https://www.arelectronics.com, commit and push. Check canonical URLs, sitemap, social cards and WhatsApp links.
6. After client content verification, disable demo mode and enable confirmed structured data. Submit the verified sitemap through your chosen search-engine webmaster tool.

No payment gateway, nationwide delivery, manufacturer warranty, authorized dealer status, domain ownership or production publishing is assumed.
