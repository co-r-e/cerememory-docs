'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { basePath } from '@/lib/basePath'
import type { Dictionary } from '@/i18n/types'
import type { Locale } from '@/i18n/config'
import { LanguageSwitcher } from '@/components/lp/LanguageSwitcher'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

function RevealSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

function CodeTabs({ dict }: { dict: Dictionary }) {
  const [active, setActive] = useState<'mcp' | 'cli' | 'rest'>('mcp')

  // Suppress unused-var lint - dict is accepted for future tab-label i18n
  void dict

  return (
    <div className="code-tabs">
      <div className="code-tabs__nav">
        {(['mcp', 'cli', 'rest'] as const).map((tab) => (
          <button
            key={tab}
            className={`code-tabs__btn ${active === tab ? 'active' : ''}`}
            onClick={() => setActive(tab)}
          >
            {tab === 'mcp'
              ? 'MCP Client'
              : tab === 'cli'
                ? 'CLI'
                : 'REST API'}
          </button>
        ))}
      </div>

      {active === 'mcp' && (
        <div className="code-tabs__panel active">
          <div className="code-block">
            <div className="code-block__header">
              <span className="code-block__lang">TOML &middot; Codex CLI config</span>
              <span className="code-block__dot" />
            </div>
            <pre
              dangerouslySetInnerHTML={{
                __html: `<span class="cm"># ~/.codex/config.toml &mdash; point every MCP client at one shared server</span>
[mcp_servers.cerememory]
command = <span class="str">"/absolute/path/to/target/release/cerememory"</span>
args = [<span class="str">"mcp"</span>, <span class="str">"--server-url"</span>, <span class="str">"http://127.0.0.1:8420"</span>]

<span class="cm"># Claude Code uses the same shape in ~/.claude/claude_desktop_config.json</span>
<span class="cm"># {
#   "mcpServers": {
#     "cerememory": {
#       "command": "/absolute/path/to/target/release/cerememory",
#       "args": ["mcp", "--server-url", "http://127.0.0.1:8420"]
#     }
#   }
# }</span>`,
              }}
            />
          </div>
        </div>
      )}

      {active === 'cli' && (
        <div className="code-tabs__panel active">
          <div className="code-block">
            <div className="code-block__header">
              <span className="code-block__lang">Shell</span>
              <span className="code-block__dot" />
            </div>
            <pre
              dangerouslySetInnerHTML={{
                __html: `<span class="cm"># Store, recall, and forget directly from the CLI</span>
<span class="fn">cerememory</span> store <span class="str">"Had coffee with Alice at the park"</span> --store episodic

<span class="fn">cerememory</span> recall <span class="str">"Alice"</span> --limit <span class="num">5</span> --mode human

<span class="fn">cerememory</span> forget <span class="num">01916e3a-1234-7000-8000-000000000001</span> --confirm

<span class="cm"># Summarize raw journal entries into curated memory</span>
<span class="fn">cerememory</span> dream-tick --session-id sess_001`,
              }}
            />
          </div>
        </div>
      )}

      {active === 'rest' && (
        <div className="code-tabs__panel active">
          <div className="code-block">
            <div className="code-block__header">
              <span className="code-block__lang">cURL</span>
              <span className="code-block__dot" />
            </div>
            <pre
              dangerouslySetInnerHTML={{
                __html: `<span class="cm"># Store a memory</span>
<span class="fn">curl</span> -X POST http://127.0.0.1:<span class="num">8420</span>/v1/encode \\
  -H <span class="str">"Content-Type: application/json"</span> \\
  -d <span class="str">'{
    "content": {
      "blocks": [{
        "modality": "text",
        "format": "text/plain",
        "data": [72,97,100,32,99,111,102,102,101,101,32,119,105,116,104,32,65,108,105,99,101,32,97,116,32,116,104,101,32,112,97,114,107],
        "embedding": null
      }],
      "summary": null
    },
    "store": "episodic"
  }'</span>

<span class="cm"># Query memories</span>
<span class="fn">curl</span> -X POST http://127.0.0.1:<span class="num">8420</span>/v1/recall/query \\
  -H <span class="str">"Content-Type: application/json"</span> \\
  -d <span class="str">'{"cue": {"text": "Alice"}, "limit": 5, "recall_mode": "human"}'</span>

<span class="cm"># Check system stats</span>
<span class="fn">curl</span> http://127.0.0.1:<span class="num">8420</span>/v1/introspect/stats`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const varStyle = { color: 'var(--crimson)', fontStyle: 'italic' as const }

/* ========== HERO CANVAS BACKGROUND - composite sine waves ========== */

const WAVE_COLORS = ['#8B1A2B', '#8B1A2B', '#A8293D', '#1C1917', '#292524']
const WAVE_LINE_COUNT = 25
const VWAVE_LINE_COUNT = 18
const STEP_PX = 4

interface WaveComponent {
  amplitude: number
  frequency: number
  phaseSpeed: number
  phase: number
}

interface WaveLine {
  baseY: number
  color: string
  opacity: number
  thickness: number
  waves: WaveComponent[]
}

interface VerticalWaveLine {
  baseX: number
  color: string
  opacity: number
  thickness: number
  waves: WaveComponent[]
}

function createWaveLine(baseY: number): WaveLine {
  const count = 2 + Math.floor(Math.random() * 2) // 2 or 3 harmonics
  const waves: WaveComponent[] = []
  for (let i = 0; i < count; i++) {
    waves.push({
      amplitude: 5 + Math.random() * 25,
      frequency: 0.002 + Math.random() * 0.013,
      phaseSpeed: (0.005 + Math.random() * 0.025) * (Math.random() < 0.5 ? 1 : -1),
      phase: Math.random() * Math.PI * 2,
    })
  }
  return {
    baseY,
    color: WAVE_COLORS[Math.floor(Math.random() * WAVE_COLORS.length)],
    opacity: 0.04 + Math.random() * 0.09,
    thickness: 0.4 + Math.random() * 0.45,
    waves,
  }
}

function createVerticalWaveLine(baseX: number): VerticalWaveLine {
  const count = 2 + Math.floor(Math.random() * 2)
  const waves: WaveComponent[] = []
  for (let i = 0; i < count; i++) {
    waves.push({
      amplitude: 4 + Math.random() * 20,
      frequency: 0.002 + Math.random() * 0.013,
      phaseSpeed: (0.005 + Math.random() * 0.025) * (Math.random() < 0.5 ? 1 : -1),
      phase: Math.random() * Math.PI * 2,
    })
  }
  return {
    baseX,
    color: WAVE_COLORS[Math.floor(Math.random() * WAVE_COLORS.length)],
    opacity: 0.05 + Math.random() * 0.12,
    thickness: 0.5 + Math.random() * 0.9,
    waves,
  }
}

function waveY(line: WaveLine, x: number): number {
  let y = line.baseY
  for (let i = 0; i < line.waves.length; i++) {
    const w = line.waves[i]
    y += w.amplitude * Math.sin(w.frequency * x + w.phase)
  }
  return y
}

function waveX(line: VerticalWaveLine, y: number): number {
  let x = line.baseX
  for (let i = 0; i < line.waves.length; i++) {
    const w = line.waves[i]
    x += w.amplitude * Math.sin(w.frequency * y + w.phase)
  }
  return x
}

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const initAndAnimate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function sizeCanvas() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas!.width = rect.width * dpr
      canvas!.height = rect.height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      return rect
    }

    let rect = sizeCanvas()
    let canvasW = rect.width
    let canvasH = rect.height

    let lines: WaveLine[] = []
    let vlines: VerticalWaveLine[] = []
    function initLines() {
      lines = []
      const spacing = canvasH / (WAVE_LINE_COUNT + 1)
      for (let i = 0; i < WAVE_LINE_COUNT; i++) {
        const baseY = spacing * (i + 1) + (Math.random() - 0.5) * spacing * 0.4
        lines.push(createWaveLine(baseY))
      }
      vlines = []
      const vspacing = canvasW / (VWAVE_LINE_COUNT + 1)
      for (let i = 0; i < VWAVE_LINE_COUNT; i++) {
        const baseX = vspacing * (i + 1) + (Math.random() - 0.5) * vspacing * 0.4
        vlines.push(createVerticalWaveLine(baseX))
      }
    }
    initLines()

    function drawFrame() {
      ctx!.clearRect(0, 0, canvasW, canvasH)
      ctx!.lineCap = 'round'

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        ctx!.globalAlpha = line.opacity
        ctx!.strokeStyle = line.color
        ctx!.lineWidth = line.thickness
        ctx!.beginPath()
        ctx!.moveTo(0, waveY(line, 0))
        for (let x = STEP_PX; x <= canvasW; x += STEP_PX) {
          ctx!.lineTo(x, waveY(line, x))
        }
        ctx!.lineTo(canvasW, waveY(line, canvasW))
        ctx!.stroke()
      }

      for (let i = 0; i < vlines.length; i++) {
        const line = vlines[i]
        ctx!.globalAlpha = line.opacity
        ctx!.strokeStyle = line.color
        ctx!.lineWidth = line.thickness
        ctx!.beginPath()
        ctx!.moveTo(waveX(line, 0), 0)
        for (let y = STEP_PX; y <= canvasH; y += STEP_PX) {
          ctx!.lineTo(waveX(line, y), y)
        }
        ctx!.lineTo(waveX(line, canvasH), canvasH)
        ctx!.stroke()
      }
      ctx!.globalAlpha = 1
    }

    function advancePhases() {
      for (let i = 0; i < lines.length; i++) {
        const ws = lines[i].waves
        for (let j = 0; j < ws.length; j++) {
          ws[j].phase += ws[j].phaseSpeed
        }
      }
      for (let i = 0; i < vlines.length; i++) {
        const ws = vlines[i].waves
        for (let j = 0; j < ws.length; j++) {
          ws[j].phase += ws[j].phaseSpeed
        }
      }
    }

    // Static render for reduced motion
    if (reducedMotion) {
      drawFrame()
      return () => {}
    }

    // Animation loop
    let animId: number
    function tick() {
      advancePhases()
      drawFrame()
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)

    // Resize handler (debounced)
    let resizeTimer: ReturnType<typeof setTimeout>
    function handleResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        rect = sizeCanvas()
        canvasW = rect.width
        canvasH = rect.height
        const spacing = canvasH / (WAVE_LINE_COUNT + 1)
        for (let i = 0; i < lines.length; i++) {
          lines[i].baseY = spacing * (i + 1) + (Math.random() - 0.5) * spacing * 0.4
        }
        const vspacing = canvasW / (VWAVE_LINE_COUNT + 1)
        for (let i = 0; i < vlines.length; i++) {
          vlines[i].baseX = vspacing * (i + 1) + (Math.random() - 0.5) * vspacing * 0.4
        }
      }, 150)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const cleanup = initAndAnimate()
    return () => cleanup?.()
  }, [initAndAnimate])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

