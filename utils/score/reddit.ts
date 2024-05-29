const authUrl = 'https://www.reddit.com/api/v1/access_token';

export enum RedditType {
  Comment = 'comment',
  Account = 'account',
  Link = 'link',
  Message = 'message',
  Subreddit = 'subreddit',
  Award = 'award',
}

export function getRedditType(post: any): RedditType {
  return post.selftext === '' ? RedditType.Message : RedditType.Link;
}

export class RedditClient {
  private accessToken: string = '';

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly userAgent: string,
  ) {}

  async init() {
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        'User-Agent': this.userAgent,
      },
      body: 'grant_type=client_credentials',
    });

    if (!authResponse.ok) {
      throw new Error(
        `Failed to obtain access token: ${authResponse.statusText}`,
      );
    }

    const authData = await authResponse.json();
    this.accessToken = authData.access_token;
  }

  static async searchSubreddits(
    query: string,
    limit: number = 10,
  ): Promise<string[]> {
    const response = await fetch(
      `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${query}&include_over_18=0&include_profiles=0&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to search subreddit: ${response.statusText}`);
    }

    const data = await response.json();
    const subreddits = data.data.children.map(
      (subreddit: any) => subreddit.data.display_name_prefixed,
    );

    return subreddits;
  }

  async getNew(
    subreddit: string,
    submissionName: string | null,
    limit: number = 100,
  ) {
    if (this.accessToken === '') {
      await this.init();
    }

    const baseUrl = `https://oauth.reddit.com/${subreddit}/new.json`;
    const url = new URL(baseUrl);
    url.searchParams.append('limit', `${limit}`);
    if (submissionName) {
      url.searchParams.append('before', submissionName);
    }

    const response = await fetch(baseUrl, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch new posts: ${response.statusText}`);
    }

    const data = await response.json();
    const posts = data.data.children.map((post: any) => post.data);
    return posts;
  }
}
