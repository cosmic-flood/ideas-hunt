'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/utils/cn';

export default function NavLinks() {
  const currentPath = usePathname();

  return (
    <nav className="flex items-center gap-4 text-sm lg:gap-6">
      <Link
        href="/"
        className={cn(
          currentPath === '/' ? 'font-extrabold' : '',
          'text-foreground/60 transition-colors hover:text-foreground/80',
        )}
      >
        Home
      </Link>
      <Link
        href="/settings"
        className={cn(
          currentPath === '/settings' ? 'font-extrabold' : '',
          'text-foreground/60 transition-colors hover:text-foreground/80',
        )}
      >
        Leads Settings
      </Link>
    </nav>
  );
}
