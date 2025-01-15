import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function moderateContent(content: string): Promise<boolean> {
  try {
    console.log('Attempting to moderate content:', content.substring(0, 50) + '...');
    
    const moderation = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: content,
    });

    console.log('Moderation API response:', JSON.stringify(moderation, null, 2));

    if (moderation.results && moderation.results.length > 0) {
      const result = moderation.results[0];
      
      if (result.flagged) {
        console.warn('Content flagged:', result.categories);
        return false;
      }
    } else {
      throw new Error('Unexpected response format from OpenAI API');
    }

    console.log('Content moderation passed');
    return true;
  } catch (error) {
    console.error('Error in content moderation:', error);
    // In case of an error, we'll assume the content is not safe
    return false;
  }
}

