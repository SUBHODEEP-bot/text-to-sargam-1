import { useState, useCallback, useRef } from "react";
import { SargamNote } from "@/lib/audioConverter";

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const audioContextRef = useRef<AudioContext | null>(null);
  const stopFlagRef = useRef(false);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playNote = useCallback(
    (frequency: number, duration: number): Promise<void> => {
      return new Promise((resolve) => {
        if (frequency === 0) {
          // Rest: just wait
          setTimeout(resolve, duration);
          return;
        }

        const audioContext = initAudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        // Envelope for smooth attack and release
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Attack
        gainNode.gain.linearRampToValueAtTime(0.3, now + duration / 1000 - 0.05); // Sustain
        gainNode.gain.linearRampToValueAtTime(0, now + duration / 1000); // Release

        oscillator.start(now);
        oscillator.stop(now + duration / 1000);

        setTimeout(resolve, duration);
      });
    },
    [initAudioContext]
  );

  const playSequence = useCallback(
    async (sequence: SargamNote[], noteDuration: number = 300) => {
      setIsPlaying(true);
      stopFlagRef.current = false;

      for (let i = 0; i < sequence.length; i++) {
        if (stopFlagRef.current) break;

        setCurrentIndex(i);
        await playNote(sequence[i].frequency, noteDuration);
      }

      setIsPlaying(false);
      setCurrentIndex(-1);
    },
    [playNote]
  );

  const stop = useCallback(() => {
    stopFlagRef.current = true;
    setIsPlaying(false);
    setCurrentIndex(-1);
  }, []);

  return {
    isPlaying,
    currentIndex,
    playSequence,
    stop,
  };
}
