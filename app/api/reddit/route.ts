import { headers } from 'next/headers';
import { waitUntil } from '@vercel/functions';
import { RedditClient } from '@/utils/reddit/client';
import { Scheduler } from '@/utils/reddit/scheduler';
import { createAdminClient } from '@/utils/supabase/admin-client';
import { Crawler } from '@/utils/reddit/crawler';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: Request) {
  const headersList = headers();
  const apiKey = headersList.get('api-key');
  if (apiKey !== process.env.API_KEY) {
    return new Response(null, { status: 400 });
  }

  waitUntil(
    (async () => {
      const startAt = new Date().getTime();
      await crawlReddit();
      console.log(`Crawl reddit took ${new Date().getTime() - startAt}ms`);
    })(),
  );

  return new Response('OK');
}

async function crawlReddit() {
  const redditClient = await RedditClient.getNew();
  if (!redditClient) {
    console.error('Failed to get Reddit client.');
    return;
  }

  const supabase = createAdminClient();
  const scheduler = new Scheduler(supabase);
  console.log('Scheduler start scan subreddits.');
  const subreddits = await scheduler.scan(30);
  if (subreddits === undefined) {
    return;
  }

  if (subreddits.length === 0) {
    console.log('Scheduler cannot found any new subreddits for scan, restart.');
    await scheduler.restart();
    return;
  }

  const crawler = new Crawler(redditClient, supabase);
  for (let subreddit of subreddits) {
    const startAt = new Date().getTime();
    const taskId = `${subreddit.name}:${subreddit.latest_scanned_submission_name ?? 'null'}:${subreddit.latest_posted_at ?? 'null'}`;
    console.log(`Start crawling subreddit: ${taskId}`);

    const rawSubmissions = await crawler.crawl(subreddit, 2);
    await crawler.save(subreddit.id, rawSubmissions);

    console.log(
      `Crawled ${rawSubmissions.length} submissions for subreddit: ${taskId}. Took ${new Date().getTime() - startAt}ms.`,
    );
  }
}
