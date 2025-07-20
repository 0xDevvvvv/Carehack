import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

export type BubbleType = {
  id: string;
  x: number;
  y: number;
  color: string;
  size: 'small' | 'medium' | 'large';
  isSpecial?: boolean;
};

interface BubbleProps {
  bubble: BubbleType;
  isHighlighted: boolean;
  controlMode: 'direct' | 'switch' | 'voice' | 'camera';
  onPop: () => void;
}

const Bubble: React.FC<BubbleProps> = ({ bubble, isHighlighted, controlMode, onPop }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Handle bubble floating animation
  useEffect(() => {
    if (!bubbleRef.current) return;

    const element = bubbleRef.current;
    let animationId: number;
    const startTime = Date.now();
    const duration = 8000; // 8 seconds to float up
    const startY = bubble.y;
    const endY = -150;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentY = startY - (startY - endY) * easeOut;

      if (element) {
        element.style.left = `${bubble.x}px`;
        element.style.top = `${currentY}px`;
        
        // Debug: Add console log to verify positioning
        console.log(`Bubble at x:${bubble.x}, y:${currentY}, visible: ${element.offsetWidth > 0}`);
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [bubble.x, bubble.y]);

  const handleClick = () => {
    if (controlMode === 'direct') {
      onPop();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onPop();
    }
  };

  return (
    <div

      id={`bubble-${bubble.id}`}
      ref={bubbleRef}
      className={`
        bubble 
        bubble-${bubble.color} 
        ${bubble.size}
        ${isHighlighted ? 'highlighted' : ''}
        ${bubble.isSpecial ? 'ring-2 ring-yellow-300' : ''}
      `}
      style={{
        left: bubble.x,
        top: bubble.y,
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={controlMode === 'switch' && isHighlighted ? 0 : -1}
      role="button"
      aria-label={`${bubble.isSpecial ? 'Special ' : ''}${bubble.color} bubble${bubble.isSpecial ? ' - Worth 50 points!' : ''}`}
      aria-pressed="false"
    >
      {bubble.isSpecial && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default Bubble;