import type { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

export type UserRole = 'customer' | 'operator';

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
}

declare module 'next-auth' {
  interface Session {
    user: AuthUser & DefaultSession['user'];
  }

  interface User {
    role?: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    userId?: string;
  }
}
