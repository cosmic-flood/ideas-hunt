import { headers } from 'next/headers';
import { waitUntil } from '@vercel/functions';
import {
  fetchNotificationRecipients,
  fetchNotSentNotifications,
  getScheduleJob,
  Notification,
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
    return new Response(null, { status: 400 });
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
  const scheduler = await getScheduleJob(jobName);

  if (!scheduler) {
    console.error(`${jobName} scheduler not found.`);
    return;
  }

  if (!scheduler.start_time) {
    console.error(`${jobName} scheduler start time is null.`);
    return;
  }

  if (!scheduler.enabled) {
    console.warn(`${jobName} scheduler is disabled.`);
    return;
  }

  // fetch notifications
  let notifications = await fetchNotSentNotifications(20);

  // group notifications by project_id
  notifications = Object.values(
    notifications.reduce(
      (acc, currentValue) => {
        acc[currentValue.project_id!] = acc[currentValue.project_id!] || [];
        acc[currentValue.project_id!].push(currentValue);
        return acc;
      },
      {} as Record<string, Notification[]>,
    ),
  ).map((items: Notification[]) => {
    return items.reduce(
      (acc, currentValue) => {
        acc = acc || { ...currentValue, metadata: [] };
        acc.metadata = [
          ...(acc.metadata as any[]),
          ...(currentValue.metadata as any[]),
        ];
        return acc;
      },
      null as any as Notification,
    );
  });

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
        name: name || email.split('@')[0],
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
