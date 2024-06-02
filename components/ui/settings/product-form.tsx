'use client';

import { Tables } from '@/types_db';
import { z } from 'zod';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/shadcn-button';
import { updateProduct } from '@/utils/supabase/server-write';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      description: product.description ?? '',
    },
    mode: 'onChange',
  });

  const { isSubmitting, isSubmitSuccessful } = useFormState({
    control: form.control,
  });
  useEffect(() => {
    if (isSubmitSuccessful) {
      toast({
        title: 'Success',
        description: 'Product description updated.',
      });
    }

    form.reset(undefined, { keepDirtyValues: true });
  }, [isSubmitSuccessful]);

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
              <FormControl>
                <Textarea
                  placeholder="Tell us about your product..."
                  className="h-72"
                  {...field}
                />
              </FormControl>
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
