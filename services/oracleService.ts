import { QUESTION_BANK } from '@/lib/data/questionBank';
import { ThinkingMethod } from '@/types';

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
    return localQuestions.sort(() => Math.random() - 0.5).slice(0, 6);
  }

  return [
    `¿Cuál es el criterio de éxito para "${context}"?`,
    '¿Qué riesgo crítico no estás midiendo?',
    '¿Qué micro-acción en 72h validará tu decisión?'
  ];
}

/**
 * Decodificación Magistral vía API de Servidor (Proxy).
 * Sintonizando la frecuencia SRAP protegiendo las credenciales.
 */
export async function fetchOracleDecoding(params: {
  method: ThinkingMethod;
  context: string;
  situation: string;
  signal: AbortSignal;
}): Promise<string[]> {
  const { method, context, situation, signal } = params;

  const response = await fetch('/api/decode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, context, situation }),
    signal
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API_ERROR_${response.status}`);
  }

  const data = await response.json();
  return data.questions;
}
