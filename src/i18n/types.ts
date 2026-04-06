export interface Dictionary {
  meta: { title: string; description: string }
  nav: {
    architecture: string
    dynamics: string
    protocol: string
    quickStart: string
    github: string
  }
  hero: {
    titlePre: string
    titleEm: string
    titlePost: string
    subtitle: string
  }
  abstract: {
    label: string
    text: string
    keywordsLabel: string
    keywords: string
  }
  problem: {
    number: string
    title: string
    para1: string
    para2Pre: string
    alive: string
    aliveDesc: string
    llmAgnostic: string
    llmAgnosticDesc: string
    userSovereign: string
    userSovereignDesc: string
  }
  architecture: {
    number: string
    title: string
    lead: string
    tableHeaders: { store: string; brainAnalog: string; function: string }
    stores: {
      episodic: { name: string; analog: string; desc: string }
      semantic: { name: string; analog: string; desc: string }
      procedural: { name: string; analog: string; desc: string }
      emotional: { name: string; analog: string; desc: string }
      working: { name: string; analog: string; desc: string }
    }
    tableCaption: string
    diagram: {
      llmAdapters: string
      transportLayer: string
      cerememoryEngine: string
      hippocampalCoordinator: string
      memoryStores: string
      engines: string
      decayEngine: string
      associationEngine: string
      evolutionEngine: string
      tantivyFullText: string
      hnswVector: string
      associationGraph: string
      figCaption: string
    }
  }
  dynamics: {
    number: string
    title: string
    lead: string
    decay: {
      title: string
      desc: string
      initialFidelity: string
      stabilityParam: string
      decayExponent: string
      emotionalModFactor: string
      eqLabel: string
    }
    noise: {
      title: string
      desc: string
      interferenceRate: string
      eqLabel: string
    }
    emotional: {
      title: string
      desc: string
      emotions: string[]
      figCaption: string
    }
    features: {
      reactivation: { title: string; desc: string }
      reconsolidation: { title: string; desc: string }
      consolidation: { title: string; desc: string }
    }
  }
  protocol: {
    number: string
    title: string
    lead: string
    encode: { category: string; title: string; ops: string[] }
    recall: { category: string; title: string; ops: string[] }
    lifecycle: { category: string; title: string; ops: string[] }
    introspect: { category: string; title: string; ops: string[] }
    footnote: string
  }
  quickStart: {
    number: string
    title: string
    lead: string
  }
  ecosystem: {
    number: string
    title: string
    sdksTitle: string
    pythonSdk: string
    typescriptSdk: string
    nativeBindings: string
    llmAdaptersTitle: string
    capabilitiesTitle: string
    capabilities: Array<{ icon: string; title: string; desc: string }>
  }
  technical: {
    number: string
    title: string
    body: string
    tools: Array<{ title: string; desc: string }>
  }
  philosophy: {
    number: string
    title: string
    quote: string
    quoteAttribution: string
    principles: Array<{ num: string; title: string; desc: string }>
  }
  cta: {
    title: string
    desc: string
    githubButton: string
    quickStartButton: string
  }
  footer: {
    docs: string
    github: string
    contributing: string
    cmpSpec: string
    architecture: string
    copy: string
  }
  langSwitcher: { label: string }
}
