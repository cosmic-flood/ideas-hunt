'use client';

import { Tables } from '@/types_db';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
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
import { updateProduct } from '@/utils/supabase/write';

type Product = Tables<'projects'>;

const productFormSchema = z.object({
  description: z
    .string({
      required_error: 'You must provide a product description.',
    })
    .min(10, {
      message: 'Product description must be at least 10 characters.',
    }),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export function ProductForm({ product }: { product: Product }) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      description: product.description ?? '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: ProductFormValues) {
    await updateProduct(data.description);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your product..."
                  className="h-52"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe your business, product, or idea. RedditSale will then
                compare it with subreddit posts and give you a relevance score,
                showing how your description might enhance or contribute to the
                discussions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
