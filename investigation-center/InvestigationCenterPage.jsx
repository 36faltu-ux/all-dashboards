import { useEffect, useState } from 'react'
import {
  Activity, ArrowUpRight, BarChart3, BellRing, ChevronDown, ChevronRight,
  CircleHelp, ClipboardList, Clock3, Database, FilePlus2, FileSearch, FileText,
  Fingerprint, Folder, GitBranch, Globe2, Layers3, ListFilter, Network,
  Search, ShieldAlert, ShieldCheck, Sparkles, Users, Workflow,
} from 'lucide-react'
import heroImage from './assets/investigation-hero.png'
import worldMapImage from './assets/world-network-map.png'
import { InvestigationConnectionNote, InvestigationEmptyState } from './components/InvestigationStates.jsx'
import './styles.css'

const tools = [
  { title: 'New Investigation', description: 'Create and manage investigation cases', icon: FilePlus2, tone: 'blue' },
  { title: 'Evidence Manager', description: 'Collect, store and organize evidence', icon: Folder, tone: 'teal' },
  { title: 'Timeline Analysis', description: 'Visualize event timelines', icon: GitBranch, tone: 'red' },
  { title: 'Behavior Analytics', description: 'Analyze user and entity behavior', icon: BarChart3, tone: 'cyan' },
  { title: 'Forensic Tools', description: 'Access digital forensics tools', icon: Search, tone: 'slate' },
  { title: 'Report Generation', description: 'Generate detailed investigation reports', icon: FileText, tone: 'purple' },
]
const stats = [
  { label: 'Total Cases', icon: Folder, tone: 'blue' }, { label: 'Open Cases', icon: ShieldAlert, tone: 'red' },
  { label: 'Evidence Items', icon: Database, tone: 'teal' }, { label: 'Analyzed Endpoints', icon: Workflow, tone: 'purple' },
  { label: 'Detected Anomalies', icon: TriangleIcon, tone: 'red' },
]
const caseStatuses = ['Open', 'In Progress', 'Under Review', 'Resolved', 'False Positive', 'Others']
const anomalyTypes = ['Suspicious Login', 'Unusual File Access', 'Malware Activity', 'Data Exfiltration', 'Privilege Escalation', 'Lateral Movement', 'Others']
const evidenceTypes = ['Log Files', 'Memory Dumps', 'Network Captures', 'Disk Images', 'Registry Data', 'Email Artifacts', 'Others']
const severityTypes = ['Critical', 'Suspicious', 'Normal', 'Unknown']

function TriangleIcon(props) { return <ShieldAlert {...props} /> }
function Panel({ title, icon: Icon, action, className = '', children }) {
  return <section className={`ic-panel ${className}`}><header className="ic-panel-head"><div><Icon size={16} /><h2>{title}</h2></div>{action}</header>{children}</section>
}
function RangeSelect({ range, setRange }) {
  return <label className="ic-range"><span className="ic-sr">Select investigation time range</span><select value={range} onChange={(event) => setRange(event.target.value)}><option>This Week</option><option>Today</option><option>This Month</option><option>All Time</option></select><ChevronDown size={13} /></label>
}
function MapGraphic({ reducedMotion }) {
  return <div className="ic-map-art" role="img" aria-label="Illustrative world map with animated network transfer pathways; no activity data is connected">
    <img src={worldMapImage} alt="" />
    <svg viewBox="0 0 1774 887" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <path id="ic-route-a" d="M255 232 Q595 80 954 231" /><path id="ic-route-b" d="M390 310 Q607 176 821 267" />
        <path id="ic-route-c" d="M954 231 Q1139 164 1332 224" /><path id="ic-route-d" d="M954 231 Q1018 329 1123 374" />
        <path id="ic-route-e" d="M1123 374 Q1285 456 1545 520" /><path id="ic-route-f" d="M454 594 Q659 398 834 350" />
        <path id="ic-route-g" d="M834 350 Q1070 243 1332 224" />
      </defs>
      {!reducedMotion && <g className="ic-packets">{['a','b','c','d','e','f','g'].map((id, index) => <circle key={id} r={index % 2 ? 4 : 5} className={`ic-packet p${index}`}><animateMotion dur={`${6.8 + index * .28}s`} begin={`${-index * 1.05}s`} repeatCount="indefinite"><mpath href={`#ic-route-${id}`} /></animateMotion></circle>)}</g>}
    </svg>
  </div>
}

