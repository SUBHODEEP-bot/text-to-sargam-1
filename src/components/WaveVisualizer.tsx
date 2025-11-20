import { useEffect, useState } from "react";

interface WaveVisualizerProps {
  isPlaying: boolean;
}

export function WaveVisualizer({ isPlaying }: WaveVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(40).fill(0));

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(40).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => Math.random() * 100)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex items-center justify-center gap-1 h-24 px-4">
      {bars.map((height, i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-100 ease-out"
          style={{
            height: `${height}%`,
            minHeight: isPlaying ? "10%" : "5%",
          }}
        />
      ))}
    </div>
  );
}
