ALTER TABLE projects
ADD relevance_threshold int;

ALTER TABLE projects
ADD email_recipients JSONB;