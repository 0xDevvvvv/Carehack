import React, { useEffect, useRef, useState } from 'react';
import * as handTrack from 'handtrackjs';

interface CameraBubblePopperProps {
  onHandPosition: (x: number, y: number) => void;
  onPopTrigger: () => void;
}

const CameraBubblePopper: React.FC<CameraBubblePopperProps> = ({ onHandPosition, onPopTrigger }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<any>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [status, setStatus] = useState('Loading model...');
  const popCooldownRef = useRef(0);
  
  // Load handtrack model
  useEffect(() => {
    handTrack.load().then(handModel => {
      setModel(handModel);
      setStatus('Model loaded. Click Start Camera.');
    });
    
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start camera and run detection
  const startCamera = async () => {
    if (!model) return;
    
    setStatus('Starting camera...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setStatus('Camera active. Move your hand to pop bubbles!');
        runDetection();
      }
    } catch (err) {
      setStatus(`Error: ${(err as Error).message}`);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
      setStatus('Camera stopped.');
    }
  };

  const runDetection = () => {
    if (!model || !videoRef.current || !canvasRef.current || !cameraActive) return;
    
    const context = canvasRef.current.getContext('2d');
    model.detect(videoRef.current).then((predictions: any[]) => {
      // Clear canvas
      if (context && canvasRef.current) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      
      // Draw predictions and check for hand positions
      if (predictions.length > 0) {
        // For simplicity, take the first hand
        const hand = predictions[0];
        const [x, y, width, height] = hand.bbox;
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        // Draw bounding box
        if (context) {
          context.strokeStyle = '#0f0';
          context.lineWidth = 2;
          context.strokeRect(x, y, width, height);
        }
        
        // Normalize coordinates (0-1) and pass to parent
        if (videoRef.current) {
          const normalizedX = centerX / videoRef.current.videoWidth;
          const normalizedY = centerY / videoRef.current.videoHeight;
          onHandPosition(normalizedX, normalizedY);
          
          // Check if we should pop (simple: if hand is detected, pop every 300ms)
          const now = Date.now();
          if (now - popCooldownRef.current > 300) {
            onPopTrigger();
            popCooldownRef.current = now;
          }
        }
      }
      
      // Continue detection
      if (cameraActive) {
        requestAnimationFrame(runDetection);
      }
    });
  };

  return (
    <div className="camera-section p-4 bg-black bg-opacity-30 rounded-xl">
      <h2 className="text-xl font-bold mb-3 flex items-center">
        <i className="fas fa-camera mr-2"></i> Camera View
      </h2>
      
      <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
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
      </div>
      
      <div className="flex gap-3 mt-3">
        <button 
          onClick={startCamera} 
          disabled={cameraActive}
          className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-900 rounded-lg transition-colors"
        >
          Start Camera
        </button>
        <button 
          onClick={stopCamera} 
          disabled={!cameraActive}
          className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 rounded-lg transition-colors"
        >
          Stop Camera
        </button>
      </div>
      
      <div className="mt-2 text-sm text-center">{status}</div>
    </div>
  );
};

export default CameraBubblePopper;