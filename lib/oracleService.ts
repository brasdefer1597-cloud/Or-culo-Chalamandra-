import { QUESTION_BANK } from './questionBank';
import type { ThinkingMethod } from './types';

const GEMINI_MODEL = 'gemini-1.5-flash';

/**
 * Los datos son como un río: hay que filtrarlos para que el agua llegue pura al estanque.
 */
export function parseQuestionLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
    .filter((line) => line.length >= 8 && line.includes('?'))
    .filter((line, index, arr) => arr.indexOf(line) === index)
    .slice(0, 6);
}

/**
 * Si el gran satélite (IA) falla, recurrimos a los tótems locales (Question Bank).
 */
export function makeFallbackQuestions(method: ThinkingMethod, context: string): string[] {
  const bank = QUESTION_BANK[method];
  if (!bank) return [`¿Cómo impacta ${context} en tu visión a largo plazo?`];

  const localQuestions = Object.values(bank)
    .flatMap((questions) => questions)
    .map((question) => question.replace('[contexto]', context));

  if (localQuestions.length) {
    // Mezclamos un poco para que no sea siempre lo mismo (pseudo-aleatorio táctico)
    return localQuestions.sort(() => Math.random() - 0.5).slice(0, 6);
  }

  return [
    `¿Cuál es el criterio de éxito para "${context}"?`,
    '¿Qué riesgo crítico no estás midiendo?',
    '¿Qué micro-acción en 72h validará tu decisión?'
  ];
}

/**
 * Conexión con la Red Chalamandra (Gemini).
 * El prompt ha sido refinado para alinearse con la identidad SRAP.
 */
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

  const systemPrompt = `Eres Chalamandra Magistral (Decodificadora Chola Malandra Fresa Salamandra).
Tu misión es aplicar la metodología SRAP (Sense, Track, Arrange, Project) para transformar dudas en claridad estratégica.
Usa un tono senior, directo, un poco místico/táctico pero extremadamente útil.
Entrega exactamente 6 preguntas de alto impacto basadas en el método ${method} y el contexto ${context}.
Evita introducciones, ve directo a las preguntas.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: `Situación actual: ${situation}. Necesito decodificación mediante ${method} en el marco de ${context}.` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        }
      }),
      signal
    }
  );

  if (!response.ok) {
    throw new Error(`GEMINI_CONNECTION_ERROR_${response.status}`);
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const parsed = parseQuestionLines(raw);

  if (!parsed.length) {
    throw new Error('EMPTY_DECODING');
  }

  return parsed;
}
