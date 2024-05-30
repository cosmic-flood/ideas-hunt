import { PropsWithChildren, Suspense } from 'react';
import Header from '@/components/header';
import { Toaster as NewToaster } from '@/components/ui/toaster';
import { Toaster as BuiltInToaster } from '@/components/ui/Toasts/toaster';

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="my-4 px-6">{children}</main>
      <NewToaster />
      <Suspense>
        <BuiltInToaster />
      </Suspense>
    </>
  );
}
