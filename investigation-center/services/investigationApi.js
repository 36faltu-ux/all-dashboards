import { apiRequest } from '../../src/lib/api.js'

/** Keep paths unset until an investigation-service contract is provided. */
export const INVESTIGATION_ENDPOINTS = Object.freeze({
  statistics: null,
  caseStatus: null,
  recentCases: null,
  globalActivity: null,
  anomalyTypes: null,
  timeline: null,
  evidenceTypes: null,
  evidenceItems: null,
  createCase: null,
  reports: null,
})

async function requestInvestigationData(key, { signal, method = 'GET', body } = {}) {
  const endpoint = INVESTIGATION_ENDPOINTS[key]
  if (!endpoint) throw new Error(`Investigation endpoint "${key}" has not been configured.`)
  return apiRequest(endpoint, { method, body, signal })
}

export const fetchInvestigationStatistics = (options) => requestInvestigationData('statistics', options)
export const fetchCaseStatusDistribution = (options) => requestInvestigationData('caseStatus', options)
export const fetchRecentInvestigationCases = (options) => requestInvestigationData('recentCases', options)
export const fetchGlobalActivityEvents = (options) => requestInvestigationData('globalActivity', options)
export const fetchTopAnomalyTypes = (options) => requestInvestigationData('anomalyTypes', options)
export const fetchInvestigationTimeline = (options) => requestInvestigationData('timeline', options)
export const fetchEvidenceTypeDistribution = (options) => requestInvestigationData('evidenceTypes', options)
export const fetchEvidenceItems = (options) => requestInvestigationData('evidenceItems', options)
export const createInvestigation = (payload, options = {}) => requestInvestigationData('createCase', { ...options, method: 'POST', body: payload })
export const fetchInvestigationReports = (options) => requestInvestigationData('reports', options)
