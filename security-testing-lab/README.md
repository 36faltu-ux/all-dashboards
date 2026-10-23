# Security Testing Lab frontend integration

This dashboard reuses the shared JSON client in `src/lib/api.js`. Endpoint paths in `services/securityTestingApi.js` are deliberately unset; add only paths agreed with the backend owner. No scan data, vulnerability findings, status labels, or metrics are fabricated.

## Operations and response shapes

The adapter currently expects direct object or array responses (not an assumed `{ data: ... }` envelope). Update the adapter when the backend's actual response format is agreed.

| Function | Request | Expected response |
| --- | --- | --- |
| `fetchScanOverview` | GET | `ScanOverview` with active scan count and severity counts |
| `fetchScanActivity` | GET, polled every 10 seconds while configured | `ScanActivityEvent[]` used to position progress markers on the Scan Overview visualization |
| `fetchSecurityScanStatistics` | GET | `SecurityScanStatistics` |
| `fetchRecentScans` | GET | `SecurityScanRecord[]` |
| `fetchVulnerabilityCategories` | GET | `VulnerabilityCategory[]` |
| `fetchSeverityDistribution` | GET | `SeverityCount[]` |
| `fetchTopVulnerabilities` | GET | `TopVulnerability[]` |
| `fetchScanReports` | GET | `ScanReport[]` |
| `startSecurityScan` | POST agreed request body | Agreed scan job/result response |

JSDoc response typedefs are in `types/index.js`. All operations accept an optional `AbortSignal` in their options argument. The existing `VITE_API_BASE_URL` configuration is reused; no endpoint URL, authentication flow, or scan contract is assumed here.

## Data-driven Scan Overview visualization

Set `SECURITY_TESTING_ENDPOINTS.activity` only after agreeing the scan activity route with the backend. The response should be a direct array of `{ scanId: string, progress: number, status: 'queued'|'running'|'complete'|'failed', severity?: 'critical'|'high'|'medium'|'low'|'info', updatedAt?: string }`. Markers are created only from valid service records; each marker's position follows that record's `progress` value. The active count and severity counts are derived from the same response. The UI polls every 10 seconds and aborts the in-flight request when the dashboard unmounts. When the endpoint is unset, it shows a stationary empty scan diagram with a waiting-for-backend message; it does not imply a scan is running. `prefers-reduced-motion` disables movement transitions.

