'use client';

import React, { useEffect } from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { UserSubmissionScore } from '@/utils/supabase/custom-types';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/(overview)/data-table-column-header';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import ScoreReasonDialog from '@/components/ui/(overview)/score-reason-dialog';

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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subreddit" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <Link href={row.original.permalink!} target="_blank">
          <div title={row.getValue('title')} className="max-w-[500px] truncate">
            <span className="font-medium">{row.getValue('title')}</span>
            <br />
            <span className="text-slate-500">{row.original.subreddit}</span>
          </div>
        </Link>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'content_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Content Type" />
    ),
    cell: ({ row }) => {
      const type = types.find((t) => t.value === row.original.content_type);

      return <Badge variant="outline">{type?.label ?? 'Unknown'}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'score',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score" />
    ),
    filterFn: 'inNumberRange',
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'posted_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Posted At" />
    ),
    cell: ({ row }) => {
      return <span>{format(row.original.posted_at!, 'yyyy-MM-dd HH:mm')}</span>;
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assistance" />
    ),
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = React.useState(false);
      return (
        <div>
          <ScoreReasonDialog
            isOpen={isDialogOpen}
            postText={row.original.text}
            postTitle={row.original.title}
            score={row.original.score}
            onClose={() => setIsDialogOpen(false)}
          />
          <Button onClick={() => setIsDialogOpen(true)}>Assistance</Button>
        </div>
      );
    },
  },
];
