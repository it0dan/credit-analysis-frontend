# Análise de Crédito Agêntica — Frontend

Monorepo Turborepo para a interface do sistema de análise de crédito multiagente, com identidade visual **terminal-brutalism**.

## Apps

- `apps/customer` — portal do cliente na porta `3000`
  - solicitação de crédito
  - acompanhamento em `/status/[request_id]`
  - reasoning stream com texto digitado por agente
  - histórico local em `/historico` via `localStorage["dan:analyses"]`
- `apps/operator` — cockpit técnico na porta `3001`
  - fila HITL em `/queue`
  - revisão em `/queue/[request_id]`
  - dashboard em `/dashboard`

## Pacotes

- `packages/ui` — design system, `ReasoningStream`, histórico local e componentes compartilhados
- `packages/types` — contratos TypeScript (`CreditAnalysisStatus`, `AgentTrajectory`, `ReasoningChunk`, HITL)
- `packages/ag-ui-client` — cliente SSE real por `request_id`, com replay, deduplicação e reconexão
- `packages/auth` — auth mock/dev para customer e operator

## Design Tokens

Definidos em `packages/ui/tokens/tokens.css`. **Não alterar sem ADR/OpenSpec.**

| Token | Valor | Uso |
|---|---:|---|
| `--bg` | `#0A0E14` | fundo global |
| `--surf` | `#0F141B` | superfície |
| `--acc` | `#7FFFD4` | acento principal |
| `--alert` | `#FF4655` | erro/rejeição |
| `--warn` | `#FFB84D` | alerta/pendência |
| `--blue` | `#7EB8F7` | info/análise |
| `--purple` | `#C9A8F5` | secundário |
| `--text` | `#E6EDF3` | texto principal |
| `--muted` | `#6B7785` | texto secundário |
| `--line` | `#1E2530` | borda sutil |
| `--line2` | `#2A3340` | borda destaque |

Proibidos sem ADR: `border-radius > 2px`, `box-shadow` com blur, halos glow, gradientes, `[data-theme="light"]`.

## OpenSpec

Mudanças recentes em `openspec/changes/`:

- `agentic-reasoning-and-memory/` — rebrand, reasoning stream, histórico local e fallback local de status
- `polish-pass-customer/` — HUD idle, ajuste de densidade do histórico, status em pt-BR e correção de clipping debug
- `humanize-customer-experience/` — experiência customer humanizada e debug mode
- `streaming-and-cleanup/` — estados sequenciais e limpeza de vazamentos técnicos
- `accent-density-pass/` — densidade visual do acento aquamarine
- `refresh-frontend-visual-identity/` — identidade terminal-brutalism

## Screenshots

Evidências recentes em `docs/screenshots/`:

- `customer-home-rebrand.png`
- `customer-status-reasoning-mid.png`
- `customer-status-reasoning-end.png`
- `customer-status-reasoning-debug.png`
- `customer-historico.png`
- `polish-customer-home.png`
- `polish-customer-historico.png`
- `polish-customer-status-mid.png`
- `polish-customer-status-end.png`
- `polish-customer-status-debug.png`

## Desenvolvimento

```sh
npm install
npm run dev
```

Serviços esperados para fluxo completo local:

- Customer: `http://localhost:3000`
- Operator: `http://localhost:3001`
- Orchestrator/API: `http://localhost:8086`
- Compliance agent: `http://localhost:8085`

O customer e o operator consomem `GET /analysis/:request_id/events`. Timers locais são mantidos somente para fixtures visuais e contingência quando o backend está indisponível.

## Validação

```sh
npm run check-types
npx @axe-core/cli http://localhost:3000 http://localhost:3001
```

Validação visual recente:

- home aquamarine: `13.65%`
- historico aquamarine: `8.88%` (alvo `2.5%-10%`)
- status mid aquamarine: `7.27%`
- status end aquamarine: `8.84%`
- status debug aquamarine: `6.91%`
