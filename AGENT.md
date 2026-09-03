# Brief: one-page static landing (no YouTube)

You are building a **new** Netlify-ready static site from this brief only. You do **not** have the original project. Do not invent a video player, YouTube embed, Plyr, or any third-party media iframe.

**Do not write a designed stylesheet.** Put only the bare minimum in CSS (`@font-face` if font files exist, maybe a simple `box-sizing` reset). Semantic HTML and class names are enough. The human will do layout, type, colour, and motion themselves.

## What to build

A single-viewport landing for a venue (bar / similar). No navigation, no extra marketing pages. Include a `404.html`.

Page structure (HTML only — do not style it):

1. One `h1` (site name).
2. An optional middle slot: static image, SVG, or empty. **Never** a video or embed.
3. A footer cluster: small logo + a short line of text (e.g. a postal code).

Ask the human (or use placeholders they can search-replace) for: name, language/`lang`, description, production URL, address, logo/fonts.

## Do not include

- YouTube, Vimeo, Plyr, or any video player
- Exhibition / “seek to time of day” logic
- Overlays to hide player chrome
- `VideoObject` JSON-LD, `og:video`, YouTube preconnects
- CSP rules for `youtube.com`, `ytimg.com`, or similar
- Large CSS (flex layouts, animations, type scales, media queries, aspect-ratio hacks, etc.)
- Google Fonts unless the human has no font files and explicitly asks

A tiny `intro.js` for staggered fade-ins is optional. Skip it unless they ask; they will likely handle motion in CSS themselves.

## Files

```
public/
  index.html
  404.html
  css/styles.css          # minimal only
  fonts/                  # if provided
  img/
    logo.svg
    favicon.svg           # same mark, transparent background
    favicon-16.png
    favicon-32.png
    apple-touch-icon.png
    icon-192.png
    icon-512.png
    og-image.png          # 1200×630: black, small logo centred
  robots.txt
  sitemap.xml
  site.webmanifest
  humans.txt
  _headers
  _redirects
netlify.toml
.gitignore
```

## SEO

On the home page: unique `title` and `description`, absolute `canonical`, `hreflang` + `x-default`, Open Graph + Twitter `summary_large_image`, favicons, web manifest.

JSON-LD `@graph`:

- Place entity (`BarOrPub` or the correct `schema.org` type) with `name`, `url`, `logo`, `image`, `address` (`PostalAddress`: `streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry`)
- `WebSite` with that entity as `publisher`
- `WebPage` with `about` / `mainEntity` pointing at the place

No `VideoObject`. `robots.txt` + `sitemap.xml` (home is enough). `404.html` with `noindex`. Use one production origin everywhere (placeholder is fine if they have not given a domain).

## Netlify

- Publish directory: `public`. No build command.
- Pretty URLs.
- Security headers: `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS.
- Strict CSP: `'self'` only for scripts, styles, fonts, images (`data:` ok). No frame hosts for video.
- Same CSP in `netlify.toml` **or** `public/_headers`, not two conflicting policies.
- `/*` → `/404.html` with status `404`.

## Done when

HTML, SEO tags, JSON-LD, Netlify config, and placeholder assets exist. CSS is a stub. No player. The page is readable unstyled.
