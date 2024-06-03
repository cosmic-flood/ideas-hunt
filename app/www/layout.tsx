import { PropsWithChildren, Suspense } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Toaster } from '@/components/ui/toaster';

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main
        id="skip"
        className="md:min-h[calc(100dvh-5rem)] min-h-[calc(100dvh-4rem)]"
      >
        {children}
      </main>
      <Footer />
      <Suspense>
        <Toaster />
      </Suspense>
    </>
  );
}
