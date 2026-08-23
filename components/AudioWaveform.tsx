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

      const numBars = 36;
      const gap = 3;
      const barWidth = (width - numBars * gap) / numBars;
      const centerY = height / 2;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 4;

        if (isActive) {
          const normDist = Math.abs(i - numBars / 2) / (numBars / 2);
          const bellCurve = Math.cos(normDist * (Math.PI / 2.2));

          if (isSpeaking) {
            const wave1 = Math.sin(phase * 1.5 + i * 0.35) * 14;
            const wave2 = Math.cos(phase * 2.2 + i * 0.6) * 8;
            barHeight = Math.max(5, (18 + wave1 + wave2) * bellCurve);
          } else if (isListening) {
            const dynamicAmp = volumeLevel > 5 ? volumeLevel * 0.45 : 12;
            const wave = Math.sin(phase * 1.8 + i * 0.4) * dynamicAmp;
            barHeight = Math.max(5, (10 + wave) * bellCurve);
          } else {
            const wave = Math.sin(phase * 0.8 + i * 0.3) * 6;
            barHeight = Math.max(4, (6 + wave) * bellCurve);
          }
        }

        const x = i * (barWidth + gap);
        const y = centerY - barHeight / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isSpeaking) {
          gradient.addColorStop(0, "#34D399"); // Emerald 400
          gradient.addColorStop(0.5, "#10B981"); // Emerald 500
          gradient.addColorStop(1, "#064E3B"); // Emerald 900
        } else if (isListening) {
          gradient.addColorStop(0, "#6EE7B7"); // Light emerald
          gradient.addColorStop(0.5, "#34D399");
          gradient.addColorStop(1, "#059669");
        } else {
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, Math.max(2, barWidth), barHeight, 3);
        } else {
          ctx.rect(x, y, Math.max(2, barWidth), barHeight);
        }
        ctx.fill();
      }

      phase += isActive ? (isSpeaking ? 0.08 : 0.06) : 0.02;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, isSpeaking, isListening, volumeLevel]);

  return (
    <div className="w-full h-12 flex items-center justify-center bg-white/5 rounded-2xl px-3 py-1 border border-white/10 backdrop-blur-md">
      <canvas
        ref={canvasRef}
        width={360}
        height={44}
        className="w-full h-full max-w-[360px]"
      />
    </div>
  );
};
