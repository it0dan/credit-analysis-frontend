# Prompt de retomada — Identidade visual terminal-brutalism

Use este prompt para retomar ou re-executar a change `refresh-frontend-visual-identity`.

---

## Contexto

O `credit-analysis-frontend` é um monorepo Turborepo com:
- `apps/customer` — portal do cliente (Next.js, porta 3000)
- `apps/operator` — cockpit do operador (Next.js, porta 3001)
- `packages/ui` — biblioteca de componentes compartilhados
- `packages/ui/tokens/tokens.css` — fonte canônica de tokens de design

A identidade visual é **terminal-brutalism**, definida no deck `harness-engineering-nodebr.html`. O acento dominante é aquamarine `#7FFFD4`. Proibidos: radius > 2px, box-shadow com blur, halos glow, gradientes, tema claro.

A OpenSpec desta change está em `openspec/changes/refresh-frontend-visual-identity/`.

## Estado esperado após esta change

- `packages/ui/tokens/tokens.css` contém exatamente o bloco de tokens abaixo
- `apps/{customer,operator}/app/globals.css` sem compat shim, sem glow keyframes
- Componentes UI sem `--*-glow`, sem `box-shadow`, sem `border-radius > 2px`
- `CockpitLayout` sem theme toggle
- `grep` por hex antigos (`7C3AED`, `EF4444`, `F59E0B`, `3B82F6`) retorna zero
- Screenshots before/after em `docs/screenshots/`

## Bloco de tokens canônicos (copie literalmente para tokens.css)

```css
/* packages/ui/tokens/tokens.css
   Fonte canônica de design tokens — espelha 1:1 o :root do deck
   harness-engineering-nodebr.html. NÃO ALTERAR valores hex sem ADR.
   Estética: terminal-brutalism. Sem radius grande, sem shadow blur, sem glow. */

:root {
  color-scheme: dark;

  /* ── Superfícies ── */
  --bg:     #0A0E14;
  --surf:   #0F141B;

  /* ── Acento principal (signature) ── */
  --acc:    #7FFFD4;   /* aquamarine */

  /* ── Semântica ── */
  --alert:  #FF4655;
  --warn:   #FFB84D;
  --purple: #C9A8F5;
  --blue:   #7EB8F7;

  /* ── Texto ── */
  --text:   #E6EDF3;
  --muted:  #6B7785;

  /* ── Linhas ── */
  --line:   #1E2530;
  --line2:  #2A3340;

  /* ── Fontes (injetadas pelo next/font no layout.tsx) ── */
  --font-mono: var(--font-jetbrains, 'JetBrains Mono', ui-monospace, monospace);
  --font-sans: var(--font-inter, 'Inter', system-ui, sans-serif);

  /* ── Letter-spacing canônico (identidade da marca) ── */
  --ls-label:         0.2em;
  --ls-label-strong:  0.3em;

  /* ── Espaços ── */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px;
  --space-7: 48px; --space-8: 68px;

  /* ── Forma (brutalismo: zero por padrão) ── */
  --radius-0: 0;
  --radius-1: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Validação final

```bash
# Deve retornar zero
grep -rn "7C3AED\|EF4444\|F59E0B\|3B82F6\|bg-card\|color-primary\|shadow-main\|data-theme\|acc-glow\|ok-glow" apps packages

# Build deve passar
pnpm build
```

---

## Status desta change

**CONCLUÍDA em 2026-06-13.** Todas as 16 tasks executadas. Ver `tasks.md` para detalhes.

Arquivos alterados: 23 (tokens, globals, layout, page, 12 componentes UI, README, docs, openspec).

Commit: `fix(visual-identity): substituir paleta purple→aquamarine, remover compat shim e soft design`
