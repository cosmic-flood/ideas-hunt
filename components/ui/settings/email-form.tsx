'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/shadcn-button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReloadIcon } from '@radix-ui/react-icons';

const emailFormSchema = z.object({
  email: z
    .string({
      required_error: 'You must provide a email to receive notifications.',
    })
    .email({
      message: 'Please enter a valid email address.',
    }),
  minimumRelevanceThreshold: z.coerce
    .number()
    .min(1, {
      message: 'Minimum relevance threshold must be between 1 and 10.',
    })
    .max(10, {
      message: 'Minimum relevance threshold must be between 1 and 10.',
    }),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

export function EmailForm({ email }: { email: string }) {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: email ?? '',
      minimumRelevanceThreshold: 5,
    },
    mode: 'onChange',
  });
  const formState = form.formState;

  const { isSubmitting } = formState;

  async function onSubmit(data: EmailFormValues) {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });

    await promise;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input readOnly={true} className="cursor-default" {...field} />
              </FormControl>
              <FormDescription>
                Enter the email address where you'd like to receive alerts
                whenever a new post matches your business, product, or idea.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minimumRelevanceThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Relevance Threshold</FormLabel>
              <Select
                disabled={true}
                onValueChange={field.onChange}
                defaultValue={`${field.value}`}
              >
                <FormControl className="w-52">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 10 }, (value, index) => index).map(
                    (value) => (
                      <SelectItem key={value} value={`${value + 1}`}>
                        {value + 1}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Set a value between 0 and 10. If the relevance score exceeds
                this value, an email notification will be sent to the user.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-end">
          {isSubmitting ? (
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </Button>
          ) : (
            <Button type="submit">Save</Button>
          )}
        </div>
      </form>
    </Form>
  );
}
