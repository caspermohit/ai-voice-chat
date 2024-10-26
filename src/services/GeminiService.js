import { GoogleGenerativeAI } from "@google/generative-ai";
import LocalAIService from "./LocalAIService";

class GeminiService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("Gemini API key is missing");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.localAI = new LocalAIService();
  }

  async getResponse(prompt) {
    if (!navigator.onLine) {
      console.log("Offline: Using local AI service");
      return this.localAI.getResponse(prompt);
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      if (error.message.includes("API key not valid")) {
        throw new Error("Invalid API key. Please check your Gemini API key.");
      }
      console.log("API Error: Falling back to local AI service");
      return this.localAI.getResponse(prompt);
    }
  }
}

export default GeminiService;
