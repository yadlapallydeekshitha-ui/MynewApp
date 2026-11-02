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
- `login.html` — log in page with **Continue with Google** (Supabase Auth). After sign-in it shows the
  user's name and profile picture from `user_metadata`
- `auth.js` — Supabase sign-in / sign-out logic for `login.html`
- `supabase-config.js` — Supabase project URL and anon key
- `netlify.toml` — Netlify config (publish directory and headers)

## Deploy to Netlify
1. In Netlify, choose **Add new site → Import an existing project** and pick this repo.
2. Branch: `main`. Build command: *(leave empty)*. Publish directory: `.`
3. Deploy. The consultation form uses **Netlify Forms** and is detected automatically —
   submissions appear under **Forms** in the Netlify dashboard.

## Google sign-in setup
1. Put your Supabase **anon / publishable key** in `supabase-config.js`
   (Supabase → Project Settings → API).
2. Google Cloud Console → OAuth client → **Authorized redirect URIs**:
   `https://gsttkqqigmuxcnupleog.supabase.co/auth/v1/callback`
3. Supabase → Authentication → Providers → **Google**: enable it and paste the Google client ID and secret.
4. Supabase → Authentication → URL Configuration: add your site's `/login.html` URL
   (e.g. `https://your-site.netlify.app/login.html`, and `http://localhost:8000/login.html` for local testing)
   to **Redirect URLs**.

## Local preview
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000.

## Roadmap
Each phase ends with a quality check before the next one starts.

- **Phase 0 — Themes (done):** Light, Dark and System themes with a switcher in the header.
  Responsive from 320px phones through tablets to 1920px desktops.
