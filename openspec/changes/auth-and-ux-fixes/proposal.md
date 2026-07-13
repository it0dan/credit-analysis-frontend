# Proposal — Auth, RBAC, UX fixes e operator dashboard

## Contexto

O pacote `packages/auth` ainda usa um mock baseado em `localStorage` e infere o papel do usuário pela porta do navegador. Esse comportamento não oferece autenticação, integridade de sessão ou autorização reais e é incompatível com um sistema de referência enterprise.

## Proposta

Adotar Keycloak como provedor de identidade central, integrar Auth.js/NextAuth v5 aos dois aplicativos, expor sessão tipada no pacote compartilhado e aplicar RBAC para os papéis `customer` e `operator`.

Keycloak centraliza usuários, roles, federação social e a evolução futura de tokens M2M para agentes, MCPs e APIs externas. Google e GitHub serão identity providers federados no Keycloak; os frontends continuarão conhecendo apenas um provider OIDC.

Esta change coordena cinco entregas:

1. Keycloak reproduzível via Docker e realm importável.
2. NextAuth v5 e RBAC nos portais customer e operator.
3. Substituição do mock em `packages/auth` por sessão real.
4. Correções do input monetário, step indicator e rota de login.
5. Dashboard operator com KPIs e decisões representativas do sistema agêntico.

## Escopo e invariantes

- Nenhuma alteração será feita no `credit-analysis-agent` ou no loop puro do orquestrador.
- A identidade terminal-brutalism será preservada: sem novos raios, sombras ou gradientes.
- A densidade aquamarine permanecerá acima de 2,5% nas telas afetadas.
- Novas animações deverão respeitar `prefers-reduced-motion`.
- `npm run check-types` deverá passar antes do fechamento.

## Resultado esperado

Usuários não autenticados acessam apenas `/login` e as rotas do Auth.js. O login demo permite validar offline os dois papéis; operadores são direcionados ao cockpit em `:3001`, clientes permanecem no portal em `:3000`, e o dashboard passa a apresentar métricas bancárias e agênticas relevantes.
