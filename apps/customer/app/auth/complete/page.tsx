import { redirect } from 'next/navigation';
import { auth } from '../../../auth';

export default async function AuthCompletePage() {
  const session = await auth();

  if (!session?.user) redirect('/login?error=unauthorized');
  if (session.user.role === 'operator') redirect('http://localhost:3001');
  redirect('/');
}
