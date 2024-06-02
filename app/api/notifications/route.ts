import { headers } from 'next/headers';
import { waitUntil } from '@vercel/functions';
import {
  fetchNotSentNotifications,
  getScheduleJob,
  setNotificationAsSent,
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
    // TODO
    // fetch receivers

    // send email
    const sent = await sendEmail({
      to: [
        {
          email: 'hu-beau@outlook.com',
          name: 'Hu-beau',
        },
        {
          email: 'mikcczhang@gmail.com',
          name: '帅哥',
        },
        {
          email: 'lian.yang.work@gmail.com',
          name: '靓仔',
        },
      ],
      templateId: parseInt(notification.email_template!),
      params: {
        posts: notification.metadata,
      },
    });

    if (sent) {
      // update notification status
      await setNotificationAsSent(notification.id);
    }
  }
}
