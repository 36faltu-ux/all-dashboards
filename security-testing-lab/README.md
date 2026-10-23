# Security Testing Lab frontend integration

This dashboard reuses the shared JSON client in `src/lib/api.js`. Endpoint paths in `services/securityTestingApi.js` are deliberately unset; add only paths agreed with the backend owner. No scan data, vulnerability findings, status labels, or metrics are fabricated.

## Operations and response shapes

The adapter currently expects direct object or array responses (not an assumed `{ data: ... }` envelope). Update the adapter when the backend's actual response format is agreed.

| Function | Request | Expected response |
| --- | --- | --- |
| `fetchScanOverview` | GET | `ScanOverview` with active scan count and severity counts |
| `fetchSecurityScanStatistics` | GET | `SecurityScanStatistics` |
| `fetchRecentScans` | GET | `SecurityScanRecord[]` |
| `fetchVulnerabilityCategories` | GET | `VulnerabilityCategory[]` |
| `fetchSeverityDistribution` | GET | `SeverityCount[]` |
| `fetchTopVulnerabilities` | GET | `TopVulnerability[]` |
| `fetchScanReports` | GET | `ScanReport[]` |
| `startSecurityScan` | POST agreed request body | Agreed scan job/result response |

JSDoc response typedefs are in `types/index.js`. All operations accept an optional `AbortSignal` in their options argument. The existing `VITE_API_BASE_URL` configuration is reused; no endpoint URL, authentication flow, or scan contract is assumed here.

