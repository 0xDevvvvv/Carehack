import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings, Play, Pause, Home, Video, VideoOff } from 'lucide-react';
import Bubble from './Bubble';
import SettingsPanel from './SettingsPanel';
import WelcomeScreen from './WelcomeScreen';
import * as handTrack from 'handtrackjs';

export type BubbleType = {
  id: string;
  x: number;
  y: number;
  color: string;
  size: 'small' | 'medium' | 'large';
  isSpecial?: boolean;
};

export type GameSettings = {
  volume: number;
  highContrast: boolean;
  bubbleSize: 'small' | 'medium' | 'large';
  controlMode: 'direct' | 'switch' | 'voice' | 'camera';
  gameSpeed: 'slow' | 'normal' | 'fast';
};

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<'welcome' | 'playing'>('welcome');
  const [bubbles, setBubbles] = useState<BubbleType[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [highlightedBubbleIndex, setHighlightedBubbleIndex] = useState(0);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [handDetectionModel, setHandDetectionModel] = useState<any>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  const [cameraStatus, setCameraStatus] = useState('Loading hand detection model...');
  
  const [settings, setSettings] = useState<GameSettings>({
    volume: 0.5,
    highContrast: false,
    bubbleSize: 'medium',
    controlMode: 'direct',
    gameSpeed: 'normal'
  });

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const bubbleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const switchControlIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPopTimeRef = useRef(0);

  const colors = ['pink', 'blue', 'green', 'yellow', 'purple', 'orange'];

  // Load hand detection model
  useEffect(() => {
    handTrack.load().then(model => {
      setHandDetectionModel(model);
      setCameraStatus('Model loaded. Click Start Camera.');
    }).catch(err => {
      setCameraStatus(`Failed to load model: ${err.message}`);
    });

    return () => {
      stopCamera();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Start/stop camera based on control mode
  useEffect(() => {
    if (settings.controlMode === 'camera' && handDetectionModel) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [settings.controlMode, handDetectionModel]);

  // Run hand detection when camera is active
  useEffect(() => {
    if (cameraActive && handDetectionModel && videoRef.current) {
      runHandDetection();
    } else {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    }
  }, [cameraActive, handDetectionModel]);

  const startCamera = async () => {
    if (!handDetectionModel || cameraActive) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCameraStatus('Camera active. Move your hand to pop bubbles!');
      }
    } catch (err) {
      setCameraStatus(`Camera error: ${(err as Error).message}`);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
      setCameraStatus('Camera stopped.');
    }
  };

  const runHandDetection = () => {
    if (!handDetectionModel || !videoRef.current || !canvasRef.current || !cameraActive) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    const detect = () => {
      handDetectionModel.detect(videoRef.current).then((predictions: any[]) => {
        // Clear canvas
        context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        
        if (predictions.length > 0) {
          // Draw bounding boxes and get hand positions
          predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            const centerX = x + width / 2;
            const centerY = y + height / 2;
            
            // Draw bounding box
            context.strokeStyle = '#0f0';
            context.lineWidth = 2;
            context.strokeRect(x, y, width, height);
            
            // Normalize coordinates (0-1)
            const normalizedX = centerX / videoRef.current!.videoWidth;
            const normalizedY = centerY / videoRef.current!.videoHeight;
            setHandPosition({ x: normalizedX, y: normalizedY });
            
            // Check for bubble collisions
            checkHandBubbleCollision(normalizedX, normalizedY);
          });
        }
      });
    };

    // Run detection every 100ms
    detectionIntervalRef.current = setInterval(detect, 100);
  };

  const checkHandBubbleCollision = (normalizedX: number, normalizedY: number) => {
    const now = Date.now();
    if (now - lastPopTimeRef.current < 300) return; // Cooldown period
    
    if (!gameContainerRef.current || bubbles.length === 0) return;
    
    const gameRect = gameContainerRef.current.getBoundingClientRect();
    const handX = normalizedX * gameRect.width;
    const handY = normalizedY * gameRect.height;
    
    // Find the bubble that's at this position
    bubbles.forEach(bubble => {
      const bubbleElement = document.getElementById(`bubble-${bubble.id}`);
      if (!bubbleElement) return;
      
      const bubbleRect = bubbleElement.getBoundingClientRect();
      const bubbleCenterX = bubbleRect.left - gameRect.left + bubbleRect.width / 2;
      const bubbleCenterY = bubbleRect.top - gameRect.top + bubbleRect.height / 2;
      
      // Calculate distance between hand and bubble center
      const distance = Math.sqrt(
        Math.pow(handX - bubbleCenterX, 2) + 
        Math.pow(handY - bubbleCenterY, 2)
      );
      
      // Pop if hand is inside the bubble
      if (distance < bubbleRect.width / 2) {
        popBubble(bubble.id);
        lastPopTimeRef.current = now;
      }
    });
  };

  // Bubble generation interval based on game speed
  const getBubbleInterval = useCallback(() => {
    switch (settings.gameSpeed) {
      case 'slow': return 3000;
      case 'fast': return 1000;
      default: return 2000;
    }
  }, [settings.gameSpeed]);

  // Create a new bubble
  const createBubble = useCallback(() => {
    if (!isPlaying || !gameContainerRef.current) return;

    const containerWidth = gameContainerRef.current.offsetWidth;
    const bubbleWidth = settings.bubbleSize === 'small' ? 60 : 
                       settings.bubbleSize === 'large' ? 120 : 80;
    
    const newBubble: BubbleType = {
      id: `bubble-${Date.now()}-${Math.random()}`,
      x: Math.random() * (containerWidth - bubbleWidth),
      y: window.innerHeight,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: settings.bubbleSize,
      isSpecial: Math.random() < 0.1 // 10% chance for special bubble
    };

    setBubbles(prev => [...prev, newBubble]);
  }, [isPlaying, settings.bubbleSize, settings.gameSpeed]);

  // Pop a bubble
  const popBubble = useCallback((bubbleId: string) => {
    setBubbles(prev => {
      const bubble = prev.find(b => b.id === bubbleId);
      if (!bubble) return prev;

      // Update score
      const points = bubble.isSpecial ? 50 : 10;
      setScore(prevScore => prevScore + points);

      // Play pop sound
      if (settings.volume > 0) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(settings.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }

      return prev.filter(b => b.id !== bubbleId);
    });
  }, [settings.volume]);

  // Switch control cycling
  useEffect(() => {
    if (settings.controlMode === 'switch' && bubbles.length > 0) {
      switchControlIntervalRef.current = setInterval(() => {
        setHighlightedBubbleIndex(prev => (prev + 1) % bubbles.length);
      }, 1500);
    } else {
      if (switchControlIntervalRef.current) {
        clearInterval(switchControlIntervalRef.current);
      }
    }

    return () => {
      if (switchControlIntervalRef.current) {
        clearInterval(switchControlIntervalRef.current);
      }
    };
  }, [settings.controlMode, bubbles.length]);

  // Voice control setup
  useEffect(() => {
    if (settings.controlMode === 'voice' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        if (result.includes('pop') || result.includes('bubble')) {
          if (bubbles.length > 0) {
            const targetBubble = settings.controlMode === 'switch' && bubbles[highlightedBubbleIndex] 
              ? bubbles[highlightedBubbleIndex] 
              : bubbles[0];
            popBubble(targetBubble.id);
          }
        }
      };

      recognition.onstart = () => setIsVoiceActive(true);
      recognition.onend = () => setIsVoiceActive(false);

      recognition.start();
      recognitionRef.current = recognition;

      return () => {
        recognition.stop();
      };
    } else {
      setIsVoiceActive(false);
    }
  }, [settings.controlMode, bubbles, highlightedBubbleIndex, popBubble]);

  // Keyboard controls for switch mode
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && settings.controlMode === 'switch') {
        event.preventDefault();
        if (bubbles[highlightedBubbleIndex]) {
          popBubble(bubbles[highlightedBubbleIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [settings.controlMode, bubbles, highlightedBubbleIndex, popBubble]);

  // Bubble generation
  useEffect(() => {
    if (isPlaying) {
      bubbleIntervalRef.current = setInterval(createBubble, getBubbleInterval());
    } else {
      if (bubbleIntervalRef.current) {
        clearInterval(bubbleIntervalRef.current);
      }
    }

    return () => {
      if (bubbleIntervalRef.current) {
        clearInterval(bubbleIntervalRef.current);
      }
    };
  }, [isPlaying, createBubble, getBubbleInterval]);

  // Cleanup bubbles that have moved off screen
  useEffect(() => {
    const cleanup = setInterval(() => {
      setBubbles(prev => prev.filter(bubble => bubble.y > -150));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  // Apply high contrast mode
  useEffect(() => {
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [settings.highContrast]);

  // Show welcome screen
  if (gameState === 'welcome') {
    return (
      <WelcomeScreen
        onStartGame={() => {
          setGameState('playing');
          setIsPlaying(true);
        }}
        onShowSettings={() => setShowSettings(true)}
      />
    );
  }

  return (
    <div 
      ref={gameContainerRef}
      className="game-container relative w-full h-screen overflow-hidden"
      role="main"
      aria-label="Bubble Pop Adventure Game"
    >
      {/* Camera View (only visible in camera mode) */}
      {settings.controlMode === 'camera' && (
        <div className="absolute top-4 right-4 z-10 w-64 h-48 bg-black rounded-lg overflow-hidden shadow-xl">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover transform -scale-x-100"
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 text-center">
            {cameraStatus}
          </div>
          <button
            onClick={stopCamera}
            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
            aria-label="Stop camera"
          >
            <VideoOff className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Score Display */}
      <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white text-2xl font-bold px-4 py-2 rounded-full">
        Score: {score}
      </div>

      {/* Settings Button */}
      <button
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full"
        onClick={() => setShowSettings(true)}
        aria-label="Open settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Home Button */}
      <button
        className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full"
        onClick={() => {
          setGameState('welcome');
          setIsPlaying(false);
          setBubbles([]);
        }}
        aria-label="Return to home screen"
      >
        <Home className="w-6 h-6" />
      </button>

      {/* Play/Pause Button */}
      <button
        className="absolute bottom-4 right-4 z-10 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        onClick={() => setIsPlaying(!isPlaying)}
        aria-label={isPlaying ? 'Pause game' : 'Resume game'}
      >
        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
      </button>

      {/* Voice Control Status */}
      {isVoiceActive && (
        <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
          🎤 Say "pop" or "bubble" to play!
        </div>
      )}

      {/* Switch Control Instructions */}
      {settings.controlMode === 'switch' && (
        <div className="absolute bottom-16 left-4 z-10 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
          Press SPACE to pop highlighted bubble
        </div>
      )}

      {/* Camera Control Instructions */}
      {settings.controlMode === 'camera' && !cameraActive && (
        <div className="absolute bottom-16 left-4 z-10 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
          Camera is off. Enable in settings.
        </div>
      )}

      {/* Bubbles */}
      {bubbles.map((bubble, index) => (
        <Bubble
          key={bubble.id}
          bubble={bubble}
          isHighlighted={settings.controlMode === 'switch' && index === highlightedBubbleIndex}
          controlMode={settings.controlMode}
          onPop={() => popBubble(bubble.id)}
        />
      ))}

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default GameContainer;