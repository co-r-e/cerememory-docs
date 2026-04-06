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
  const [active, setActive] = useState<'python' | 'typescript' | 'rest'>('python')

  // Suppress unused-var lint - dict is accepted for future tab-label i18n
  void dict

  return (
    <div className="code-tabs">
      <div className="code-tabs__nav">
        {(['python', 'typescript', 'rest'] as const).map((tab) => (
          <button
            key={tab}
            className={`code-tabs__btn ${active === tab ? 'active' : ''}`}
            onClick={() => setActive(tab)}
          >
            {tab === 'rest' ? 'REST API' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {active === 'python' && (
        <div className="code-tabs__panel active">
          <div className="code-block">
            <div className="code-block__header">
              <span className="code-block__lang">Python</span>
              <span className="code-block__dot" />
            </div>
            <pre
              dangerouslySetInnerHTML={{
                __html: `<span class="kw">from</span> cerememory <span class="kw">import</span> Client

client <span class="op">=</span> <span class="fn">Client</span>(<span class="str">"http://localhost:8420"</span>)

<span class="cm"># Store an episodic memory</span>
record_id <span class="op">=</span> client.<span class="fn">store</span>(
    <span class="str">"Had coffee with Alice at the park"</span>,
    store<span class="op">=</span><span class="str">"episodic"</span>
)

<span class="cm"># Recall memories about Alice</span>
memories <span class="op">=</span> client.<span class="fn">recall</span>(<span class="str">"Alice"</span>, limit<span class="op">=</span><span class="num">5</span>)

<span class="cm"># Forget a memory</span>
client.<span class="fn">forget</span>(record_id, confirm<span class="op">=</span><span class="var-hl">True</span>)`,
              }}
            />
          </div>
        </div>
      )}

      {active === 'typescript' && (
        <div className="code-tabs__panel active">
          <div className="code-block">
            <div className="code-block__header">
              <span className="code-block__lang">TypeScript</span>
              <span className="code-block__dot" />
            </div>
            <pre
              dangerouslySetInnerHTML={{
                __html: `<span class="kw">import</span> { CerememoryClient } <span class="kw">from</span> <span class="str">"@cerememory/sdk"</span>;

<span class="kw">const</span> client <span class="op">=</span> <span class="kw">new</span> <span class="fn">CerememoryClient</span>(<span class="str">"http://localhost:8420"</span>);

<span class="cm">// Store an episodic memory</span>
<span class="kw">const</span> recordId <span class="op">=</span> <span class="kw">await</span> client.<span class="fn">store</span>(
  <span class="str">"Had coffee with Alice at the park"</span>,
  { store: <span class="str">"episodic"</span> }
);

<span class="cm">// Recall memories about Alice</span>
<span class="kw">const</span> memories <span class="op">=</span> <span class="kw">await</span> client.<span class="fn">recall</span>(<span class="str">"Alice"</span>, { limit: <span class="num">5</span> });

<span class="cm">// Forget a memory</span>
<span class="kw">await</span> client.<span class="fn">forget</span>(recordId, { confirm: <span class="var-hl">true</span> });`,
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
<span class="fn">curl</span> -X POST http://localhost:<span class="num">8420</span>/v1/encode \\
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
<span class="fn">curl</span> -X POST http://localhost:<span class="num">8420</span>/v1/recall/query \\
  -H <span class="str">"Content-Type: application/json"</span> \\
  -d <span class="str">'{"cue": {"text": "Alice"}, "limit": 5, "recall_mode": "human"}'</span>

<span class="cm"># Check system stats</span>
<span class="fn">curl</span> http://localhost:<span class="num">8420</span>/v1/introspect/stats`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* ========== HERO CANVAS BACKGROUND - composite sine waves ========== */

const WAVE_COLORS = ['#8B1A2B', '#8B1A2B', '#A8293D', '#1C1917', '#292524']
const WAVE_LINE_COUNT = 25
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
    opacity: 0.06 + Math.random() * 0.14,
    thickness: 0.5 + Math.random() * 1.0,
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
    function initLines() {
      lines = []
      const spacing = canvasH / (WAVE_LINE_COUNT + 1)
      for (let i = 0; i < WAVE_LINE_COUNT; i++) {
        const baseY = spacing * (i + 1) + (Math.random() - 0.5) * spacing * 0.4
        lines.push(createWaveLine(baseY))
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
      ctx!.globalAlpha = 1
    }

    function advancePhases() {
      for (let i = 0; i < lines.length; i++) {
        const ws = lines[i].waves
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
  return (
    <>
      {/* MASTHEAD */}
      <header className="masthead">
        <div className="column column--wide masthead__inner">
          <nav>
            <ul className="masthead__nav masthead__nav--left">
              <li><a href="#architecture">{dict.nav.architecture}</a></li>
              <li><a href="#dynamics">{dict.nav.dynamics}</a></li>
              <li><a href="#protocol">{dict.nav.protocol}</a></li>
            </ul>
          </nav>
          <a href="#" className="masthead__logo-link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/logo.svg`} alt="Cerememory" className="masthead__logo" />
          </a>
          <nav>
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
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <HeroCanvas />
        <div className="column hero__content">
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
        <div className="column">
          <div className="abstract__label">{dict.abstract.label}</div>
          <p className="abstract__text" dangerouslySetInnerHTML={{ __html: dict.abstract.text }} />
          <div className="abstract__keywords">
            <strong>{dict.abstract.keywordsLabel}</strong>&ensp; {dict.abstract.keywords}
          </div>
        </div>
      </section>

      {/* S1 THE PROBLEM */}
      <section className="section" id="problem">
        <RevealSection className="column">
          <span className="section__number">{dict.problem.number}</span>
          <h2 className="section__title">{dict.problem.title}</h2>
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
          <h2 className="section__title">{dict.architecture.title}</h2>
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
              </div>
              <div className="arch-arrow">&darr;</div>
              <div className="arch-label">{dict.architecture.diagram.engines}</div>
              <div className="arch-layer">
                <div className="arch-box">{dict.architecture.diagram.decayEngine}</div>
                <div className="arch-box">{dict.architecture.diagram.associationEngine}</div>
                <div className="arch-box">{dict.architecture.diagram.evolutionEngine}</div>
              </div>
            </div>
            <div className="figure__caption" dangerouslySetInnerHTML={{ __html: dict.architecture.diagram.figCaption }} />
          </div>
        </RevealSection>
      </section>

      {/* S3 LIVING DYNAMICS */}
      <section className="section" id="dynamics">
        <RevealSection className="column">
          <span className="section__number">{dict.dynamics.number}</span>
          <h2 className="section__title">{dict.dynamics.title}</h2>
          <p className="section__lead">{dict.dynamics.lead}</p>

          <h3 className="subsection-title">{dict.dynamics.decay.title}</h3>
          <div className="section__body">
            <p>{dict.dynamics.decay.desc}</p>
          </div>

          <div className="formula">
            <div className="formula__expr">
              <span className="var">F</span>(t) = <span className="var">F</span>
              <sub>0</sub> &middot; (1 + t / <span className="var">S</span>)
              <sup>&minus;d</sup> &middot; <span className="var">E</span>
              <sub>mod</sub>
            </div>
            <div className="formula__desc">
              <span className="var" style={{ color: 'var(--crimson)', fontStyle: 'italic' }}>
                F
              </span>
              <sub>0</sub> : {dict.dynamics.decay.initialFidelity} &ensp;
              <span className="var" style={{ color: 'var(--crimson)', fontStyle: 'italic' }}>
                S
              </span>{' '}
              : {dict.dynamics.decay.stabilityParam} &ensp;
              <span className="var" style={{ color: 'var(--crimson)', fontStyle: 'italic' }}>
                d
              </span>{' '}
              : {dict.dynamics.decay.decayExponent} &ensp;
              <span className="var" style={{ color: 'var(--crimson)', fontStyle: 'italic' }}>
                E
              </span>
              <sub>mod</sub> : {dict.dynamics.decay.emotionalModFactor}
            </div>
            <div className="formula__label">{dict.dynamics.decay.eqLabel}</div>
          </div>

          <h3 className="subsection-title">{dict.dynamics.noise.title}</h3>
          <div className="section__body">
            <p>{dict.dynamics.noise.desc}</p>
          </div>

          <div className="formula">
            <div className="formula__expr">
              <span className="var">N</span>(t) = <span className="var">N</span>
              <sub>0</sub> + <span className="var">&lambda;</span> &middot; &radic;t &middot; (1
              &minus; <span className="var">F</span>(t))
            </div>
            <div className="formula__desc">
              <span className="var" style={{ color: 'var(--crimson)', fontStyle: 'italic' }}>
                &lambda;
              </span>{' '}
              : {dict.dynamics.noise.interferenceRate}
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
          <h2 className="section__title">{dict.protocol.title}</h2>
          <p className="section__lead">{dict.protocol.lead}</p>

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
        <RevealSection className="column">
          <span className="section__number">{dict.quickStart.number}</span>
          <h2 className="section__title">{dict.quickStart.title}</h2>
          <p className="section__lead">{dict.quickStart.lead}</p>

          <div className="code-block" style={{ marginBottom: '2rem' }}>
            <div className="code-block__header">
              <span className="code-block__lang">Shell</span>
              <span className="code-block__dot" />
            </div>
            <pre
              dangerouslySetInnerHTML={{
                __html: `<span class="cm"># Start the server</span>
<span class="fn">cargo</span> run -p cerememory-cli -- serve --port <span class="num">8420</span>

<span class="cm"># Claude Code / MCP</span>
<span class="fn">cargo</span> run -p cerememory-cli -- mcp

<span class="cm"># Or via Docker</span>
<span class="fn">docker</span> run --rm -p <span class="num">8420</span>:<span class="num">8420</span> ghcr.io/co-r-e/cerememory:latest`,
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
          <h2 className="section__title">{dict.ecosystem.title}</h2>

          <h3 className="subsection-title">{dict.ecosystem.sdksTitle}</h3>
          <div className="sdk-row">
            <div className="sdk-badge">
              <div className="sdk-badge__icon">Py</div>
              <div>
                <div className="sdk-badge__name">{dict.ecosystem.pythonSdk}</div>
                <div className="sdk-badge__pkg">pip install cerememory</div>
              </div>
            </div>
            <div className="sdk-badge">
              <div className="sdk-badge__icon">TS</div>
              <div>
                <div className="sdk-badge__name">{dict.ecosystem.typescriptSdk}</div>
                <div className="sdk-badge__pkg">npm i @cerememory/sdk</div>
              </div>
            </div>
            <div className="sdk-badge">
              <div className="sdk-badge__icon">Rs</div>
              <div>
                <div className="sdk-badge__name">{dict.ecosystem.nativeBindings}</div>
                <div className="sdk-badge__pkg">PyO3 &middot; napi-rs</div>
              </div>
            </div>
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
        <RevealSection className="column">
          <span className="section__number">{dict.technical.number}</span>
          <h2 className="section__title">{dict.technical.title}</h2>
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
        <RevealSection className="column">
          <span className="section__number">{dict.philosophy.number}</span>
          <h2 className="section__title">{dict.philosophy.title}</h2>

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
        <div className="column">
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
              <span className="install-cmd__prompt">$</span> pip install cerememory
            </div>
            <div className="install-cmd">
              <span className="install-cmd__prompt">$</span> npm i @cerememory/sdk
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
