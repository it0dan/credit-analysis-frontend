import { useState, useEffect } from 'react';

export type UserRole = 'OPERATOR' | 'CUSTOMER';

export interface AuthContext {
  user_id: string;
  role: UserRole;
  token: string;
}

/**
 * Hook useAuth
 * Lê as credenciais de autenticação (JWT) do cookie/localStorage e decodifica as roles do usuário.
 * 
 * NOTA: Esta é uma implementação inicial de scaffolding (mock). O fluxo real de login será integrado na v2.
 */
export function useAuth(): AuthContext | null {
  const [auth, setAuth] = useState<AuthContext | null>(null);

  useEffect(() => {
    // Tenta ler do localStorage para fins de teste local rápido
    const cachedAuth = typeof window !== 'undefined' ? localStorage.getItem('ag_auth_context') : null;

    if (cachedAuth) {
      try {
        setAuth(JSON.parse(cachedAuth));
        return;
      } catch (e) {
        console.error('[Auth] Failed to parse auth context cache:', e);
      }
    }

    // Fallback: Retorna um contexto padrão simulado para desenvolvimento
    // O tipo de aplicação é detectado por variáveis de ambiente ou pela URL no navegador
    const isOperatorApp = typeof window !== 'undefined' && 
      (window.location.port === '3001' || window.location.pathname.includes('/operator') || process.env.NEXT_PUBLIC_APP_TYPE === 'operator');

    const defaultMockContext: AuthContext = isOperatorApp
      ? {
          user_id: 'OP-1002',
          role: 'OPERATOR',
          token: 'mock-jwt-operator-token-xyz',
        }
      : {
          user_id: 'CUST-8832',
          role: 'CUSTOMER',
          token: 'mock-jwt-customer-token-abc',
        };

    console.warn(`[Auth] Utilizando AuthContext simulado de desenvolvimento (${defaultMockContext.role}).`);
    setAuth(defaultMockContext);
  }, []);

  return auth;
}
