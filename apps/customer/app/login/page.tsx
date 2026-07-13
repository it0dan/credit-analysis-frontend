'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@repo/auth';

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: 'Você não tem permissão para acessar essa área.',
  OAuthSignin: 'Erro ao iniciar login com o provedor.',
  OAuthCallback: 'Erro ao retornar do provedor.',
  CredentialsSignin: 'Credenciais de demonstração inválidas.',
  Configuration: 'A autenticação não está configurada corretamente.',
};

function LoginContent() {
  const params = useSearchParams();
  const router = useRouter();
  const error = params.get('error');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSSO(idpHint: 'google' | 'github') {
    setLoadingProvider(idpHint);
    setLocalError(null);
    await signIn(
      'keycloak',
      { redirectTo: 'http://localhost:3000/auth/complete' },
      { kc_idp_hint: idpHint },
    );
  }

  async function handleDemo(username: 'demo-cliente' | 'demo-operador') {
    setLoadingProvider(username);
    setLocalError(null);

    const result = await signIn('demo', {
      username,
      password: 'demo',
      redirect: false,
    });

    if (result?.error) {
      setLoadingProvider(null);
      setLocalError(ERROR_MESSAGES.CredentialsSignin ?? 'Credenciais de demonstração inválidas.');
      return;
    }

    router.push('/auth/complete');
    router.refresh();
  }

  const visibleError = localError ?? (error ? ERROR_MESSAGES[error] ?? 'Ocorreu um erro. Tente novamente.' : null);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'var(--bg)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <section
        aria-labelledby="login-title"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2.5rem',
          boxSizing: 'border-box',
          background: 'var(--surf)',
          border: '1px solid var(--line)',
          borderLeft: '2px solid var(--acc)',
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--acc)',
              marginBottom: '0.5rem',
            }}
          >
            ◇ ANÁLISE AGÊNTICA
          </div>
          <h1
            id="login-title"
            style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontWeight: 200,
              fontSize: '1.2rem',
              color: 'var(--text)',
              letterSpacing: '-0.01em',
            }}
          >
            Acesse sua <span style={{ color: 'var(--acc)' }}>conta</span>
          </h1>
        </header>

        {visibleError && (
          <div
            role="alert"
            style={{
              border: '1px solid var(--alert)',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              color: 'var(--alert)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
            }}
          >
            {visibleError}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { provider: 'google' as const, symbol: 'G', label: 'Entrar com Google' },
            { provider: 'github' as const, symbol: 'GH', label: 'Entrar com GitHub' },
          ].map(({ provider, symbol, label }) => (
            <button
              key={provider}
              type="button"
              onClick={() => handleSSO(provider)}
              disabled={loadingProvider !== null}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'transparent',
                border: '1px solid var(--acc)',
                color: 'var(--acc)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                cursor: loadingProvider ? 'not-allowed' : 'pointer',
                opacity: loadingProvider && loadingProvider !== provider ? 0.5 : 1,
              }}
            >
              <span aria-hidden="true" style={{ marginRight: '0.7rem' }}>[{symbol}]</span>
              {loadingProvider === provider ? 'Conectando...' : `${label} via Keycloak`}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }} aria-hidden="true">
          <div style={{ flex: 1, height: '1px', background: 'var(--line2)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            ou
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--line2)' }} />
        </div>

        {process.env.NODE_ENV !== 'production' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { username: 'demo-cliente' as const, label: '→ Entrar como Cliente (demo)' },
              { username: 'demo-operador' as const, label: '→ Entrar como Operador (demo)' },
            ].map(({ username, label }) => (
              <button
                key={username}
                type="button"
                onClick={() => handleDemo(username)}
                disabled={loadingProvider !== null}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  background: 'transparent',
                  border: '1px solid var(--line2)',
                  color: 'var(--muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  cursor: loadingProvider ? 'not-allowed' : 'pointer',
                  opacity: loadingProvider && loadingProvider !== username ? 0.5 : 1,
                }}
              >
                {loadingProvider === username ? 'Autenticando...' : label}
              </button>
            ))}
          </div>
        )}

        <p style={{ margin: '2rem 0 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
          análise de crédito agêntica · ambiente de referência
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100vh', background: 'var(--bg)' }} />}>
      <LoginContent />
    </Suspense>
  );
}
