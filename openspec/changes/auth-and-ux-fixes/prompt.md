# Prompt de retomada — Auth, RBAC, UX fixes e operator dashboard

Retomar a implementação descrita em `proposal.md`, `design.md`, `spec.md` e `tasks.md`.

## Estado esperado

- A Etapa 0 confirmou Docker disponível, ausência de NextAuth e ausência de middlewares.
- O mock de `packages/auth` ainda deve ser substituído.
- Nenhuma alteração é permitida no `credit-analysis-agent`.

## Ordem de execução

1. Ler integralmente os cinco artefatos desta change e `AGENTS.md`.
2. Conferir `git status` e preservar mudanças externas.
3. Executar as tasks em ordem e marcar checkboxes somente após validação.
4. Manter commits atômicos com `Ref: openspec/changes/auth-and-ux-fixes/tasks.md#<N>`.
5. Validar Keycloak, tipos, lint, build, redirects e os dois logins demo.
6. Abrir customer e operator no navegador e registrar evidências visuais.

## Alertas técnicos

- Google e GitHub são brokers no Keycloak; usar `kc_idp_hint`, não providers diretos do Auth.js.
- O callback `redirect` não recebe a role; decidir destino em fluxo autenticado de pós-login.
- Cookies não são isolados por porta; usar cookie host-only comum em localhost e o mesmo secret nos dois apps.
- Credentials demo deve ser desabilitado em produção.
- Preservar terminal-brutalism, reduced motion e densidade aquamarine ≥ 2,5%.
