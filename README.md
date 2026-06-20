# Storyfied

A Chrome extension that reads the ticket you're viewing on **any** board
(GitHub Projects, Azure DevOps, Jira, Trello, …) and uses **Google Gemini** to
turn it into a clean, editable, AI-ready brief you can paste straight into an AI
coding agent.

## How it works

1. Open a ticket on your board and click the Storyfied toolbar icon.
2. A content script scrapes the visible ticket text from the page.
3. Gemini extracts the fields (title, type, priority, labels, size/points,
   status, assignee) and **"storyfies"** the description — expanding loose
   one-liners into proper requirements, or tightening verbose writeups — plus
   derives acceptance criteria. It won't invent metadata that isn't present.
4. The popup shows each field as a color-matched, editable row. Edit anything.
5. Click **Copy to clipboard** to get a tidy markdown brief ready to paste into
   an AI chat.

No board-specific API tokens are required — extraction is done from the page
text, so it works across board UIs and any level of description precision.

## Setup

```bash
npm install
npm run build      # outputs to dist/
```

Then load it in Chrome:

1. Go to `chrome://extensions`, enable **Developer mode**.
2. Click **Load unpacked** and select the `dist/` folder.
3. The options page opens on first install — paste your **Gemini API key**
   (from <https://aistudio.google.com/apikey>) and save.

For live development with HMR: `npm run dev`, then load `dist/` as above.

## Configuration (options page)

- **Gemini API key** — stored locally in `chrome.storage.local`, never sent
  anywhere except Google's API.
- **Model** — defaults to `gemini-2.5-flash`; pick any Gemini model id.
- **Extra instructions** — optional text appended to the system prompt (e.g.
  "write acceptance criteria in Gherkin").

## Project layout

```
manifest.json            MV3 manifest
vite.config.js           Vite + @crxjs/vite-plugin + React
index.html               popup entry
src/popup/               popup UI (Popup, FieldRow, css)
src/options/             options page (API key / model / prompt)
src/content/scrape.js    scrapes ticket text from the active tab
src/background/          minimal service worker
src/lib/                 gemini client, prompt, field schema, clipboard, storage
concept/                 single-page concept site (deployable to Vercel)
```

## Distribution

Everything you ship is the built `dist/` folder. Run `npm run build` first.

### 1. Just share it (unpacked / zip) — fastest

Zip the built folder and send it. The recipient unzips it and uses **Load
unpacked** (as in Setup). Good for yourself, teammates, or testers.

```bash
npm run build
cd dist && zip -r ../storyfied.zip . && cd ..
```

Note: unpacked extensions show a "Developer mode extensions" warning on each
Chrome launch, and don't auto-update. For anything beyond personal/team use,
prefer the Web Store.

### 2. Chrome Web Store — public or unlisted

The proper way to distribute, with auto-updates and no dev-mode warning.

1. Create a developer account at the
   [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   (one-time **$5** registration fee).
2. Zip `dist/` (as above) and **Upload new item**.
3. Fill in the listing: name, description, an icon set (16/32/48/128 px — add an
   `icons` block to `manifest.json`), at least one screenshot, and a privacy
   policy. Because the extension sends page text to Google's Gemini API with the
   user's own key, disclose that in the privacy section.
4. Choose **Visibility**: *Public* (anyone can find it) or *Unlisted* (only
   people with the link) — unlisted is great for a soft launch.
5. Submit for review. Approval typically takes a few hours to a few days.

Updates: bump `version` in `manifest.json`, rebuild, upload the new zip — Chrome
pushes the update to all users automatically.

### 3. Self-hosted `.crx` — private, no store

For distributing privately without the Web Store (e.g. an internal tool), you
can host a packed `.crx` plus an update manifest XML and install via an
[enterprise policy](https://developer.chrome.com/docs/extensions/how-to/distribute/install-extensions).
This is the most setup and is only worth it for managed/enterprise fleets;
otherwise use option 1 or an unlisted Web Store listing.

### Before you publish — checklist

- Add an `icons` block + icon files to `manifest.json` (currently uses Chrome's
  default placeholder).
- Confirm `permissions`/`host_permissions` are minimal — currently `activeTab`,
  `scripting`, `storage`, and the Gemini host only.
- Each user supplies their own Gemini API key on the options page; no key ships
  in the build.
