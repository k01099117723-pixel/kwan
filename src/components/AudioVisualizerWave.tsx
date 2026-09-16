import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, Play, Pause, Radio } from 'lucide-react';

export const AudioVisualizerWave: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // Web Audio Synth for warm studio acoustic ambience
  const toggleAudio = () => {
    if (isPlaying) {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
        setTimeout(() => {
          oscillatorRef.current?.stop();
          oscillatorRef.current?.disconnect();
          oscillatorRef.current = null;
        }, 150);
      }
      setIsPlaying(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Rich warm binaural harmonic chord (Acoustic room tone)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(174, ctx.currentTime); // 174 Hz warm healing / grounding frequency

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;

        setIsPlaying(true);
      } catch (e) {
        console.error('Audio init error:', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Canvas Wave Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = 140;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw 3 flowing harmonic sine layers (Gold, Champagne, Cyan-amber)
      const layers = [
        { color: 'rgba(212, 175, 55, 0.85)', amp: isPlaying ? 35 : 18, freq: 0.015, speed: 0.035, lineWidth: 2 },
        { color: 'rgba(243, 229, 171, 0.55)', amp: isPlaying ? 25 : 12, freq: 0.022, speed: -0.025, lineWidth: 1.5 },
        { color: 'rgba(180, 140, 40, 0.35)', amp: isPlaying ? 42 : 22, freq: 0.009, speed: 0.018, lineWidth: 1 }
      ];

      layers.forEach((layer) => {
        ctx.beginPath();
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.lineWidth;

        for (let x = 0; x < width; x += 3) {
          const mouseInfluence = Math.sin((x / width) * Math.PI) * (mouseRef.current.y * 12);
          const y =
            centerY +
            Math.sin(x * layer.freq + phase * layer.speed * 60) * (layer.amp + mouseInfluence) *
              Math.sin((x / width) * Math.PI); // Envelope to taper ends

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Frequency nodes / glowing particles along the peak
      const numDots = isPlaying ? 8 : 4;
      for (let i = 0; i < numDots; i++) {
        const dotX = (width / (numDots + 1)) * (i + 1);
        const dotY =
          centerY +
          Math.sin(dotX * 0.015 + phase * 2) * (isPlaying ? 35 : 18) * Math.sin((dotX / width) * Math.PI);

        ctx.beginPath();
        ctx.arc(dotX, dotY, isPlaying ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = '#f3e5ab';
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = isPlaying ? 16 : 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      phase += 0.02;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-r from-[#0a0e17]/90 via-[#0d121d]/95 to-[#0a0e17]/90 border border-[#d4af37]/25 p-4 sm:p-5 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Subtle top indicator */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-ping" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#f3e5ab] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Acoustique Broadcast · Monitoring Live</span>
          </span>
        </div>

        {/* Interactive sound button */}
        <button
          onClick={toggleAudio}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            isPlaying
              ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30 scale-105'
              : 'bg-[#151c2a] hover:bg-[#1f283a] text-white border border-[#273248]'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Couper l'ambiance son</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Tester l'ambiance sonore Kwan</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Wave Canvas */}
      <div className="relative w-full h-[85px] sm:h-[100px] flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0a0e17] via-transparent to-[#0a0e17] opacity-60" />
      </div>

      {/* Bottom specs metadata */}
      <div className="grid grid-cols-3 text-center border-t border-[#182132] pt-3 mt-1 text-[11px] text-[#8697ae]">
        <div>
          <span className="text-white font-semibold">20 Hz – 20 kHz</span>
          <span className="block text-[10px] text-[#637286]">Réponse Linéaire</span>
        </div>
        <div className="border-x border-[#182132]">
          <span className="text-[#f3e5ab] font-semibold">Insonorisation R-60</span>
          <span className="block text-[10px] text-[#637286]">Isolation Totale</span>
        </div>
        <div>
          <span className="text-[#4ade80] font-semibold">0.001% THD+N</span>
          <span className="block text-[10px] text-[#637286]">Préamplis Broadcast</span>
        </div>
      </div>
    </div>
  );
};
