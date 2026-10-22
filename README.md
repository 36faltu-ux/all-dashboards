# Cyber-Shield AI Dashboards

React, Vite, and Tailwind app with dashboard source and assets separated into top-level folders:

- `developer-dashboard/` — Developer Dashboard.
- `automation-dashboard/` — Automation Hub.
- `ai-command-center/` — AI Command Center.

Shared app entry points and API helpers live under `src/`; shared branding assets live under `public/shared/`. The sidebar switches between these three dashboards. Other destinations remain placeholders. No dashboard is populated with sample backend records: connected resources display empty states until the API supplies them.

All three dashboards share the hero image at `public/shared/cyber-hero.png` and the Inter font defined in `developer-dashboard/styles.css`. In the Developer Dashboard, opening the editor keeps it at the top of the workspace; Explorer, Terminal, Preview, and GitHub panels stack below it so the page can scroll instead of shrinking the editor.

## Run locally

```sh
npm install
npm run dev
```

## Backend handoff

1. Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` to the backend API origin/prefix.
2. Import `apiRequest` from `src/lib/api.js` for JSON HTTP requests. It supports methods, JSON bodies, headers, and `AbortSignal`.
3. Agree on endpoint paths, payloads, responses, authentication, and error formats with the backend owner before connecting dashboard actions. No endpoint contracts are assumed by this frontend.
4. Connect agent conversations, task lists/status, tool invocations, and agent modes in `ai-command-center/AICommandCenter.jsx` once the backend contract is defined. The page has no fake conversations, agent tasks, or usage metrics; actions show a backend-pending message.
5. Connect workflow listing/creation, schedules, execution history, metrics, and templates in `automation-dashboard/AutomationHub.jsx` when those contracts are defined.
6. Connect workspace files, editor content, terminal sessions, preview URLs, GitHub repository actions, notifications, and search in `developer-dashboard/DeveloperDashboard.jsx` after their contracts are agreed. The terminal must use a sandboxed backend.

The backend should allow the frontend's development and deployed origins through its CORS policy. The base URL is intentionally blank until the backend host and API prefix are known.

The frontend intentionally contains no API key placeholder. Variables prefixed with `VITE_` are shipped to the browser and must be treated as public configuration. Keep private API keys, OAuth client secrets, and signing keys on the backend.
