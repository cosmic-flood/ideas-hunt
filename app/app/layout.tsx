import { PropsWithChildren } from 'react';
import Header from '@/components/header';

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {children}
      </main>
    </>
  );
}
