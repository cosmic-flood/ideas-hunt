import OpenAI from 'openai';
import { waitUntil } from '@vercel/functions';
import {
  fetchNotRatedRedditSubmissions,
  getScheduleJob,
  getSubredditsForScoreScanner,
  insertSubmissionScores,
  saveScheduleJobStartTime,
  updateProjectRedditScanAt,
} from '@/utils/supabase/admin';
import { Tables } from '@/types_db';
import { rateSubmissions } from '@/utils/score/openai';
import { headers } from 'next/headers';
import { waitFor } from '@/utils/helpers';

export const runtime = 'edge';

type SubmissionScore = Tables<'reddit_submissions_scores'>;

const jobName = 'score';

export async function GET(req: Request) {
  const headersList = headers();
  const apiKey = headersList.get('api-key');
  if (apiKey !== process.env.API_KEY) {
    return new Response('OK');
  }

  waitUntil(
    (async () => {
      const startTimestamp = new Date().getTime();
      await rate();
      console.log(
        `Rate function took ${new Date().getTime() - startTimestamp}ms`,
      );
    })(),
  );
  return new Response('OK');
}

async function rate() {
  // fetch reddit scan job
  const job = await getScheduleJob(jobName);
  if (job === null) {
    return;
  }

  const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
    baseURL: 'https://api.opendevelop.tech/v1',
  });

  // fetch subreddits
  const jobStartTime =
    job.start_time !== null ? new Date(job.start_time) : new Date();
  const subreddits = await getSubredditsForScoreScanner(jobStartTime, 1);

  if (subreddits.length === 0) {
    await saveScheduleJobStartTime(jobName, new Date());
    return;
  }

  for (let subreddit of subreddits) {
    console.log(`Scanning subreddit ${subreddit.subreddits?.name}`);
    const submissions = await fetchNotRatedRedditSubmissions(
      subreddit.project_id,
      subreddit.subreddit_id,
    );

    console.log(`${submissions.length} submissions to rate`);
    if (submissions.length === 0) {
      await updateProjectRedditScanAt(
        subreddit.projects!.id,
        subreddit.subreddit_id,
        new Date(),
      );
      continue;
    }

    const scores = await rateSubmissions(
      openai,
      subreddit.projects?.description!,
      submissions.map((s) => `${s.title} ${s.text}`),
    );

    console.log(`${scores?.length} scores to rate`);
    if (!scores || scores.length === 0) {
      continue;
    }

    console.log(
      `Scored ${scores.length} submissions for project ${subreddit.projects!.name}(${subreddit.projects!.id}) and subreddit ${subreddit.subreddit_id}(${subreddit.subreddits!.name})`,
    );

    const submissionScores: SubmissionScore[] = scores.map((score, idx) => {
      return {
        project_id: subreddit.projects!.id,
        subreddit_id: subreddit.subreddit_id,
        reddit_submission_id: submissions[idx].id,
        score: score,
      };
    }) as SubmissionScore[];

    await insertSubmissionScores(submissionScores);
    await updateProjectRedditScanAt(
      subreddit.projects!.id,
      subreddit.subreddit_id,
      new Date(),
    );

    console.log(
      `Inserted ${submissionScores.length} scores for project ${subreddit.projects!.name}(${subreddit.projects!.id}) and subreddit ${subreddit.subreddit_id}(${subreddit.subreddits!.name})`,
    );

    console.log('Sleeping for 10 seconds');
    await waitFor(10000);
  }
}
