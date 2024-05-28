// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { ColumnDef } from '@tanstack/react-table';

export type Post = {
  id: string;
  title: string;
  content: string;
  contentType: string;
  subreddit: string;
  score?: number;
  posted_at: Date;
};

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
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
