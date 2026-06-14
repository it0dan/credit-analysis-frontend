# Spec: Correção da Identidade Visual Frontend

## Bloco de tokens canônicos

O arquivo `packages/ui/tokens/tokens.css` deve conter **exatamente** o seguinte (sem modificações de hex):

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
  --radius-1: 2px;   /* uso excepcional, justificado em ADR */
}

/* Sem tema claro. Sem shadow. Sem glow. Sem radius grande.
   Se você está prestes a adicionar qualquer um desses, pare e abra um ADR. */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Critérios de aceite

### Tokens
- [ ] `packages/ui/tokens/tokens.css` é cópia literal do bloco acima
- [ ] `grep` por `7C3AED|EF4444|F59E0B|3B82F6` retorna zero em `apps/` e `packages/`
- [ ] `grep` por `bg-card|color-primary|shadow-main|acc-glow|ok-glow` retorna zero
- [ ] `grep` por `data-theme` retorna zero
- [ ] `grep` por `--radius-pill|--radius-sm|--radius:` retorna zero (exceto em tokens.css canônico)
- [ ] `grep` por `box-shadow` com blur positivo retorna zero (exceto `::-webkit-scrollbar` se necessário)

### Componentes
- [ ] `Pulse`: sem box-shadow, animação via opacity
- [ ] `Tag`: radius 0, sem glow class
- [ ] `StatusBadge`: sem box-shadow, tokens canônicos, radius 0
- [ ] `HITLPanel`: sem backdropFilter, sem box-shadow, tokens canônicos, radius 0
- [ ] `CockpitLayout`: theme toggle removido, variáveis do shim removidas
- [ ] `Flow`: sem `--shadow-acc`, sem gradiente no Connector
- [ ] `CodeBlock`: radius 0

### Visual (gate obrigatório)
- [ ] Screenshots `after-*.png` mostram aquamarine `#7FFFD4` como accent visualmente dominante
- [ ] Screenshots `before-*.png` e `after-*.png` estão em `docs/screenshots/`
- [ ] A diferença before/after é óbvia ao olho nu (roxo → aquamarine)
- [ ] Nenhum elemento tem fundo branco ou claro

### Acessibilidade
- [ ] axe-core: 0 violações sérias/críticas em `localhost:3000` e `localhost:3001`
- [ ] `prefers-reduced-motion` desativa todas as animações

### Build
- [ ] `pnpm build` sem erros de TypeScript
- [ ] Nenhum import de variáveis CSS removidas quebra o build

---

## Antes/Depois por componente

### tokens.css
| Token | Antes | Depois |
|---|---|---|
| `--acc` | `#7C3AED` | `#7FFFD4` |
| `--bg` | `#0A0E1A` | `#0A0E14` |
| `--surf` | `#111827` | `#0F141B` |
| `--alert` | `#EF4444` | `#FF4655` |
| `--warn` | `#F59E0B` | `#FFB84D` |
| `--blue` | `#3B82F6` | `#7EB8F7` |
| `--radius` | `12px` | removido |
| `--shadow` | existe | removido |
| `[data-theme=light]` | existe | removido |

### Pulse.tsx
| Antes | Depois |
|---|---|
| `boxShadow: 0 0 Npx var(--*-glow)` | removido |
| `glowClass` aplicada | removida |
| bolinha circular | bolinha circular, animation via opacity |

### Tag.tsx
| Antes | Depois |
|---|---|
| `borderRadius: 'var(--radius-pill)'` | `borderRadius: 0` |
| `glowClass` aplicada quando `pulse` | removida |
| `bg: 'var(--*-glow)'` | `bg: 'transparent'` |

### StatusBadge.tsx
| Antes | Depois |
|---|---|
| hsla inline para cada status | tokens canônicos (`--alert`, `--warn`, `--blue`, `--acc`, `--muted`) |
| `boxShadow: 0 0 Npx hsla(...)` | removido |
| `borderRadius: 9999px` | `0` |
| `glow-pulse-*` className | removido |

### HITLPanel.tsx
| Antes | Depois |
|---|---|
| `backdropFilter: blur(16px)` | removido |
| `borderRadius: 16px` | `0` |
| `boxShadow: 0 10px 30px...` | `border-left: 2px solid var(--acc)` |
| hsla inline diversas | tokens canônicos |
| `fontFamily: 'Plus Jakarta Sans'` | `var(--font-sans)` |

### CockpitLayout.tsx
| Antes | Depois |
|---|---|
| theme toggle button | removido |
| `useState/useEffect` para tema | removido |
| `--bg-app`, `--bg-navbar`, `--bg-sidebar`, `--bg-footer` | `--bg` / `--surf` direto |
| `--border-glass` | `1px solid var(--line)` |
| `--color-primary` | `--acc` |
| `--text-primary`, `--text-secondary`, `--text-muted` | `--text` / `--muted` |
| `box-shadow: 0 4px 20px...` (navbar) | removido |
| `backdrop-filter: blur(12px)` | removido |
| `hsl(262, 80%, 60%)` (branding) | `var(--acc)` |
| `hsl(24, 100%, 50%)` (branding) | `var(--warn)` |
| `borderRadius: 6/8px` | `0` |

### Flow.tsx
| Antes | Depois |
|---|---|
| `boxShadow: 'var(--shadow-acc)'` | `outline: 2px solid var(--acc)` |
| Connector com `linear-gradient` | cor sólida `var(--line2)` |
| `borderRadius: 50%` para nó | mantido (círculo é semântico) |
| `statusBg` com `*-glow` | `transparent` |
