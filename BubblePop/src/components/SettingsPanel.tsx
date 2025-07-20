import React from 'react';
import { X, Volume2, Eye, Gamepad2 } from 'lucide-react';

export type GameSettings = {
  volume: number;
  highContrast: boolean;
  bubbleSize: 'small' | 'medium' | 'large';
  controlMode: 'direct' | 'switch' | 'voice' | 'camera';
  gameSpeed: 'slow' | 'normal' | 'fast';
}

interface SettingsPanelProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, onClose }) => {
  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="settings-panel"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="settings-content">
        <div className="flex items-center justify-between mb-6">
          <h2 id="settings-title" className="settings-title">
            <Gamepad2 className="inline w-8 h-8 mr-2" />
            Game Settings
          </h2>
          <button
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="setting-group">
          <label className="setting-label flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Volume: {Math.round(settings.volume * 100)}%
          </label>
          <input
            type="range"
            className="setting-input h-3 rounded-lg"
            min="0"
            max="1"
            step="0.1"
            value={settings.volume}
            onChange={(e) => updateSetting('volume', parseFloat(e.target.value))}
            aria-label="Game volume"
          />
        </div>

        {/* High Contrast */}
        <div className="setting-group">
          <label className="setting-label flex items-center cursor-pointer">
            <Eye className="w-5 h-5 mr-2" />
            <input
              type="checkbox"
              className="setting-checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSetting('highContrast', e.target.checked)}
            />
            High Contrast Mode
          </label>
          <p className="text-sm text-muted-foreground mt-1">
            Makes bubbles easier to see with bright yellow color
          </p>
        </div>

        {/* Bubble Size */}
        <div className="setting-group">
          <label className="setting-label">Bubble Size</label>
          <select
            className="setting-select"
            value={settings.bubbleSize}
            onChange={(e) => updateSetting('bubbleSize', e.target.value as 'small' | 'medium' | 'large')}
            aria-label="Bubble size"
          >
            <option value="small">Small (60px)</option>
            <option value="medium">Medium (80px)</option>
            <option value="large">Large (120px)</option>
          </select>
        </div>

        {/* Control Mode */}
        <div className="setting-group">
          <label className="setting-label">Control Method</label>
          // In the control mode dropdown
<select
  className="setting-select"
  value={settings.controlMode}
  onChange={(e) => updateSetting('controlMode', e.target.value as any)}
>
  <option value="direct">Touch/Click (Direct)</option>
  <option value="switch">Switch Control (Spacebar)</option>
  <option value="voice">Voice Control (Say "pop")</option>
  <option value="camera">Camera Hand Detection</option> {/* Add this */}
</select>
          
          {settings.controlMode === 'direct' && (
            <p className="text-sm text-muted-foreground mt-1">
              Click or tap bubbles directly to pop them
            </p>
          )}
          
          {settings.controlMode === 'switch' && (
            <p className="text-sm text-muted-foreground mt-1">
              Bubbles will be highlighted in sequence. Press SPACEBAR to pop the highlighted bubble.
            </p>
          )}
          
          {settings.controlMode === 'voice' && (
            <p className="text-sm text-muted-foreground mt-1">
              Say "pop" or "bubble" to pop bubbles. Requires microphone access.
            </p>
          )}
        </div>

        {/* Game Speed */}
        <div className="setting-group">
          <label className="setting-label">Game Speed</label>
          <select
            className="setting-select"
            value={settings.gameSpeed}
            onChange={(e) => updateSetting('gameSpeed', e.target.value as 'slow' | 'normal' | 'fast')}
            aria-label="Game speed"
          >
            <option value="slow">Slow (3 seconds)</option>
            <option value="normal">Normal (2 seconds)</option>
            <option value="fast">Fast (1 second)</option>
          </select>
        </div>

        {/* Close Button */}
        <button
          className="close-button mt-6"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;