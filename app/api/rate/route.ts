import OpenAI from 'openai';
import {
  fetchNotRatedRedditSubmissions,
  getScheduleJob,
  getSubredditsForScoreScanner,
  insertNotifications,
  insertSubmissionScores,
  type Notification,
  saveScheduleJobStartTime,
  updateProjectRedditScanAt,
} from '@/utils/supabase/admin';
import { Tables } from '@/types_db';
import { rateSubmissions } from '@/utils/score/openai';
import { headers } from 'next/headers';
import { waitUntil } from '@vercel/functions';

export const runtime = 'nodejs';
export const maxDuration = 60;

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
  const subreddits = await getSubredditsForScoreScanner(jobStartTime, 5);

  if (subreddits.length === 0) {
    await saveScheduleJobStartTime(jobName, new Date());
    return;
  }

  for (let subreddit of subreddits) {
    await updateProjectRedditScanAt(
      subreddit.projects!.id,
      subreddit.subreddit_id,
      new Date(),
    );
  }

  let rawNotifications: any[] = [];

  for (let subreddit of subreddits) {
    console.log(`Scanning subreddit ${subreddit.subreddits?.name}`);
    const submissions = await fetchNotRatedRedditSubmissions(
      subreddit.project_id,
      subreddit.subreddit_id,
    );

    console.log(`${submissions.length} submissions to rate`);
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

    rawNotifications = [
      ...rawNotifications,
      ...submissions
        .map((submission, idx) => ({
          projectId: subreddit.project_id,
          title: submission.title,
          subreddit: subreddit.subreddits?.name,
          score: scores[idx],
          link: submission.permalink,
          time: new Date(submission.posted_at!).toISOString(),
        }))
        .filter((n) => n.score > 5),
    ];

    try {
      await insertSubmissionScores(submissionScores);
      console.log(
        `Inserted ${submissionScores.length} scores for project ${subreddit.projects!.name}(${subreddit.projects!.id}) and subreddit ${subreddit.subreddit_id}(${subreddit.subreddits!.name})`,
      );
    } catch (err) {
      console.error(
        `Failed to insert ${submissionScores.length} scores for project ${subreddit.projects!.name}(${subreddit.projects!.id}) and subreddit ${subreddit.subreddit_id}(${subreddit.subreddits!.name})`,
      );
    }
  }

  if (rawNotifications.length === 0) {
    return;
  }

  const notifications = Object.entries(
    rawNotifications.reduce((acc, cur) => {
      acc[cur.projectId] = acc[cur.projectId] || [];
      const { title, subreddit, score, link, time } = cur;
      acc[cur.projectId].push({ title, subreddit, score, link, time });
      return acc;
    }, {}),
  ).map(([project_id, metadata]) => ({
    project_id,
    email_template: '6',
    metadata,
  })) as any as Notification[];

  // save notification to db
  await insertNotifications(notifications);
}
