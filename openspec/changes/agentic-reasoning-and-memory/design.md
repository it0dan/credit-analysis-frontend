# Design: agentic reasoning and memory

## Decision 1 - Brand Names

Use two names consistently:

- Long form: `Análise de Crédito Agêntica`
- Short wordmark: `◇ ANÁLISE AGÊNTICA`

The short wordmark matches the existing mono uppercase deck language and fits the header bar without truncation. The footer uses `análise de crédito agêntica · demo`.

## Decision 2 - Factual Status Header

Replace:

`CPF: XXX.XXX.XXX-XX · Valor solicitado confirmado`

With:

`CPF: XXX.XXX.XXX-XX · Valor: R$ 25.000,00`

The status badge remains the only verdict source. This avoids implying approval or confirmation when the analysis can later be rejected or sent to human review.

## Decision 3 - Reasoning Stream

`AgentCall` gains optional reasoning chunks:

```ts
export type ReasoningChunkKind = 'thought' | 'tool_call' | 'result' | 'conclusion';

export interface ReasoningChunk {
  text_human: string;
  text_debug: string;
  kind: ReasoningChunkKind;
  timestamp_ms: number;
}
```

`packages/ui/src/reasoning-stream.tsx` renders all agents in canonical order:

1. bureau
2. documents
3. risk
4. compliance
5. decision

For each agent, the component shows a compact header with status symbol, humanized label and phase badge. Below the header, chunks render as indented log lines using `├─` and `└─`.

Animated behavior:

- The latest `thought` or `tool_call` chunk on an `in_progress` phase types character-by-character for roughly 500-700ms.
- Prior chunks and completed phases render statically.
- `prefers-reduced-motion: reduce` disables character typing; chunks appear immediately with a 200ms fade.
- The container uses `role="log"`, `aria-live="polite"` and `aria-relevant="additions"`.
- Auto-scroll follows new chunks unless the user manually scrolls upward.

Color by kind:

- `thought`: `--text`
- `tool_call`: `--blue`
- `result`: `--text`
- `conclusion`: `--acc`

Debug behavior:

- Customer debug off: only `text_human`.
- Debug on, including operator default: `text_human` followed by muted `text_debug`.

## Decision 4 - Frontend Local Persistence

Create `packages/ui/src/analysis-history.ts` with storage key `dan:analyses`.

Schema:

```ts
export interface StoredAnalysis {
  request_id: string;
  cpf_masked: string;
  amount_brl: number;
  created_at: string;
  final_verdict?: 'approved' | 'rejected' | 'hitl_required' | null;
  last_status?: CreditAnalysisStatus;
  last_updated_at?: string;
}
```

Rules:

- Store at most 50 entries; oldest entries are evicted first.
- CPF is masked before storage.
- Never store clear CPF in localStorage.
- Form submit writes an entry after backend returns the `request_id`.
- Status page updates status and final verdict whenever the visible status changes.
- `/historico` reads localStorage and sorts by `created_at` descending.
- Customer home shows a banner when entries without `final_verdict` exist.

## Decision 5 - Status Fallback From Local Storage

When `/analysis/:id/status` is unavailable or returns a missing state, the status page checks localStorage.

If a stored entry exists with `final_verdict`, the page renders that final state as ground truth with a retroactive completed reasoning transcript. This allows the browser to reopen an old local request after a backend restart.

## Backend Debt

Backend persistence remains out of scope. Durable backend history should be handled by a separate SPDD in `credit-analysis-agent`.
