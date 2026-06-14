# Prompt de Retomada

Continuar o tweak visual `accent-density-pass` sem alterar tokens nem logica de negocio.

Objetivo: intensificar a presenca de `var(--acc)` (#7FFFD4) nos apps `customer` e `operator`, replicando a densidade visual do deck: HUD top/bottom, tags mono uppercase, palavras-chave em headings, pulses, bordas esquerdas, stats, botoes, inputs e estados ativos.

Baseline medida:

- `docs/screenshots/before-density-customer.png`: 11.35%
- `docs/screenshots/before-density-customer-mobile.png`: 13.26%
- `docs/screenshots/before-density-operator.png`: 5.38%

Alvo after: >= 2.5% aquamarine dos pixels nao-fundo em:

- `docs/screenshots/after-density-customer.png`
- `docs/screenshots/after-density-customer-mobile.png`
- `docs/screenshots/after-density-operator.png`

Invariantes:

- Nao tocar em `packages/ui/tokens/tokens.css`.
- Nao alterar submit, fetch, polling, navegacao ou payloads.
- Respeitar `prefers-reduced-motion`.
- Manter o pass como OpenSpec leve apenas com `proposal.md`, `tasks.md` e `prompt.md`.
