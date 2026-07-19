'use client';

import { useEffect } from 'react';
import { useSession } from '@repo/auth';

export default function AuthCompletePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      window.location.replace('/login?error=unauthorized');
      return;
    }

    if (session.user.role === 'operator') {
      window.location.replace('http://localhost:3001');
      return;
    }

    window.location.replace('/');
  }, [session, status]);

  return null;
}
