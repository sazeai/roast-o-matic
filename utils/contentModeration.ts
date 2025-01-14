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

