import React, { useEffect, useRef } from 'react';

interface PulsingTimerBackgroundProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
}

interface Pulse {
  x: number;
  y: number;
  radius: number;
  lifespan: number;
  speed: number;
}

export function PulsingTimerBackground({ timeLeft, totalTime, isActive }: PulsingTimerBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const pulsesRef = useRef<Pulse[]>([]);
  const frameCountRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createPulse = () => {
      const pulse: Pulse = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 0,
        lifespan: 255,
        speed: Math.max(0.5, (timeLeft / totalTime) * 2.5) // Speed based on remaining time
      };
      pulsesRef.current.push(pulse);
    };

    const updatePulse = (pulse: Pulse) => {
      pulse.radius += pulse.speed;
      pulse.lifespan -= 1.5;
    };

    const drawPulse = (pulse: Pulse) => {
      ctx.strokeStyle = `rgba(255, 215, 0, ${pulse.lifespan / 255})`;
      ctx.lineWidth = Math.max(0, (pulse.lifespan / 255) * 3);
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
      ctx.stroke();
    };

    const animate = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      frameCountRef.current++;

      // Clear canvas with dark background
      ctx.fillStyle = 'rgba(17, 17, 17, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new pulses based on time remaining
      const pulseFrequency = Math.floor(Math.max(30, Math.min(150, (timeLeft / totalTime) * 120 + 30)));
      if (frameCountRef.current % pulseFrequency === 0 && timeLeft > 0) {
        createPulse();
      }

      // Update and draw pulses
      pulsesRef.current = pulsesRef.current.filter(pulse => {
        updatePulse(pulse);
        drawPulse(pulse);
        return pulse.lifespan > 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [timeLeft, totalTime, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
}