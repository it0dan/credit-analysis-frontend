# apps/operator

Cockpit técnico do operador humano da **Análise de Crédito Agêntica**.

## Funcionalidades

- **Home** (`/`): visão operacional e métricas de fila.
- **Queue** (`/queue`): fila de propostas pendentes de revisão.
- **Intervenção** (`/queue/[request_id]`): painel de decisão com botões para aprovar, recusar ou escalar.
- **Dashboard** (`/dashboard`): métricas e FinOps.
- **ReasoningStream técnico**: a revisão de caso usa o mesmo stream do customer, com debug ligado por padrão e `text_debug` visível.

## HUD

- Telas de lista/home/dashboard usam `liveState="idle"`.
- A revisão `/queue/[request_id]` mantém contexto técnico ativo.

## Variáveis de Ambiente

```bash
NEXT_PUBLIC_ORCHESTRATOR_URL="http://localhost:8086"
NEXT_PUBLIC_APP_TYPE="operator"
```
