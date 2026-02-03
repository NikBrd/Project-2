import OpenAI from 'openai';
import { CoinDetails } from '../types';

interface AIRecommendationResponse {
  shouldBuy: boolean;
  explanation: string;
}

export const openAiApi = {
  getRecommendation: async (
    coinDetails: CoinDetails
  ): Promise<AIRecommendationResponse> => {
    const marketData = coinDetails.market_data;
    
    // Validate that we have all required data
    if (!marketData || !marketData.current_price || !marketData.market_cap || !marketData.total_volume) {
      throw new Error('חסרים נתונים על המטבע. אנא נסה שוב.');
    }

    const price30d = marketData.price_change_percentage_30d_in_currency?.usd || 0;
    const price60d = marketData.price_change_percentage_60d_in_currency?.usd || 0;
    const price200d = marketData.price_change_percentage_200d_in_currency?.usd || 0;
    
    const prompt = `You are a cryptocurrency expert. Based on the following data for "${coinDetails.name}" (${coinDetails.symbol}), provide a recommendation on whether to buy this cryptocurrency or not.

Coin Data:
- Name: ${coinDetails.name}
- Current Price (USD): $${marketData.current_price.usd.toLocaleString()}
- Market Cap (USD): $${marketData.market_cap.usd.toLocaleString()}
- 24h Trading Volume (USD): $${marketData.total_volume.usd.toLocaleString()}
- Price change 30 days: ${price30d.toFixed(2)}%
- Price change 60 days: ${price60d.toFixed(2)}%
- Price change 200 days: ${price200d.toFixed(2)}%

Analyze these metrics and provide a professional recommendation in Hebrew.

IMPORTANT: You MUST respond ONLY with valid JSON in this exact format:
{
  "shouldBuy": true,
  "explanation": "Your explanation in Hebrew (2-3 sentences)"
}

Do NOT include any text before or after the JSON. Only return the JSON object.`;

    // Get API key - use VITE_CHATGPT_API_KEY
    const apiKey: string = import.meta.env.VITE_CHATGPT_API_KEY;

    // Debug: log environment info
    console.log('Environment check:', {
      hasViteChatGPT: !!import.meta.env.VITE_CHATGPT_API_KEY,
      apiKeyExists: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      allViteKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')),
    });

    if (!apiKey || apiKey.trim() === '') {
      console.error('API Key is missing or empty!');
      console.error('Make sure .env file exists in project root with: VITE_CHATGPT_API_KEY=your_key');
      throw new Error('מפתח API של OpenAI לא מוגדר. אנא הוסף את VITE_CHATGPT_API_KEY לקובץ .env והפעל מחדש את השרת');
    }

    try {
      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Required for browser usage
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency investment advisor. Always respond with valid JSON only, no additional text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        response_format: { type: 'json_object' }, // Force JSON response
      });

      console.log('OpenAI API Response:', completion);

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      console.log('OpenAI Content:', content);

      try {
        // Try to parse JSON from the response
        let parsedContent = content.trim();
        
        // Remove markdown code blocks if present
        if (parsedContent.includes('```json')) {
          parsedContent = parsedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        } else if (parsedContent.includes('```')) {
          parsedContent = parsedContent.replace(/```\n?/g, '').trim();
        }

        // Try to parse directly first
        try {
          const parsed = JSON.parse(parsedContent);
          console.log('Directly parsed JSON:', parsed);
          
          // Validate the response
          if (typeof parsed.shouldBuy === 'boolean' && parsed.explanation && typeof parsed.explanation === 'string') {
            return {
              shouldBuy: parsed.shouldBuy,
              explanation: parsed.explanation,
            };
          }
        } catch (directParseErr) {
          console.log('Direct parse failed, trying to find JSON object...');
        }

        // Try to find JSON object in the content
        const jsonMatch = parsedContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            console.log('Found and parsed JSON:', parsed);
            
            // Validate the response
            if (typeof parsed.shouldBuy === 'boolean' && parsed.explanation && typeof parsed.explanation === 'string') {
              return {
                shouldBuy: parsed.shouldBuy,
                explanation: parsed.explanation,
              };
            } else if (parsed.explanation && typeof parsed.explanation === 'string') {
              // If shouldBuy is missing or wrong type, try to infer
              const shouldBuy = parsed.shouldBuy === true || parsed.shouldBuy === 'true';
              return {
                shouldBuy,
                explanation: parsed.explanation,
              };
            }
          } catch (parseErr) {
            console.error('JSON parse error:', parseErr);
            console.error('Tried to parse:', jsonMatch[0]);
          }
        }
        
        // Fallback: try to extract shouldBuy and explanation from text using multiple patterns
        const shouldBuyPatterns = [
          /shouldBuy["\s:]+(true|false)/i,
          /"shouldBuy"["\s:]+(true|false)/i,
          /shouldBuy["\s:]+["']?(true|false)["']?/i,
        ];
        
        const explanationPatterns = [
          /"explanation"["\s:]+"([^"]+)"/,
          /explanation["\s:]+"([^"]+)"/,
          /"explanation"["\s:]+'([^']+)'/,
        ];
        
        let shouldBuy: boolean | null = null;
        let explanation: string | null = null;
        
        for (const pattern of shouldBuyPatterns) {
          const match = content.match(pattern);
          if (match) {
            shouldBuy = match[1].toLowerCase() === 'true';
            break;
          }
        }
        
        for (const pattern of explanationPatterns) {
          const match = content.match(pattern);
          if (match) {
            explanation = match[1];
            break;
          }
        }
        
        if (shouldBuy !== null && explanation) {
          return {
            shouldBuy,
            explanation,
          };
        }
        
        // Last resort: return the content as explanation
        if (explanation) {
          return {
            shouldBuy: shouldBuy !== null ? shouldBuy : false,
            explanation,
          };
        }
        
        throw new Error('לא הצלחתי לפרסר את התשובה מה-API. התשובה: ' + content.substring(0, 200));
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        console.error('Content was:', content);
        throw new Error('Failed to parse OpenAI response');
      }
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      
      // Handle OpenAI SDK errors
      if (error.status) {
        if (error.status === 401) {
          throw new Error('API key לא תקין. אנא בדוק את מפתח ה-API.');
        } else if (error.status === 429) {
          throw new Error('יותר מדי בקשות. אנא נסה שוב מאוחר יותר.');
        } else if (error.status === 500) {
          throw new Error('שגיאת שרת ב-OpenAI. אנא נסה שוב מאוחר יותר.');
        } else {
          throw new Error(`שגיאת API: ${error.status} - ${error.message || 'שגיאה לא ידועה'}`);
        }
      } else if (error.message) {
        // Handle other errors
        if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('לא התקבלה תשובה מ-OpenAI. בדוק את החיבור לאינטרנט.');
        }
        throw error;
      } else {
        throw new Error('שגיאה לא ידועה בקבלת המלצה מ-OpenAI');
      }
    }
  },
};

