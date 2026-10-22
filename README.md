# Cyber-Shield AI Developer Dashboard

Single-screen React, Vite, and Tailwind dashboard. The editor, terminal, live preview, notifications, and GitHub controls currently use local demo behavior.

## Run locally

```sh
npm install
npm run dev
```

## Backend handoff

1. Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` to the backend API origin/prefix.
2. Import `apiRequest` from `src/lib/api.js` for JSON HTTP requests. It supports methods, JSON bodies, headers, and `AbortSignal`.
3. Agree on endpoint paths, payloads, responses, authentication, and error formats with the backend owner before connecting dashboard actions. No workflow endpoint contract is assumed in this frontend.
4. Connect workflow listing/creation, schedules, execution history, metrics, and templates in `automation-dashboard/AutomationHub.jsx` once those contracts are agreed. Until then, the hub displays empty states; action buttons point users to the missing integration.
5. Connect workspace files, editor content, terminal sessions, preview URLs, GitHub repository actions, notifications, and search in `developer-dashboard/DeveloperDashboard.jsx` after their contracts are agreed. The terminal must use a sandboxed backend.

The backend should allow the frontend's development and deployed origins through its CORS policy. The base URL is intentionally blank until the backend host and API prefix are known.

The frontend intentionally contains no API key placeholder. Variables prefixed with `VITE_` are shipped to the browser and must be treated as public configuration. Keep private API keys, OAuth client secrets, and signing keys on the backend.
