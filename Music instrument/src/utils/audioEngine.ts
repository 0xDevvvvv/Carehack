// Audio engine for generating piano and guitar sounds
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.initializeAudio();
  }

  private initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private getNoteFrequency(note: string): number {
    const noteFrequencies: { [key: string]: number } = {
      'C': 261.63,
      'C#': 277.18,
      'D': 293.66,
      'D#': 311.13,
      'E': 329.63,
      'F': 349.23,
      'F#': 369.99,
      'G': 392.00,
      'G#': 415.30,
      'A': 440.00,
      'A#': 466.16,
      'B': 493.88
    };
    
    return noteFrequencies[note] || 440;
  }

  async ensureAudioContext() {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  playPianoNote(note: string, duration: number = 0.5) {
    if (!this.audioContext || !this.masterGain) return;

    this.ensureAudioContext();

    const frequency = this.getNoteFrequency(note);
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    // Create a more piano-like sound by combining multiple oscillators
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode2 = this.audioContext.createGain();
    
    // Primary oscillator (fundamental frequency)
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    // Secondary oscillator (adds harmonics)
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime);
    
    // Connect oscillators to gain nodes
    oscillator.connect(gainNode);
    oscillator2.connect(gainNode2);
    
    // Set volumes
    gainNode.gain.setValueAtTime(0.7, this.audioContext.currentTime);
    gainNode2.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    
    // Connect to master gain
    gainNode.connect(this.masterGain);
    gainNode2.connect(this.masterGain);
    
    // Create envelope (attack, decay, sustain, release)
    const now = this.audioContext.currentTime;
    const attackTime = 0.01;
    const decayTime = 0.1;
    const sustainLevel = 0.6;
    const releaseTime = 0.3;
    
    // Apply envelope to both oscillators
    [gainNode, gainNode2].forEach(gain => {
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(1, now + attackTime);
      gain.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      gain.gain.setValueAtTime(sustainLevel, now + duration - releaseTime);
      gain.gain.linearRampToValueAtTime(0, now + duration);
    });
    
    // Start and stop oscillators
    oscillator.start(now);
    oscillator2.start(now);
    oscillator.stop(now + duration);
    oscillator2.stop(now + duration);
  }

  playGuitarString(stringIndex: number, fret: number, duration: number = 1.0) {
    if (!this.audioContext || !this.masterGain) return;

    this.ensureAudioContext();

    // Guitar string base frequencies (standard tuning)
    const stringFrequencies = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63]; // E A D G B E
    const baseFreq = stringFrequencies[stringIndex];
    const frequency = baseFreq * Math.pow(2, fret / 12); // Each fret is a semitone
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    // Guitar-like sound using sawtooth wave
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    // Guitar envelope (quick attack, longer sustain)
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.8, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.1, now + duration * 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext?.currentTime || 0);
    }
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();