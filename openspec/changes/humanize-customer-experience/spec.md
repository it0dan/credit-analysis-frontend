# Spec

## Brand

`Brand` fica em `packages/ui/src/brand.tsx`.

Contrato:

```tsx
export function Brand({ variant = 'full' }: { variant?: 'full' | 'glyph' | 'footer' }): JSX.Element
```

Requisitos:

- `full` renderiza glyph aquamarine e texto neutro `CREDITO·A2A` em fonte mono uppercase.
- `glyph` renderiza apenas `◇` em `var(--acc)`.
- `footer` renderiza `credito·a2a · demo` em texto discreto, sem marca externa.
- Nao pode conter `Sensedia`, `sense` ou `dia`.

## DebugProvider / useDebug / DebugOnly / HumanLabel

Arquivo: `packages/ui/src/debug-context.tsx`.

Contrato:

```tsx
export function DebugProvider({ defaultEnabled, children }: { defaultEnabled: boolean; children: React.ReactNode }): JSX.Element
export function useDebug(): { enabled: boolean; toggle: () => void }
export function DebugOnly({ children }: { children: React.ReactNode }): JSX.Element | null
export function HumanLabel({ human, debug }: { human: React.ReactNode; debug: React.ReactNode }): JSX.Element
```

Comportamento:

- `defaultEnabled` define o estado inicial quando nao houver override persistido.
- `Ctrl+Shift+D` alterna o estado e persiste em `localStorage["dan:debug-mode"]`.
- `?debug=1` ativa e persiste `true`.
- `?debug=0` desativa e persiste `false`.
- Badge `[DEBUG·ON]` aparece somente quando `enabled === true`.
- `DebugOnly` renderiza `children` somente quando debug estiver ativo.
- `HumanLabel` renderiza `human` quando debug estiver desligado e `debug` quando ligado.

## AgentStream

Arquivo: `packages/ui/src/agent-stream.tsx`.

Contrato:

```tsx
export function AgentStream({
  phases,
  status,
  mode,
  isLive,
}: {
  phases: AgentPhase[];
  status: CreditAnalysisStatus;
  mode: 'customer' | 'operator';
  isLive: boolean;
}): JSX.Element
```

`AgentPhase` deve ser compativel com o item atual de `AgentTrajectory['phases'][number]` e pode aceitar status intermediarios locais (`queued`, `thinking`, `tool_call`, `result`, `success`, `error`).

Requisitos:

- Renderiza sempre os 5 agentes em ordem: `bureau`, `documents`, `risk`, `compliance`, `decision`.
- Agente ausente em `phases` aparece como `queued`.
- Agente presente com `status: success` aparece como `done`.
- Agente presente com `status: error` ou `fail` aparece como `error`.
- Agente mais recente em `phases` com status geral `analyzing` aparece como `thinking`.
- Se nao houver novo evento por > 1.5s e `status === 'analyzing'`, o proximo agente esperado aparece provisoriamente como `thinking`.
- Customer default usa labels humanos.
- Operator ou debug usa labels tecnicos com agente, fase, latencia, span e custo quando disponiveis.
- Cursor de digitacao pisca a cada 700ms com fallback estatico em `prefers-reduced-motion`.
- Novas linhas/transicoes usam fade-in de 280ms, removido em `prefers-reduced-motion`.

## Elementos escondidos no customer quando `!debug`

- `TraceTimeline` inteiro.
- `CostDisplay` inteiro.
- `request_id` exibido como texto, embora continue na URL e disponivel em `DebugOnly`.
- `trace_id` em qualquer label.
- `span_id` em qualquer label.
- `phase: T1/T2/T3` e qualquer exposicao literal de `T1`, `T2`, `T3`.
- `latency_ms` numerico e qualquer texto `123ms`; substituir por texto humano ou ocultar.
- `finops.estimated_cost_brl` e qualquer custo `R$ X.XX` de telemetria.
- HUD top tecnico `3 agents · T+00:00:00`; customer default mostra `Analise em andamento · mm:ss`.
- HUD bottom tecnico auxiliar; customer default mostra apenas status amigavel como `● analisando · 02:13`.

## Elementos que sempre aparecem no customer

- Estado do agente atual com label humano.
- Progresso visual de etapas.
- Status final humanizado.
- Pulse `ao vivo` quando a analise estiver pendente/analisando.
- Mensagens de erro humanizadas quando houver falha de rede ou status final de erro.

## Operator

- O operator deve estar dentro de `DebugProvider defaultEnabled={true}`.
- `/queue/[request_id]` deve continuar mostrando trace, spans, phases, latencias e custos.
- `/queue` deve mostrar telemetria operacional por caso quando disponivel ou simulada: custo, latencia, fase atual e trace curto.

## Criterios de aceite

- `grep -riE "sensedia|sense.{0,3}dia| sense |>dia<" apps packages` retorna 0 para fontes relevantes e, apos rebuild/limpeza, para o repo todo.
- `grep -i ">sense<\|>dia<" apps packages` retorna 0.
- Customer em modo default nao exibe nenhum hex/uuid/`req-`/`span-`/`tr-` em texto visivel.
- Customer em modo default nao exibe `T1`, `T2`, `T3`, `ms` tecnico ou custo de telemetria.
- `Ctrl+Shift+D` no customer revela telemetria tecnica.
- `?debug=1` no customer ativa debug e persiste em localStorage.
- `?debug=0` no customer desativa debug e persiste em localStorage.
- Badge `[DEBUG·ON]` aparece quando debug esta ativo.
- Operator continua mostrando toda telemetria sem acao do usuario.
- Densidade aquamarine permanece >= 2.5% nas tres telas medidas.
- axe-core retorna 0 violacoes serias/criticas.
- `npm run check-types` passa.
