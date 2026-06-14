# Spec: agentic reasoning and memory

## Rebrand Contract

Visible frontend source occurrences found before implementation:

```text
apps/customer/app/layout.tsx:21:  title: 'Crédito A2A — Portal do Cliente',
apps/operator/app/layout.tsx:21:  title: 'Crédito A2A — Cockpit Operacional',
packages/ui/src/brand.tsx:16:        crédito·a2a · demo
packages/ui/src/brand.tsx:24:      {variant === 'full' && <span>CRÉDITO·A2A</span>}
```

Required replacements:

- Metadata titles use `Análise de Crédito Agêntica`.
- Header wordmark uses `◇ ANÁLISE AGÊNTICA`.
- Footer uses `análise de crédito agêntica · demo`.

Acceptance:

```bash
grep -riE "crédito[· ]a2a|credito[-_]a2a|CRÉDITO.A2A" apps packages 2>/dev/null --exclude-dir=.next --exclude-dir=node_modules
```

returns zero.

## Contradiction Fix Contract

Visible status header must show only factual values:

```text
CPF: 123.456.789-00 · Valor: R$ 25.000,00
```

The phrase `valor solicitado confirmado` must not appear in source.

## Reasoning Type Contract

`packages/types/src/trajectory.ts` exports:

```ts
export type ReasoningChunkKind = 'thought' | 'tool_call' | 'result' | 'conclusion';

export interface ReasoningChunk {
  text_human: string;
  text_debug: string;
  kind: ReasoningChunkKind;
  timestamp_ms: number;
}
```

`AgentCall` gains:

```ts
reasoning?: ReasoningChunk[];
```

## Reasoning Stream Contract

`packages/ui/src/reasoning-stream.tsx` exports:

```ts
export function ReasoningStream(props: {
  phases: AgentCall[];
  analysisStatus: CreditAnalysisStatus;
  isLive: boolean;
}): JSX.Element
```

Required accessibility:

- Root log container has `role="log"`.
- Root log container has `aria-live="polite"`.
- Root log container has `aria-relevant="additions"`.

Required behavior:

- Customer status page uses `<ReasoningStream>` as the main visible phase renderer.
- Customer debug view may keep `TraceTimeline` and cost under `DebugOnly`.
- Operator review page uses `<ReasoningStream>` and keeps technical timeline/cost available.
- Debug mode displays `text_debug` below `text_human` in muted text.
- `prefers-reduced-motion` disables character typing.

## Reasoning Message Matrix

| Agent | Kind | text_human | text_debug |
|---|---|---|---|
| bureau | thought | Consultando seu CPF no bureau de crédito | tool=bureau_get_score input=cpf_masked request_id |
| bureau | tool_call | Score recuperado · histórico de 24 meses analisado | result.score=780 restrictions=[] latency_budget=1500ms |
| bureau | conclusion | Histórico de crédito confirmado | bureau.status=ok span=bureau |
| documents | thought | Validando documentos enviados | tool=documents_validate inputs=document_urls applicant_name |
| documents | tool_call | Cruzando dados com base federal | identity_valid=true income_confirmed=true |
| documents | conclusion | Documentos confirmados | documents.status=ok income_source=ocr |
| risk | thought | Calculando seu perfil de risco | tool=risk_evaluate inputs=bureau_score income_value requested_amount |
| risk | tool_call | Considerando histórico, perfil e valor solicitado | default_probability=0.04 risk_tier=low |
| risk | conclusion | Avaliação concluída | risk.status=ok internal_score=82 |
| compliance | thought | Conferindo conformidade regulatória | tool=compliance_check inputs=cpf_masked request_id |
| compliance | tool_call | Verificações KYC e PLD em curso | kyc=true pld=true lgpd=true |
| compliance | conclusion | Conformidade aprovada | compliance.status=ok tools=verify_kyc,check_pld,verify_lgpd_consent |
| decision | thought | Sintetizando a decisão final | tool=decision_synthesize inputs=t1,t2,requested_amount |
| decision | tool_call | Cruzando todos os sinais | decision_model=explainable_synthesis |
| decision | conclusion | Decisão favorável | final.status=approved approved_amount=requested_amount |
| decision | conclusion | Não aprovada | final.status=rejected approved_amount=0 |
| decision | conclusion | Encaminhada para análise humana | final.status=hitl_required reason=threshold_exceeded |

The UI may add a status symbol before conclusion lines, but the stored chunk text stays as listed above.

## Local History Contract

`packages/ui/src/analysis-history.ts` exports:

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

export function addAnalysis(entry: Omit<StoredAnalysis, 'created_at'>): void;
export function updateAnalysis(request_id: string, patch: Partial<StoredAnalysis>): void;
export function listAnalyses(): StoredAnalysis[];
export function getAnalysis(request_id: string): StoredAnalysis | null;
```

Storage key: `dan:analyses`.

Privacy:

- CPF must be masked before persistence.
- localStorage must not contain full CPF matching `\d{3}\.\d{3}\.\d{3}-\d{2}`.

## Routes

`apps/customer/app/historico/page.tsx`:

- Lists stored analyses sorted newest first.
- Empty state: `Nenhuma análise registrada ainda.`
- Each item links to `/status/[id]?cpf=<masked>&amount=<amount>`.
- Includes link to `/`.

Customer home:

- Shows an active-analysis banner when at least one stored entry has no `final_verdict`.
- The banner links to the most recent active entry.

## Visual Acceptance

- Mid-reasoning screenshot at 4s shows at least two chunks and one typing cursor on the active agent.
- Final-reasoning screenshot at 11s shows all agents resolved.
- Debug screenshot shows muted `text_debug`.
- Aquamarine density stays at or above 2.5% on home, mid-reasoning, final-reasoning and history screenshots.
- axe-core reports no serious or critical violations.
- TypeScript check passes.
