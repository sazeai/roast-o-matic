import { OpenAIApi, Configuration } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

const linkRegex = /(https?:\/\/[^\s]+)/g;

export async function filterContent(content: string): Promise<{ isClean: boolean; filteredContent: string }> {
  // Check for links
  if (linkRegex.test(content)) {
    return { isClean: false, filteredContent: content.replace(linkRegex, '[link removed]') };
  }

  try {
    const response = await openai.createModeration({ input: content })
    const result = await response.json()

    if (result.results[0].flagged) {
      return { isClean: false, filteredContent: '[Content removed due to policy violation]' };
    }

    return { isClean: true, filteredContent: content };
  } catch (error) {
    console.error('Error in content moderation:', error);
    throw new Error('Unable to moderate content at this time');
  }
}

