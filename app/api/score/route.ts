import OpenAI from 'openai';

import {
  fetchRedditSubmissions,
  getScheduleJob,
  getSubredditsForScoreScanner,
  insertSubmissionScores,
  saveScheduleJobStartTime,
  updateProjectRedditScanAt,
} from '@/utils/supabase/admin';
import { Tables } from '@/types_db';
import { scoreSubmissions } from '@/utils/score/openai';

type RedditSubmission = Tables<'reddit_submissions'>;
type SubmissionScore = Tables<'projects_subreddits_reddit_submissions'>;

const jobName = 'score';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const apiKey = searchParams.get('api_key');
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
    const submissions = await fetchRedditSubmissions(subreddit.subreddit_id);
    if (submissions.length === 0) {
      continue;
    }

    const scores = await scoreSubmissions(
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
        score: parseFloat(score),
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
