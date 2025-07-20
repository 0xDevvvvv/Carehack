import React from 'react';
import { Play, Settings, Heart, Accessibility } from 'lucide-react';

interface WelcomeScreenProps {
  onStartGame: () => void;
  onShowSettings: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame, onShowSettings }) => {
  return (
    <div className="game-container flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Bubble Pop Adventure
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            An inclusive game for everyone! 🌈
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Accessibility className="w-4 h-4" />
            <span>Accessible • Fun • Inclusive</span>
            <Heart className="w-4 h-4 text-pink-400" />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-muted rounded-2xl p-6 border-2 border-border">
            <div className="text-3xl mb-2">👆</div>
            <h3 className="font-semibold mb-2">Touch & Click</h3>
            <p className="text-sm text-muted-foreground">
              Pop bubbles by touching or clicking them directly
            </p>
          </div>
          
          <div className="bg-muted rounded-2xl p-6 border-2 border-border">
            <div className="text-3xl mb-2">⌨️</div>
            <h3 className="font-semibold mb-2">Switch Control</h3>
            <p className="text-sm text-muted-foreground">
              Use spacebar or external switch for hands-free play
            </p>
          </div>
          
          <div className="bg-muted rounded-2xl p-6 border-2 border-border">
            <div className="text-3xl mb-2">🎤</div>
            <h3 className="font-semibold mb-2">Voice Control</h3>
            <p className="text-sm text-muted-foreground">
              Say "pop" to play with your voice
            </p>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="bg-card rounded-2xl p-6 border-2 border-border mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
            <Accessibility className="w-5 h-5 mr-2" />
            Accessibility Features
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>🔆 High contrast mode</div>
            <div>📏 Adjustable bubble sizes</div>
            <div>🔊 Volume controls</div>
            <div>⏰ Customizable game speed</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onStartGame}
            className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 
                     rounded-2xl text-xl font-semibold transition-all duration-200 
                     hover:transform hover:scale-105 hover:shadow-lg"
            aria-label="Start playing Bubble Pop Adventure"
          >
            <Play className="w-6 h-6" />
            Start Playing!
          </button>
          
          <button
            onClick={onShowSettings}
            className="flex items-center gap-2 px-6 py-4 bg-secondary hover:bg-secondary/90 
                     rounded-2xl text-lg font-medium transition-all duration-200 
                     hover:transform hover:scale-105"
            aria-label="Open game settings"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            This game is designed to be accessible for children with motor, visual, and hearing impairments.
            <br />
            Choose your preferred control method in settings and start having fun! 🎈
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;