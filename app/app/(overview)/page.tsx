import { ColumnDef } from '@tanstack/react-table';
import { createClient } from '@/utils/supabase/server';

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
];

export default async function Page() {
  const supabase = createClient();

  async function fetchSubmissions() {
    const { data, error } = await supabase.rpc('getusersubmissions', {
      userid: '4a9184bd-357d-42b1-80ab-3d471e54a16c',
      num: 3,
    });

    if (error) {
      console.log('Database Error: Failed to fetch user submissions.', error);
      return [];
    }

    return data;
  }

  const data = await fetchSubmissions();
  console.log(data);
  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here&apos;s a list of your tasks for this month!
        </p>
      </div>
    </>
  );
}
