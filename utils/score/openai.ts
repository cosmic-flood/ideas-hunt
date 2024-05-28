import OpenAI from 'openai';

export async function scoreSubmissions(
  openai: OpenAI,
  projectDescription: string,
  submissions: string[],
) {
  const messages: any[] = [
    {
      role: 'system',
      content:
        'You are a Reddit expert who understands the various themes, professions, and capabilities of different Reddit communities. You need to help users match their business/product with the appropriate subreddits. ',
    },
    {
      role: 'user',
      content:
        "[Reddit Post]: How often do you deploy to prod? What is your team's production deployment strategy? I'm looking to improve my team's prod deploy strategy. Right now, we aim to deploy to prod every two weeks but sometimes we only deploy every month! For our prod deploys, we have to do manual regression testing in QA before proceeding the deployment and it's a slow process. I'm wondering how other teams are dealing with their deploy strategy. How often do you or your team deploys to prod and what is your team's production deployment strategy?",
    },
    {
      role: 'user',
      content:
        '[Business/Product Description]: FeatBit, a feature flag management service, built with .NET. Use cases: Testing in Production, Canary Release, AB Testing, and so on. Can enhancing feature delivery effecience and mitigate release risk',
    },
    {
      role: 'user',
      content:
        'Is the business/product above can help what the reddit post talking about? From 1-10, give me only a score. 10 is the most relevant and 1 is the least relevant.',
    },
    {
      role: 'assistant',
      content: '9',
    },
  ];

  let prompt = `
  Evaluate the relativity between the following Reddit posts and the given Business/Product description.

  Description: "${projectDescription}"
  
  Reddit Posts:
  `;

  submissions.forEach((post, index) => {
    prompt += `\n${index + 1}:${post}`;
  });

  prompt += `
  
  Respond with a score from 1 to 10 for each post.
  `;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [...messages, { role: 'user', content: prompt }],
      model: 'gpt-4-turbo-preview',
    });

    const messageContent = chatCompletion.choices[0].message.content;
    return messageContent
      ?.split('\n')
      .map((line: string) => parseInt(line.split(':')[1]));
  } catch (error) {
    console.error('Error evaluating relativity:', error);
    return [];
  }
}
