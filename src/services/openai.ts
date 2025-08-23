// Using fetch API instead of OpenAI SDK for better browser compatibility
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface CaptionOptimization {
  caption: string;
  hashtags: string[];
  suggestedTiming: string;
  engagementTips: string[];
}

export class OpenAIService {
  static async optimizeCaption(
    childName: string,
    message: string,
    school?: string,
    region?: string
  ): Promise<CaptionOptimization> {
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using fallback');
      return this.getFallbackCaption(childName, message, school, region);
    }

    try {
      const prompt = `
You are a social media expert specializing in Instagram content for non-profit organizations. 

Create an engaging Instagram caption for a thank you message from a child to donors of Project REACH, an organization that bridges Hong Kong's education gap.

Child Details:
- Name: ${childName}
- School: ${school || 'Not specified'}
- Region: ${region || 'Hong Kong'}
- Message: "${message}"

Requirements:
1. Create a heartwarming, authentic caption (150-200 words)
2. Include relevant hashtags (8-12 hashtags)
3. Suggest optimal posting time
4. Provide engagement tips
5. Maintain the child's voice while making it Instagram-friendly
6. Include emojis strategically
7. Focus on impact and gratitude

Return a JSON response with:
{
  "caption": "The main caption text",
  "hashtags": ["array", "of", "hashtags"],
  "suggestedTiming": "Best time to post",
  "engagementTips": ["tip1", "tip2", "tip3"]
}
`;

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert social media manager for non-profit organizations, specializing in creating engaging Instagram content that drives meaningful engagement and donations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) throw new Error('No response from OpenAI');

      // Parse the JSON response
      const parsed = JSON.parse(content) as CaptionOptimization;
      return parsed;

    } catch (error) {
      console.error('Error optimizing caption with OpenAI:', error);
      return this.getFallbackCaption(childName, message, school, region);
    }
  }

  private static getFallbackCaption(
    childName: string,
    message: string,
    school?: string,
    region?: string
  ): CaptionOptimization {
    return {
      caption: `❤️ Thank you message from ${childName}!\n\n"${message}"\n\n${school ? `🏫 ${school}\n` : ''}${region ? `📍 ${region}\n` : ''}Your donations are making dreams come true! 🌟\n\n#ThankYou #ProjectREACH #MakeADifference`,
      hashtags: ['#ProjectREACH', '#ThankYou', '#HongKong', '#Education', '#Gratitude', '#MakeADifference', '#Donation', '#ChildrenFirst'],
      suggestedTiming: 'Best posting times: 7-9 AM or 7-9 PM HKT',
      engagementTips: [
        'Pin this post to your profile',
        'Share to your Instagram Stories',
        'Ask followers to share their own giving experiences'
      ]
    };
  }

  static async analyzeMessageSentiment(message: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    emotions: string[];
    keyThemes: string[];
  }> {
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using fallback');
      return {
        sentiment: 'positive',
        emotions: ['gratitude'],
        keyThemes: ['education']
      };
    }

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Analyze the sentiment and themes of children\'s thank you messages. Return JSON with sentiment, emotions, and key themes.'
            },
            {
              role: 'user',
              content: `Analyze this thank you message: "${message}"`
            }
          ],
          temperature: 0.3,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      return content ? JSON.parse(content) : {
        sentiment: 'positive',
        emotions: ['gratitude', 'joy'],
        keyThemes: ['education', 'thanks']
      };

    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {
        sentiment: 'positive',
        emotions: ['gratitude'],
        keyThemes: ['education']
      };
    }
  }
}
