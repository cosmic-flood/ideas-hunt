'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UserSubmissionScore } from '@/utils/supabase/reddit-submissions';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/(overview)/data-table-column-header';
import { format } from 'date-fns';

const types = [
  {
    value: 'link',
    label: 'Link',
  },
  {
    value: 'message',
    label: 'Message',
  },
];

export const columns: ColumnDef<UserSubmissionScore>[] = [
  {
    accessorKey: 'subreddit',
    header: 'Subreddit',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'title',
    header: 'Post',
    cell: ({ row }) => {
      return (
        <div title={row.getValue('title')} className="max-w-[500px] truncate">
          <span className="font-medium">{row.getValue('title')}</span>
          <br />
          <span className="text-slate-500">{row.original.subreddit}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'content_type',
    header: 'Content Type',
    cell: ({ row }) => {
      const type = types.find((t) => t.value === row.original.content_type);

      return <Badge variant="outline">{type?.label ?? 'Unknown'}</Badge>;
    },
  },
  {
    accessorKey: 'score',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score" />
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'posted_at',
    header: 'Posted At',
    cell: ({ row }) => {
      const type = types.find((t) => t.value === row.original.content_type);

      return <span>{format(row.original.posted_at!, 'MM-dd-yyyy HH:mm')}</span>;
    },
  },
];
