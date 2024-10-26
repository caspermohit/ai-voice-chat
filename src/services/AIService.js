import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = 'sk-NSerloAUiyjZGUIWhZ-rsvBaEDQqsVxE3526iWWs6CT3BlbkFJDjw7N8bJ2-eM96XKytfVq0z00K9ZGE23lKhZbwGCAA';
const ORGANIZATION_ID = 'org-jZHnsZEhcLE3tNRofmZqUSz8';

const fallbackResponses = {
  "hello": "Hello! How can I assist you today?",
  "how are you": "I'm an AI assistant, so I don't have feelings, but I'm functioning well and ready to help!",
  "what's the weather": "I'm sorry, I don't have real-time weather information. You might want to check a weather app or website for accurate forecasts.",
  "default": "I'm sorry, I couldn't process your request at the moment. How else can I assist you?"
};

let isApiDisabled = false;
let apiDisabledUntil = null;

const AIService = {
  getResponse: async (text) => {
    // Check if API is temporarily disabled
    if (isApiDisabled && Date.now() < apiDisabledUntil) {
      console.log('API is temporarily disabled. Using fallback response.');
      return AIService.getFallbackResponse(text);
    }

    // Reset API disabled state if the time has passed
    if (isApiDisabled && Date.now() >= apiDisabledUntil) {
      isApiDisabled = false;
      apiDisabledUntil = null;
    }

    // Check cache first
    const cachedResponse = localStorage.getItem(text);
    if (cachedResponse) {
      console.log('Using cached response');
      return cachedResponse;
    }

    try {
      if (!API_KEY) {
        throw new Error('OpenAI API key is not set. Please check your .env file.');
      }

      const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      };

      if (ORGANIZATION_ID) {
        headers['OpenAI-Organization'] = ORGANIZATION_ID;
      }

      const response = await axios.post(API_URL, {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }],
      }, { headers });

      const aiResponse = response.data.choices[0].message.content;
      
      // Cache the response
      localStorage.setItem(text, aiResponse);

      return aiResponse;
    } catch (error) {
      console.error('Error calling OpenAI API:', error.message);
      
      if (error.response && error.response.status === 429) {
        // Disable API for 5 minutes if we get a rate limit error
        isApiDisabled = true;
        apiDisabledUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
        console.log('API rate limited. Disabled for 5 minutes.');
      }
      
      return AIService.getFallbackResponse(text);
    }
  },

  getFallbackResponse: (text) => {
    const lowercaseText = text.toLowerCase();
    for (const [key, value] of Object.entries(fallbackResponses)) {
      if (lowercaseText.includes(key)) {
        return `[Fallback] ${value}`;
      }
    }
    return `[Fallback] ${fallbackResponses.default}`;
  }
};

export default AIService;
