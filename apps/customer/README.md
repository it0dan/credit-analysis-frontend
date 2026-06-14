# apps/customer

Portal do cliente final (solicitante de crédito).

## Funcionalidades

- **Home**: Formulário de solicitação de crédito (CPF + valor)
- **Status** (`/status/[request_id]`): Acompanhamento humanizado com estados sequenciais (`NA FILA` → `PROCESSANDO` → `CONCLUÍDO` / `AGUARDANDO HUMANO` / `ERRO`)
- **Debug mode**: Expõe IDs técnicos, fallback badges e métricas internas

## Variáveis de Ambiente

```bash
NEXT_PUBLIC_ORCHESTRATOR_URL="http://localhost:8000"
NEXT_PUBLIC_APP_TYPE="customer"
```
