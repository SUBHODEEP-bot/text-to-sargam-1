import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MobileConversionDisplay } from "@/components/MobileConversionDisplay";
import { EnhancedWaveVisualizer } from "@/components/EnhancedWaveVisualizer";
import { FloatingNotes } from "@/components/FloatingNotes";
import { textToSargam, stepsToAudioSequence, ConversionStep } from "@/lib/audioConverter";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Music, Play, Square, Waves, Sparkles, Info } from "lucide-react";
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

    toast.success(`Playing ${sequence.length} notes!`, {
      icon: "🎵",
    });
  };

  const handleStop = () => {
    stop();
    toast.info("Playback stopped");
  };

  const quickFills = [
    { label: "Try: MUSIC", value: "MUSIC" },
    { label: "Try: HELLO", value: "HELLO" },
    { label: "Try: LOVE", value: "LOVE" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated Hero Section */}
      <div className="relative overflow-hidden">
        <FloatingNotes />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        
        <div className="relative container mx-auto px-4 py-8 md:py-16 max-w-6xl">
          {/* Header */}
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4 animate-float">
              <Music className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-accent-cyan" />
              <Waves className="w-10 h-10 md:w-12 md:h-12 text-accent" />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent gradient-animate px-4">
              Sargam Sound Wave
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Transform text into musical notes through ASCII magic ✨
            </p>
          </div>

          {/* Main Input Card */}
          <Card className="max-w-3xl mx-auto p-4 md:p-8 shadow-card backdrop-blur-sm bg-card/95 border-2 hover:shadow-glow transition-all duration-300">
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2 md:space-y-3">
                <label htmlFor="textInput" className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Enter Your Text
                </label>
                <Input
                  id="textInput"
                  type="text"
                  placeholder="Type a name or word..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="text-base md:text-lg h-12 md:h-14 border-2 focus:border-primary transition-all"
                  disabled={isPlaying}
                />
                
                {/* Quick fill buttons */}
                <div className="flex flex-wrap gap-2">
                  {quickFills.map((quick) => (
                    <Button
                      key={quick.value}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputText(quick.value)}
                      disabled={isPlaying}
                      className="text-xs md:text-sm hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      {quick.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                {!isPlaying ? (
                  <Button
                    onClick={handlePlay}
                    size="lg"
                    className="flex-1 h-12 md:h-14 text-base md:text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 hover:scale-105"
                  >
                    <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Play Wave
                  </Button>
                ) : (
                  <Button
                    onClick={handleStop}
                    size="lg"
                    variant="destructive"
                    className="flex-1 h-12 md:h-14 text-base md:text-lg font-semibold hover:scale-105 transition-all"
                  >
                    <Square className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Stop
                  </Button>
                )}
              </div>

              {/* Enhanced Wave Visualizer */}
              <Card className="bg-gradient-to-br from-card to-muted/30 border-2 border-primary/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-pulse-slow" />
                <div className="relative">
                  <EnhancedWaveVisualizer isPlaying={isPlaying} />
                </div>
              </Card>
            </div>
          </Card>

          {/* Conversion Display */}
          {conversionSteps.length > 0 && (
            <div className="max-w-3xl mx-auto mt-6 md:mt-12 animate-fade-in">
              <MobileConversionDisplay steps={conversionSteps} currentIndex={currentIndex} />
            </div>
          )}

          {/* Info Section */}
          <div className="max-w-3xl mx-auto mt-8 md:mt-16">
            <Card className="p-4 md:p-8 bg-gradient-to-br from-card to-muted/30 border-2 border-primary/10 backdrop-blur-sm">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                How It Works
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {[
                  { num: "1", title: "Text to ASCII", desc: "Characters → Numbers" },
                  { num: "2", title: "ASCII to Binary", desc: "Numbers → 8-bit Binary" },
                  { num: "3", title: "Binary Groups", desc: "Split into 3-bit chunks" },
                  { num: "4", title: "To Decimal", desc: "Groups → 0-7 values" },
                  { num: "5", title: "Sargam Mapping", desc: "Values → Musical notes" },
                  { num: "6", title: "Audio Synthesis", desc: "Notes → Sound waves" },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="flex gap-3 p-3 md:p-4 rounded-lg bg-gradient-to-br from-background to-muted/50 hover:shadow-card transition-all hover:scale-105 border border-border/50"
                  >
                    <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center font-bold text-sm md:text-base shadow-glow">
                      {step.num}
                    </span>
                    <div className="flex-1 min-w-0">
                      <strong className="text-foreground text-sm md:text-base block truncate">{step.title}</strong>
                      <span className="text-muted-foreground text-xs md:text-sm block truncate">{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs md:text-sm text-muted-foreground text-center">
                  <strong className="text-primary">Sargam Notes:</strong> Sa=261Hz, Re=293Hz, Ga=329Hz, Ma=349Hz, Pa=392Hz, Dha=440Hz, Ni=493Hz
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
