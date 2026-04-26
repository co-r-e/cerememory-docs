import type { Dictionary } from './types'

export const en: Dictionary = {
  meta: {
    title: 'Cerememory \u2013 A Living Memory Database for the Age of AI',
    description:
      'Cerememory is an open-source, neuroscience-inspired memory database that gives AI systems persistent, evolving memory. LLM-agnostic. User-sovereign. Brain-inspired.',
  },
  nav: {
    architecture: 'Architecture',
    dynamics: 'Dynamics',
    protocol: 'Protocol',
    quickStart: 'Quick Start',
    github: 'GitHub',
  },
  hero: {
    titlePre: 'A ',
    titleEm: 'Living',
    titlePost: ' Memory Database\nfor the Age of AI',
    subtitle:
      'Brain-inspired memory architecture with secure transports, persistent recall, and user-sovereign data ownership.',
  },
  abstract: {
    label: 'Abstract',
    text: "Today\u2019s LLMs lose context with every conversation reset, forcing users to repeat themselves endlessly. <strong>Cerememory</strong> is an LLM-agnostic memory database built on five specialized memory stores grounded in neuroscience research. Memories are not merely stored \u2013 they decay over time, reactivate when related memories fire, and have their retention rates modulated by emotional intensity. Every record carries a structured <strong>meta-memory</strong> plane that records <em>why</em> it exists \u2013 intent, rationale, evidence, alternatives, and a typed context graph. This is not a database. It is a <em>living memory system</em>. With a user-sovereign, local-first design, full ownership of memory data is guaranteed to the user.",
    keywordsLabel: 'Keywords',
    keywords:
      'Memory Database \u00b7 LLM \u00b7 Neuroscience \u00b7 Spreading Activation \u00b7 Decay Model \u00b7 Meta-Memory \u00b7 Raw Journal \u00b7 Rust \u00b7 CMP Protocol',
  },
  problem: {
    number: '\u00a7 1',
    title: 'The Problem: LLM Amnesia',
    para1:
      'Every LLM today suffers from a fundamental flaw. Each time a conversation resets, the context window flushes, and users are forced to re-explain themselves from scratch. Existing memory solutions are shallow, text-only, model-specific, and vendor-controlled.',
    para2Pre: 'Cerememory addresses this with three principles. Memory must be ',
    alive: 'alive',
    aliveDesc:
      ' \u2013 not frozen at write-time, but evolving over time. It must be ',
    llmAgnostic: 'LLM-agnostic',
    llmAgnosticDesc:
      ' \u2013 a standardized protocol (CMP) allows any LLM to read and write to the memory layer. And it must be ',
    userSovereign: 'user-sovereign',
    userSovereignDesc:
      ' \u2013 local-first and fully exportable by design.',
  },
  architecture: {
    number: '\u00a7 2',
    title: 'Five-Store Architecture',
    lead: 'Just as the human brain processes different types of memory in distinct regions, Cerememory distributes memories across five specialized stores.',
    tableHeaders: {
      store: 'Store',
      brainAnalog: 'Brain Analog',
      function: 'Function',
    },
    stores: {
      episodic: {
        name: 'Episodic',
        analog: 'Hippocampus',
        desc: 'Temporal event logs. Records what happened, when, and where. Persistent via redb.',
      },
      semantic: {
        name: 'Semantic',
        analog: 'Neocortex',
        desc: 'Graph of facts, concepts, and relationships. Stores what things mean. Typed-edge graph structure.',
      },
      procedural: {
        name: 'Procedural',
        analog: 'Basal Ganglia',
        desc: 'Behavioral patterns, preferences, and skills. Learns how things are done.',
      },
      emotional: {
        name: 'Emotional',
        analog: 'Amygdala',
        desc: 'Cross-cutting affective metadata. Modulates decay rates and retrieval priority across all stores.',
      },
      working: {
        name: 'Working',
        analog: 'Prefrontal Cortex',
        desc: 'Volatile, capacity-limited, high-speed active context cache. LRU-evicted, in-memory.',
      },
    },
    tableCaption:
      '<strong>Table 1.</strong> Five memory stores and their neuroscientific analogs',
    diagram: {
      llmAdapters: 'LLM Layer · Clients & Adapters',
      transportLayer: 'Transport Bindings',
      cerememoryEngine: 'Cerememory Engine (orchestrator)',
      hippocampalCoordinator: 'Hippocampal Coordinator · cross-store indexes',
      memoryStores: 'Storage Plane · 5 curated stores + raw journal',
      rawJournalBox: 'Raw Journal · verbatim + Tantivy',
      supportingEnginesNote: 'Supporting engines run alongside the engine and operate on every store.',
      engines: 'Supporting Engines',
      decayEngine: 'Decay Engine',
      associationEngine: 'Association Engine',
      evolutionEngine: 'Evolution Engine',
      tantivyFullText: 'Tantivy Full-Text',
      hnswVector: 'HNSW Vector',
      associationGraph: 'Association Graph',
      figCaption: '<strong>Fig. 1.</strong> Cerememory system architecture · meta-memory is a cross-cutting plane attached to every record',
    },
  },
  dynamics: {
    number: '\u00a7 3',
    title: 'Living Memory Dynamics',
    lead: 'In a traditional database, data is static. In Cerememory, memories breathe, decay, and reactivate.',
    decay: {
      title: '3.1 \u2003 Decay \u2013 The Forgetting Curve',
      desc: 'Memory fidelity decreases over time following a modified power-law curve. This is not "forget everything" \u2013 it is gradual, realistic degradation. Emotional intensity modulates decay rates, and repeated access increases stability.',
      initialFidelity: 'initial fidelity',
      stabilityParam: 'stability parameter',
      decayExponent: 'decay exponent',
      emotionalModFactor: 'emotional modulation factor',
      eqLabel: 'Eq. 1 \u2013 Power-Law Decay',
    },
    noise: {
      title: '3.2 \u2003 Noise \u2013 Interference Accumulation',
      desc: "Similar memories blur each other\u2019s details over time. This reproduces the interference phenomenon observed in human memory research.",
      interferenceRate:
        'interference rate \u2003 Noise increases as fidelity degrades',
      eqLabel: 'Eq. 2 \u2013 Noise Accumulation',
    },
    emotional: {
      title: '3.3 \u2003 Emotional Modulation',
      desc: 'An 8-dimensional emotion vector is attached to every memory, influencing decay rates, retrieval priority, and association strength. Emotionally intense memories are retained longer.',
      emotions: [
        'joy',
        'trust',
        'fear',
        'surprise',
        'sadness',
        'disgust',
        'anger',
        'anticipation',
      ],
      figCaption:
        "<strong>Fig. 2.</strong> 8-dimensional emotion vector based on Plutchik\u2019s model of emotions",
    },
    features: {
      reactivation: {
        title: 'Reactivation',
        desc: 'Firing of related memories temporarily restores decayed ones. Based on the spreading activation model.',
      },
      reconsolidation: {
        title: 'Reconsolidation',
        desc: 'Recalled memories are subtly modified and reintegrated with current context.',
      },
      consolidation: {
        title: 'Consolidation',
        desc: 'Like sleep, episodic memories are periodically integrated and migrated into semantic storage.',
      },
    },
  },
  protocol: {
    number: '\u00a7 4',
    title: 'Cerememory Protocol (CMP)',
    lead: 'CMP is the single, transport-agnostic protocol spoken by Cerememory. HTTP, gRPC, and MCP are three transport bindings that carry the same CMP messages \u2013 not competing APIs. HTTP and gRPC expose the full protocol surface; MCP is a curated 15-tool binding tailored for LLM agents.',
    hierarchy: {
      caption: 'One protocol, three transports',
      clients: 'LLM Clients',
      clientsDesc: 'Claude \u00b7 GPT \u00b7 Gemini \u00b7 Agents',
      transports: 'Transport Bindings',
      transportsDesc: 'Three ways to speak CMP',
      http: 'HTTP / REST',
      httpDesc: 'Full surface \u00b7 browsers, services',
      grpc: 'gRPC',
      grpcDesc: 'Full surface \u00b7 streaming, low-latency',
      mcp: 'MCP',
      mcpDesc: 'Curated 15-tool subset \u00b7 Claude Code, Codex CLI, Cursor, any MCP client',
      cmp: 'CMP \u2013 Cerememory Protocol',
      cmpDesc: 'Unified message format: encode \u00b7 recall \u00b7 lifecycle \u00b7 introspect',
      engine: 'Cerememory Engine',
      engineDesc: 'Five memory stores, decay, association, evolution',
      figCaption: '<strong>Fig. 3.</strong> CMP vs. MCP \u2013 MCP is one transport for CMP, not a separate protocol',
    },
    encode: {
      category: 'Encode',
      title: 'Write Memories',
      ops: [
        'encode.store \u2013 Store a single record',
        'encode.batch \u2013 Batch store with auto-association',
        'encode.update \u2013 Update an existing record',
        'encode.store_raw \u2013 Store verbatim journal entry',
        'encode.batch_raw \u2013 Batch store journal entries',
      ],
    },
    recall: {
      category: 'Recall',
      title: 'Retrieve Memories',
      ops: [
        'recall.query \u2013 Multimodal retrieval',
        'recall.associate \u2013 Get associations',
        'recall.timeline \u2013 Time-series retrieval',
        'recall.graph \u2013 Subgraph retrieval',
        'recall.raw_query \u2013 Forensic journal recall',
      ],
    },
    lifecycle: {
      category: 'Lifecycle',
      title: 'Memory Lifecycle',
      ops: [
        'lifecycle.consolidate \u2013 Trigger consolidation',
        'lifecycle.decay_tick \u2013 Run decay engine',
        'lifecycle.dream_tick \u2013 Summarize journal to memory',
        'lifecycle.forget \u2013 Permanently delete',
        'lifecycle.set_mode \u2013 Human / Perfect mode',
      ],
    },
    introspect: {
      category: 'Introspect',
      title: 'Observe State',
      ops: [
        'introspect.stats \u2013 System-wide statistics',
        'introspect.record \u2013 Inspect decay state',
        'introspect.decay_forecast \u2013 Fidelity prediction',
        'introspect.evolution \u2013 Evolution engine metrics',
      ],
    },
    footnote:
      'Recall has two modes: <strong>Human</strong> (realistic recall with fidelity-weighted noise) and <strong>Perfect</strong> (complete retrieval of original data). Spreading activation depth is configurable. Every transport returns query metadata, x-request-id correlation, and retry hints to make production debugging straightforward.',
  },
  quickStart: {
    number: '\u00a7 5',
    title: 'Quick Start',
    lead: 'Build one binary from source, start the shared HTTP server, then point every MCP client at it.',
  },
  ecosystem: {
    number: '\u00a7 6',
    title: 'Integration Points',
    integrationsTitle: 'Transports',
    integrations: [
      {
        tag: 'MCP',
        name: 'MCP clients',
        desc: 'Recommended path. `cerememory mcp --server-url` proxies to the shared HTTP server. Works with Claude Code, Codex CLI, Cursor, Cline, Windsurf, Zed, Continue, and any other MCP-compatible client.',
      },
      {
        tag: 'HTTP',
        name: 'HTTP / REST',
        desc: 'Full CMP surface for browsers, services, and any HTTP client.',
      },
      {
        tag: 'gRPC',
        name: 'gRPC',
        desc: 'Streaming, low latency, TLS-enforced transport for production.',
      },
    ],
    llmAdaptersTitle: 'LLM Adapters',
    capabilitiesTitle: 'Capabilities',
    capabilities: [
      {
        icon: 'M',
        title: 'Multimodal',
        desc: 'Text, image, audio, and structured blocks are supported today, with provider-backed image/audio recall and auto-embedding.',
      },
      {
        icon: 'H',
        title: 'Secure Defaults',
        desc: 'Localhost-first HTTP, Bearer auth, trusted-proxy-aware rate limiting, optional at-rest store encryption (ChaCha20-Poly1305), tamper-evident JSONL audit log, and enforced gRPC TLS on exposed deployments.',
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
      {
        icon: '?',
        title: 'Meta-Memory Plane',
        desc: 'Every record carries structured intent, rationale, evidence, alternatives, decisions, and a typed context graph. recall.query indexes the why plane so agents can search reasoning, not just content.',
      },
      {
        icon: 'R',
        title: 'Raw Journal & Dream Tick',
        desc: 'Verbatim conversation, tool I/O, and scratchpad capture in a separate forensic plane. dream_tick groups raw entries by topic and summarizes them into curated episodic and semantic memory.',
      },
    ],
  },
  technical: {
    number: '\u00a7 7',
    title: 'Technical Foundation',
    body: "Cerememory\u2019s core engine is implemented in <strong>Rust</strong> \u2013 the only choice that delivers memory safety, zero-cost concurrency, and predictable performance. Tokio handles async I/O while Rayon powers CPU-intensive operations like decay computation and spreading activation, with thread pools optimally separated by workload characteristics.",
    tools: [
      {
        title: 'redb',
        desc: 'Embedded key-value store with ACID transactions. Zero-copy reads for maximum throughput.',
      },
      {
        title: 'Tantivy',
        desc: 'Rust-native Lucene equivalent. High-performance full-text search index.',
      },
      {
        title: 'hnsw_rs',
        desc: 'Lightweight embedded HNSW. High-dimensional approximate nearest neighbor search.',
      },
      {
        title: 'MessagePack',
        desc: 'Compact binary serialization. Fast internal data transfer with minimal overhead.',
      },
      {
        title: 'Axum + Tonic + rmcp',
        desc: 'HTTP/REST, gRPC, and MCP stdio transports all served from the same engine.',
      },
      {
        title: 'JSON Lines CMA',
        desc: 'Inspectable single-file archive bundle with optional ChaCha20-Poly1305 + Argon2id encryption. Full data portability.',
      },
    ],
  },
  philosophy: {
    number: '\u00a7 8',
    title: 'Design Philosophy',
    quote:
      'Memory is the foundation of identity. A system that stores, evolves, and retrieves the accumulated context of a person\u2019s interaction with AI is too important to be controlled by any single entity.',
    quoteAttribution: '\u2013 Cerememory Whitepaper',
    principles: [
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
    ],
  },
  cta: {
    title: 'Give Your AI a Memory',
    desc: 'Cerememory is open source. Get started now and give your AI systems persistent, evolving memory.',
    githubButton: 'GitHub Repository',
    quickStartButton: 'Quick Start Guide',
  },
  footer: {
    docs: 'Docs',
    github: 'GitHub',
    contributing: 'Contributing',
    cmpSpec: 'CMP Spec',
    architecture: 'Architecture',
    copy: 'Open Source \u00b7 MIT License \u00b7 Built with Rust',
  },
  langSwitcher: { label: 'EN' },
}
