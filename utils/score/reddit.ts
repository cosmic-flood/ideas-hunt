const authUrl = 'https://www.reddit.com/api/v1/access_token';

export enum RedditSubmissionContentType {
  Text = 'text',
  Link = 'link',
}

export class RedditClient {
  private accessToken: string = '';

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly userAgent: string,
    private readonly username: string,
    private readonly password: string,
  ) {}

  async init() {
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
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
