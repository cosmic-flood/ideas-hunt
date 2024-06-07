import * as React from 'react';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDebouncedCallback } from 'use-debounce';
import { searchSubreddits } from '@/utils/reddit/actions';

interface SearchProps {
  onSelectResult: (name: string) => void;
}

export function Search({ onSelectResult }: SearchProps) {
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [subreddits, setSubreddits] = React.useState<string[]>([]);
  const debounced = useDebouncedCallback(async (value: string) => {
    try {
      const subreddits = await searchSubreddits(value);
      setSubreddits(subreddits);
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  return (
    <Command shouldFilter={false} className="h-auto">
      <CommandInput
        className="h-9"
        onValueChange={(q: string) => {
          setIsLoading(true);
          setIsError(false);
          debounced(q);
        }}
        placeholder="Search subreddits..."
      />

      <CommandList className="p-1">
        {isLoading && <div className="p-3 text-sm">Searching...</div>}

        {!isError && !isLoading && !subreddits?.length && (
          <div className="p-3 text-center text-sm">No results found.</div>
        )}

        {isError && <div className="p-3 text-sm">Something went wrong</div>}

        {!isError &&
          !isLoading &&
          subreddits.map((name: string) => {
            return (
              <CommandItem
                key={name}
                onSelect={() => onSelectResult(name)}
                value={name}
              >
                {name}
              </CommandItem>
            );
          })}
      </CommandList>
    </Command>
  );
}
