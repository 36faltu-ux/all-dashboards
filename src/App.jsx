import { useMemo, useState } from 'react'
import {
  Bell, Check, ChevronDown, ChevronRight, CircleHelp,
  Code2, Crown, ExternalLink, FileCode2, FileJson, FilePlus2,
  FileText, Folder, FolderOpen, GitBranch, Github, House, LayoutDashboard,
  Maximize2, Menu, MoreVertical, Network, Play, Plus, Radio,
  RefreshCw, Search, Settings, Shield, ShieldAlert, ShieldCheck, Sparkles,
  Terminal, Trash2, UserRound, X, Zap,
} from 'lucide-react'

const initialFiles = {
  'App.jsx': `import React from 'react';\nimport Navbar from './components/Navbar';\nimport './index.css';\n\nfunction App() {\n  return (\n    <div className="min-h-screen bg-gray-950 text-white">\n      <Navbar />\n      <main className="p-6">\n        <h1 className="text-3xl font-bold text-cyan-400">\n          Welcome to Cyber-Shield AI\n        </h1>\n        <p className="text-gray-400 mt-2">\n          Build secure applications with AI assistance.\n        </p>\n      </main>\n    </div>\n  );\n}\n\nexport default App;`,
  'Navbar.jsx': `import React from 'react';\n\nexport default function Navbar() {\n  return (\n    <nav className="border-b border-cyan-950">\n      <span className="font-bold text-cyan-300">CYBER-SHIELD AI</span>\n      <div className="nav-links">\n        <a href="#home">Home</a>\n        <a href="#features">Features</a>\n        <a href="#about">About</a>\n        <button>Sign in</button>\n      </div>\n    </nav>\n  );\n}`,
  'index.css': `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n:root {\n  color-scheme: dark;\n  font-family: Inter, sans-serif;\n}\n\nbody { margin: 0; background: #030b11; }\nbutton { cursor: pointer; }`,
  'index.html': `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Cyber-Shield AI</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.jsx"></script>\n  </body>\n</html>`,
  'README.md': `# Cyber-Shield AI workspace\n\nA secure development workspace built with React and Vite.\n\n## Getting started\n\nRun npm install, then npm run dev to start the local preview.`,
  'package.json': `{"name":"my-project","version":"1.0.0","scripts":{"dev":"vite","build":"vite build"},"dependencies":{"react":"^18.3.1","vite":"^6.0.0"}}`,
  'vite.config.js': `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({ plugins: [react()] });`,
}

const tree = [
  { id: 'project', label: 'my-project', type: 'folder', depth: 0, open: true },
  { id: 'src', label: 'src', type: 'folder', depth: 1, open: true },
  { id: 'components', label: 'components', type: 'folder', depth: 2, open: true },
  { id: 'Navbar.jsx', label: 'Navbar.jsx', type: 'react', depth: 3 },
  { id: 'Dashboard.jsx', label: 'Dashboard.jsx', type: 'react', depth: 3 },
  { id: 'App.jsx', label: 'App.jsx', type: 'react', depth: 2 },
  { id: 'pages', label: 'pages', type: 'folder', depth: 2, open: false },
  { id: 'assets', label: 'assets', type: 'folder', depth: 2, open: false },
  { id: 'index.css', label: 'index.css', type: 'css', depth: 2 },
  { id: 'public', label: 'public', type: 'folder', depth: 1, open: true },
  { id: 'index.html', label: 'index.html', type: 'html', depth: 2 },
  { id: 'backend', label: 'backend', type: 'folder', depth: 1, open: false },
  { id: 'README.md', label: 'README.md', type: 'markdown', depth: 1 },
  { id: 'package.json', label: 'package.json', type: 'json', depth: 1 },
  { id: 'vite.config.js', label: 'vite.config.js', type: 'js', depth: 1 },
]

const navItems = [
  { title: 'Main Dashboard', subtitle: 'Command Center', icon: House },
  { title: 'AI Command Center', subtitle: 'AI Assistant & Agents', icon: Sparkles, color: 'cyan' },
  { title: 'Automation Hub', subtitle: 'Intelligent Automation', icon: Network, color: 'cyan' },
  { title: 'Threat Intelligence', subtitle: 'Detection & Fraud', icon: ShieldAlert, color: 'red' },
  { title: 'Security Testing Lab', subtitle: 'Secure Apps & Vulnerabilities', icon: ShieldCheck, color: 'blue' },
  { title: 'Identity & Network', subtitle: 'Access, Zero Trust & Privacy', icon: Radio, color: 'cyan' },
  { title: 'Investigation Center', subtitle: 'Digital Forensics & Analytics', icon: Search, color: 'blue' },
  { title: 'AI Defense & Response', subtitle: 'Guardrails & Incident Response', icon: Shield, color: 'red' },
  { title: 'Developer Dashboard', subtitle: 'Coding Workspace', icon: Code2, color: 'cyan', active: true },
]

