'use client';

import { useEffect } from 'react';
import { signOut } from '@repo/auth';

export default function LogoutPage() {
  useEffect(() => {
    void signOut({ redirectTo: 'http://localhost:3000/login' });
  }, []);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
      <p style={{ border: '1px solid var(--line)', borderLeft: '2px solid var(--acc)', background: 'var(--surf)', padding: '1rem 1.5rem' }}>
        Encerrando sua sessão...
      </p>
    </main>
  );
}
