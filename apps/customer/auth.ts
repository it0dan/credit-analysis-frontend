import NextAuth from 'next-auth';
import { authConfig } from '@repo/auth';

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
