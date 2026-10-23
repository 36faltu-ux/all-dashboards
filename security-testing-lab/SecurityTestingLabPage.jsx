import { useEffect, useState } from 'react'
import {
  AlertTriangle, ArrowUpRight, Bug, CheckCircle2,
  ChevronDown, ChevronRight, CircleHelp, Code2, FileText,
  Gauge, Globe2, Layers3, LockKeyhole, RefreshCw, ScanSearch,
  Settings, Shield, ShieldCheck, SlidersHorizontal, Target, Workflow,
} from 'lucide-react'
import { SecurityTestingEmptyState } from './components/SecurityTestingStates.jsx'
import { fetchScanActivity, SECURITY_TESTING_ENDPOINTS } from './services/securityTestingApi.js'
import './styles.css'

const tools = [
  { title: 'Vulnerability Scan', description: 'Scan applications for vulnerabilities', icon: ScanSearch, tone: 'blue' },
  { title: 'Code Security Analysis', description: 'Analyze code for security issues', icon: Code2, tone: 'cyan' },
  { title: 'Dependency Check', description: 'Scan third-party libraries & packages', icon: Layers3, tone: 'cyan' },
  { title: 'Web Application Testing', description: 'Test web apps for common threats', icon: Globe2, tone: 'cyan' },
  { title: 'API Security Testing', description: 'Check API endpoints & security', icon: Workflow, tone: 'purple' },
  { title: 'Scan Reports', description: 'View and manage scan reports', icon: FileText, tone: 'purple' },
]

const stats = [
  { label: 'Total Scans', icon: ShieldCheck, tone: 'blue' },
  { label: 'Vulnerabilities Found', icon: Bug, tone: 'red' },
  { label: 'Critical Issues', icon: AlertTriangle, tone: 'red' },
  { label: 'Average Risk Score', icon: Gauge, tone: 'purple' },
  { label: 'Resolved Issues', icon: CheckCircle2, tone: 'teal' },
]

const categories = ['Injection', 'XSS', 'Authentication', 'Misconfiguration', 'Vulnerable Components', 'Others']
const severities = ['Critical', 'High', 'Medium', 'Low', 'Info']

const scanPath = 'M 150 150 A 120 120 0 1 1 149.99 150'

function ScanActivityMap({ activities, loading, error, connected, reducedMotion }) {
  const severityClass = (severity) => ['critical', 'high', 'medium', 'low', 'info'].includes(severity) ? severity : 'unknown'
  return <div className={`st-scan-visual ${activities.length ? 'has-scan-activity' : ''} ${reducedMotion ? 'reduced-motion' : ''}`} aria-label={connected ? 'Scan activity map showing backend scan progress' : 'Scan overview visualization waiting for backend'}>
    <div className="st-scan-ring ring-one" /><div className="st-scan-ring ring-two" /><div className="st-scan-ring ring-three" />
    <div className="st-scan-core"><Shield size={28} /><LockKeyhole size={13} /></div>
      {activities.length > 0 && <svg className="st-activity-orbit" viewBox="0 0 300 300" role="img" aria-label={`${activities.length} scan activity markers based on backend data`}>
      <path d={scanPath} pathLength="100" className="st-activity-track" />
      {activities.map((scan) => {
        const progress = Math.max(0, Math.min(100, Number(scan.progress) || 0))
          const angle = (progress / 100) * Math.PI * 2 - Math.PI / 2
          const x = 150 + 112 * Math.cos(angle)
          const y = 150 + 112 * Math.sin(angle)
          return <g key={scan.scanId} className={`st-activity-marker sev-${severityClass(scan.severity)}`}>
            <circle cx={x} cy={y} r="10" className="st-marker-halo" />
            <circle cx={x} cy={y} r="4.5" className="st-marker-dot" />
            <title>{`${scan.scanId}: ${scan.status}, ${progress}%${scan.severity ? `, ${scan.severity} severity` : ''}`}</title>
          </g>
      })}
    </svg>}
    <div className="st-visual-caption">{error ? 'Scan activity unavailable' : loading ? 'Loading scan activity…' : activities.length ? `${activities.length} scan${activities.length === 1 ? '' : 's'} · progress from service` : connected ? 'No active scan events' : 'Waiting for backend connection'}</div>
  </div>
}

