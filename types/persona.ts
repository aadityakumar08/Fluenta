export interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  systemPrompt: string;
  voiceConfig: {
    rate: number;
    pitch: number;
    voiceNameHint: string;
  };
  topicSeeds: string[];
  difficultyModifier: number;
  color: string;
}
