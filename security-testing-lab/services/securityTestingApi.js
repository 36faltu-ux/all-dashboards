import { apiRequest } from '../../src/lib/api.js'

/**
 * Backend paths are intentionally unset. Populate only after agreeing the
 * security testing API contract; this adapter never assumes server routes.
 */
export const SECURITY_TESTING_ENDPOINTS = Object.freeze({
  overview: null,
  activity: null,
  statistics: null,
  recentScans: null,
  vulnerabilityCategories: null,
  severityDistribution: null,
  topVulnerabilities: null,
  reports: null,
  startScan: null,
})

async function requestSecurityData(key, { signal, method = 'GET', body } = {}) {
  const endpoint = SECURITY_TESTING_ENDPOINTS[key]
  if (!endpoint) throw new Error(`Security testing endpoint "${key}" has not been configured.`)
  return apiRequest(endpoint, { method, body, signal })
}

export const fetchScanOverview = (options) => requestSecurityData('overview', options)
/** Returns real scan activity; see ScanActivityEvent in types/index.js. */
export const fetchScanActivity = (options) => requestSecurityData('activity', options)
export const fetchSecurityScanStatistics = (options) => requestSecurityData('statistics', options)
export const fetchRecentScans = (options) => requestSecurityData('recentScans', options)
export const fetchVulnerabilityCategories = (options) => requestSecurityData('vulnerabilityCategories', options)
export const fetchSeverityDistribution = (options) => requestSecurityData('severityDistribution', options)
export const fetchTopVulnerabilities = (options) => requestSecurityData('topVulnerabilities', options)
export const fetchScanReports = (options) => requestSecurityData('reports', options)
export const startSecurityScan = (scanRequest, options = {}) => requestSecurityData('startScan', { ...options, method: 'POST', body: scanRequest })

