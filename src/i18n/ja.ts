import type { Dictionary } from './types'

export const ja: Dictionary = {
  meta: {
    title: 'Cerememory \u2013 AI時代の生きた記憶データベース',
    description:
      'Cerememory は、神経科学に基づくオープンソースの記憶データベースです。AIシステムに永続的で進化する記憶を提供します。LLM非依存。ユーザー主権。脳にインスパイアされた設計。',
  },
  nav: {
    architecture: 'アーキテクチャ',
    dynamics: 'ダイナミクス',
    protocol: 'プロトコル',
    quickStart: 'クイックスタート',
    github: 'GitHub',
  },
  hero: {
    titlePre: 'AI時代の',
    titleEm: '生きた',
    titlePost: '記憶データベース',
    subtitle:
      '脳に着想を得た記憶アーキテクチャ。安全なトランスポート、永続的な想起、そしてユーザー主権のデータ所有権。',
  },
  abstract: {
    label: 'アブストラクト',
    text: '現在の LLM は会話がリセットされるたびにコンテキストを失い、ユーザーは同じ説明を何度も繰り返さなければなりません。<strong>Cerememory</strong> は、神経科学研究に基づく5つの専門記憶ストアで構成された、LLM 非依存の記憶データベースです。記憶は単に保存されるだけでなく、時間とともに減衰し、関連する記憶が発火すると再活性化し、感情の強度によって保持率が変化します。さらに各レコードには、その記憶が <em>なぜ</em> 存在するのかを記録する構造化された <strong>メタメモリ</strong> プレーン（意図、根拠、エビデンス、代替案、型付きコンテキストグラフ）が付随します。これはデータベースではありません。<em>生きた記憶システム</em>です。ユーザー主権のローカルファースト設計により、記憶データの完全な所有権がユーザーに保証されます。',
    keywordsLabel: 'キーワード',
    keywords:
      'Memory Database \u00b7 LLM \u00b7 Neuroscience \u00b7 Spreading Activation \u00b7 Decay Model \u00b7 Meta-Memory \u00b7 Raw Journal \u00b7 Rust \u00b7 CMP Protocol',
  },
  problem: {
    number: '\u00a7 1',
    title: '問題提起: LLM の健忘症',
    para1:
      '現在のすべての LLM は根本的な欠陥を抱えています。会話がリセットされるたびにコンテキストウィンドウは消去され、ユーザーはゼロから説明し直すことを強いられます。既存のメモリソリューションは表面的で、テキストのみ対応、特定モデル専用、そしてベンダー管理下にあります。',
    para2Pre:
      'Cerememory はこれを3つの原則で解決します。記憶は',
    alive: '生きている',
    aliveDesc:
      'こと \u2013 書き込み時に固定されるのではなく、時間とともに変化するものであること。',
    llmAgnostic: 'LLM 非依存',
    llmAgnosticDesc:
      'であること \u2013 標準化されたプロトコル（CMP）により、あらゆる LLM が記憶層の読み書きを行えること。そして',
    userSovereign: 'ユーザー主権',
    userSovereignDesc:
      'であること \u2013 ローカルファーストで、完全にエクスポート可能な設計であること。',
  },
  architecture: {
    number: '\u00a7 2',
    title: '5ストアアーキテクチャ',
    lead: '人間の脳が異なる種類の記憶を異なる領域で処理するように、Cerememory は記憶を5つの専門ストアに分散させます。',
    tableHeaders: {
      store: 'ストア',
      brainAnalog: '脳の対応部位',
      function: '機能',
    },
    stores: {
      episodic: {
        name: 'Episodic',
        analog: 'Hippocampus (海馬)',
        desc: '時系列のイベントログ。何が、いつ、どこで起きたかを記録。redb による永続化。',
      },
      semantic: {
        name: 'Semantic',
        analog: 'Neocortex (大脳新皮質)',
        desc: '事実、概念、関係性のグラフ。物事の意味を格納。型付きエッジによるグラフ構造。',
      },
      procedural: {
        name: 'Procedural',
        analog: 'Basal Ganglia (大脳基底核)',
        desc: '行動パターン、嗜好、スキル。物事のやり方を学習。',
      },
      emotional: {
        name: 'Emotional',
        analog: 'Amygdala (扁桃体)',
        desc: '横断的な感情メタデータ。すべてのストアの減衰率と検索優先度を調整。',
      },
      working: {
        name: 'Working',
        analog: 'Prefrontal Cortex (前頭前皮質)',
        desc: '揮発性で容量制限のある高速アクティブコンテキストキャッシュ。LRU 方式で退避、インメモリ動作。',
      },
    },
    tableCaption:
      '<strong>Table 1.</strong> 5つの記憶ストアと神経科学的な対応部位',
    diagram: {
      llmAdapters: 'LLM レイヤー · クライアント & アダプター',
      transportLayer: 'トランスポートバインディング',
      cerememoryEngine: 'Cerememory Engine（オーケストレーター）',
      hippocampalCoordinator: '海馬コーディネーター · ストア横断インデックス',
      memoryStores: 'ストレージプレーン · 5 つのキュレートストア + 生ジャーナル',
      rawJournalBox: '生ジャーナル · 原文 + Tantivy',
      supportingEnginesNote: 'サポートエンジンはエンジンと並列で動作し、すべてのストアに作用します。',
      engines: 'サポートエンジン',
      decayEngine: 'Decay Engine',
      associationEngine: 'Association Engine',
      evolutionEngine: 'Evolution Engine',
      tantivyFullText: 'Tantivy Full-Text',
      hnswVector: 'HNSW Vector',
      associationGraph: 'Association Graph',
      figCaption: '<strong>Fig. 1.</strong> Cerememory のシステムアーキテクチャ · メタメモリはすべてのレコードに紐づく横断プレーン',
    },
  },
  dynamics: {
    number: '\u00a7 3',
    title: '記憶ダイナミクス',
    lead: '従来のデータベースではデータは静的です。Cerememory では、記憶は呼吸し、減衰し、再活性化します。',
    decay: {
      title: '減衰 \u2013 忘却曲線',
      desc: '記憶の忠実度は、修正べき乗則曲線に従って時間とともに低下します。これは「すべてを忘れる」のではなく、段階的で現実的な劣化です。感情の強度が減衰率を調整し、繰り返しのアクセスが安定性を高めます。',
      initialFidelity: '初期忠実度',
      stabilityParam: '安定性パラメータ',
      decayExponent: '減衰指数',
      emotionalModFactor: '感情調整係数',
      eqLabel: 'Eq. 1 \u2013 べき乗則減衰',
    },
    noise: {
      title: 'ノイズ \u2013 干渉の蓄積',
      desc: '類似した記憶は時間の経過とともに互いの詳細をぼかします。これは人間の記憶研究で観察される干渉現象を再現しています。',
      interferenceRate:
        '干渉率 \u2003 忠実度の低下に伴いノイズが増加',
      eqLabel: 'Eq. 2 \u2013 ノイズ蓄積',
    },
    dream: {
      title: 'ドリーム処理 \u2013 夢のような記憶圧縮',
      lead: '睡眠中、脳は一日の出来事を再生し、刹那的な体験を永続的な知識へと統合します。Cerememory は同じパイプラインを再現します。生ジャーナルは会話、ツール I/O、スクラッチパッドを原文のまま保持し、dream_tick ライフサイクルがそれらをトピック単位（時間ギャップと語彙シフト）にグルーピング、各グループを要約してエピソード記憶へ書き出し、さらに事実性の高い内容は意味記憶へ条件付きで昇格させます \u2014 常に原文へのバックリンク付きで。',
      pipelineLabel: 'ドリームパイプライン',
      pipelineRaw: '生ジャーナル \u00b7 原文',
      pipelineGrouping: 'トピック分割 \u00b7 時間 + 語彙シフト',
      pipelineSummary: 'dream_tick \u00b7 機密度に応じた要約',
      pipelineCurated: 'Episodic + Semantic \u00b7 バックリンク付き',
      properties: [
        {
          title: '機密度・可視性を尊重',
          desc: '要約入力に取り込まれるのは `Normal` 可視性のレコードのみ。`secret` 機密度は完全除外、`sealed` / `private_scratch` 可視性は統計上カウントされるが本文は要約に渡されない。',
        },
        {
          title: 'トピック分割',
          desc: '明示的な `topic_id` を持つレコードを優先してグループ化。無い場合はセッション単位で時間ギャップ (45分ハード分割、または10分超 + トークン重複率 8% 未満) で分割し、上位語彙から topic_hint を推定する。',
        },
        {
          title: '条件付き意味昇格',
          desc: '`promote_semantic=true` かつ、グループ内に 2 件以上の `Normal` レコードと明示／推定トピックシグナルがある場合に限り、要約が意味記憶へ昇格する。',
        },
        {
          title: '双方向バックリンク',
          desc: '生ジャーナル各レコードへ `derived_memory_ids` が刻まれ、要約レコードはエピソード\u2192意味記憶への関連も保持。フォレンジック想起は 1 ホップで原文に到達する。',
        },
        {
          title: 'バックグラウンド／オンデマンド',
          desc: '`dream.background_interval_secs` (デフォルト 86400 秒 = 24 時間) で自律実行、`lifecycle.dream_tick` CMP・MCP ツール・`cerememory dream-tick` CLI で明示実行。',
        },
      ],
    },
    emotional: {
      title: '感情モジュレーション',
      desc: '8次元の感情ベクトルがすべての記憶に付与され、減衰率、検索優先度、連想強度に影響を与えます。感情的に強い記憶はより長く保持されます。',
      emotions: [
        '喜び',
        '信頼',
        '恐れ',
        '驚き',
        '悲しみ',
        '嫌悪',
        '怒り',
        '期待',
      ],
      figCaption:
        '<strong>Fig. 2.</strong> Plutchik の感情モデルに基づく8次元感情ベクトル',
    },
    features: {
      reactivation: {
        title: '再活性化',
        desc: '関連する記憶の発火により、減衰した記憶が一時的に復元されます。拡散活性化モデルに基づく仕組みです。',
      },
      reconsolidation: {
        title: '再固定化',
        desc: '想起された記憶は微妙に修正され、現在のコンテキストと再統合されます。',
      },
      consolidation: {
        title: '固定化',
        desc: '睡眠のように、エピソード記憶は定期的に統合され、意味記憶ストレージへ移行されます。',
      },
    },
  },
  protocol: {
    number: '\u00a7 4',
    title: 'Cerememory Protocol (CMP)',
    lead: 'CMP は Cerememory が話す唯一のトランスポート非依存プロトコルです。HTTP / gRPC / MCP は競合する API ではなく、同じ CMP メッセージを運ぶ3つのトランスポートバインディングです。HTTP と gRPC は CMP の全面を公開し、MCP は LLM エージェント向けに選定された15ツールのサブセットを提供します。',
    hierarchy: {
      caption: '1つのプロトコル、3つのトランスポート',
      clients: 'LLM クライアント',
      clientsDesc: 'Claude \u00b7 GPT \u00b7 Gemini \u00b7 エージェント',
      transports: 'トランスポートバインディング',
      transportsDesc: 'CMP を話す3つの経路',
      http: 'HTTP / REST',
      httpDesc: '全面公開 \u00b7 ブラウザ・サービス向け',
      grpc: 'gRPC',
      grpcDesc: '全面公開 \u00b7 ストリーミング・低レイテンシ',
      mcp: 'MCP',
      mcpDesc: '15ツールに絞ったサブセット \u00b7 Claude Code、Codex CLI、Cursor など任意のMCPクライアント',
      cmp: 'CMP \u2013 Cerememory Protocol',
      cmpDesc: '統一メッセージ形式: encode \u00b7 recall \u00b7 lifecycle \u00b7 introspect',
      engine: 'Cerememory エンジン',
      engineDesc: '5つの記憶ストア、減衰、連想、進化',
      figCaption: '<strong>Fig. 3.</strong> CMP と MCP \u2013 MCP は CMP を運ぶ1つのトランスポートであり、別プロトコルではない',
    },
    encode: {
      category: 'Encode',
      title: '記憶の書き込み',
      ops: [
        'encode.store \u2013 単一レコードの保存',
        'encode.batch \u2013 自動連想付きバッチ保存',
        'encode.update \u2013 既存レコードの更新',
        'encode.store_raw \u2013 生ジャーナルの原文保存',
        'encode.batch_raw \u2013 ジャーナルのバッチ保存',
      ],
    },
    recall: {
      category: 'Recall',
      title: '記憶の検索',
      ops: [
        'recall.query \u2013 マルチモーダル検索',
        'recall.associate \u2013 連想の取得',
        'recall.timeline \u2013 時系列検索',
        'recall.graph \u2013 サブグラフ検索',
        'recall.raw_query \u2013 ジャーナルのフォレンジック検索',
      ],
    },
    lifecycle: {
      category: 'Lifecycle',
      title: '記憶のライフサイクル',
      ops: [
        'lifecycle.consolidate \u2013 固定化の実行',
        'lifecycle.decay_tick \u2013 減衰エンジンの実行',
        'lifecycle.dream_tick \u2013 ジャーナルから記憶への要約',
        'lifecycle.forget \u2013 完全な削除',
        'lifecycle.set_mode \u2013 Human / Perfect モード',
      ],
    },
    introspect: {
      category: 'Introspect',
      title: '状態の観測',
      ops: [
        'introspect.stats \u2013 システム全体の統計',
        'introspect.record \u2013 減衰状態の検査',
        'introspect.decay_forecast \u2013 忠実度の予測',
        'introspect.evolution \u2013 Evolution Engine のメトリクス',
      ],
    },
    footnote:
      'Recall には2つのモードがあります。<strong>Human</strong>（忠実度に応じたノイズを伴う現実的な想起）と <strong>Perfect</strong>（元データの完全な検索）です。拡散活性化の深度は設定可能で、各トランスポートはクエリメタデータ、x-request-id による相関、リトライヒントを返却し本番デバッグを容易にします。',
  },
  quickStart: {
    number: '\u00a7 5',
    title: 'クイックスタート',
    lead: 'ソースから 1 本のバイナリをビルドし、共有の HTTP サーバーを起動。各 MCP クライアントはその共有サーバーへプロキシ接続します。',
  },
  ecosystem: {
    number: '\u00a7 6',
    title: '統合ポイント',
    integrationsTitle: 'トランスポート',
    integrations: [
      {
        tag: 'MCP',
        name: 'MCP クライアント',
        desc: '推奨経路。`cerememory mcp --server-url` で共有 HTTP サーバーへプロキシ接続。Claude Code / Codex CLI / Cursor / Cline / Windsurf / Zed / Continue など任意の MCP クライアントで動作。',
      },
      {
        tag: 'HTTP',
        name: 'HTTP / REST',
        desc: 'ブラウザ、サービス、任意の HTTP クライアントから CMP の全面へアクセス。',
      },
      {
        tag: 'gRPC',
        name: 'gRPC',
        desc: 'ストリーミング、低レイテンシ、TLS 強制の本番向けトランスポート。',
      },
    ],
    llmAdaptersTitle: 'LLM Adapters',
    capabilitiesTitle: '主な機能',
    capabilities: [
      {
        icon: 'M',
        title: 'マルチモーダル',
        desc: 'テキスト、画像、音声、構造化ブロックに対応。プロバイダー連携による画像・音声の想起と自動エンベディングをサポート。',
      },
      {
        icon: 'H',
        title: 'セキュアデフォルト',
        desc: 'Localhost ファースト HTTP、Bearer 認証、信頼プロキシ対応のレート制限、任意の at-rest ストア暗号化（ChaCha20-Poly1305）、改ざん検知付き JSONL 監査ログ、公開デプロイでの gRPC TLS 強制。',
      },
      {
        icon: 'O',
        title: 'オブザーバビリティ',
        desc: 'オプトイン保護付き Prometheus メトリクス、/health および /readiness プローブ、x-request-id による本番デバッグ。',
      },
      {
        icon: 'V',
        title: 'ベクトル検索',
        desc: 'HNSW アルゴリズムによるセマンティック類似度検索。Tantivy 全文検索との組み合わせでハイブリッド検索を実現。',
      },
      {
        icon: 'A',
        title: '拡散活性化',
        desc: '連想想起のための重み付き幅優先探索。減衰係数、閾値、深度を設定可能。',
      },
      {
        icon: 'W',
        title: 'ワークフローの安定性',
        desc: '推論された連想の永続化、安全な CMA エクスポート・インポートフロー、ステートフル CLI 操作前のコーディネーター再構築。',
      },
      {
        icon: '?',
        title: 'メタメモリプレーン',
        desc: '各レコードは意図・根拠・エビデンス・代替案・決定・型付きコンテキストグラフを保持。recall.query が「なぜ」プレーンを索引するため、エージェントは内容ではなく理由で検索できます。',
      },
      {
        icon: 'R',
        title: '生ジャーナル & ドリームティック',
        desc: '会話、ツール I/O、スクラッチパッドを別プレーンに原文保存。dream_tick が生エントリをトピックごとに集約し、エピソード／意味記憶へ要約します。',
      },
    ],
  },
  technical: {
    number: '\u00a7 7',
    title: '技術基盤',
    body: 'Cerememory のコアエンジンは <strong>Rust</strong> で実装されています。メモリ安全性、ゼロコスト並行性、予測可能なパフォーマンスを同時に実現できる唯一の選択肢です。Tokio が非同期 I/O を処理し、Rayon が減衰計算や拡散活性化といった CPU 集約型処理を担当。スレッドプールはワークロード特性に応じて最適に分離されています。',
    tools: [
      {
        title: 'redb',
        desc: 'ACID トランザクション対応の組み込みキーバリューストア。ゼロコピー読み取りで最大スループットを実現。',
      },
      {
        title: 'Tantivy',
        desc: 'Rust ネイティブの Lucene 相当。高性能な全文検索インデックス。',
      },
      {
        title: 'hnsw_rs',
        desc: '軽量な組み込み HNSW。高次元の近似最近傍探索。',
      },
      {
        title: 'MessagePack',
        desc: 'コンパクトなバイナリシリアライゼーション。最小限のオーバーヘッドで高速な内部データ転送。',
      },
      {
        title: 'Axum + Tonic + rmcp',
        desc: 'HTTP / REST、gRPC、MCP stdio の3トランスポートを同一エンジン上で提供。',
      },
      {
        title: 'JSON Lines CMA',
        desc: '検査可能な単一ファイルアーカイブ形式。ChaCha20-Poly1305 + Argon2id による任意暗号化と完全なデータポータビリティ。',
      },
    ],
  },
  philosophy: {
    number: '\u00a7 8',
    title: '設計思想',
    quote:
      '記憶はアイデンティティの基盤である。人がAIとのやり取りで蓄積したコンテキストを保存し、進化させ、検索するシステムは、いかなる単一の組織にも支配されてはならないほど重要なものである。',
    quoteAttribution: '\u2013 Cerememory Whitepaper',
    principles: [
      {
        num: 'I',
        title: 'ユーザー主権',
        desc: 'ローカルファースト。完全にエクスポート可能。記憶データの所有権は常にユーザーに帰属。',
      },
      {
        num: 'II',
        title: 'ベンダーロックインなし',
        desc: 'LLM 非依存プロトコル。Claude、GPT、Gemini \u2014 どのモデルでも同じ記憶層を共有可能。',
      },
      {
        num: 'III',
        title: '生きたデータ',
        desc: '記憶は呼吸する。減衰、干渉、再活性化、固定化 \u2014 静的なストレージではなく、動的な記憶システム。',
      },
      {
        num: 'IV',
        title: '脳にインスパイア',
        desc: '神経科学研究に基づく設計。人間の記憶の5つのサブシステムを忠実にモデル化。',
      },
    ],
  },
  cta: {
    title: 'AI に記憶を与えよう',
    desc: 'Cerememory はオープンソースです。今すぐ始めて、AI システムに永続的で進化する記憶を与えましょう。',
    githubButton: 'GitHub リポジトリ',
    quickStartButton: 'クイックスタートガイド',
  },
  footer: {
    docs: 'ドキュメント',
    github: 'GitHub',
    contributing: 'コントリビューション',
    cmpSpec: 'CMP 仕様',
    architecture: 'アーキテクチャ',
    copy: 'Open Source \u00b7 MIT License \u00b7 Built with Rust',
  },
  langSwitcher: { label: 'JA' },
}
