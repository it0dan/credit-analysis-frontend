# Proposal: polish pass customer

## Context

This lightweight change closes four visible issues found in the screenshots from the previous customer polish session:

- `docs/screenshots/customer-home-rebrand.png`
- `docs/screenshots/customer-historico.png`
- `docs/screenshots/customer-status-reasoning-end.png`
- `docs/screenshots/customer-status-reasoning-debug.png`

## Scope

This is a small UI polish pass. There is no domain contract change and no backend change.

## Fixes

1. Add an inert `idle` HUD state for non-analysis pages so home and history do not say `AO VIVO`.
2. Remove the massive aquamarine history bar and return the page to the normal border-left accent pattern.
3. Localize the reasoning stream final status badge from raw English status values to pt-BR labels.
4. Let the reasoning stream grow with content in debug mode so the first bureau chunk is not clipped.

## Acceptance

- Non-status customer pages do not render `AO VIVO`.
- `/historico` aquamarine density is between 2.5% and 10%.
- Final reasoning stream badge says `APROVADO`, not `approved` or `APPROVED`.
- Debug reasoning stream keeps the first bureau human chunk visible at the top.
- Typecheck and axe pass.
