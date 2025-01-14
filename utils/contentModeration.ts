
import { OpenAIApi, Configuration } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export async function moderateContent(content: string): Promise<boolean> {
  try {
    const response = await openai.createModeration({ input: content })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API returned ${response.status} ${response.statusText}: ${errorText}`)
    }
    
    const result = await response.json()

    if (!result || !result.results || result.results.length === 0) {
      throw new Error('Unexpected response format from OpenAI API')
    }

    if (result.results[0].flagged) {
      console.warn('Content flagged:', result.results[0].categories)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in content moderation:', error)
    // In case of an error, we'll assume the content is not safe
    return false
  }
}


// Comment out the existing OpenAI import and configuration
/*



import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });

export async function moderateContent(content: string): Promise<boolean> {
  try {
    const result = await model.generateContent(content);
    const response = await result.response;
    const text = response.text();

    // If we get a response, it means the content passed the safety checks
    return true;
  } catch (error) {
    console.error('Error in content moderation:', error);
    // If there's an error (likely due to safety checks), assume the content is not safe
    return false;
  }
}

*/