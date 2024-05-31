import { headers } from 'next/headers';
import { waitUntil } from '@vercel/functions';
import {
  getScheduleJob,
  getSubredditsForRedditScanner,
  insertRedditSubmissions,
  saveScheduleJobStartTime,
  saveSubredditLatestScan,
} from '@/utils/supabase/admin';
import { Tables } from '@/types_db';
import { getRedditType, RedditClient } from '@/utils/score/reddit';

export const runtime = 'nodejs';
export const maxDuration = 60;

type RedditSubmission = Tables<'reddit_submissions'>;

const jobName = 'reddit_scanner';

export async function GET(req: Request) {
  const headersList = headers();
  const apiKey = headersList.get('api-key');
  if (apiKey !== process.env.API_KEY) {
    return new Response('OK');
  }

  waitUntil(
    (async () => {
      const startTimestamp = new Date().getTime();
      await crawlReddit();
      console.log(
        `Reddit function took ${new Date().getTime() - startTimestamp}ms`,
      );
    })(),
  );

  return new Response('OK');
}

async function crawlReddit() {
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

  // fetch reddit scan job
  const job = await getScheduleJob(jobName);
  if (job === null) {
    return new Response('OK');
  }

  // fetch subreddits
  const jobStartTime =
    job.start_time !== null ? new Date(job.start_time) : new Date();
  const subreddits = await getSubredditsForRedditScanner(jobStartTime);

  if (subreddits.length === 0) {
    await saveScheduleJobStartTime(jobName, new Date());
    return new Response('OK');
  }

  for (let subreddit of subreddits) {
    const { name, latest_scanned_submission_name } = subreddit;

    let posts: any[] = await redditClient.getNew(
      name!,
      latest_scanned_submission_name,
      100,
    );

    if (posts.length === 0) {
      continue;
    }

    console.log(
      `Crawled ${posts.length} submissions for subreddit ${subreddit.name}(${subreddit.id})`,
    );

    const submissions = posts.map((p) => {
      return {
        reddit_id: p.id,
        name: p.name,
        title: p.title,
        text: p.selftext,
        url: p.url,
        permalink: p.permalink,
        subreddit_id: subreddit.id,
        content_type: getRedditType(p),
        posted_at: new Date(p.created_utc * 1000),
      };
    }) as unknown as RedditSubmission[];

    await insertRedditSubmissions(submissions);
    const latestSubmission = submissions[0];
    subreddit.latest_scanned_submission_name = latestSubmission.name;
    subreddit.scanned_at = new Date().toISOString();
    await saveSubredditLatestScan(subreddit);
  }
}
