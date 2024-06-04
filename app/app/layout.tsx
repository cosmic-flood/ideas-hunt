import { PropsWithChildren, Suspense } from 'react';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/toaster';

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="my-4 px-6">{children}</main>
      <Suspense>
        <Toaster />
      </Suspense>
    </>
  );
}
