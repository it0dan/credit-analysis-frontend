# apps/customer

Portal do cliente final da **Análise de Crédito Agêntica**.

## Funcionalidades

- **Home** (`/`): formulário de solicitação de crédito com CPF e valor.
- **Banner de análise ativa**: mostra requests locais ainda sem veredito final.
- **Status** (`/status/[request_id]`): acompanhamento em tempo real com `ReasoningStream`, onde cada agente exibe chunks de raciocínio com typing animation.
- **Histórico** (`/historico`): lista análises salvas no navegador em `localStorage["dan:analyses"]`.
- **Fallback local**: quando o backend não encontra um request já finalizado localmente, a tela de status usa o veredito salvo no navegador.
- **Debug mode** (`?debug=1`): revela `text_debug`, timeline técnica, custos e IDs internos.

## Privacidade

O customer persiste apenas CPF mascarado no navegador. CPF em claro não deve ser salvo no `localStorage`.

## HUD

- Páginas sem análise em curso usam `liveState="idle"`.
- `/status/[request_id]` usa `live` durante processamento e `concluded` em estados terminais.

## Variáveis de Ambiente

```bash
NEXT_PUBLIC_ORCHESTRATOR_URL="http://localhost:8086"
NEXT_PUBLIC_APP_TYPE="customer"
```
