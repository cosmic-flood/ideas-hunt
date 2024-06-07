import { isNullOrUndefinedOrWhitespace } from '@/utils/helpers';

export enum RedditType {
  Comment = 'comment',
  Account = 'account',
  Link = 'link',
  Message = 'message',
  Subreddit = 'subreddit',
  Award = 'award',
}

export function getRedditType(post: any): RedditType {
  return post.selftext === '' ? RedditType.Link : RedditType.Message;
}

export class RedditClient {
  private accessToken: string = '';

  private constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly userAgent: string,
  ) {}

  static async getNew(): Promise<RedditClient | undefined> {
    const clientId = process.env.REDDIT_CLIENT_ID;
    const clientSecret = process.env.REDDIT_CLIENT_SECRET;
    const userAgent = process.env.REDDIT_USER_AGENT;

    if (
      clientId === undefined ||
      clientSecret === undefined ||
      userAgent === undefined
    ) {
      console.error('Missing environment variables.');
      return undefined;
    }

    const client = new RedditClient(clientId, clientSecret, userAgent);
    try {
      await client.init();
      return client;
    } catch (error) {
      console.error('Failed to init Reddit client:', error);
      return undefined;
    }
  }

  private async init() {
    const authResponse = await fetch(
      'https://www.reddit.com/api/v1/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          'User-Agent': this.userAgent,
        },
        body: 'grant_type=client_credentials',
      },
    );

    if (!authResponse.ok) {
      throw new Error(
        `Failed to obtain access token: ${authResponse.statusText}`,
      );
    }

    const authData = await authResponse.json();
    this.accessToken = authData.access_token;
  }

  async getNewSubmissions(
    subreddit: string,
    latest_scanned_submission: string | null,
    latest_posted_at: string | null,
    limit: number = 5,
  ) {
    const baseUrl = `https://oauth.reddit.com/${subreddit}/new.json`;
    const url = new URL(baseUrl);
    url.searchParams.append('limit', `${limit}`);
    if (!isNullOrUndefinedOrWhitespace(latest_scanned_submission)) {
      url.searchParams.append('before', latest_scanned_submission!);
    }

    console.log(`Start fetching new submissions from ${url}.`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch new submissions from ${url}. Status: ${response.status}:${response.statusText}`,
      );

      return [];
    }

    const body = await response.json();
    const latest_posted_at_timestamp = latest_posted_at
      ? new Date(latest_posted_at).getTime() / 1000
      : 0;

    const rawSubmissions = body.data.children;
    const submissions = rawSubmissions
      .filter(
        (x: any) =>
          x.kind === 't3' &&
          x.data.created_utc >= latest_posted_at_timestamp &&
          x.data.name !== latest_scanned_submission,
      )
      .map((post: any) => ({ ...post.data, crawl_url: `${url}` }));

    if (rawSubmissions.length !== submissions.length) {
      console.warn(
        `Some invalid submissions were filtered out. Requested URL: ${url}. ${subreddit}:${latest_scanned_submission}:${latest_posted_at}`,
      );
    }

    console.log(`Got ${submissions.length} submissions from ${url}.`);
    return submissions;
  }

  async searchSubreddits(query: string, limit: number = 10): Promise<string[]> {
    const url = new URL(
      'https://oauth.reddit.com/api/subreddit_autocomplete_v2.json',
    );
    url.searchParams.append('query', query);
    url.searchParams.append('include_over_18', 'true');
    url.searchParams.append('include_profiles', '0');
    url.searchParams.append('limit', `${limit}`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to search subreddit: ${response.status}:${response.statusText}`,
      );
      return [];
    }

    const data = await response.json();
    return data.data.children.map(
      (subreddit: any) => subreddit.data.display_name_prefixed,
    );
  }
}
