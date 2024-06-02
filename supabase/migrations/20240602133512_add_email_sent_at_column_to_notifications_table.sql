ALTER TABLE notifications
ADD email_sent_at timestamptz;

ALTER TABLE notifications
DROP COLUMN is_email_sent;