import React, { useState, useCallback } from 'react';
import { audioEngine } from '../utils/audioEngine';
import { AccessibilitySettings } from './AccessibilityControls';

interface PianoProps {
  settings: AccessibilitySettings;
  currentLesson?: string[];
  onKeyPress: (note: string) => void;
}

const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];

export function Piano({ settings, currentLesson = [], onKeyPress }: PianoProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [highlightedKeys, setHighlightedKeys] = useState<Set<string>>(new Set(currentLesson));

  const handleKeyPress = useCallback((note: string) => {
    setPressedKeys(prev => new Set([...prev, note]));
    onKeyPress(note);
    
    // Play the piano note
    audioEngine.playPianoNote(note, 0.8);
    
    if (settings.audioDescriptions) {
      const utterance = new SpeechSynthesisUtterance(`Playing ${note}`);
      speechSynthesis.speak(utterance);
    }
    
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 300);
  }, [onKeyPress, settings.audioDescriptions]);

  const getKeyColor = (note: string, isBlack: boolean) => {
    const isPressed = pressedKeys.has(note);
    const isHighlighted = highlightedKeys.has(note);
    
    if (settings.highContrast) {
      if (isBlack) {
        return isPressed ? 'bg-gray-600' : isHighlighted ? 'bg-yellow-400' : 'bg-black';
      } else {
        return isPressed ? 'bg-gray-300' : isHighlighted ? 'bg-yellow-200' : 'bg-white border-2 border-black';
      }
    }
    
    if (settings.colorblindFriendly) {
      if (isBlack) {
        return isPressed ? 'bg-blue-600' : isHighlighted ? 'bg-orange-400' : 'bg-gray-800';
      } else {
        return isPressed ? 'bg-blue-200' : isHighlighted ? 'bg-orange-200' : 'bg-white border border-gray-300';
      }
    }
    
    if (isBlack) {
      return isPressed ? 'bg-purple-600' : isHighlighted ? 'bg-green-400' : 'bg-gray-800';
    } else {
      return isPressed ? 'bg-purple-200' : isHighlighted ? 'bg-green-200' : 'bg-white border border-gray-300';
    }
  };

  const keySize = settings.largeText ? 'h-32 w-12' : 'h-24 w-10';
  const blackKeySize = settings.largeText ? 'h-20 w-8' : 'h-16 w-6';

  return (
    <div className="flex justify-center items-end bg-gradient-to-b from-blue-50 to-blue-100 p-8 rounded-xl">
      <div className="relative flex">
        {/* White keys */}
        {whiteKeys.map((note, index) => (
          <button
            key={note}
            onClick={() => handleKeyPress(note)}
            onKeyDown={(e) => e.key === 'Enter' && handleKeyPress(note)}
            className={`
              ${keySize} ${getKeyColor(note, false)}
              rounded-b-lg shadow-lg hover:shadow-xl
              transition-all duration-150 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-blue-400
              transform hover:scale-105 active:scale-95
              ${settings.reducedMotion ? 'transition-none' : ''}
            `}
            aria-label={`Piano key ${note}`}
            tabIndex={0}
          >
            {settings.simplifiedInterface && (
              <span className={`absolute bottom-2 text-gray-600 font-bold ${settings.largeText ? 'text-lg' : 'text-sm'}`}>
                {note}
              </span>
            )}
          </button>
        ))}
        
        {/* Black keys */}
        <div className="absolute top-0 flex">
          {blackKeys.map((note, index) => {
            if (!note) {
              return <div key={index} className={blackKeySize.split(' ')[1]} />;
            }
            
            return (
              <button
                key={note}
                onClick={() => handleKeyPress(note)}
                onKeyDown={(e) => e.key === 'Enter' && handleKeyPress(note)}
                className={`
                  ${blackKeySize} ${getKeyColor(note, true)}
                  rounded-b-lg shadow-lg hover:shadow-xl
                  transition-all duration-150 ease-in-out
                  focus:outline-none focus:ring-4 focus:ring-blue-400
                  transform hover:scale-105 active:scale-95 ml-1
                  ${settings.reducedMotion ? 'transition-none' : ''}
                `}
                style={{ marginLeft: index === 0 ? '1.5rem' : '0.5rem', marginRight: '0.5rem' }}
                aria-label={`Piano key ${note}`}
                tabIndex={0}
              >
                {settings.simplifiedInterface && (
                  <span className={`absolute bottom-1 text-white font-bold ${settings.largeText ? 'text-xs' : 'text-xs'}`}>
                    {note}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}