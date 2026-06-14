# AGENTS.md — credit-analysis-frontend

Este repositório contém a interface de usuário do sistema de análise de crédito multiagente, estruturada como um monorepo gerenciado via **Turborepo** e construído com **React, TypeScript, Next.js (App Router)** e identidade visual **terminal-brutalism**.

---

## 1. Visão Geral da Estrutura (Monorepo)

O monorepo está dividido em duas aplicações principais (`apps/`) e quatro pacotes internos compartilhados (`packages/`):

### 🏢 Aplicações (`apps/`)

*   **`apps/customer/`**: Portal voltado ao cliente final. Possui tela de solicitação, banner de análises ativas, `/historico` com persistência local, e `/status/[request_id]` com `ReasoningStream` digitado por agente. O HUD usa `idle` fora de status, `live` durante análise e `concluded` em estado terminal. Possui **debug mode** para expor `text_debug`, IDs técnicos, fallback badges e métricas internas.
*   **`apps/operator/`**: Cockpit técnico do operador humano. Contém a fila de propostas pendentes (`/queue`), o painel de decisão (`/queue/[request_id]`) com `ReasoningStream` técnico e botões para aprovar, recusar ou escalar, e o dashboard de métricas e FinOps (`/dashboard`). Preserva estatísticas de throughput não presentes no customer.

### 📦 Pacotes (`packages/`)

*   **`packages/types/`**: Definições de tipos comuns e interfaces contratuais (`CreditAnalysisStatus`, `HITLRequest`, `OperatorDecision`, `ReasoningChunk`, `AgentCall`, `AgentTrajectory`).
*   **`packages/ag-ui-client/`**: Cliente de integração AG-UI SSE, implementando o hook `useAgentStream` com reconexão automática e backoff exponencial.
*   **`packages/ui/`**: Design system compartilhado com componentes tipados (`StatusBadge`, `ReasoningStream`, `TraceTimeline`, `CostDisplay`, `HITLPanel`) e helper `analysis-history`. Paleta terminal-brutalism definida em `packages/ui/tokens/tokens.css`.
*   **`packages/auth/`**: Contratos de autenticação JWT com hook `useAuth`.

---

## 2. Fluxo de Status do Customer (Humanizado)

A tela de acompanhamento do customer não expõe eventos brutos do AG-UI por padrão. A experiência principal é o `ReasoningStream`: cada agente escreve chunks de raciocínio (`text_human`) com typing animation; em debug mode o mesmo chunk mostra `text_debug` muted. A interface ainda conserva estados sequenciais visuais:

| Estado | Descrição |
|--------|-----------|
| `NA FILA` | Análise enfileirada, aguardando processamento |
| `PROCESSANDO` | Agentes em execução |
| `CONCLUÍDO` | Todos os agentes finalizados |
| `AGUARDANDO HUMANO` | Intervenção necessária (HITL) |
| `ERRO` | Falha técnica na análise |

O HUD customer usa `idle` fora da página de status, detecta estados terminais e para de mostrar `AO VIVO`. O debug mode revela IDs técnicos, fallback badges, custos, timeline e `text_debug`. O histórico local usa `localStorage["dan:analyses"]` com CPF sempre mascarado.

---

## 3. Design Tokens (paleta canônica)

Definidos em `packages/ui/tokens/tokens.css`. **Não alterar sem ADR.**

| Token     | Valor      | Uso                        |
|-----------|------------|----------------------------|
| `--bg`    | `#0A0E14`  | Fundo global               |
| `--surf`  | `#0F141B`  | Superfície de card/painel  |
| `--acc`   | `#7FFFD4`  | Acento principal (aquamarine) |
| `--alert` | `#FF4655`  | Erro / rejeição            |
| `--warn`  | `#FFB84D`  | Alerta / pendência         |
| `--blue`  | `#7EB8F7`  | Info / análise             |
| `--purple`| `#C9A8F5`  | Uso secundário             |
| `--text`  | `#E6EDF3`  | Texto principal            |
| `--muted` | `#6B7785`  | Texto secundário           |
| `--line`  | `#1E2530`  | Borda sutil                |
| `--line2` | `#2A3340`  | Borda de destaque          |

Proibidos sem ADR: `border-radius > 2px`, `box-shadow` com blur, halos glow, gradientes, `[data-theme="light"]`.

---

## 4. OpenSpec

Mudanças de design e comportamento são documentadas em `openspec/changes/`:

*   **`accent-density-pass/`** — Ajuste de densidade da cor aquamarine nos screens do customer
*   **`streaming-and-cleanup/`** — Estados sequenciais visuais, HUD terminal, limpeza de streaming
*   **`humanize-customer-experience/`** — Experiência humanizada do customer, debug mode, gate de operation leaks
*   **`agentic-reasoning-and-memory/`** — Rebrand, reasoning stream, histórico local e fallback local
*   **`polish-pass-customer/`** — HUD idle, densidade do histórico, labels pt-BR e correção de clipping debug
*   **`refresh-frontend-visual-identity/`** — Identidade visual terminal-brutalism

---

## 5. Validações

*   `npm run check-types` — Verificação TypeScript estática
*   `npx @axe-core/cli` — Validação de acessibilidade (baseline: 0 violations)
*   Densidade aquamarine medida em screenshots recentes: home `13.65%`, histórico `8.88%`, status mid `7.27%`, status end `8.84%`, status debug `6.91%`

---

## 6. Variáveis de Ambiente

```bash
NEXT_PUBLIC_ORCHESTRATOR_URL="http://localhost:8086"
NEXT_PUBLIC_APP_TYPE="customer"       # 'customer' | 'operator'
AUTH_SECRET="secret-jwt-token-gateway-validation-key"
```

---

## 7. Comandos

```bash
npm run dev        # customer :3000, operator :3001
npm run build      # produção
npm run lint       # linting
npm run check-types # TypeScript
```
