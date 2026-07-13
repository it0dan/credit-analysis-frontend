# Specification — Auth, RBAC, UX fixes e operator dashboard

## Contratos de autenticação

```ts
export type UserRole = 'customer' | 'operator';

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
}

export function useAuthUser(): AuthUser | null;
export function useRole(): UserRole | null;
export function useAuth(): AuthUser | null;
```

O status bruto de sessão continuará disponível por `useSession` do Auth.js. `signIn` e `signOut` serão reexportados pelo pacote compartilhado.

## Contrato do realm

- Realm: `agentic-credit`, habilitado e com SSL desabilitado somente em desenvolvimento.
- Client `frontend-public`: público, Authorization Code Flow e PKCE S256.
- Client `agent-m2m`: confidential, service account e secret de desenvolvimento.
- Realm roles: `customer` e `operator`.
- Usuários demo Keycloak: `demo-cliente` e `demo-operador`, senha temporária desabilitada.
- IdPs Google e GitHub presentes como stubs desabilitados.

## Contrato de RBAC

### Customer

- Públicas: `/login`, `/api/auth/*` e assets estáticos.
- Protegidas: todas as demais rotas.
- Role `customer`: acesso permitido.
- Role `operator`: redirecionamento para `http://localhost:3001`.
- Sem sessão: redirecionamento para `/login`.

### Operator

- Públicas: `/api/auth/*` e assets estáticos.
- Protegidas: todas as páginas.
- Role `operator`: acesso permitido.
- Role `customer` ou sem sessão: `302` para `http://localhost:3000/login?error=unauthorized`.

## Tela `/login`

- Fullscreen, sem `CockpitLayout`.
- Wordmark `◇ ANÁLISE AGÊNTICA` e título `Acesse sua conta`.
- Botões Google e GitHub roteados pelo provider Keycloak.
- Separador visual `ou`.
- Botões demo cliente e operador com menor destaque.
- Mensagem acessível para `?error=`.
- Sem border-radius, box-shadow ou gradiente.
- Interações desabilitadas durante submissão e estados anunciados por texto.

## Input monetário

- Estado interno em centavos inteiros.
- Inicial: `0,00`.
- Somente dígitos afetam o valor.
- Digitação `25000` evolui para `0,02`, `0,25`, `2,50`, `25,00`, `250,00` conforme cada dígito; `2500000` resulta em `25.000,00`.
- Limite: `9.999.999,99`.
- Submit converte para número em reais.
- Menos de `1,00` produz erro de validação.

## Step indicator

- `Tag` e `Pulse` ocupam blocos separados.
- `Pulse` fica em caixa central de 44×44 px com borda aquamarine.
- Nenhuma sobreposição, radius, shadow ou nova animação.

## Operator dashboard

- Dois grupos nomeados com quatro KPIs cada.
- KPIs cobrem eficiência operacional e portfólio de crédito.
- Tabela de cinco decisões recentes representativas.
- CPFs mascarados e status com cores semânticas canônicas.
- Layout responsivo sem overflow horizontal destrutivo.

## Critérios de aceite

- `docker compose up keycloak -d` importa o realm sem configuração manual.
- Os dois apps iniciam sem erro de tipo.
- Acesso anônimo ao customer direciona para `/login`.
- Demo cliente autentica e permanece no customer.
- Demo operador autentica e chega ao operator.
- Operator rejeita sessão customer.
- `session.user.role` e `session.user.id` estão disponíveis nos dois apps.
- Input, step e dashboard atendem aos contratos visuais.
- Densidade aquamarine das telas afetadas é ≥ 2,5%.
- `prefers-reduced-motion` não é violado.
- `npm run check-types` passa.
