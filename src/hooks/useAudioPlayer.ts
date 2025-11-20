import { useState, useCallback, useRef } from "react";
import { SargamNote } from "@/lib/audioConverter";

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const audioContextRef = useRef<AudioContext | null>(null);
  const stopFlagRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);

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
        
        // Also connect to recording destination if recording
        if (recordingDestinationRef.current) {
          gainNode.connect(recordingDestinationRef.current);
        }

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
    async (sequence: SargamNote[], noteDuration: number = 300, recordAudio: boolean = false) => {
      setIsPlaying(true);
      stopFlagRef.current = false;

      // Start recording if requested
      if (recordAudio) {
        const audioContext = initAudioContext();
        const dest = audioContext.createMediaStreamDestination();
        recordingDestinationRef.current = dest;
        const mediaRecorder = new MediaRecorder(dest.stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.start();
      }

      for (let i = 0; i < sequence.length; i++) {
        if (stopFlagRef.current) break;

        setCurrentIndex(i);
        await playNote(sequence[i].frequency, noteDuration);
      }

      // Stop recording if it was started
      if (recordAudio && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        recordingDestinationRef.current = null;
      }

      setIsPlaying(false);
      setCurrentIndex(-1);
    },
    [playNote, initAudioContext]
  );

  const stop = useCallback(() => {
    stopFlagRef.current = true;
    setIsPlaying(false);
    setCurrentIndex(-1);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const getRecordedAudio = useCallback((): Blob | null => {
    if (audioChunksRef.current.length > 0) {
      return new Blob(audioChunksRef.current, { type: "audio/webm" });
    }
    return null;
  }, []);

  return {
    isPlaying,
    currentIndex,
    playSequence,
    stop,
    getRecordedAudio,
  };
}
