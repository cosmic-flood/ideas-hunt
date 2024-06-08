'use server';

import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';
import { fetchProduct } from '@/utils/supabase/server-query';
import * as https from 'https';

const invalidReason = 'Process Invalid';

export async function getScoreReason(
  submission: string,
  currentScore: number,
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return "Can't retrieve user information. Please try again later.";
  }

  const product = await fetchProduct(user.id);
  const projectDescription = product.description;

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.opendevelop.tech/v1',
    httpAgent: agent,
  });
  
  const messages: any[] = [
    {
      role: 'system',
      content:
        'System is a Reddit Expert and Omniscient Sage. System needs to evaluate the relevance of a business/product description to a Reddit post.',
    },
    {
      role: 'user',
      content: `[Reddit post]: ${submission}`,
    },
    {
      role: 'user',
      content: `[Business/Product]: ${projectDescription}`,
    },
    {
      role: 'user',
      content: `You evaluateed the relevance of a business/product description to a Reddit by following the rules: 1. Be reasonable not relevance; 2. If business/product can help directly to the post with high utility, score 6 and higher. If not, score lower than 5; 3. For only inspiration but indirect help, downgrade the score; 4. Downgrade the score if it's unlikely that users will buy; 5. If the post doesn't ask a question or provoke a debate but merely states or share a link, downgrade the score.  \n\r From the score from 1-10 with 10 being the highest and 1 the lowest, you scored ${currentScore}.  \n\r Please explain the relevance between the post and the product description, and how the product can help with the Reddit post. Also, please provide some suggestions for comments that could help us sell the product under the post, but be mindful of avoiding spammy sentences.  \n\r [Do not browse links]`,
    },
  ];

  try {
    const startTime = new Date().getTime();
    const chatCompletion = await openai.chat.completions.create({
      messages,
      model: 'gpt-4o',
      temperature: 0.5,
    });
    const endTime = new Date().getTime();

    const messageContent = chatCompletion.choices[0].message.content;

    console.log(
      `Time taken: ${endTime - startTime}ms, OpenAI usage: ${JSON.stringify(chatCompletion.usage)}`,
    );

    const prompt = `Submission: ${submission}, Description: ${projectDescription}, Response: ${JSON.stringify(chatCompletion)}`;

    if (!messageContent) {
      console.error(
        `OpenAI Error: No message content, returning invalid score. Prompt: ${prompt}`,
      );
      return invalidReason;
    }

    return messageContent;
  } catch (error) {
    console.error('OpenAI Error:', error);
    return invalidReason;
  }
}
