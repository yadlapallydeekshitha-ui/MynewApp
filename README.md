# Law Firm — Landing Page

Static landing page for a law firm / attorney. No build step required.

**Before going live**, replace the placeholders: the firm name ("Your Law Firm"),
the phone number `(555) 555-5555` (in `index.html` and `thanks.html`), and the
practice areas to match what you actually offer. Check the footer disclaimer with
your state bar's advertising rules.

## Files
- `index.html` — the landing page
- `styles.css` — styles (dark theme, cyan / magenta / indigo accents)
- `script.js` — mobile nav, scroll reveal, footer year
- `theme.js` — Light / Dark / System theme switcher (choice saved in the browser)
- `thanks.html` — shown after the contact form is submitted
- `netlify.toml` — Netlify config (publish directory and headers)

## Deploy to Netlify
1. In Netlify, choose **Add new site → Import an existing project** and pick this repo.
2. Branch: `main`. Build command: *(leave empty)*. Publish directory: `.`
3. Deploy. The consultation form uses **Netlify Forms** and is detected automatically —
   submissions appear under **Forms** in the Netlify dashboard.

## Local preview
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000.

## Roadmap
Each phase ends with a quality check before the next one starts.

- **Phase 0 — Themes (done):** Light, Dark and System themes with a switcher in the header.
