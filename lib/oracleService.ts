import { QUESTION_BANK } from './questionBank';
import type { ThinkingMethod } from './types';

/**
 * Parsea un string con preguntas separadas por saltos de línea a un array de strings.
 */
export function parseQuestionLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
    .filter((line) => line.length >= 8)
    .filter((line, index, arr) => arr.indexOf(line) === index)
    .slice(0, 7);
}

/**
 * Genera preguntas de respaldo locales como fallback si la API falla.
 */
export function makeFallbackQuestions(method: ThinkingMethod, context: string): string[] {
  const bank = QUESTION_BANK[method];

  const localQuestions = Object.values(bank)
    .flatMap((questions) => questions)
    .map((question) => question.replace('[contexto]', context));

  if (localQuestions.length) {
    return localQuestions.slice(0, 6);
  }

  // Fallback de último recurso si todo lo demás falla.
  return [
    `¿Cuál es el criterio de éxito para "${context}"?`,
    '¿Qué riesgo crítico no estás midiendo?',
    '¿Qué micro-acción en 72h validará tu decisión?'
  ];
}
