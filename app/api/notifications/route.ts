import { headers } from 'next/headers';
import { waitUntil } from '@vercel/functions';
import {
  fetchNotificationRecipients,
  fetchNotSentNotifications,
  getScheduleJob,
  updateNotificationSentTime,
} from '@/utils/supabase/admin';
import { sendEmail } from '@/utils/notifications/email-sender';

export const runtime = 'nodejs';
export const maxDuration = 60;

const jobName = 'send-email-notifications';

export async function GET(req: Request) {
  const headersList = headers();
  const apiKey = headersList.get('api-key');
  if (apiKey !== process.env.API_KEY) {
    return new Response('OK');
  }

  waitUntil(
    (async () => {
      const startTimestamp = new Date().getTime();
      await sendNotifications();
      console.log(
        `Notifications function took ${new Date().getTime() - startTimestamp}ms`,
      );
    })(),
  );

  return new Response('OK');
}

async function sendNotifications() {
  // fetch reddit scan job
  const job = await getScheduleJob(jobName);
  if (job === null) {
    return new Response('OK');
  }

  // fetch notifications
  const notifications = await fetchNotSentNotifications(1);

  for (const notification of notifications) {
    // fetch recipients
    const recipients = await fetchNotificationRecipients(
      notification.project_id!,
    );

    if (recipients.length === 0) {
      console.log(`No recipients found for notification: ${notification.id}`);
      continue;
    }

    // send email
    const sent = await sendEmail({
      to: recipients.map(({ name, email }) => ({
        email,
        name: name || email,
      })),
      templateId: parseInt(notification.email_template!),
      params: {
        posts: notification.metadata,
      },
    });

    if (sent) {
      // update notification status
      await updateNotificationSentTime(notification.id);
      console.log(`Successfully Sent email to ${JSON.stringify(recipients)}`);
    }
  }
}
