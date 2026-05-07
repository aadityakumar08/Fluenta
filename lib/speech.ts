export function createSpeechRecognition(): SpeechRecognition | null {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition;

  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;

  return recognition;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

export function getPreferredVoice(voiceNameHint: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();

  // Try to find voice matching hint
  let voice = voices.find(
    (v) => v.name.includes(voiceNameHint) && v.lang.startsWith('en')
  );

  // Fallback to any English Google voice
  if (!voice) {
    voice = voices.find((v) => v.lang.startsWith('en-US') && v.name.includes('Google'));
  }

  // Fallback to any English voice
  if (!voice) {
    voice = voices.find((v) => v.lang.startsWith('en'));
  }

  return voice || null;
}

export function createUtterance(
  text: string,
  config: { rate?: number; pitch?: number; voiceNameHint?: string } = {}
): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = config.rate ?? 1.0;
  utterance.pitch = config.pitch ?? 1.0;
  utterance.volume = 1.0;

  const voice = getPreferredVoice(config.voiceNameHint || 'Google US English');
  if (voice) {
    utterance.voice = voice;
  }

  return utterance;
}
