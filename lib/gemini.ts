const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key || key === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY not configured');
  }
  return key;
}

async function callGemini(
  messages: GeminiMessage[],
  systemPrompt: string,
  maxTokens: number = 150,
  temperature: number = 0.9,
  retries: number = 3
): Promise<string> {
  const apiKey = getApiKey();
  const url = `${GEMINI_API_BASE}/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: messages,
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
    },
  };

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error (${response.status}):`, errorText);
        if (attempt < retries - 1) {
          await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
          continue;
        }
        throw new Error(`Gemini API failed: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'I didn\'t catch that. Could you say it again?';
    } catch (error) {
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
        continue;
      }
      throw error;
    }
  }

  throw new Error('Max retries exceeded');
}

export async function generateConversationResponse(
  conversationHistory: { role: 'user' | 'ai'; text: string }[],
  systemPrompt: string
): Promise<string> {
  const messages: GeminiMessage[] = conversationHistory.map((turn) => ({
    role: turn.role === 'ai' ? 'model' : 'user',
    parts: [{ text: turn.text }],
  }));

  return callGemini(messages, systemPrompt, 150, 0.9);
}

export async function analyzeLevel(transcript: string): Promise<{
  level: string;
  strengths: string[];
  focusAreas: string[];
  recommendations: string[];
}> {
  const systemPrompt = `You are an expert English language assessor. Analyze the following speech transcript and evaluate the speaker's English level.
Return ONLY valid JSON (no markdown formatting, no code blocks) with this exact structure:
{
  "level": "B1",
  "strengths": ["strength1", "strength2", "strength3"],
  "focusAreas": ["area1", "area2", "area3"],
  "recommendations": ["rec1", "rec2", "rec3"]
}
Level must be one of: A1, A2, B1, B2, C1, C2
Evaluate: vocabulary range, sentence complexity, grammatical accuracy, natural fluency markers.`;

  const messages: GeminiMessage[] = [
    { role: 'user', parts: [{ text: `Please analyze this speech transcript:\n\n"${transcript}"` }] },
  ];

  const response = await callGemini(messages, systemPrompt, 300, 0.3);

  try {
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      level: 'B1',
      strengths: ['Good attempt at communication', 'Willing to speak', 'Clear pronunciation'],
      focusAreas: ['Grammar accuracy', 'Vocabulary expansion', 'Sentence structure'],
      recommendations: [
        'Practice with the Friend persona for comfortable conversation',
        'Focus on using complete sentences',
        'Try the Travel Guide persona for practical vocabulary',
      ],
    };
  }
}

export async function analyzeSession(
  transcript: { role: string; text: string }[],
  personaName: string
): Promise<Record<string, unknown>> {
  const userTexts = transcript
    .filter((t) => t.role === 'user')
    .map((t) => t.text)
    .join('\n');

  const systemPrompt = `You are an expert English language coach. Analyze this conversation transcript and provide detailed feedback.
Return ONLY valid JSON (no markdown, no code blocks) with this structure:
{
  "overallScore": 75,
  "fluencyScore": 70,
  "confidenceScore": 80,
  "grammarScore": 65,
  "vocabLevel": "B1",
  "hesitationCount": 3,
  "fillerCount": 5,
  "fillerWords": {"um": 3, "like": 2},
  "grammarFixes": [
    {"original": "I go yesterday", "corrected": "I went yesterday", "explanation": "Use past tense for completed actions"}
  ],
  "vocabUpgrades": [
    {"basic": "good", "upgraded": "excellent", "context": "Describing quality"}
  ],
  "recommendations": [
    {"title": "Practice Past Tense", "description": "Focus on irregular past tense verbs"}
  ]
}`;

  const messages: GeminiMessage[] = [
    {
      role: 'user',
      parts: [
        {
          text: `Analyze this student's English from a conversation with ${personaName}:\n\n${userTexts}`,
        },
      ],
    },
  ];

  const response = await callGemini(messages, systemPrompt, 800, 0.3);

  try {
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      overallScore: 70,
      fluencyScore: 65,
      confidenceScore: 70,
      grammarScore: 60,
      vocabLevel: 'B1',
      hesitationCount: 2,
      fillerCount: 3,
      fillerWords: { um: 2, like: 1 },
      grammarFixes: [],
      vocabUpgrades: [],
      recommendations: [
        { title: 'Keep Practicing', description: 'Regular conversation practice will improve fluency' },
      ],
    };
  }
}
