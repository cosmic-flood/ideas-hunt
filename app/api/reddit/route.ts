import snoowrap from 'snoowrap';
import {
  getScheduleJob,
  getSubreddits,
  insertRedditSubmissions,
  saveScheduleJobStartTime,
  saveSubredditLatestScan
} from "@/utils/supabase/admin";
import { Tables } from "@/types_db";

type RedditSubmission = Tables<'reddit_submissions'>;

const jobName = 'reddit_scanner';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const apiKey = searchParams.get('api_key');
  if (apiKey !== process.env.API_KEY) {
    return new Response('OK');
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const userAgent = process.env.REDDIT_USER_AGENT;
  const username = process.env.REDDIT_USERNAME;
  const password = process.env.REDDIT_PASSWORD;

  if (
    clientId === undefined ||
    clientSecret === undefined ||
    userAgent === undefined ||
    username === undefined ||
    password === undefined
  ) {
    return new Response('Missing params', { status: 500 });
  }

  // fetch reddit scan job
  const job = await getScheduleJob(jobName);
  if (job === null) {
    return new Response('OK');
  }

  const reddit = new snoowrap({
    userAgent,
    clientId,
    clientSecret,
    username,
    password
  });

  // fetch subreddits
  const jobStartTime = job.start_time !== null? new Date(job.start_time) : new Date();
  const subreddits = await getSubreddits(jobStartTime);

  if (subreddits.length === 0) {
    await saveScheduleJobStartTime(jobName, new Date());
    return new Response('OK');
  }

  for(let subreddit of subreddits) {
    const { name,  latest_scanned_submission_name } = subreddit;
    const query: any = { limit: 100 };
    if (latest_scanned_submission_name !== null) {
      query.after = latest_scanned_submission_name;
    }

    let posts = await reddit.getSubreddit(name!).getNew(query);
    if (posts.length === 0) {
      continue;
    }

    const submissions = posts.map(p => {
      return {
        reddit_id: p.id,
        name: p.name,
        title: p.title,
        text: p.selftext,
        url: p.url,
        created_at: new Date(p.created_utc * 1000),
        subreddit: p.subreddit.display_name,
      }
    }) as unknown as RedditSubmission[];

    await insertRedditSubmissions(submissions);
    const latestSubmission = submissions[0];
    subreddit.latest_scanned_submission_name = latestSubmission.name;
    subreddit.scanned_at = new Date().toISOString();
    await saveSubredditLatestScan(subreddit);
  }

  return new Response('OK');
}