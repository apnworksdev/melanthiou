# Μεγάλη Μελανθίου

One-page static landing. Publish the `public/` folder on Netlify. No build command.

## Local preview

```bash
npx netlify-cli dev
```

or:

```bash
python3 -m http.server --directory public 8888
```

## Deploy

1. Push to GitHub and import the repo in Netlify.
2. Publish directory: `public`.
3. Replace `https://melanthiou.netlify.app` with the production domain in `public/index.html`, `public/robots.txt`, and `public/sitemap.xml`.
4. Submit `/sitemap.xml` in Google Search Console.

To recreate a similar landing **without** YouTube or Plyr, see [AGENT.md](AGENT.md).
