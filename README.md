# Day Walker — Journey Replay

Track your day. Replay it in first-person 3D.

A single-page PWA that records your GPS path while you walk around, then lets you re-walk it later at 10x–500x speed from a street-level person-eye view — with 3D buildings, your waypoints, and your photos floating in the scene.

## Features

- **First-person 3D replay** — camera at human height (1.7m), 78° pitch, follows path bearing
- **Four view modes** — Walker 🚶, Drone 🚁, Top-down 🗺️, Free 🎥 — switch live
- **GPS tracking** — auto-records every ~3-5s, smooths noise, filters bad fixes
- **Waypoints with photos** — tap to mark a place, attach a photo (auto-compressed)
- **3D buildings** — OpenFreeMap building extrusions
- **History** — browse past days, replay any of them
- **Export** — JSON (clipboard/file), GPX (Strava/Google Earth), Web Share
- **Share via Gist** — optional GitHub token → upload + copy link
- **PWA** — install to home screen, works offline (cached tiles + app shell)
- **100% free stack** — no API keys required by default

## Stack

- **Map**: [MapLibre GL JS](https://maplibre.org/) + [OpenFreeMap tiles](https://openfreemap.org/) (`liberty` style)
- **3D buildings**: `fill-extrusion` on OpenFreeMap's `building` layer
- **Storage**: IndexedDB via [`idb`](https://github.com/jakearchibald/idb)
- **Fonts**: Fraunces + Inter Tight (Google Fonts)
- **No build step** — open `index.html` and you're done

## Deploy on GitHub Pages

1. Create a new repo and push these files (`index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `README.md`)
2. Go to **Settings → Pages**
3. **Source**: `Deploy from a branch` → `main` / `/ (root)` → Save
4. Wait ~1 minute. Your app is at `https://<you>.github.io/<repo>/`
5. Open it on your phone over **HTTPS** (required for Geolocation + service worker), then "Add to Home Screen"

Any static host works — Vercel, Netlify, Cloudflare Pages, your own bucket. HTTPS is the only hard requirement.

## How to use

### Daily tracking

1. Open the app in the morning → tap **Start Day**.
2. Keep the tab in the foreground (background tracking is restricted by mobile browsers).
3. As you walk, tap **📍** to mark places — name it, optionally snap a photo.
4. Tap **End Day** in the evening.

### Replay

- Tap the green **▶️** button on the home screen — instant first-person replay of today.
- Or open a past day from the **📅 Days** sheet → **Replay this journey**.

**Controls while replaying:**
- Spacebar / center button: play/pause
- ← →: skip 30s of trip
- Tap speed pill: cycle 10x / 50x / 200x / 500x
- Drag the progress thumb to scrub
- Right side: switch view mode
- 📷 (left edge): screenshot the current frame

The HUD auto-fades after ~3s while playing — tap anywhere to bring it back.

### Settings

- **Units**: km / mi
- **Track interval**: how often to sample GPS
- **Min move**: ignore points closer than X meters
- **Accuracy max**: discard points with worse-than X meters accuracy
- **Default replay speed & view**
- **GitHub token** (optional): enables `Share via Gist link` to get a sharable URL

## Notes / known limits

- Browsers throttle/suspend GPS in background tabs. For long walks, keep the screen on. Native mobile apps will always be better for true background tracking — this app trades that for "zero install, works on any phone".
- iOS Safari needs HTTPS + a user gesture before geolocation will start.
- 3D building heights depend on OpenStreetMap data — coverage varies (excellent in major cities, sparse in some areas).
- All data lives on-device in IndexedDB. Clearing site data wipes it. Use **Copy JSON** for backups.

## File layout

```
index.html       single-page app (all HTML/CSS/JS)
manifest.json    PWA manifest
sw.js            service worker (cache app shell + tiles)
icon-192.png     PWA icon (small)
icon-512.png     PWA icon (large)
```

## License

MIT.
