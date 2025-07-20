import React, { useState, useCallback } from 'react';
import { audioEngine } from '../utils/audioEngine';
import { AccessibilitySettings } from './AccessibilityControls';

interface GuitarProps {
  settings: AccessibilitySettings;
  currentChord?: string[];
  onStringPress: (string: number, fret: number) => void;
}

const strings = ['E', 'A', 'D', 'G', 'B', 'E'];
const frets = Array.from({ length: 13 }, (_, i) => i);

export function Guitar({ settings, currentChord = [], onStringPress }: GuitarProps) {
  const [pressedFrets, setPressedFrets] = useState<Set<string>>(new Set());

  const handleFretPress = useCallback((stringIndex: number, fret: number) => {
    const key = `${stringIndex}-${fret}`;
    setPressedFrets(prev => new Set([...prev, key]));
    onStringPress(stringIndex, fret);
    
    // Play the guitar string
    audioEngine.playGuitarString(stringIndex, fret, 1.2);
    
    if (settings.audioDescriptions) {
      const stringName = strings[stringIndex];
      const utterance = new SpeechSynthesisUtterance(
        fret === 0 ? `Open ${stringName} string` : `${stringName} string, fret ${fret}`
      );
      speechSynthesis.speak(utterance);
    }
    
    setTimeout(() => {
      setPressedFrets(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }, 500);
  }, [onStringPress, settings.audioDescriptions]);

  const getFretColor = (stringIndex: number, fret: number) => {
    const key = `${stringIndex}-${fret}`;
    const isPressed = pressedFrets.has(key);
    const isHighlighted = currentChord.includes(key);
    
    if (settings.highContrast) {
      if (isPressed) return 'bg-yellow-400 border-yellow-600';
      if (isHighlighted) return 'bg-blue-200 border-blue-400';
      return 'bg-white border-gray-800';
    }
    
    if (settings.colorblindFriendly) {
      if (isPressed) return 'bg-orange-300 border-orange-500';
      if (isHighlighted) return 'bg-blue-200 border-blue-400';
      return 'bg-gray-50 border-gray-400';
    }
    
    if (isPressed) return 'bg-green-300 border-green-500';
    if (isHighlighted) return 'bg-purple-200 border-purple-400';
    return 'bg-amber-50 border-amber-300';
  };

  const buttonSize = settings.largeText ? 'w-12 h-8' : 'w-10 h-6';

  return (
    <div className="bg-gradient-to-b from-amber-100 to-amber-200 p-8 rounded-xl">
      <div className="bg-amber-800 p-4 rounded-lg shadow-lg">
        <div className="space-y-3">
          {strings.map((stringName, stringIndex) => (
            <div key={stringIndex} className="flex items-center space-x-2">
              <div className={`w-8 ${settings.largeText ? 'text-lg' : 'text-sm'} font-bold text-amber-100 flex justify-center`}>
                {stringName}
              </div>
              <div className="flex space-x-1">
                {frets.map((fret) => (
                  <button
                    key={fret}
                    onClick={() => handleFretPress(stringIndex, fret)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFretPress(stringIndex, fret)}
                    className={`
                      ${buttonSize} ${getFretColor(stringIndex, fret)}
                      border-2 rounded-md
                      transition-all duration-150 ease-in-out
                      focus:outline-none focus:ring-4 focus:ring-blue-400
                      transform hover:scale-110 active:scale-95
                      ${settings.reducedMotion ? 'transition-none' : ''}
                    `}
                    aria-label={`String ${stringName}, fret ${fret}`}
                    tabIndex={0}
                  >
                    {(fret === 0 || settings.simplifiedInterface) && (
                      <span className={`font-bold text-gray-700 ${settings.largeText ? 'text-xs' : 'text-xs'}`}>
                        {fret}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Fret markers */}
        <div className="flex justify-center mt-4 space-x-1">
          {frets.slice(1).map((fret) => (
            <div key={fret} className={`${buttonSize.split(' ')[0]} flex justify-center`}>
              {[3, 5, 7, 9].includes(fret) && (
                <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
              )}
              {fret === 12 && (
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-amber-300 rounded-full"></div>
                  <div className="w-1 h-1 bg-amber-300 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}