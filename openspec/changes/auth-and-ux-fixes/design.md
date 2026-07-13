# Design — Auth, RBAC, UX fixes e operator dashboard

## Decisão 1 — Keycloak como IdP central

Os aplicativos não registrarão providers OAuth diretos para Google ou GitHub. Ambos serão brokers sociais do Keycloak, que devolverá uma identidade OIDC uniforme ao Auth.js.

O botão social chamará o provider `keycloak` com `kc_idp_hint=google` ou `kc_idp_hint=github`. Assim, adicionar Apple, Microsoft ou SAML corporativo não exige alterar a arquitetura dos frontends.

## Decisão 2 — Estrutura do realm

```text
Realm: agentic-credit
├── Clients
│   ├── frontend-public (public, Authorization Code + PKCE S256)
│   └── agent-m2m (confidential, service account/client credentials)
├── Realm roles
│   ├── customer
│   └── operator
├── Identity providers
│   ├── google (stub desabilitado)
│   └── github (stub desabilitado)
└── Demo users
    ├── demo-cliente@example.com → customer
    └── demo-operador@example.com → operator
```

O client público aceitará callbacks e origens de `localhost:3000` e `localhost:3001`. Um mapper incluirá as realm roles nos tokens para que o callback JWT possa aplicar RBAC sem consulta adicional ao Keycloak.

## Decisão 3 — Keycloak via Docker Compose

O `docker-compose.yml` ficará na raiz do monorepo e montará `keycloak/realm-export.json` em `/opt/keycloak/data/import/realm-export.json`. O serviço usará Keycloak `25.0`, `start-dev --import-realm`, porta `8080` e healthcheck HTTP.

O import de startup é idempotente: se o realm já existir, o Keycloak preservará seu estado. Para reaplicar alterações no export durante desenvolvimento será necessário remover o container/volume correspondente antes de subir novamente.

## Decisão 4 — Auth.js/NextAuth v5

`next-auth@beta` será dependência dos workspaces customer, operator e do pacote compartilhado que importa seus tipos/providers. Cada app terá sua própria inicialização `NextAuth(authConfig)` e exportará `handlers` e `auth`; os route handlers usarão `{ GET, POST } = handlers`, e o middleware consumirá o `auth` inicializado pelo próprio app.

Configuração compartilhada:

- Keycloak OIDC como provider externo único.
- Credentials provider `demo`, somente fora de produção.
- Estratégia de sessão JWT, sem banco de sessão.
- Callback `jwt` normaliza `realm_access.roles` ou a role do usuário demo.
- Callback `session` expõe `session.user.id` e `session.user.role`.
- Module augmentation garante os tipos em `Session`, `User` e `JWT`.
- O mesmo `AUTH_SECRET`/`NEXTAUTH_SECRET` e o mesmo nome de cookie serão usados nos dois apps.

## Decisão 5 — Login único no customer

`apps/customer/app/login/page.tsx` será a única tela de entrada. Ela não usa `CockpitLayout` e preserva a estética terminal-brutalism.

- Google: `signIn('keycloak', ..., { kc_idp_hint: 'google' })`.
- GitHub: `signIn('keycloak', ..., { kc_idp_hint: 'github' })`.
- Demo cliente/operador: `signIn('demo', credentials)`.
- Após autenticação, uma rota de conclusão consulta a sessão e encaminha `operator` para `http://localhost:3001`; `customer` segue para `http://localhost:3000`.

O redirecionamento por papel não ficará no callback genérico `redirect`, pois esse callback não recebe a role da sessão. A decisão será feita em uma rota/página autenticada de pós-login.

## Decisão 6 — Cookie compartilhado entre portas

Cookies não são isolados por porta. Em `localhost`, um cookie host-only com mesmo nome, path `/` e segredo compartilhado é enviado tanto a `:3000` quanto a `:3001`. Portanto, o design omite `domain: 'localhost'`, que tem compatibilidade inconsistente entre navegadores, e usa:

```text
name: authjs.session-token
httpOnly: true
sameSite: lax
path: /
secure: false (somente desenvolvimento HTTP)
```

Em produção, domínio e `secure` serão configurados por ambiente.

## Decisão 7 — RBAC nos middlewares

O customer permite `/login` e `/api/auth/*` publicamente. As demais rotas exigem sessão; `customer` continua no portal e `operator` é enviado ao cockpit.

O operator permite apenas `/api/auth/*` publicamente. Todas as páginas exigem role `operator`; ausência de sessão ou role `customer` redireciona para `http://localhost:3000/login?error=unauthorized`.

O matcher exclui assets do Next.js e arquivos estáticos. A autorização do middleware é defesa de navegação; APIs sensíveis futuras também deverão validar a role no servidor.

## Decisão 8 — `packages/auth` real

O pacote passa a exportar:

```ts
type UserRole = 'customer' | 'operator';
interface AuthUser { id; name; email; image; role }
useAuthUser(): AuthUser | null
useRole(): UserRole | null
useAuth(): AuthUser | null // alias temporário
signIn()
signOut()
authConfig
```

O hook deixa de acessar `localStorage`. Os dois layouts instalam `SessionProvider` em um provider client compartilhado, mantendo os layouts raiz como Server Components quando possível.

## Decisão 9 — UX fixes

O valor monetário será armazenado como centavos inteiros, limitado a R$ 9.999.999,99 e exibido em `pt-BR` com preenchimento da direita para a esquerda. Valores abaixo de R$ 1,00 serão inválidos.

No step indicator, a `Tag` ocupará uma linha própria e o `Pulse` ficará centralizado em um contêiner separado de 44 px, sem radius ou shadow. Não será criada animação adicional.

## Decisão 10 — Operator dashboard

O dashboard terá dois grupos de quatro KPIs:

- Eficiência operacional: HITL, automação, tempo de decisão e custo por análise.
- Portfólio: volume de análises, aprovação, valor aprovado e rejeições por compliance.

Uma terceira seção exibirá cinco decisões recentes representativas com ID, CPF mascarado, valor, status, número de agentes, latência e turno. Os dados permanecerão mockados nesta change e serão identificados como representativos.

## Segurança e limites

- Credentials demo não será habilitado em produção.
- Secrets reais de Google/GitHub não serão versionados.
- O secret M2M do export é estritamente de desenvolvimento.
- Nenhum token será exposto em hooks, logs ou localStorage.
- CPF permanecerá mascarado no dashboard.

## Validação

1. Importar e consultar o realm em `localhost:8080`.
2. Executar `npm run check-types`, lint e build.
3. Verificar redirects sem sessão via HTTP.
4. Validar no navegador os fluxos demo cliente e operador, inclusive cookie cross-port e sign-out.
5. Inspecionar input, step e dashboard em desktop e viewport estreita.
6. Executar axe e medir densidade aquamarine nas telas alteradas.
