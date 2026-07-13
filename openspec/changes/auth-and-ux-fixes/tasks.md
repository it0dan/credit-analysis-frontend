# Tasks — Auth, RBAC, UX fixes e operator dashboard

- [x] 1. Criar `docker-compose.yml` na raiz com serviço Keycloak 25.0.
- [x] 2. Gerar `keycloak/realm-export.json` com realm, clients, mapper de roles, usuários demo e IdPs Google/GitHub.
- [x] 3. Instalar `next-auth@beta` nos workspaces customer, operator e auth conforme dependências efetivamente importadas.
- [x] 4. Criar `packages/auth/src/auth.config.ts` com KeycloakProvider e CredentialsProvider demo.
- [x] 5. Criar inicialização Auth.js por app e exports compartilhados necessários.
- [x] 6. Criar `packages/auth/src/types.ts` e module augmentation para `Session`, `User` e `JWT`.
- [x] 7. Substituir `packages/auth/src/useAuth.ts` por hooks sobre a sessão Auth.js.
- [x] 8. Atualizar `packages/auth/src/index.ts` com os novos exports.
- [x] 9. Criar `apps/customer/app/api/auth/[...nextauth]/route.ts`.
- [x] 10. Criar `apps/customer/app/login/page.tsx` e fluxo de pós-login por role.
- [x] 11. Criar `apps/customer/middleware.ts` com proteção e redirect por role.
- [x] 12. Criar `apps/operator/app/api/auth/[...nextauth]/route.ts`.
- [x] 13. Criar `apps/operator/middleware.ts` exigindo role operator.
- [x] 14. Atualizar o layout customer com `SessionProvider`.
- [x] 15. Atualizar o layout operator com `SessionProvider`.
- [x] 16. Adicionar variáveis aos `.env.example` dos dois apps.
- [x] 17. Corrigir o input monetário do formulário customer.
- [x] 18. Separar visualmente Tag e Pulse no step indicator.
- [x] 19. Implementar oito KPIs e tabela de decisões no operator dashboard.
- [x] 20. Executar `npm run check-types`, lint e build; corrigir erros.
- [x] 21. Subir Keycloak e realizar smoke tests HTTP.
- [x] 22. Validar manualmente no navegador os fluxos demo cliente e operador.
- [x] 23. Validar responsividade, axe, reduced motion e densidade aquamarine.

## Evidências de fechamento

- `npm run check-types`, `npm run lint` e `npm run build`: aprovados em 2026-07-13.
- Playwright + Axe: 4 cenários aprovados, cobrindo os dois perfis, RBAC cross-port, input monetário, viewport 390×844 e reduced motion.
- Densidade aquamarine sobre pixels não-fundo: login 23,28%, customer 17,41% e operator 12,00%.
- Smoke HTTP: customer anônimo 307 para `/login`, login 200 e operator anônimo 307 para `?error=unauthorized`.
