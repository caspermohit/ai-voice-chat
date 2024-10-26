import React, { useState, useRef, useEffect } from 'react';
import VoiceInput from './components/VoiceInput';
import VoiceOutput from './components/VoiceOutput';
import ChatHistory from './components/ChatHistory';
import GeminiService from './services/GeminiService';
import './App.css';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

function App() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const geminiService = useRef(null);

  useEffect(() => {
    try {
      geminiService.current = new GeminiService(API_KEY);
    } catch (err) {
      setError(err.message);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInput = async (text) => {
    setMessages(prev => [...prev, { text, isUser: true }]);
    
    try {
      if (!geminiService.current) {
        throw new Error("AI service is not initialized");
      }
      const aiResponse = await geminiService.current.getResponse(text);
      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
      setIsSpeaking(true);
      VoiceOutput.speak(aiResponse);
      VoiceOutput.currentUtterance.onend = () => setIsSpeaking(false);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { text: `Error: ${error.message}`, isUser: false }]);
    }
  };

  const handleSpeechInput = (text) => {
    handleInput(text);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleInput(textInput);
      setTextInput('');
    }
  };

  const handleStopSpeaking = () => {
    VoiceOutput.stop();
    setIsSpeaking(false);
  };

  if (error) {
    return <div className="App"><h1>Error: {error}</h1></div>;
  }

  return (
    <div className="App">
      <h1>AI Voice Chat {!isOnline && "(Offline Mode)"}</h1>
      <ChatHistory messages={messages} />
      <div className="input-container">
        <VoiceInput onSpeechInput={handleSpeechInput} />
        <form onSubmit={handleTextSubmit} className="text-input-form">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your message here..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
      {isSpeaking && (
        <button onClick={handleStopSpeaking} className="stop-button">
          Stop Speaking
        </button>
      )}
      {!isOnline && <div className="offline-indicator">You are offline. Using local AI service.</div>}
    </div>
  );
}

export default App;