export default function InvestigationCenterPage({ showToast = () => {} }) {
  const [range, setRange] = useState('This Week')
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update(); query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])
  const unavailable = (name) => showToast(`${name} is waiting for the investigation service`)
  const rangeAction = <RangeSelect range={range} setRange={setRange} />

  return <div className="investigation-page">
    <section className="ic-hero" style={{ '--ic-hero-image': `url("${heroImage}")` }} aria-labelledby="ic-title">
      <div className="ic-hero-copy"><span className="ic-eyebrow"><ShieldCheck size={15} /> INVESTIGATION CENTER</span><h1 id="ic-title">Investigation Center</h1><h2>Digital Forensics · Behavior Analytics</h2><p>Investigation cases, evidence timelines, activity analysis<br className="ic-desktop" /> and anomaly visualizations.</p></div>
      <p className="ic-tagline">“Trace. Investigate. Understand.<br />A safer digital world tomorrow.”</p>
    </section>
    <section className="ic-tools" aria-label="Investigation tools">{tools.map(({ title, description, icon: Icon, tone }) => <button key={title} className={`ic-tool ${tone}`} type="button" onClick={() => unavailable(title)}><span className="ic-tool-icon"><Icon size={23} /></span><span><strong>{title}</strong><small>{description}</small></span><ChevronRight size={15} /></button>)}</section>
    <section className="ic-stats" aria-label="Investigation statistics">{stats.map(({ label, icon: Icon, tone }) => <article className="ic-stat" key={label}><span className={`ic-stat-icon ${tone}`}><Icon size={20} /></span><div><span>{label}</span><strong>—</strong><small>Waiting for backend</small></div><span className="ic-stat-more">···</span></article>)}</section>

    <div className="ic-grid">
      <Panel title="Investigation Case Status" icon={ShieldCheck} action={rangeAction} className="ic-case-status"><p className="ic-subtitle">Overview of all investigation cases</p><div className="ic-case-body"><div className="ic-donut"><span><Folder size={24} />—<small>Total Cases</small></span></div><div className="ic-legend">{caseStatuses.map((label, i) => <div key={label}><i className={`ic-dot c${i}`} /><span>{label}</span><small>—</small></div>)}</div></div></Panel>
      <Panel title="Global Activity Map" icon={Globe2} className="ic-map-panel"><p className="ic-subtitle">Global activity overview · service not connected</p><div className="ic-map-stage"><MapGraphic reducedMotion={reducedMotion} /><div className="ic-live-card"><i />Activity<strong>—</strong><small>Waiting for backend</small></div><div className="ic-map-legend">{severityTypes.map((label, index) => <span key={label}><i className={`severity-${index}`} />{label}</span>)}</div><small className="ic-map-note">Illustrative network pathways · not live activity</small></div></Panel>
      <Panel title="Recent Investigation Cases" icon={ClipboardList} className="ic-recent" action={<button className="ic-view" type="button" onClick={() => unavailable('Investigation cases')}>View all <ChevronRight size={14} /></button>}><div className="ic-table-wrap"><table><thead><tr><th>ID</th><th>Title</th><th>Severity</th><th>Status</th><th>Created</th></tr></thead><tbody><tr><td colSpan="5"><InvestigationEmptyState title="No investigation cases available" detail="Cases will appear here once the backend integration is configured." /></td></tr></tbody></table></div></Panel>
      <Panel title="Top Anomaly Types" icon={ListFilter} action={rangeAction} className="ic-anomalies"><div className="ic-bars">{anomalyTypes.map((label, i) => <div key={label}><span className={`ic-anomaly-icon a${i}`}><Activity size={13} /></span><span>{label}</span><i /><small>—</small></div>)}</div></Panel>
      <Panel title="Timeline of Investigation" icon={Clock3} action={<button className="ic-view" type="button" onClick={() => unavailable('Investigation timeline')}>View all <ChevronRight size={14} /></button>} className="ic-timeline"><InvestigationEmptyState icon={Workflow} title="No timeline events available" detail="Verified investigation events will appear here after the service is connected." /></Panel>
      <Panel title="Evidence Types" icon={Layers3} action={rangeAction} className="ic-evidence"><div className="ic-evidence-body"><div className="ic-donut evidence-donut"><span><FileSearch size={23} />—<small>Total Evidence</small></span></div><div className="ic-legend">{evidenceTypes.map((label, i) => <div key={label}><i className={`ic-dot e${i}`} /><span>{label}</span><small>—</small></div>)}</div></div></Panel>
    </div>
    <InvestigationConnectionNote />
  </div>
}
