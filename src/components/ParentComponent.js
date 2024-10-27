import React, { useCallback } from 'react';
import VoiceInput from './VoiceInput';

function ParentComponent() {
  const handleSpeechInput = useCallback((transcript) => {
    // Handle the speech input
    console.log(transcript);
    // Other logic...
  }, []); // Empty dependency array if it doesn't depend on any values

  return (
    <VoiceInput onSpeechInput={handleSpeechInput} />
  );
}

export default ParentComponent;
