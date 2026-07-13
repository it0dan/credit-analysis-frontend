# HANDOFF — Credit Analysis Frontend

Atualizado em 2026-07-13.

## Estado do repositório

- Repositório: `credit-analysis-frontend`.
- Branch: `main`.
- HEAD e `origin/main`: `d62e15a` (`test(ux): validate banking customer flows`).
- Worktree estava limpo antes desta atualização do HANDOFF.
- Frontends ativos:
  - Customer: `http://localhost:3000`
  - Operator: `http://localhost:3001`
- Serviços integrados ativos:
  - Keycloak: `http://localhost:8080`
  - Compliance: `http://localhost:8085`
  - Orquestrador/API: `http://localhost:8086`

## Auth.js v5, Keycloak e RBAC

- Keycloak 25 roda via `docker-compose.yml` e importa `keycloak/realm-export.json`.
- Realm: `agentic-credit`.
- Clients: `frontend-public` (PKCE) e `agent-m2m`.
- Roles: `customer` e `operator`.
- IdPs Google/GitHub estão configurados como stubs desabilitados; os placeholders precisam ser substituídos antes do SSO real.
- Auth.js/NextAuth v5 usa Keycloak e provider de credenciais demo em desenvolvimento.
- Sessão JWT expõe `session.user.id` e `session.user.role`.
- Cookie de sessão host-only é compartilhado entre as portas 3000 e 3001.
- Middlewares aplicam RBAC:
  - customer anônimo → `/login`
  - operator anônimo ou customer → `/login?error=unauthorized`
  - operator autenticado no customer → `:3001`
- Usuários demo:
  - `demo-cliente` / `demo`
  - `demo-operador` / `demo`
- Logout cross-port navega por `/logout` na origem customer, limpa o cookie com `signOut` e volta a `/login`.

## Banking UX

- Header customer: `Internet Banking`.
- Navegação customer:
  - `> Solicitar Crédito`
  - `> Minhas Propostas`
  - `> Extrato de Propostas`
  - `> Minha Conta`
- Textos técnicos visíveis foram removidos do customer; o operator preserva terminologia interna.
- `packages/ui/src/workflow-card.tsx` substitui o reasoning stream técnico no customer.
- Estados do workflow: `Aguardando`, `Verificando`, `✓ Concluído`, `Em revisão` e `Erro`.
- Card ativo expande via `max-height`, exibe spinner e recebe chunks com fade.
- `prefers-reduced-motion` reduz animações a duração imperceptível.
- `ReasoningStream` permanece no operator.

## Configurações e logout

- `/configuracoes` contém tabs Perfil, Notificações e Exibição.
- Perfil mostra usuário, e-mail, role e logout.
- Preferências persistidas:
  - `dan:pref-email-notify`
  - `dan:pref-status-notify`
- Toggle de debug usa o mesmo contexto do atalho `Ctrl+Shift+D`.
- Botão `→ Sair` está no header de todas as páginas com `CockpitLayout`.

## Outros ajustes concluídos

- Input monetário em centavos com preenchimento da direita para a esquerda e formato pt-BR.
- Step indicator separa Tag e Pulse.
- Operator dashboard possui dois grupos de quatro KPIs e tabela com cinco decisões representativas.
- Contraste dos componentes novos foi corrigido sem alterar tokens globais.
- Nenhuma dependência de runtime de UI foi adicionada.

## OpenSpecs

- `openspec/changes/auth-and-ux-fixes/`: 5 artefatos.
- `openspec/changes/banking-ux/`: 3 artefatos leves.
- Os checklists das duas changes estão concluídos com evidências de validação.

## Validação final

- `npm run check-types`: passou.
- `npm run lint`: passou.
- `npm run build`: passou para customer e operator.
- Playwright Auth/RBAC + Banking UX: 7/7.
- Axe: 0 violações sérias ou críticas nas telas validadas.
- Scan de termos técnicos visíveis no customer: 0 ocorrências.
- Densidade aquamarine:
  - home: 11,57%
  - workflow intermediário: 7,68%
  - workflow concluído: 8,25%
  - configurações: 6,33%

## Screenshots principais

- `docs/screenshots/banking-home.png`
- `docs/screenshots/banking-home-mobile.png`
- `docs/screenshots/banking-workflow-mid.png`
- `docs/screenshots/banking-workflow-done.png`
- `docs/screenshots/banking-settings.png`
- `docs/screenshots/auth-login.png`
- `docs/screenshots/auth-customer-home.png`
- `docs/screenshots/auth-operator-dashboard.png`

## Commits relevantes

### Auth e dashboard

- `7736e67 feat(auth): bootstrap Keycloak realm`
- `a72e8d7 feat(auth): replace mock with Auth.js session`
- `a964eed feat(auth): enforce cross-app RBAC`
- `dece599 feat(operator): expand agentic banking dashboard`
- `7fade80 test(auth): cover cross-app RBAC flows`

### Banking UX

- `15b2378 docs(ux): define banking experience change`
- `d144071 fix(ux): adopt banking language and workflow`
- `ab4cc19 fix(auth): add reliable cross-portal logout`
- `ae48ff6 feat(customer): add account settings`
- `d62e15a test(ux): validate banking customer flows`

## Débitos e avisos

- Conectar KPIs do operator a `GET /analyses/stats`.
- Conectar decisões recentes a `GET /analyses`.
- Criar configurações específicas do operator: fila, SLA e alertas.
- Ativar Google/GitHub no Keycloak após configurar client IDs e secrets reais.
- Revisar timeout/idle de sessão do Keycloak.
- O Next.js 16 avisa que `middleware.ts` será substituído por `proxy.ts`; os arquivos foram mantidos porque o contrato das changes exigia middleware.
- Docker Compose avisa que o campo `version` está obsoleto; foi mantido conforme a especificação original da infraestrutura.

## Como retomar

```bash
cd /home/daniloamaral/agentic/credit-analysis-frontend
docker compose up keycloak -d
npm run dev
npm run check-types
npx playwright test tests/e2e/auth-rbac.spec.ts tests/e2e/banking-ux.spec.ts --workers=1
```

Não alterar `credit-analysis-agent` nem `compliance-agent` ao trabalhar exclusivamente em UX frontend. Preservar terminal-brutalism, reduced motion e densidade aquamarine mínima de 2,5%.
