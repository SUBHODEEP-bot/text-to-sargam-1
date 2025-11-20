import { ConversionStep } from "@/lib/audioConverter";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface MobileConversionDisplayProps {
  steps: ConversionStep[];
  currentIndex: number;
}

export function MobileConversionDisplay({ steps, currentIndex }: MobileConversionDisplayProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (steps.length === 0) return null;

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
    <div className="w-full space-y-3">
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-3">
        Conversion Details
      </h3>
      <div className="space-y-2">
        {steps.map((step, charIndex) => {
          const isExpanded = expandedIndex === charIndex;
          const isActive = charIndex === activeChar;

          return (
            <Card
              key={charIndex}
              className={`transition-all duration-300 overflow-hidden ${
                isActive
                  ? "ring-2 ring-primary shadow-glow"
                  : ""
              }`}
            >
              {/* Header - Always visible */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : charIndex)}
                className="w-full p-3 md:p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-xl md:text-2xl font-bold text-primary">
                    '{step.char}'
                  </span>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    ASCII: <span className="font-mono font-semibold text-foreground">{step.ascii}</span>
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Sargam Notes - Always visible */}
              <div className="px-3 md:px-4 pb-3">
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {step.notes.map((note, i) => (
                    <span
                      key={i}
                      className={`font-semibold text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded transition-all duration-300 ${
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

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-3 md:px-4 pb-3 space-y-2 md:space-y-3 border-t">
                  <div className="pt-3 space-y-1">
                    <div className="text-xs text-muted-foreground">Binary</div>
                    <div className="font-mono text-xs md:text-sm font-semibold text-foreground bg-muted px-2 md:px-3 py-1.5 md:py-2 rounded break-all">
                      {step.binary}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">3-bit Groups</div>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {step.groups.map((group, i) => (
                        <span
                          key={i}
                          className="font-mono text-xs md:text-sm font-semibold bg-secondary text-secondary-foreground px-2 md:px-3 py-1 rounded"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Decimal Values</div>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {step.decimals.map((decimal, i) => (
                        <span
                          key={i}
                          className="font-mono text-xs md:text-sm font-semibold bg-muted text-foreground px-2 md:px-3 py-1 rounded"
                        >
                          {decimal}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
