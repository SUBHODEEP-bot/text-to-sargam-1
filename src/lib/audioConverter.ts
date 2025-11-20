// Conversion logic: Text → ASCII → Binary → Sargam → Frequency

export interface ConversionStep {
  char: string;
  ascii: number;
  binary: string;
  groups: string[];
  decimals: number[];
  notes: string[];
}

export interface SargamNote {
  note: string;
  frequency: number;
}

// Sargam to Frequency mapping
export const SARGAM_FREQUENCIES: Record<string, number> = {
  Sa: 261,
  Re: 293,
  Ga: 329,
  Ma: 349,
  Pa: 392,
  Dha: 440,
  Ni: 493,
  Rest: 0, // No sound for value 7
};

// Decimal to Sargam note mapping
export const DECIMAL_TO_SARGAM: Record<number, string> = {
  0: "Sa",
  1: "Re",
  2: "Ga",
  3: "Ma",
  4: "Pa",
  5: "Dha",
  6: "Ni",
  7: "Rest",
};

export function textToSargam(text: string): ConversionStep[] {
  const steps: ConversionStep[] = [];

  for (const char of text) {
    // Step 1: Convert to ASCII
    const ascii = char.charCodeAt(0);

    // Step 2: Convert ASCII to 8-bit Binary
    const binary = ascii.toString(2).padStart(8, "0");

    // Step 3: Split into 3-bit groups (last group might be less than 3 bits)
    const groups: string[] = [];
    for (let i = 0; i < binary.length; i += 3) {
      groups.push(binary.slice(i, i + 3));
    }

    // Step 4: Convert each group to decimal
    const decimals = groups.map((group) => parseInt(group, 2));

    // Step 5: Map decimals to Sargam notes
    const notes = decimals.map((decimal) => DECIMAL_TO_SARGAM[decimal]);

    steps.push({
      char,
      ascii,
      binary,
      groups,
      decimals,
      notes,
    });
  }

  return steps;
}

export function stepsToAudioSequence(steps: ConversionStep[]): SargamNote[] {
  const sequence: SargamNote[] = [];

  for (const step of steps) {
    for (const note of step.notes) {
      sequence.push({
        note,
        frequency: SARGAM_FREQUENCIES[note],
      });
    }
  }

  return sequence;
}
