# Tasks: agentic reasoning and memory

- [x] T0. Run recognition greps and capture source rebrand inventory.
- [x] T1. Create OpenSpec artifacts: proposal, design, spec, tasks, prompt.
- [x] T2. Rebrand visible frontend source and metadata.
- [x] T3. Replace ambiguous `valor solicitado confirmado` copy.
- [x] T4. Extend `AgentCall` with `ReasoningChunk`.
- [x] T5. Build `<ReasoningStream>` primitive with aria-live, debug detail and reduced-motion behavior.
- [x] T6. Enrich customer status fallback simulation with reasoning chunks.
- [x] T7. Replace customer and operator phase renderers with `<ReasoningStream>`.
- [x] T8. Add localStorage history helpers with masked CPF and FIFO cap.
- [x] T9. Persist submitted analyses and update status transitions.
- [x] T10. Add `/historico` customer route and sidebar link.
- [x] T11. Add active-analysis banner to customer home.
- [x] T12. Add localStorage final-verdict fallback on status page.
- [x] T13. Validate greps, screenshots, density, axe and typecheck.
- [x] T14. Record backend debts for durable persistence, backend rebrand and real SSE reasoning.
## Integração SSE real

- [x] Consumir `GET /analysis/:request_id/events` no customer.
- [x] Consumir replay SSE no detalhe do operator.
- [x] Converter eventos de lifecycle do backend em `AgentTrajectory` e `ReasoningChunk`.
- [x] Deduplicar eventos recebidos simultaneamente por replay e fila ao vivo.
- [x] Preservar fixtures visuais e fallback offline.
