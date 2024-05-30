'use client';

import { Button } from 'components/ui/shadcn-button';
import Link from 'next/link';
import { signInWithEmail } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

// Define prop type with allowPassword boolean
interface EmailSignInProps {
  allowPassword: boolean;
  redirectMethod: string;
  disableButton?: boolean;
}

export default function EmailSignIn({
  allowPassword,
  redirectMethod,
  disableButton,
}: EmailSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithEmail, router);
    setIsSubmitting(false);
  };

  return (
    <div className="grid gap-6">
      <form noValidate={true} onSubmit={(e) => handleSubmit(e)}>
        <div className="grid gap-2 space-y-4">
          <div className="grid gap-1">
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" disabled={isSubmitting || disableButton}>
            Send Magic Link
          </Button>
        </div>
      </form>
      {allowPassword && (
        <>
          <p>
            <Link href="/signin/password_signin" className="text-sm font-light">
              Sign in with email and password
            </Link>
          </p>
          <p>
            <Link href="/signin/signup" className="text-sm font-light">
              Don't have an account? Sign up
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
