import OpenAI from 'openai';

function removeLinks(text: string) {
  return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
}

export async function rateSubmissions(
  openai: OpenAI,
  projectDescription: string,
  submissions: string[],
) {
  let prompt = `
  [Reddit posts]:

  `;

  submissions.forEach((post, index) => {
    prompt += `
      ${index + 1}:${removeLinks(post)}
    `;
  });

  const messages: any[] = [
    {
      role: 'system',
      content: 'System is a Reddit Expert and Omniscient Sage.',
    },
    {
      role: 'user',
      content: prompt,
    },
    {
      role: 'user',
      content: `[Business/Product]: ${projectDescription}`,
    },
    {
      role: 'user',
      content: `How much can my business/product help the Reddit post? And how likely is it that the post will generate leads for my business/product? Please give a score from 1-10 with 10 being the highest and 1 the lowest. Rules: 1. Be reasonable not relevance; 2. If business/product can help directly to the post with high utility, score 6 and higher. If not, score lower than 5; 3. For only inspiration but indirect help, downgrade the score; 4. Downgrade the score if it's unlikely that users will buy; 5. If the post doesn't ask a question or provoke a debate but merely states or share a link, downgrade the score.  | [Do not browse links] | Output the score only in the format: x, it must be from 1 to 10. Respond with a score only for each of the post, separate the index and score with ":"`,
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

    return messageContent?.split('\n').map((line: string) => {
      const parts = line.split(':');
      return parseInt(parts[parts.length - 1]);
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
  }

  return [];
}
