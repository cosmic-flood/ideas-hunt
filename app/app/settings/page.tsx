import { fetchProduct, fetchSubreddits } from '@/utils/supabase/server-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn-card';
import { ProductForm } from '@/components/ui/settings/product-form';
import { SubredditForm } from '@/components/ui/settings/subreddits-form';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { EmailForm } from '@/components/ui/settings/email-form';

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/signin');
  }

  const product = await fetchProduct(user.id);
  const subreddits = await fetchSubreddits(user.id);

  return (
    <div className="flex w-full flex-col gap-8">
      <Card className="flex-1 shadow-none">
        <CardHeader>
          <CardTitle>Product</CardTitle>
          <CardDescription>Describe your product here.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm product={product} />
        </CardContent>
      </Card>
      <Card className="flex-1 shadow-none">
        <CardHeader>
          <CardTitle>Subreddits</CardTitle>
          <CardDescription>Manage your subreddits here.</CardDescription>
        </CardHeader>
        <CardContent>
          <SubredditForm subreddits={subreddits} />
        </CardContent>
      </Card>
      <Card className="flex-1 shadow-none">
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>
            Control how to receive email notification here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailForm email={user.email!} />
        </CardContent>
      </Card>
    </div>
  );
}
