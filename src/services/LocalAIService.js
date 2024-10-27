class LocalAIService {
  constructor() {
    this.knowledge = {
      "hello": ["Hello! How can I assist you today?", "Hi there! What can I do for you?", "Greetings! How may I help you?"],
      "how are you": ["I'm functioning well, thank you for asking!", "I'm doing great! How about you?", "All systems operational! How can I help?"],
      "what's your name": ["I'm a local AI assistant.", "You can call me Local AI.", "I don't have a specific name, but I'm here to help!"],
      "what time is it": ["I'm sorry, I don't have access to real-time information. You can check the time on your device.", "As a local AI, I don't keep track of time. Could you check your clock?"],
      "tell me a joke": ["Why don't scientists trust atoms? Because they make up everything!", "What do you call a fake noodle? An impasta!", "Why did the scarecrow win an award? He was outstanding in his field!"],
      "who created you": ["I was created by Mohit Shah.", "Mohit Shah is my creator."],
      "what can you do": ["I can answer basic questions and provide simple assistance. How can I help you today?", "I'm capable of responding to various queries. What would you like help with?"],
    };
    this.defaultResponses = [
      "I'm not sure how to respond to that. Could you please rephrase or ask something else?",
      "I don't have information about that. Is there something else I can help with?",
      "I'm afraid I don't understand. Could you try asking in a different way?",
      "That's beyond my current capabilities. Is there another way I can assist you?",
    ];
  }

  findBestMatch(input) {
    input = input.toLowerCase().trim();
    let bestMatch = null;
    let highestScore = 0;

    for (const key in this.knowledge) {
      const score = this.calculateSimilarity(input, key);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = key;
      }
    }

    return highestScore > 0.6 ? bestMatch : null;
  }

  calculateSimilarity(str1, str2) {
    const set1 = new Set(str1.split(' '));
    const set2 = new Set(str2.split(' '));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }

  getResponse(input) {
    const bestMatch = this.findBestMatch(input);
    if (bestMatch) {
      const responses = this.knowledge[bestMatch];
      return responses[Math.floor(Math.random() * responses.length)];
    } else {
      return this.defaultResponses[Math.floor(Math.random() * this.defaultResponses.length)];
    }
  }
}

export default LocalAIService;
