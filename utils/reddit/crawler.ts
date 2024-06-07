import { getRedditType, RedditClient } from '@/utils/reddit/client';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Tables } from '@/types_db';
import { isNullOrUndefinedOrWhitespace } from '@/utils/helpers';

type Subreddit = Tables<'subreddits'>;
type Submission = Tables<'reddit_submissions'>;

export class Crawler {
  constructor(
    private redditClient: RedditClient,
    private supabase: SupabaseClient,
  ) {}

  async crawl(subreddit: Subreddit, limit: number = 2) {
    const { name, latest_scanned_submission_name, latest_posted_at } =
      subreddit;

    let submissions = await this.redditClient.getNewSubmissions(
      name!,
      latest_scanned_submission_name,
      latest_posted_at,
      limit,
    );

    // we got new submissions from the latest scanned submission or
    // the subreddit has no latest scanned submission
    if (
      submissions.length !== 0 ||
      isNullOrUndefinedOrWhitespace(latest_scanned_submission_name)
    ) {
      return submissions;
    }

    // if no new submission found from the latest scanned submission, try crawl from the previous submission.
    // since the latest scanned submission may be deleted
    console.log(
      `No new submission found for ${name}. Try crawl from the submission before ${latest_scanned_submission_name}.`,
    );
    const previousSubmission = await this.getLatestSubmissionBefore(
      latest_scanned_submission_name!,
    );
    if (!previousSubmission) {
      console.log(
        `No previous submission before ${latest_scanned_submission_name}. Return empty submissions.`,
      );
      return [];
    }
    console.log(`Got previous submission: ${previousSubmission.name}.`);

    submissions = await this.redditClient.getNewSubmissions(
      name!,
      previousSubmission.name,
      previousSubmission.posted_at,
      limit,
    );

    // no newer submission found from the previous submission which means the current latest submission has been deleted,
    // so we should update the latest submission to the previous submission
    if (submissions.length === 0) {
      await this.updateLatestSubmission(subreddit.id, previousSubmission);
      return [];
    }

    // we fetched new submissions from the previous submission which may contain the latest submission
    let filteredSubmissions: any[] = [];
    for (let submission of submissions) {
      // filter out the latest scanned submission
      if (submission.name === latest_scanned_submission_name) {
        continue;
      }

      // filter out the duplicated submission
      if (filteredSubmissions.some((s) => s.name === submission.name)) {
        console.log(`Duplicated submission found: ${submission.name}`);
        continue;
      }

      filteredSubmissions.push(submission);
    }

    return filteredSubmissions;
  }

  async save(subreddit_id: string, rawSubmissions: any[]) {
    if (rawSubmissions.length === 0) {
      return;
    }

    const submissions = rawSubmissions
      .sort((a, b) => a.created_utc - b.created_utc)
      .map(convertToSubmission);

    let lastSuccededSubmission: any = null;

    for (let submission of submissions) {
      const { error } = await this.supabase
        .from('reddit_submissions')
        .insert(submission);

      if (error) {
        console.warn(
          `Failed to save ${submission.name} submission to database.`,
          error,
        );

        continue;
      }

      lastSuccededSubmission = submission;
    }

    if (lastSuccededSubmission) {
      await this.updateLatestSubmission(subreddit_id, lastSuccededSubmission);
    }

    function convertToSubmission(p: any) {
      return {
        reddit_id: p.id,
        name: p.name,
        title: p.title,
        text: p.selftext,
        url: p.url,
        permalink: `https://www.reddit.com${p.permalink}`,
        subreddit_id: subreddit_id,
        content_type: getRedditType(p),
        posted_at: new Date(p.created_utc * 1000).toISOString(),
        crawl_url: p.crawl_url,
      };
    }
  }

  private async getLatestSubmissionBefore(
    submission: string,
  ): Promise<Submission | undefined> {
    const { data, error } = await this.supabase
      .rpc('get_latest_submission_before', {
        submission: submission,
      })
      .returns<Submission>();

    if (error) {
      console.log(`No submission found before ${submission}`);
      return undefined;
    }

    return data;
  }

  private async updateLatestSubmission(
    subreddit_id: string,
    submission: Submission,
  ) {
    const { error } = await this.supabase
      .from('subreddits')
      .update({
        latest_scanned_submission_name: submission.name,
        latest_posted_at: submission.posted_at,
      })
      .eq('id', subreddit_id);

    if (error) {
      console.error(
        `Failed to update latest submission for subreddit ${subreddit_id}.`,
        error,
      );
    }
  }
}
