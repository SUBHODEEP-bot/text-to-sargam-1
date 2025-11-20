import { Music2, AudioLines, Radio } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingNotes() {
  const [notes, setNotes] = useState<Array<{ id: number; x: number; delay: number; icon: number }>>([]);

  useEffect(() => {
    const noteElements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      icon: Math.floor(Math.random() * 3),
    }));
    setNotes(noteElements);
  }, []);

  const icons = [Music2, AudioLines, Radio];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {notes.map((note) => {
        const Icon = icons[note.icon];
        return (
          <div
            key={note.id}
            className="absolute animate-float"
            style={{
              left: `${note.x}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${note.delay}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          >
            <Icon className="w-8 h-8 text-primary" />
          </div>
        );
      })}
    </div>
  );
}
