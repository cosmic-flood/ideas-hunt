'use server';

import { RedditClient } from '@/utils/score/reddit';

export const searchSubreddits = async (query: string) => {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const userAgent = process.env.REDDIT_USER_AGENT;

  if (
    clientId === undefined ||
    clientSecret === undefined ||
    userAgent === undefined
  ) {
    return new Response('Missing params', { status: 500 });
  }

  const redditClient = new RedditClient(clientId, clientSecret, userAgent);
  return await redditClient.searchSubreddits(query, 10);
}
