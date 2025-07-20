import React from 'react';
import { Settings, Eye, Volume2, Palette, Hand } from 'lucide-react';

interface AccessibilityControlsProps {
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  audioDescriptions: boolean;
  visualMetronome: boolean;
  simplifiedInterface: boolean;
  colorblindFriendly: boolean;
  slowAnimations: boolean;
}

export function AccessibilityControls({ settings, onSettingsChange }: AccessibilityControlsProps) {
  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-blue-600" />
        <h2 className={`font-bold text-gray-800 ${settings.largeText ? 'text-2xl' : 'text-xl'}`}>
          Accessibility Settings
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className={`font-semibold text-gray-700 flex items-center gap-2 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
            <Eye className="w-5 h-5" />
            Visual Settings
          </h3>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSetting('highContrast', e.target.checked)}
              className="w-5 h-5 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-gray-700 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
              High Contrast Mode
            </span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={(e) => updateSetting('largeText', e.target.checked)}
              className="w-5 h-5 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-gray-700 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
              Large Text
            </span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.colorblindFriendly}
              onChange={(e) => updateSetting('colorblindFriendly', e.target.checked)}
              className="w-5 h-5 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-gray-700 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
              Colorblind Friendly
            </span>
          </label>
        </div>
        
        <div className="space-y-4">
          <h3 className={`font-semibold text-gray-700 flex items-center gap-2 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
            <Volume2 className="w-5 h-5" />
            Audio & Motion
          </h3>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.audioDescriptions}
              onChange={(e) => updateSetting('audioDescriptions', e.target.checked)}
              className="w-5 h-5 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-gray-700 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
              Audio Descriptions
            </span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.visualMetronome}
              onChange={(e) => updateSetting('visualMetronome', e.target.checked)}
              className="w-5 h-5 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-gray-700 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
              Visual Metronome
            </span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
              className="w-5 h-5 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-gray-700 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
              Reduce Motion
            </span>
          </label>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className={`font-semibold text-gray-700 flex items-center gap-2 mb-4 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
          <Hand className="w-5 h-5" />
          Interface Settings
        </h3>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.simplifiedInterface}
            onChange={(e) => updateSetting('simplifiedInterface', e.target.checked)}
            className="w-5 h-5 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className={`text-gray-700 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
            Simplified Interface
          </span>
        </label>
      </div>
    </div>
  );
}