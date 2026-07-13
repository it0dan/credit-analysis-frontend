# Backend debts

## Durable persistence - credit-analysis-agent

Replace runtime JSON/in-memory persistence with durable storage in a separate SPDD.

Suggested schema:

- `analyses(request_id PK, cpf_hash, amount_brl, created_at, final_verdict, trace_id, finops_cost_brl)`
- `reasoning_chunks(id, request_id FK, agent, kind, text_human, text_debug, timestamp_ms)`

Suggested endpoint:

- `GET /analyses?cpf_hash=...` for backend-backed customer history.

## Backend rebrand inventory

Backend repos were scanned read-only for the requested frontend-facing rebrand strings.

### credit-analysis-agent

```text
openspec/changes/refresh-frontend-visual-identity/tasks.md:25:  _Conclusão: título = "Crédito A2A — Operator Cockpit"_
```

This is an archived/stale frontend design note inside the backend repo, not runtime UI.

### compliance-agent

No matches found in scanned files:

```text
README.md
AGENTS.md
.well-known/
src/
```

## Real SSE reasoning stream - credit-analysis-agent — resolved

Implemented as `GET /analysis/:id/events` returning `text/event-stream`, with SQLite replay and named lifecycle events.

Current events:

- `analysis_started`
- `agent_started`
- `agent_completed`
- `analysis_done`
- `hitl_required`
- `analysis_error`

The `@repo/ag-ui-client` package converts these lifecycle events into the frontend `AgentTrajectory` and `ReasoningChunk` contracts. Simulation remains restricted to visual fixtures and offline contingency.
