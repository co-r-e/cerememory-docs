'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { basePath } from '@/lib/basePath'

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

function CodeTabs() {
  const [active, setActive] = useState<'python' | 'typescript' | 'rest'>('python')

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

/* ========== HERO CANVAS BACKGROUND ========== */

const LINE_COLORS = ['#8B1A2B', '#8B1A2B', '#A8293D', '#1C1917', '#292524']

interface AnimatedLine {
  x: number
  y: number
  length: number
  angle: number
  thickness: number
  color: string
  opacity: number
  maxOpacity: number
  phase: 'fadeIn' | 'drift' | 'fadeOut'
  age: number
  fadeInDuration: number
  driftDuration: number
  fadeOutDuration: number
  dx: number
  dy: number
  dAngle: number
}

function spawnLine(w: number, h: number): AnimatedLine {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    length: 40 + Math.random() * 160,
    angle: Math.random() * Math.PI * 2,
    thickness: 0.5 + Math.random() * 1.0,
    color: LINE_COLORS[Math.floor(Math.random() * LINE_COLORS.length)],
    opacity: 0,
    maxOpacity: 0.08 + Math.random() * 0.17,
    phase: 'fadeIn',
    age: 0,
    fadeInDuration: 60 + Math.random() * 90,
    driftDuration: 180 + Math.random() * 300,
    fadeOutDuration: 60 + Math.random() * 90,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    dAngle: (Math.random() - 0.5) * 0.002,
  }
}

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const initAndAnimate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let dpr = window.devicePixelRatio || 1

    function sizeCanvas() {
      const rect = canvas!.getBoundingClientRect()
      dpr = window.devicePixelRatio || 1
      canvas!.width = rect.width * dpr
      canvas!.height = rect.height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      return rect
    }

    function calcLineCount(w: number, h: number) {
      return Math.floor(Math.min(120, Math.max(80, (w * h) / 5000)))
    }

    let rect = sizeCanvas()
    let canvasW = rect.width
    let canvasH = rect.height
    const lineCount = calcLineCount(canvasW, canvasH)

    // Initialize lines with staggered ages so canvas looks alive immediately
    const lines: AnimatedLine[] = []
    for (let i = 0; i < lineCount; i++) {
      const line = spawnLine(canvasW, canvasH)
      const totalLife = line.fadeInDuration + line.driftDuration + line.fadeOutDuration
      const startAge = Math.random() * totalLife

      if (startAge < line.fadeInDuration) {
        line.phase = 'fadeIn'
        line.age = startAge
        line.opacity = line.maxOpacity * (startAge / line.fadeInDuration)
      } else if (startAge < line.fadeInDuration + line.driftDuration) {
        line.phase = 'drift'
        line.age = startAge - line.fadeInDuration
        line.opacity = line.maxOpacity
      } else {
        line.phase = 'fadeOut'
        line.age = startAge - line.fadeInDuration - line.driftDuration
        line.opacity = line.maxOpacity * (1 - line.age / line.fadeOutDuration)
      }

      // Apply drift for the staggered age
      const driftFrames = startAge
      line.x += line.dx * driftFrames
      line.y += line.dy * driftFrames
      line.angle += line.dAngle * driftFrames

      lines.push(line)
    }

    function updateLines() {
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i]
        l.age++
        l.x += l.dx
        l.y += l.dy
        l.angle += l.dAngle

        switch (l.phase) {
          case 'fadeIn':
            l.opacity = l.maxOpacity * (l.age / l.fadeInDuration)
            if (l.age >= l.fadeInDuration) {
              l.phase = 'drift'
              l.age = 0
            }
            break
          case 'drift':
            l.opacity = l.maxOpacity
            if (l.age >= l.driftDuration) {
              l.phase = 'fadeOut'
              l.age = 0
            }
            break
          case 'fadeOut':
            l.opacity = l.maxOpacity * (1 - l.age / l.fadeOutDuration)
            if (l.age >= l.fadeOutDuration) {
              lines[i] = spawnLine(canvasW, canvasH)
            }
            break
        }
      }
    }

    function drawFrame() {
      ctx!.clearRect(0, 0, canvasW, canvasH)
      ctx!.lineCap = 'round'

      for (let i = 0; i < lines.length; i++) {
        const l = lines[i]
        if (l.opacity <= 0) continue
        const halfLen = l.length / 2
        const cos = Math.cos(l.angle)
        const sin = Math.sin(l.angle)

        ctx!.globalAlpha = l.opacity
        ctx!.strokeStyle = l.color
        ctx!.lineWidth = l.thickness
        ctx!.beginPath()
        ctx!.moveTo(l.x - cos * halfLen, l.y - sin * halfLen)
        ctx!.lineTo(l.x + cos * halfLen, l.y + sin * halfLen)
        ctx!.stroke()
      }
      ctx!.globalAlpha = 1
    }

    // Static render for reduced motion
    if (reducedMotion) {
      drawFrame()
      return () => {}
    }

    // Animation loop
    let animId: number
    function tick() {
      updateLines()
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

        const newCount = calcLineCount(canvasW, canvasH)
        while (lines.length < newCount) {
          lines.push(spawnLine(canvasW, canvasH))
        }
        while (lines.length > newCount) {
          lines.pop()
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

export default function HomeContent() {
  return (
    <>
      {/* MASTHEAD */}
      <header className="masthead">
        <div className="column column--wide masthead__inner">
          <nav>
            <ul className="masthead__nav masthead__nav--left">
              <li><a href="#architecture">Architecture</a></li>
              <li><a href="#dynamics">Dynamics</a></li>
              <li><a href="#protocol">Protocol</a></li>
            </ul>
          </nav>
          <a href="#" className="masthead__logo-link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/logo.svg`} alt="Cerememory" className="masthead__logo" />
          </a>
          <nav>
            <ul className="masthead__nav masthead__nav--right">
              <li><a href="#quickstart">Quick Start</a></li>
              <li>
                <a href="https://github.com/co-r-e/cerememory" target="_blank" rel="noopener" style={{ border: 'none' }}>
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <HeroCanvas />
        <div className="column hero__content">
          <span className="hero__version">Open Source &middot; HTTP / gRPC / MCP &middot; Rust</span>
          <h1 className="hero__title">
            A <em>Living</em> Memory Database<br />for the Age of AI
          </h1>
          <p className="hero__subtitle">
            Brain-inspired memory architecture with secure transports, persistent recall,
            and user-sovereign data ownership.
          </p>
        </div>
      </section>

      {/* ABSTRACT */}
      <section className="abstract">
        <div className="column">
          <div className="abstract__label">Abstract</div>
          <p className="abstract__text">
            Today&apos;s LLMs lose context with every conversation reset, forcing users to repeat
            themselves endlessly. <strong>Cerememory</strong> is an LLM-agnostic memory database
            built on five specialized memory stores grounded in neuroscience research. Memories are
            not merely stored &mdash; they decay over time, reactivate when related memories fire,
            and have their retention rates modulated by emotional intensity. This is not a database.
            It is a <em>living memory system</em>. With a user-sovereign, local-first design, full
            ownership of memory data is guaranteed to the user.
          </p>
          <div className="abstract__keywords">
            <strong>Keywords</strong>&ensp; Memory Database &middot; LLM &middot; Neuroscience &middot;
            Spreading Activation &middot; Decay Model &middot; Emotional Modulation &middot; Rust &middot;
            CMP Protocol
          </div>
        </div>
      </section>

      {/* §1 THE PROBLEM */}
      <section className="section" id="problem">
        <RevealSection className="column">
          <span className="section__number">&sect; 1</span>
          <h2 className="section__title">The Problem: LLM Amnesia</h2>
          <div className="section__body">
            <p>
              Every LLM today suffers from a fundamental flaw. Each time a conversation resets,
              the context window flushes, and users are forced to re-explain themselves from scratch.
              Existing memory solutions are shallow, text-only, model-specific, and vendor-controlled.
            </p>
            <p>
              Cerememory addresses this with three principles. Memory must be{' '}
              <strong>alive</strong> &mdash; not frozen at write-time, but evolving over time. It must
              be <strong>LLM-agnostic</strong> &mdash; a standardized protocol (CMP) allows any LLM to
              read and write to the memory layer. And it must be <strong>user-sovereign</strong> &mdash;
              local-first and fully exportable by design.
            </p>
          </div>
        </RevealSection>
      </section>

      <div className="sep"><div className="sep__diamond" /></div>

      {/* §2 ARCHITECTURE */}
      <section className="section section--alt" id="architecture">
        <RevealSection className="column column--wide">
          <span className="section__number">&sect; 2</span>
          <h2 className="section__title">Five-Store Architecture</h2>
          <p className="section__lead">
            Just as the human brain processes different types of memory in distinct regions,
            Cerememory distributes memories across five specialized stores.
          </p>

          <div className="figure">
            <div className="figure__content">
              <table className="stores-table">
                <thead>
                  <tr>
                    <th>Store</th>
                    <th>Brain Analog</th>
                    <th>Function</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="store-name">Episodic</span></td>
                    <td><span className="store-analog">Hippocampus</span></td>
                    <td>Temporal event logs. Records what happened, when, and where. Persistent via redb.</td>
                  </tr>
                  <tr>
                    <td><span className="store-name">Semantic</span></td>
                    <td><span className="store-analog">Neocortex</span></td>
                    <td>Graph of facts, concepts, and relationships. Stores what things mean. Typed-edge graph structure.</td>
                  </tr>
                  <tr>
                    <td><span className="store-name">Procedural</span></td>
                    <td><span className="store-analog">Basal Ganglia</span></td>
                    <td>Behavioral patterns, preferences, and skills. Learns how things are done.</td>
                  </tr>
                  <tr>
                    <td><span className="store-name">Emotional</span></td>
                    <td><span className="store-analog">Amygdala</span></td>
                    <td>Cross-cutting affective metadata. Modulates decay rates and retrieval priority across all stores.</td>
                  </tr>
                  <tr>
                    <td><span className="store-name">Working</span></td>
                    <td><span className="store-analog">Prefrontal Cortex</span></td>
                    <td>Volatile, capacity-limited, high-speed active context cache. LRU-evicted, in-memory.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="figure__caption">
              <strong>Table 1.</strong> Five memory stores and their neuroscientific analogs
            </div>
          </div>

          <div className="figure" style={{ marginTop: '3rem' }}>
            <div className="figure__content arch-diagram">
              <div className="arch-label">LLM Adapters</div>
              <div className="arch-layer">
                <div className="arch-box">Claude</div>
                <div className="arch-box">GPT</div>
                <div className="arch-box">Gemini</div>
              </div>
              <div className="arch-arrow">&darr; CMP Protocol</div>
              <div className="arch-label">Transport Layer</div>
              <div className="arch-layer">
                <div className="arch-box arch-box--primary">HTTP / REST (Axum)</div>
                <div className="arch-box arch-box--primary">gRPC (Tonic)</div>
                <div className="arch-box arch-box--primary">MCP (rmcp)</div>
              </div>
              <div className="arch-arrow">&darr;</div>
              <div className="arch-layer">
                <div className="arch-box arch-box--primary" style={{ padding: '0.9em 2.5em' }}>
                  Cerememory Engine
                </div>
              </div>
              <div className="arch-arrow">&darr;</div>
              <div className="arch-label">Hippocampal Coordinator</div>
              <div className="arch-layer">
                <div className="arch-box">Tantivy Full-Text</div>
                <div className="arch-box">HNSW Vector</div>
                <div className="arch-box">Association Graph</div>
              </div>
              <div className="arch-arrow">&darr;</div>
              <div className="arch-label">Memory Stores</div>
              <div className="arch-layer">
                <div className="arch-box arch-box--store">Episodic</div>
                <div className="arch-box arch-box--store">Semantic</div>
                <div className="arch-box arch-box--store">Procedural</div>
                <div className="arch-box arch-box--store">Emotional</div>
                <div className="arch-box arch-box--store">Working</div>
              </div>
              <div className="arch-arrow">&darr;</div>
              <div className="arch-label">Engines</div>
              <div className="arch-layer">
                <div className="arch-box">Decay Engine</div>
                <div className="arch-box">Association Engine</div>
                <div className="arch-box">Evolution Engine</div>
              </div>
            </div>
            <div className="figure__caption">
              <strong>Fig. 1.</strong> Full system architecture of Cerememory
            </div>
          </div>
        </RevealSection>
      </section>

      {/* §3 LIVING DYNAMICS */}
      <section className="section" id="dynamics">
        <RevealSection className="column">
          <span className="section__number">&sect; 3</span>
          <h2 className="section__title">Living Memory Dynamics</h2>
          <p className="section__lead">
            In a traditional database, data is static. In Cerememory, memories breathe, decay, and
            reactivate.
          </p>

          <h3 className="subsection-title">3.1 &ensp; Decay &mdash; The Forgetting Curve</h3>
          <div className="section__body">
            <p>
              Memory fidelity decreases over time following a modified power-law curve. This is not
              &ldquo;forget everything&rdquo; &mdash; it is gradual, realistic degradation. Emotional
              intensity modulates decay rates, and repeated access increases stability.
            </p>
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
              <sub>0</sub> : initial fidelity &ensp;
              <span className="var" style={{ color: 'var(--crimson)', fontStyle: 'italic' }}>
                S
              </span>{' '}
              : stability parameter &ensp;
              <span className="var" style={{ color: 'var(--crimson)', fontStyle: 'italic' }}>
                d
              </span>{' '}
              : decay exponent &ensp;
              <span className="var" style={{ color: 'var(--crimson)', fontStyle: 'italic' }}>
                E
              </span>
              <sub>mod</sub> : emotional modulation factor
            </div>
            <div className="formula__label">Eq. 1 &mdash; Power-Law Decay</div>
          </div>

          <h3 className="subsection-title">3.2 &ensp; Noise &mdash; Interference Accumulation</h3>
          <div className="section__body">
            <p>
              Similar memories blur each other&apos;s details over time. This reproduces the
              interference phenomenon observed in human memory research.
            </p>
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
              : interference rate &ensp; Noise increases as fidelity degrades
            </div>
            <div className="formula__label">Eq. 2 &mdash; Noise Accumulation</div>
          </div>

          <h3 className="subsection-title">3.3 &ensp; Emotional Modulation</h3>
          <div className="section__body">
            <p>
              An 8-dimensional emotion vector is attached to every memory, influencing decay rates,
              retrieval priority, and association strength. Emotionally intense memories are retained
              longer.
            </p>
          </div>

          <div className="figure">
            <div className="figure__content">
              <div className="emotion-wheel">
                {['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'].map(
                  (emotion) => (
                    <div key={emotion} className="emotion-axis">
                      <span className="emotion-axis__bar" />
                      {emotion}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="figure__caption">
              <strong>Fig. 2.</strong> 8-dimensional emotion vector based on Plutchik&apos;s model of
              emotions
            </div>
          </div>

          <div className="features" style={{ marginTop: '2.5rem' }}>
            <div className="feature">
              <div className="feature__icon">i</div>
              <div className="feature__title">Reactivation</div>
              <div className="feature__desc">
                Firing of related memories temporarily restores decayed ones. Based on the spreading
                activation model.
              </div>
            </div>
            <div className="feature">
              <div className="feature__icon">ii</div>
              <div className="feature__title">Reconsolidation</div>
              <div className="feature__desc">
                Recalled memories are subtly modified and reintegrated with current context.
              </div>
            </div>
            <div className="feature">
              <div className="feature__icon">iii</div>
              <div className="feature__title">Consolidation</div>
              <div className="feature__desc">
                Like sleep, episodic memories are periodically integrated and migrated into semantic
                storage.
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      <div className="sep"><div className="sep__diamond" /></div>

      {/* §4 PROTOCOL */}
      <section className="section section--alt" id="protocol">
        <RevealSection className="column column--wide">
          <span className="section__number">&sect; 4</span>
          <h2 className="section__title">Cerememory Protocol (CMP)</h2>
          <p className="section__lead">
            CMP is a standardized, transport-agnostic interface connecting any LLM to Cerememory. HTTP
            and gRPC expose the full protocol surface, while MCP provides a focused 11-tool interface
            for agent workflows.
          </p>

          <div className="protocol-grid">
            <div className="protocol-card">
              <div className="protocol-card__category">Encode</div>
              <div className="protocol-card__title">Write Memories</div>
              <ul className="protocol-card__ops">
                <li>encode.store &mdash; Store a single record</li>
                <li>encode.batch &mdash; Batch store with auto-association</li>
                <li>encode.update &mdash; Update an existing record</li>
              </ul>
            </div>
            <div className="protocol-card">
              <div className="protocol-card__category">Recall</div>
              <div className="protocol-card__title">Retrieve Memories</div>
              <ul className="protocol-card__ops">
                <li>recall.query &mdash; Multimodal retrieval</li>
                <li>recall.associate &mdash; Get associations</li>
                <li>recall.timeline &mdash; Time-series retrieval</li>
                <li>recall.graph &mdash; Subgraph retrieval</li>
              </ul>
            </div>
            <div className="protocol-card">
              <div className="protocol-card__category">Lifecycle</div>
              <div className="protocol-card__title">Memory Lifecycle</div>
              <ul className="protocol-card__ops">
                <li>lifecycle.consolidate &mdash; Trigger consolidation</li>
                <li>lifecycle.decay_tick &mdash; Run decay engine</li>
                <li>lifecycle.forget &mdash; Permanently delete</li>
                <li>lifecycle.set_mode &mdash; Human / Perfect mode</li>
              </ul>
            </div>
            <div className="protocol-card">
              <div className="protocol-card__category">Introspect</div>
              <div className="protocol-card__title">Observe State</div>
              <ul className="protocol-card__ops">
                <li>introspect.stats &mdash; System-wide statistics</li>
                <li>introspect.record &mdash; Inspect decay state</li>
                <li>introspect.decay_forecast &mdash; Fidelity prediction</li>
                <li>introspect.evolution &mdash; Evolution engine metrics</li>
              </ul>
            </div>
          </div>

          <div className="footnote">
            <sup>*</sup> Recall has two modes: <strong>Human</strong> (realistic recall with
            fidelity-weighted noise) and <strong>Perfect</strong> (complete retrieval of original
            data). Spreading activation depth is configurable, and SDKs surface query metadata,
            request IDs, and retry hints for debugging.
          </div>
        </RevealSection>
      </section>

      {/* §5 QUICK START */}
      <section className="section" id="quickstart">
        <RevealSection className="column">
          <span className="section__number">&sect; 5</span>
          <h2 className="section__title">Quick Start</h2>
          <p className="section__lead">
            Give your AI memory in just a few lines of code. Choose from Python, TypeScript, REST,
            or MCP-backed workflows.
          </p>

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

          <CodeTabs />
        </RevealSection>
      </section>

      <div className="sep"><div className="sep__diamond" /></div>

      {/* §6 ECOSYSTEM */}
      <section className="section section--alt" id="ecosystem">
        <RevealSection className="column column--wide">
          <span className="section__number">&sect; 6</span>
          <h2 className="section__title">Ecosystem &amp; SDKs</h2>

          <h3 className="subsection-title">SDKs</h3>
          <div className="sdk-row">
            <div className="sdk-badge">
              <div className="sdk-badge__icon">Py</div>
              <div>
                <div className="sdk-badge__name">Python SDK</div>
                <div className="sdk-badge__pkg">pip install cerememory</div>
              </div>
            </div>
            <div className="sdk-badge">
              <div className="sdk-badge__icon">TS</div>
              <div>
                <div className="sdk-badge__name">TypeScript SDK</div>
                <div className="sdk-badge__pkg">npm i @cerememory/sdk</div>
              </div>
            </div>
            <div className="sdk-badge">
              <div className="sdk-badge__icon">Rs</div>
              <div>
                <div className="sdk-badge__name">Native Bindings</div>
                <div className="sdk-badge__pkg">PyO3 &middot; napi-rs</div>
              </div>
            </div>
          </div>

          <h3 className="subsection-title" style={{ marginTop: '2.5rem' }}>
            LLM Adapters
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
            Capabilities
          </h3>
          <div className="features">
            {[
              {
                icon: 'M',
                title: 'Multimodal',
                desc: 'Text, image, audio, and structured blocks are supported today, with provider-backed image/audio recall and auto-embedding.',
              },
              {
                icon: 'H',
                title: 'Secure Defaults',
                desc: 'Localhost-first HTTP, Bearer auth, trusted-proxy-aware rate limiting, and enforced gRPC TLS on exposed deployments.',
              },
              {
                icon: 'O',
                title: 'Observability',
                desc: 'Opt-in protected Prometheus metrics, /health and /readiness probes, plus x-request-id correlation for production debugging.',
              },
              {
                icon: 'V',
                title: 'Vector Search',
                desc: 'Semantic similarity search via HNSW algorithm. Combined with Tantivy full-text search for hybrid retrieval.',
              },
              {
                icon: 'A',
                title: 'Spreading Activation',
                desc: 'Weighted breadth-first traversal for associative recall. Configurable decay factor, threshold, and depth.',
              },
              {
                icon: 'W',
                title: 'Workflow Stability',
                desc: 'Persisted inferred associations, safe CMA export/import flows, and rebuilt coordinators before stateful CLI operations.',
              },
            ].map((f) => (
              <div key={f.title} className="feature">
                <div className="feature__icon">{f.icon}</div>
                <div className="feature__title">{f.title}</div>
                <div className="feature__desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* §7 TECHNICAL */}
      <section className="section" id="technical">
        <RevealSection className="column">
          <span className="section__number">&sect; 7</span>
          <h2 className="section__title">Technical Foundation</h2>
          <div className="section__body">
            <p>
              Cerememory&apos;s core engine is implemented in <strong>Rust</strong> &mdash; the only
              choice that delivers memory safety, zero-cost concurrency, and predictable performance.
              Tokio handles async I/O while Rayon powers CPU-intensive operations like decay
              computation and spreading activation, with thread pools optimally separated by workload
              characteristics.
            </p>
          </div>

          <div className="features" style={{ marginTop: '2rem' }}>
            {[
              { title: 'redb', desc: 'Embedded key-value store with ACID transactions. Zero-copy reads for maximum throughput.' },
              { title: 'Tantivy', desc: 'Rust-native Lucene equivalent. High-performance full-text search index.' },
              { title: 'hnsw_rs', desc: 'Lightweight embedded HNSW. High-dimensional approximate nearest neighbor search.' },
              { title: 'MessagePack', desc: 'Compact binary serialization. Fast internal data transfer with minimal overhead.' },
              { title: 'Axum + Tonic', desc: 'Transport layer supporting both HTTP/REST and gRPC protocols.' },
              { title: 'SQLite (CMA)', desc: 'Universal single-file archive format. Full data portability with optional encryption.' },
            ].map((f) => (
              <div key={f.title} className="feature">
                <div className="feature__title">{f.title}</div>
                <div className="feature__desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      <div className="sep"><div className="sep__diamond" /></div>

      {/* §8 PHILOSOPHY */}
      <section className="section section--alt" id="philosophy">
        <RevealSection className="column">
          <span className="section__number">&sect; 8</span>
          <h2 className="section__title">Design Philosophy</h2>

          <div className="philosophy-quote">
            <p>
              Memory is the foundation of identity. A system that stores, evolves, and retrieves the
              accumulated context of a person&apos;s interaction with AI is too important to be
              controlled by any single entity.
            </p>
            <cite>&mdash; Cerememory Whitepaper</cite>
          </div>

          <div className="principles">
            {[
              {
                num: 'I',
                title: 'User Sovereignty',
                desc: 'Local-first. Fully exportable. Ownership of memory data always belongs to the user.',
              },
              {
                num: 'II',
                title: 'No Vendor Lock-in',
                desc: 'LLM-agnostic protocol. Claude, GPT, Gemini \u2014 any model can share the same memory layer.',
              },
              {
                num: 'III',
                title: 'Living Data',
                desc: 'Memories breathe. Decay, interference, reactivation, consolidation \u2014 not static storage, but a dynamic memory system.',
              },
              {
                num: 'IV',
                title: 'Brain-Inspired',
                desc: 'Grounded in neuroscience research. Faithfully models the five subsystems of human memory.',
              },
            ].map((p) => (
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
          <h2 className="cta__title">Give Your AI a Memory</h2>
          <p className="cta__desc">
            Cerememory is open source. Get started now and give your AI systems persistent, evolving
            memory.
          </p>
          <div className="cta__buttons">
            <a
              href="https://github.com/co-r-e/cerememory"
              className="btn btn--primary"
              target="_blank"
              rel="noopener"
            >
              GitHub Repository
            </a>
            <a href="#quickstart" className="btn btn--secondary">
              Quick Start Guide
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
              <li><a href={`${basePath}/docs`}>Docs</a></li>
              <li>
                <a href="https://github.com/co-r-e/cerememory" target="_blank" rel="noopener">
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/co-r-e/cerememory/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener"
                >
                  Contributing
                </a>
              </li>
              <li><a href="#protocol">CMP Spec</a></li>
              <li><a href="#architecture">Architecture</a></li>
            </ul>
          </div>
          <div className="footer__copy">Open Source &middot; MIT License &middot; Built with Rust</div>
        </div>
      </footer>
    </>
  )
}
