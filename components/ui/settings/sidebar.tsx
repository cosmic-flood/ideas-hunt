'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/shadcn-button';
import { useToast } from '@/components/ui/use-toast';
import { ComingSoon } from '@/utils/data/toasts';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export default function Sidebar({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const { toast } = useToast();
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        if (item.href === '/under-construction') {
          return (
            <button
              key={item.title}
              onClick={() => toast(ComingSoon)}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'justify-start',
              )}
            >
              {item.title}
            </button>
          );
        } else {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                pathname === item.href
                  ? 'bg-muted hover:bg-muted'
                  : 'hover:bg-transparent hover:underline',
                'justify-start',
              )}
            >
              {item.title}
            </Link>
          );
        }
      })}
    </nav>
  );
}
