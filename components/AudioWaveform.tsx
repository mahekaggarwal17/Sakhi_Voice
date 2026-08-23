"use client";

import React, { useEffect, useRef } from "react";

interface AudioWaveformProps {
  isActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  volumeLevel?: number; // 0 to 100
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive,
  isSpeaking,
  isListening,
  volumeLevel = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const numBars = 32;
      const barWidth = width / numBars - 2;
      const centerY = height / 2;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 4;

        if (isActive) {
          const distance = Math.abs(i - numBars / 2) / (numBars / 2);
          const dynamicBoost = isSpeaking
            ? Math.sin(phase + i * 0.4) * 22 + 18
            : isListening
            ? Math.sin(phase + i * 0.3) * (volumeLevel > 5 ? volumeLevel * 0.5 : 12) + 6
            : Math.sin(phase + i * 0.2) * 5 + 4;

          barHeight = Math.max(4, dynamicBoost * (1 - distance * 0.5));
        }

        const x = i * (barWidth + 2);
        const y = centerY - barHeight / 2;

        // Gradient color: warm orange to gold
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isSpeaking) {
          gradient.addColorStop(0, "#F97316"); // Orange 500
          gradient.addColorStop(1, "#EA580C"); // Orange 600
        } else if (isListening) {
          gradient.addColorStop(0, "#10B981"); // Emerald 500
          gradient.addColorStop(1, "#059669"); // Emerald 600
        } else {
          gradient.addColorStop(0, "#D7C3AE");
          gradient.addColorStop(1, "#BCA48D");
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      phase += isActive ? 0.12 : 0.03;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, isSpeaking, isListening, volumeLevel]);

  return (
    <div className="w-full h-12 flex items-center justify-center bg-[#F3ECE1] rounded-2xl px-3 py-1 border border-[#E3D5C0]">
      <canvas
        ref={canvasRef}
        width={340}
        height={44}
        className="w-full h-full max-w-[340px]"
      />
    </div>
  );
};
