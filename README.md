# Cyber-Shield AI Developer Dashboard

Single-screen React, Vite, and Tailwind dashboard. The editor, terminal, live preview, notifications, and GitHub controls currently use local demo behavior.

## Run locally

```sh
npm install
npm run dev
```

## Backend handoff

1. Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` to the backend's API origin/prefix.
2. Import `apiRequest` from `src/lib/api.js` for JSON HTTP requests. It supports methods, JSON bodies, headers, and `AbortSignal`.
3. Agree on endpoint paths, payloads, responses, authentication, and error formats with the backend owner before connecting dashboard actions.
4. Replace the local demo handlers in `src/App.jsx` when their corresponding backend contracts are ready:
   - `runCommand`: terminal is simulated; real command execution needs a separately designed, sandboxed backend or WebSocket.
   - `connected` and GitHub action buttons: connection state is simulated; use a backend OAuth flow and keep OAuth secrets server-side.
   - `projectUrl` and `refreshCount`: preview is rendered locally in the dashboard; it is not connected to a preview service.
   - `notificationsOpen`: notification items are static demo content.
   - `handleGlobalSearch`: searches the displayed file names; it does not call an AI/search service.

The backend should allow the frontend's development and deployed origins through its CORS policy. The base URL is intentionally blank until the backend host and API prefix are known.

The frontend intentionally contains no API key placeholder. Variables prefixed with `VITE_` are shipped to the browser and must be treated as public configuration. Keep private API keys, OAuth client secrets, and signing keys on the backend.
