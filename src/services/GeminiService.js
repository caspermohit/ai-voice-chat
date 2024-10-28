import { GoogleGenerativeAI } from "@google/generative-ai";
import LocalAIService from "./LocalAIService";

class GeminiService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("Gemini API key is missing");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-pro",
      // Add generation config to make responses faster and more concise
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 200,
      }
    });
    this.localAI = new LocalAIService();
    
    // Cache for storing recent responses
    this.cache = new Map();
    this.CACHE_SIZE = 50;
  }

  async getResponse(prompt) {
    if (!navigator.onLine) {
      console.log("Offline: Using local AI service");
      return this.localAI.getResponse(prompt);
    }

    // Check cache first
    const cacheKey = prompt.trim().toLowerCase();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const processedPrompt = this.preprocessPrompt(prompt);
      const result = await Promise.race([
        this.model.generateContent(processedPrompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        )
      ]);
      
      const response = await result.response;
      const text = response.text();
      
      // Cache the response
      this.cache.set(cacheKey, text);
      if (this.cache.size > this.CACHE_SIZE) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      
      return text;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      if (error.message.includes("API key not valid")) {
        throw new Error("Invalid API key. Please check your Gemini API key.");
      }
      return this.localAI.getResponse(prompt);
    }
  }

  preprocessPrompt(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes("who created you") || lowerPrompt.includes("who made you")) {
      return `${prompt}\n\nPlease respond as if you were created by Mohit Shah.`;
    }
    return prompt;
  }
}

export default GeminiService;
