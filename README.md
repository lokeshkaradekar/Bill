# RKK Fish Bill Generator

Offline fish bill generator for **RKK Fresh Fishes · Healthy Life — From Ocean to Your Table**.

A React 18 + Vite single-page app that runs entirely offline, either in a browser or inside an
Android Sketchware-style WebView loading from `file:///android_asset/index.html`.

## Features

- Bill header, customer ("Bill To"), fish details table, and footer artwork rendered by React.
- Add unlimited fish entry rows; each row has date, fish type, quantity, rate, and a live total.
- Automatic Indian-format currency totals (subtotal, optional old balance, grand total).
- Amount paid shown below the signature with amount in words (optional toggle).
- Editable fields: Bill To, Type of Fish (single shared name), Bill No., Date (DD/MM/YYYY).
- Actions:
  - **Generate Bill** – validates input and shows the final bill.
  - **Download Image** – exports the bill sheet as a PNG.
  - **Share on WhatsApp** – opens the Android share sheet (WebView bridge) or the web share sheet.
  - **Download PDF** – exports the bill as a PDF.
  - **Print Bill** – prints via the WebView bridge or a print window.
  - **Save Bill** – persists the bill to device localStorage.
  - **New Bill** – resets every field, clears the saved bill, and shows a fresh empty bill.
- Auto-save: the current bill is saved to localStorage (debounced) under `rkk-bill-data`.
- Manual/automatic `localStorage` persistence, no backend, no network calls, fully offline.

## New Bill behavior

Pressing **New Bill**:

1. Cancels any pending auto-save so the previous bill can never be written back.
2. Replaces the entire bill state with a fresh empty bill (today's date, one empty fish row, empty
   quantity/rate/old balance/amount paid, "Show amount paid" enabled).
3. Persists the fresh bill synchronously, overwriting the old saved bill.
4. Closes the mobile preview, clears busy state, shows "New bill created.", and scrolls to top.

Reloading or reopening the app after a New Bill restores the new empty bill, never the previous one.
Note: fields left blank render as `—` / `0` in the final bill.

## Project structure

```
Bill/
├── bill.apk                     # Demo Android APK (uses the latest production build)
├── bill-generator/              # React + Vite source
│   ├── src/
│   │   ├── App.jsx              # State, persistence, actions (New Bill, Save, exports)
│   │   ├── components/          # BillEditor, BillPreview, BillHeader, BillDetailsTable, ...
│   │   ├── utils/
│   │   │   ├── calculations.js  # Formatting, row totals, amount-in-words, default bill
│   │   │   └── exportUtils.js   # PNG/PDF/share/print + Android WebView bridge
│   │   └── assets/              # Header/wave PNGs (inlined as data URIs at build time)
│   ├── public/assets/           # Legacy assets (superseded by src/assets)
│   ├── index.html
│   └── vite.config.js           # base: './', assets inlined for file:// compatibility
└── README.md
```

## Build

Prerequisites: Node.js and npm.

```bash
cd bill-generator
npm install          # react, react-dom, vite, html-to-image, jspdf, lucide-react
npm run dev          # local dev server on http://localhost:5173
npm run build        # production build -> dist/
```

`vite.config.js` sets `base: './'` and inlines imported assets as data URIs, so `dist/` works with
no server at all — copy it into an Android WebView's assets folder as `index.html` + `assets/`.

## Android / offline notes

- The app never depends on the network. Images are embedded in the bundle and `toPng`/canvas export
  uses `cacheBust: false` so the WebView never fetches `file://` resources.
- `bill.apk` is a Sketchware-style APK that wraps the current `dist/` build and loads it from
  `file:///android_asset/index.html`. Regenerate the APK whenever `dist/` changes.
- The Android WebView bridge (`window.Android`) is used only when present:
  - `window.Android.downloadImage(dataUrl, filename)` – Download Image
  - `window.Android.shareImage(dataUrl)` – Share on WhatsApp
  - `window.Android.printBill(dataUrl)` – Print Bill
  In a plain browser the app falls back to standard web APIs, so the same bundle runs everywhere.