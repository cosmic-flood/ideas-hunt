import { headers } from 'next/headers';
import { waitUntil } from '@vercel/functions';
import {
  getLatestSubmissionBefore,
  getScheduleJob,
  insertRedditSubmissions,
  saveScheduleJobStartTime,
  saveSubredditLatestScan,
  scanSubreddits,
} from '@/utils/supabase/admin';
import { Tables } from '@/types_db';
import { getRedditType, RedditClient } from '@/utils/score/reddit';
import { isNullOrUndefinedOrWhitespace } from '@/utils/helpers';

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
  const subreddits = await scanSubreddits(jobStartTime);

  if (subreddits.length === 0) {
    await saveScheduleJobStartTime(jobName, new Date());
    return new Response('OK');
  }

  for (let subreddit of subreddits) {
    const { name, latest_scanned_submission_name } = subreddit;

    let posts: any[] = await redditClient.getNew(
      name!,
      latest_scanned_submission_name,
      2,
    );

    if (
      posts.length === 0 &&
      !isNullOrUndefinedOrWhitespace(latest_scanned_submission_name)
    ) {
      const previousSubmissionName = await getLatestSubmissionBefore(
        latest_scanned_submission_name!,
      );

      posts = await redditClient.getNew(name!, previousSubmissionName, 2);

      // Possible cases:
      // 1. posts.length === 0: latest_scanned_submission_name is removed, we should save the previous
      //    submission[latestSubmissionName] as latest_scanned_submission_name in DB
      // 2. posts.length > 0:
      //    2.1 posts contains only the latest_scanned_submission_name: latest_scanned_submission_name is not removed,
      //        and we should do nothing in DB
      //    2.2 posts contains more than 1 submission:
      //        2.2.1 posts contains latest_scanned_submission_name: do nothing in DB
      //        2.2.2 posts does not contain latest_scanned_submission_name: theoretically we should save
      //              latestSubmissionName in DB, but we can ignore it since we will save latestSubmissionName
      //              at the last step of the loop
      if (posts.length === 0) {
        subreddit.latest_scanned_submission_name = previousSubmissionName;
        await saveSubredditLatestScan(subreddit);
      }

      posts = posts.filter((p) => p.name !== latest_scanned_submission_name);
    }

    console.log(`Fetched ${posts.length} submissions for subreddit ${name}`);
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
        permalink: `https://www.reddit.com${p.permalink}`,
        subreddit_id: subreddit.id,
        content_type: getRedditType(p),
        posted_at: new Date(p.created_utc * 1000),
        crawl_url: p.crawl_url,
      };
    }) as unknown as RedditSubmission[];

    await insertRedditSubmissions(submissions);
    const latestSubmission = submissions[0];
    subreddit.latest_scanned_submission_name = latestSubmission.name;
    await saveSubredditLatestScan(subreddit);
  }
}
