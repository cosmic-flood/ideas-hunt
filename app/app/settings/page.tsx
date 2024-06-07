import { fetchProduct, fetchSubreddits } from '@/utils/supabase/server-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn-card';
import { ProductForm } from '@/components/ui/settings/product-form';
import { Subreddits } from '@/components/ui/settings/subreddits';
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
          <CardTitle>Your business, product, or idea.</CardTitle>
          <CardDescription>
            RedditSale will then compare it with subreddit posts and give you a
            relevance score, showing how your description might enhance or
            contribute to the discussions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm product={product} />
        </CardContent>
      </Card>
      <Card className="flex-1 shadow-none">
        <CardHeader>
          <CardTitle>Subreddits</CardTitle>
          <CardDescription>
            RedditSale will track these subreddits and analyze new posts against
            your description to help you identify potential leads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Subreddits subreddits={subreddits.map((x) => x.name!)} />
        </CardContent>
      </Card>
      <Card className="flex-1 shadow-none">
        <CardHeader>
          <CardTitle>Notification</CardTitle>
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
