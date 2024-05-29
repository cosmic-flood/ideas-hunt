'use server';

import { createClient } from '@/utils/supabase/server';
import { Tables } from '@/types_db';
import { User } from '@supabase/supabase-js';

const supabase = createClient();

type Subreddit = Tables<'subreddits'>;
type Product = Tables<'projects'>;

export async function fetchCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function fetchSubreddits(userId: string): Promise<Subreddit[]> {
  const { data, error } = await supabase.rpc('get_user_subreddits', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Database Error: Failed to fetch subreddits.', error);
    return [];
  }

  return data;
}

export async function fetchProduct(userId: string): Promise<Product> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Database Error: Failed to fetch products.', error);
    return {} as Product;
  }

  return data;
}
