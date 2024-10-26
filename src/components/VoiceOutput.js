class VoiceOutput {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
  }

  speak(text) {
    this.stop();
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }
}

const voiceOutputInstance = new VoiceOutput();
export default voiceOutputInstance;
