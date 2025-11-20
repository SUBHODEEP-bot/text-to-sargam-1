import { useEffect, useState, useRef } from "react";

interface EnhancedWaveVisualizerProps {
  isPlaying: boolean;
}

export function EnhancedWaveVisualizer({ isPlaying }: EnhancedWaveVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(50).fill(0));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(50).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((_, i) => {
          const wave = Math.sin((Date.now() + i * 100) / 200) * 50 + 50;
          return wave + Math.random() * 30;
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "hsl(220, 90%, 48%)");
      gradient.addColorStop(0.5, "hsl(200, 85%, 55%)");
      gradient.addColorStop(1, "hsl(180, 80%, 50%)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      ctx.beginPath();
      const centerY = canvas.height / 2;

      bars.forEach((height, i) => {
        const x = (i / bars.length) * canvas.width;
        const y = centerY + (height - 50) * (canvas.height / 200);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      if (isPlaying) {
        requestAnimationFrame(drawWave);
      }
    };

    drawWave();
  }, [bars, isPlaying]);

  return (
    <div className="relative w-full h-32 md:h-40">
      {/* Canvas wave */}
      <canvas
        ref={canvasRef}
        width={800}
        height={160}
        className="w-full h-full absolute inset-0"
      />

      {/* Bar visualizer overlay */}
      <div className="absolute inset-0 flex items-center justify-center gap-0.5 md:gap-1 px-2 md:px-4">
        {bars.map((height, i) => (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-75 ease-out bg-gradient-to-t from-primary via-accent-cyan to-accent-cyan-light opacity-60"
            style={{
              height: isPlaying ? `${Math.max(height, 10)}%` : "8%",
              maxHeight: "100%",
            }}
          />
        ))}
      </div>
    </div>
  );
}
