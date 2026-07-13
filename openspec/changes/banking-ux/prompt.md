# Prompt de retomada — Banking UX

Continuar a change `banking-ux` no `credit-analysis-frontend`.

Objetivo: concluir linguagem bancária somente no customer, workflow vertical fluido com `WorkflowCard`, logout em todos os portais e `/configuracoes` customer.

Restrições:

- Não tocar em `credit-analysis-agent` nem `compliance-agent`.
- Não instalar dependências de runtime ou bibliotecas de UI.
- Manter os textos técnicos do operator.
- Não adicionar radius maior que 2px, shadow blur ou gradiente.
- Toda animação nova deve respeitar `prefers-reduced-motion`.
- Fechar com scan de termos, screenshots, Axe, densidade aquamarine e `npm run check-types`.

O coração visual é o workflow intermediário: ao menos um card ativo expandido com spinner e outros cards compactos em `Aguardando`.
