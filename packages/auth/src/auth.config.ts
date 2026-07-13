import type { NextAuthConfig, Profile } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import KeycloakProvider from 'next-auth/providers/keycloak';
import type { UserRole } from './types';

interface KeycloakProfile extends Profile {
  realm_access?: { roles?: string[] };
}

function extractRole(profile: KeycloakProfile | null | undefined): UserRole {
  return profile?.realm_access?.roles?.includes('operator') ? 'operator' : 'customer';
}

const keycloakProvider = KeycloakProvider({
  clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'frontend-public',
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
  issuer: process.env.KEYCLOAK_ISSUER ?? 'http://localhost:8080/realms/agentic-credit',
  authorization: { params: { scope: 'openid email profile roles' } },
  profile(profile: KeycloakProfile) {
    return {
      id: profile.sub ?? String(profile.preferred_username ?? ''),
      name: profile.name ?? String(profile.preferred_username ?? ''),
      email: profile.email ?? null,
      image: typeof profile.picture === 'string' ? profile.picture : null,
      role: extractRole(profile),
    };
  },
});

const demoProvider = CredentialsProvider({
  id: 'demo',
  name: 'Demo local',
  credentials: {
    username: { label: 'Usuário', type: 'text' },
    password: { label: 'Senha', type: 'password' },
  },
  async authorize(credentials) {
    if (credentials?.password !== 'demo') return null;

    if (credentials.username === 'demo-operador') {
      return {
        id: 'demo-operador',
        name: 'Demo Operador',
        email: 'demo-operador@example.com',
        image: null,
        role: 'operator',
      };
    }

    if (credentials.username === 'demo-cliente') {
      return {
        id: 'demo-cliente',
        name: 'Demo Cliente',
        email: 'demo-cliente@example.com',
        image: null,
        role: 'customer',
      };
    }

    return null;
  },
});

export const authConfig: NextAuthConfig = {
  providers: process.env.NODE_ENV === 'production' ? [keycloakProvider] : [keycloakProvider, demoProvider],
  session: { strategy: 'jwt' },
  trustHost: true,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = user.role ?? 'customer';
        token.userId = user.id ?? token.sub;
      }

      if (account?.provider === 'keycloak') {
        token.role = extractRole(profile as KeycloakProfile | undefined);
        token.userId = profile?.sub ?? token.sub;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId ?? token.sub ?? '';
      session.user.role = token.role ?? 'customer';
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-in-production-32chars!!',
};