function Panel({ title, icon: Icon, action, className = '', children }) {
  return <section className={`st-panel ${className}`}><header className="st-panel-header"><div className="st-panel-heading"><Icon size={16} /><h2>{title}</h2></div>{action}</header>{children}</section>
}

function RangeSelect({ value, onChange }) {
  return <label className="st-range"><span className="st-visually-hidden">Scan data time range</span><select value={value} onChange={(event) => onChange(event.target.value)}><option>This Week</option><option>Today</option><option>This Month</option><option>All Time</option></select><ChevronDown size={13} /></label>
}

export default function SecurityTestingLabPage({ showToast = () => {} }) {
  const [range, setRange] = useState('This Week')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [scanActivity, setScanActivity] = useState([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [activityError, setActivityError] = useState('')
  const activityConnected = Boolean(SECURITY_TESTING_ENDPOINTS.activity)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (!activityConnected) return undefined
    const controller = new AbortController()
    let timer
    let cancelled = false
    const loadActivity = async () => {
      setActivityLoading(true)
      try {
        const result = await fetchScanActivity({ signal: controller.signal })
        if (cancelled) return
        if (!Array.isArray(result)) throw new Error('Scan activity response must be an array.')
        setScanActivity(result.filter((item) => item && typeof item.scanId === 'string' && Number.isFinite(Number(item.progress)) && ['queued', 'running', 'complete', 'failed'].includes(item.status)))
        setActivityError('')
      } catch (error) {
        if (cancelled || error?.name === 'AbortError') return
        setActivityError(error instanceof Error ? error.message : 'Scan activity could not be loaded.')
      } finally {
        if (!cancelled) {
          setActivityLoading(false)
          timer = window.setTimeout(loadActivity, 10000)
        }
      }
    }
    loadActivity()
    return () => { cancelled = true; controller.abort(); window.clearTimeout(timer) }
  }, [activityConnected])

  const unavailable = (feature) => showToast(`${feature} is waiting for the security testing service`)
  const activeScansCount = scanActivity.filter((scan) => scan.status === 'queued' || scan.status === 'running').length
  const severityCounts = scanActivity.reduce((counts, scan) => {
    if (scan.severity && ['critical', 'high', 'medium', 'low', 'info'].includes(scan.severity)) counts[scan.severity] += 1
    return counts
  }, { critical: 0, high: 0, medium: 0, low: 0, info: 0 })

  return <div className="security-testing-page">
    <section className="st-hero" aria-labelledby="st-heading">
      <div className="st-hero-copy"><span className="st-eyebrow"><ShieldCheck size={15} /> SECURITY TESTING LAB</span><h1 id="st-heading">Security Testing Lab</h1><h2>Secure Application · Vulnerability Detection</h2><p>Authorized vulnerability scans, code security analysis, dependency checks and findings.</p></div>
      <p className="st-tagline">Scan. Analyze. Secure.<br />Build safer applications<br />tomorrow.</p>
    </section>

    <section className="st-tools" aria-label="Security testing tools">{tools.map(({ title, description, icon: Icon, tone }) => <button className={`st-tool-card ${tone}`} key={title} type="button" onClick={() => unavailable(title)}><span className="st-tool-icon"><Icon size={23} /></span><span className="st-tool-copy"><strong>{title}</strong><small>{description}</small></span><ChevronRight size={16} className="st-tool-arrow" /></button>)}</section>

    <section className="st-stat-grid" aria-label="Security scan statistics">{stats.map(({ label, icon: Icon, tone }) => <article className="st-stat-card" key={label}><span className={`st-stat-icon ${tone}`}><Icon size={20} /></span><div className="st-stat-copy"><span>{label}</span><strong>—</strong><small>Waiting for backend</small></div><span className="st-stat-menu" aria-hidden="true">···</span></article>)}</section>

    <div className="st-dashboard-grid">
      <Panel title="Scan Overview" icon={Globe2} className="st-overview-panel">
        <p className="st-subtitle">Security scan results across applications</p>
        <div className="st-overview-body">
          <ScanActivityMap activities={scanActivity} loading={activityLoading} error={activityError} connected={activityConnected} reducedMotion={reducedMotion} />
          <div className="st-overview-summary"><div className="st-active-scans"><i className={activeScansCount ? 'connected' : ''} />Active Scans<strong>{activityConnected && !activityError ? activeScansCount : '—'}</strong><small>{activityError ? 'Service request failed' : activityConnected ? 'Updated from scan service' : 'Waiting for backend'}</small></div><div className="st-severity-legend">{severities.map((item, index) => <span key={item}><i className={`severity-${index}`} />{item}<small>{activityConnected && !activityError ? severityCounts[item.toLowerCase()] : '—'}</small></span>)}</div></div>
          {activityError && <div className="st-activity-error" role="status">{activityError}</div>}
        </div>
      </Panel>

      <Panel title="Recent Scans" icon={RefreshCw} className="st-recent-panel" action={<button type="button" className="st-view-all" onClick={() => unavailable('Scan history')}>View all <ChevronRight size={14} /></button>}>
        <div className="st-table-wrap"><table className="st-table"><thead><tr><th>Time</th><th>Application</th><th>Scan Type</th><th>Status</th><th>Vulnerabilities</th><th>Risk</th></tr></thead><tbody><tr><td colSpan="6"><SecurityTestingEmptyState title="No scan records available" detail="Scan history will appear here once the backend integration is configured." /></td></tr></tbody></table></div>
      </Panel>

      <Panel title="Vulnerability Categories" icon={Settings} className="st-categories-panel" action={<RangeSelect value={range} onChange={setRange} />}>
        <div className="st-category-content"><div className="st-empty-donut" aria-label="No vulnerability category data"><span>—<small>Total Issues</small></span></div><div className="st-category-legend">{categories.map((item, index) => <div key={item}><i className={`category-${index}`} /><span>{item}</span><small>—</small></div>)}</div></div>
      </Panel>

      <Panel title="Severity Distribution" icon={Target} className="st-severity-panel" action={<RangeSelect value={range} onChange={setRange} />}>
        <div className="st-empty-chart" role="img" aria-label="Severity distribution chart has no data"><div className="st-chart-grid"><i /><i /><i /><i /></div><div className="st-chart-baseline" />{severities.map((item, index) => <div className="st-chart-column" key={item}><span /><small>{item}</small></div>)}</div>
      </Panel>

      <Panel title="Top Vulnerabilities" icon={SlidersHorizontal} className="st-vulnerabilities-panel" action={<button type="button" className="st-view-all" onClick={() => unavailable('Top vulnerabilities')}>View all <ChevronRight size={14} /></button>}>
        <div className="st-table-wrap"><table className="st-table st-vuln-table"><thead><tr><th>#</th><th>Vulnerability</th><th>Severity</th><th>Affected</th><th>Status</th></tr></thead><tbody><tr><td colSpan="5"><SecurityTestingEmptyState title="No vulnerabilities available" detail="Vulnerability data will appear here once the backend integration is configured." /></td></tr></tbody></table></div>
      </Panel>
    </div>

    <section className="st-connection-note"><CircleHelp size={15} /><span>Security testing service not connected</span><small>Connect the backend to load verified scan results and findings.</small><button type="button" onClick={() => unavailable('Security testing connection')}>Connection details <ArrowUpRight size={13} /></button></section>
  </div>
}

