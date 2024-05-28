ALTER TABLE reddit_submissions
DROP COLUMN subreddit;

ALTER TABLE reddit_submissions
ADD subreddit_id uuid REFERENCES subreddits;