'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/shadcn-button';
import { DataTableFacetedFilter } from '@/components/ui/(overview)/data-table-faceted-filter';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { ScoreFilter } from '@/components/ui/(overview)/score-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  subreddits: string[];
}

export function DataTableToolbar<TData>({
  table,
  subreddits,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const title = table.getColumn('title');
  const score = table.getColumn('score');
  const subreddit = table.getColumn('subreddit');

  return (
    <div className="flex flex-1 items-center space-x-2">
      <DebouncedInput
        placeholder="Filter posts..."
        value={(title?.getFilterValue() as string) ?? ''}
        onChange={(value) => title?.setFilterValue(value)}
        className="h-8 w-[150px] lg:w-[250px]"
      />
      <ScoreFilter column={score} />
      <DataTableFacetedFilter
        column={subreddit}
        title="Subreddit"
        options={subreddits?.map((subreddit) => ({
          label: subreddit,
          value: subreddit,
        }))}
      />
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <Cross2Icon className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
