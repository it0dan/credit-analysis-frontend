# Proposal: agentic reasoning and memory

## Context

The customer portal needs four polish changes before the demo stage. They touch the same presentation layer and domain-facing language, so they are grouped into one OpenSpec change.

## Problems

1. The visible brand still uses `CRÉDITO·A2A` / `Crédito A2A`, which reads as infrastructure rather than a customer-facing product.
2. The customer status header says `Valor solicitado confirmado` even when the final verdict can be rejected, creating an ambiguous confirmation signal.
3. The customer only sees phase badges such as queued, processing and done. The experience should feel like agents are actively reasoning, with typed text similar to an LLM chat.
4. Returning to the customer portal loses the user's local context. The backend may keep analysis state, but the frontend does not remember which requests this browser submitted.

## Deliverables

1. Rebrand visible frontend text to `Análise de Crédito Agêntica`, with a short wordmark for compact header usage.
2. Replace the ambiguous status header copy with factual CPF and amount data.
3. Add typed reasoning stream rendering for each agent, using human text by default and technical `text_debug` in debug mode.
4. Add frontend-side localStorage history, a `/historico` route and an active-analysis banner on the customer home.

## Out of Scope

- Backend persistence changes.
- Backend rebrand edits.
- Real SSE reasoning chunks emitted by the orchestrator.
- Changes to credit decision rules.

## Acceptance Summary

- Frontend grep for `CRÉDITO·A2A`, `crédito a2a` and `credito-a2a` returns zero source hits.
- Frontend grep for `valor solicitado confirmado` returns zero source hits.
- Customer status page shows typed reasoning chunks with `aria-live`.
- `dan:analyses` localStorage stores masked CPF only and retains up to 50 entries.
- `/historico` lists stored analyses and links back to `/status/[id]`.
- Operator behavior remains debug-first and receives `text_debug` detail through the same component.
