import { useState } from 'react'
import {
  AlertTriangle, ArrowUpRight, Bug, CheckCircle2,
  ChevronDown, ChevronRight, CircleHelp, Code2, FileText,
  Gauge, Globe2, Layers3, LockKeyhole, RefreshCw, ScanSearch,
  Settings, Shield, ShieldCheck, SlidersHorizontal, Target, Workflow,
} from 'lucide-react'
import { SecurityTestingEmptyState } from './components/SecurityTestingStates.jsx'
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

function Panel({ title, icon: Icon, action, className = '', children }) {
  return <section className={`st-panel ${className}`}><header className="st-panel-header"><div className="st-panel-heading"><Icon size={16} /><h2>{title}</h2></div>{action}</header>{children}</section>
}

function RangeSelect({ value, onChange }) {
  return <label className="st-range"><span className="st-visually-hidden">Scan data time range</span><select value={value} onChange={(event) => onChange(event.target.value)}><option>This Week</option><option>Today</option><option>This Month</option><option>All Time</option></select><ChevronDown size={13} /></label>
}

export default function SecurityTestingLabPage({ showToast = () => {} }) {
  const [range, setRange] = useState('This Week')
  const unavailable = (feature) => showToast(`${feature} is waiting for the security testing service`)

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
          <div className="st-scan-visual" aria-hidden="true"><div className="st-scan-ring ring-one" /><div className="st-scan-ring ring-two" /><div className="st-scan-ring ring-three" /><div className="st-scan-core"><Shield size={28} /><LockKeyhole size={13} /></div></div>
          <div className="st-overview-summary"><div className="st-active-scans"><i />Active Scans<strong>—</strong><small>Waiting for backend</small></div><div className="st-severity-legend">{severities.map((item, index) => <span key={item}><i className={`severity-${index}`} />{item}<small>—</small></span>)}</div></div>
          <div className="st-overview-empty">No scan data available</div>
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

