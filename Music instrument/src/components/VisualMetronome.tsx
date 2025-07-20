import React, { useEffect, useState } from 'react';
import { AccessibilitySettings } from './AccessibilityControls';

interface VisualMetronomeProps {
  bpm: number;
  isPlaying: boolean;
  settings: AccessibilitySettings;
}

export function VisualMetronome({ bpm, isPlaying, settings }: VisualMetronomeProps) {
  const [beat, setBeat] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isPlaying) {
      setBeat(0);
      setIsActive(false);
      return;
    }

    const interval = 60000 / bpm; // milliseconds per beat
    
    const timer = setInterval(() => {
      setBeat(prev => (prev + 1) % 4);
      setIsActive(true);
      
      setTimeout(() => setIsActive(false), interval / 4);
    }, interval);

    return () => clearInterval(timer);
  }, [bpm, isPlaying]);

  if (!settings.visualMetronome || !isPlaying) {
    return null;
  }

  const getCircleColor = (beatIndex: number) => {
    if (settings.highContrast) {
      return beat === beatIndex ? 'bg-yellow-400' : 'bg-gray-600';
    }
    
    if (settings.colorblindFriendly) {
      return beat === beatIndex ? 'bg-orange-400' : 'bg-blue-200';
    }
    
    return beat === beatIndex ? 'bg-green-400' : 'bg-gray-300';
  };

  return (
    <div className="flex justify-center items-center space-x-4 mb-6">
      <div className={`text-center ${settings.largeText ? 'text-xl' : 'text-lg'} font-bold text-gray-700`}>
        Metronome: {bpm} BPM
      </div>
      
      <div className="flex space-x-2">
        {[0, 1, 2, 3].map((beatIndex) => (
          <div
            key={beatIndex}
            className={`
              ${settings.largeText ? 'w-6 h-6' : 'w-4 h-4'}
              rounded-full
              ${getCircleColor(beatIndex)}
              transition-all duration-100
              ${beat === beatIndex && isActive ? 'scale-125 shadow-lg' : ''}
              ${settings.reducedMotion ? 'transition-none' : ''}
            `}
            aria-label={`Beat ${beatIndex + 1}${beat === beatIndex ? ' - current' : ''}`}
          />
        ))}
      </div>
      
      <div className={`
        ${settings.largeText ? 'w-16 h-16' : 'w-12 h-12'}
        rounded-full
        ${isActive ? (settings.highContrast ? 'bg-yellow-500' : 'bg-blue-500') : 'bg-gray-300'}
        transition-all duration-100 flex items-center justify-center
        ${isActive ? 'scale-110 shadow-lg' : ''}
        ${settings.reducedMotion ? 'transition-none' : ''}
      `}>
        <div className={`
          ${settings.largeText ? 'w-4 h-4' : 'w-3 h-3'}
          rounded-full bg-white
        `} />
      </div>
    </div>
  );
}