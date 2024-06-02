import { PropsWithChildren, Suspense } from "react";
import HeaderBar from "./headerbar";

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <HeaderBar />

      <main className="container my-8">
        {children}
      </main>

      <footer className="container py-4 text-center border-t mt-8">
        © 2024 RedditSale.com All rights reserved.
      </footer>
    </>
  );
}