# Sharma1 – VA Outreach Pro Extension

A polished Chrome extension for **LinkedIn outreach operations** tailored to virtual assistant (VA) service providers.

## Core capabilities

- Capture public LinkedIn profile details from `/in/*` pages.
- Professional lead pipeline with status + follow-up date tracking.
- Message Studio with multiple templates and tone options.
- Real-time dashboard counters (total leads, invites sent, replies).
- Lead search and CSV export for reporting.
- Subscription pricing display designed for SaaS launch:
  - **India:** ₹99/month

## Compliance-first behavior

This extension is intentionally consent-first and platform-safe:

- No auto-sending invites/messages.
- No bypassing LinkedIn controls.
- No hidden-contact scraping.
- Contact data is manual-entry only, with user consent.

## Install (Developer mode)

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this repo's `extension/` folder.

## Project structure

- `extension/manifest.json` – Manifest V3 config and permissions.
- `extension/popup.html` – Premium popup UI layout.
- `extension/popup.css` – Branded dark gradient visual system.
- `extension/popup.js` – Capture, templates, storage, stats, CSV export.
- `extension/content.js` – Reads public profile name/headline.
