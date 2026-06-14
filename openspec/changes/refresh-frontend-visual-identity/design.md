# Design: Correção da Identidade Visual Frontend

## ADR-001-frontend: Adoção de identidade terminal-brutalism

**Data:** 2026-06-13  
**Status:** Aceito  
**Fonte canônica:** `harness-engineering-nodebr.html` (deck NodeBR)

### Decisão

O `credit-analysis-frontend` adota a estética **terminal-brutalism** definida no deck. O acento dominante é aquamarine `#7FFFD4`. As seguintes construções são **proibidas** sem ADR explícito:

- `border-radius > 2px`
- `box-shadow` com blur
- halos tipo glow (`*-glow`, `box-shadow: 0 0 Npx`)
- gradientes em superfícies
- `[data-theme="light"]`
- qualquer hex de cor não presente em `tokens.css`

### Justificativa

O deck é o artefato de identidade visual primário do projeto. Divergências do deck são regressões visuais, não decisões de design. O compat shim da sessão anterior era sintomático: mascarava a regressão sem corrigi-la, mantendo tokens errados ativos em runtime.

---

## Decisão arquitetural: remoção do compat shim

O bloco "Compat shim" em `globals.css` mapeia nomes antigos (`--bg-card`, `--color-primary`, `--shadow-main`) para os tokens novos. Isso significa que componentes continuam lendo variáveis que não existem na fonte canônica, tornando impossível validar a conformidade apenas olhando para `tokens.css`.

**Consequência:** o shim é deletado. Componentes são refatorados para ler tokens canônicos diretamente.

---

## Estratégia de refatoração: mapeamento de tokens

### Tokens do shim → canônicos

| Token do shim | Token canônico | Observação |
|---|---|---|
| `--bg-app` | `--bg` | fundo global |
| `--bg-card` | `--surf` | superfície de card |
| `--bg-card-hover` | usar `--line` como overlay | não há cor sólida de hover |
| `--bg-sidebar` | `--surf` | |
| `--bg-navbar` | `--surf` | |
| `--bg-footer` | `--bg` | |
| `--border-glass` | `1px solid var(--line)` | inline, não variável |
| `--border-glass-hover` | `1px solid var(--acc)` | hover muda para acento |
| `--color-primary` | `--acc` | |
| `--color-primary-glow` | **remover** | sem glow |
| `--color-secondary` | `--warn` | |
| `--color-emerald` | `--alert` (se erro) ou `--blue` (se info) | depende do contexto |
| `--color-rose` | `--alert` | |
| `--color-amber` | `--warn` | |
| `--text-primary` | `--text` | |
| `--text-secondary` | `--muted` | |
| `--text-muted` | `--muted` | |
| `--shadow-main` | **remover** | sem shadow |
| `--font-primary` | `--font-sans` | |
| `--font-heading` | `--font-mono` | headings são mono no deck |

### Regras de substituição por padrão visual

| Padrão antigo | Substituição |
|---|---|
| `box-shadow` para profundidade | `border-left: 2px solid var(--acc)` |
| `border-radius: 8px+` | `0` |
| `glow-pulse-*` | Pulse primitiva: bolinha 6×6, `opacity` animation, sem box-shadow |
| gradiente de fundo | fundo sólido `--surf` ou `--bg` |
| hover de card muda background | hover muda `border-color` de `--line2` para `--acc` |
| botão cheio colorido | `border: 1px solid var(--line2)` + `color: var(--acc)` |
| `border-radius: 9999px` em tag/badge | `0` (brutalismo) |
| `backdrop-filter: blur(...)` | removido |

---

## Componentes a refatorar (16 arquivos)

| Arquivo | Mudanças principais |
|---|---|
| `packages/ui/tokens/tokens.css` | substituição integral da paleta |
| `apps/customer/app/globals.css` | remoção do compat shim, remoção de glow keyframes, remoção de `[data-theme=light]` |
| `apps/operator/app/globals.css` | idem |
| `packages/ui/src/pulse.tsx` | remover box-shadow/glow; bolinha sólida com opacity animation |
| `packages/ui/src/tag.tsx` | remover `--radius-pill`, remover `glowClass`; radius 0 |
| `packages/ui/src/status-badge.tsx` | remover hsla inline, remover box-shadow; usar tokens canônicos; radius 0 |
| `packages/ui/src/hitl-panel.tsx` | remover hsla inline, backdropFilter, box-shadow; usar tokens canônicos; radius 0 |
| `packages/ui/src/cockpit-layout.tsx` | remover theme toggle, remover variáveis do shim, usar tokens canônicos |
| `packages/ui/src/flow.tsx` | remover `--shadow-acc`, remover gradiente no Connector; usar tokens canônicos |
| `packages/ui/src/code-block.tsx` | remover `--radius`, `--radius-sm`; usar `--radius-0` ou `0` |
| `apps/customer/app/page.tsx` | remover `--acc-glow`, box-shadow glow; usar tokens canônicos |
| `apps/customer/app/page.module.css` | não é usado pelas páginas reais; manter mas limpar radius |
| `apps/customer/app/status/[request_id]/page.tsx` | remover `--bg-card`, `--shadow-main`, `--color-primary`; usar canônicos |
| `apps/operator/app/page.tsx` | verificar e limpar |
| `apps/operator/app/queue/page.tsx` | verificar e limpar |
| `apps/operator/app/queue/[request_id]/page.tsx` | remover `--bg-card`, `--shadow-main`, `--color-primary`; usar canônicos |
| `apps/operator/app/dashboard/page.tsx` | verificar e limpar |
