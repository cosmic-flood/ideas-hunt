import { redirect } from 'next/navigation';
import SubmissionTable from '@/components/ui/(overview)/submission-table';
import StarterDialog from '@/components/ui/(overview)/starter-dialog';
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/signin');
  }

  return (
    <>
      <StarterDialog />
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here&apos;s a list of your tasks for this month!
        </p>
      </div>
      <SubmissionTable user={user} />
    </>
  );
}
