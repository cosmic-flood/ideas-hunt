'use server';
import { RedditClient } from '@/utils/reddit/client';

export const searchSubreddits = async (query: string) => {
  const client = await RedditClient.getNew();
  if (!client) {
    return [];
  }

  return await client.searchSubreddits(query, 10);
};
