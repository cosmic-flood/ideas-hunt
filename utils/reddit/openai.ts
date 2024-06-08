import OpenAI from 'openai';

const invalidScore = -1;
const invalidReason = "Process Invalid";

function removeLinks(text: string) {
  return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
}

export async function rateSubmissionsV2(
  openai: OpenAI,
  projectDescription: string,
  submissions: string[],
) {
  const scores = [];
  for (const submission of submissions) {
    const score = await rateSubmission(openai, projectDescription, submission);
    scores.push(score);
  }

  return scores;
}

export async function rateSubmission(
  openai: OpenAI,
  projectDescription: string,
  submission: string,
) {
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
      content: `How much can my business/product help the Reddit post? And how likely is it that the post will generate leads for my business/product? Please give a score from 1-10 with 10 being the highest and 1 the lowest. Rules: 1. Be reasonable not relevance; 2. If business/product can help directly to the post with high utility, score 6 and higher. If not, score lower than 5; 3. For only inspiration but indirect help, downgrade the score; 4. Downgrade the score if it's unlikely that users will buy; 5. If the post doesn't ask a question or provoke a debate but merely states or share a link, downgrade the score.  | [Do not browse links] | Output a score as number, it must be from 1 to 10, and do not output any reason.`,
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
      return invalidScore;
    }

    const score = parseInt(messageContent.trim());
    if (Number.isNaN(score)) {
      console.error(
        `OpenAI Error: Invalid score. Prompt: ${prompt}. MessageContent: ${messageContent}`,
      );
      return invalidScore;
    }

    return score;
  } catch (error) {
    console.error('OpenAI Error:', error);
    return invalidScore;
  }
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

    if (!messageContent) {
      console.error(
        `OpenAI Error: No message content, returning empty scores. Prompt: ${prompt}. Response: ${JSON.stringify(chatCompletion)}`,
      );
      return [];
    }

    const scores = messageContent.split('\n').map((line: string) => {
      const parts = line.split(':');
      return parseInt(parts[parts.length - 1]);
    });

    if (scores.length != submissions.length) {
      console.error(
        `Mismatched scores and submissions. Scores: ${scores.length}, Submissions: ${submissions.length}. Prompt: ${prompt}. Response: ${JSON.stringify(chatCompletion)}`,
      );
    }

    return scores;
  } catch (error) {
    console.error('OpenAI Error:', error);
  }

  return [];
}

export async function getScoreReason(
  openai: OpenAI,
  projectDescription: string,
  submission: string,
  currentScore: number,
) {
  const messages: any[] = [
    {
      role: 'system',
      content:
        'System is a Reddit Expert and Omniscient Sage. System needs to evaluate the relevance of a business/product description to a Reddit post.',
    },
    {
      role: 'user',
      content: `, of how much it can help the Reddit post and how likely it is that the post will generate leads for the business/product. From the score from 1-10 with 10 being the highest and 1 the lowest.`,
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
      content: `You evaluateed the relevance of a business/product description to a Reddit by following the rules: 1. Be reasonable not relevance; 2. If business/product can help directly to the post with high utility, score 6 and higher. If not, score lower than 5; 3. For only inspiration but indirect help, downgrade the score; 4. Downgrade the score if it's unlikely that users will buy; 5. If the post doesn't ask a question or provoke a debate but merely states or share a link, downgrade the score.  Output a score as number, it must be from 1 to 10, and do not output any reason.`,
    },
    {
      role: 'user',
      content: `From the score from 1-10 with 10 being the highest and 1 the lowest. You scored ${currentScore}. Please provide a reason for the score by following the rules above. If you are unable to provide a reason, please type "I am unable to provide a reason."`,
    }
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

    const score = parseInt(messageContent.trim());
    if (Number.isNaN(score)) {
      console.error(
        `OpenAI Error: Invalid score. Prompt: ${prompt}. MessageContent: ${messageContent}`,
      );
      return invalidReason;
    }

    return "";
  } catch (error) {
    console.error('OpenAI Error:', error);
    return invalidReason;
  }
}
