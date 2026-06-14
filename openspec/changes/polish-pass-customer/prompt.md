# Prompt: resume polish pass customer

Continue `openspec/changes/polish-pass-customer/`.

Scope is small and frontend-only:

1. `CockpitLayout.liveState` supports `idle`; pass it on non-analysis pages.
2. `/historico` should use normal `border-left: 2px solid var(--acc)` accents, no massive aquamarine fill/bar.
3. `ReasoningStream` should use pt-BR labels for `CreditAnalysisStatus`.
4. `ReasoningStream` should not clip the first bureau chunk in debug mode; remove the fixed internal max-height/scroll behavior.

Validation:

- Recapture five `docs/screenshots/polish-*` files.
- `/historico` density target: 2.5%-10%.
- Home/history `AO VIVO` count: 0.
- No visible English status badge labels.
- `npm run check-types` and axe pass.
