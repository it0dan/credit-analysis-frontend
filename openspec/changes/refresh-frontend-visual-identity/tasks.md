# Tasks: Correção da Identidade Visual Frontend

## Task #1 — Substituir tokens.css
- [x] Substituir `packages/ui/tokens/tokens.css` pelo bloco literal em `spec.md`
- Remove: `@layer base`, `--surf2`, `--acc-glow`, `--ok*`, `--alert-glow`, `--warn-glow`, `--blue-glow`, `--radius`, `--radius-sm`, `--radius-pill`, `--shadow`, `--shadow-acc`, `[data-theme="light"]`
- Adiciona: `--purple`, `--ls-label`, `--ls-label-strong`, espaços `--space-*`, `--radius-0`, `--radius-1`

## Task #2 — Remover compat shim do globals.css (customer)
- [x] Deletar bloco "Compat shim" de `apps/customer/app/globals.css`
- [x] Remover `@keyframes pulse-glow` e classes `.glow-pulse-*`
- [x] Atualizar `body` e `h1/h2` para tipografia canônica (mono em headings)
- [x] Remover `border-radius: 4px` do scrollbar thumb
- [x] Manter apenas: import, resets, html/body, h1/h2, scrollbar (sem radius), keyframes `spin`/`fadeIn`/`blink`, `.animate-fade-in`

## Task #3 — Remover compat shim do globals.css (operator)
- [x] Idem task #2 para `apps/operator/app/globals.css`

## Task #4 — Configurar next/font (customer)
- [x] Verificar/configurar `apps/customer/app/layout.tsx` com `next/font/google` para JetBrains Mono (200,300,400,500) e Inter (300,400,500)
- [x] Variáveis CSS: `--font-jetbrains` e `--font-inter`

## Task #5 — Configurar next/font (operator)
- [x] Idem task #4 para `apps/operator/app/layout.tsx`

## Task #6 — Refatorar Pulse.tsx
- [x] Remover `glowClass` de `colorMap`
- [x] Remover `boxShadow` do span interno
- [x] Adicionar `@keyframes pulse-opacity` (opacity: 1→0.3→1) via style tag ou CSS-in-JS inline
- [x] Aplicar animation de opacity; sob `prefers-reduced-motion`, estático

## Task #7 — Refatorar Tag.tsx
- [x] `borderRadius: 0`
- [x] Remover `glowClass` e `pulse` prop behavior (manter prop mas não aplicar glow)
- [x] Background das variantes: usar `transparent` (sem glow alpha)
- [x] Letter-spacing: `var(--ls-label)`

## Task #8 — Refatorar StatusBadge.tsx
- [x] Substituir todos os hsla inline por tokens canônicos
- [x] Remover todos os `boxShadow`
- [x] `borderRadius: 0`
- [x] Remover classes `glow-pulse-*`
- [x] `fontFamily: 'var(--font-mono)'`

## Task #9 — Refatorar HITLPanel.tsx
- [x] Remover `backdropFilter` e `WebkitBackdropFilter`
- [x] `borderRadius: 0`
- [x] Substituir `boxShadow` por `borderLeft: '2px solid var(--acc)'`
- [x] Substituir todos os hsla inline por tokens canônicos
- [x] Botões: `border: 1px solid var(--line2)` + `color: var(--acc)` (aprovação usa `--blue`, reprovação usa `--alert`)
- [x] Remover `transform: translateY(...)` nos hovers (sem elevação)
- [x] `fontFamily: 'var(--font-sans)'`

## Task #10 — Refatorar CockpitLayout.tsx
- [x] Remover `useState`, `useEffect` para tema
- [x] Remover `toggleTheme` function
- [x] Remover botão de theme toggle do header
- [x] Substituir `'use client'` se não houver mais interatividade (manter se ainda necessário para outros handlers)
- [x] Substituir todas as variáveis do shim por tokens canônicos
- [x] Remover `backdrop-filter` e `box-shadow` do header
- [x] Remover `hsl(262...)` e `hsl(24...)` inline; usar `var(--acc)` e `var(--warn)`
- [x] `borderRadius: 0` em todos os elementos

## Task #11 — Refatorar Flow.tsx
- [x] `statusBg`: remover `*-glow`; usar `transparent`
- [x] Nó ativo: remover `boxShadow: 'var(--shadow-acc)'`; usar `outline: '2px solid var(--acc)'`
- [x] Connector: remover `linear-gradient`; usar cor sólida `var(--line2)`

## Task #12 — Refatorar CodeBlock.tsx
- [x] `borderRadius: 0` (remover `var(--radius)` e `var(--radius-sm)`)
- [x] Remover `var(--ok-glow)` do estado `copied`; usar `rgba(127,255,212,0.1)` ou `transparent`

## Task #13 — Refatorar pages do customer
- [x] `apps/customer/app/page.tsx`: remover `--acc-glow`, `boxShadow` de glow; usar `--acc` direto
- [x] `apps/customer/app/status/[request_id]/page.tsx`: remover `--bg-card`, `--shadow-main`, `--color-primary`, `--text-primary`; usar canônicos; radius 0

## Task #14 — Refatorar pages do operator
- [x] `apps/operator/app/page.tsx`: verificar e limpar variáveis do shim
- [x] `apps/operator/app/queue/page.tsx`: idem
- [x] `apps/operator/app/queue/[request_id]/page.tsx`: remover `--bg-card`, `--shadow-main`, `--color-primary`; usar canônicos
- [x] `apps/operator/app/dashboard/page.tsx`: verificar e limpar

## Task #15 — Capturar screenshots e validar
- [x] Build: `pnpm build` — passou sem erros TS
- [x] Screenshots after em `docs/screenshots/` (after-customer-desktop.png, after-customer-mobile.png, after-operator-desktop.png)
- [x] Validação de hex antigos: zero ocorrências de `#7C3AED`, `--acc-glow`, `--shadow-acc`, `[data-theme=light]`
- [ ] axe-core: pendente — rodar manualmente com `npx axe http://localhost:3000`

## Task #16 — Atualizar README
- [x] Adicionar seção "Design Tokens" com paleta canônica
- [x] Adicionar screenshot da home do customer

---

**Concluído em:** 2026-06-13  
**Commit:** `fix(visual-identity): substituir paleta purple→aquamarine, remover compat shim e soft design`
