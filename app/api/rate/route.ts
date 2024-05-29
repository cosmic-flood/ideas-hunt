import OpenAI from 'openai';

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

type SubmissionScore = Tables<'reddit_submissions_scores'>;

const jobName = 'score';

export async function GET(req: Request) {
  const headersList = headers();
  const apiKey = headersList.get('api-key');
  if (apiKey !== process.env.API_KEY) {
    return new Response('OK');
  }

  // fetch reddit scan job
  const job = await getScheduleJob(jobName);
  if (job === null) {
    return new Response('OK');
  }

  const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
    baseURL: 'https://api.opendevelop.tech/v1',
  });

  // fetch subreddits
  const jobStartTime =
    job.start_time !== null ? new Date(job.start_time) : new Date();
  const subreddits = await getSubredditsForScoreScanner(jobStartTime);

  if (subreddits.length === 0) {
    await saveScheduleJobStartTime(jobName, new Date());
    return new Response('OK');
  }

  for (let subreddit of subreddits) {
    const submissions = await fetchNotRatedRedditSubmissions(
      subreddit.project_id,
      subreddit.subreddit_id,
    );

    if (submissions.length === 0) {
      continue;
    }

    const scores = await rateSubmissions(
      openai,
      subreddit.projects?.description!,
      submissions.map((s) => `${s.title} ${s.text}`),
    );
    if (!scores || scores.length === 0) {
      continue;
    }

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
  }

  return new Response('OK');
}