const tools = [
  { title: 'Code Editor', caption: 'Write and edit code\nwith AI assistance', icon: Code2, color: 'cyan', target: 'editor' },
  { title: 'Project Builder', caption: 'Create and manage\nyour projects', icon: Folder, color: 'sky', target: 'explorer' },
  { title: 'Terminal', caption: 'Run commands\nand test locally', icon: Terminal, color: 'pink', target: 'terminal' },
  { title: 'Live Preview', caption: 'See your web app\nin real-time', icon: LayoutDashboard, color: 'blue', target: 'preview' },
  { title: 'GitHub Integration', caption: 'Connect, push and\nmanage repositories', icon: Github, color: 'white', target: 'github' },
]

function IconButton({ label, children, onClick, className = '' }) {
  return <button className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick}>{children}</button>
}

function FileIcon({ type }) {
  if (type === 'folder') return <Folder size={15} className="file-folder" fill="currentColor" />
  if (type === 'react') return <AtomIcon />
  if (type === 'css') return <span className="file-badge css-badge">3</span>
  if (type === 'html') return <span className="file-badge html-badge">5</span>
  if (type === 'json') return <FileJson size={15} className="json-icon" />
  if (type === 'markdown') return <FileText size={15} className="markdown-icon" />
  return <FileCode2 size={15} className="js-icon" />
}

function AtomIcon() {
  return <span className="react-mark">✿</span>
}

function HighlightedCode({ value }) {
  return value.split('\n').map((line, index) => (
    <div className="code-line" key={`${index}-${line.slice(0, 16)}`}>
      <span className="line-number">{index + 1}</span>
      <span className="source-code">{colorize(line || ' ')}</span>
    </div>
  ))
}

