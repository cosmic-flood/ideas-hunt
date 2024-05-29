'use client';

import { Tables } from '@/types_db';
import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/utils/cn';
import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/shadcn-button';
import { Input } from '@/components/ui/input';
import { updateUserSubreddits } from '@/utils/supabase/write';

type Subreddit = Tables<'subreddits'>;

const subredditFormSchema = z.object({
  subreddits: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .nonempty('You must provide at least one subreddit.'),
});

type SubredditFormValues = z.infer<typeof subredditFormSchema>;

export function SubredditForm({ subreddits }: { subreddits: Subreddit[] }) {
  const { toast } = useToast();

  const form = useForm<SubredditFormValues>({
    resolver: zodResolver(subredditFormSchema),
    defaultValues: {
      subreddits: subreddits.map((x) => ({
        id: x.id,
        name: x.name ?? '',
      })),
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'subreddits',
    control: form.control,
  });

  async function onSubmit(data: SubredditFormValues) {
    const existed = subreddits.map((x) => x.name?.trim()!);

    const current = data.subreddits
      .filter((x) => x.name.trim() !== '')
      .map((x) => x.name);

    const deletes = existed.filter((x) => !current.includes(x));
    const adds = current.filter((x) => !existed.includes(x));

    await updateUserSubreddits(deletes, adds);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`subreddits.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    Subreddits
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Add subreddits where you want to promote your product.
                  </FormDescription>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Cross1Icon
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => {
                          if (fields.length > 1) {
                            remove(index);
                          } else {
                            toast({
                              title: 'Cannot remove last subreddit',
                              description:
                                'You must provide at least one subreddit.',
                            });
                          }
                        }}
                      />
                      <Input {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="-mx-1 mt-3"
            onClick={() => append({ id: '', name: '' })}
          >
            <PlusIcon className="mr-1.5" />
            Add Subreddit
          </Button>
        </div>
        <div className="text-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
