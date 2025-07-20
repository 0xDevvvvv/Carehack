import React from 'react';
import { Piano as PianoIcon, Guitar as GuitarIcon, Play, Star, Award } from 'lucide-react';
import { AccessibilitySettings } from './AccessibilityControls';

interface LessonSelectorProps {
  settings: AccessibilitySettings;
  onLessonSelect: (lesson: Lesson) => void;
  completedLessons: string[];
}

export interface Lesson {
  id: string;
  title: string;
  instrument: 'piano' | 'guitar';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  notes?: string[];
  chord?: string[];
}

const lessons: Lesson[] = [
  {
    id: 'piano-basic-c',
    title: 'Play C Major Scale',
    instrument: 'piano',
    difficulty: 'beginner',
    description: 'Learn to play the C major scale on piano',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  },
  {
    id: 'piano-twinkle',
    title: 'Twinkle Twinkle Little Star',
    instrument: 'piano',
    difficulty: 'beginner',
    description: 'Play this classic melody',
    notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G']
  },
  {
    id: 'guitar-basic-chords',
    title: 'Basic Guitar Chords',
    instrument: 'guitar',
    difficulty: 'beginner',
    description: 'Learn G, C, and D chords',
    chord: ['2-3', '1-2', '0-3']
  },
  {
    id: 'guitar-strum-pattern',
    title: 'Simple Strum Pattern',
    instrument: 'guitar',
    difficulty: 'intermediate',
    description: 'Practice down-up strumming',
    chord: ['0-0', '1-1', '2-2']
  }
];

export function LessonSelector({ settings, onLessonSelect, completedLessons }: LessonSelectorProps) {
  const getDifficultyColor = (difficulty: string) => {
    if (settings.highContrast) {
      switch (difficulty) {
        case 'beginner': return 'bg-gray-200 text-gray-800';
        case 'intermediate': return 'bg-gray-400 text-gray-900';
        case 'advanced': return 'bg-gray-600 text-white';
        default: return 'bg-gray-200 text-gray-800';
      }
    }
    
    if (settings.colorblindFriendly) {
      switch (difficulty) {
        case 'beginner': return 'bg-blue-100 text-blue-800';
        case 'intermediate': return 'bg-orange-100 text-orange-800';
        case 'advanced': return 'bg-purple-100 text-purple-800';
        default: return 'bg-blue-100 text-blue-800';
      }
    }
    
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {lessons.map((lesson) => {
        const isCompleted = completedLessons.includes(lesson.id);
        
        return (
          <button
            key={lesson.id}
            onClick={() => onLessonSelect(lesson)}
            onKeyDown={(e) => e.key === 'Enter' && onLessonSelect(lesson)}
            className={`
              bg-white rounded-xl shadow-lg hover:shadow-xl p-6 text-left
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-blue-400
              transform hover:scale-105 active:scale-95
              ${settings.reducedMotion ? 'transition-none' : ''}
              ${isCompleted ? 'ring-2 ring-green-400' : ''}
            `}
            aria-label={`Lesson: ${lesson.title}. ${lesson.description}. Difficulty: ${lesson.difficulty}${isCompleted ? '. Completed.' : ''}`}
            tabIndex={0}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {lesson.instrument === 'piano' ? (
                  <PianoIcon className={`${settings.largeText ? 'w-8 h-8' : 'w-6 h-6'} text-blue-600`} />
                ) : (
                  <GuitarIcon className={`${settings.largeText ? 'w-8 h-8' : 'w-6 h-6'} text-amber-600`} />
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty}
                </span>
              </div>
              
              {isCompleted && (
                <Award className={`${settings.largeText ? 'w-8 h-8' : 'w-6 h-6'} text-green-500`} />
              )}
            </div>
            
            <h3 className={`font-bold text-gray-800 mb-2 ${settings.largeText ? 'text-xl' : 'text-lg'}`}>
              {lesson.title}
            </h3>
            
            <p className={`text-gray-600 mb-4 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
              {lesson.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Play className={`${settings.largeText ? 'w-6 h-6' : 'w-5 h-5'} text-blue-600`} />
                <span className={`text-blue-600 font-medium ${settings.largeText ? 'text-lg' : 'text-base'}`}>
                  Start Lesson
                </span>
              </div>
              
              {isCompleted && (
                <div className="flex items-center space-x-1">
                  <Star className={`${settings.largeText ? 'w-6 h-6' : 'w-5 h-5'} text-yellow-500 fill-current`} />
                  <span className={`text-green-600 font-medium ${settings.largeText ? 'text-lg' : 'text-base'}`}>
                    Completed
                  </span>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}