function colorize(line) {
  const parts = line.split(/(import|from|export|default|function|return|const|React|Navbar|App|main|className|"[^"]*"|'[^']*'|\b(?:true|false|null)\b)/g)
  return parts.map((part, index) => {
    let cls = ''
    if (/^(import|from|export|default|function|return|const)$/.test(part)) cls = 'syntax-pink'
    else if (/^(React|Navbar|App)$/.test(part)) cls = 'syntax-cyan'
    else if (/^(main|className)$/.test(part)) cls = 'syntax-blue'
    else if (/^(".*"|'.*')$/.test(part)) cls = 'syntax-green'
    else if (/^(true|false|null)$/.test(part)) cls = 'syntax-orange'
    return <span className={cls} key={index}>{part}</span>
  })
}

function App() {
  const [activeFile, setActiveFile] = useState('App.jsx')
  const [openFiles, setOpenFiles] = useState(['App.jsx', 'Navbar.jsx', 'index.css'])
  const [files, setFiles] = useState(initialFiles)
  const [editing, setEditing] = useState(false)
  const [openFolders, setOpenFolders] = useState(new Set(['project', 'src', 'components', 'public']))
  const [command, setCommand] = useState('')
  const [terminalLines, setTerminalLines] = useState([
    { text: 'PS E:\\cyber-shield> npm run dev', tone: 'muted', emphasis: 'npm run dev' },
    { text: '  > my-project@1.0.0 dev', tone: 'plain' },
    { text: '  > vite', tone: 'plain' },
    { text: '', tone: 'plain' },
    { text: '  VITE v5.0.0    ready in 520 ms', tone: 'green' },
    { text: '', tone: 'plain' },
    { text: '  ➜  Local:    http://localhost:3000/', tone: 'blue' },
    { text: '  ➜  Network:  http://192.168.1.5:3000/', tone: 'blue' },
    { text: '  ➜  press h to show help', tone: 'muted' },
  ])
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [connected, setConnected] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [projectUrl, setProjectUrl] = useState('http://localhost:3000')
  const [newFileCount, setNewFileCount] = useState(0)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const lineCount = useMemo(() => (files[activeFile] || '').split('\n').length, [files, activeFile])
  const visibleTree = useMemo(() => {
    const items = [...tree, ...Array.from({ length: newFileCount }, (_, index) => {
    const label = `NewComponent${index ? index + 1 : ''}.jsx`
    return { id: label, label, type: 'react', depth: 3 }
    })]
    return items.filter((file) => {
      if (search && !file.label.toLowerCase().includes(search.toLowerCase())) return false
      const fileIndex = items.indexOf(file)
      return Array.from({ length: file.depth }, (_, depth) => items.slice(0, fileIndex).filter((item) => item.type === 'folder' && item.depth === depth).at(-1)?.id).every((folder) => !folder || openFolders.has(folder) || search)
    })
  }, [search, openFolders, newFileCount])

  const showToast = (message) => {
    setToast(message)
    window.clearTimeout(showToast.timer)
    showToast.timer = window.setTimeout(() => setToast(''), 2800)
  }

  const openFile = (name) => {
    if (!files[name]) {
      if (name.endsWith('.jsx')) setFiles((current) => ({ ...current, [name]: `import React from 'react';\n\nexport default function ${name.replace('.jsx', '')}() {\n  return <div className="workspace-panel">\n    <h1>New secure component</h1>\n  </div>;\n}` }))
      else if (name === 'package.json') setFiles((current) => ({ ...current, [name]: initialFiles['package.json'] }))
      else setFiles((current) => ({ ...current, [name]: `// ${name}\n` }))
    }
    setActiveFile(name)
    setOpenFiles((current) => current.includes(name) ? current : [...current, name])
    setEditing(false)
  }

  const closeFile = (event, name) => {
    event.stopPropagation()
    const next = openFiles.filter((file) => file !== name)
    setOpenFiles(next)
    if (activeFile === name && next.length) setActiveFile(next[next.length - 1])
    else if (!next.length) setActiveFile('')
  }

  const runCommand = (event) => {
    event.preventDefault()
    const value = command.trim()
    if (!value) return
    let result
    if (value === 'clear' || value === 'cls') {
      setTerminalLines([])
      setCommand('')
      return
    }
    if (value === 'npm run dev') result = [{ text: 'VITE v6.0.0  ready in 420 ms', tone: 'green' }, { text: '➜  Local:  http://localhost:5173/', tone: 'blue' }]
    else if (value === 'npm run build') result = [{ text: '> my-project@1.0.0 build', tone: 'plain' }, { text: '✓ built successfully in 1.24s', tone: 'green' }, { text: 'dist/  assets/  index.html', tone: 'muted' }]
    else if (value === 'help' || value === 'h') result = [{ text: 'Available demo commands: npm run dev · npm run build · clear · help', tone: 'muted' }]
    else if (value.startsWith('echo ')) result = [{ text: value.slice(5), tone: 'plain' }]
    else if (value.startsWith('cd ') || value === 'pwd') result = [{ text: 'E:\\cyber-shield\\my-project', tone: 'muted' }]
    else result = [{ text: `Command simulated locally: ${value}`, tone: 'orange' }, { text: 'Connect a terminal backend to execute real shell commands.', tone: 'muted' }]
    setTerminalLines((current) => [...current, { text: `PS E:\\cyber-shield> ${value}`, tone: 'muted' }, ...result])
    setCommand('')
  }

  const createFile = () => {
    const name = `NewComponent${newFileCount ? newFileCount + 1 : ''}.jsx`
    setNewFileCount((count) => count + 1)
    openFile(name)
    setOpenFolders((current) => new Set([...current, 'project', 'src', 'components']))
    showToast(`${name} created in src/components`)
  }

  const handleGlobalSearch = (event) => {
    const value = event.target.value
    setSearch(value)
    if (value && Object.keys(files).find((file) => file.toLowerCase() === value.toLowerCase())) openFile(Object.keys(files).find((file) => file.toLowerCase() === value.toLowerCase()))
  }

  const handleTool = (target) => {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (target === 'github') showToast(connected ? 'GitHub workspace is connected' : 'Connect your GitHub account to continue')
  }

  const fileClass = (file) => file === activeFile ? 'tree-file active' : 'tree-file'

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="mobile-menu-button" onClick={() => setMobileMenu((open) => !open)} aria-label="Toggle navigation"><Menu size={21} /></button>
        <div className="brand"><img src="/cyber-shield-logo.png" alt="Cyber-Shield AI" /></div>
        <label className="global-search"><Search size={18} /><input value={search} onChange={handleGlobalSearch} placeholder="Search anything... (e.g. scan a URL, analyze code, explain a threat...)" /><kbd>⌘ K</kbd></label>
        <div className="top-actions">
          <div className="notification-wrap">
            <IconButton label="Notifications" onClick={() => setNotificationsOpen((open) => !open)}><Bell size={19} /><span className="notification-dot" /></IconButton>
            {notificationsOpen && <div className="notification-popover"><strong>Security notifications</strong><p><span className="status-dot online" /> Workspace is secure</p><p><span className="status-dot warn" /> 1 dependency update available</p><button onClick={() => { setNotificationsOpen(false); showToast('You’re all caught up') }}>Mark all as read</button></div>}
          </div>
          <span className="top-divider" />
          <button className="profile" onClick={() => showToast('Shared Workspace · Demo Mode')}><span className="avatar"><UserRound size={19} /></span><span className="profile-copy"><b>Shared Workspace</b><small>Demo Mode</small></span><ChevronDown size={15} /></button>
        </div>
      </header>

      <div className="layout">
        <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
          <div className="sidebar-scroll">
            <div className="nav-list">
              {navItems.map(({ title, subtitle, icon: Icon, color, active }) => <button key={title} className={`nav-entry ${active ? 'selected' : ''}`} onClick={() => active ? setMobileMenu(false) : showToast(`${title} is outside this developer workspace`)}>
                <Icon className={`nav-icon ${color || 'default'}`} size={25} strokeWidth={2.1} /><span className="nav-copy"><b>{title}</b><small>{subtitle}</small></span>{active && <ChevronRight size={17} className="nav-chevron" />}
              </button>)}
            </div>
            <div className="sidebar-bottom">
              <button className="nav-entry compact" onClick={() => showToast('Workspace preferences are up to date')}><Settings size={24} className="nav-icon settings-icon" /><span className="nav-copy"><b>Settings</b><small>Preferences & Config</small></span></button>
              <button className="nav-entry compact" onClick={() => showToast('Help center is coming soon')}><CircleHelp size={24} className="nav-icon help-icon" /><span className="nav-copy"><b>Help & Support</b><small>Documentation</small></span></button>
              <button className="plan-card" onClick={() => showToast('Pro plan is active')}><Crown size={23} fill="currentColor" /><span><b>Pro Plan</b><small>Active</small></span><ChevronRight size={17} /></button>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <section className="hero">
            <div className="hero-copy"><span className="eyebrow"><span className="status-dot online" /> DEVELOPER WORKSPACE</span><h1>Developer Dashboard</h1><p>Code. Build. Test. Deploy. All in one workspace.</p></div>
            <div className="hero-promise">Build secure.<br />Build smarter.<span className="hero-spark">✦</span></div>
            <div className="hero-bottom-line" />
          </section>

          <section className="tool-grid" aria-label="Workspace tools">
            {tools.map(({ title, caption, icon: Icon, color, target }) => <button key={title} className={`tool-card ${color}`} onClick={() => handleTool(target)}>
              <span className="tool-icon"><Icon size={29} strokeWidth={1.9} /></span><span className="tool-copy"><b>{title}</b><small>{caption}</small></span><ChevronRight size={17} className="tool-chevron" />
            </button>)}
          </section>

          <div className="workspace-grid">
            <section className="panel explorer-panel" id="explorer">
              <header className="panel-header"><div className="panel-heading"><Folder size={18} className="cyan" /><h2>Project Explorer</h2><span className="branch-pill"><GitBranch size={11} /> main</span></div><div className="panel-actions"><IconButton label="New file" onClick={createFile}><FilePlus2 size={16} /></IconButton><IconButton label="Refresh project tree" onClick={() => showToast('Project tree is up to date')}><RefreshCw size={15} /></IconButton><IconButton label="More project actions" onClick={() => showToast('Project settings · my-project')}><MoreVertical size={16} /></IconButton></div></header>
              <div className="tree-scroll">
                {visibleTree.map((file) => {
                  const isOpen = openFolders.has(file.id)
                  const isFolder = file.type === 'folder'
                  return <button key={file.id} className={`${isFolder ? 'tree-folder' : fileClass(file)} ${file.id === 'project' ? 'root-folder' : ''}`} style={{ '--depth': file.depth }} onClick={() => isFolder ? setOpenFolders((current) => { const next = new Set(current); next.has(file.id) ? next.delete(file.id) : next.add(file.id); return next }) : openFile(file.label)}>
                    <span className="tree-indent">{file.depth > 0 && <span className="indent-line" />}</span>{isFolder && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}{isFolder ? (isOpen ? <FolderOpen size={16} className="file-folder" fill="currentColor" /> : <FileIcon type="folder" />) : <FileIcon type={file.type} />}<span>{file.label}</span>{file.id === activeFile && <span className="unsaved-dot" />}
                  </button>
                })}
                {newFileCount > 0 && <div className="tree-hint"><span className="status-dot online" /> {newFileCount} new file{newFileCount > 1 ? 's' : ''} created</div>}
              </div>
              <footer className="explorer-footer"><span><GitBranch size={12} /> main</span><span><ShieldCheck size={12} /> Protected</span></footer>
            </section>

            <section className="panel editor-panel" id="editor">
              <header className="tabs-header"><div className="tabs">{openFiles.map((file) => <button key={file} className={`editor-tab ${file === activeFile ? 'current' : ''}`} onClick={() => { setActiveFile(file); setEditing(false) }}><AtomIcon /><span>{file}</span><X size={13} onClick={(event) => closeFile(event, file)} /></button>)}</div><IconButton label="Create file" onClick={createFile}><Plus size={17} /></IconButton></header>
              <div className="editor-toolbar"><span><span className="editor-status" /> {activeFile || 'No file selected'}</span><div><span>UTF-8</span><span>JSX</span><span>Prettier</span><IconButton label="Edit code" onClick={() => activeFile && setEditing((value) => !value)}>{editing ? <Check size={13} /> : <Code2 size={13} />}</IconButton></div></div>
              <div className="code-area">{editing ? <div className="edit-wrap"><div className="edit-numbers">{Array.from({ length: lineCount }, (_, index) => <span key={index}>{index + 1}</span>)}</div><textarea spellCheck="false" value={files[activeFile] || ''} onChange={(event) => setFiles((current) => ({ ...current, [activeFile]: event.target.value }))} aria-label="Edit source code" /></div> : <pre className="code-view"><code><HighlightedCode value={files[activeFile] || '// Select a file from the project tree to open it.'} /></code></pre>}</div>
              <footer className="editor-footer"><span>Ln 12, Col 15</span><span>UTF-8</span><span>JSX</span><span>Prettier</span></footer>
            </section>

            <section className="panel preview-panel" id="preview">
              <header className="panel-header"><div className="panel-heading"><span className="status-dot online" /><h2>Live Preview</h2><span className="preview-live-label">LIVE</span></div><div className="panel-actions"><IconButton label="Refresh live preview" onClick={() => { setRefreshCount((count) => count + 1); showToast('Preview refreshed') }}><RefreshCw size={16} /></IconButton><IconButton label="Open preview options" onClick={() => showToast('Preview is running locally')}><Maximize2 size={15} /></IconButton></div></header>
              <div className="preview-controls"><IconButton label="Reload preview" onClick={() => setRefreshCount((count) => count + 1)}><RefreshCw size={15} /></IconButton><input value={projectUrl} onChange={(event) => setProjectUrl(event.target.value)} aria-label="Preview address" onKeyDown={(event) => { if (event.key === 'Enter') showToast(`Preview loaded: ${projectUrl}`) }} /><IconButton label="Open preview link" onClick={() => showToast(`Preview loaded: ${projectUrl}`)}><ExternalLink size={15} /></IconButton><IconButton label="Open fullscreen preview" onClick={() => showToast('Fullscreen preview is ready')}><Maximize2 size={15} /></IconButton></div>
              <div className="browser-window" key={refreshCount}>
                <div className="site-nav"><span className="site-brand"><span className="mini-shield"><ShieldCheck size={18} /></span> CYBER-SHIELD AI</span><div className="site-links"><a href="#home">Home</a><a href="#features">Features</a><a href="#about">About</a><a href="#contact">Contact</a><button onClick={() => showToast('Sign in to your secure workspace')}>Sign in</button></div></div>
                <div className="site-hero"><div className="site-intro"><span className="site-overline"><span className="status-dot online" /> INTELLIGENCE, BUILT IN</span><h3>Welcome to<br /><em>Cyber-Shield AI</em></h3><p>Build secure applications with AI assistance.</p><div className="site-cta"><button onClick={() => showToast('Your secure workspace is ready')}>Get Started</button><button className="outline" onClick={() => showToast('Opening the developer documentation')}>View Documentation</button></div><span className="site-footnote"><ShieldCheck size={11} /> Security built into every line.</span></div><div className="site-image"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="scan-line" /></div></div>
                <div className="browser-bottom"><span>Preview synced with {activeFile || 'your project'}</span><span>Rendered just now <span className="status-dot online" /></span></div>
              </div>
            </section>

            <section className="panel terminal-panel" id="terminal">
              <header className="panel-header"><div className="panel-heading"><Terminal size={17} className="cyan" /><h2>Terminal</h2><span className="terminal-runtime"><span className="status-dot online" /> LOCAL</span></div><div className="panel-actions"><IconButton label="New terminal tab" onClick={() => showToast('Terminal session ready')}><Plus size={17} /></IconButton><IconButton label="Clear terminal" onClick={() => setTerminalLines([])}><Trash2 size={15} /></IconButton><IconButton label="Terminal options" onClick={() => showToast('Local demo terminal · PowerShell')}><MoreVertical size={16} /></IconButton></div></header>
              <div className="terminal-content"><div className="terminal-output">{terminalLines.map((line, index) => <div key={`${index}-${line.text}`} className={`terminal-line ${line.tone}`}>{line.emphasis ? <>{line.text.replace(line.emphasis, '')}<span>{line.emphasis}</span></> : line.text}</div>)}<form className="terminal-input" onSubmit={runCommand}><span>PS E:\cyber-shield&gt;</span><input value={command} onChange={(event) => setCommand(event.target.value)} placeholder="Type a command…" aria-label="Type a terminal command" /><button type="submit" aria-label="Run command"><Play size={12} fill="currentColor" /></button></form></div></div>
              <footer className="terminal-footer"><span><span className="status-dot online" /> PowerShell</span><span>Local demo environment</span><button onClick={() => showToast('Demo shell ready. Type help for commands.')}>Help <span>⌘</span></button></footer>
            </section>

            <section className="panel github-panel" id="github">
              <header className="panel-header"><div className="panel-heading"><Github size={18} /><h2>GitHub Integration</h2>{connected && <span className="connected-badge"><Check size={10} /> CONNECTED</span>}</div><button className={connected ? 'button-connected' : 'button-outline'} onClick={() => setConnected((value) => { showToast(value ? 'GitHub disconnected from this demo' : 'GitHub connected in demo mode'); return !value })}>{connected ? 'Disconnect' : 'Connect GitHub'}</button></header>
              <div className="github-content"><div className="github-identity"><span className="github-logo-box"><Github size={34} fill="currentColor" /></span><div><b>{connected ? 'GitHub demo account' : 'Connect your GitHub account'}</b><p>{connected ? 'Your demo workspace is linked and ready.' : 'Push, pull and manage your repositories directly from Cyber-Shield AI.'}</p><button className="github-connect" onClick={() => setConnected((value) => { showToast(value ? 'GitHub workspace is connected' : 'GitHub connected in demo mode'); return !value })}><Github size={14} fill="currentColor" /> {connected ? 'Connected' : 'Connect with GitHub'}</button></div></div><div className="github-actions">
                {[['Clone Repository', 'Import existing projects', GitBranch], ['Push Changes', 'Sync your code', ShieldCheck], ['Manage Repositories', 'View and organize', LayoutDashboard], ['Create New Repository', 'Start a new project', Plus]].map(([title, description, Icon]) => <button key={title} onClick={() => showToast(connected ? `${title} is available in demo mode` : 'Connect GitHub to continue')}><Icon size={17} /><span><b>{title}</b><small>{description}</small></span></button>)}
              </div></div>
            </section>
          </div>

          <footer className="main-footer"><span>CYBER-SHIELD AI <span className="footer-sep">/</span> DEVELOPER WORKSPACE</span><span><span className="status-dot online" /> ALL SYSTEMS OPERATIONAL</span><span>SECURE SESSION <ShieldCheck size={12} /></span></footer>
        </main>
      </div>
      {toast && <div className="toast"><Check size={15} />{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X size={14} /></button></div>}
    </div>
  )
}

export default App
