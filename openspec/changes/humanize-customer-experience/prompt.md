# Prompt de Retomada

Continuar a change `openspec/changes/humanize-customer-experience/`.

Objetivo: humanizar o portal customer, remover marca pessoal/empresa da UI e esconder telemetria tecnica do usuario final atras de debug mode, preservando operator como tela tecnica.

Invariantes:

- Backend intocado; manter polling em `/analysis/:id/status`.
- Sem migrar para SSE nesta sessao.
- Sem alterar tokens/paleta.
- Customer default sem IDs, traces, spans, fases, latencias ou custos visiveis.
- Customer debug via `Ctrl+Shift+D` ou `?debug=1` revela telemetria.
- Operator default debug on.
- `prefers-reduced-motion` respeitado.
- WCAG 2.2 AA preservado.

Ordem planejada:

1. De-brand com `Brand`.
2. Debug infra.
3. Gating de telemetria no customer.
4. AgentStream e sim fallback enriquecido.
5. Operator telemetry.
6. Validacao final com grep, screenshots, densidade, axe e types.

Debito backend para proximo handoff: SSE real em `credit-analysis-agent` com eventos por span/OTel e payload de poll com sub-estado intermediario.
