'use client';

import * as React from 'react';
import { Button } from '@/components/ui/shadcn-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Search } from './search-subreddit';
import { useToast } from '@/components/ui/use-toast';
import { Error } from '@/utils/data/toasts';
import { updateUserSubreddits } from '@/utils/supabase/server-write';
import { Cross1Icon, PlusIcon, ReloadIcon } from '@radix-ui/react-icons';

export function Subreddits({
  subreddits: rawSubreddits,
}: {
  subreddits: string[];
}) {
  const [openSubredditFilter, setOpenSubredditFilter] = React.useState(false);
  const [subreddits, setSubreddits] = React.useState<string[]>(
    rawSubreddits.map((x) => x),
  );

  const remove = (index: number) => {
    subreddits.splice(index, 1);
    setSubreddits([...subreddits]);
  };

  const onSelect = (name: string) => {
    setOpenSubredditFilter(false);

    // add if not exist
    let subreddit = subreddits.find((x) => x === name);
    if (!subreddit) {
      subreddits.push(name);
      setSubreddits([...subreddits]);
    }
  };

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit() {
    setIsSubmitting(true);
    const existed = rawSubreddits.map((x) => x);
    const current = subreddits.map((x) => x?.trim()!);

    const deletes = existed.filter((x) => !current.includes(x));
    const adds = current.filter((x) => !existed.includes(x));

    try {
      await updateUserSubreddits(deletes, adds);

      toast({
        title: 'Success',
        description: 'Subreddits updated.',
      });
    } catch (error) {
      toast(Error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-row flex-wrap">
        {subreddits.map((field, index) => (
          <div className="mb-2 mr-2" key={field}>
            <Badge
              className="cursor-default px-2 py-1.5 font-medium"
              variant="secondary"
            >
              {field}
              <Cross1Icon
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => {
                  remove(index);
                }}
              />
            </Badge>
          </div>
        ))}
      </div>
      <Popover open={openSubredditFilter} onOpenChange={setOpenSubredditFilter}>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" role="combobox">
            <PlusIcon />
            Add Subreddit
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" side="right" align="start">
          <Search onSelectResult={onSelect} />
        </PopoverContent>
      </Popover>

      <p className="my-2 text-[0.8rem] text-muted-foreground">
        Add subreddits to monitor for new posts.
      </p>

      <div className="text-end">
        {isSubmitting ? (
          <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </Button>
        ) : (
          <Button type="submit" onClick={onSubmit}>
            Save
          </Button>
        )}
      </div>
    </>
  );
}
