'use client'

import * as React from 'react';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDebouncedCallback  } from 'use-debounce';
import { searchSubreddits } from '@/actions/reddit';

interface SearchProps {
  onSelectResult: (name: string) => void;
}

export function Search({ onSelectResult }: SearchProps) {

  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [subreddits, setSubreddits] = React.useState<string[]>([]);
  const debounced = useDebouncedCallback(
    async (value: string) => {
      try{
        const sbts = (await searchSubreddits(value));
        setSubreddits(sbts as string[]);
      }
      catch(e){
        setIsError(true);
      }
      finally{
        setIsLoading(false);
      }
    },
    500
  );

  const handleSelectResult = (item: string) => {
    onSelectResult(item);
  };

  return (
    <Command
      shouldFilter={false}
      className="h-auto rounded-lg border border-b-0 shadow-md"
    >
      <CommandInput
        value={searchQuery}
        onValueChange={(q: string) => {
          setIsLoading(true);
          setSearchQuery(q);
          debounced(q);
        }}
        placeholder="Search for product"
      />

      <SearchResults
        subreddits={subreddits}
        onSelectResult={handleSelectResult}
        isError={isError}
        isLoading={isLoading}
      />
    </Command>
  );
}

interface SearchResultsProps {
  subreddits: string[];
  onSelectResult: SearchProps['onSelectResult'];
  isError: boolean;
  isLoading: boolean;
}

function SearchResults({
  subreddits,
  onSelectResult,
  isError,
  isLoading
}: SearchResultsProps) {

  return (
    <CommandList>
      {isLoading && <div className="p-4 text-sm">Searching...</div>}
      {!isError && !isLoading && !subreddits?.length && (
        <div className="p-4 text-sm">No item found</div>
      )}
      {isError && <div className="p-4 text-sm">Something went wrong</div>}

      {subreddits.map((name: string) => {
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
  );
}
