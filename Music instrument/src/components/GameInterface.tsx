import React, { useState, useEffect } from 'react';
import { Home, Trophy, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { Piano } from './Piano';
import { Guitar } from './Guitar';
import { VisualMetronome } from './VisualMetronome';
import { AccessibilitySettings } from './AccessibilityControls';
import { Lesson } from './LessonSelector';

interface GameInterfaceProps {
  lesson: Lesson;
  settings: AccessibilitySettings;
  onBackToLessons: () => void;
  onLessonComplete: (lessonId: string) => void;
}

export function GameInterface({ lesson, settings, onBackToLessons, onLessonComplete }: GameInterfaceProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const totalSteps = lesson.notes?.length || lesson.chord?.length || 1;

  useEffect(() => {
    // Set initial audio volume based on sound setting
    audioEngine.setVolume(soundEnabled ? 0.3 : 0);
    
    if (settings.audioDescriptions) {
      const utterance = new SpeechSynthesisUtterance(
        `Starting lesson: ${lesson.title}. ${lesson.description}`
      );
      speechSynthesis.speak(utterance);
    }
  }, [lesson, settings.audioDescriptions, soundEnabled]);

  const handleCorrectNote = () => {
    setScore(prev => prev + 10);
    setProgress(prev => prev + (100 / totalSteps));
    setCurrentStep(prev => prev + 1);
    
    if (settings.audioDescriptions) {
      const utterance = new SpeechSynthesisUtterance('Correct! Well done.');
      speechSynthesis.speak(utterance);
    }
    
    if (currentStep + 1 >= totalSteps) {
      setTimeout(() => {
        onLessonComplete(lesson.id);
        if (settings.audioDescriptions) {
          const utterance = new SpeechSynthesisUtterance('Lesson completed! Congratulations!');
          speechSynthesis.speak(utterance);
        }
      }, 1000);
    }
  };

  const handleKeyPress = (note: string) => {
    if (lesson.notes && lesson.notes[currentStep] === note) {
      handleCorrectNote();
    }
  };

  const handleStringPress = (stringIndex: number, fret: number) => {
    const fretKey = `${stringIndex}-${fret}`;
    if (lesson.chord && lesson.chord.includes(fretKey)) {
      handleCorrectNote();
    }
  };

  const resetLesson = () => {
    setProgress(0);
    setCurrentStep(0);
    setScore(0);
    setIsPlaying(false);
    
    if (settings.audioDescriptions) {
      const utterance = new SpeechSynthesisUtterance('Lesson reset');
      speechSynthesis.speak(utterance);
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    audioEngine.setVolume(soundEnabled ? 0 : 0.3);
    
    if (settings.audioDescriptions) {
      const utterance = new SpeechSynthesisUtterance(
        soundEnabled ? 'Sound disabled' : 'Sound enabled'
      );
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`min-h-screen ${settings.highContrast ? 'bg-white' : 'bg-gradient-to-br from-purple-50 to-blue-50'} p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToLessons}
          className={`
            flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md
            hover:shadow-lg transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-blue-400
            ${settings.largeText ? 'text-lg' : 'text-base'}
          `}
          aria-label="Back to lessons"
        >
          <Home className={`${settings.largeText ? 'w-6 h-6' : 'w-5 h-5'}`} />
          <span>Back to Lessons</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSound}
            className={`
              p-2 bg-white rounded-lg shadow-md hover:shadow-lg
              transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400
            `}
            aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            {soundEnabled ? (
              <Volume2 className={`${settings.largeText ? 'w-6 h-6' : 'w-5 h-5'} text-blue-600`} />
            ) : (
              <VolumeX className={`${settings.largeText ? 'w-6 h-6' : 'w-5 h-5'} text-gray-400`} />
            )}
          </button>
          
          <button
            onClick={resetLesson}
            className={`
              flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md
              hover:shadow-lg transition-all duration-200
              focus:outline-none focus:ring-4 focus:ring-blue-400
              ${settings.largeText ? 'text-lg' : 'text-base'}
            `}
            aria-label="Reset lesson"
          >
            <RotateCcw className={`${settings.largeText ? 'w-6 h-6' : 'w-5 h-5'}`} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Lesson Info */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h1 className={`font-bold text-gray-800 mb-2 ${settings.largeText ? 'text-3xl' : 'text-2xl'}`}>
          {lesson.title}
        </h1>
        <p className={`text-gray-600 mb-4 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
          {lesson.description}
        </p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-gray-700 font-medium ${settings.largeText ? 'text-lg' : 'text-base'}`}>
              Progress: {currentStep}/{totalSteps}
            </span>
            <div className="flex items-center space-x-2">
              <Trophy className={`${settings.largeText ? 'w-6 h-6' : 'w-5 h-5'} text-yellow-500`} />
              <span className={`text-gray-700 font-bold ${settings.largeText ? 'text-lg' : 'text-base'}`}>
                {score} points
              </span>
            </div>
          </div>
          
          <div className={`w-full ${settings.highContrast ? 'bg-gray-300' : 'bg-gray-200'} rounded-full h-3`}>
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                settings.highContrast ? 'bg-black' : 
                settings.colorblindFriendly ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Lesson progress: ${Math.round(progress)}%`}
            />
          </div>
        </div>
        
        {/* Current instruction */}
        {lesson.notes && currentStep < lesson.notes.length && (
          <div className={`text-center p-4 ${settings.highContrast ? 'bg-gray-100' : 'bg-blue-50'} rounded-lg`}>
            <p className={`text-gray-800 font-medium ${settings.largeText ? 'text-xl' : 'text-lg'}`}>
              Next note: <span className="font-bold text-blue-600">{lesson.notes[currentStep]}</span>
            </p>
          </div>
        )}
      </div>

      {/* Visual Metronome */}
      <VisualMetronome bpm={80} isPlaying={isPlaying} settings={settings} />

      {/* Instrument Interface */}
      {lesson.instrument === 'piano' ? (
        <Piano
          settings={settings}
          currentLesson={lesson.notes}
          onKeyPress={handleKeyPress}
        />
      ) : (
        <Guitar
          settings={settings}
          currentChord={lesson.chord}
          onStringPress={handleStringPress}
        />
      )}

      {/* Control Buttons */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`
            px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg
            hover:bg-blue-700 hover:shadow-xl
            transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400
            ${settings.largeText ? 'text-lg' : 'text-base'}
          `}
          aria-label={isPlaying ? 'Stop metronome' : 'Start metronome'}
        >
          {isPlaying ? 'Stop' : 'Start'} Practice
        </button>
      </div>

      {/* Completion Message */}
      {progress >= 100 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center shadow-2xl max-w-md mx-4">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className={`font-bold text-gray-800 mb-4 ${settings.largeText ? 'text-3xl' : 'text-2xl'}`}>
              Lesson Complete!
            </h2>
            <p className={`text-gray-600 mb-6 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
              Great job! You earned {score} points.
            </p>
            <button
              onClick={onBackToLessons}
              className={`
                px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg
                hover:bg-blue-700 transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-blue-400
                ${settings.largeText ? 'text-lg' : 'text-base'}
              `}
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}
    </div>
  );
}