/**
 * Speaks the given text using the browser's Web Speech API.
 * @param {string} text - The text to be spoken.
 */
export function speak(text) {
  // Check if the browser supports the Speech Synthesis API
  if ("speechSynthesis" in window) {
    // Stop any speech that is currently active
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Optional: Configure voice, pitch, and rate for a better feel
    utterance.pitch = 1.2;
    utterance.rate = 0.9;
    utterance.volume = 1.0;

    // Attempt to find a friendly voice (this can vary by browser/OS)
    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find(
      (voice) => voice.name === "Google UK English Female"
    );
    if (googleVoice) {
      utterance.voice = googleVoice;
    }

    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Sorry, your browser does not support text-to-speech.");
  }
}
