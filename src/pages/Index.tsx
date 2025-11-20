import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ConversionDisplay } from "@/components/ConversionDisplay";
import { WaveVisualizer } from "@/components/WaveVisualizer";
import { textToSargam, stepsToAudioSequence, ConversionStep } from "@/lib/audioConverter";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Music, Play, Square, Waves } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [conversionSteps, setConversionSteps] = useState<ConversionStep[]>([]);
  const { isPlaying, currentIndex, playSequence, stop } = useAudioPlayer();

  const handlePlay = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text first!");
      return;
    }

    const steps = textToSargam(inputText);
    setConversionSteps(steps);

    const sequence = stepsToAudioSequence(steps);
    playSequence(sequence, 300);

    toast.success(`Playing ${sequence.length} notes!`);
  };

  const handleStop = () => {
    stop();
    toast.info("Playback stopped");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-6 mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Music className="w-12 h-12 text-primary" />
              <Waves className="w-12 h-12 text-accent" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Sargam Sound Wave Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any text into musical Sargam notes through ASCII, binary conversion, and Web Audio API
            </p>
          </div>

          {/* Input Section */}
          <Card className="max-w-3xl mx-auto p-8 shadow-card">
            <div className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="textInput" className="text-sm font-semibold text-foreground">
                  Enter Your Text
                </label>
                <Input
                  id="textInput"
                  type="text"
                  placeholder="Type a name or word..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="text-lg h-14"
                  disabled={isPlaying}
                />
              </div>

              <div className="flex gap-3">
                {!isPlaying ? (
                  <Button
                    onClick={handlePlay}
                    size="lg"
                    className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Play Wave
                  </Button>
                ) : (
                  <Button
                    onClick={handleStop}
                    size="lg"
                    variant="destructive"
                    className="flex-1 h-14 text-lg font-semibold"
                  >
                    <Square className="mr-2 h-5 w-5" />
                    Stop
                  </Button>
                )}
              </div>

              {/* Wave Visualizer */}
              <Card className="bg-gradient-card border-0 overflow-hidden">
                <WaveVisualizer isPlaying={isPlaying} />
              </Card>
            </div>
          </Card>

          {/* Conversion Display */}
          {conversionSteps.length > 0 && (
            <div className="max-w-3xl mx-auto mt-12">
              <ConversionDisplay steps={conversionSteps} currentIndex={currentIndex} />
            </div>
          )}

          {/* Info Section */}
          <div className="max-w-3xl mx-auto mt-16">
            <Card className="p-8 bg-gradient-card border-0">
              <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <div>
                    <strong className="text-foreground">Text to ASCII:</strong> Each character is converted to its ASCII value
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <div>
                    <strong className="text-foreground">ASCII to Binary:</strong> The ASCII value becomes an 8-bit binary number
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <div>
                    <strong className="text-foreground">Binary Grouping:</strong> Split into 3-bit groups
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    4
                  </span>
                  <div>
                    <strong className="text-foreground">Decimal Conversion:</strong> Each group converts to 0-7
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    5
                  </span>
                  <div>
                    <strong className="text-foreground">Sargam Mapping:</strong> 0=Sa, 1=Re, 2=Ga, 3=Ma, 4=Pa, 5=Dha, 6=Ni, 7=Rest
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    6
                  </span>
                  <div>
                    <strong className="text-foreground">Audio Synthesis:</strong> Web Audio API generates sine waves at specific frequencies
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
