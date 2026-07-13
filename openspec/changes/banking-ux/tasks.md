# Tasks — Banking UX

- [x] 1. Criar OpenSpec leve com `proposal.md`, `tasks.md` e `prompt.md`.
- [x] 2. Aplicar linguagem bancária nas páginas customer e nas variantes customer do layout compartilhado.
- [x] 3. Atualizar chunks e mensagens finais da análise para linguagem bancária.
- [x] 4. Criar e exportar `WorkflowCard` com estados queued, active, done, waiting e error.
- [x] 5. Integrar o workflow fluido na página de status customer, mantendo `ReasoningStream` no operator.
- [x] 6. Adicionar logout no header de todos os usos de `CockpitLayout`.
- [x] 7. Ativar `Minha Conta` na navegação customer.
- [x] 8. Criar `/configuracoes` com tabs Perfil, Notificações e Exibição.
- [x] 9. Persistir preferências de notificação e integrar o toggle de debug.
- [x] 10. Validar termos residuais, fluxos, responsividade, reduced motion, acessibilidade e densidade aquamarine.
- [x] 11. Executar `npm run check-types`, lint e build.


## Evidências de fechamento

- Scan de termos técnicos visíveis no customer: 0 ocorrências.
- Playwright: 7 cenários aprovados (Auth/RBAC + Banking UX).
- Axe: 0 violações sérias ou críticas nas telas validadas.
- Densidade aquamarine: home 11,57%; workflow mid 7,68%; workflow done 8,25%; configurações 6,33%.
- Typecheck, lint e build: aprovados em 2026-07-13.
