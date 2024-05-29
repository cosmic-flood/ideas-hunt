import Link from 'next/link';
import NavLinks from '@/components/ui/navlinks';
import { createClient } from '@/utils/supabase/server';
import User from '@/components/ui/user';

export default async function Header() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <GuestUserHeader />;
  }

  console.log('user', user);
  return <AuthenticatedUserHeader user={user} />;
}

function AuthenticatedUserHeader({ user }: { user: any }) {
  return (
    <div className="w-full border-b p-4 sm:px-6 sm:py-0 md:gap-8">
      <header className="flex items-center justify-between py-2">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 space-x-0.5" aria-label="Logo">
            <span className="font-extrabold">R</span>eddit
            <span className="font-extrabold">L</span>eads
          </Link>
          <NavLinks></NavLinks>
        </div>
        <User user={user} />
      </header>
    </div>
  );
}

function GuestUserHeader() {
  return (
    <div className="w-full border-b p-4 sm:px-6 sm:py-0 md:gap-8">
      <header className="flex items-center justify-between py-2">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6" aria-label="Logo">
            <span className="font-extrabold">R</span>eddit
            <span className="font-extrabold">L</span>eads
          </Link>
        </div>
      </header>
    </div>
  );
}
