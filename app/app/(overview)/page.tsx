import SubmissionTable from '@/components/ui/(overview)/submission-table';

export default async function Page() {
  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here&apos;s a list of your tasks for this month!
        </p>
      </div>
      <SubmissionTable />
    </>
  );
}
