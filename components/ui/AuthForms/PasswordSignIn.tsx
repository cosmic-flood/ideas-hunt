'use client';

import { Button } from 'components/ui/shadcn-button';
import Link from 'next/link';
import { signInWithPassword } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function PasswordSignIn({
  allowEmail,
  redirectMethod,
}: PasswordSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithPassword, router);
    setIsSubmitting(false);
  };

  return (
    <div className="grid gap-4">
      <form noValidate={true} onSubmit={(e) => handleSubmit(e)}>
        <div className="grid gap-2 space-y-4">
          <div className="grid gap-1 space-y-2">
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
            />
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            Sign in
          </Button>
        </div>
      </form>
      <div>
        <p>
          <Link href="/signin/forgot_password" className="text-sm font-light">
            Forgot your password?
          </Link>
        </p>
        {allowEmail && (
          <p>
            <Link href="/signin/email_signin" className="text-sm font-light">
              Sign in via magic link
            </Link>
          </p>
        )}
        <p>
          <Link href="/signin/signup" className="text-sm font-light">
            Don't have an account? Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
