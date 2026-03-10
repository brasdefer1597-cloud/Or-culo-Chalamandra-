import { QUESTION_BANK } from './questionBank';
import type { ThinkingMethod } from './types';

const GEMINI_MODEL = 'gemini-1.5-flash';

export function parseQuestionLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
    .filter((line) => line.length >= 8)
    .filter((line, index, arr) => arr.indexOf(line) === index)
    .slice(0, 7);
}

export function makeFallbackQuestions(method: ThinkingMethod, context: string): string[] {
  const bank = QUESTION_BANK[method];

  const localQuestions = Object.values(bank)
    .flatMap((questions) => questions)
    .map((question) => question.replace('[contexto]', context));

  if (localQuestions.length) {
    return localQuestions.slice(0, 6);
  }

  return [
    `¿Cuál es el criterio de éxito para "${context}"?`,
    '¿Qué riesgo crítico no estás midiendo?',
    '¿Qué micro-acción en 72h validará tu decisión?'
  ];
}

export async function fetchGeminiQuestions(params: {
  method: ThinkingMethod;
  context: string;
  situation: string;
  signal: AbortSignal;
}): Promise<string[]> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const { method, context, situation, signal } = params;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: 'Eres la Sabiduría de Chalamandra: guía estratégica, clara y accionable. Entrega solo preguntas de alto impacto.'
            }
          ]
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Método: ${method}\nContexto: ${context}\nSituación: ${situation}`
              }
            ]
          }
        ]
      }),
      signal
    }
  );

  if (!response.ok) {
    throw new Error(`GEMINI_${response.status}`);
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const parsed = parseQuestionLines(raw);

  if (!parsed.length) {
    throw new Error('EMPTY_RESPONSE');
  }

  return parsed;
}
