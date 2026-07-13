'use client';

import { useSession } from 'next-auth/react';
import type { AuthUser } from './types';

export function useAuthUser(): AuthUser | null {
  const { data: session, status } = useSession();
  if (status !== 'authenticated' || !session?.user) return null;

  return {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
    role: session.user.role,
  };
}

export function useRole() {
  return useAuthUser()?.role ?? null;
}

export const useAuth = useAuthUser;
