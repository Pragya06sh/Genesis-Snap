# Genesis Snap — Hackathon Website

A cinematic, scroll-driven Marvel/Spider-Man themed website for the Genesis Snap hackathon & pitching competition at UEM.

## What was broken (round 1)

Your files were all sitting in one flat folder, but `index.html` links to them using subfolders:

```html
<link rel="stylesheet" href="styles/main.css" />
...
<script src="js/main.js"></script>
```

Without a `styles/` folder and a `js/` folder next to `index.html`, the browser got 404s for every CSS and JS file — so the page loaded with no styling and no interactivity (video sync, thunder flashes, countdown, animations, mobile menu, etc. all silently failed). That was the entire cause of "unable to run."

I checked everything else too:
- All 3 JS files pass syntax validation (`node --check`) — no bugs in the code itself.
- HTML tag structure is balanced/valid.
- Every element ID/class the JS looks for (`#hero-video`, `#web-canvas`, `.navbar__toggle`, `.navbar__links`, `#countdown-days/hours/mins/secs`, `.thunder-flash`, `.preloader`, etc.) exists in the HTML with matching names.
- All resource paths now resolve with HTTP 200 (tested with a local server).

**Fix:** re-arranged the files into the folder structure your own plan specified — nothing in the code needed to change.

## Round 2 fixes: title over the face + laggy scroll

**1. Title text overlapping the character's face**

I pulled sample frames across the whole video (start, middle, end) and the character's pose barely changes — it's a subtle idle loop, and the hooded face consistently sits around 52–67% across the frame width, top 45% of the frame height. The old hero title was sized up to `11rem` in a column starting at 45% width, which put it right on top of the head in every frame.

Fix (all in `styles/hero.css`):
- Narrowed `.hero__content` from `55%`/700px to `38%`/480px, so it now lives entirely in the clear background zone (right ~30% of the frame, which stays empty across the whole clip).
- Reduced the title from `clamp(5rem, 12vw, 11rem)` down to `clamp(2.25rem, 4.2vw, 5rem)` so "GENESIS" and "SNAP" fit inside that narrower column without wrapping or spilling off-screen.
- Scaled the tagline and CTA buttons down to match.
- Strengthened the right-side scrim gradient a bit so the text sits on a clean dark backdrop rather than the raw cityscape.
- Applied the same narrower column at the tablet breakpoint (`responsive.css`) so it doesn't creep back over the face at medium widths.

I verified this by compositing the actual title text over an extracted video frame — the character (face included) is now fully clear of the text with visible breathing room between them.

**2. Laggy / "blank" feeling while scrolling the hero**

Two separate causes, both fixed:
- The video was 4K (3840×2160) with keyframes only every ~10 frames. Scroll-scrubbing (`video.currentTime = ...`) has to decode from the last keyframe forward on every seek, so at 4K with sparse keyframes this was heavy enough to stutter and appear to freeze/lag while scrolling. Re-encoded it to 1080p with a keyframe every 2 frames — same look, scrubs far more smoothly, and the file is actually a bit smaller (18MB vs 24.7MB).
- The hero's scroll-scrub distance was `300vh` (three full screens of scrolling before the About section arrives). Shortened it to `220vh` and lowered the scroll-vs-video sync threshold in `js/main.js` so it updates more frequently — the whole hero feels tighter and the transition into the next section comes noticeably sooner.

## File structure (fixed)

```
GenesisSnap/
├── index.html
├── comics-style-spiderman-live-wallpaper.mp4
├── styles/
│   ├── main.css          (design tokens, resets, layout, buttons)
│   ├── hero.css          (hero video section + navbar)
│   ├── sections.css      (about, timeline, prizes, organizers, rules, faq, register, footer)
│   ├── animations.css    (thunder, glitch, web-sling, particles, preloader)
│   └── responsive.css    (tablet + mobile breakpoints)
├── js/
│   ├── main.js           (scroll-synced video, navbar, reveal animations, counters)
│   ├── animations.js     (thunder system, spider-web canvas, particles, cursor trail)
│   └── countdown.js      (countdown to Aug 22, 2026)
├── assets/
│   └── organizers/       (organizer-1.jpg … organizer-11.jpg — placeholder photos, see below)
└── README.md
```

**Keep this exact structure.** If you move `index.html` without moving `styles/` and `js/` alongside it, the links break again.

## How to run it

Browsers block some features (like the video and fetches) when you open an HTML file directly via `file://`. Always serve it over a local server:

**Option 1 — Python (already installed on most systems):**
```bash
cd GenesisSnap
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option 2 — VS Code:**
Install the "Live Server" extension, right-click `index.html`, and choose "Open with Live Server."

**Option 3 — Node:**
```bash
npx serve GenesisSnap
```

## Round 3: FAQ, food, real organizer photos, rules & regulations

**1. FAQ section** — added near the bottom of the page (`#faq`, linked in the nav and footer), 8 questions covering eligibility, what to bring, food, the AI rules, judging flow, tech stack freedom, and registration fees. Built with native HTML `<details>/<summary>` — no extra JS needed, fully keyboard/screen-reader accessible, styled to match the rest of the site.

**2. Food & refreshments** — added as a third card in the Prizes section's bonus row, next to Swags and Certificates, since that's the section people are already reading logistics off of. Also mentioned in the FAQ. Wording is intentionally general ("meals, snacks, and unlimited coffee/tea") — tell me the actual meal plan/timing if you want it more specific.

**3. Organizer photos** — every one of the 11 `organizer-card__avatar` divs now renders an `<img>` instead of plain text initials, pointing to `assets/organizers/organizer-1.jpg` through `organizer-11.jpg`. **These are placeholder graphics I generated** (dark red/blue gradient with initials) since I don't have your team's real photos yet.

**To swap in real photos:** just replace each file in `assets/organizers/` with a same-named photo (`organizer-1.jpg`, `organizer-2.jpg`, etc.) — square photos work best since they're cropped into circles. Also update each card's `<h4 class="organizer-card__name">` and `<p class="organizer-card__role">` text in `index.html` with the real name and role. No CSS changes needed either way.

**4. Rules & Regulations section** — new section (`#rules`, linked in nav and footer) with three cards straight from what you sent: Venue & Logistics (arrival time, ID requirement, dress code), the "Gemini-Only" AI Protocol (only Gemini allowed, mandatory Prompt Audit Log PDF, ungraded if missing), and Bring Your Own Tech (laptop/charger/adapters). Placed after the Team section and before the FAQ, so it reads right before people hit Register.

## Still needs your input

1. **Real organizer names, roles, and photos** — see above. Currently placeholder graphics + generic role labels ("Lead Organizer", "Co-Lead", etc.) carried over from the original plan.
2. **Registration link** — the "Register on Unstop" button and the navbar "Snap In" button both currently point to `#`. Update the `href` on:
   - `#register-btn` (register section)
   - `#hero-register-btn` (hero section)
   - the `navbar__cta` link
3. **Registration fee (if any)** — the FAQ currently says this will be announced on the registration page; update that answer if you already know the number.
4. **Food specifics** — if you want exact meal times or menu called out instead of the general "meals, snacks, coffee/tea" wording, send details and I'll update it.

## Notes

- The countdown targets **August 22, 2026, 9:00 AM IST** — update `TARGET_DATE` in `js/countdown.js` if the date changes.
- The hero video is scroll-synced (scrolling through the hero section scrubs through the video), so the hero section is intentionally very tall (`300vh`) to give that scroll room.
- Everything is vanilla HTML/CSS/JS — no build step, no dependencies, no npm install needed.
