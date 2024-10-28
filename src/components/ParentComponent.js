import React, { useCallback, useState, useEffect } from 'react';
import VoiceInput from './VoiceInput';
import ChatHistory from './ChatHistory';
import voiceOutputInstance from './VoiceOutput';
import GeminiService from '../services/GeminiService';

function ParentComponent() {
  const [messages, setMessages] = useState([]);
  const [geminiService, setGeminiService] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize GeminiService
  useEffect(() => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    setGeminiService(new GeminiService(apiKey));
  }, []);

  const handleSpeechInput = useCallback(async (transcript) => {
    if (!transcript || isProcessing) return;
    
    setIsProcessing(true);
    
    // Add user message to chat
    setMessages(prev => [...prev, {
      text: transcript,
      isUser: true
    }]);

    try {
      // Get AI response
      const response = await geminiService.getResponse(transcript);
      
      // Add AI response to chat
      setMessages(prev => [...prev, {
        text: response,
        isUser: false
      }]);

      // Speak the response
      voiceOutputInstance.speak(response);
      
    } catch (error) {
      console.error('Error processing speech:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false
      }]);
    } finally {
      setIsProcessing(false);
    }
  }, [geminiService, isProcessing]);

  return (
    <div>
      <ChatHistory messages={messages} />
      <VoiceInput 
        onSpeechInput={handleSpeechInput} 
        disabled={isProcessing} 
      />
      {isProcessing && <div>Processing...</div>}
    </div>
  );
}

export default ParentComponent;
