# AGENTS.md — credit-analysis-frontend

Este repositório contém a interface de usuário do sistema de análise de crédito multiagente, estruturada como um monorepo gerenciado via **Turborepo** e construído com **React, TypeScript, Next.js (App Router)** e identidade visual **terminal-brutalism**.

---

## 1. Visão Geral da Estrutura (Monorepo)

O monorepo está dividido em duas aplicações principais (`apps/`) e quatro pacotes internos compartilhados (`packages/`):

### 🏢 Aplicações (`apps/`)

*   **`apps/customer/`**: Portal voltado ao cliente final (solicitante do crédito). Possui a tela de solicitação de crédito (onde se fornece o CPF e valor solicitado) e a tela de acompanhamento humanizado (`/status/[request_id]`) com estados sequenciais visuais (`NA FILA` → `PROCESSANDO` → `CONCLUÍDO` / `AGUARDANDO HUMANO` / `ERRO`). O HUD para em estado terminal e para de mostrar `AO VIVO`. Possui **debug mode** para expor IDs técnicos, fallback badges e métricas internas.
*   **`apps/operator/`**: Cockpit técnico do operador humano (mesa de crédito). Contém a fila de propostas pendentes (`/queue`), o painel de decisão de intervenção (`/queue/[request_id]`) com botões para aprovar, recusar ou escalar, e o dashboard de métricas e FinOps (`/dashboard`). Preserva estatísticas de throughput não presentes no customer.

### 📦 Pacotes (`packages/`)

*   **`packages/types/`**: Definições de tipos comuns e interfaces contratuais (`CreditAnalysisStatus`, `HITLRequest`, `OperatorDecision`, `AgentCall`, `AgentTrajectory`).
*   **`packages/ag-ui-client/`**: Cliente de integração AG-UI SSE, implementando o hook `useAgentStream` com reconexão automática e backoff exponencial.
*   **`packages/ui/`**: Design system compartilhado com componentes tipados (`StatusBadge`, `AgentCard`, `TraceTimeline`, `CostDisplay`, `HITLPanel`). Paleta terminal-brutalism definida em `packages/ui/tokens/tokens.css`.
*   **`packages/auth/`**: Contratos de autenticação JWT com hook `useAuth`.

---

## 2. Fluxo de Status do Customer (Humanizado)

A tela de acompanhamento do customer não expõe mais eventos brutos do AG-UI. Em vez disso, a interface traduz a trajetória dos agentes em estados sequenciais visuais:

| Estado | Descrição |
|--------|-----------|
| `NA FILA` | Análise enfileirada, aguardando processamento |
| `PROCESSANDO` | Agentes em execução |
| `CONCLUÍDO` | Todos os agentes finalizados |
| `AGUARDANDO HUMANO` | Intervenção necessária (HITL) |
| `ERRO` | Falha técnica na análise |

O HUD customer detecta estados terminais e para de mostrar `AO VIVO`. O debug mode (habilitável) revela IDs técnicos, fallback badges e informações internas.

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
*   **`refresh-frontend-visual-identity/`** — Identidade visual terminal-brutalism

---

## 5. Validações

*   `npm run check-types` — Verificação TypeScript estática
*   `npx @axe-core/cli` — Validação de acessibilidade (baseline: 0 violations)
*   Densidade aquamarine medida em screenshots (customer home: ~6.79%, status mid: ~4.25%, status end: ~5.66%)

---

## 6. Variáveis de Ambiente

```bash
NEXT_PUBLIC_ORCHESTRATOR_URL="http://localhost:8000"
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
