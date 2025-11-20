import { ConversionStep } from "@/lib/audioConverter";
import { Card } from "@/components/ui/card";

interface ConversionDisplayProps {
  steps: ConversionStep[];
  currentIndex: number;
}

export function ConversionDisplay({ steps, currentIndex }: ConversionDisplayProps) {
  if (steps.length === 0) return null;

  // Calculate which note is currently playing across all characters
  let globalIndex = 0;
  let activeChar = -1;
  let activeNote = -1;

  for (let i = 0; i < steps.length; i++) {
    for (let j = 0; j < steps[i].notes.length; j++) {
      if (globalIndex === currentIndex) {
        activeChar = i;
        activeNote = j;
      }
      globalIndex++;
    }
  }

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Conversion Details</h3>
      <div className="space-y-3">
        {steps.map((step, charIndex) => (
          <Card
            key={charIndex}
            className={`p-4 transition-all duration-300 ${
              charIndex === activeChar
                ? "ring-2 ring-primary shadow-glow scale-[1.02]"
                : "hover:shadow-card"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-primary">'{step.char}'</span>
                <span className="text-sm text-muted-foreground">
                  ASCII: <span className="font-mono font-semibold text-foreground">{step.ascii}</span>
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Binary</div>
                <div className="font-mono text-sm font-semibold text-foreground bg-muted px-3 py-2 rounded">
                  {step.binary}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">3-bit Groups</div>
                <div className="flex flex-wrap gap-2">
                  {step.groups.map((group, i) => (
                    <span
                      key={i}
                      className="font-mono text-sm font-semibold bg-secondary text-secondary-foreground px-3 py-1 rounded"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Decimal Values</div>
                <div className="flex flex-wrap gap-2">
                  {step.decimals.map((decimal, i) => (
                    <span
                      key={i}
                      className="font-mono text-sm font-semibold bg-muted text-foreground px-3 py-1 rounded"
                    >
                      {decimal}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Sargam Notes</div>
                <div className="flex flex-wrap gap-2">
                  {step.notes.map((note, i) => (
                    <span
                      key={i}
                      className={`font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
                        charIndex === activeChar && i === activeNote
                          ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow scale-110 animate-pulse"
                          : note === "Rest"
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
