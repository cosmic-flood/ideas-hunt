'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/shadcn-button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from '@/components/ui/(overview)/data-table-faceted-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  subreddits: string[];
}

export function DataTableToolbar<TData>({
  table,
  subreddits,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-1 items-center space-x-2">
      <Input
        placeholder="Filter posts..."
        value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('title')?.setFilterValue(event.target.value)
        }
        className="h-8 w-[150px] lg:w-[250px]"
      />
      {table.getColumn('subreddit') && (
        <DataTableFacetedFilter
          column={table.getColumn('subreddit')}
          title="Subreddit"
          options={subreddits?.map((subreddit) => ({
            label: subreddit,
            value: subreddit,
          }))}
        />
      )}
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
