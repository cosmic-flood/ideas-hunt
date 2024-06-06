'use client';

import * as React from 'react';
import { Tables } from '@/types_db';
import { Button } from '@/components/ui/shadcn-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Search } from './subreddit-search';
import { useToast } from '@/components/ui/use-toast';
import { Error } from '@/utils/data/toasts';
import { updateUserSubreddits } from '@/utils/supabase/server-write';
import { FaRegTimesCircle } from 'react-icons/fa';
import { ReloadIcon } from '@radix-ui/react-icons';

type Subreddit = Tables<'subreddits'>;

export function SubredditForm({ subreddits }: { subreddits: Subreddit[] }) {
  const [openSubredditFilter, setOpenSubredditFilter] = React.useState(false);
  const [localSubreddits, setLocalSubreddits] = React.useState<string[]>(
    subreddits.map((x) => x.name) as string[],
  );
  React.useEffect(() => {
    console.log(subreddits);
  });
  const addLocalSubreddit = (name: string) => {
    let subreddit = localSubreddits.find((x) => x === name);
    if (!subreddit) {
      localSubreddits.push(name);
      setLocalSubreddits([...localSubreddits]);
    }
  };
  const removeLocalSubreddit = (index: number) => {
    localSubreddits.splice(index, 1);
    setLocalSubreddits([...localSubreddits]);
  };
  const handleAddSubredditActive = (name: string) => {
    setOpenSubredditFilter(false);
    addLocalSubreddit(name);
  };

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  async function onSubmit() {
    setIsSubmitting(true);
    const existed = subreddits.map((x) => x.name?.trim()!);
    const current = localSubreddits.map((x) => x?.trim()!);

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
        {localSubreddits.map((field, index) => (
          <div className="mb-2 mr-2" key={field}>
            <Badge className="px-6 py-2 rounded-full" variant="secondary">
              <span className="mr-2"> {field} </span>
              <FaRegTimesCircle
                className="mr ml-1 h-4 w-4 cursor-pointer"
                onClick={() => {
                  removeLocalSubreddit(index);
                }}
              />
            </Badge>
          </div>
        ))}
      </div>
      <Popover open={openSubredditFilter} onOpenChange={setOpenSubredditFilter}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[160px] justify-start py-5"
          >
            + Add Subreddit
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Search onSelectResult={handleAddSubredditActive} />
        </PopoverContent>
      </Popover>

      <div className="text-end">
        {isSubmitting ? (
          <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </Button>
        ) : (
          <Button type="submit" onClick={onSubmit}>Save</Button>
        )}
      </div>
    </>
  );
}
