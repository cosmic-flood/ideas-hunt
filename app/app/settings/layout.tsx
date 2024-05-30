import { PropsWithChildren } from 'react';
import Sidebar from '@/components/ui/settings/sidebar';

const sidebarNavItems = [
  {
    title: 'Application',
    href: '/settings',
  },
  {
    title: 'Account',
    href: '/under-construction',
  },
  {
    title: 'Appearance',
    href: '/under-construction',
  },
  {
    title: 'Notifications',
    href: '/under-construction',
  },
  {
    title: 'Display',
    href: '/under-construction',
  },
];

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application settings and set e-mail preferences.
        </p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <aside className="-mx-2 lg:w-1/5">
          <Sidebar items={sidebarNavItems} />
        </aside>
        {children}
      </div>
    </>
  );
}
