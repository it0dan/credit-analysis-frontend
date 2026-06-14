# Prompt: resume agentic reasoning and memory

Continue the OpenSpec change at:

`openspec/changes/agentic-reasoning-and-memory/`

Scope:

1. Rebrand frontend visible user-facing `CRÉDITO·A2A` / `Crédito A2A` to `Análise de Crédito Agêntica`.
2. Replace the ambiguous customer status header phrase `Valor solicitado confirmado` with factual `Valor: R$ ...`.
3. Add `ReasoningChunk` types and a shared `<ReasoningStream>` UI primitive.
4. Enrich customer status fallback simulation with three reasoning chunks per agent over roughly 10 seconds.
5. Add localStorage history under key `dan:analyses`, `/historico`, customer home active banner and local final-verdict fallback.

Important invariants:

- Do not edit backend repos in this change.
- Keep operator behavior debug-first; operator should display muted `text_debug`.
- Keep `prefers-reduced-motion` support.
- Keep `aria-live="polite"` on the reasoning stream log.
- Store only masked CPF in localStorage.
- Preserve terminal-brutalism tokens and aquamarine density >= 2.5%.

Validation:

Run source greps for rebrand and contradiction, `npm run check-types`, screenshots for home/status/history, density script and axe where available.
