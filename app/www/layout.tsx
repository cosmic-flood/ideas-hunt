import { PropsWithChildren } from 'react';
import HeaderBar from './headerbar';


export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <HeaderBar />

      <main className="container my-8">{children}</main>

      <footer className="container mt-8 border-t py-16 text-center">
        © 2024 RedditSale.com All rights reserved.
      </footer>
    </>
  );
}
