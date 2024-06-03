import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';
import { ensureUserProductCreated } from '@/utils/supabase/server-write';

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  const supabase = createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/signin`,
          error.name,
          "Sorry, we weren't able to log you in. Please try again.",
        ),
      );
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await ensureUserProductCreated(user.id);
  } else {
    console.error('Magic link callback error: User not found.');
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}`,
      'Success!',
      'You are now signed in.',
    ),
  );
}