export default function HomeContent({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => {
      // Swap to wordmark once the user has scrolled past ~70% of the viewport
      // (i.e. left the hero area). Threshold is recomputed each call so it
      // adapts to viewport resizing without an explicit listener.
      const threshold = window.innerHeight * 0.7
      setScrolled(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* MASTHEAD */}
      <header className={`masthead ${menuOpen ? 'masthead--open' : ''} ${scrolled ? 'masthead--scrolled' : ''}`}>
        <div className="column column--wide masthead__inner">
          <nav className="masthead__desktop-nav masthead__desktop-nav--left">
            <ul className="masthead__nav masthead__nav--left">
              <li><a href="#architecture">{dict.nav.architecture}</a></li>
              <li><a href="#dynamics">{dict.nav.dynamics}</a></li>
              <li><a href="#protocol">{dict.nav.protocol}</a></li>
            </ul>
          </nav>
          <a href="#" className="masthead__logo-link" onClick={closeMenu} aria-label="Cerememory">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/icon.svg`} alt="" className="masthead__mark" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/logo.svg`} alt="Cerememory" className="masthead__logo" />
          </a>
          <nav className="masthead__desktop-nav masthead__desktop-nav--right">
            <ul className="masthead__nav masthead__nav--right">
              <li><a href="#quickstart">{dict.nav.quickStart}</a></li>
              <li>
                <a href="https://github.com/co-r-e/cerememory" target="_blank" rel="noopener" style={{ border: 'none' }}>
                  {dict.nav.github}
                </a>
              </li>
              <li><LanguageSwitcher locale={locale} label={dict.langSwitcher.label} /></li>
            </ul>
          </nav>
          <button
            type="button"
            className="masthead__toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="masthead-drawer"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`masthead__toggle-bars ${menuOpen ? 'is-open' : ''}`} aria-hidden="true" />
          </button>
        </div>
        <div
          id="masthead-drawer"
          className={`masthead__drawer ${menuOpen ? 'is-open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-hidden={!menuOpen}
        >
          <ul className="masthead__drawer-list">
            <li><a href="#architecture" onClick={closeMenu}>{dict.nav.architecture}</a></li>
            <li><a href="#dynamics" onClick={closeMenu}>{dict.nav.dynamics}</a></li>
            <li><a href="#protocol" onClick={closeMenu}>{dict.nav.protocol}</a></li>
            <li><a href="#quickstart" onClick={closeMenu}>{dict.nav.quickStart}</a></li>
            <li>
              <a
                href="https://github.com/co-r-e/cerememory"
                target="_blank"
                rel="noopener"
                onClick={closeMenu}
              >
                {dict.nav.github}
              </a>
            </li>
            <li className="masthead__drawer-lang">
              <LanguageSwitcher locale={locale} label={dict.langSwitcher.label} />
            </li>
          </ul>
        </div>
        {menuOpen && (
          <div className="masthead__backdrop" onClick={closeMenu} aria-hidden="true" />
        )}
      </header>

      {/* HERO */}
      <section className="hero">
        <HeroCanvas />
        <div className="column hero__content">
          <div className="hero__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/logo.svg`} alt="Cerememory" className="hero__logo" />
          </div>
          <h1 className="hero__title">
            {dict.hero.titlePre}<em>{dict.hero.titleEm}</em>{dict.hero.titlePost}
          </h1>
          <p className="hero__subtitle">
            {dict.hero.subtitle}
          </p>
        </div>
      </section>

      {/* ABSTRACT */}
      <section className="abstract">
        <div className="column column--wide">
          <div className="abstract__label">{dict.abstract.label}</div>
          <p className="abstract__text" dangerouslySetInnerHTML={{ __html: dict.abstract.text }} />
          <div className="abstract__keywords">
            <strong>{dict.abstract.keywordsLabel}</strong>&ensp; {dict.abstract.keywords}
          </div>
        </div>
      </section>

      {/* S1 THE PROBLEM */}
      <section className="section" id="problem">
        <RevealSection className="column column--wide">
          <span className="section__number">{dict.problem.number}</span>
          <h2 className="section__title">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/icon.svg`} alt="" aria-hidden="true" className="section__title-icon" />
            <span>{dict.problem.title}</span>
          </h2>
          <div className="section__body">
            <p>{dict.problem.para1}</p>
            <p>
              {dict.problem.para2Pre}
              <strong>{dict.problem.alive}</strong>{dict.problem.aliveDesc}
              <strong>{dict.problem.llmAgnostic}</strong>{dict.problem.llmAgnosticDesc}
              <strong>{dict.problem.userSovereign}</strong>{dict.problem.userSovereignDesc}
            </p>
          </div>
        </RevealSection>
      </section>

      <div className="sep"><div className="sep__diamond" /></div>

      {/* S2 ARCHITECTURE */}
      <section className="section section--alt" id="architecture">
        <RevealSection className="column column--wide">
          <span className="section__number">{dict.architecture.number}</span>
          <h2 className="section__title">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/icon.svg`} alt="" aria-hidden="true" className="section__title-icon" />
            <span>{dict.architecture.title}</span>
          </h2>
          <p className="section__lead">{dict.architecture.lead}</p>

          <div className="figure">
            <div className="figure__content">
              <table className="stores-table">
                <thead>
                  <tr>
                    <th>{dict.architecture.tableHeaders.store}</th>
                    <th>{dict.architecture.tableHeaders.brainAnalog}</th>
                    <th>{dict.architecture.tableHeaders.function}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="store-name">{dict.architecture.stores.episodic.name}</span></td>
                    <td><span className="store-analog">{dict.architecture.stores.episodic.analog}</span></td>
                    <td>{dict.architecture.stores.episodic.desc}</td>
                  </tr>
                  <tr>
                    <td><span className="store-name">{dict.architecture.stores.semantic.name}</span></td>
                    <td><span className="store-analog">{dict.architecture.stores.semantic.analog}</span></td>
                    <td>{dict.architecture.stores.semantic.desc}</td>
                  </tr>
                  <tr>
                    <td><span className="store-name">{dict.architecture.stores.procedural.name}</span></td>
                    <td><span className="store-analog">{dict.architecture.stores.procedural.analog}</span></td>
                    <td>{dict.architecture.stores.procedural.desc}</td>
                  </tr>
                  <tr>
                    <td><span className="store-name">{dict.architecture.stores.emotional.name}</span></td>
                    <td><span className="store-analog">{dict.architecture.stores.emotional.analog}</span></td>
                    <td>{dict.architecture.stores.emotional.desc}</td>
                  </tr>
                  <tr>
                    <td><span className="store-name">{dict.architecture.stores.working.name}</span></td>
                    <td><span className="store-analog">{dict.architecture.stores.working.analog}</span></td>
                    <td>{dict.architecture.stores.working.desc}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="figure__caption" dangerouslySetInnerHTML={{ __html: dict.architecture.tableCaption }} />
          </div>

          <div className="figure" style={{ marginTop: '3rem' }}>
            <div className="figure__content arch-diagram">
              <div className="arch-label">{dict.architecture.diagram.llmAdapters}</div>
              <div className="arch-layer">
                <div className="arch-box">Claude</div>
                <div className="arch-box">GPT</div>
                <div className="arch-box">Gemini</div>
              </div>
              <div className="arch-arrow">&darr; CMP Protocol</div>
              <div className="arch-label">{dict.architecture.diagram.transportLayer}</div>
              <div className="arch-layer">
                <div className="arch-box arch-box--primary">HTTP / REST (Axum)</div>
                <div className="arch-box arch-box--primary">gRPC (Tonic)</div>
                <div className="arch-box arch-box--primary">MCP (rmcp)</div>
              </div>
              <div className="arch-arrow">&darr;</div>
              <div className="arch-layer">
                <div className="arch-box arch-box--primary" style={{ padding: '0.9em 2.5em' }}>
                  {dict.architecture.diagram.cerememoryEngine}
                </div>
              </div>
              <div className="arch-arrow">&darr;</div>
              <div className="arch-label">{dict.architecture.diagram.hippocampalCoordinator}</div>
              <div className="arch-layer">
                <div className="arch-box">{dict.architecture.diagram.tantivyFullText}</div>
                <div className="arch-box">{dict.architecture.diagram.hnswVector}</div>
                <div className="arch-box">{dict.architecture.diagram.associationGraph}</div>
              </div>
              <div className="arch-arrow">&darr;</div>
              <div className="arch-label">{dict.architecture.diagram.memoryStores}</div>
              <div className="arch-layer">
                <div className="arch-box arch-box--store">{dict.architecture.stores.episodic.name}</div>
                <div className="arch-box arch-box--store">{dict.architecture.stores.semantic.name}</div>
                <div className="arch-box arch-box--store">{dict.architecture.stores.procedural.name}</div>
                <div className="arch-box arch-box--store">{dict.architecture.stores.emotional.name}</div>
                <div className="arch-box arch-box--store">{dict.architecture.stores.working.name}</div>
                <div className="arch-box arch-box--store" style={{ borderStyle: 'dashed' }}>
                  {dict.architecture.diagram.rawJournalBox}
                </div>
              </div>
              <div className="arch-arrow">&harr;</div>
              <div className="arch-label">{dict.architecture.diagram.engines}</div>
              <div className="arch-layer">
                <div className="arch-box">{dict.architecture.diagram.decayEngine}</div>
                <div className="arch-box">{dict.architecture.diagram.associationEngine}</div>
                <div className="arch-box">{dict.architecture.diagram.evolutionEngine}</div>
              </div>
              <p className="arch-footnote" style={{ marginTop: '0.75rem', fontSize: '0.85em', opacity: 0.7, textAlign: 'center' }}>
                {dict.architecture.diagram.supportingEnginesNote}
              </p>
            </div>
            <div className="figure__caption" dangerouslySetInnerHTML={{ __html: dict.architecture.diagram.figCaption }} />
          </div>
        </RevealSection>
      </section>

      {/* S3 LIVING DYNAMICS */}
      <section className="section" id="dynamics">
        <RevealSection className="column column--wide">
          <span className="section__number">{dict.dynamics.number}</span>
          <h2 className="section__title">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/icon.svg`} alt="" aria-hidden="true" className="section__title-icon" />
            <span>{dict.dynamics.title}</span>
          </h2>
          <p className="section__lead">{dict.dynamics.lead}</p>

          <h3 className="subsection-title">{dict.dynamics.decay.title}</h3>
          <div className="section__body">
            <p>{dict.dynamics.decay.desc}</p>
          </div>

          <div className="formula">
            <div className="formula__expr">
              <span className="var">F</span>(t) = <span className="var">F</span><sub>0</sub>{' '}&middot;{' '}(1 + t / <span className="var">S</span>)<sup>&minus;d</sup>{' '}&middot;{' '}<span className="var">E</span><sub>mod</sub>
            </div>
            <div className="formula__desc">
              <span className="var" style={varStyle}>F</span><sub>0</sub>{` : ${dict.dynamics.decay.initialFidelity} `}
              <span className="var" style={varStyle}>S</span>{` : ${dict.dynamics.decay.stabilityParam} `}
              <span className="var" style={varStyle}>d</span>{` : ${dict.dynamics.decay.decayExponent} `}
              <span className="var" style={varStyle}>E</span><sub>mod</sub>{` : ${dict.dynamics.decay.emotionalModFactor}`}
            </div>
            <div className="formula__label">{dict.dynamics.decay.eqLabel}</div>
          </div>

          <h3 className="subsection-title">{dict.dynamics.noise.title}</h3>
          <div className="section__body">
            <p>{dict.dynamics.noise.desc}</p>
          </div>

          <div className="formula">
            <div className="formula__expr">
              <span className="var">N</span>(t) = <span className="var">N</span><sub>0</sub>{' + '}<span className="var">&lambda;</span>{' '}&middot;{' '}&radic;t{' '}&middot;{' '}(1 &minus; <span className="var">F</span>(t))
            </div>
            <div className="formula__desc">
              <span className="var" style={varStyle}>&lambda;</span>{` : ${dict.dynamics.noise.interferenceRate}`}
            </div>
            <div className="formula__label">{dict.dynamics.noise.eqLabel}</div>
          </div>

          <h3 className="subsection-title">{dict.dynamics.emotional.title}</h3>
          <div className="section__body">
            <p>{dict.dynamics.emotional.desc}</p>
          </div>

          <div className="figure">
            <div className="figure__content">
              <div className="emotion-wheel">
                {dict.dynamics.emotional.emotions.map(
                  (emotion) => (
                    <div key={emotion} className="emotion-axis">
                      <span className="emotion-axis__bar" />
                      {emotion}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="figure__caption" dangerouslySetInnerHTML={{ __html: dict.dynamics.emotional.figCaption }} />
          </div>

          <h3 className="subsection-title">{dict.dynamics.dream.title}</h3>
          <div className="section__body">
            <p>{dict.dynamics.dream.lead}</p>
          </div>

          <div className="figure" style={{ marginTop: '1rem' }}>
            <div className="figure__content arch-diagram" style={{ padding: '1.5rem' }}>
              <div className="arch-label">{dict.dynamics.dream.pipelineLabel}</div>
              <div className="arch-layer">
                <div className="arch-box arch-box--store" style={{ borderStyle: 'dashed' }}>
                  {dict.dynamics.dream.pipelineRaw}
                </div>
              </div>
              <div className="arch-arrow">&darr;</div>
              <div className="arch-layer">
                <div className="arch-box">{dict.dynamics.dream.pipelineGrouping}</div>
              </div>
              <div className="arch-arrow">&darr;</div>
              <div className="arch-layer">
                <div className="arch-box arch-box--primary">{dict.dynamics.dream.pipelineSummary}</div>
              </div>
              <div className="arch-arrow">&darr;</div>
              <div className="arch-layer">
                <div className="arch-box arch-box--store">{dict.dynamics.dream.pipelineCurated}</div>
              </div>
            </div>
          </div>

          <div className="features" style={{ marginTop: '2rem' }}>
            {dict.dynamics.dream.properties.map((prop, idx) => (
              <div key={prop.title} className="feature">
                <div className="feature__icon">{['α', 'β', 'γ', 'δ', 'ε'][idx] ?? '·'}</div>
                <div className="feature__title">{prop.title}</div>
                <div className="feature__desc">{prop.desc}</div>
              </div>
            ))}
          </div>

          <div className="features" style={{ marginTop: '2.5rem' }}>
            <div className="feature">
              <div className="feature__icon">i</div>
              <div className="feature__title">{dict.dynamics.features.reactivation.title}</div>
              <div className="feature__desc">{dict.dynamics.features.reactivation.desc}</div>
            </div>
            <div className="feature">
              <div className="feature__icon">ii</div>
              <div className="feature__title">{dict.dynamics.features.reconsolidation.title}</div>
              <div className="feature__desc">{dict.dynamics.features.reconsolidation.desc}</div>
            </div>
            <div className="feature">
              <div className="feature__icon">iii</div>
              <div className="feature__title">{dict.dynamics.features.consolidation.title}</div>
              <div className="feature__desc">{dict.dynamics.features.consolidation.desc}</div>
            </div>
          </div>
        </RevealSection>
      </section>

      <div className="sep"><div className="sep__diamond" /></div>

      {/* S4 PROTOCOL */}
      <section className="section section--alt" id="protocol">
        <RevealSection className="column column--wide">
          <span className="section__number">{dict.protocol.number}</span>
          <h2 className="section__title">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/icon.svg`} alt="" aria-hidden="true" className="section__title-icon" />
            <span>{dict.protocol.title}</span>
          </h2>
          <p className="section__lead">{dict.protocol.lead}</p>

          {/* CMP vs MCP hierarchy */}
          <figure className="cmp-hierarchy" aria-labelledby="cmp-hierarchy-caption">
            <div className="cmp-hierarchy__tier cmp-hierarchy__tier--clients">
              <div className="cmp-hierarchy__tier-label">{dict.protocol.hierarchy.clients}</div>
              <div className="cmp-hierarchy__tier-desc">{dict.protocol.hierarchy.clientsDesc}</div>
            </div>
            <div className="cmp-hierarchy__rail" aria-hidden="true" />
            <div className="cmp-hierarchy__row">
              <div className="cmp-hierarchy__node">
                <div className="cmp-hierarchy__node-tag">HTTP</div>
                <div className="cmp-hierarchy__node-title">{dict.protocol.hierarchy.http}</div>
                <div className="cmp-hierarchy__node-desc">{dict.protocol.hierarchy.httpDesc}</div>
              </div>
              <div className="cmp-hierarchy__node">
                <div className="cmp-hierarchy__node-tag">gRPC</div>
                <div className="cmp-hierarchy__node-title">{dict.protocol.hierarchy.grpc}</div>
                <div className="cmp-hierarchy__node-desc">{dict.protocol.hierarchy.grpcDesc}</div>
              </div>
              <div className="cmp-hierarchy__node cmp-hierarchy__node--mcp">
                <div className="cmp-hierarchy__node-tag">MCP</div>
                <div className="cmp-hierarchy__node-title">{dict.protocol.hierarchy.mcp}</div>
                <div className="cmp-hierarchy__node-desc">{dict.protocol.hierarchy.mcpDesc}</div>
              </div>
            </div>
            <div className="cmp-hierarchy__rail" aria-hidden="true" />
            <div className="cmp-hierarchy__tier cmp-hierarchy__tier--cmp">
              <div className="cmp-hierarchy__tier-label">{dict.protocol.hierarchy.cmp}</div>
              <div className="cmp-hierarchy__tier-desc">{dict.protocol.hierarchy.cmpDesc}</div>
            </div>
            <div className="cmp-hierarchy__rail" aria-hidden="true" />
            <div className="cmp-hierarchy__tier cmp-hierarchy__tier--engine">
              <div className="cmp-hierarchy__tier-label">{dict.protocol.hierarchy.engine}</div>
              <div className="cmp-hierarchy__tier-desc">{dict.protocol.hierarchy.engineDesc}</div>
            </div>
            <figcaption
              id="cmp-hierarchy-caption"
              className="cmp-hierarchy__caption"
              dangerouslySetInnerHTML={{ __html: dict.protocol.hierarchy.figCaption }}
            />
          </figure>

          <div className="protocol-grid">
            <div className="protocol-card">
              <div className="protocol-card__category">{dict.protocol.encode.category}</div>
              <div className="protocol-card__title">{dict.protocol.encode.title}</div>
              <ul className="protocol-card__ops">
                {dict.protocol.encode.ops.map((op) => (
                  <li key={op}>{op}</li>
                ))}
              </ul>
            </div>
            <div className="protocol-card">
              <div className="protocol-card__category">{dict.protocol.recall.category}</div>
              <div className="protocol-card__title">{dict.protocol.recall.title}</div>
              <ul className="protocol-card__ops">
                {dict.protocol.recall.ops.map((op) => (
                  <li key={op}>{op}</li>
                ))}
              </ul>
            </div>
            <div className="protocol-card">
              <div className="protocol-card__category">{dict.protocol.lifecycle.category}</div>
              <div className="protocol-card__title">{dict.protocol.lifecycle.title}</div>
              <ul className="protocol-card__ops">
                {dict.protocol.lifecycle.ops.map((op) => (
                  <li key={op}>{op}</li>
                ))}
              </ul>
            </div>
            <div className="protocol-card">
              <div className="protocol-card__category">{dict.protocol.introspect.category}</div>
              <div className="protocol-card__title">{dict.protocol.introspect.title}</div>
              <ul className="protocol-card__ops">
                {dict.protocol.introspect.ops.map((op) => (
                  <li key={op}>{op}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footnote" dangerouslySetInnerHTML={{ __html: `<sup>*</sup> ${dict.protocol.footnote}` }} />
        </RevealSection>
      </section>

      {/* S5 QUICK START */}
      <section className="section" id="quickstart">
        <RevealSection className="column column--wide">
          <span className="section__number">{dict.quickStart.number}</span>
          <h2 className="section__title">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/icon.svg`} alt="" aria-hidden="true" className="section__title-icon" />
            <span>{dict.quickStart.title}</span>
          </h2>
          <p className="section__lead">{dict.quickStart.lead}</p>

          <div className="code-block" style={{ marginBottom: '2rem' }}>
            <div className="code-block__header">
              <span className="code-block__lang">Shell</span>
              <span className="code-block__dot" />
            </div>
            <pre
              dangerouslySetInnerHTML={{
                __html: `<span class="cm"># Build the binary from source</span>
<span class="fn">git</span> clone https://github.com/co-r-e/cerememory.git
<span class="kw">cd</span> cerememory
<span class="fn">cargo</span> build -p cerememory-cli --release

<span class="cm"># Start the one long-lived server that owns the data directory</span>
target/release/<span class="fn">cerememory</span> serve --data-dir ~/.cerememory/data

<span class="cm"># Point every MCP client (Claude Code, Codex CLI, Cursor, ...) at that shared server</span>
target/release/<span class="fn">cerememory</span> mcp --server-url http://127.0.0.1:<span class="num">8420</span>`,
              }}
            />
          </div>

          <CodeTabs dict={dict} />
        </RevealSection>
      </section>

      <div className="sep"><div className="sep__diamond" /></div>

      {/* S6 ECOSYSTEM */}
      <section className="section section--alt" id="ecosystem">
        <RevealSection className="column column--wide">
          <span className="section__number">{dict.ecosystem.number}</span>
          <h2 className="section__title">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/icon.svg`} alt="" aria-hidden="true" className="section__title-icon" />
            <span>{dict.ecosystem.title}</span>
          </h2>

          <h3 className="subsection-title">{dict.ecosystem.integrationsTitle}</h3>
          <div className="sdk-row">
            {dict.ecosystem.integrations.map((integration) => (
              <div key={integration.tag} className="sdk-badge">
                <div className="sdk-badge__icon">{integration.tag}</div>
                <div>
                  <div className="sdk-badge__name">{integration.name}</div>
                  <div
                    className="sdk-badge__pkg"
                    dangerouslySetInnerHTML={{
                      __html: integration.desc.replace(
                        /`([^`]+)`/g,
                        '<code>$1</code>'
                      ),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <h3 className="subsection-title" style={{ marginTop: '2.5rem' }}>
            {dict.ecosystem.llmAdaptersTitle}
          </h3>
          <div className="adapters-row">
            {['Anthropic Claude', 'OpenAI GPT', 'Google Gemini'].map((name) => (
              <div key={name} className="adapter-pill">
                <span className="adapter-pill__dot" />
                {name}
              </div>
            ))}
          </div>

          <h3 className="subsection-title" style={{ marginTop: '2.5rem' }}>
            {dict.ecosystem.capabilitiesTitle}
          </h3>
          <div className="features">
            {dict.ecosystem.capabilities.map((f) => (
              <div key={f.title} className="feature">
                <div className="feature__icon">{f.icon}</div>
                <div className="feature__title">{f.title}</div>
                <div className="feature__desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* S7 TECHNICAL */}
      <section className="section" id="technical">
        <RevealSection className="column column--wide">
          <span className="section__number">{dict.technical.number}</span>
          <h2 className="section__title">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/icon.svg`} alt="" aria-hidden="true" className="section__title-icon" />
            <span>{dict.technical.title}</span>
          </h2>
          <div className="section__body">
            <p dangerouslySetInnerHTML={{ __html: dict.technical.body }} />
          </div>

          <div className="features" style={{ marginTop: '2rem' }}>
            {dict.technical.tools.map((f) => (
              <div key={f.title} className="feature">
                <div className="feature__title">{f.title}</div>
                <div className="feature__desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      <div className="sep"><div className="sep__diamond" /></div>

      {/* S8 PHILOSOPHY */}
      <section className="section section--alt" id="philosophy">
        <RevealSection className="column column--wide">
          <span className="section__number">{dict.philosophy.number}</span>
          <h2 className="section__title">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/icon.svg`} alt="" aria-hidden="true" className="section__title-icon" />
            <span>{dict.philosophy.title}</span>
          </h2>

          <div className="philosophy-quote">
            <p>{dict.philosophy.quote}</p>
            <cite>{dict.philosophy.quoteAttribution}</cite>
          </div>

          <div className="principles">
            {dict.philosophy.principles.map((p) => (
              <div key={p.num} className="principle">
                <div className="principle__num">{p.num}</div>
                <div className="principle__title">{p.title}</div>
                <div className="principle__desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="column column--wide">
          <h2 className="cta__title">{dict.cta.title}</h2>
          <p className="cta__desc">{dict.cta.desc}</p>
          <div className="cta__buttons">
            <a
              href="https://github.com/co-r-e/cerememory"
              className="btn btn--primary"
              target="_blank"
              rel="noopener"
            >
              {dict.cta.githubButton}
            </a>
            <a href="#quickstart" className="btn btn--secondary">
              {dict.cta.quickStartButton}
            </a>
          </div>
          <div className="install-block">
            <div className="install-cmd">
              <span className="install-cmd__prompt">$</span> git clone https://github.com/co-r-e/cerememory.git
            </div>
            <div className="install-cmd">
              <span className="install-cmd__prompt">$</span> cargo build -p cerememory-cli --release
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="column column--wide">
          <div className="footer__inner">
            <div className="footer__brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${basePath}/logo.svg`} alt="Cerememory" className="footer__logo" />
            </div>
            <ul className="footer__links">
              <li><a href={`${basePath}/docs`}>{dict.footer.docs}</a></li>
              <li>
                <a href="https://github.com/co-r-e/cerememory" target="_blank" rel="noopener">
                  {dict.footer.github}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/co-r-e/cerememory/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener"
                >
                  {dict.footer.contributing}
                </a>
              </li>
              <li><a href="#protocol">{dict.footer.cmpSpec}</a></li>
              <li><a href="#architecture">{dict.footer.architecture}</a></li>
            </ul>
          </div>
          <div className="footer__copy">{dict.footer.copy}</div>
        </div>
      </footer>
    </>
  )
}
