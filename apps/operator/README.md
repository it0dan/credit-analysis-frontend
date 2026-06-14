# apps/operator

Cockpit técnico do operador humano (mesa de crédito).

## Funcionalidades

- **Queue** (`/queue`): Fila de propostas pendentes de revisão
- **Intervenção** (`/queue/[request_id]`): Painel de decisão com botões aprovar/recusar/escalar
- **Dashboard** (`/dashboard`): Métricas e FinOps

## Variáveis de Ambiente

```bash
NEXT_PUBLIC_ORCHESTRATOR_URL="http://localhost:8000"
NEXT_PUBLIC_APP_TYPE="operator"
```
