const headers = {
  'api-key': process.env.BREVO_API_KEY!,
  'content-type': 'application/json',
  accept: 'application/json',
};

export interface MailAddress {
  name: string;
  email: string;
}

export interface EmailPayload {
  to: MailAddress[];
  templateId: number;
  params: any;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ...payload,
      sender: {
        name: 'BO HU',
        email: 'beau.hu@featbit.co',
      },
    }),
  });

  if (!response.ok) {
    console.error('Failed to send email', response.statusText, payload);
    return false;
  }

  return true;
}
