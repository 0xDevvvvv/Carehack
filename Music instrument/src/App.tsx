import React, { useState } from 'react';
import { Music, Heart, Users } from 'lucide-react';
import { AccessibilityControls, AccessibilitySettings } from './components/AccessibilityControls';
import { LessonSelector, Lesson } from './components/LessonSelector';
import { GameInterface } from './components/GameInterface';

function App() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(true);
  
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    audioDescriptions: false,
    visualMetronome: true,
    simplifiedInterface: false,
    colorblindFriendly: false,
    slowAnimations: false,
  });

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setShowAccessibilityPanel(false);
  };

  const handleBackToLessons = () => {
    setCurrentLesson(null);
    setShowAccessibilityPanel(true);
  };

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => [...prev, lessonId]);
    setTimeout(() => {
      setCurrentLesson(null);
      setShowAccessibilityPanel(true);
    }, 2000);
  };

  const appClasses = `
    min-h-screen transition-all duration-300
    ${accessibilitySettings.highContrast 
      ? 'bg-white text-black' 
      : 'bg-gradient-to-br from-purple-50 via-blue-50 to-green-50'
    }
    ${accessibilitySettings.largeText ? 'text-lg' : 'text-base'}
    ${accessibilitySettings.reducedMotion ? '[&_*]:transition-none' : ''}
  `;

  if (currentLesson) {
    return (
      <div className={appClasses}>
        <GameInterface
          lesson={currentLesson}
          settings={accessibilitySettings}
          onBackToLessons={handleBackToLessons}
          onLessonComplete={handleLessonComplete}
        />
      </div>
    );
  }

  return (
    <div className={appClasses}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Music className={`${accessibilitySettings.largeText ? 'w-16 h-16' : 'w-12 h-12'} text-blue-600`} />
            <h1 className={`font-bold text-gray-800 ${accessibilitySettings.largeText ? 'text-5xl' : 'text-4xl'}`}>
              Harmony Heroes
            </h1>
          </div>
          
          <p className={`text-gray-600 max-w-3xl mx-auto leading-relaxed ${accessibilitySettings.largeText ? 'text-xl' : 'text-lg'}`}>
            An inclusive music learning adventure designed for every child. 
            Learn piano and guitar with accessibility features that make music education 
            fun and accessible for children with different abilities.
          </p>
          
          <div className="flex justify-center items-center space-x-6 mt-8">
            <div className="flex items-center space-x-2">
              <Heart className={`${accessibilitySettings.largeText ? 'w-8 h-8' : 'w-6 h-6'} text-red-500`} />
              <span className={`text-gray-700 font-medium ${accessibilitySettings.largeText ? 'text-lg' : 'text-base'}`}>
                Inclusive Design
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className={`${accessibilitySettings.largeText ? 'w-8 h-8' : 'w-6 h-6'} text-green-500`} />
              <span className={`text-gray-700 font-medium ${accessibilitySettings.largeText ? 'text-lg' : 'text-base'}`}>
                For All Abilities
              </span>
            </div>
          </div>
        </header>

        {/* Accessibility Controls */}
        {showAccessibilityPanel && (
          <AccessibilityControls
            settings={accessibilitySettings}
            onSettingsChange={setAccessibilitySettings}
          />
        )}

        {/* Lesson Selection */}
        <section>
          <h2 className={`font-bold text-gray-800 text-center mb-8 ${accessibilitySettings.largeText ? 'text-3xl' : 'text-2xl'}`}>
            Choose Your Musical Journey
          </h2>
          
          <LessonSelector
            settings={accessibilitySettings}
            onLessonSelect={handleLessonSelect}
            completedLessons={completedLessons}
          />
        </section>

        {/* Features highlight */}
        <section className="mt-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className={`font-bold text-gray-800 text-center mb-6 ${accessibilitySettings.largeText ? 'text-2xl' : 'text-xl'}`}>
              Accessibility Features
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`${accessibilitySettings.highContrast ? 'bg-gray-200' : 'bg-blue-100'} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">👁️</span>
                </div>
                <h4 className={`font-semibold text-gray-800 mb-2 ${accessibilitySettings.largeText ? 'text-lg' : 'text-base'}`}>
                  Visual Accessibility
                </h4>
                <p className={`text-gray-600 ${accessibilitySettings.largeText ? 'text-base' : 'text-sm'}`}>
                  High contrast modes, large text options, and colorblind-friendly design
                </p>
              </div>
              
              <div className="text-center">
                <div className={`${accessibilitySettings.highContrast ? 'bg-gray-200' : 'bg-green-100'} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">🔊</span>
                </div>
                <h4 className={`font-semibold text-gray-800 mb-2 ${accessibilitySettings.largeText ? 'text-lg' : 'text-base'}`}>
                  Audio Support
                </h4>
                <p className={`text-gray-600 ${accessibilitySettings.largeText ? 'text-base' : 'text-sm'}`}>
                  Screen reader compatibility and audio descriptions for all interactions
                </p>
              </div>
              
              <div className="text-center">
                <div className={`${accessibilitySettings.highContrast ? 'bg-gray-200' : 'bg-purple-100'} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className={`font-semibold text-gray-800 mb-2 ${accessibilitySettings.largeText ? 'text-lg' : 'text-base'}`}>
                  Motor Friendly
                </h4>
                <p className={`text-gray-600 ${accessibilitySettings.largeText ? 'text-base' : 'text-sm'}`}>
                  Large buttons, keyboard navigation, and customizable interaction methods
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 py-8">
          <p className={`text-gray-500 ${accessibilitySettings.largeText ? 'text-base' : 'text-sm'}`}>
            Making music education accessible and enjoyable for every child
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;